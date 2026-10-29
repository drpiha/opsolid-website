/**
 * KI-Assistenten für Telefon und Chat (key "agenten", /ki-beratung/ki-agenten). One kind of automation that the
 * consulting delivers, not a product line. Scripted demo (ported from the v4 agents demo), no audio, no provider.
 * No price is published ("Preis nach dem KI-Check, schriftlich"). German is the source; EN and TR are transcreations.
 */
import type { PageDef, PageSet } from "../types";

const de: PageDef = {
  key: "agenten",
  meta: {
    title: "KI-Assistenten für Telefon und Chat",
    description:
      "KI-Assistenten für Telefon und Chat nehmen Anfragen an, beantworten Standardfragen und übergeben an Ihr Team. Mit Datenschutzprüfung vor dem Start.",
  },
  crumbs: ["beratung"],
  crumb: "KI-Assistenten",
  hero: {
    eyebrow: "KI-Beratung · KI-Assistenten für Telefon und Chat",
    h1: ["Der KI-Assistent nimmt ab. ", "Ihr Team entscheidet", ""],
    lede: "Ein KI-Assistent für Telefon oder Chat nimmt wiederkehrende Anfragen an, beantwortet Standardfragen aus Ihren Unterlagen und übergibt an Ihr Team, sobald eine Person gefragt ist. Ob er zu Ihrem Ablauf passt, klären wir im KI-Check.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Szenario ansehen", to: "agenten", hash: "demo" },
    facts: ["Hinweis auf den KI-Assistenten zu Beginn jedes Gesprächs", "Datenschutzprüfung vor dem Start", "Pilot zum Festpreis, vorab schriftlich"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Skizze eines Ablaufs in vier Stationen: Eingang, Regeln, Entwurf, Mensch",
      caption: "Am Ende steht immer ein Mensch.",
      fig: "1.3",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "situationen",
      label: "Situationen",
      note: "Routine, die Ihr Team bindet.",
      h: "Wann ein Assistent sich lohnen kann",
      lede: "Wenn dieselben Anliegen immer wiederkehren und Ihr Team dafür seine Arbeit unterbricht.",
      items: [
        { h: "Anrufe außerhalb der Öffnungszeiten bleiben unbeantwortet", p: "Eine Anfrage, die niemand annimmt, geht leicht verloren." },
        { h: "Dieselben Fragen kommen jeden Tag", p: "Öffnungszeiten, Ablauf, Preise nach Liste: Die Antworten stehen längst irgendwo geschrieben." },
        { h: "Das Team wird beim Arbeiten unterbrochen", p: "Jeder Anruf reißt jemanden aus dem, was gerade Vorrang hat." },
        { h: "Anfragen im Chat landen unsortiert im Postfach", p: "Es fehlen Angaben, und jemand muss nachfragen." },
      ],
    },
    {
      t: "demo",
      id: "demo",
      label: "Szenario",
      h: "So kann ein Anruf ablaufen",
      lede: "Ein Terminwunsch vom ersten Satz bis zur Bestätigung. Der Assistent sagt zu Beginn, dass ein KI-System spricht, schlägt Zeiten vor und trägt den Termin ein.",
      chip: "Demo · Szenario, ohne Ton",
      disclaimer: "Ein gespielter Ablauf, kein Live-Gespräch.",
      play: "Szenario abspielen",
      again: "Noch einmal abspielen",
      sr: "Beispielgespräch. KI-Assistent: Guten Tag, Sie sprechen mit einem KI-Assistenten. Wie kann ich Ihnen helfen? Anrufer: Ich möchte einen Termin für nächste Woche vereinbaren. KI-Assistent: Gern. Passt Ihnen Mittwoch um 10 Uhr oder Donnerstag um 14 Uhr? Anrufer: Donnerstag passt. KI-Assistent: Dann trage ich Donnerstag, 14 Uhr, ein. Sie erhalten eine Bestätigung per E-Mail.",
      script: [
        { who: "KI-Assistent", agent: true, text: "Guten Tag, Sie sprechen mit einem KI-Assistenten. Wie kann ich Ihnen helfen?", ms: 3400 },
        { who: "Anrufer", agent: false, text: "Ich möchte einen Termin für nächste Woche vereinbaren.", ms: 3000 },
        { who: "KI-Assistent", agent: true, text: "Gern. Passt Ihnen Mittwoch um 10 Uhr oder Donnerstag um 14 Uhr?", ms: 3600 },
        { who: "Anrufer", agent: false, text: "Donnerstag passt.", ms: 1400 },
        { who: "KI-Assistent", agent: true, text: "Dann trage ich Donnerstag, 14 Uhr, ein. Sie erhalten eine Bestätigung per E-Mail.", ms: 4200 },
      ],
    },
    {
      t: "rows",
      id: "aufgaben",
      label: "Aufgaben",
      note: "Routine ja, Urteilskraft nein.",
      h: "Was ein Assistent übernimmt und was nicht",
      lede: "Routine mit klaren Regeln übernimmt er. Was Urteilskraft braucht, geht an Ihr Team.",
      items: [
        { h: "Anfragen annehmen", p: "Anliegen am Telefon oder im Chat aufnehmen und strukturiert an Ihr Team oder in Ihr System weitergeben." },
        { h: "Termine abstimmen", p: "Freie Zeiten aus Ihrem Kalender vorschlagen, den Termin eintragen und eine Bestätigung senden." },
        { h: "Standardfragen beantworten", p: "Leistungen, Abläufe und Zeiten erklären, auf Basis Ihrer eigenen Unterlagen. Kennt er die Antwort nicht, sagt er das und übergibt." },
        { h: "An Menschen übergeben", p: "Bei Beschwerden, Sonderfällen und Unsicherheit geht das Gespräch an eine Person Ihres Teams, ebenso, wenn Anrufende lieber mit einem Menschen sprechen." },
      ],
    },
    {
      t: "principles",
      id: "grundsaetze",
      label: "Grundsätze",
      note: "Feste Regeln für jedes Gespräch.",
      h: "Klare Regeln für jedes Gespräch",
      items: [
        {
          h: "Offen als KI-Assistent",
          p: "Anrufende und Chat-Nutzende erfahren zu Beginn, dass sie mit einem KI-Assistenten sprechen. Das folgt dem Transparenzgedanken von Art. 50 der KI-Verordnung. Das ist keine Rechtsberatung.",
        },
        { h: "Keine Stimmenklone", p: "Wir klonen keine Stimmen, auch nicht die Ihrer Mitarbeitenden." },
        { h: "Keine Video-Agenten", p: "Wir bauen keine Avatare. Der Assistent hat weder Gesicht noch Figur." },
        {
          h: "Datenschutzprüfung vor dem Start",
          p: "Bevor ein Assistent live geht, prüfen wir den Datenschutz mit Ihnen. Die abschließende Bewertung trifft Ihr Datenschutzbeauftragter.",
        },
      ],
    },
    {
      t: "process",
      id: "vorgehen",
      label: "Vorgehen",
      note: "Vier Schritte, nach jedem entscheiden Sie.",
      h: "In vier Schritten zum eigenen Assistenten",
      lede: "Wir legen zuerst Aufgaben, Grenzen und Datenschutz fest und bauen erst danach.",
      cta: { label: "Den KI-Check ansehen", to: "check" },
      steps: [
        {
          name: "Klären",
          h: "Aufgaben und Grenzen",
          p: "Im KI-Check klären wir, ob ein Assistent zu Ihrem Ablauf passt, was er beantworten soll und was er nicht entscheiden darf.",
          result: "Ein schriftlicher Kurzbericht mit Aufgaben, Grenzen und dem Punkt, an dem übergeben wird.",
          meta: "KI-Check ab 990 € netto",
        },
        {
          name: "Datenschutz",
          h: "Vor dem Start prüfen",
          p: "Anbieter, Speicherort, Aufbewahrung und Zugriff legen wir fest und klären die nötigen Verträge (AVV).",
          result: "Dokumentierte Festlegungen, bevor etwas live geht.",
        },
        {
          name: "Pilot",
          h: "Bauen und anbinden",
          p: "Wir gestalten den Dialog und binden Kalender, CRM oder Postfach an. Umfang und Festpreis stehen vorab schriftlich fest.",
          result: "Ein Assistent für einen Kanal, im Alltag getestet.",
          meta: "Pilot zum Festpreis, vorab schriftlich",
        },
        {
          name: "Betrieb und Ausbau",
          h: "Auswerten und nachschärfen",
          p: "Wir werten Gespräche aus, schärfen Antworten nach und begleiten den Assistenten im Alltag. Auf Wunsch übernimmt Ihr Team den Betrieb.",
          result: "Ein Assistent, der mit den Gesprächen besser wird.",
          meta: "monatlich nach Vereinbarung",
        },
      ],
    },
    {
      t: "spec",
      id: "umfang",
      label: "Umfang",
      h: "Was zu einem Assistenten gehört",
      lede: "Gebaut für einen klar umrissenen Zweck, nicht als Allzweck-Roboter.",
      rows: [
        ["Kanäle", "Telefon oder Chat auf Ihrer Website, je nach Ablauf."],
        ["Wissen", "Ihre eigenen Unterlagen: Leistungen, Öffnungszeiten, häufige Fragen."],
        ["Anbindung", "Kalender, CRM oder Postfach, damit Termine und Anliegen dort landen, wo Ihr Team arbeitet."],
        ["Übergabe", "An eine Person Ihres Teams, per Rückruf, Weiterleitung oder als Vorgang."],
        ["Preis", "KI-Check ab 990 € netto, danach Pilot zum Festpreis. Einen Listenpreis gibt es nicht."],
      ],
      footnote: "Alle Preise netto zzgl. USt., nur für Unternehmen.",
    },
  ],
  faq: {
    label: "Häufige Fragen",
    h: "Fragen zu KI-Assistenten",
    items: [
      {
        q: "Was kostet ein KI-Assistent?",
        a: "Einen Listenpreis gibt es nicht. Der Pilot hat einen Festpreis, den wir vorab schriftlich nennen; er hängt von Aufgaben, Anbindungen und Gesprächsaufkommen ab. Der KI-Check davor kostet ab 990 € netto (bei einem Folgeauftrag innerhalb von 60 Tagen rechnen wir den Betrag voll an), Betrieb und Ausbau danach rechnen wir monatlich nach Vereinbarung ab. Alle Preise netto zzgl. USt., nur für Unternehmen.",
      },
      {
        q: "Merken Anrufer, dass sie mit einer KI sprechen?",
        a: "Ja. Der Assistent weist zu Beginn darauf hin, dass ein KI-Assistent spricht. Im Chat steht der Hinweis von Anfang an sichtbar.",
      },
      {
        q: "Wer hört die Gespräche mit?",
        a: "Das legen wir vorab mit Ihnen fest: Anbieter, Speicherort, Aufbewahrung und Zugriff. Was gespeichert wird und wie lange, steht vor dem Start schriftlich fest.",
      },
      {
        q: "Ersetzt ein Assistent unser Team?",
        a: "Nein. Er nimmt Routine ab und übergibt, sobald eine Person gefragt ist.",
      },
      {
        q: "Wie starten wir?",
        a: "Mit einem kostenlosen, unverbindlichen Kennenlernen und dann mit dem KI-Check: 90 Minuten remote plus schriftlicher Kurzbericht, ab 990 € netto, mit NDA vor der Analyse. Den Bericht erhalten Sie auch ohne Empfehlung.",
      },
    ],
  },
  cta: {
    label: "KI-Check",
    h: "Prüfen, ob ein Assistent zu Ihrem Ablauf passt",
    p: "Im KI-Check (ab 990 € netto) klären wir, ob ein Assistent passt, bevor etwas gebaut wird.",
    primary: { label: "KI-Check anfragen", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Zur KI-Beratung", to: "beratung" },
  },
  schema: {
    service: {
      name: "KI-Assistenten für Telefon und Chat",
      serviceType: "KI-Assistenten",
      description:
        "KI-Assistenten für Telefon und Chat, die Anfragen annehmen, Standardfragen beantworten und an Menschen übergeben, mit Datenschutzprüfung vor dem Start.",
    },
  },
};

