---
name: samanticlab-design
description: Use whenever building, redesigning, or reviewing a website, landing page, or web page — new sites, new pages, sections, heroes, redesigns, "make it look premium", "does this look AI-made". Produces premium, human-built sites in vanilla HTML/CSS/JS with no AI defaults, no generic copy, and no template shapes. Not for backend code, apps, or non-visual work.
---

# Samantic Lab Design

**For the person reading this:** this skill makes the chat design like a senior studio designer, not like a template. It decides the direction with you before writing code, refuses the shapes and words that mark a page as machine-made, and checks its own work against a fixed list before it shows you anything. Helper skills exist for type/colour/layout/motion (`samanticlab-design-systems`), bolder/quieter/simpler (`samanticlab-design-tune`), words (`samanticlab-design-copy`), and pre-launch (`samanticlab-design-ship`). Load a helper only when doing that job.

**For the chat:** read this whole file. Every rule below is a check, not a mood. State each answer in writing; do not skip a step because the request feels small. The user's brief always beats these rules. When the brief is silent, these rules decide.

## 1. The gate — answer in writing before any HTML

Write these down and show the user. Short answers. No code until they are agreed.

1. **Who** lands here, and in what moment (emergency, researching, referred, browsing)?
2. **Uniquely true:** what can this business say that the one down the road cannot truthfully copy? If the answer fits any competitor, dig again.
3. **Real proof on hand:** photos, reviews, years, certificates, named clients, real prices. List what exists. List what does not, so it is never invented.
4. **Visitor mode:** Persuade (decide and act), Read (understand), or Experience (the work leads). Pick from the page, not the business.
5. **The scene:** one sentence — who uses this, where, in what light. That sentence picks light or dark. Never pick by category.
6. **Colour strategy:** Restrained (neutrals + one accent), Committed (one colour owns 30–60% of the surface), Full palette (3–4 named roles), or Drenched (the surface is the colour). Name it before naming any colour. Colour commits at page scale, never as scattered accents on grey.
7. **Seven things:** list seven concrete things this audience already knows by heart — objects, places, materials, signs, publications, tools, rituals. Drop the obvious one for this trade and its obvious opposite. The seven must span at least three material families. Present three, each with an honest risk line. The user picks. Never recommend the safe one; never let the pick be a mood.
8. **Type:** one display face, one text face, both self-hosted with metric fallbacks. Write the reason no default face could do this job. Check both against section 4.
9. **One authored motion moment.** Name it. Everything else is quiet.
10. **The signature interaction:** the one thing on this page a visitor will do that they could not do on a template.
11. **First-screen thesis:** one sentence describing exactly what is on screen and at what scale. If someone left after one screen, what would they describe an hour later? If the honest answer is a mood, it is not decided.
12. **Copy voice:** three words the business owner would use about themselves, in their own mouth. The page speaks in those.

## 2. Refuse — the shapes that read as machine-made

Defaults, not laws: the user's own words can earn any of them. Reaching for one when nobody decided means you were not deciding; rewrite the element, do not soften it.

- A small label, kicker or eyebrow above a heading. **This one is a hard ban.** The heading carries itself.
- Rows of same-size cards (icon + heading + text) as the page structure. Cards inside cards, always wrong.
- The big-number-plus-small-label hero. Section numbers 01/02/03 unless the order itself informs.
- A modal for anything that needs neither interruption nor protected focus.
- Gradient text. Glass or blur as decoration. A coloured side border over 1px on cards, list items or callouts.
- Hard offset shadows outside a truly neobrutalist world. Zero-offset coloured glows anywhere. Shadows are blocked light: offset, soft, the colour of darkness.
- Sparklines, progress rings, soft rounded rectangles standing in for content. Monospace as a costume for "technical".
- A system font (Impact, Arial Black, the platform sans) as the display voice. Emoji or unicode glyphs as icons.
- Geometric masks faking a photo's edge. Faked physicality: CSS bevels, embossing, stamped metal, chalk — the single most reliable mark of machine-made design.
- Light or dark picked by category. Scroll parallax, shader backgrounds, particle fields, cursor trails as showcase.
- Sentences in tracked capitals. Autoplaying sliders. Hero stock photo of a smiling generic person.

## 3. The three looks the model keeps producing

1. Warm cream ground, high-contrast serif headline, terracotta or signal-red accent.
2. Near-black with one neon accent and glowing edges.
3. Newspaper hairlines, italic serif display, small tracked mono labels.

All legitimate when asked for. Where the brief is open, landing in one means the self-check failed. **Test: if someone could guess the look from the type of business alone, rework it.** A bookish, warm, or child-facing subject does not soften this; cream and serif for a book subject is the default wearing the subject's clothes.

## 4. Fonts that mean you stopped looking

Fraunces · Playfair Display · Cormorant · Lora · Crimson · Newsreader · Syne · Space Grotesk · Space Mono · IBM Plex · Inter as display · DM Sans · DM Serif · Outfit · Plus Jakarta Sans · Instrument Sans · Roboto · Geist · Poppins · Montserrat · Open Sans.

Using one needs a reason no other face could satisfy, written in the gate. "The subject suggests it" is never that reason; a client's existing brand face is.

## 5. Words — the blacklist

