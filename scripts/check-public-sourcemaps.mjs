import { readdir } from "node:fs/promises";
import path from "node:path";

// Both roots are copied into the production image and served publicly.
// Fail the build rather than silently publish a map added by any plugin.
const roots = [".next/static", "public"];
const maps = [];

async function checkDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`Cannot verify public build symlink: ${file}`);
    }
    if (entry.isDirectory()) await checkDirectory(file);
    else if (/\.map$/i.test(entry.name)) maps.push(file);
  }
}

for (const root of roots) await checkDirectory(root);
if (maps.length) {
  console.error(`Public source-map check failed: ${maps.length} file(s).`);
  for (const file of maps.slice(0, 10)) console.error(file);
  process.exitCode = 1;
} else {
  console.log("Public source-map check passed: no maps in .next/static or public.");
}
