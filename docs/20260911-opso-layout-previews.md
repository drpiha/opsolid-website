# OpSo profile preview provenance

The user requested professional examples with human portraits, fictional German and English names, fuller content and visibly different styles. The current asset handoff is VERSO's `output/showcase-20260911-v2/verified-assets.json`, with captures in `output/playwright/showcase-20260911-v2/`. It identifies actual live public-card browser captures of fictional profiles with AI-generated portraits. These are not customer endorsements or native app/device screenshots.

The selected examples are Clara Weber (architecture, light stone), James Bennett (consulting, navy), Maya Collins (brand design, coral/violet), and Felix Berger (product design, light mint). Every landing-page locale carries a concise fictional-profile/AI-portrait disclosure. Live links use only the four verified public demo URLs; no founder card, customer account data or private URL is included.

Each desktop/phone screenshot is copied without visual changes after matching the source manifest's SHA-256 and size. Static imports bind intrinsic dimensions and content-hashed image URLs to the reviewed files. The page does not depend on `/_next/image`; the existing optimizer mitigation remains enabled. Large original portrait files are not loaded just for small selector thumbnails.

Website features remain labelled as being prepared for release. Saving a draft and publishing are separate. No public Google Play release, paid checkout or unverified APK download is advertised.

All eight viewport captures were visually inspected and matched against the final verified source manifest. Clara uses the corrected published revision with the landscape portrait; the rejected face crop was never copied. The previous six geometric screenshot files are removed from the public bundle. The new files total **4923103 bytes**, loaded as the selected pair; hero images reuse the Clara and Maya mobile assets.

| File in `src/assets/opso/` | Dimensions | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| clara-weber-desktop.png | 1440 × 1100 | 665264 | `46d4a5402cece0009124d5daf6fef123d8b09e773126a5305d561fbd4f8a5eeb` |
| clara-weber-mobile.png | 390 × 844 | 240955 | `e7fff41ccb33efb7489fda05ac7d123a990d2617844f5f5d5ca9d1c66fcaea47` |
| james-bennett-desktop.png | 1440 × 1100 | 744503 | `58b1417426a3ce5108e386985d210e2a6a298f07d53f0a06727e5a172ecb573d` |
| james-bennett-mobile.png | 390 × 844 | 259160 | `4e8baafc048b6c3fd15fe39ff157dd002e0aa1cd7c60119701dbd30ea233935d` |
| maya-collins-desktop.png | 1440 × 1100 | 1311973 | `b8f7880fbe293b6a11a05187cbc5336027870a47e6986a8da7b95d0341d1b4ef` |
| maya-collins-mobile.png | 390 × 844 | 423140 | `9144f7adba5bd7eed0cc2bd8ba4b02aa6ac9612180ba6f0004186b722a46c00b` |
| felix-berger-desktop.png | 1440 × 1100 | 1030552 | `a4b9b3f065005835783b17275e45c7eb2c977b6b7ab25b716184b279ba56305c` |
| felix-berger-mobile.png | 390 × 844 | 247556 | `4df066ce8e42eddb1384ce7e56fef591999f443fdf4d1381532d7c8c7bc5be81` |

The four live-demo links use `https://opso.cc/opso-demo-<profile-id>` with `?lang=de` for the German landing page and `?lang=en` for English/Turkish. Screenshots retain their captured language: Clara/Felix German, James/Maya English. The published renderer's current appearance is preserved, including Maya's legacy mobile navigation; the separate navigation correction reported by the VERSO coordinator is not represented as deployed here.

Build/browser evidence and the unchanged DB/backup deployment gates are recorded in `docs/STATUS.md`. This provenance record does not establish native app/device acceptance or deployment of the updated OpSolid landing page.