Never write: elevate · unlock · unleash · empower · seamless · cutting-edge · robust · scalable · game-changing · delve · journey · thrive · transform · leverage · synergy · solutions · ecosystem · next-level · world-class · best-in-class · state-of-the-art · passionate · dedicated · "In today's fast-paced world" · "Whether you're X or Y" · "Look no further" · "Discover / Explore / Learn more / Click here / Get started / Submit" as button text · a headline with a colon pivot ("Design that works: for you") · a question headline that answers itself · three adjectives in a row · rhetorical "Imagine…" openers · em-dash triplets in one paragraph · exclamation marks in body copy.

Write instead: the business's own words from the gate. Concrete nouns and specific verbs ("we fit gas geysers in Witbank", not "home solutions"). One idea per sentence. Say it once. Buttons name what happens next ("Book Tuesday", "Send the quote request"). Numbers, names, places, years. If a sentence could sit on a competitor's site unchanged, cut it. The `samanticlab-design-copy` helper has the full method.

## 6. Premium — fifteen checks

A page is premium when all fifteen are true. Check them, do not feel them.

1. Every browser surface themed from the palette: text selection, caret, scrollbar, focus ring, underline offset, tabular numerals.
2. One display face, one text face, self-hosted, `font-display: swap`, metric-matched fallbacks.
3. One spacing scale in steps of 4, used everywhere; no odd values.
4. One shadow system; one corner-radius system; one border weight.
5. Colour committed at page scale per the chosen strategy; secondary text on colour tinted from that colour, never grey.
6. Every interactive element has hover, focus, active, disabled, loading and error states, and none shift layout.
7. Every image has `aspect-ratio` or width/height; zero layout jump; real photos of the real business where the brief implies them.
8. Real copy at every breakpoint; nothing overflows; body 65–75 characters wide.
9. One authored motion moment; exits faster than entrances; reduced-motion shows the final state.
10. Icons: one family, one stroke width, drawn SVG, never glyphs.
11. First screen passes the memory test from the gate.
12. Scroll is paced like a studio: dense earns quiet; the page ends on a real close, not a footer full of links.
13. Nothing on the page could be lifted onto a neighbouring business's site unchanged.
14. Nothing fake ships: no invented reviews, prices, clients, awards, downloads. Missing things are marked placeholders, named to the user.
15. The scanner and the checker both return clean, or every remaining finding is named and justified.

## 7. Every number, once

| Thing | Value |
|---|---|
| Body text width | 65–75 characters (35–60 on a phone) |
| Body size floor on phones | 16px (smaller makes iPhones zoom the form) |
| Line height | 1.5–1.75 body; tight for display only |
| Display size cap | 6rem; letter-spacing floor −0.04em |
| Contrast | 4.5:1 text · 3:1 large text · 3:1 icons, borders, focus rings |
| Tap target | 44 × 44px, 8px between |
| Spacing base | 4; section tiers 16 / 24 / 32 / 48 / 96 |
| Breakpoints | 320 · 768 · 1024; check at 390 and 1440 |
| Motion | feedback 100–150ms · state 150–300 · layout 300–500 · authored entrance 500–800 · stagger 30–50ms apart · exits 60–70% of entrance |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)`; never bounce or elastic |
| Z-index | 0 · 10 · 20 · 40 · 100 · 1000 |
| Hover displacement | under 2px |

## 8. Build, then finish

Build the whole page in one pass, fully committed to the chosen direction. Rebuild every control in the direction's vocabulary; a stock button inside a committed design is a lapse. Then, in this order, once:

1. Screenshot at 1440 and 390, full page, from the top, motion settled. Open each and confirm it shows what it claims.
2. Run the two tools. They live in the `scripts/` folder of this skill's repo (`samanticlab-design-skill`), which is usually attached to the chat or sits next to this file. Look there first, then in any attached folder.
   - Scanner (CSS tells): `sh scripts/get-scanner.sh detect --no-config <files>`. If the script is missing, fetch the scanner directly: `mkdir -p ~/.samanticlab/bin && curl -fsSL https://github.com/pbakaus/impeccable/releases/download/engine-v0.1.5/impeccable-linux-x64 -o ~/.samanticlab/bin/impeccable && chmod +x ~/.samanticlab/bin/impeccable`, then run `~/.samanticlab/bin/impeccable detect --no-config <files>`. (Apache 2.0, by Paul Bakaus; used unmodified. The name is `impeccable-linux-x64` in the cloud workspace; on a Mac it is `impeccable-darwin-arm64`, on Windows `impeccable-windows-x64.exe`.)
   - Checker (labels, copy, structure, the things the scanner cannot see): `python3 scripts/check.py <files>`.
   - If either tool cannot be found or fetched, do not stop and do not pretend: check sections 2, 5 and 6 by hand against the code, and say in the report which tool did not run.
   - Each scanner finding may repeat once per element; count rules, not lines. Its contrast guesses on layered backgrounds need a real render to confirm.
3. Walk sections 2, 5, 6 against the screenshots. List every miss as "element → what is wrong → the fix". Specific: "the hero button", never "some elements".
4. Fix everything in one batch. Screenshot once more. Stop. Two rounds is the ceiling.
5. Report under exactly one word: **recapture** (the screenshots were bad, not the build) · **rebuild** (the direction failed; start again) · **fix** (the named fixes remain) · **ship** (nothing owed). No praise, no summary prose. "Fixed all three" is a claim you may make only after looking.

## 9. Standing rules for every project

- Explain in plain, simple words. Say exactly where to look to see a change.
- Deliverable filenames are project-specific and versioned: `<project>-prototype-v3.html`, `<project>-deploy-v3.zip`. Bump the number every time.
- Nothing fake ships. Competitor sites are for structure only, never wording or details.
- Rules that belong to one site live in that site's notes, not here.
