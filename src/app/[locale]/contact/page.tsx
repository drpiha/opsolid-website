import type { Metadata } from "next";
import { ContactPage } from "./ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with OpSolid. Book a free consultation to discuss how automation and operational systems can improve your business processes.",
  openGraph: {
    title: "Contact | OpSolid",
    description:
      "Book a free consultation to discuss how automation and operational systems can improve your business.",
  },
};

export default function Page() {
  return <ContactPage />;
}
