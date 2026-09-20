import type { Locale } from "@/lib/i18n";

export type OpsoPhysicalCardContent = {
  status: string;
  title: string;
  intro: string;
  points: [string, string, string];
  priceLabel: string;
  price: string;
  priceDetail: string;
  priceNote: string;
  cta: string;
  imageAlt: string;
  conceptNote: string;
};

const en: OpsoPhysicalCardContent = {
  status: "Physical NFC card · Coming soon",
  title: "A considered way to share OpSo in person",
  intro:
    "The planned matte-black card will open your OpSo profile with a tap. A printed QR code is intended as a fallback, so the same profile remains easy to reach on compatible phones without installing an app.",
  points: [
    "Matte-black, standard-size card",
    "NFC tap with printed QR fallback",
    "Separate one-time purchase, not a subscription",
  ],
  priceLabel: "Planned launch price",
  price: "€24.90",
  priceDetail: "including VAT · shipping charged separately",
  priceNote:
    "The final price, print finish and availability will be confirmed after the production trial. Orders are not open yet.",
  cta: "Ask about the NFC card",
  imageAlt: "Concept image of a matte-black OpSo NFC business card",
  conceptNote:
    "Design concept. The final card, print details and packaging may differ.",
};

const de: OpsoPhysicalCardContent = {
  status: "Physische NFC-Karte · Demnächst",
  title: "OpSo im persönlichen Gespräch stilvoll teilen",
  intro:
    "Die geplante mattschwarze Karte öffnet Ihr OpSo-Profil per Berührung. Ein gedruckter QR-Code ist als Alternative vorgesehen. So bleibt dasselbe Profil auf kompatiblen Smartphones ohne App-Installation erreichbar.",
  points: [
    "Mattschwarze Karte im Standardformat",
    "NFC-Berührung mit gedrucktem QR-Code als Alternative",
    "Separater Einmalkauf, kein Abonnement",
  ],
  priceLabel: "Geplanter Einführungspreis",
  price: "24,90 €",
  priceDetail: "inklusive MwSt. · Versand wird separat berechnet",
  priceNote:
    "Der endgültige Preis, die Druckausführung und die Verfügbarkeit werden nach dem Produktionstest bestätigt. Bestellungen sind noch nicht möglich.",
  cta: "NFC-Karte anfragen",
  imageAlt: "Konzeptbild einer mattschwarzen OpSo-NFC-Visitenkarte",
  conceptNote:
    "Designkonzept. Die endgültige Karte, Druckdetails und Verpackung können abweichen.",
};

const tr: OpsoPhysicalCardContent = {
  status: "Fiziksel NFC kart · Yakında",
  title: "OpSo’yu yüz yüze paylaşmanın özenli yolu",
  intro:
    "Planlanan mat siyah kart, tek dokunuşla OpSo profilinizi açacak. Basılı karekodun alternatif olarak kullanılması planlanıyor. Böylece aynı profil, uyumlu telefonlarda uygulama yüklemeden kolayca açılabilecek.",
  points: [
    "Standart ölçülerde mat siyah kart",
    "NFC dokunuşu ve alternatif basılı karekod",
    "Abonelikten ayrı, tek seferlik satın alma",
  ],
  priceLabel: "Planlanan tanıtım fiyatı",
  price: "24,90 €",
  priceDetail: "KDV dahil · kargo ayrıca ücretlendirilir",
  priceNote:
    "Nihai fiyat, baskı özellikleri ve satış tarihi üretim denemesinden sonra kesinleşecek. Siparişler henüz açılmadı.",
  cta: "NFC kart hakkında bilgi alın",
  imageAlt: "Mat siyah OpSo NFC kartvizit konsept görseli",
  conceptNote:
    "Tasarım konseptidir. Nihai kart, baskı ayrıntıları ve ambalaj farklılık gösterebilir.",
};

export function getOpsoPhysicalCardContent(
  locale: Locale,
): OpsoPhysicalCardContent {
  return locale === "de" ? de : locale === "tr" ? tr : en;
}
