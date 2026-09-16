---
name: samanticlab-design-systems
description: Helper for samanticlab-design. Load when choosing or fixing type, colour, layout, spacing, or motion on a website — font pairing, palette, grid, section rhythm, scroll reveals, hover, page transitions, "make it feel like Framer". Recipes in plain CSS and small vanilla JS. Not for copy or pre-launch checks.
---

# Systems: type, colour, layout, motion

Read `samanticlab-design` first; it holds every number and every ban. This file holds the methods and recipes. Nothing here overrides a decision already written in the project's `<project>-direction.md`.

## Type

- **Choosing a face.** Start from the seven things in the gate, not from a font list. What lettering does this audience already read: the signage, the packaging, the paperwork, the tools? Find a face with that character. Write the reason in one sentence. Then check it against the stopped-looking list.
- **Two faces, no more.** One display, one text. If one face does both jobs well, use one. Self-host both (`@font-face`, `woff2`, `font-display: swap`). Load only the weights used, usually two or three.
- **Metric fallback.** Give each `@font-face` a system fallback with `size-adjust`, `ascent-override` and `descent-override` so the page does not jump when the real font arrives.
- **Scale.** Display sizes with `clamp()`, for example `clamp(2.25rem, 1rem + 5vw, 5.5rem)`. Body stays at 1rem to 1.125rem. Between steps, 1.125 to 1.2 for product text, wider jumps for display.
- **Display is not body.** Display type gets tight leading (0.95 to 1.1), tight tracking (down to the floor), `text-wrap: balance`, and a bounded width of about 20 characters. Body gets 1.5 to 1.75 leading and 65 to 75 characters.
- **Light on dark.** Add a touch of line height, a touch of tracking, and one step of weight. Thin type on dark disappears.
- **Numbers.** Prices, phone numbers, hours, times: `font-variant-numeric: tabular-nums`.
- **Never** letter-space lowercase body text. Never fake bold or italic; load the real weight.

## Colour

- **Strategy before colour.** The gate named one of four: Restrained, Committed, Full palette, Drenched. Pick the palette to serve that strategy, not the other way round.
- **Source.** The client's real materials first: logo, van, shopfront, uniform, product, packaging. Then the physical world of the seven things: the colour of the material, the ink, the paint. Never "the industry colour".
- **Tokens.** Name colours by what they are (`--ink`, `--paper`, `--brass`, `--moss`), never by number. Every filled colour ships with an "on" colour (`--brass` and `--on-brass`), and the pair is checked at 4.5:1 before build.
- **Secondary text on colour** is a tint of that colour or of the ink, never grey. Grey on colour reads as broken.
- **Commit at page scale.** In a Committed or Drenched strategy the colour owns whole regions: a section, a column, the ground. Scattered accents on a white page is Restrained pretending.
- **Dark surfaces.** Never invert the light palette. Dark grounds are near-black tinted toward the palette, not `#000` and not slate blue. Check text against the real image or gradient behind it, not the flat token.
- **Shadows** take the colour of darkness on that ground: a tinted near-black at low opacity, offset downward, soft. Never the accent colour. Never zero offset.

## Layout

- **Phone first.** Write the single-column phone layout, then add columns at 768 and 1024. Widths are fluid (`minmax`, `%`, `ch`), never fixed pixels that wrap a hundred pixels narrower.
- **Spacing scale.** Steps of 4. Section tiers 16 / 24 / 32 / 48 / 96, applied by hierarchy: more space above a heading than below it; tight inside a group, generous between groups. Read the computed values; do not guess.
- **Proximity before boxes.** If two things belong together, put them close. Reach for a card or a border only when space alone cannot say it. A row of identical cards is the lazy container; vary width, scale, or content, or remove the boxes.
- **The squint test.** Blur the page. What is loudest should be the one thing that matters most on that screen. If everything is the same weight, nothing is.
- **Pace the scroll.** A dense passage earns a quiet one. Vary section height, image scale, and type size within one grammar. End on a real close: a last statement and the action, not a wall of footer links.
- **Grid** is `display: grid` with named areas for the page, flex for rows of controls. `min-width: 0` on every grid and flex child that holds text. `100dvh` for full-height, never `100vh`.
- **Sticky header** sets `scroll-padding-top` on `html` equal to its height.
- **Z-index** from the scale in the main file. Never `9999`.

## Motion

The main file allows one authored moment. This section says how to make that moment, and the quiet feedback around it, feel like a studio built it.

**The eight habits of sites people call "Framer-quality"**, all plain CSS and small JS:

1. **Reveal once, then stay.** Sections fade and rise 24 to 40px as they enter, once. `IntersectionObserver` adds a class; the class never comes off. 300 to 600ms, ease-out. Never re-animate on scroll up. Never stagger every section; stagger items inside one list only, 30 to 50ms apart.
2. **Hover answers in under 150ms.** A colour shift, a 1 to 2px lift, an underline growing. Never a scale bounce, never a shadow bloom. `@media (hover: hover)` so phones never see it.
3. **Sticky pin.** One side pins (`position: sticky; top: <header>`) while the other scrolls past. One or two per page at most.
4. **Page transitions.** `@view-transition { navigation: auto; }` plus a 200 to 300ms cross-fade, so the site feels like one object. Works on static pages with no library.
5. **Images settle.** Fade in from 0 to 1 over 400ms with a slight scale from 1.02 to 1, once loaded. `aspect-ratio` reserved so nothing jumps.
6. **One easing everywhere.** `cubic-bezier(0.16, 1, 0.3, 1)`. Exits at 60 to 70% of the entrance time with `ease-in`. No spring, no bounce, no elastic.
7. **Only `transform` and `opacity` move.** Never `width`, `height`, `top`, `left`, `margin`. `will-change: transform` on the moving layer only, removed after settle.
8. **Reduced motion shows the end state.** Under `prefers-reduced-motion: reduce`, transitions are instant and content is visible. Content is visible by default too, so a failed script never hides the page.

**The Framer template look is refused.** Rounded cards floating over soft gradient blobs, springy motion, the purple-to-blue hero, cursor-following glows: this is the fourth AI look. The eight habits above are craft. The blobs are a template.

**Pick the authored moment** from the signature interaction in the gate. It should demonstrate something the business does, at the scale it has in life. Build the real technique (a canvas, a scroll-driven sequence, a live counter from real data), not a static imitation. Bound its cost: pause when off-screen, cap frame work, lazy-init.

## Six recipes with real values

- **Big-type minimalism:** `font-size: clamp(3rem, 10vw, 12rem); font-weight: 900; letter-spacing: -0.05em;` section padding 8rem or more; one accent colour; nothing else competes.
- **Editorial grid:** named grid areas, asymmetric columns, serif body, `p:first-of-type::first-letter` at 4em, pull quotes at 1.5em, `figure` with `figcaption`.
- **Grain and material:** an SVG `feTurbulence` grain overlay at 0.08 to 0.16 opacity (below 0.08 it never reaches the screen), varied organic radii, humanist sans.
- **Vintage film:** `filter: sepia(20%) contrast(1.1) saturate(0.8)` on photos, grain at 0.15, warm tint `#F5E6C8` behind them.
- **Hero type:** `--headline: clamp(2rem, 5vw, 4rem)`; hero text `max-width: 20ch` for display, `60ch` for the line under it.
- **Glass, only as a surface:** a nav bar or a drawer over an image: `backdrop-filter: blur(15px); background: rgb(255 255 255 / .15); border: 1px solid rgb(255 255 255 / .2)`. Never as a page style, never on cards.
