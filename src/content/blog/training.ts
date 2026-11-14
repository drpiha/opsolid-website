import { postSlugIn } from "../../lib/blog-slugs";
import { href, type L3 } from "../../lib/v7-routes";

/**
 * Journal posts on trainings (first two: 2026-11-14). German is the source; EN and TR are short faithful versions.
 * Keyed by the English slug (the post id in src/lib/blog-slugs.ts); each locale has its own public slug.
 * Prices: only the published ones (src/content/v7/pages/kompetenz.ts, copilot.ts, schulungen.ts), no competitor
 * amounts. Art. 4 only in the safe wording, checked on 2026-11-14 against the consolidated text on the Commission's
 * AI Act Service Desk and its AI literacy Q&A (EUR-Lex was not fully available that day).
 */
const COST = "what-does-ai-training-cost";
const ART4 = "is-ai-training-mandatory-ai-act-article-4";

const post = (id: string, l: L3) => href("blog", l, { sub: `/${postSlugIn(id, l)}` });

const SD_FAQ = "https://ai-act-service-desk.ec.europa.eu/en/faq?faq_category_id=75";
const QA = "https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers";
const sd = (l: "de" | "en", art: number) => `https://ai-act-service-desk.ec.europa.eu/${l}/ai-act/article-${art}`;

