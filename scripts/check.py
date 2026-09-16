#!/usr/bin/env python3
"""check.py — the samanticlab-design checker.

Finds the tells the CSS scanner cannot see: labels above headings, emoji as
icons, section numbers, tracked capitals, lazy button text, blacklisted words,
images without sizes, unlabeled inputs, and a few CSS habits.  Plain Python,
no installs.

    python3 check.py index.html about.html
    python3 check.py site/            (every .html under the folder)
    python3 check.py --json ...       (machine-readable)

Exit 0 = clean, 2 = findings.  Advisory rules never change the exit code.
Each finding says: file, rule, what was seen, and the fix.
"""
import re, sys, os, json
from html.parser import HTMLParser

BLACKLIST = [
    "elevate", "unlock", "unleash", "empower", "seamless", "cutting-edge",
    "robust", "scalable", "game-changing", "delve", "journey", "thrive",
    "transform your", "leverage", "synergy", "solutions", "ecosystem",
    "next-level", "world-class", "best-in-class", "state-of-the-art",
    "passionate", "dedicated", "in today's fast-paced", "whether you're",
    "look no further", "imagine a", "imagine your", "your one-stop",
    "we've got you covered", "take your .* to the next level",
    "at the heart of", "crafted with", "tailored to your needs",
]
LAZY_BUTTONS = {"learn more", "click here", "get started", "submit", "read more",
                "discover", "explore", "discover more", "explore more", "see more",
                "find out more", "contact us", "get in touch", "go"}
BANNED_FONTS = ["fraunces", "playfair display", "cormorant", "lora", "crimson",
                "newsreader", "syne", "space grotesk", "space mono", "ibm plex",
                "dm sans", "dm serif", "outfit", "plus jakarta sans",
                "instrument sans", "roboto", "geist", "poppins", "montserrat",
                "open sans"]
EMOJI = re.compile("[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F1E6-\U0001F1FF"
                   "\u2B50\u2705\u274C\u2714\u2716\u2728\u26A1\u2B06\u2B07\u2192\u2190\u25B6]")
HEADINGS = {"h1", "h2", "h3", "h4"}
BLOCKS = HEADINGS | {"p", "div", "span", "small", "section", "article", "header",
                     "li", "a", "button", "figure", "img", "svg", "ul", "ol"}

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []          # open tags: [tag, attrs, text-parts]
        self.flow = []           # (tag, class, text) in document order, block level
        self.css = []            # inline <style> contents
        self.imgs = []           # (attrs)
        self.inputs = []         # (attrs)
        self.labels_for = set()
        self.links = []          # (tag, text)
        self.paras = []          # text of p/li
        self.headings = []       # (tag, text)
        self.in_style = False
        self.in_script = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "style": self.in_style = True
        if tag == "script": self.in_script = True
        if tag == "img": self.imgs.append(a)
        if tag == "input" and a.get("type", "text") not in ("hidden", "submit", "button"):
            self.inputs.append(a)
        if tag == "label" and a.get("for"): self.labels_for.add(a["for"])
        self.stack.append([tag, a, []])
    def handle_endtag(self, tag):
        if tag == "style": self.in_style = False
        if tag == "script": self.in_script = False
        while self.stack:
            t, a, parts = self.stack.pop()
            if t == tag:
                text = re.sub(r"\s+", " ", "".join(parts)).strip()
                cls = a.get("class", "")
                if t in HEADINGS: self.headings.append((t, text))
                if t in ("p", "li"): self.paras.append(text)
                if t in ("a", "button"): self.links.append((t, text))
                if t in BLOCKS and (text or t in ("img", "svg")):
                    self.flow.append((t, cls, text))
                break
    def handle_data(self, data):
        if self.in_style: self.css.append(data); return
        if self.in_script: return
        for frame in self.stack: frame[2].append(data)

def px(v):
    m = re.match(r"\s*(-?[\d.]+)\s*(px|em|rem)?", v or "")
    if not m: return 0
    n = float(m.group(1)); u = m.group(2)
    return n * 16 if u in ("em", "rem") else n

