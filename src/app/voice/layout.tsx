import "@/styles/legacy.css";

/** Legacy surface: loads the legacy stylesheet bundle that v4 marketing routes skip. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