const en: PageDef = {
  key: "agenten",
  meta: {
    title: "AI assistants for phone and chat",
    description:
      "AI assistants for phone and chat take requests, answer standard questions and hand over to your team. With a data protection review before go-live.",
  },
  crumbs: ["beratung"],
  crumb: "AI assistants",
  hero: {
    eyebrow: "AI automation consulting · AI assistants for phone and chat",
    h1: ["The AI assistant picks up. ", "Your team decides", ""],
    lede: "An AI assistant for phone or chat takes recurring requests, answers standard questions from your own documents and hands over to your team as soon as a person is needed. Whether it fits your workflow, we clarify in the AI check.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "See the scenario", to: "agenten", hash: "demo" },
    facts: ["Callers are told it is an AI assistant at the start of every conversation", "Data protection review before go-live", "Pilot at a fixed price, in writing beforehand"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Sketch of a workflow in four stations: input, rules, draft, person",
      caption: "A person always has the last word.",
      fig: "1.3",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "situationen",
      label: "Situations",
      note: "Routine that ties up your team.",
      h: "When an assistant can pay off",
      lede: "When the same requests keep coming back and your team interrupts its work for them.",
      items: [
        { h: "Calls outside opening hours go unanswered", p: "A request that nobody takes is easily lost." },
        { h: "The same questions come in every day", p: "Opening hours, process, list prices: the answers have long been written down somewhere." },
        { h: "The team gets interrupted while working", p: "Every call pulls someone away from whatever has priority right now." },
        { h: "Chat requests land unsorted in a mailbox", p: "Details are missing, and someone has to ask." },
      ],
    },
    {
      t: "demo",
      id: "demo",
      label: "Scenario",
      h: "How a call can go",
      lede: "An appointment request from the first sentence to the confirmation. At the start the assistant says that an AI system is speaking, proposes times and books the appointment.",
      chip: "Demo · scenario, no sound",
      disclaimer: "A scripted run, not a live conversation.",
      play: "Play scenario",
      again: "Play again",
      sr: "Example conversation. AI assistant: Good day, you are speaking with an AI assistant. How can I help you? Caller: I would like to book an appointment for next week. AI assistant: Gladly. Would Wednesday at 10 or Thursday at 2 pm suit you? Caller: Thursday works. AI assistant: Then I will enter Thursday at 2 pm. You will receive a confirmation by email.",
      script: [
        { who: "AI assistant", agent: true, text: "Good day, you are speaking with an AI assistant. How can I help you?", ms: 3400 },
        { who: "Caller", agent: false, text: "I would like to book an appointment for next week.", ms: 3000 },
        { who: "AI assistant", agent: true, text: "Gladly. Would Wednesday at 10 am or Thursday at 2 pm suit you?", ms: 3600 },
        { who: "Caller", agent: false, text: "Thursday works.", ms: 1400 },
        { who: "AI assistant", agent: true, text: "Then I will enter Thursday at 2 pm. You will receive a confirmation by email.", ms: 4200 },
      ],
    },
    {
      t: "rows",
      id: "aufgaben",
      label: "Tasks",
      note: "Routine yes, judgement no.",
      h: "What an assistant takes on and what it does not",
      lede: "It takes on routine with clear rules. Anything that needs judgement goes to your team.",
      items: [
        { h: "Take requests", p: "Record what the caller or chat user needs and pass it on in a structured way to your team or your system." },
        { h: "Arrange appointments", p: "Propose free slots from your calendar, book the appointment and send a confirmation." },
        { h: "Answer standard questions", p: "Explain services, processes and hours, based on your own documents. If it does not know the answer, it says so and hands over." },
        { h: "Hand over to people", p: "For complaints, special cases and uncertainty, the conversation goes to a person on your team, as it does whenever a caller prefers to speak to a human." },
      ],
    },
    {
      t: "principles",
      id: "grundsaetze",
      label: "Principles",
      note: "Fixed rules for every conversation.",
      h: "Clear rules for every conversation",
      items: [
        {
          h: "Open about being an AI assistant",
          p: "Callers and chat users are told at the start that they are talking to an AI assistant. This follows the transparency principle of Article 50 of the EU AI Act. It is not legal advice.",
        },
        { h: "No voice cloning", p: "We do not clone voices, not even those of your staff." },
        { h: "No video agents", p: "We do not build avatars. The assistant has neither a face nor a figure." },
        {
          h: "Data protection review before go-live",
          p: "Before an assistant goes live, we review data protection with you. The final assessment is made by your data protection officer.",
        },
      ],
    },
    {
      t: "process",
      id: "vorgehen",
      label: "Approach",
      note: "Four steps, you decide after each.",
      h: "Four steps to your own assistant",
      lede: "We set tasks, limits and data protection first, and only then build.",
      cta: { label: "See the AI check", to: "check" },
      steps: [
        {
          name: "Clarify",
          h: "Tasks and limits",
          p: "In the AI check we clarify whether an assistant fits your workflow, what it should answer and what it must not decide.",
          result: "A short written report with tasks, limits and the point at which it hands over.",
          meta: "AI check from €990 net",
        },
        {
          name: "Data protection",
          h: "Review before the start",
          p: "We settle provider, storage location, retention and access, and settle the necessary agreements (DPA).",
          result: "Documented decisions before anything goes live.",
        },
        {
          name: "Pilot",
          h: "Build and connect",
          p: "We design the dialogue and connect the calendar, CRM or mailbox. Scope and fixed price are agreed in writing beforehand.",
          result: "An assistant for one channel, tested in daily work.",
          meta: "pilot at a fixed price, in writing beforehand",
        },
        {
          name: "Operation and expansion",
          h: "Evaluate and refine",
          p: "We review conversations, refine answers and support the assistant in daily use. If you prefer, your team takes over operation.",
          result: "An assistant that improves with its conversations.",
          meta: "monthly by agreement",
        },
      ],
    },
    {
      t: "spec",
      id: "umfang",
      label: "Scope",
      h: "What belongs to an assistant",
      lede: "Built for one clearly defined purpose, not as an all-purpose robot.",
      rows: [
        ["Channels", "Phone or chat on your website, depending on the workflow."],
        ["Knowledge", "Your own documents: services, opening hours, frequent questions."],
        ["Connections", "Calendar, CRM or mailbox, so appointments and requests land where your team works."],
        ["Handover", "To a person on your team, by callback, transfer or as a case."],
        ["Price", "AI check from €990 net, then a pilot at a fixed price. There is no list price."],
      ],
      footnote: "All prices net of VAT, businesses only.",
    },
  ],
  faq: {
    label: "Common questions",
    h: "Questions about AI assistants",
    items: [
      {
        q: "What does an AI assistant cost?",
        a: "There is no list price. The pilot has a fixed price that we name in writing beforehand; it depends on tasks, connections and call volume. The AI check before it costs from €990 net (credited in full against a follow-up order within 60 days), and operation and expansion afterwards are billed monthly by agreement. All prices net of VAT, businesses only.",
      },
      {
        q: "Do callers notice they are talking to an AI?",
        a: "Yes. The assistant says at the start that it is an AI assistant speaking. In chat, the notice is visible from the first message.",
      },
      {
        q: "Who listens in on the conversations?",
        a: "We settle that with you beforehand: provider, storage location, retention and access. What is stored and for how long is in writing before the start.",
      },
      {
        q: "Does an assistant replace our team?",
        a: "No. It takes routine off your hands and hands over as soon as a person is needed.",
      },
      {
        q: "How do we start?",
        a: "With a free, non-binding first conversation, then the AI check: 90 minutes remote plus a short written report, from €990 net, with an NDA before the analysis. You receive the report even without a recommendation.",
      },
    ],
  },
  cta: {
    label: "AI check",
    h: "Check whether an assistant fits your workflow",
    p: "In the AI check (from €990 net) we clarify whether an assistant fits before anything is built.",
    primary: { label: "Request an AI check", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Back to AI automation consulting", to: "beratung" },
  },
  schema: {
    service: {
      name: "AI assistants for phone and chat",
      serviceType: "AI assistants",
      description:
        "AI assistants for phone and chat that take requests, answer standard questions and hand over to people, with a data protection review before go-live.",
    },
  },
};

const tr: PageDef = {
  key: "agenten",
  meta: {
    title: "Telefon ve sohbet için YZ asistanları",
    description:
      "Telefon ve sohbet için YZ asistanları talepleri alır, standart soruları yanıtlar ve ekibinize devreder. Canlıya geçmeden önce veri koruma incelemesiyle.",
  },
  crumbs: ["beratung"],
  crumb: "YZ asistanları",
  hero: {
    eyebrow: "YZ danışmanlığı · Telefon ve sohbet için YZ asistanları",
    h1: ["YZ asistanı telefonu açar. ", "Kararı ekibiniz verir", ""],
    lede: "Telefon veya sohbet için bir YZ asistanı, tekrar eden talepleri alır, standart soruları kendi belgelerinize dayanarak yanıtlar ve bir kişi gerektiği anda ekibinize devreder. İş akışınıza uyup uymadığını YZ Kontrolünde netleştiririz.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "Senaryoyu izleyin", to: "agenten", hash: "demo" },
    facts: ["Her görüşmenin başında YZ asistanı olduğu söylenir", "Canlıya geçmeden önce veri koruma incelemesi", "Pilot sabit fiyatla, önceden yazılı"],
    media: {
      kind: "svg",
      name: "flow",
      alt: "Dört istasyonlu bir iş akışı çizimi: giriş, kurallar, taslak, kişi",
      caption: "Son sözü her zaman bir insan söyler.",
      fig: "1.3",
    },
  },
  blocks: [
    {
      t: "situations",
      id: "situationen",
      label: "Durumlar",
      note: "Ekibinizi bağlayan rutin.",
      h: "Bir asistan ne zaman işe yarayabilir?",
      lede: "Aynı talepler sürekli geri geldiğinde ve ekibiniz bunlar için işine ara vermek zorunda kaldığında.",
      items: [
        { h: "Çalışma saatleri dışındaki aramalar yanıtsız kalıyor", p: "Kimsenin yanıtlamadığı bir talep kolayca kaybolur." },
        { h: "Her gün aynı sorular geliyor", p: "Çalışma saatleri, süreç, liste fiyatları: Yanıtlar çoktan bir yerde yazılı." },
        { h: "Ekip çalışırken sürekli bölünüyor", p: "Her arama, birini o an öncelikli olan işten koparıyor." },
        { h: "Sohbetteki talepler düzensiz biçimde posta kutusuna düşüyor", p: "Bilgiler eksik; biri sormak zorunda." },
      ],
    },
    {
      t: "demo",
      id: "demo",
      label: "Senaryo",
      h: "Bir arama böyle ilerleyebilir",
      lede: "İlk cümleden onaya kadar bir randevu talebi. Asistan en başta bir YZ sisteminin konuştuğunu söyler, uygun saatleri önerir ve randevuyu kaydeder.",
      chip: "Demo · senaryo, sessiz",
      disclaimer: "Kurgulanmış bir akıştır, canlı görüşme değildir.",
      play: "Senaryoyu oynatın",
      again: "Tekrar oynatın",
      sr: "Örnek görüşme. YZ asistanı: İyi günler, bir YZ asistanıyla görüşüyorsunuz. Size nasıl yardımcı olabilirim? Arayan: Gelecek hafta için randevu almak istiyorum. YZ asistanı: Memnuniyetle. Çarşamba 10:00 mu, perşembe 14:00 mü uygun? Arayan: Perşembe uygun. YZ asistanı: O zaman perşembe 14:00'e kaydediyorum. Onayı e-postayla alacaksınız.",
      script: [
        { who: "YZ asistanı", agent: true, text: "İyi günler, bir YZ asistanıyla görüşüyorsunuz. Size nasıl yardımcı olabilirim?", ms: 3400 },
        { who: "Arayan", agent: false, text: "Gelecek hafta için randevu almak istiyorum.", ms: 3000 },
        { who: "YZ asistanı", agent: true, text: "Memnuniyetle. Çarşamba 10:00 mu, perşembe 14:00 mü uygun?", ms: 3600 },
        { who: "Arayan", agent: false, text: "Perşembe uygun.", ms: 1400 },
        { who: "YZ asistanı", agent: true, text: "O zaman perşembe 14:00'e kaydediyorum. Onayı e-postayla alacaksınız.", ms: 4200 },
      ],
    },
    {
      t: "rows",
      id: "aufgaben",
      label: "Görevler",
      note: "Rutin evet, muhakeme hayır.",
      h: "Asistan neyi üstlenir, neyi üstlenmez?",
      lede: "Net kurallara dayanan rutini üstlenir. Muhakeme gerektiren her şey ekibinize gider.",
      items: [
        { h: "Talepleri almak", p: "Arayanın veya sohbet kullanıcısının ihtiyacını kaydetmek ve düzenli biçimde ekibinize ya da sisteminize iletmek." },
        { h: "Randevu ayarlamak", p: "Takviminizdeki boş saatleri önermek, randevuyu kaydetmek ve onay göndermek." },
        { h: "Standart soruları yanıtlamak", p: "Hizmetleri, süreçleri ve saatleri kendi belgelerinize dayanarak açıklamak. Yanıtı bilmiyorsa bunu söyler ve devreder." },
        { h: "İnsana devretmek", p: "Şikâyet, özel durum veya belirsizlikte görüşme ekibinizden bir kişiye aktarılır; arayan bir insanla konuşmak istediğinde de öyle." },
      ],
    },
    {
      t: "principles",
      id: "grundsaetze",
      label: "İlkeler",
      note: "Her görüşme için sabit kurallar.",
      h: "Her görüşme için net kurallar",
      items: [
        {
          h: "YZ asistanı olduğunu açıkça söyler",
          p: "Arayanlara ve sohbet kullanıcılarına en başta bir YZ asistanıyla konuştukları bildirilir. Bu, AB Yapay Zekâ Tüzüğü'nün 50. maddesindeki şeffaflık ilkesini izler. Hukuki danışmanlık değildir.",
        },
        { h: "Ses klonlama yok", p: "Ses klonlamıyoruz; çalışanlarınızın sesini de." },
        { h: "Video asistanı yok", p: "Avatar geliştirmiyoruz. Asistanın ne yüzü ne de figürü vardır." },
        {
          h: "Canlıya geçmeden önce veri koruma incelemesi",
          p: "Bir asistan canlıya geçmeden önce veri korumayı sizinle birlikte inceleriz. Nihai değerlendirmeyi veri koruma sorumlunuz yapar.",
        },
      ],
    },
    {
      t: "process",
      id: "vorgehen",
      label: "Yöntem",
      note: "Dört adım; her adımdan sonra siz karar verirsiniz.",
      h: "Dört adımda kendi asistanınız",
      lede: "Önce görevleri, sınırları ve veri korumayı belirliyor, ancak ondan sonra kuruyoruz.",
      cta: { label: "YZ Kontrolüne bakın", to: "check" },
      steps: [
        {
          name: "Netleştirme",
          h: "Görevler ve sınırlar",
          p: "YZ Kontrolünde bir asistanın iş akışınıza uyup uymadığını, neyi yanıtlaması gerektiğini ve neye karar veremeyeceğini netleştiriyoruz.",
          result: "Görevleri, sınırları ve devrettiği noktayı içeren kısa bir yazılı rapor.",
          meta: "YZ Kontrolü 990 €'dan itibaren (net)",
        },
        {
          name: "Veri koruma",
          h: "Başlamadan önce inceleme",
          p: "Sağlayıcıyı, saklama yerini, saklama süresini ve erişimi belirler, gerekli sözleşmeleri (veri işleme sözleşmesi) netleştiririz.",
          result: "Hiçbir şey canlıya geçmeden önce belgelenmiş kararlar.",
        },
        {
          name: "Pilot",
          h: "Kurulum ve bağlantılar",
          p: "Diyaloğu tasarlıyor, takvimi, CRM'i veya posta kutusunu bağlıyoruz. Kapsam ve sabit fiyat önceden yazılı olarak belirlenir.",
          result: "Tek bir kanal için, günlük işte denenmiş bir asistan.",
          meta: "pilot sabit fiyatla, önceden yazılı",
        },
        {
          name: "İşletme ve geliştirme",
          h: "Değerlendirme ve iyileştirme",
          p: "Görüşmeleri değerlendiriyor, yanıtları iyileştiriyor ve asistana günlük işte eşlik ediyoruz. İsterseniz işletmeyi ekibiniz üstlenir.",
          result: "Görüşmelerle birlikte gelişen bir asistan.",
          meta: "aylık, anlaşmaya göre",
        },
      ],
    },
    {
      t: "spec",
      id: "umfang",
      label: "Kapsam",
      h: "Bir asistana neler dahildir?",
      lede: "Net tanımlanmış bir amaç için kurulur; her işe yarayan bir robot olarak değil.",
      rows: [
        ["Kanallar", "İş akışına göre telefon veya web sitenizde sohbet."],
        ["Bilgi", "Kendi belgeleriniz: hizmetler, çalışma saatleri, sık sorulan sorular."],
        ["Bağlantılar", "Takvim, CRM veya posta kutusu; randevular ve talepler ekibinizin çalıştığı yere düşsün."],
        ["Devir", "Ekibinizden bir kişiye; geri arama, aktarma veya kayıt olarak."],
        ["Fiyat", "YZ Kontrolü 990 €'dan itibaren (net), ardından sabit fiyatlı pilot. Liste fiyatı yoktur."],
      ],
      footnote: "Tüm fiyatlar net olup KDV hariçtir; yalnızca işletmeler içindir.",
    },
  ],
  faq: {
    label: "Sık sorulanlar",
    h: "YZ asistanları hakkında sorular",
    items: [
      {
        q: "Bir YZ asistanının maliyeti nedir?",
        a: "Liste fiyatı yoktur. Pilotun sabit bir fiyatı vardır ve bunu önceden yazılı olarak bildiririz; fiyat görevlere, bağlantılara ve arama hacmine bağlıdır. Öncesindeki YZ Kontrolü 990 €'dan itibaren (net) başlar (60 gün içinde verilen bir sonraki siparişte tutarın tamamı mahsup edilir), sonrasındaki işletme ve geliştirme anlaşmaya göre aylık faturalandırılır. Tüm fiyatlar net olup KDV hariçtir; yalnızca işletmeler içindir.",
      },
      {
        q: "Arayanlar bir YZ ile konuştuklarını fark eder mi?",
        a: "Evet. Asistan en başta bir YZ asistanının konuştuğunu söyler. Sohbette bu bildirim ilk mesajdan itibaren görünür durur.",
      },
      {
        q: "Görüşmeleri kim dinleyebilir?",
        a: "Bunu önceden sizinle birlikte belirleriz: sağlayıcı, saklama yeri, saklama süresi ve erişim. Neyin ne kadar süre saklanacağı, başlamadan önce yazılı olarak belirlenir.",
      },
      {
        q: "Asistan ekibimizin yerini alır mı?",
        a: "Hayır. Rutin işleri üstlenir ve bir kişi gerektiği anda devreder.",
      },
      {
        q: "Nasıl başlarız?",
        a: "Ücretsiz ve bağlayıcı olmayan bir tanışma görüşmesiyle, ardından YZ Kontrolüyle: 90 dakika uzaktan görüşme ve kısa yazılı rapor, 990 €'dan itibaren (net), analizden önce NDA. Öneri çıkmasa da raporu alırsınız.",
      },
    ],
  },
  cta: {
    label: "YZ Kontrolü",
    h: "Asistanın iş akışınıza uyup uymadığına birlikte bakalım",
    p: "YZ Kontrolünde (990 €'dan itibaren (net)) hiçbir şey kurulmadan önce asistanın uyup uymadığını netleştiririz.",
    primary: { label: "YZ Kontrolü talep edin", to: "kontakt", query: { anliegen: "ki-check" } },
    secondary: { label: "YZ danışmanlığına dönün", to: "beratung" },
  },
  schema: {
    service: {
      name: "Telefon ve sohbet için YZ asistanları",
      serviceType: "YZ asistanları",
      description:
        "Talepleri alan, standart soruları yanıtlayan ve insanlara devreden telefon ve sohbet YZ asistanları; canlıya geçmeden önce veri koruma incelemesiyle.",
    },
  },
};

export const page: PageSet = { de, en, tr };