def check_file(path):
    src = open(path, encoding="utf-8", errors="replace").read()
    p = Page(); p.feed(src)
    css = "\n".join(p.css)
    F = []
    def hit(rule, seen, fix, advisory=False):
        F.append({"file": path, "rule": rule, "seen": seen[:120], "fix": fix, "advisory": advisory})

    # 1. Label above a heading (the hard ban).
    for i in range(1, len(p.flow)):
        tag, cls, text = p.flow[i]
        ptag, pcls, ptext = p.flow[i - 1]
        if tag in HEADINGS and ptag not in HEADINGS and ptext:
            words = ptext.split()
            short = len(words) <= 6 and not re.search(r"[.!?]$", ptext)
            named = re.search(r"eyebrow|kicker|overline|label|tagline|pretitle|subtitle-top", pcls, re.I)
            if short or named:
                hit("label-above-heading", f"'{ptext}' above <{tag}> '{text}'",
                    "Delete the label. The heading carries itself.")
    # 2. Section numbers.
    for tag, cls, text in p.flow:
        if tag in ("section", "div", "article", "header", "ul", "ol", "li"): continue
        if re.match(r"^\s*0\d\b", text) or re.search(r"\b0\d\s*[—–-]\s", text):
            hit("section-number", text, "Remove 01/02/03 unless the order itself informs.")
    # 3. Emoji as icons.
    seen_emoji = EMOJI.findall(re.sub(r"<script.*?</script>", "", src, flags=re.S))
    if seen_emoji:
        hit("emoji-as-icon", " ".join(dict.fromkeys(seen_emoji))[:40],
            "Use drawn SVG icons, one family, one stroke width.")
    # 4. Tracked capitals in copy.
    for m in re.finditer(r"text-transform\s*:\s*uppercase[^}]*?letter-spacing\s*:\s*([\d.]+)(em|px)|letter-spacing\s*:\s*([\d.]+)(em|px)[^}]*?text-transform\s*:\s*uppercase", css):
        v = m.group(1) or m.group(3); u = m.group(2) or m.group(4)
        if (u == "em" and float(v) >= 0.08) or (u == "px" and float(v) >= 1.5):
            hit("tracked-capitals", m.group(0)[:80],
                "Set in sentence case. Capitals flatten every word into the same box.", advisory=True)
    for tag, cls, text in p.flow:
        w = text.split()
        if len(w) >= 3 and text.isupper() and tag not in HEADINGS:
            hit("tracked-capitals", text, "Sentence case for anything longer than two words.")
    # 5. Lazy buttons and links.
    for tag, text in p.links:
        t = text.lower().strip(" .!→›»")
        if t in LAZY_BUTTONS:
            hit("lazy-button", f"<{tag}> '{text}'", "Name what happens next: 'Book Tuesday', 'Send the quote request'.")
    # 6. Blacklisted words.
    body_text = " ".join(t for _, _, t in p.flow).lower()
    for w in BLACKLIST:
        for m in re.finditer(r"\b" + w + r"\b", body_text):
            s = max(0, m.start() - 30); hit("blacklist-word", f"…{body_text[s:m.end()+30]}…",
                                           f"Cut '{w}'. Use the business's own concrete words.")
            break
    # 7. Headline shapes.
    for tag, text in p.headings:
        if re.search(r"\w:\s+\w", text) and len(text) < 80:
            hit("colon-pivot-headline", text, "Say the one idea plainly, without the pivot.")
        if text.endswith("?"):
            hit("question-headline", text, "Make the statement instead of asking it.", advisory=True)
        if re.search(r"\b(\w+), (\w+),? and (\w+)\b", text):
            hit("three-adjectives", text, "Pick the one that is true. Three in a row is filler.", advisory=True)
    for t in p.paras:
        if t.count("!") >= 1: hit("exclamation", t, "No exclamation marks in body copy.", advisory=True)
        if t.count("—") + t.count("–") >= 3: hit("em-dash-run", t, "Three dashes in one paragraph. Split the sentence.", advisory=True)
    if "lorem ipsum" in body_text: hit("lorem-ipsum", "lorem ipsum", "Write the real words or a marked placeholder.")
    # 8. Images without a size.
    n = 0
    for a in p.imgs:
        style = a.get("style", "")
        if not ((a.get("width") and a.get("height")) or "aspect-ratio" in style):
            n += 1
    if n:
        hit("img-no-size", f"{n} <img> without width+height or aspect-ratio",
            "Give every image its size so the page never jumps.")
    # 9. Unlabeled inputs.
    for a in p.inputs:
        if a.get("id") not in p.labels_for and not a.get("aria-label") and not a.get("aria-labelledby"):
            hit("unlabeled-input", f"input name='{a.get('name','?')}'", "One <label for> per field. Placeholders are not labels.")
    # 10. CSS habits the scanner does not cover.
    for m in re.finditer(r"font-family\s*:\s*([^;}]+)", css, re.I):
        fam = m.group(1).lower()
        for b in BANNED_FONTS:
            if b in fam: hit("default-font", m.group(1).strip()[:60], f"'{b}' is on the stopped-looking list. Needs a written reason in the gate."); break
    if re.search(r"\b100vh\b", css): hit("100vh", "100vh", "Use 100dvh so phone browser bars do not clip it.", advisory=True)
    if re.search(r"scroll-behavior\s*:\s*smooth", css) and "prefers-reduced-motion" not in css:
        hit("smooth-scroll-unguarded", "scroll-behavior: smooth", "Wrap it in @media (prefers-reduced-motion: no-preference).")
    if re.search(r"@keyframes|animation\s*:|transition\s*:", css) and "prefers-reduced-motion" not in css:
        hit("no-reduced-motion", "animations present, no prefers-reduced-motion", "Add a reduced-motion path that shows the final state.")
    for m in re.finditer(r"cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)", css):
        y1, y2 = float(m.group(2)), float(m.group(4))
        if y1 < 0 or y2 > 1.05: hit("bounce-easing", m.group(0), "Use cubic-bezier(0.16, 1, 0.3, 1). Never bounce.")
    if re.search(r"z-index\s*:\s*(9{3,}|[2-9]\d{3,})", css): hit("z-index-9999", "z-index 999+", "Use the 0/10/20/40/100/1000 scale.")
    if not re.search(r"::selection|scrollbar|caret-color|:focus-visible", css):
        hit("browser-surfaces-untouched", "no ::selection, caret-color, scrollbar or :focus-visible rules",
            "Theme the selection, caret, scrollbar and focus ring from the palette.", advisory=True)
    # 11. Equal card rows (structure).
    run = 0; last = None
    for tag, cls, text in p.flow:
        key = (tag, cls) if cls else None
        run = run + 1 if key and key == last else 1; last = key
        if run == 4 and cls and re.search(r"card|feature|service|tile|box", cls, re.I):
            hit("card-row", f"4+ siblings .{cls.split()[0]}", "Same-size card rows as page structure are the lazy container. Vary or rebuild.", advisory=True); break
    return F

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    as_json = "--json" in sys.argv
    files = []
    for a in args:
        if os.path.isdir(a):
            for r, _, fs in os.walk(a): files += [os.path.join(r, f) for f in fs if f.endswith(".html")]
        elif a.endswith(".html"): files.append(a)
    if not files: print("check.py: give it .html files or a folder", file=sys.stderr); sys.exit(1)
    F = []
    for f in files: F += check_file(f)
    hard = [x for x in F if not x["advisory"]]; adv = [x for x in F if x["advisory"]]
    if as_json: print(json.dumps(F, indent=1)); sys.exit(2 if hard else 0)
    by = {}
    for x in F: by.setdefault((x["advisory"], x["rule"]), []).append(x)
    for (a, rule), xs in sorted(by.items()):
        print(f"{'ADVISORY ' if a else ''}[{rule}] x{len(xs)} — {xs[0]['fix']}")
        for x in xs[:5]: print(f"    {os.path.basename(x['file'])}: {x['seen']}")
        if len(xs) > 5: print(f"    … and {len(xs)-5} more")
    print(f"\n{len(hard)} findings, {len(adv)} advisories, {len(files)} file(s).")
    sys.exit(2 if hard else 0)

if __name__ == "__main__": main()
