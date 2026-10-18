import { notFound } from "next/navigation";

// Unknown URLs under a locale (/de/gibt-es-nicht) render the localized v4 404
// inside the site layout instead of the bare root 404 (see isV4Path).
export default function UnknownPath() {
  notFound();
}
