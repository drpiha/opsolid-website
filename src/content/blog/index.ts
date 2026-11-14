import { postSlugIn } from "../../lib/blog-slugs";
import { trainingArticles } from "./training";

// Post metadata (slug, title, excerpt, dates) lives in the content bundles (src/content/{en,de,tr}.ts, blog.posts).
// Full article content stored as HTML strings per locale, keyed by the post's English slug. The six short
// posts from February-March 2026 were retired on 2026-11-14 (thin, generic); their URLs 301 via src/lib/redirects.ts.
// To add a new article: add the slug key with HTML content for each language. A post with its own slug per locale
// also needs a row in src/lib/blog-slugs.ts.
const articles: Record<string, Record<string, string>> = {
  "eu-ai-act-august-2026-omnibus-compliance": {
    en: `<p><em>Updated on 2 November 2026 after publication in the Official Journal. The text published in the Official Journal of the EU is authoritative.</em></p>

<p>This is a short summary for companies that use AI tools such as chatbots, phone assistants or AI in office work. It covers what the EU AI Act requires of them and what the Digital Omnibus on AI changed.</p>

<h2>What changed and when</h2>
<p>The AI Act, Regulation (EU) 2024/1689, entered into force on 1 August 2024 and applies largely from 2 August 2026. It is amended by Regulation (EU) 2026/1744 of 8 July 2026, the Digital Omnibus on AI. Negotiators reached a provisional agreement in early May 2026, the European Parliament adopted its position on 16 June 2026 and the Council approved on 29 June 2026. The Regulation was published in the Official Journal on 24 July 2026 (OJ L, 2026/1744) and entered into force on the third day after publication, 27 July 2026.</p>
<p>The Omnibus moves the deadlines for high-risk AI systems. Annex III systems (for example recruitment screening, creditworthiness, education and essential services) now apply from 2 December 2027. AI systems in products under Annex I and Article 6(1) apply from 2 August 2028.</p>

<h2>Article 4: AI literacy</h2>
<p>Article 4 was replaced. Providers and deployers of AI systems take measures to support the development of AI literacy of their staff and of other persons dealing with the operation and use of AI systems on their behalf. The obligation does not require them to guarantee a specific level of AI literacy of any individual. Article 4 has applied since 2 February 2025; the current wording applies since 27 July 2026.</p>

<h2>Article 50: Transparency</h2>
<p>The transparency duties of Article 50 apply since 2 August 2026. Who must do what:</p>
<ul>
<li><strong>Providers</strong> design AI systems that interact directly with people so that those people are informed they are interacting with an AI, unless this is obvious from the context (Art. 50(1)).</li>
<li><strong>Providers</strong> of systems that generate synthetic audio, image, video or text content mark that content in a machine-readable way, except for systems that only assist with standard editing (Art. 50(2)).</li>
<li><strong>Deployers</strong> inform people who are exposed to emotion recognition or biometric categorisation (Art. 50(3)).</li>
<li><strong>Deployers</strong> disclose deepfakes and certain AI-generated text published to inform the public (Art. 50(4)).</li>
</ul>
<p>A company that uses a third-party chatbot under its own responsibility is usually a deployer; one that offers it under its own name or trademark can be a provider. Whether it needs its own notice is a question for its legal adviser. The paragraphs of Article 50 contain further exceptions; the text of the Regulation governs.</p>
<p>The Omnibus replaced paragraph 7 of Article 50, on codes of practice. Under the new Article 111(4), providers of systems that generate synthetic audio, image, video or text content and that were placed on the market before 2 August 2026 must take the necessary steps to comply with Article 50(2) by 2 December 2026.</p>

<h2>New prohibitions</h2>
<p>Two new prohibitions in Article 5(1) apply from 2 December 2026. They cover AI systems that generate or manipulate realistic intimate or sexually explicit images, video or audio of identifiable people without their consent (so-called nudifier applications), and AI systems that generate or manipulate child sexual abuse material. For providers, the ban applies where this is the intended purpose or a reasonably foreseeable and reproducible outcome without adequate safeguards.</p>

<h2>Relief for SMEs and small mid-caps</h2>
<p>Small mid-caps now get some of the relief that was already available to SMEs. These are companies that are not SMEs, with fewer than 750 employees and either annual turnover of up to EUR 150 million or a balance sheet total of up to EUR 129 million (Recommendation (EU) 2025/1099). For providers of high-risk AI systems this means simplified technical documentation and a quality management system proportionate to company size. In addition, the AI Office may set up a Union-level regulatory sandbox for systems under Article 75(1), with priority access for them. The simplifications of technical documentation and quality management concern providers of high-risk AI systems; companies that only use AI tools are not addressed by them. (SMEs have fewer than 250 employees and turnover of up to EUR 50 million or a balance sheet of up to EUR 43 million.)</p>

<h2>What this means in practice</h2>
<p>If you use AI tools, it helps to know which ones you run, in what role (provider or deployer) and where they talk to customers or publish content. Take reasonable steps to help the people who work with these tools understand them, and check whether Article 50 duties apply to what you do. This summary is no promise of compliance. We do not give legal advice; for your own case, ask your legal adviser.</p>

<h2>Sources</h2>
<ul>
<li><a href="https://www.consilium.europa.eu/en/press/press-releases/2026/06/29/artificial-intelligence-council-gives-final-green-light-to-simplify-and-streamline-rules/">EU Council: Final approval of AI Act simplification, 29 June 2026</a></li>
<li><a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng">Regulation (EU) 2024/1689 (AI Act), EUR-Lex</a></li>
<li><a href="https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng">Regulation (EU) 2026/1744 (Digital Omnibus on AI), EUR-Lex</a></li>
</ul>`,

    de: `<p><em>Aktualisiert am 2. November 2026 nach der Veröffentlichung im Amtsblatt. Maßgeblich ist der im Amtsblatt der EU veröffentlichte Text.</em></p>

<p>Dies ist eine kurze Zusammenfassung für Unternehmen, die KI-Werkzeuge wie Chatbots, Telefonassistenten oder KI in der Büroarbeit nutzen. Sie zeigt, was die KI-Verordnung von ihnen verlangt und was der Digital-Omnibus zur KI geändert hat.</p>

<h2>Was sich wann geändert hat</h2>
<p>Die KI-Verordnung (AI Act), Verordnung (EU) 2024/1689, ist am 1. August 2024 in Kraft getreten und gilt weitgehend ab dem 2. August 2026. Sie wird durch die Verordnung (EU) 2026/1744 vom 8. Juli 2026, den Digital-Omnibus zur KI, geändert. Die Verhandlungsführer erzielten Anfang Mai 2026 eine vorläufige Einigung, das Europäische Parlament nahm am 16. Juni 2026 seine Position an und der Rat stimmte am 29. Juni 2026 zu. Die Verordnung wurde am 24. Juli 2026 im Amtsblatt veröffentlicht (ABl. L, 2026/1744) und trat am dritten Tag nach der Veröffentlichung in Kraft, am 27. Juli 2026.</p>
<p>Der Omnibus verschiebt die Fristen für Hochrisiko-KI-Systeme. Systeme nach Anhang III (zum Beispiel Bewerberauswahl, Kreditwürdigkeitsprüfung, Bildung und wesentliche Dienste) gelten nun ab dem 2. Dezember 2027. KI-Systeme in Produkten nach Anhang I und Artikel 6 Absatz 1 gelten ab dem 2. August 2028.</p>

<h2>Artikel 4: KI-Kompetenz</h2>
<p>Artikel 4 wurde neu gefasst. Anbieter und Betreiber von KI-Systemen ergreifen Maßnahmen, um die KI-Kompetenz ihres Personals und anderer Personen zu fördern, die in ihrem Auftrag mit dem Betrieb und der Nutzung von KI-Systemen befasst sind. Die Pflicht verlangt nicht, dass sie ein bestimmtes Maß an KI-Kompetenz einzelner Personen garantieren. Artikel 4 gilt seit dem 2. Februar 2025; die aktuelle Fassung gilt seit dem 27. Juli 2026.</p>

<h2>Artikel 50: Transparenz</h2>
<p>Die Transparenzpflichten des Artikels 50 gelten seit dem 2. August 2026. Wer was tun muss:</p>
<ul>
<li><strong>Anbieter</strong> gestalten KI-Systeme, die direkt mit Menschen interagieren, so, dass diese Menschen darüber informiert werden, dass sie mit einer KI interagieren, es sei denn, das ist aus dem Kontext offensichtlich (Art. 50 Abs. 1).</li>
<li><strong>Anbieter</strong> von Systemen, die synthetische Audio-, Bild-, Video- oder Textinhalte erzeugen, kennzeichnen diese Inhalte in einem maschinenlesbaren Format, außer bei Systemen, die nur bei der Standardbearbeitung unterstützen (Art. 50 Abs. 2).</li>
<li><strong>Betreiber</strong> informieren Personen, die einer Emotionserkennung oder biometrischen Kategorisierung ausgesetzt sind (Art. 50 Abs. 3).</li>
<li><strong>Betreiber</strong> legen Deepfakes und bestimmte KI-generierte Texte offen, die veröffentlicht werden, um die Öffentlichkeit zu informieren (Art. 50 Abs. 4).</li>
</ul>
<p>Wer einen Chatbot eines Drittanbieters unter eigener Verantwortung nutzt, ist in der Regel Betreiber; wer ihn unter eigenem Namen oder eigener Marke bereitstellt, kann Anbieter sein. Ob es einen eigenen Hinweis braucht, ist eine Frage für die eigene Rechtsberatung. Die Absätze von Artikel 50 enthalten weitere Ausnahmen; maßgeblich ist der Verordnungstext.</p>
<p>Der Omnibus hat Absatz 7 des Artikels 50 zu den Praxisleitfäden ersetzt. Nach dem neuen Artikel 111 Absatz 4 müssen Anbieter von Systemen, die synthetische Audio-, Bild-, Video- oder Textinhalte erzeugen und vor dem 2. August 2026 in Verkehr gebracht wurden, die erforderlichen Schritte ergreifen, um Artikel 50 Absatz 2 bis zum 2. Dezember 2026 zu erfüllen.</p>

<h2>Neue Verbote</h2>
<p>Zwei neue Verbote in Artikel 5 Absatz 1 gelten ab dem 2. Dezember 2026. Sie betreffen KI-Systeme, die realistische intime oder sexuell explizite Bilder, Videos oder Audioinhalte identifizierbarer Personen ohne deren Einwilligung erzeugen oder manipulieren (sogenannte Nudifier-Anwendungen), sowie KI-Systeme, die Material über sexuellen Kindesmissbrauch erzeugen oder manipulieren. Für Anbieter gilt das Verbot, wenn dies der Zweck ist oder ein hinreichend vorhersehbares und reproduzierbares Ergebnis ohne angemessene Schutzvorkehrungen.</p>

<h2>Erleichterungen für KMU und kleine Mid-Caps</h2>
<p>Kleine Mid-Caps erhalten nun einen Teil der Erleichterungen, die bisher KMU vorbehalten waren. Gemeint sind Unternehmen, die keine KMU sind, weniger als 750 Beschäftigte haben und entweder einen Jahresumsatz von höchstens 150 Mio. EUR oder eine Bilanzsumme von höchstens 129 Mio. EUR aufweisen (Empfehlung (EU) 2025/1099). Für Anbieter von Hochrisiko-KI-Systemen bedeutet das vereinfachte technische Dokumentation und ein der Unternehmensgröße angemessenes Qualitätsmanagementsystem. Außerdem kann das KI-Büro für Systeme nach Artikel 75 Absatz 1 eine Reallabor-Umgebung auf Unionsebene einrichten, zu der sie vorrangigen Zugang haben. Die Vereinfachungen bei technischer Dokumentation und Qualitätsmanagement betreffen Anbieter von Hochrisiko-KI-Systemen; Unternehmen, die KI-Werkzeuge nur nutzen, sind davon nicht angesprochen. (KMU haben weniger als 250 Beschäftigte und einen Umsatz von höchstens 50 Mio. EUR oder eine Bilanzsumme von höchstens 43 Mio. EUR.)</p>

<h2>Was das in der Praxis bedeutet</h2>
<p>Wer KI-Werkzeuge nutzt, sollte wissen, welche er einsetzt, in welcher Rolle (Anbieter oder Betreiber) und wo sie mit Kundschaft sprechen oder Inhalte veröffentlichen. Ergreifen Sie angemessene Maßnahmen, damit die Menschen, die mit diesen Werkzeugen arbeiten, sie verstehen, und prüfen Sie, ob Pflichten aus Artikel 50 auf Ihr Vorgehen zutreffen. Diese Zusammenfassung ist kein Versprechen von Konformität. Wir geben keine Rechtsberatung; für Ihren eigenen Fall fragen Sie bitte Ihre Rechtsberatung.</p>

<h2>Quellen</h2>
<ul>
<li><a href="https://www.consilium.europa.eu/en/press/press-releases/2026/06/29/artificial-intelligence-council-gives-final-green-light-to-simplify-and-streamline-rules/">Rat der EU: Endgültige Zustimmung zur Vereinfachung der KI-Verordnung, 29. Juni 2026 (Englisch)</a></li>
<li><a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj/deu">Verordnung (EU) 2024/1689 (KI-Verordnung), EUR-Lex</a></li>
<li><a href="https://eur-lex.europa.eu/eli/reg/2026/1744/oj/deu">Verordnung (EU) 2026/1744 (Digital-Omnibus zur KI), EUR-Lex</a></li>
</ul>`,

    tr: `<p><em>2 Kasım 2026'da, AB Resmî Gazetesi'nde yayımlanmasının ardından güncellendi. Esas olan, AB Resmî Gazetesi'nde yayımlanan metindir.</em></p>

<p>Bu, chatbot, telefon asistanı ya da ofis işlerinde yapay zeka gibi araçlar kullanan şirketler için kısa bir özettir. Yapay Zeka Yasası'nın onlardan ne istediğini ve Yapay Zeka Dijital Omnibusu'nun neyi değiştirdiğini gösterir.</p>

<h2>Ne zaman ne değişti</h2>
<p>Yapay Zeka Yasası (AI Act), yani (AB) 2024/1689 sayılı Tüzük, 1 Ağustos 2024'te yürürlüğe girdi ve büyük ölçüde 2 Ağustos 2026'dan itibaren uygulanıyor. 8 Temmuz 2026 tarihli (AB) 2026/1744 sayılı Tüzük, yani Yapay Zeka Dijital Omnibusu ile değiştirildi. Müzakereciler 2026 Mayıs başında geçici bir anlaşmaya vardı, Avrupa Parlamentosu 16 Haziran 2026'da görüşünü kabul etti, Konsey 29 Haziran 2026'da onayladı. Tüzük 24 Temmuz 2026'da AB Resmî Gazetesi'nde yayımlandı (OJ L, 2026/1744) ve yayımdan sonraki üçüncü gün, 27 Temmuz 2026'da yürürlüğe girdi.</p>
<p>Omnibus, yüksek riskli yapay zeka sistemleri için tarihleri kaydırıyor. Ek III kapsamındaki sistemler (örneğin işe alım taraması, kredi değerliliği, eğitim ve temel hizmetler) artık 2 Aralık 2027'den itibaren uygulanıyor. Ek I ve 6. maddenin 1. fıkrası kapsamındaki ürünlerde yer alan yapay zeka sistemleri 2 Ağustos 2028'den itibaren uygulanıyor.</p>

<h2>4. madde: Yapay zeka okuryazarlığı</h2>
<p>4. madde yeniden düzenlendi. Yapay zeka sistemlerinin sağlayıcıları ve kullanıcı kuruluşları (deployer), kendi personelinin ve kendileri adına yapay zeka sistemlerinin işletilmesi ve kullanımıyla ilgilenen diğer kişilerin yapay zeka okuryazarlığının gelişmesini desteklemek için önlemler alır. Bu yükümlülük, tek tek kişiler için belirli bir okuryazarlık düzeyinin garanti edilmesini gerektirmez. 4. madde 2 Şubat 2025'ten beri uygulanıyor; mevcut metin 27 Temmuz 2026'dan beri geçerli.</p>

<h2>50. madde: Şeffaflık</h2>
<p>50. maddedeki şeffaflık yükümlülükleri 2 Ağustos 2026'dan beri uygulanıyor. Kim ne yapmalı:</p>
<ul>
<li><strong>Sağlayıcılar</strong>, insanlarla doğrudan etkileşen yapay zeka sistemlerini, bu kişilere bir yapay zeka ile etkileşim içinde oldukları bildirilecek şekilde tasarlar; bağlamdan açıkça anlaşılıyorsa bu gerekmez (madde 50/1).</li>
<li><strong>Sağlayıcılar</strong>, sentetik ses, görüntü, video ya da metin içeriği üreten sistemlerde bu içeriği makine tarafından okunabilir biçimde işaretler; yalnızca standart düzenlemeye yardımcı olan sistemler hariçtir (madde 50/2).</li>
<li><strong>Kullanıcı kuruluşlar (deployer)</strong>, duygu tanıma ya da biyometrik kategorizasyona maruz kalan kişileri bilgilendirir (madde 50/3).</li>
<li><strong>Kullanıcı kuruluşlar (deployer)</strong>, deepfake içerikleri ve kamuyu bilgilendirmek amacıyla yayımlanan belirli yapay zeka üretimi metinleri açıklar (madde 50/4).</li>
</ul>
<p>Üçüncü taraf bir chatbotu kendi sorumluluğunda kullanan şirket genellikle kullanıcı kuruluştur (deployer); onu kendi adı ya da markasıyla sunan şirket sağlayıcı olabilir. Kendi bildirimine ihtiyaç duyup duymadığı, hukuk danışmanına sorulacak bir sorudur. 50. maddenin fıkraları başka istisnalar da içerir; esas alınacak olan Tüzük metnidir.</p>
<p>Omnibus, 50. maddenin uygulama kılavuzlarına ilişkin 7. fıkrasını değiştirdi. Yeni 111. maddenin 4. fıkrasına göre, sentetik ses, görüntü, video ya da metin içeriği üreten ve 2 Ağustos 2026'dan önce piyasaya sürülmüş sistemlerin sağlayıcıları, 50. maddenin 2. fıkrasına uyum için gerekli adımları 2 Aralık 2026'ya kadar atmak zorundadır.</p>

<h2>Yeni yasaklar</h2>
<p>5. maddenin 1. fıkrasındaki iki yeni yasak 2 Aralık 2026'dan itibaren uygulanıyor. Bunlar, kimliği belirlenebilir kişilerin gerçekçi mahrem ya da cinsel içerikli görüntü, video veya seslerini rızaları olmadan üreten ya da manipüle eden yapay zeka sistemlerini (nudifier uygulamaları olarak bilinen) ve çocuk istismarı materyali üreten ya da manipüle eden yapay zeka sistemlerini kapsıyor. Sağlayıcılar için yasak, bu durum sistemin amacıysa ya da yeterli güvenceler olmadan makul ölçüde öngörülebilir ve yeniden üretilebilir bir sonuçsa geçerli.</p>

<h2>KOBİ'ler ve küçük orta ölçekli şirketler için kolaylıklar</h2>
<p>Küçük orta ölçekli şirketler (small mid-cap) artık KOBİ'lere tanınan kolaylıkların bir kısmından yararlanıyor. Bunlar KOBİ olmayan, 750'den az çalışanı olan ve yıllık cirosu en fazla 150 milyon avro ya da bilanço toplamı en fazla 129 milyon avro olan şirketlerdir ((AB) 2025/1099 sayılı Tavsiye). Yüksek riskli yapay zeka sistemlerinin sağlayıcıları için bu, basitleştirilmiş teknik dokümantasyon ve şirket büyüklüğüyle orantılı bir kalite yönetim sistemi demektir. Ayrıca Yapay Zeka Ofisi, 75. maddenin 1. fıkrası kapsamındaki sistemler için Birlik düzeyinde bir düzenleyici test ortamı kurabilir; bu sağlayıcılar ortama öncelikli erişim alır. Teknik dokümantasyon ve kalite yönetimindeki kolaylıklar yüksek riskli yapay zeka sistemlerinin sağlayıcılarını ilgilendirir; yapay zeka araçlarını yalnızca kullanan şirketler bu kolaylıkların muhatabı değildir. (KOBİ'lerin çalışan sayısı 250'den azdır; cirosu en fazla 50 milyon avro ya da bilanço toplamı en fazla 43 milyon avro olmalıdır.)</p>

<h2>Uygulamada ne anlama geliyor</h2>
<p>Yapay zeka araçları kullanıyorsanız, hangilerini, hangi rolde (sağlayıcı ya da kullanıcı kuruluş) ve nerede müşterilerle konuştuklarını ya da içerik yayımladıklarını bilmek işinize yarar. Bu araçlarla çalışan kişilerin onları anlamasına yardımcı olmak için makul önlemler alın ve 50. maddedeki yükümlülüklerin yaptığınız işe uyup uymadığını kontrol edin. Bu özet, uyum vaadi değildir. Hukuki danışmanlık vermiyoruz; kendi durumunuz için lütfen hukuk danışmanınıza başvurun.</p>

<h2>Kaynaklar</h2>
<ul>
<li><a href="https://www.consilium.europa.eu/en/press/press-releases/2026/06/29/artificial-intelligence-council-gives-final-green-light-to-simplify-and-streamline-rules/">AB Konseyi: Yapay Zeka Yasası'nın sadeleştirilmesine nihai onay, 29 Haziran 2026 (İngilizce)</a></li>
<li><a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng">Tüzük (AB) 2024/1689 (AI Act), EUR-Lex, İngilizce</a></li>
<li><a href="https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng">Tüzük (AB) 2026/1744 (Yapay Zeka Dijital Omnibusu), EUR-Lex, İngilizce</a></li>
</ul>`,
  },
};

// Merge all articles
Object.assign(articles, trainingArticles);

export function getPostContent(slug: string, locale: string = "en"): string {
  const post = articles[slug] ?? articles[postSlugIn(slug, "en")];
  if (!post) {
    return `<p>This article is coming soon. Check back later for the full content.</p>`;
  }
  return post[locale] || post["en"] || `<p>Content not available in this language yet.</p>`;
}

/** Reading time in minutes, counted from the body in that locale at 200 words per minute. */
export function getReadMinutes(slug: string, locale: string = "en"): number {
  const words = getPostContent(slug, locale).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