export const trainingArticles: Record<string, Record<L3, string>> = {
  [COST]: {
    de: `<p><em>Preise: Stand 14. November 2026. Alle Preise netto zzgl. USt., nur für Unternehmen.</em></p>

<p>Eine KI-Schulung für Mitarbeiter wird entweder pro Person oder als Festpreis pro Team berechnet. Was sie kostet, hängt vor allem von Dauer, Gruppengröße und Inhalt ab. Bei uns kostet ein halber Tag KI-Kompetenz Basis ab 1.790 € netto für ein Team mit 10 Personen, rechnerisch 179 € pro Person. Der Microsoft 365 Copilot Praxistag kostet ab 2.900 € netto für 10 Personen, rechnerisch 290 € pro Person. Hier lesen Sie, wovon der Preis abhängt, was bei Copilot hinzukommt und wie Sie Angebote vergleichen.</p>

<h2>Welche Preismodelle gibt es?</h2>
<p>Zwei Modelle sind verbreitet: ein Preis pro Person und ein Festpreis pro Team.</p>
<ul>
<li><strong>Preis pro Person:</strong> Das ist üblich bei offenen Seminaren und Online-Kursen, in denen Menschen aus verschiedenen Unternehmen zusammen lernen. Es passt, wenn nur zwei oder drei Personen teilnehmen sollen. Für ein ganzes Team wächst die Summe mit jeder Person.</li>
<li><strong>Preis pro Team:</strong> Das ist üblich bei geschlossenen Terminen nur für Ihr Unternehmen, oft Inhouse-Schulung genannt. Ein Festbetrag deckt eine bestimmte Zahl an Plätzen, für jede weitere Person kommt ein Aufschlag hinzu. Die Übungen können sich an den Aufgaben Ihres Teams orientieren.</li>
</ul>
<p>Manche Anbieter rechnen nach Tagessatz und berechnen Vorbereitung, Unterlagen oder Reisekosten getrennt. Fragen Sie deshalb immer, was im Preis enthalten ist.</p>

<h2>Wovon hängt der Preis ab?</h2>
<p>Fünf Punkte entscheiden über den Betrag.</p>
<ul>
<li><strong>Dauer:</strong> Ein halber Tag Grundlagen kostet weniger als ein ganzer Praxistag oder eine zweitägige Schulung, in der Ihr Team eigene Workflows aufbaut.</li>
<li><strong>Gruppengröße:</strong> Bei Teampreisen ist eine bestimmte Zahl an Plätzen enthalten, darüber zahlen Sie pro Person. Achten Sie auch auf die Höchstzahl: Wer übt, braucht Zeit für Fragen.</li>
<li><strong>Inhalt:</strong> Grundlagen für alle Beschäftigten sind anders aufgebaut als eine Schulung zu einem Werkzeug wie Microsoft 365 Copilot.</li>
<li><strong>Vorbereitung:</strong> Übungen mit Aufgaben aus Ihrem Alltag brauchen ein Vorgespräch und Vorbereitung. Ein Standardkurs braucht beides nicht.</li>
<li><strong>Format:</strong> Online live, vor Ort oder als Aufzeichnung. Bei Terminen vor Ort können Reisekosten hinzukommen.</li>
</ul>

<h2>Was kosten unsere KI-Schulungen?</h2>
<p>Wir bieten Schulungen als Teampakete an. Alle Termine finden online und live statt, als geschlossener Termin nur für Ihr Team, auf Deutsch oder Englisch. Nach jeder Schulung erhält Ihr Team unsere Teilnahmebescheinigung.</p>
<ul>
<li><strong>KI-Kompetenz Basis:</strong> halber Tag (3,5 Stunden), ab 1.790 € netto, 10 Personen inklusive, jede weitere Person 90 €, bis 15 Personen. Rechnerisch 179 € pro Person bei 10 Personen.</li>
<li><strong>Microsoft 365 Copilot Praxistag:</strong> 1 Tag (6 Stunden), ab 2.900 € netto, 10 Personen inklusive, jede weitere Person 150 €, bis 12 Personen. Rechnerisch 290 € pro Person bei 10 Personen.</li>
<li><strong>KI-Agenten &amp; Workflow-Automatisierung:</strong> 2 Tage, ab 5.900 € netto, 8 Personen inklusive, jede weitere Person 290 €, bis 10 Personen.</li>
</ul>
<p>„Ab“ heißt: Der Preis gilt für den beschriebenen Umfang. Weicht Ihr Umfang ab, nennen wir Ihnen den Preis vor der Buchung. Auch die Trainerin oder den Trainer nennen wir vor der Buchung namentlich. Vertrag und Rechnung laufen über OpSolid.</p>

<h2>Was kommt bei einer Copilot-Schulung hinzu?</h2>
<p>Für eine Microsoft 365 Copilot Schulung braucht jede teilnehmende Person eine Copilot-Lizenz und eine Anmeldung in Microsoft 365. Die Lizenzen sind ein eigener Kostenpunkt. Wir verkaufen keine Lizenzen; Sie beziehen sie über Microsoft oder Ihren Microsoft-Partner.</p>
<p>Planen Sie außerdem Vorbereitung ein. Saubere Berechtigungen in SharePoint, Teams und OneDrive sind die Grundlage: Wer zu viel sehen darf, kann es auch über Copilot finden. Und rechnen Sie die Arbeitszeit mit, denn ein Praxistag bindet jede teilnehmende Person einen Arbeitstag.</p>

<h2>Muss es eine externe Schulung sein?</h2>
<p>Nein. Nach Auskunft der EU-Kommission gibt es keine Pflicht zu externer Schulung oder externer Zertifizierung (<a href="${SD_FAQ}">AI Act Service Desk, Englisch</a>). Art. 4 der KI-Verordnung verlangt von Unternehmen, die KI einsetzen, Maßnahmen zur Förderung der KI-Kompetenz ihres Personals. Welche Maßnahmen das sind, entscheiden Sie selbst. Mehr dazu im Beitrag <a href="${post(ART4, "de")}">Ist eine KI-Schulung Pflicht?</a></p>
<p>Eine externe Schulung lohnt sich, wenn im Haus niemand die Zeit oder die Erfahrung hat, das Thema strukturiert aufzubereiten, oder wenn ein ganzes Team auf denselben Stand kommen soll.</p>

<h2>Wie vergleichen Sie Angebote?</h2>
<p>Rechnen Sie jedes Angebot auf Ihre Gruppe um und klären Sie diese Fragen:</p>
<ol>
<li>Was kostet die Schulung für Ihre Gruppengröße, und was ergibt das pro Person?</li>
<li>Ist der Preis netto oder brutto angegeben?</li>
<li>Wie viele Stunden dauert die Schulung, und wie viele Personen dürfen höchstens teilnehmen?</li>
<li>Sind Vorbereitung, Unterlagen und eine Teilnahmebescheinigung enthalten?</li>
<li>Findet die Schulung live statt, oder ist es eine Aufzeichnung?</li>
<li>Wer schult, und erfahren Sie den Namen vor der Buchung?</li>
<li>Kommen Lizenzen, Reisekosten oder andere Gebühren hinzu?</li>
</ol>

<h2>Welche Schulung passt zu Ihrem Team?</h2>
<p>Hat Ihr Team Microsoft 365 Copilot bereits und soll es im Alltag nutzen, passt der Praxistag: Ihr Team wendet Copilot in Outlook, Teams, Word, Excel und PowerPoint an eigenen Aufgaben an. Ablauf, Voraussetzungen und Preis stehen auf der Seite <a href="${href("copilot", "de")}">Microsoft 365 Copilot Praxistag</a>. Für die Grundlagen im ganzen Team ist KI-Kompetenz Basis gedacht.</p>
<p>Dieser Beitrag ist keine Rechtsberatung.</p>`,

    en: `<p><em>Prices as of 14 November 2026. All prices net of VAT, businesses only.</em></p>

<p>AI training for employees is priced either per person or as a fixed price per team. What it costs depends mainly on length, group size and content. With us, a half day of AI literacy basics costs from €1,790 net for a team of 10, which works out at €179 per person. The Microsoft 365 Copilot workshop costs from €2,900 net for 10 people, €290 per person. Here is what drives the price, what Copilot adds and how to compare offers.</p>

<h2>Which pricing models are there?</h2>
<ul>
<li><strong>Price per person:</strong> common for open seminars and online courses where people from different companies learn together. It suits two or three participants; for a whole team, the total grows with every person.</li>
<li><strong>Price per team:</strong> common for closed sessions for your company only, often called in-house training. A fixed amount covers a set number of seats, with a surcharge for each additional person, and the exercises can follow your team's tasks.</li>
</ul>
<p>Some providers charge a day rate and bill preparation, materials or travel separately. Always ask what the price includes.</p>

<h2>What drives the price?</h2>
<p>Length; group size and the maximum number of participants; content, from basics for everyone to a tool such as Microsoft 365 Copilot; preparation with your own tasks; and format: live online, on site or recorded. On-site sessions can add travel costs.</p>

<h2>What do our AI training courses cost?</h2>
<p>We offer training as team packages, always live online, as a closed session for your team, in English or German. After each course your team receives our participation record.</p>
<ul>
<li><strong>AI literacy basics:</strong> half day (3.5 hours), from €1,790 net, 10 people included, each additional person €90, up to 15. €179 per person with 10 people.</li>
<li><strong>Microsoft 365 Copilot workshop:</strong> 1 day (6 hours), from €2,900 net, 10 people included, each additional person €150, up to 12. €290 per person with 10 people.</li>
<li><strong>AI agents &amp; workflow automation:</strong> 2 days, from €5,900 net, 8 people included, each additional person €290, up to 10.</li>
</ul>
<p>"From" means the price applies to the scope described; if yours differs, we name the price before booking. We also name the trainer before booking. Contract and invoice run through OpSolid.</p>

<h2>What does Copilot training add?</h2>
<p>Every participant needs a Microsoft 365 Copilot licence and a Microsoft 365 sign-in. Licences are a separate cost; we do not sell them, you get them from Microsoft or your Microsoft partner. Clean permissions in SharePoint, Teams and OneDrive come first, because whoever may see too much can also find it through Copilot. And a workshop day takes one working day per participant.</p>

<h2>Does it have to be external training?</h2>
<p>No. According to the European Commission, there is no obligation for external training or external certification (<a href="${SD_FAQ}">AI Act Service Desk</a>). Article 4 of the AI Act requires companies that use AI to take measures for their staff's AI literacy; which measures is up to you. More in <a href="${post(ART4, "en")}">Is AI training mandatory?</a> External training makes sense when nobody in-house has the time or experience, or when a whole team should reach the same level.</p>

<h2>How do you compare offers?</h2>
<ol>
<li>What does it cost for your group size, and per person?</li>
<li>Is the price net or gross?</li>
<li>How many hours, and how many participants at most?</li>
<li>Are preparation, materials and a participation record included?</li>
<li>Is it live or recorded?</li>
<li>Who teaches, and do you learn the name before booking?</li>
<li>Do licences, travel or other fees come on top?</li>
</ol>
<p>If your team already has Copilot and should use it in daily work, the <a href="${href("copilot", "en")}">Microsoft 365 Copilot workshop</a> fits. For the basics across a team, AI literacy basics is the course. This article is not legal advice.</p>`,

    tr: `<p><em>Fiyatlar: 14 Kasım 2026 itibarıyla. Tüm fiyatlar net, KDV hariç; yalnızca işletmeler için.</em></p>

<p>Çalışanlar için bir yapay zeka eğitimi ya kişi başına ya da ekip başına sabit fiyatla ücretlendirilir. Maliyeti en çok süreye, grup büyüklüğüne ve içeriğe bağlıdır. Bizde yarım günlük YZ Yetkinliği Temel eğitimi 10 kişilik bir ekip için 1.790 €'dan itibaren (net) başlar; bu, hesaben kişi başı 179 € eder. Microsoft 365 Copilot Uygulama Günü 10 kişi için 2.900 €'dan itibaren (net), hesaben kişi başı 290 €'dur. Aşağıda fiyatı neyin belirlediğini, Copilot'ta neyin eklendiğini ve teklifleri nasıl karşılaştıracağınızı bulabilirsiniz.</p>

<h2>Hangi fiyat modelleri var?</h2>
<ul>
<li><strong>Kişi başı fiyat:</strong> Farklı şirketlerden kişilerin birlikte öğrendiği açık seminerlerde ve çevrimiçi kurslarda yaygındır. İki üç kişi katılacaksa uygundur; tüm ekip için toplam her kişiyle artar.</li>
<li><strong>Ekip başı fiyat:</strong> Yalnızca şirketinize özel kapalı oturumlarda yaygındır. Sabit bir tutar belirli sayıda kişiyi kapsar, her ek kişi için ek ücret alınır; alıştırmalar ekibinizin görevlerine göre kurulabilir.</li>
</ul>
<p>Bazı sağlayıcılar günlük ücretle çalışır ve hazırlık, materyal ya da yol masrafını ayrıca faturalar. Fiyata neyin dahil olduğunu mutlaka sorun.</p>

<h2>Fiyatı ne belirler?</h2>
<p>Süre; grup büyüklüğü ve azami katılımcı sayısı; herkes için temellerden Microsoft 365 Copilot gibi bir araca kadar içerik; kendi görevlerinizle hazırlık; ve biçim: canlı çevrimiçi, yerinde ya da kayıt. Yerinde oturumlarda yol masrafı eklenebilir.</p>

<h2>Eğitimlerimiz ne kadar?</h2>
<p>Eğitimleri ekip paketi olarak sunuyoruz: her zaman çevrimiçi ve canlı, yalnızca ekibinize özel, Almanca veya İngilizce. Her eğitimden sonra ekibiniz katılım belgemizi alır.</p>
<ul>
<li><strong>YZ Yetkinliği Temel:</strong> yarım gün (3,5 saat), 1.790 €'dan itibaren (net), 10 kişi dahil, her ek kişi 90 €, en fazla 15 kişi. 10 kişide hesaben kişi başı 179 €.</li>
<li><strong>Microsoft 365 Copilot Uygulama Günü:</strong> 1 gün (6 saat), 2.900 €'dan itibaren (net), 10 kişi dahil, her ek kişi 150 €, en fazla 12 kişi. 10 kişide hesaben kişi başı 290 €.</li>
<li><strong>YZ Ajanları ve İş Akışı Otomasyonu:</strong> 2 gün, 5.900 €'dan itibaren (net), 8 kişi dahil, her ek kişi 290 €, en fazla 10 kişi.</li>
</ul>
<p>"İtibaren", fiyatın tanımlanan kapsam için geçerli olduğu anlamına gelir; kapsamınız farklıysa fiyatı rezervasyondan önce bildiririz. Eğitmeni de rezervasyondan önce adıyla bildiririz. Sözleşme ve fatura OpSolid üzerinden yürür.</p>

<h2>Copilot eğitiminde ne eklenir?</h2>
<p>Her katılımcının bir Microsoft 365 Copilot lisansına ve Microsoft 365 girişine ihtiyacı vardır. Lisanslar ayrı bir maliyettir; lisans satmıyoruz, onları Microsoft'tan ya da Microsoft iş ortağınızdan alırsınız. SharePoint, Teams ve OneDrive'da düzenli yetkiler temeldir: Çok fazlasını görebilen kişi, onu Copilot üzerinden de bulabilir. Bir uygulama günü de her katılımcının bir iş gününü alır.</p>

<h2>Eğitim dışarıdan mı alınmalı?</h2>
<p>Hayır. Avrupa Komisyonu'na göre dış eğitim ya da dış sertifika zorunluluğu yoktur (<a href="${SD_FAQ}">AI Act Service Desk, İngilizce</a>). AI Act'in 4. maddesi, yapay zeka kullanan şirketlerden personelinin yapay zeka okuryazarlığı için önlem almasını ister; hangi önlemlerin alınacağına siz karar verirsiniz. Ayrıntılar: <a href="${post(ART4, "tr")}">Yapay zeka eğitimi zorunlu mu?</a> Şirket içinde kimsenin konuyu düzenli biçimde hazırlayacak zamanı ya da deneyimi yoksa ya da tüm ekip aynı seviyeye gelmeliyse dış eğitim mantıklıdır.</p>

<h2>Teklifleri nasıl karşılaştırırsınız?</h2>
<ol>
<li>Grup büyüklüğünüz için toplam ve kişi başı ne kadar?</li>
<li>Fiyat net mi, brüt mü?</li>
<li>Kaç saat sürüyor, en fazla kaç kişi katılabilir?</li>
<li>Hazırlık, materyal ve katılım belgesi dahil mi?</li>
<li>Canlı mı, kayıt mı?</li>
<li>Eğitimi kim veriyor, adını rezervasyondan önce öğreniyor musunuz?</li>
<li>Lisans, yol masrafı ya da başka ücretler ekleniyor mu?</li>
</ol>
<p>Ekibinizde Copilot zaten varsa ve günlük işte kullanılacaksa <a href="${href("copilot", "tr")}">Microsoft 365 Copilot Uygulama Günü</a> uygundur. Tüm ekip için temeller YZ Yetkinliği Temel ile verilir. Bu yazı hukuki danışmanlık değildir.</p>`,
  },

  [ART4]: {
    de: `<p><em>Rechtsstand: 14. November 2026. Maßgeblich ist der im Amtsblatt der EU veröffentlichte Text.</em></p>

<p>Nein, eine bestimmte KI-Schulung schreibt die KI-Verordnung nicht vor. Art. 4 verpflichtet Unternehmen, die KI-Systeme anbieten oder im Beruf einsetzen, Maßnahmen zu ergreifen, die die KI-Kompetenz ihres Personals unterstützen. Welche Maßnahmen das sind, entscheiden Sie selbst; eine Schulung kann eine davon sein. Ein Zertifikat ist nicht nötig. Seit der Änderung durch die Verordnung (EU) 2026/1744 muss auch kein bestimmtes Kompetenzniveau mehr garantiert werden.</p>

<h2>Was steht in Artikel 4 seit der Änderung?</h2>
<p>Art. 4 gilt seit dem 27. Juli 2026 in einer neuen Fassung. Absatz 1 verpflichtet Anbieter und Betreiber von KI-Systemen, Maßnahmen zu ergreifen, die die Entwicklung der KI-Kompetenz ihres Personals unterstützen. Das gilt auch für andere Personen, die in ihrem Auftrag mit KI-Systemen arbeiten. Zu berücksichtigen sind Vorkenntnisse, Erfahrung und Ausbildung dieser Menschen, der Kontext, in dem die KI eingesetzt wird, und die Personen, bei denen sie eingesetzt wird. Ein Satz ist neu: Die Pflicht verlangt nicht, für irgendeine Person ein bestimmtes Niveau an KI-Kompetenz zu garantieren.</p>
<p>Nach Absatz 2 unterstützen die EU-Kommission und die Mitgliedstaaten die Unternehmen dabei, besonders kleine und mittlere. Die Kommission veröffentlicht dafür praktische Beispiele. Nach Absatz 3 nimmt das KI-Gremium Empfehlungen zur Förderung der KI-Kompetenz an.</p>
<p>Was KI-Kompetenz ist, regelt Art. 3 Nr. 56: die Fähigkeiten, Kenntnisse und das Verständnis, um KI-Systeme sachkundig einzusetzen und sich der Chancen, Risiken und möglichen Schäden bewusst zu sein.</p>

<h2>Was hat sich 2026 geändert?</h2>
<p>Art. 4 gilt seit dem 2. Februar 2025. Die ursprüngliche Fassung verlangte, nach besten Kräften ein ausreichendes Maß an KI-Kompetenz sicherzustellen. Die neue Fassung spricht davon, die Entwicklung der KI-Kompetenz zu unterstützen. Ein bestimmtes oder ausreichendes Niveau schreibt sie nicht mehr vor.</p>
<p>Die Pflicht selbst ist geblieben. Die EU-Kommission hatte im November 2025 vorgeschlagen, sie von den Unternehmen auf die Kommission und die Mitgliedstaaten zu verlagern. In der beschlossenen Fassung bleibt sie eine Pflicht der Anbieter und Betreiber.</p>
<p>Seit dem 2. August 2026 überwachen die nationalen Marktüberwachungsbehörden die Einhaltung von Art. 4. Mögliche Sanktionen richten sich nach nationalem Recht und müssen nach Auskunft der Kommission im Einzelfall verhältnismäßig sein.</p>

<h2>Wer ist betroffen?</h2>
<p>Art. 4 richtet sich an Anbieter und Betreiber von KI-Systemen. Anbieter entwickeln ein KI-System und bringen es unter eigenem Namen in Verkehr. Betreiber verwenden ein KI-System in eigener Verantwortung, außer im Rahmen einer persönlichen und nicht beruflichen Tätigkeit. Ein Unternehmen, dessen Beschäftigte im Beruf mit KI-Werkzeugen arbeiten, ist damit in der Regel Betreiber.</p>
<p>Die EU-Kommission nennt dafür ein Beispiel: Nutzen Beschäftigte ChatGPT, um Werbetexte zu schreiben oder Texte zu übersetzen, gilt Art. 4. Sie sollten etwa wissen, dass solche Werkzeuge Angaben erfinden können. Gemeint sind nicht nur Angestellte, sondern auch Personen, die im Auftrag des Unternehmens mit KI arbeiten, zum Beispiel Auftragnehmer oder Dienstleister.</p>

<h2>Welche Maßnahmen passen?</h2>
<p>Ein festes Programm gibt es nicht. Die EU-Kommission empfiehlt, mindestens diese Fragen zu klären:</p>
<ul>
<li>Versteht Ihr Team, was KI ist, wie sie arbeitet, welche KI Sie einsetzen und wo Chancen und Gefahren liegen?</li>
<li>Welche Rolle hat Ihr Unternehmen: Entwickeln Sie KI-Systeme, oder nutzen Sie Systeme anderer Anbieter?</li>
<li>Welche Risiken haben die eingesetzten Systeme, und was müssen die Beschäftigten darüber wissen?</li>
<li>Welche Maßnahmen folgen daraus für Gruppen mit unterschiedlichem Vorwissen und unterschiedlichen Aufgaben?</li>
</ul>
<p>Mögliche Maßnahmen sind eine Schulung für alle, die mit KI arbeiten, eine Einweisung in die konkreten Werkzeuge und interne Regeln dazu, welche Daten in ein KI-Werkzeug gehören und wer Ergebnisse prüft. Unterschiedliche Gruppen können unterschiedlich tief geschult werden. Eine Pflicht, das Wissen der Beschäftigten zu messen, sieht Art. 4 nach Auskunft der Kommission nicht vor. Eine eigene Stelle wie eine KI-Beauftragte oder einen KI-Beauftragten verlangt er ebenfalls nicht.</p>

<h2>Braucht es ein Zertifikat?</h2>
<p>Nein. Nach Auskunft der EU-Kommission braucht es kein Zertifikat, und es gibt keine Pflicht zu externer Schulung oder externer Zertifizierung. Unternehmen können intern festhalten, welche Schulungen und sonstigen Maßnahmen stattgefunden haben. Diese Dokumentation ist gute Praxis.</p>
<p>Nach unseren Schulungen erhalten alle Teilnehmenden eine Teilnahmebescheinigung von OpSolid mit Datum, Dauer, Themen und Trainer. Sie belegt die Teilnahme und kann Ihre interne Dokumentation ergänzen. Sie ist kein Zertifikat einer Behörde, einer Kammer oder eines Verbands.</p>

<h2>Wie kann eine Schulung dabei helfen?</h2>
<p>Eine Schulung bringt viele Beschäftigte auf einmal auf denselben Stand. Dafür ist KI-Kompetenz Basis gedacht: ein halber Tag, online und live nur für Ihr Team, mit Grundlagen, guten Anfragen, Fehlererkennung, Datenschutz im Alltag, Regeln für Ihr Team und menschlicher Kontrolle. Sie kostet ab 1.790 € netto pro Team, 10 Personen inklusive, jede weitere Person 90 € (bis 15 Personen).</p>
<p>Die Schulung ist eine Maßnahme von mehreren, kein vollständiger Nachweis und kein Versprechen, dass Ihr Unternehmen damit alle Pflichten erfüllt. Ablauf und Themen stehen auf der Seite <a href="${href("kompetenz", "de")}">KI-Kompetenz Basis</a>. Was Schulungen allgemein kosten, lesen Sie im Beitrag <a href="${post(COST, "de")}">Was kostet eine KI-Schulung?</a></p>
<p>Dieser Beitrag ist keine Rechtsberatung. Für Ihren eigenen Fall fragen Sie bitte Ihre Rechtsberatung.</p>

<h2>Quellen</h2>
<ul>
<li><a href="${sd("de", 4)}">AI Act Service Desk der EU-Kommission: Artikel 4 KI-Kompetenz, konsolidierte Fassung mit Stand 27. Juli 2026</a></li>
<li><a href="${sd("de", 3)}">AI Act Service Desk: Artikel 3, Begriffsbestimmungen (Nr. 4 Betreiber, Nr. 56 KI-Kompetenz)</a></li>
<li><a href="${QA}">EU-Kommission: AI Literacy, Questions &amp; Answers, Stand 20. Oktober 2026 (Englisch)</a></li>
<li><a href="${SD_FAQ}">AI Act Service Desk: Häufige Fragen zu Artikel 4 (Englisch)</a></li>
<li><a href="https://eur-lex.europa.eu/eli/reg/2026/1744/oj/deu">Verordnung (EU) 2026/1744 (Digital-Omnibus zur KI), EUR-Lex</a></li>
</ul>`,

    en: `<p><em>Legal status as of 14 November 2026. The text published in the Official Journal of the EU is authoritative.</em></p>

<p>No, the AI Act does not prescribe a specific AI training. Article 4 requires companies that provide AI systems or use them at work to take measures that support the AI literacy of their staff. Which measures is up to you; training can be one of them. No certificate is needed, and since the amendment by Regulation (EU) 2026/1744 no specific level of AI literacy has to be guaranteed.</p>

<h2>What does Article 4 say since the amendment?</h2>
<p>Since 27 July 2026, paragraph 1 requires providers and deployers of AI systems to take measures to support the development of AI literacy of their staff and of other persons dealing with AI systems on their behalf. They take into account people's technical knowledge, experience, education and training, the context of use and the persons the systems are used on. A new sentence states that the obligation does not require them to guarantee any specific level of AI literacy of any individual. Paragraph 2 asks the Commission and the Member States to support companies, in particular SMEs, including with practical examples; under paragraph 3 the AI Board adopts recommendations.</p>

<h2>What changed in 2026?</h2>
<p>Article 4 has applied since 2 February 2025. The original wording asked companies to ensure, to their best extent, a sufficient level of AI literacy; the new wording speaks of supporting its development and no longer sets a specific or sufficient level. The obligation itself remains: the Commission had proposed in November 2025 to shift it to the Commission and the Member States, but the adopted text keeps it with providers and deployers. Since 2 August 2026, national market surveillance authorities supervise Article 4; penalties follow national law and, according to the Commission, must be proportionate in each case.</p>

<h2>Who is covered?</h2>
<p>Providers develop an AI system and place it on the market under their own name. Deployers use an AI system under their own authority, except in a personal non-professional activity. A company whose staff use AI tools at work is usually a deployer. The Commission's example: staff who use ChatGPT to write advertising copy or translate texts are covered and should know, for instance, that such tools can make things up. Contractors and service providers working on the company's behalf count too.</p>

<h2>Which measures fit?</h2>
<p>There is no fixed programme. The Commission suggests clarifying at least: a general understanding of AI and of the AI in use, your role as provider or deployer, the risks of the systems, and measures for groups with different knowledge and tasks. Possible measures are training for everyone who works with AI, an introduction to the specific tools and internal rules on which data may go into an AI tool and who checks results. According to the Commission, there is no obligation to measure staff knowledge, and Article 4 does not require an AI officer.</p>

<h2>Is a certificate required?</h2>
<p>No. According to the Commission, no certificate is needed and there is no obligation for external training or certification; companies can keep an internal record of training and other measures. After our courses every participant receives an OpSolid participation record with date, duration, topics and trainer. It records attendance and can add to your internal documentation; it is not a certificate from an authority, a chamber or an association.</p>

<h2>How can training help?</h2>
<p>Training brings many people to the same level at once. <a href="${href("kompetenz", "en")}">AI literacy basics</a> is a half day, live online for your team only, covering the basics, good requests, spotting errors, data protection in daily work, rules for your team and human oversight. It costs from €1,790 net per team, 10 people included, each additional person €90 (up to 15). It is one measure among several, not complete proof and no promise that your company meets every obligation. What training costs in general: <a href="${post(COST, "en")}">What does AI training cost?</a></p>
<p>This article is not legal advice. For your own case, please ask your legal adviser.</p>

<h2>Sources</h2>
<ul>
<li><a href="${sd("en", 4)}">European Commission AI Act Service Desk: Article 4 AI literacy, consolidated text as at 27 July 2026</a></li>
<li><a href="${sd("en", 3)}">AI Act Service Desk: Article 3, definitions (point 4 deployer, point 56 AI literacy)</a></li>
<li><a href="${QA}">European Commission: AI Literacy, Questions &amp; Answers, last update 20 October 2026</a></li>
<li><a href="${SD_FAQ}">AI Act Service Desk: FAQ on Article 4</a></li>
<li><a href="https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng">Regulation (EU) 2026/1744 (Digital Omnibus on AI), EUR-Lex</a></li>
</ul>`,

    tr: `<p><em>Hukuki durum: 14 Kasım 2026. Esas olan, AB Resmî Gazetesi'nde yayımlanan metindir.</em></p>

<p>Hayır, AI Act belirli bir yapay zeka eğitimi şart koşmaz. 4. madde, yapay zeka sistemleri sunan ya da işte kullanan şirketlerin, personelinin yapay zeka okuryazarlığını destekleyen önlemler almasını ister. Hangi önlemlerin alınacağına siz karar verirsiniz; eğitim bunlardan biri olabilir. Sertifika gerekmez ve (AB) 2026/1744 sayılı Tüzük ile yapılan değişiklikten bu yana belirli bir okuryazarlık düzeyinin garanti edilmesi de gerekmez.</p>

<h2>4. madde değişiklikten sonra ne diyor?</h2>
<p>27 Temmuz 2026'dan beri 1. fıkra, yapay zeka sistemlerinin sağlayıcılarından ve kullanıcı kuruluşlarından (deployer), kendi personelinin ve kendileri adına yapay zeka sistemleriyle çalışan diğer kişilerin yapay zeka okuryazarlığının gelişmesini desteklemek için önlem almasını ister. Kişilerin teknik bilgisi, deneyimi, eğitimi, kullanım bağlamı ve sistemlerin kullanıldığı kişiler dikkate alınır. Yeni bir cümleye göre bu yükümlülük, tek tek kişiler için belirli bir okuryazarlık düzeyinin garanti edilmesini gerektirmez. 2. fıkra Komisyon'dan ve üye devletlerden şirketleri, özellikle KOBİ'leri, pratik örneklerle de desteklemesini ister; 3. fıkraya göre Yapay Zeka Kurulu öneriler kabul eder.</p>

<h2>2026'da ne değişti?</h2>
<p>4. madde 2 Şubat 2025'ten beri uygulanıyor. İlk metin, mümkün olan en iyi şekilde yeterli bir okuryazarlık düzeyi sağlanmasını istiyordu; yeni metin bu okuryazarlığın gelişmesini desteklemekten söz eder ve belirli ya da yeterli bir düzey öngörmez. Yükümlülüğün kendisi sürüyor: Komisyon Kasım 2025'te onu Komisyon'a ve üye devletlere kaydırmayı önermişti, ancak kabul edilen metin yükümlülüğü sağlayıcılarda ve kullanıcı kuruluşlarda bırakır. 2 Ağustos 2026'dan beri 4. maddenin denetimi ulusal piyasa gözetim makamlarındadır; yaptırımlar ulusal hukuka göre belirlenir ve Komisyon'a göre her somut olayda orantılı olmalıdır.</p>

<h2>Kimleri kapsar?</h2>
<p>Sağlayıcılar bir yapay zeka sistemi geliştirip kendi adlarıyla piyasaya sürer. Kullanıcı kuruluşlar bir yapay zeka sistemini kendi sorumluluklarında kullanır; kişisel ve mesleki olmayan kullanım bunun dışındadır. Çalışanları işte yapay zeka araçları kullanan bir şirket genellikle kullanıcı kuruluştur. Komisyon'un örneği: Çalışanlar reklam metni yazmak ya da çeviri yapmak için ChatGPT kullanıyorsa 4. madde geçerlidir; örneğin bu araçların bilgi uydurabileceğini bilmelidirler. Şirket adına çalışan yükleniciler ve hizmet sağlayıcılar da kapsama girer.</p>

<h2>Hangi önlemler uygun?</h2>
<p>Sabit bir program yoktur. Komisyon en azından şunların netleştirilmesini önerir: yapay zekanın ve kullanılan yapay zekanın genel olarak anlaşılması, sağlayıcı ya da kullanıcı kuruluş olarak rolünüz, sistemlerin riskleri ve farklı bilgi ve görevlere sahip gruplar için önlemler. Olası önlemler: yapay zeka ile çalışan herkes için eğitim, somut araçlara giriş ve hangi verilerin bir yapay zeka aracına girebileceğini ve sonuçları kimin kontrol ettiğini belirleyen şirket içi kurallar. Komisyon'a göre çalışanların bilgisini ölçme zorunluluğu yoktur; 4. madde bir yapay zeka sorumlusu da şart koşmaz.</p>

<h2>Sertifika gerekiyor mu?</h2>
<p>Hayır. Komisyon'a göre sertifika gerekmez, dış eğitim ya da dış sertifika zorunluluğu da yoktur; şirketler eğitimleri ve diğer önlemleri şirket içinde kayıt altına alabilir. Eğitimlerimizden sonra her katılımcı tarih, süre, konular ve eğitmen bilgisini içeren bir OpSolid katılım belgesi alır. Belge katılımı gösterir ve şirket içi belgelerinizi tamamlayabilir; bir kamu kurumunun, odanın ya da derneğin sertifikası değildir.</p>

<h2>Bir eğitim nasıl yardımcı olabilir?</h2>
<p>Bir eğitim birçok çalışanı aynı anda aynı seviyeye getirir. <a href="${href("kompetenz", "tr")}">YZ Yetkinliği Temel</a> yarım gündür; yalnızca ekibinize özel, çevrimiçi ve canlıdır; temelleri, iyi istek yazmayı, hataları fark etmeyi, günlük işte veri korumayı, ekip kurallarını ve insan kontrolünü kapsar. Ekip başına 1.790 €'dan itibaren (net), 10 kişi dahil, her ek kişi 90 €, en fazla 15 kişi. Birçok önlemden biridir; eksiksiz bir kanıt ve şirketinizin tüm yükümlülükleri yerine getirdiğine dair bir vaat değildir. Eğitimlerin genel maliyeti: <a href="${post(COST, "tr")}">Yapay zeka eğitimi ne kadar tutar?</a></p>
<p>Bu yazı hukuki danışmanlık değildir. Kendi durumunuz için lütfen hukuk danışmanınıza başvurun.</p>

<h2>Kaynaklar</h2>
<ul>
<li><a href="${sd("en", 4)}">Avrupa Komisyonu AI Act Service Desk: 4. madde, yapay zeka okuryazarlığı, 27 Temmuz 2026 itibarıyla konsolide metin (İngilizce)</a></li>
<li><a href="${sd("en", 3)}">AI Act Service Desk: 3. madde, tanımlar (4. bent kullanıcı kuruluş, 56. bent yapay zeka okuryazarlığı) (İngilizce)</a></li>
<li><a href="${QA}">Avrupa Komisyonu: AI Literacy, Questions &amp; Answers, son güncelleme 20 Ekim 2026 (İngilizce)</a></li>
<li><a href="${SD_FAQ}">AI Act Service Desk: 4. madde hakkında sık sorulan sorular (İngilizce)</a></li>
<li><a href="https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng">Tüzük (AB) 2026/1744 (Yapay Zeka Dijital Omnibusu), EUR-Lex, İngilizce</a></li>
</ul>`,
  },
};
