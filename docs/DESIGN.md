# Design — airobotstxtgenerator.com

Brief (section 6): a newspaper and an official register. robots.txt is a notice pinned to a door; the bot
directory is a register or a railway timetable with dense tables. Expressive antiqua for headings, strict
grotesque for text, monospace for code — all OFL, self-hosted, with Cyrillic. Warm white paper, black ink,
one signal red for "blocked", a calm green only for "allowed" in tables.

## 1. References (outside SaaS landing pages)

| # | Reference | What we take from it |
|---|---|---|
| 1 | **The London Gazette** (official public record since 1665, thegazette.co.uk) — notice pages | Notices as numbered, ruled blocks with a reference code; plain authoritative tone; the "notice" frame we use for the robots.txt output |
| 2 | **Federal Register** (federalregister.gov) printed issues | Dense three-column legal text, small-caps running heads, document numbers in the margin → line numbers and margin notes next to each robots.txt line |
| 3 | **Journal officiel de la République française** front page | Masthead centred between heavy and hairline rules, dateline with edition number → our masthead "Edition of 4 November 2026 · Register of 199 agents" |
| 4 | **The New York Times front page, 1890s–1950s** | Didone headlines, column rules, "ears" left and right of the masthead → masthead ears with registry count and "free, no sign-up" |
| 5 | **Bradshaw's Railway Guide** (19th-century timetables) | Ultra-dense tables with dotted leaders, symbols explained in a key → the bot register table and its legend (purpose symbols, compliance) |
| 6 | **SBB / Deutsche Bahn Kursbuch** (printed timetables, 1970s–90s) | Strict grid, tabular figures, bold row headers, alternating shaded rows → table styling; tabular numerals everywhere |
| 7 | **RFC 9309 / RFC Editor plain-text format** (rfc-editor.org) | Page headers "Internet-Draft … November 2026", section numbers "§2.2.2", monospace examples with no decoration → code blocks and section numbering in guides |
| 8 | **NYCTA Graphic Standards Manual** (Vignelli/Noorda, 1970) | Black bars carrying white labels; rules as the only ornament; information first → step bars of the wizard and table headers |
| 9 | **Library of Congress / museum catalogue cards** | Card with typed fields (Name, Operator, Purpose, Source, Verified) in a ruled grid → bot "record card" on each bot page |
| 10 | **Public legal notices on doors and notice boards** (Bekanntmachung, Avis au public) | Bordered paper sheet, heading in capitals, stamp at the bottom with a date → the generated file as a posted notice with a "VERIFIED" stamp |
| 11 | **Rubber stamps "ПРИНЯТО / APPROVED / VOID"** in archive records | Double-ruled rectangular stamps in one ink colour, uppercase, letter-spaced — used for ALLOWED / BLOCKED / PARTIAL, never rotated or distressed |
| 12 | **IBM 3270 / Norton Commander era software** | Keyboard-first, everything visible, status line at the bottom → status line in the tester ("Fetched in 312 ms · 200 · text/plain · 7.4 KB") |
| 13 | **Penguin paperback grid (Tschichold, 1940s)** | Generous margins for long text, one measure (~68 characters), restrained hierarchy → guide pages |
| 14 | **Whole Earth Catalog** | Practical "access to tools" tone: each item with what it is, what it costs (free), where to get it → related-tools blocks and the footer network list |

## 2. Three directions

### A. "Gazette" — newspaper of record + register (chosen)
A front page: masthead set in a 19th-century Modern face between a heavy and a hairline rule, a dateline with
edition date and registry size, column rules, tables like stock listings and timetables. The generated
robots.txt is a notice pinned on the page with line numbers and margin notes; a rectangular stamp confirms it
was verified.

- Palette: paper `#F5F0E5`, shaded row `#ECE5D4`, ink `#1A1916`, secondary ink `#4B463E`, rule `#1A1916`,
  light rule `#CDC3AD`, signal red `#B0251B` (blocked), green `#2D6A3D` (allowed only).
- Fonts: **Old Standard TT** 700 (headings; 19th-century "обыкновенная новая" Modern with excellent Cyrillic),
  **Libre Franklin** variable (text; the open revival of Franklin Gothic, the classic newspaper grotesque;
  now with Cyrillic), **IBM Plex Mono** 400/600 (code).
