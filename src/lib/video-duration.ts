// =============================================================================
// Dependency-free video duration reader (server-side).
//
// The upload route accepts a narrow set of video containers (mp4 / quicktime =
// ISO base media file format, and webm = EBML/Matroska). ffmpeg/ffprobe is not
// installed in the runtime image, and pulling it in just to read a duration
// would bloat the container, so this parses the duration straight out of the
// container header bytes that are already in memory.
//
// Lenient by design: any container we cannot confidently parse returns null, so
// the caller falls back to the byte-size cap as the backstop (mirrors the
// client probe, which resolves 0 on error and lets the size limit win). It is
// only meant to catch the obvious "way over the limit" case, not to be a
// pixel-perfect media analyzer.
// =============================================================================

/**
 * Best-effort duration in seconds for a self-hosted card video, or null when the
 * container could not be parsed. `mime` selects the parser; unknown types -> null.
 */
export function readVideoDurationSeconds(
  buf: Buffer,
  mime: string,
): number | null {
  try {
    if (mime === "video/webm") return parseWebmDurationSec(buf);
    if (mime === "video/mp4" || mime === "video/quicktime") {
      return parseIsobmffDurationSec(buf);
    }
    return null;
  } catch {
    return null;
  }
}

// Sanity ceiling — anything above this is treated as a parse error rather than a
// real clip, so a misread never produces an absurd value that blocks a valid file.
const MAX_PLAUSIBLE_SEC = 24 * 60 * 60; // 24h

function plausible(sec: number): number | null {
  if (!Number.isFinite(sec) || sec <= 0 || sec > MAX_PLAUSIBLE_SEC) return null;
  return sec;
}

// -----------------------------------------------------------------------------
// ISO base media file format (mp4 / mov) — read timescale + duration from `mvhd`.
// -----------------------------------------------------------------------------
function parseIsobmffDurationSec(buf: Buffer): number | null {
  // The `moov`/`mvhd` boxes can sit at the start (faststart) or the end of the
  // file; since the whole buffer is in memory we just locate the `mvhd` tag.
  const tag = buf.indexOf("mvhd", 0, "latin1");
  if (tag < 0) return null;

  const version = buf[tag + 4];
  let timescale: number;
  let duration: number;

  if (version === 1) {
    // version(1) flags(3) creation(8) modification(8) timescale(4) duration(8)
    if (tag + 36 > buf.length) return null;
    timescale = buf.readUInt32BE(tag + 24);
    duration = Number(buf.readBigUInt64BE(tag + 28));
    // 0xFFFFFFFFFFFFFFFF is the "unknown duration" sentinel.
    if (duration >= Number.MAX_SAFE_INTEGER) return null;
  } else {
    // version(0) flags(3) creation(4) modification(4) timescale(4) duration(4)
    if (tag + 24 > buf.length) return null;
    timescale = buf.readUInt32BE(tag + 16);
    duration = buf.readUInt32BE(tag + 20);
    if (duration === 0xffffffff) return null; // unknown-duration sentinel
  }

  if (!timescale) return null;
  return plausible(duration / timescale);
}

// -----------------------------------------------------------------------------
// WebM / Matroska (EBML) — Segment > Info > {TimecodeScale, Duration}.
// -----------------------------------------------------------------------------
const ID_SEGMENT = 0x18538067;
const ID_INFO = 0x1549a966;
const ID_TIMECODESCALE = 0x2ad7b1;
const ID_DURATION = 0x4489;

function vintLength(firstByte: number): number {
  if (firstByte === 0) return 0; // invalid
  let mask = 0x80;
  let len = 1;
  while (!(firstByte & mask) && len <= 8) {
    mask >>= 1;
    len++;
  }
  return len;
}

/** Read an EBML element ID at pos, preserving the length-marker bits (raw). */
function readId(buf: Buffer, pos: number): { id: number; next: number } | null {
  if (pos >= buf.length) return null;
  const len = vintLength(buf[pos]);
  if (len === 0 || pos + len > buf.length) return null;
  return { id: buf.readUIntBE(pos, len), next: pos + len };
}

/** Read an EBML size (data length) at pos, stripping the length marker. */
function readSize(
  buf: Buffer,
  pos: number,
): { size: number | null; next: number } | null {
  if (pos >= buf.length) return null;
  const len = vintLength(buf[pos]);
  if (len === 0 || pos + len > buf.length) return null;
  let value = buf[pos] & (0xff >> len);
  let allOnes = value === (0xff >> len);
  for (let i = 1; i < len; i++) {
    const b = buf[pos + i];
    if (b !== 0xff) allOnes = false;
    value = value * 256 + b;
  }
  // All-ones means "unknown size" (streamed) — treat as unbounded to the parent.
  return { size: allOnes ? null : value, next: pos + len };
}

/** Find a child element by id within [start, end); returns its data range. */
function findChild(
  buf: Buffer,
  start: number,
  end: number,
  wantId: number,
): { dataStart: number; dataEnd: number } | null {
  let pos = start;
  while (pos < end) {
    const idRes = readId(buf, pos);
    if (!idRes) return null;
    const szRes = readSize(buf, idRes.next);
    if (!szRes) return null;
    const dataStart = szRes.next;
    const dataEnd =
      szRes.size == null ? end : Math.min(end, dataStart + szRes.size);
    if (idRes.id === wantId) return { dataStart, dataEnd };
    if (dataEnd <= pos) return null; // no forward progress — bail
    pos = dataEnd;
  }
  return null;
}

function parseWebmDurationSec(buf: Buffer): number | null {
  const segment = findChild(buf, 0, buf.length, ID_SEGMENT);
  if (!segment) return null;
  const info = findChild(buf, segment.dataStart, segment.dataEnd, ID_INFO);
  if (!info) return null;

  const durEl = findChild(buf, info.dataStart, info.dataEnd, ID_DURATION);
  if (!durEl) return null;
  const durLen = durEl.dataEnd - durEl.dataStart;
  let duration: number;
  if (durLen === 4) duration = buf.readFloatBE(durEl.dataStart);
  else if (durLen === 8) duration = buf.readDoubleBE(durEl.dataStart);
  else return null;

  // TimecodeScale defaults to 1,000,000 ns when absent.
  let timecodeScale = 1_000_000;
  const tsEl = findChild(buf, info.dataStart, info.dataEnd, ID_TIMECODESCALE);
  if (tsEl) {
    const tsLen = tsEl.dataEnd - tsEl.dataStart;
    if (tsLen > 0 && tsLen <= 8) {
      timecodeScale = buf.readUIntBE(tsEl.dataStart, tsLen);
    }
  }
  if (!timecodeScale) return null;

  return plausible((duration * timecodeScale) / 1e9);
}
