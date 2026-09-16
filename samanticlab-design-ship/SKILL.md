---
name: samanticlab-design-ship
description: Helper for samanticlab-design. Load right before a website goes live — "get it ready to deploy", "final check", "make the ZIP", "is this ready for Netlify". A pre-launch checklist for static HTML/CSS/JS sites, with the phone details. Not for design decisions.
---

# Ship: the pre-launch checklist

Read `samanticlab-design` first. This runs once, after the finish step in section 8 has reported **ship** or after the last fix round. Go down the list in order. Every line is a check; mark each pass or fix. Nothing here is optional for a live site.

## Phone

- Screenshots at 390 and 360 wide, full page, real copy, real images. Then 768 and 1440.
- No horizontal scroll at any width. Long emails, URLs and names wrap (`overflow-wrap: anywhere`, `min-width: 0` on grid and flex children).
- Zoom the phone view to 200%. Nothing clips, nothing overlaps, no fixed-height text boxes.
- Full-height sections use `100dvh`. Anything fixed to the top or bottom has `padding` from `env(safe-area-inset-top/bottom)` and the viewport meta carries `viewport-fit=cover`.
- The main action sits in thumb reach on the first screen, or in a sticky bottom bar that never covers content.
- The menu: opens with one tap, is a full readable panel, closes on Escape and on tapping outside, moves focus into itself when open, and returns focus to the button when closed.
- Nothing important is hover-only. Hover states sit inside `@media (hover: hover)`.
- Phone number is `<a href="tel:+27…">`, address opens a map link, email is `mailto:`. Tapping dials.
- Form fields carry `autocomplete` (`name`, `tel`, `email`, `street-address`) and the right `type` and `inputmode`, so the phone shows the right keyboard.
- Tap feedback within 100 to 150ms. Pressed states change colour or opacity, never size or position.
- Photos chosen for portrait where the phone hero differs from the desktop one (`<picture>` with a portrait source), not the wide crop squashed.
- Body text at least 16px on phones. Tap targets 44px with 8px between.

## Images and media

- Every `<img>` and `<video>` has `width` and `height` or `aspect-ratio`. Zero layout jump.
- WebP or AVIF, sized for the slot (no 3000px file for a 390px column), with `srcset` and `sizes`.
- Quality 80 to 85. First-screen weight under about 500 KB in total.
- `loading="lazy"` below the fold only. Never on the hero image; give the hero `fetchpriority="high"`.
- `alt` text says what the picture shows, in a sentence; decorative images get `alt=""`.
- No autoplaying carousel. If a slider exists: pause, previous, next, stops on focus, hover and reduced motion, announces position.
- Video: `preload="none"` or `metadata`, click to play or muted loop with a visible pause, stops when off-screen, obeys reduced motion. No sound without a tap.
- No stock image of a smiling generic person in the hero. Real photos, or a marked placeholder.

## Type and colour

- Fonts self-hosted as `woff2`, only the weights used, `font-display: swap`, metric fallback set, the one or two above-the-fold faces preloaded.
- Contrast checked on the real render: 4.5:1 body, 3:1 large text, 3:1 icons, borders, focus rings. Muted text is not below 4.5:1 just because it is muted. Text on images checked against the actual image.
- Browser surfaces themed: `::selection`, `caret-color`, `scrollbar-color` or the webkit pseudo-elements, `:focus-visible`, `text-underline-offset`, `tabular-nums` on numbers.

## Motion

- Every transition and animation has a reduced-motion path that shows the final state.
- `scroll-behavior: smooth` only inside `@media (prefers-reduced-motion: no-preference)`.
- Only `transform` and `opacity` animate. `will-change` is not left on at rest.
- No continuous animation except a loading indicator. Nothing re-animates on scroll up.
- Content is visible with JavaScript off. Entrance animations never block input.

## Structure and access

- One `<h1>`. Heading levels in order with no gaps. Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`.
- Skip link as the first focusable element, landing on `<main>`.
- Current page marked with `aria-current="page"` and a visible indicator.
- Every icon-only control has an accessible name. Decorative icons beside text carry `aria-hidden="true"`. One icon family, one stroke width.
- Keyboard: tab through the whole page; every control reachable, focus visible, no trap, order matches the visual order.
- Sticky header: `html { scroll-padding-top: <header height> }`, so anchor links and focus never land under it. Test by landing on an anchor link.
- Z-index only from the scale. No `9999`.
- `<html lang="en">` (or the site's language). `<title>` per page, unique and specific. `<meta name="description">` per page, real, under 160 characters.
- Open Graph title, description and image so shared links show properly.

## Forms

- One `<label for>` per field. Required fields marked in text, not by colour alone.
- Validation on blur, not on every keystroke. Error text under the field, linked with `aria-describedby`, naming what failed and how to fix it.
- On a failed submit, focus moves to the first invalid field. The button disables and shows status while sending. Success replaces the form with what happens next.
- Netlify forms: `data-netlify="true"`, a `name` attribute, a hidden `form-name` input, and a honeypot field. Test a real submission before handover.
- Never colour alone for state; add an icon or text.

## Files and hand-over

- Nothing fake ships. Every placeholder is listed in the report by name and location.
- No console errors. No dead links (check every `href`). No lorem ipsum. No debug code, no unused CSS blocks, no orphaned files.
- Favicon and app icon present. `robots.txt` allows indexing. A `404.html` in the site's own style.
- Run the scanner and the checker once more on the final files. Any remaining finding is named and justified in the report.
- `<project>-direction.md` is inside the ZIP.
- Deliverables named `<project>-prototype-vN.html` and `<project>-deploy-vN.zip`, version bumped. Say where each new thing is, so the user can look.
