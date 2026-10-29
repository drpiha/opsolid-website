# Provenance

- Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT, see LICENSE)
- Release: tag `v2.15.0`, commit a38d04c3d5c298c851dbe5e6ee1965ee3de42cb5 (2026-08-13)
- Tarball sha256 (GitHub API tarball of that tag): 8fd1b4304bcc2737fa7f03f507d1d316e319decd63896e969123a09fb570d130
- Copied: `.claude/skills/ui-ux-pro-max/` only, without `scripts/tests/`. Installed by hand on 2026-10-29,
  so the `ui-ux-pro-max-cli` package (which downloads the latest release at run time) never ran.
- Not installed: the sibling skills `banner-design`, `brand`, `design`, `design-system`, `slides`, `ui-styling`
  (logo/slide/banner generation; `ui-styling/scripts/shadcn_add.py` runs `npx shadcn` through subprocess,
  some siblings call paid image APIs).
- Reviewed: `scripts/*.py` use the Python standard library only, read the CSVs in `data/`, make no network calls,
  start no processes, and write files only with `--persist` (to `design-system/<project>/`). `SKILL.md` and
  `references/` contain design guidance only.

Run it from outside the skill folder with an absolute path:

```bash
python3 -E -s .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain typography
```

To update: pick a newer release tag at least 14 days old, diff the folder against this one, review the scripts and
instructions again, and replace the pin here.
