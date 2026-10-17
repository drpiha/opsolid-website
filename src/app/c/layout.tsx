import { ContentProvider } from "@/context/ContentProvider";

/** Public card pages live outside [locale]; they render with the default locale's content. */
export default function CardsLayout({ children }: { children: React.ReactNode }) {
  return <ContentProvider>{children}</ContentProvider>;
}
