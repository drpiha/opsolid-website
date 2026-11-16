import "@/app/globals.css";

/** App surface: loads the app stylesheet (Tailwind, app tokens, v4 classes), which marketing pages do not load. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