- First screen sketch:
  ```
  ════════════════════════════════════════════════════════════════════
  [ear: 50 verified + 149 listed]  AI ROBOTS.TXT GENERATOR  [ear: free · no sign-up]
  ────────────────────────────────────────────────────────────────────
  Edition of 4 Nov 2026 · Generator · Tester · Bot register · Server rules · Guides   EN ▾
  ════════════════════════════════════════════════════════════════════
  H1 AI robots.txt generator          one-sentence answer
  ┌ §1 Site type ┬ §2 Goal ─────────┐ ┌ NOTICE ── robots.txt ─────────────┐
  │ (•) Blog ( ) News ( ) Shop …    │ │ 1  # Policy: no AI training …      │ note
  │ (•) No training, stay in search │ │ 2  User-agent: GPTBot              │ note
  │ §3 Paths  /blog/ open …         │ │ …                                  │
  │ §4 Extras Content-Signal …      │ │ [VERIFIED · 47 agents × 4 paths]   │
  └─────────────────────────────────┘ └────────────────────────────────────┘
  ```

### B. "Timetable" — departure board and Kursbuch
Everything is a table: bots are departures, columns are purpose, operator, compliance. Headings in a
condensed grotesque, black header bars with white text, yellow signal colour.

- Palette: white `#FFFFFF`, black `#111`, signal yellow `#F2C500`, red `#C00`.
- Fonts: IBM Plex Sans Condensed (headings), IBM Plex Sans (text), IBM Plex Mono.
- Rejected: no antiqua (the brief asks for one); yellow-on-white is weak for accessibility; too close to
  generic dashboard UIs and to metasnitch.com's technical look.

### C. "Internet-Draft" — typewritten RFC with stamped notices
Plain-text RFC pages: page headers and footers, monospace dominant, section numbers, notices typed on
index cards and stamped.

- Palette: off-white `#FBFAF6`, black, stamp red `#A4161A`.
- Fonts: Brygada 1918 (headings), IBM Plex Sans (text), JetBrains Mono (code and most labels).
- Rejected: monospace-heavy pages hurt long-form readability and Lighthouse text sizing on phones; the
  look reads as "developer tool" and would narrow the audience (publishers, shop owners).

### Why A
It fits the subject (a public notice addressed to machines; a public register of who crawls), it gives the
site a recognisable identity distinct from the other network sites, it keeps long text readable (Franklin at
17 px), and the newspaper vocabulary (dateline, notice, register, stamp) produces honest microcopy:
dates, counts, sources.

## 3. Tokens

Defined in `apps/web/src/styles/tokens.css` and shown on `/styleguide` (noindex).

- **Colour** (light / dark): `--paper #F5F0E5 / #14130F`, `--paper-2 #ECE5D4 / #1E1C17`,
  `--ink #1A1916 / #EEE7D7`, `--ink-2 #4B463E / #B9B0A0`, `--rule #1A1916 / #EEE7D7`,
  `--rule-light #CDC3AD / #3E392F`, `--red #B0251B / #FF7A6B`, `--green #2D6A3D / #7CC48F`,
  `--focus #1A1916 / #EEE7D7` (3 px outline, 2 px offset). All text pairs ≥ 4.5:1 (body pairs ≥ 7:1).
- **Type**: `--font-display` Old Standard TT; `--font-text` Libre Franklin; `--font-mono` IBM Plex Mono.
  Scale (px): 13 · 14 · 15 · 17 (body) · 20 · 24 · 30 · 40 · 52; line-height 1.55 text, 1.1 headings;
  tabular numerals in tables. Japanese falls back to system Mincho/Gothic (no web font for CJK).
- **Space**: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 (`--s-1` … `--s-8`).
- **Radii**: 0 everywhere; 1 px only on form controls for anti-aliasing.
- **Lines**: hairline 1 px, rule 2 px, heavy 4 px; the masthead uses heavy + hairline ("Oxford rule").
- **Motion**: none except a 120 ms colour transition on interactive elements; `prefers-reduced-motion`
  removes it.

## 4. Forbidden-list check (section 10 of the brief)

Done screen by screen before release; results and screenshots in `docs/screenshots/` (375, 768, 1440 px).
