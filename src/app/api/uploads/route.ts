import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";

export const runtime = "nodejs";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/svg+xml"]);

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") ?? "asset");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }
  if (!["photo", "logo"].includes(kind)) {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/svg+xml"
      ? "svg"
      : "jpg";
  const dirName = randomBytes(8).toString("hex");
  const fileName = `${kind}-${Date.now()}.${ext}`;
  const relPath = `/uploads/cards/${dirName}/${fileName}`;
  const absDir = join(process.cwd(), "public", "uploads", "cards", dirName);
  const absPath = join(absDir, fileName);

  await mkdir(absDir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(absPath, buf);

  return NextResponse.json({ path: relPath });
}
