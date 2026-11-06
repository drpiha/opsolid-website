# Font files

Every font the site uses is a file in this folder (or in the `geist` npm package). The build does not contact Google Fonts.

- Marketing faces (Fraunces, Inter, Geist Mono) and Archivo: declared in `src/app/layout.tsx`, where each file's origin is described.
- App-surface families (IBM Plex Mono, Plus Jakarta Sans, Fira Code, Instrument Serif, JetBrains Mono): declared per subset in `subset-families.ts`, joined in `src/app/globals.css`.

## App-surface families: where each file came from

Downloaded on 2026-11-06 from the Google Fonts API, unchanged. These are the files `fonts.googleapis.com/css2` listed for the families and weights the site requests (Chrome user agent, WOFF2), and each one is byte-identical to the file the previous build fetched at build time. The unicode-range of every subset in `subset-families.ts` is copied from the same stylesheet.

All five families are licensed under the SIL Open Font License 1.1. The licence texts are the `OFL.txt` files of `github.com/google/fonts` (`ofl/<family>/`), checked against the upstream repositories: IBM/plex, tokotype/PlusJakartaSans, tonsky/FiraCode, Instrument/instrument-serif, JetBrains/JetBrainsMono.

| File | Family, Google Fonts version | Bytes | SHA-256 | Source |
| --- | --- | ---: | --- | --- |
| `ibm-plex-mono-400-cyrillic-ext.woff2` | IBM Plex Mono v20 | 4348 | `c6f09ee0e0a24b7c85ecb2a601eb99332f65b1f6b37c31e0bbe73fb307625eca` | https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1iIq131nj-otFQ.woff2 |
| `ibm-plex-mono-400-cyrillic.woff2` | IBM Plex Mono v20 | 5476 | `7b59d6bf7f8b8408ac28f27d01dca9a890abeae77045d343b1d8ccb089a92e54` | https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1isq131nj-otFQ.woff2 |
| `ibm-plex-mono-400-vietnamese.woff2` | IBM Plex Mono v20 | 4000 | `0a8b854cc18641bd1b8222afa7ec82a75e59bc6501f777744ec87db1b6cd7a2c` | https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1iAq131nj-otFQ.woff2 |
| `ibm-plex-mono-400-latin-ext.woff2` | IBM Plex Mono v20 | 8860 | `f1050dc5317b43434c0aeda599d4624c774ffc162e87a8cf204b949b6a85816d` | https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1iEq131nj-otFQ.woff2 |
| `ibm-plex-mono-400-latin.woff2` | IBM Plex Mono v20 | 10052 | `c36f509c0a8f9f85f29cb44bc8701d8a9e0b14c499e77a884f789ead7093a7ac` | https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1i8q131nj-o.woff2 |
| `ibm-plex-mono-500-cyrillic-ext.woff2` | IBM Plex Mono v20 | 4336 | `311098be73eac339128f0b5a6e33d72645b6f87488541fdf467c402152d297fd` | https://fonts.gstatic.com/s/ibmplexmono/v20/-F6qfjptAgt5VM-kVkqdyU8n3twJwl1FgsAXHNlYzg.woff2 |
| `ibm-plex-mono-500-cyrillic.woff2` | IBM Plex Mono v20 | 5500 | `d524dc8ff6dbf7ed69772f3b2ff4affaf5a89b5762b270e36c3f21da0d4e39f5` | https://fonts.gstatic.com/s/ibmplexmono/v20/-F6qfjptAgt5VM-kVkqdyU8n3twJwlRFgsAXHNlYzg.woff2 |
| `ibm-plex-mono-500-vietnamese.woff2` | IBM Plex Mono v20 | 4036 | `b2529fba93fd07a50ffb8fc3d103eb04b0c298d4f6564d2833c44fde286de7e4` | https://fonts.gstatic.com/s/ibmplexmono/v20/-F6qfjptAgt5VM-kVkqdyU8n3twJwl9FgsAXHNlYzg.woff2 |
| `ibm-plex-mono-500-latin-ext.woff2` | IBM Plex Mono v20 | 8848 | `77f03e26f981c582bdba3a7abed4baa2d3149211c01366bb3ab3ba7622ec4ae5` | https://fonts.gstatic.com/s/ibmplexmono/v20/-F6qfjptAgt5VM-kVkqdyU8n3twJwl5FgsAXHNlYzg.woff2 |
| `ibm-plex-mono-500-latin.woff2` | IBM Plex Mono v20 | 10060 | `a76f53ca6612e7b3828eec2311098675b7f9849ae4169a8bcef6302aec02a6c0` | https://fonts.gstatic.com/s/ibmplexmono/v20/-F6qfjptAgt5VM-kVkqdyU8n3twJwlBFgsAXHNk.woff2 |
| `plus-jakarta-sans-cyrillic-ext.woff2` | Plus Jakarta Sans v12 | 1716 | `a16f29d7d2a21a4f9b3249a82eb2725ed5bdb91500dfb5c4758977de27477f20` | https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko70yygg_vbd-E.woff2 |
| `plus-jakarta-sans-vietnamese.woff2` | Plus Jakarta Sans v12 | 8292 | `5c913fc1b1f86f4b475e5df45a796aa480d1f7f0891ed6f1a5991d6d1be887c3` | https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko50yygg_vbd-E.woff2 |
| `plus-jakarta-sans-latin-ext.woff2` | Plus Jakarta Sans v12 | 21688 | `0303e02b53b0298fb26a0193941a2e8754f0f9a9fce50d90b178d8da3424873f` | https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko40yygg_vbd-E.woff2 |
| `plus-jakarta-sans-latin.woff2` | Plus Jakarta Sans v12 | 27272 | `cd8db90cd950e26bc8761f65d323588bd5cd112d326d6d322bc7c8ea86771215` | https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_vb.woff2 |
| `fira-code-cyrillic-ext.woff2` | Fira Code v27 | 22056 | `45638fab5a7c56ed76ef5e61424c5826bc97499512b75caeacbf33efe34cb3f3` | https://fonts.gstatic.com/s/firacode/v27/uU9NCBsR6Z2vfE9aq3bh0NSDqFGedCMX.woff2 |
| `fira-code-cyrillic.woff2` | Fira Code v27 | 11924 | `98651a0dc8960be552a69783b5b35d3a00ccb999584d9a152b50632c8e87bbcf` | https://fonts.gstatic.com/s/firacode/v27/uU9NCBsR6Z2vfE9aq3bh2dSDqFGedCMX.woff2 |
| `fira-code-greek-ext.woff2` | Fira Code v27 | 8580 | `54147107b78ecf1f4ccce9f752507293ccb7b63b548f2381a6ca75a4230fd096` | https://fonts.gstatic.com/s/firacode/v27/uU9NCBsR6Z2vfE9aq3bh0dSDqFGedCMX.woff2 |
| `fira-code-greek.woff2` | Fira Code v27 | 13780 | `f8a20a104de9ca42e6d0ea37517a7da69f25c11662e4aff37c562b106be45ab8` | https://fonts.gstatic.com/s/firacode/v27/uU9NCBsR6Z2vfE9aq3bh3tSDqFGedCMX.woff2 |
| `fira-code-symbols2.woff2` | Fira Code v27 | 4208 | `905afdfcb3963107879503dcce99224d4b82084189a2090c1ff0d43863133d29` | https://fonts.gstatic.com/s/firacode/v27/uU9NCBsR6Z2vfE9aq3bhZ_Wmh3mUfBsu_Q.woff2 |
| `fira-code-latin-ext.woff2` | Fira Code v27 | 13232 | `e08f04687410bb5216c443be9c5b7239077a9105ce5c658321e5120cfdb44f01` | https://fonts.gstatic.com/s/firacode/v27/uU9NCBsR6Z2vfE9aq3bh09SDqFGedCMX.woff2 |
| `fira-code-latin.woff2` | Fira Code v27 | 36340 | `d32d5b5a7c9720cf3812f7d1e3ebdb54116f8f656e7471a03a5a93bdd93c98b3` | https://fonts.gstatic.com/s/firacode/v27/uU9NCBsR6Z2vfE9aq3bh3dSDqFGedA.woff2 |
| `instrument-serif-400-italic-latin-ext.woff2` | Instrument Serif v5 | 8444 | `a04fc7ed18a8037149ce0bfda58076709d8e0840e136ed00abbdc196b7992443` | https://fonts.gstatic.com/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zAjgn7Motmp5r61.woff2 |
| `instrument-serif-400-italic-latin.woff2` | Instrument Serif v5 | 15684 | `6ee678c33f388dd7ba59700ebea635deb98821baafd817b09891f7927177f702` | https://fonts.gstatic.com/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zAjjH7Motmp5g.woff2 |
| `instrument-serif-400-latin-ext.woff2` | Instrument Serif v5 | 7828 | `a8c4bd7cd7073180e740d2d83a616b5cb0845579b73207eeafeae8532e70c901` | https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zsTjnTLgNuZ5w.woff2 |
| `instrument-serif-400-latin.woff2` | Instrument Serif v5 | 15040 | `60c06664b5a95c7de6cc3e00d1f9034d78bd1e40b564016b241674449a067d4d` | https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zUTjnTLgNs.woff2 |
| `jetbrains-mono-cyrillic-ext.woff2` | JetBrains Mono v24 | 1664 | `9343de2ca5d9549f792e7962375af8efb0f320c7643bfd36c884b5a30e5c396f` | https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx3cwgknk-6nFg.woff2 |
| `jetbrains-mono-cyrillic.woff2` | JetBrains Mono v24 | 8892 | `4995a9a43ac659ec32fcd8b463755cd6a07b31a6e6b3894a6a153b661cf490e2` | https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxTcwgknk-6nFg.woff2 |
| `jetbrains-mono-greek.woff2` | JetBrains Mono v24 | 6800 | `49c3da6c9a2b279b0f1f860f5cfb1f5dc38d88a5c7be9c9b1837bbc4e3db6111` | https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxPcwgknk-6nFg.woff2 |
| `jetbrains-mono-vietnamese.woff2` | JetBrains Mono v24 | 5872 | `d44eb1936043a56038eb02dd70b243f379bef65783f94ec12f277550720411f1` | https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx_cwgknk-6nFg.woff2 |
| `jetbrains-mono-latin-ext.woff2` | JetBrains Mono v24 | 11596 | `9c38cb2d0d2d93c1ee6e21fa78db76f13ea7e15e15cc64214c7ca89b6aaa35c4` | https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx7cwgknk-6nFg.woff2 |
| `jetbrains-mono-latin.woff2` | JetBrains Mono v24 | 31340 | `2c32b9b3ee358c119e210f6f5195f9bd34894d78a785ff2e95d60e718e400af4` | https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwgknk-4.woff2 |

Total: 31 files, 347,764 bytes. Licences: `ibm-plex-mono-OFL.txt`, `plus-jakarta-sans-OFL.txt`, `fira-code-OFL.txt`, `instrument-serif-OFL.txt`, `jetbrains-mono-OFL.txt`.

To update a family, fetch its stylesheet from `fonts.googleapis.com/css2` with a current Chrome user agent, replace the files and copy the unicode-range values into `subset-families.ts`. Keep one face per requested weight and Google's subset order (the join in `globals.css` lists it reversed).
