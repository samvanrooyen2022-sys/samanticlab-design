# samanticlab-design

A Claude skill that designs websites like a senior studio, not like a template.

It makes the chat decide the direction **with you, before writing any code**, refuses the
shapes and words that mark a page as machine-made, designs for the phone first, and checks
its own work against a fixed list before it shows you anything. Plain HTML, CSS and
JavaScript. No frameworks.

Built by [Samantic Lab](https://samanticlab.com), a web design studio in South Africa.

## What it does

- **Asks first.** Twelve short questions the chat answers in writing before any HTML:
  who lands here, what is uniquely true about this business, what real proof exists,
  light or dark and why, which colour strategy, three directions to choose from, which
  fonts and why no default would do.
- **Refuses the tells.** Labels above headings, rows of identical cards, gradient text,
  glow shadows, emoji icons, fake material effects, the hero-features-testimonials-CTA
  template, and twenty-one fonts that mean nobody looked.
- **Bans the words.** Elevate, unlock, seamless, "whether you're X or Y", "learn more",
  and the rest of the list. Buttons say what happens next.
- **Phone first.** Phone layout designed first, phone screenshot checked first.
- **Checks itself.** Two tools run at the finish: a CSS scanner and our own checker for
  the things a scanner can't see. Then one word: recapture, rebuild, fix, or ship.

## Install

1. Add the skill to Claude: upload the `samanticlab-design` folder (the `SKILL.md` inside it
   is the skill). Do the same for each helper folder you want.
2. Attach this repo folder to a website chat so the chat can reach the two scripts.
3. Ask for website work in plain words. The skill switches on by itself.

## What's in here

| Path | What it is |
|---|---|
| `samanticlab-design/SKILL.md` | The main skill. The chat reads this every time. |
| `samanticlab-design-systems/` | Helper: type, colour, layout, motion recipes. |
| `samanticlab-design-tune/` | Helper: bolder, quieter, simpler. |
| `samanticlab-design-copy/` | Helper: writing the words. |
| `samanticlab-design-ship/` | Helper: the pre-launch checklist, phone details included. |
| `scripts/check.py` | Our checker. Plain Python, no installs. |
| `scripts/get-scanner.sh` | Fetches and runs the CSS scanner (see NOTICE). |

## Checking a page by hand

    sh scripts/get-scanner.sh detect --no-config index.html
    python3 scripts/check.py index.html

Exit code 0 means clean. 2 means findings; read them.

### If the scripts are missing

Fetch the scanner by hand (Apache 2.0, by Paul Bakaus, used unmodified):

    mkdir -p ~/.samanticlab/bin
    curl -fsSL https://github.com/pbakaus/impeccable/releases/download/engine-v0.1.5/impeccable-linux-x64 -o ~/.samanticlab/bin/impeccable
    chmod +x ~/.samanticlab/bin/impeccable
    ~/.samanticlab/bin/impeccable detect --no-config index.html

The file name is `impeccable-linux-x64` in a Linux workspace, `impeccable-darwin-arm64`
on a Mac, `impeccable-windows-x64.exe` on Windows.

## Licence

Apache License 2.0. See `LICENSE`. The scanner this skill fetches is a separate work by
Paul Bakaus under the same licence; see `NOTICE`.
