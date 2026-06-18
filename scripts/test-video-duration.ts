// =============================================================================
// Sanity tests for src/lib/video-duration.ts (no test runner in this repo — run
// with `tsx scripts/test-video-duration.ts`). Builds synthetic container headers
// with known durations and asserts the parser reads them back.
// =============================================================================

import { readVideoDurationSeconds } from "../src/lib/video-duration";

let failures = 0;
function check(name: string, got: number | null, want: number | null) {
  const ok =
    want === null
      ? got === null
      : got !== null && Math.abs(got - want) < 0.01;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  (got=${got}, want=${want})`);
  if (!ok) failures++;
}

// --- ISOBMFF (mp4/mov): mvhd v0, timescale 600, duration 18000 => 30s ---------
function mvhdV0(timescale: number, duration: number): Buffer {
  const b = Buffer.alloc(24);
  b.write("mvhd", 0, "latin1");
  b[4] = 0; // version 0
  // flags(3) + creation(4) + modification(4) left as zero
  b.writeUInt32BE(timescale, 16);
  b.writeUInt32BE(duration, 20);
  // a little leading noise to prove indexOf-based location works
  return Buffer.concat([Buffer.from("\x00\x00\x00\x20ftypisom", "latin1"), b]);
}

// --- ISOBMFF: mvhd v1, 64-bit duration, timescale 90000, dur 2700000 => 30s ---
function mvhdV1(timescale: number, duration: bigint): Buffer {
  const b = Buffer.alloc(36);
  b.write("mvhd", 0, "latin1");
  b[4] = 1; // version 1
  b.writeUInt32BE(timescale, 24);
  b.writeBigUInt64BE(duration, 28);
  return b;
}

// --- WebM/EBML: Segment > Info > {TimecodeScale=1e6, Duration=30000ms} => 30s --
function ebmlElement(id: number[], data: Buffer): Buffer {
  if (data.length > 126) throw new Error("test helper only encodes short sizes");
  return Buffer.concat([Buffer.from(id), Buffer.from([0x80 | data.length]), data]);
}
function webm(durationMs: number, timecodeScale: number): Buffer {
  const dur = Buffer.alloc(4);
  dur.writeFloatBE(durationMs, 0);
  const tcs = Buffer.alloc(3);
  tcs.writeUIntBE(timecodeScale, 0, 3);
  const info = ebmlElement(
    [0x15, 0x49, 0xa9, 0x66],
    Buffer.concat([
      ebmlElement([0x2a, 0xd7, 0xb1], tcs),
      ebmlElement([0x44, 0x89], dur),
    ]),
  );
  return ebmlElement([0x18, 0x53, 0x80, 0x67], info);
}

check("mp4 mvhd v0 -> 30s", readVideoDurationSeconds(mvhdV0(600, 18000), "video/mp4"), 30);
check("mov mvhd v0 -> 12s", readVideoDurationSeconds(mvhdV0(1000, 12000), "video/quicktime"), 12);
check("mp4 mvhd v1 -> 30s", readVideoDurationSeconds(mvhdV1(90000, BigInt(2700000)), "video/mp4"), 30);
check("mp4 mvhd v0 -> 90s", readVideoDurationSeconds(mvhdV0(600, 54000), "video/mp4"), 90);
check("webm -> 30s", readVideoDurationSeconds(webm(30000, 1_000_000), "video/webm"), 30);
check("webm -> 75s", readVideoDurationSeconds(webm(75000, 1_000_000), "video/webm"), 75);

// --- Lenient null path: garbage / unknown mime / unknown-duration sentinel ----
check("garbage -> null", readVideoDurationSeconds(Buffer.from("not a video at all"), "video/mp4"), null);
check("unknown mime -> null", readVideoDurationSeconds(mvhdV0(600, 18000), "video/x-msvideo"), null);
check("mvhd v0 unknown-dur sentinel -> null", readVideoDurationSeconds(mvhdV0(600, 0xffffffff), "video/mp4"), null);

if (failures > 0) {
  console.error(`\n${failures} test(s) failed.`);
  process.exit(1);
}
console.log("\nAll video-duration tests passed.");
