import type { L3 } from "./types";

/**
 * Hero scene: every tap or click opens the next offering at that point. The texts are short benefit lines;
 * the prices named here are the published ones (CLAUDE.md, "Published offers and prices").
 */
export type SceneItem = { n: string; t: string; p: string; href: string };
export type SceneUi = {
  label: string;
  hint: string;
  next: string;
  opened: string;
  explore: string;
  close: string;
  more: string;
  pause: string;
  play: string;
};

export const SCENE_ITEMS: Record<L3, SceneItem[]> = {
  de: [
    { n: "01", t: "KI-Agenten", p: "Anrufe und Chats beantwortet, auch wenn Ihr Team im Termin ist.", href: "/agents" },
    { n: "02", t: "Websites", p: "Schnell, klar, gepflegt. Im Abo ab 99 € im Monat.", href: "/websites" },
    { n: "03", t: "Prozessautomatisierung", p: "Daten nur noch einmal eintippen. Der Rest läuft automatisch.", href: "/prozessautomatisierung" },
    { n: "04", t: "Microsoft 365", p: "Mehr aus den Lizenzen, die Sie schon bezahlen.", href: "/microsoft-365-automatisierung" },
    { n: "05", t: "Interne Tools", p: "Aus der Excel-Liste wird ein Werkzeug mit Rechten und Verlauf.", href: "/interne-tools" },
    { n: "06", t: "KI-Check", p: "In 90 Minuten klar, was sich lohnt. Ab 490 €.", href: "/ai-automation-check" },
    { n: "07", t: "KI-Schulungen", p: "Ihr Team arbeitet sicher mit KI, geübt an echten Aufgaben.", href: "/ki-schulungen" },
    { n: "08", t: "OpSo", p: "Die digitale Visitenkarte: ein Link, NFC und QR, immer aktuell.", href: "/opso" },
  ],
  en: [
    { n: "01", t: "AI agents", p: "Calls and chats answered, even while your team is with a customer.", href: "/agents" },
    { n: "02", t: "Websites", p: "Fast, clear, looked after. On subscription from €99 a month.", href: "/websites" },
    { n: "03", t: "Process automation", p: "Type data in once. The rest runs on its own.", href: "/prozessautomatisierung" },
    { n: "04", t: "Microsoft 365", p: "More from the licences you already pay for.", href: "/microsoft-365-automatisierung" },
    { n: "05", t: "Internal tools", p: "The shared spreadsheet becomes a tool with roles and history.", href: "/interne-tools" },
    { n: "06", t: "AI Check", p: "In 90 minutes you know what pays off. From €490.", href: "/ai-automation-check" },
    { n: "07", t: "AI training", p: "Your team works safely with AI, practised on real tasks.", href: "/ki-schulungen" },
    { n: "08", t: "OpSo", p: "The digital business card: one link, NFC and QR, always current.", href: "/opso" },
  ],
  tr: [
    { n: "01", t: "YZ asistanları", p: "Ekibiniz müşteriyle meşgulken bile aramalar ve mesajlar yanıtlanır.", href: "/agents" },
    { n: "02", t: "Web siteleri", p: "Hızlı, sade, bakımı bizden. Abonelikle aylık 99 €'dan başlayan fiyatlarla.", href: "/websites" },
    { n: "03", t: "Süreç otomasyonu", p: "Veriyi bir kez girin. Gerisi kendiliğinden ilerler.", href: "/prozessautomatisierung" },
    { n: "04", t: "Microsoft 365", p: "Zaten ödediğiniz lisanslardan daha fazlası.", href: "/microsoft-365-automatisierung" },
    { n: "05", t: "Şirket içi araçlar", p: "Ortak Excel listesi, yetkileri ve geçmişi olan bir araca dönüşür.", href: "/interne-tools" },
    { n: "06", t: "YZ Kontrolü", p: "90 dakikada neyin kazandıracağı netleşir. 490 €'dan başlayan fiyatlarla.", href: "/ai-automation-check" },
    { n: "07", t: "YZ eğitimleri", p: "Ekibiniz gerçek görevler üzerinde YZ ile güvenle çalışmayı öğrenir.", href: "/ki-schulungen" },
    { n: "08", t: "OpSo", p: "Dijital kartvizit: tek bağlantı, NFC ve QR, her zaman güncel.", href: "/opso" },
  ],
};

export const SCENE_UI: Record<L3, SceneUi> = {
  de: {
    label: "Interaktive Szene: Leistungen entdecken",
    hint: "Tippen oder klicken Sie irgendwo in die Szene.",
    next: "Weiter tippen für die nächste Leistung.",
    opened: "geöffnet",
    explore: "Szene erkunden",
    close: "Schließen",
    more: "Mehr erfahren",
    pause: "Hintergrundvideo anhalten",
    play: "Hintergrundvideo abspielen",
  },
  en: {
    label: "Interactive scene: discover our services",
    hint: "Tap or click anywhere in the scene.",
    next: "Tap again for the next service.",
    opened: "opened",
    explore: "Explore the scene",
    close: "Close",
    more: "Learn more",
    pause: "Pause background video",
    play: "Play background video",
  },
  tr: {
    label: "Etkileşimli sahne: hizmetleri keşfedin",
    hint: "Sahnede istediğiniz yere dokunun veya tıklayın.",
    next: "Sonraki hizmet için yeniden dokunun.",
    opened: "açıldı",
    explore: "Sahneyi keşfet",
    close: "Kapat",
    more: "Ayrıntılar",
    pause: "Arka plan videosunu durdur",
    play: "Arka plan videosunu oynat",
  },
};
