// =============================================================================
// Short-code generation for /l/<code> short links.
//
// Codes are short, base32-ish lower-case (no vowels to avoid accidental words,
// no easily-confused chars like 0/O 1/l). 6 chars = 32^6 ≈ 1B combinations,
// plenty of room before random collisions become a concern.
// =============================================================================

import { prisma } from "@/lib/prisma";

const ALPHABET = "23456789bcdfghjkmnpqrstvwxyz"; // 28 chars: digits + consonants
const DEFAULT_LENGTH = 6;
const MAX_RETRIES = 8;

function randomCode(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

export function isValidCode(code: string): boolean {
  return /^[a-z0-9-]{3,64}$/.test(code);
}

/**
 * Reserve a short-code for a CardLink. If `desired` is provided (e.g. owner
 * wants `hsn-messe2026`), validate + use it; otherwise generate a random code
 * with collision retry.
 */
export async function reserveShortCode(desired?: string): Promise<string> {
  if (desired) {
    const cleaned = desired
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 64);
    if (!isValidCode(cleaned)) {
      throw new Error("Ungültiger Code. 3–64 Zeichen, nur a-z 0-9 - erlaubt.");
    }
    const taken = await prisma.cardLink.findUnique({ where: { code: cleaned } });
    if (taken) throw new Error("Dieser Code ist bereits vergeben.");
    return cleaned;
  }

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const candidate = randomCode(DEFAULT_LENGTH);
    const taken = await prisma.cardLink.findUnique({ where: { code: candidate } });
    if (!taken) return candidate;
  }
  throw new Error("Konnte keinen freien Code generieren.");
}
