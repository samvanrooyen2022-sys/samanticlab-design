import json, os
# Regenerates index.html, journal.html and kuns.html. Edit copy here, then run: python3 build.py
OUT = os.path.dirname(os.path.abspath(__file__))
meta = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "img/meta.json")))
EMAIL = "andreahurter55@gmail.com"
IG = "https://www.instagram.com/chameleonqueen_sa/"
TT = "https://www.tiktok.com/@chameleonqueen_sa"
FB = "https://www.facebook.com/andrea.hurter.3/"

def img(name, alt, cls="", sizes="100vw", eager=False, w=None, h=None):
    m = meta[name]
    w = w or m["w"]; h = h or m["h"]
    big = 1672 if name == "goat-canola" else 1440
    srcset = f"img/{name}-720.webp 720w, img/{name}-{big}.webp {min(big, m['w'])}w"
    load = 'fetchpriority="high"' if eager else 'loading="lazy"'
    c = f' class="{cls}"' if cls else ""
    return f'<img{c} src="img/{name}-720.webp" srcset="{srcset}" sizes="{sizes}" width="{w}" height="{h}" alt="{alt}" {load} decoding="async">'

I = {
 "arrow-r": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
 "arrow-l": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
 "close": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 "mail": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
 "ig": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h0"/></svg>',
 "tt": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.8 2.4 4.6 5 5"/></svg>',
 "fb": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V21M6 11h8"/></svg>',
}

def socials():
    return f'''<ul class="socials">
        <li><a href="{IG}" target="_blank" rel="noopener">{I["ig"]}Instagram</a></li>
        <li><a href="{TT}" target="_blank" rel="noopener">{I["tt"]}TikTok</a></li>
        <li><a href="{FB}" target="_blank" rel="noopener">{I["fb"]}Facebook</a></li>
      </ul>'''

NAV = [("index.html", "Tuis", "goat-canola", "-4deg"), ("index.html#galery", "Galery", "spray", "3deg"),
       ("kuns.html", "Kuns", "disco-raised", "-2deg"), ("journal.html", "Journal", "peacock-silhouette", "4deg"),
       ("index.html#book", "Book", "wheat-laugh", "-3deg")]

def head(title, desc, page):
    return f'''<!doctype html>
<html lang="af" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#f2c300">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="img/goat-canola-1440.webp">
<link rel="preload" href="fonts/bricolage.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/hanken.woff2" as="font" type="font/woff2" crossorigin>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23f2c300'/%3E%3Ctext x='16' y='23' font-family='Arial' font-weight='900' font-size='18' text-anchor='middle' fill='%2317140f'%3EAH%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="css/site.css">
</head>
<body data-page="{page}">
<a class="skip" href="#main">Spring na die inhoud</a>
<header class="bar">
  <a class="bar__name" href="index.html">Andrea Hurter</a>
  <a class="btn bar__book" href="index.html#book">Book Andrea</a>
  <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Maak die kieslys oop"><span></span><span></span><span></span></button>
</header>
<nav class="menu" id="menu" aria-label="Hoofkieslys" inert>
  <ul class="menu__links">
''' + "\n".join(
        f'    <li><a href="{h}" style="--i:{i}"{" aria-current=\"page\"" if (page=="home" and i==0) or (page=="kuns" and i==2) or (page=="journal" and i==3) else ""}><img class="menu__thumb" style="--r:{r}" src="img/{n}-720.webp" width="72" height="96" alt="" loading="lazy">{t}</a></li>'
        for i, (h, t, n, r) in enumerate(NAV)) + f'''
  </ul>
  <div class="menu__foot">
    <div class="skinner">
      <p class="skinner__label" id="skin-label">Verander die site se kleur</p>
      <p class="skinner__hint">Sleep jou vinger oor die strook. Die hele site verkleur saam, soos 'n verkleurmannetjie.</p>
      <div class="skinner__strip" role="slider" tabindex="0" aria-labelledby="skin-label" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span class="skinner__knob"></span></div>
    </div>
    <p class="menu__cast">Rolverdeling: Andrea, 'n bok, 'n hoender en baie naartjies.</p>
    {socials()}
  </div>
</nav>
'''

def foot():
    return f'''<footer class="foot">
  <div class="foot__top">
    {img("road-goat", "Swart-en-wit foto: Andrea stap in 'n wit rok met 'n baadjie oor die skouer 'n grondpad af, met die bok langs haar", "foot__photo rise", "(min-width: 1024px) 420px, 100vw")}
    <div>
      <p class="foot__bye">Okay, love you. Bye.</p>
      <p class="foot__lede">Bookings, kuns en alles tussenin:</p>
      <a class="foot__mail" href="mailto:{EMAIL}">{EMAIL}</a>
      {socials()}
      <ul class="foot__nav">
        <li><a href="index.html#galery">Galery</a></li>
        <li><a href="kuns.html">Kuns</a></li>
        <li><a href="journal.html">Journal</a></li>
        <li><a href="index.html#book">Book</a></li>
      </ul>
    </div>
  </div>
  <p class="bigname">Andrea</p>
  <div class="foot__small"><span>&copy; 2026 Andrea Hurter</span><span>Kaapstad, Suid-Afrika</span></div>
</footer>
<script src="js/site.js" defer></script>
</body>
</html>
'''

GAL = [
 ("spray","Sjampanje, die lug in.","Andrea spoeg sjampanje die lug in teen 'n sonsak, met 'n bottel in die hand in 'n canola-land","canola sonsak","#f2a65a"),
 ("ice-cream","Roomys, geen skaamte nie.","Andrea lek 'n roomys in 'n kraletop, met canola agter haar","canola","#f3b9b0"),
 ("road-sunglasses","Grondpad en sonbril.","Swart-en-wit foto: Andrea met 'n sonbril en 'n sigaret op 'n grondpad","swart-wit","#1e1c1a"),
 ("champagne-tower","Die toring hou. Vir nou.","Andrea gooi sjampanje in 'n toring van glase op 'n blou piekniekdoek in die canola, teen sonsak","canola sonsak","#f4b860"),
 ("tractor","Bo-op die Massey Ferguson.","Andrea sit in 'n wit rok met pofmoue op 'n rooi Massey Ferguson-trekker","plaas","#c8321f"),
 ("skirt-swirl","Wind in die rok.","Andrea swaai haar wit romp in 'n canola-land","canola","#ee7f1b"),
 ("peacock-silhouette","Pouestoel by die dam.","Silhoeët van Andrea wat op 'n rottang-pouestoel in 'n dam staan, teen 'n goue sonsak","sonsak","#9b6a93"),
 ("disco-raised","Diskobal, hoog.","Andrea staan op 'n piekniektafel in die canola en hou 'n diskobal in die lug","canola","#a9cbea"),
 ("wheat-laugh","Lag in die koring.","Andrea lag en hardloop in 'n wit rok deur groen koring","koring","#8fa83a"),
 ("road-goat","Die bok stap saam.","Swart-en-wit foto: Andrea en die bok stap saam 'n grondpad af","swart-wit","#1e1c1a"),
 ("laughing-bottle","Kop agteroor.","Andrea gooi haar kop agteroor van die lag, met 'n bottel in die hand in die canola","canola sonsak","#e9b949"),
 ("sunglasses-picnic","Bril af, kyk terug.","Andrea lig haar sonbril en kyk oor haar skouer, langs naartjies en diskoballe","canola","#f2c300"),
 ("disco-shoulder","Oor die skouer.","Andrea kyk oor haar skouer in 'n kraletop, met 'n diskobal in die hand in die canola","canola","#d6dbe2"),
 ("peacock-lookback","Laaste lig.","Andrea staan op die pouestoel in die dam en kyk terug, teen 'n pers en goue sonsak","sonsak","#f5a524"),
 ("wheat-run","Die koring in.","Andrea hardloop van die kamera af in groen koring, met haar hare in die wind","koring","#6e8b2e"),
 ("goat-canola","Bok, naartjies en diskoballe.","Andrea sit in 'n wit rok op 'n blou doek in die canola, langs 'n bok, naartjies en diskoballe","canola","#f2c300"),
]

def wall():
    out = []
    n = len(GAL)
    for i, (name, cap, alt, tags, skin) in enumerate(GAL):
        wide = name == "goat-canola"
        m = meta[name]
        big = f"img/{name}-{1672 if wide else 1440}.webp"
        out.append(f'''      <li data-tags="{tags}" data-skin="{skin}" data-big="{big}"{' class="is-wide"' if wide else ''}>
        <figure><button type="button" aria-label="Maak oop: {cap}">{img(name, alt, sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw")}</button>
        <figcaption><span>{cap}</span></figcaption></figure>
      </li>''')
    return "\n".join(out)

home = head("Andrea Hurter — actress, MC en content creator, Kaapstad",
            "Andrea Hurter (@chameleonqueen_sa): actress, MC en content creator in Kaapstad. Galery, kuns te koop, journaling en bookings.", "home") + f'''<main id="main">
<section class="hero" aria-labelledby="name">
  {img("goat-canola", "Andrea Hurter sit in 'n wit rok in 'n canola-land, langs 'n bok, naartjies en diskoballe op 'n blou doek", "hero__img", eager=True)}
  <h1 class="hero__name" id="name"><span>Andrea</span><span>Hurter</span></h1>
  <p class="hero__role"><strong>Actress · MC · Content Creator</strong><span>Kaapstad</span><a href="{IG}" target="_blank" rel="noopener">@chameleonqueen_sa</a></p>
</section>

<section class="gather" aria-label="Oor Andrea">
  <p class="rise">Gather ye who uses <em>humour</em> as a coping mechanism.</p>
  <small>Uit Andrea se Instagram-bio.</small>
</section>

<section class="gallery" id="galery" data-view="wall" data-skin-scope aria-labelledby="galery-h">
  <div class="gallery__head">
    <h2 id="galery-h">Galery</h2>
    <p class="gallery__lede">Canola, koring, 'n grondpad en 'n dam teen sonsak. Swipe deur die stapel of sien als op die muur. Die bladsy verkleur saam met elke foto.</p>
    <div class="gallery__tools" role="group" aria-label="Galery-opsies">
      <button class="chip" type="button" data-set-view="stack" aria-pressed="false">Stapel</button>
      <button class="chip" type="button" data-set-view="wall" aria-pressed="true">Muur</button>
      <span class="sep" aria-hidden="true"></span>
      <button class="chip" type="button" data-filter="alles" aria-pressed="true">Alles</button>
      <button class="chip" type="button" data-filter="canola" aria-pressed="false">Canola</button>
      <button class="chip" type="button" data-filter="sonsak" aria-pressed="false">Sonsak</button>
      <button class="chip" type="button" data-filter="koring" aria-pressed="false">Koring</button>
      <button class="chip" type="button" data-filter="swart-wit" aria-pressed="false">Swart &amp; wit</button>
      <span class="vh" aria-live="polite" data-live></span>
    </div>
  </div>
  <div class="stack">
    <div class="stack__deck" tabindex="0" aria-label="Fotostapel. Gebruik die pyltjie-sleutels om deur te blaai, Enter om groot te sien."></div>
    <div class="stack__ui">
      <button class="round" type="button" data-stack-prev aria-label="Vorige foto">{I["arrow-l"]}</button>
      <p aria-live="polite"><span data-stack-count></span><b data-stack-cap></b></p>
      <button class="round" type="button" data-stack-next aria-label="Volgende foto">{I["arrow-r"]}</button>
    </div>
    <p class="stack__hint">Swipe links of regs. Tik om groot te sien.</p>
  </div>
  <ul class="wall">
{wall()}
  </ul>
</section>

<section class="book" id="book" aria-labelledby="book-h">
  {img("tractor", "Andrea in 'n wit rok met pofmoue op 'n rooi Massey Ferguson-trekker", "book__img rise", "(min-width: 1024px) 42vw, 100vw")}
  <div class="book__copy">
    <h2 id="book-h">Book Andrea</h2>
    <p>Andrea is 'n actress, MC en content creator in Kaapstad. Sy werk in Afrikaans en Engels, voor die kamera en voor 'n skare.</p>
    <ul class="book__facts">
      <li><b>44.6k</b><span>volgers op Instagram</span></li>
      <li><b>43k</b><span>volgers op Facebook</span></li>
      <li><b>TV &amp; film</b><span>actress</span></li>
    </ul>
    <fieldset class="picker">
      <legend>Waarvoor wil jy haar book? Kies een of meer.</legend>
      <div class="picker__opts">
        <button class="chip" type="button" aria-pressed="false" data-want="MC">MC vir 'n event</button>
        <button class="chip" type="button" aria-pressed="false" data-want="Acting">Acting</button>
        <button class="chip" type="button" aria-pressed="false" data-want="Brand content">Content vir 'n brand</button>
      </div>
    </fieldset>
    <a class="btn" data-book-send href="mailto:{EMAIL}?subject=Booking%20enquiry">{I["mail"]}<span>E-pos Andrea</span></a>
    <a class="book__mail" href="mailto:{EMAIL}">{EMAIL}</a>
  </div>
</section>

<div class="doors">
  <a class="door" href="kuns.html">
    {img("sunglasses-picnic", "", sizes="(min-width: 1024px) 50vw, 100vw")}
    <h2>Kuns</h2>
    <p>Palette knife op doek. Haar eerste skilderye is te koop.</p>
    <span class="btn">Sien die skilderye {I["arrow-r"]}</span>
  </a>
  <a class="door" href="journal.html">
    {img("peacock-silhouette", "", sizes="(min-width: 1024px) 50vw, 100vw")}
    <h2>Journal</h2>
    <p>Hoe journal jy? Andrea se antwoord, plus twee bladsye uit haar dagboek van 2010.</p>
    <span class="btn">Lees hoe sy skryf {I["arrow-r"]}</span>
  </a>
</div>
</main>

<dialog class="lightbox" id="lightbox" aria-label="Foto groot">
  <div class="lightbox__stage"><img src="img/spray-1440.webp" width="1440" height="1920" alt=""></div>
  <div class="lightbox__ui">
    <button class="round" type="button" data-lb-prev aria-label="Vorige foto">{I["arrow-l"]}</button>
    <p aria-live="polite"><span data-lb-count></span><b data-lb-cap></b></p>
    <button class="round" type="button" data-lb-next aria-label="Volgende foto">{I["arrow-r"]}</button>
    <button class="round" type="button" data-lb-close aria-label="Maak toe">{I["close"]}</button>
  </div>
</dialog>
''' + foot()

TIPS = [
 ("Journaling is 'n oefening om jou eie gedagtes te kan hoor.",
  "Ons doen letterlik alles in ons vermoë om ons gedagtes te vermy. Maar as jy jou gedagtes vermy, vermy jy ook jou gevoelens. Hoe meer jy journal, hoe dieper gaan jy in, en daar begin die regte growth en healing.",
  "Journaling is practice at hearing your own thoughts."),
 ("In die begin is dit maar 'n bietjie oppervlakkig. Dis okay.",
  "Dit raak beter hoe meer jy dit doen. Jy leer om jouself toe te laat om na die donker plekke te gaan wat jy so lank vermy het.",
  "At first it's a bit surface-level. That's okay."),
 ("Dit moet soos 'n vriendin wees waarmee jy kan chat.",
  "Moenie jou journal net met 'n heavy space connect nie. Andrea skryf ook al die exciting, amazing goed hierin. As iets goeds met jou gebeur en daar is daardie een persoon wat jy wil bel: this is her for me.",
  "It should feel like a friend you can't wait to tell."),
 ("Dit kan so simpel wees soos: vandag was 'n kakdag.",
  "Jy hoef nie die hele wêreld in jou journal op te los nie.",
  "It can be as simple as: today was a shit day."),
 ("You shouldn't judge yourself while writing.",
  "Jy kan enigiets skryf. Dis jou dagboek, jou gedagtes en jou gevoelens, en niemand kan vir jou sê dis verkeerd nie.",
  "Anything goes. It's your diary."),
]
def tips():
    out = []
    for i, (q, p, en) in enumerate(TIPS):
        out.append(f'''    <li class="tip rise"><blockquote>{q}</blockquote><p>{p}</p><p class="en">{en}</p></li>''')
        if i == 2:
            out.append(f'    <li class="rise" aria-hidden="true">{img("peacock-lookback", "", "tips__photo", "(min-width: 768px) 520px, 100vw")}</li>')
    return "\n".join(out)

LINES = [
 ("Sny my in 'n duisend stukkies, en gee 'n stukkie vir almal wat moan.", "Van die plakkaat"),
 ("Gather ye who uses humour as a coping mechanism.", "Andrea se Instagram-bio"),
 ("Vandag was 'n kakdag.", "Begin hier, as jy nie weet waar om te begin nie"),
 ("Jy hoef nie die hele wêreld in jou journal op te los nie.", "Uit haar journaling-video"),
 ("You shouldn't judge yourself while writing.", "Uit haar journaling-video"),
 ("Is dit net ek? Of voel almal so?", "Van een van haar skilderye"),
]
def lines():
    return "\n".join(f'''    <li><button type="button" data-copy="{q.replace('"','&quot;')}"><span>{q}<small>{s}</small></span><span class="copy">Kopieer</span></button></li>''' for q, s in LINES)

PROMPTS = ["Vandag was 'n ___ dag, want…", "Wie wou jy vandag bel om iets te vertel?", "Iets kleins wat vandag goed gegaan het:",
           "Waaraan probeer jy al lank nie dink nie?", "Wat sou jy vir jou 17-jarige self sê?", "Wat het jou vandag laat lag?"]

journal = head("Journal — Andrea Hurter", "Hoe journal jy? Andrea Hurter se wenke, woorde om te steel, en bladsye uit haar dagboek van 2010.", "journal") + f'''<main id="main">
<header class="pagehead">
  <div>
    <h1>Journal</h1>
    <p class="pagehead__lede">Elke keer as Andrea oor haar journal post, kry sy DMs: hoe journal jy? Waar begin ek? Hier is haar antwoord, in haar eie woorde.</p>
  </div>
  {img("poster-stukkies", "Plakkaat: Andrea sit in die canola met 'n hoender in haar arms, met die woorde: sny my in 'n duisend stukkies, en gee 'n stukkie vir almal wat moan", "pagehead__img", "(min-width: 1024px) 40vw, 100vw", eager=True)}
</header>

<section class="years" aria-labelledby="years-h">
  <div class="prose">
    <h2 id="years-h">Dit raak makliker.</h2>
    <p>Daar is geen regte of verkeerde manier om te journal nie. Maar soos enigiets anders vat dit oefening om agter te kom wat vir jou werk.</p>
  </div>
  <figure style="margin:0">
    <ul class="years__bars">
      <li><b>5 jaar</b><span class="bar-line" style="--len:100%;--c:var(--massey)"></span><span>Haar eerste journal</span></li>
      <li><b>4 jaar</b><span class="bar-line" style="--len:80%;--c:var(--naartjie)"></span><span>Die tweede een</span></li>
      <li><b>6 maande</b><span class="bar-line" style="--len:10%;--c:var(--canola)"></span><span>Die een wat sy nou vol geskryf het</span></li>
    </ul>
    <figcaption class="vh">Hoe lank dit Andrea gevat het om elke journal vol te skryf.</figcaption>
  </figure>
</section>

<section class="tips" aria-labelledby="tips-h">
  <h2 id="tips-h">Hoe om te begin</h2>
  <ul class="tips__list">
{tips()}
  </ul>
</section>

<section class="diary" aria-labelledby="diary-h">
  <h2 id="diary-h">Uit haar eerste dagboek</h2>
  <p class="diary__intro">Dit hoef nie life-changing te wees nie. Dit moet net iets wees wat op jou gemoed is en 'n plek nodig het om te bestaan. Twee bladsye uit 2010. Andrea was 17.</p>
  <div class="diary__pages">
    <figure class="diary__page rise">
      <time datetime="2010">2010</time>
      <blockquote>Toe ek vandag weer na hom kyk en hy smile vir my, het die butterflies in my maag mal gegaan. Het vanaand met hom gechat op MXit. He seems nice.</blockquote>
    </figure>
    <figure class="diary__page rise">
      <time datetime="2010">2010, verjaarsdag</time>
      <blockquote>Seventeen finally, and what a great feeling. Wow, tyd het gevlieg. Alles is klaar gereël vir vanaand. Kan nie wag nie. I got a feeling that tonight's gonna be a good, good night.</blockquote>
      <figcaption>En dit was. Dit was die eerste keer wat ek blackout gedrink het.</figcaption>
    </figure>
  </div>
</section>

<section class="lines" aria-labelledby="lines-h">
  <h2 id="lines-h">Woorde om te steel</h2>
  <p>Tik op 'n reël om dit te kopieer.</p>
  <ul class="lines__list">
{lines()}
  </ul>
</section>

<section class="page" aria-labelledby="page-h">
  <div>
    <h2 id="page-h">Jou bladsy</h2>
    <p>Begin klein. Hier is 'n vraag om mee te begin.</p>
    <p class="page__prompt" data-prompt aria-live="polite">{PROMPTS[0]}</p>
    <ul id="prompts" hidden>{"".join(f"<li>{p}</li>" for p in PROMPTS)}</ul>
    <div class="page__row"><button class="btn btn--ghost" type="button" data-next-prompt>Nog 'n vraag</button></div>
  </div>
  <div>
    <label class="vh" for="jou-bladsy">Skryf hier</label>
    <textarea id="jou-bladsy" placeholder="Skryf hier…" spellcheck="true"></textarea>
    <div class="page__row" style="justify-content:space-between;margin-top:12px">
      <p class="page__note">Wat jy hier skryf, bly op jou foon. Niemand anders sien dit nie, ook nie Andrea nie.</p>
      <button class="btn btn--ghost" type="button" data-clear>Maak die bladsy skoon</button>
    </div>
    <p class="page__saved" data-saved aria-live="polite"></p>
  </div>
</section>

<section class="more" aria-label="Meer dagboekstukke">
  {img("wheat-run", "", sizes="100vw")}
  <p>Wil julle hê sy moet nog stukkies uit haar vroeë journals voorlees?</p>
  <a class="btn" href="{IG}" target="_blank" rel="noopener">Sê vir haar op Instagram {I["arrow-r"]}</a>
</section>
</main>
''' + foot()

def mailto(subj):
    from urllib.parse import quote
    return f"mailto:{EMAIL}?subject={quote(subj)}&body={quote('Hi Andrea,' + chr(10)*2 + 'Ek stel belang in hierdie skildery. Wat is die prys en grootte?' + chr(10)*2)}"

kuns = head("Kuns — Andrea Hurter", "Andrea Hurter se palette knife-skilderye op doek. Kies een, e-pos haar, en sy stuur die prys en betaalskakel.", "kuns") + f'''<main id="main">
<header class="pagehead">
  <div>
    <h1>Kuns</h1>
    <p class="pagehead__lede">Palette knife op doek. Haar kuns het Andrea deur die trenches getrek en haar sane gehou. Nou is dit te koop.</p>
  </div>
  {img("disco-raised", "Andrea staan op 'n piekniektafel in die canola en hou 'n diskobal in die lug", "pagehead__img", "(min-width: 1024px) 40vw, 100vw", eager=True)}
</header>

<section class="story" aria-labelledby="story-h">
  <div>
    <h2 id="story-h">Die skoolskoen</h2>
    <p class="story__shoe rise">Wat? Julle wil betaal vir hierdie?</p>
  </div>
  <div class="prose">
    <p>Op hoërskool het Andrea aansoek gedoen om kuns as vak te neem. Die toets was om 'n skoolskoen te teken. Haar skoolskoen was nie goed genoeg nie, en sy is nie aanvaar nie. Van toe af het sy geglo sy is nie kunstig nie.</p>
    <p>Sy het aangehou verf, want dit het haar 'n plek gegee om uit te druk hoe sy voel. Sy het die skilderye sommer op haar Instagram stories gesit. Toe begin die boodskappe kom: as jy ooit jou kuns wil verkoop, let us know.</p>
    <p>So hier is hulle. As niks verkoop nie, is dit okay, want sy het ten minste probeer. En as iets verkoop, is dit ook cool.</p>
  </div>
</section>

<section class="works" aria-labelledby="works-h">
  <h2 id="works-h">Te koop</h2>
  <ul class="works__list">
    <!-- To sell online: replace each "Ek wil hierdie een hê" href with the Yoco/PayFast payment link, and swap .work__canvas for an <img> of the painting. -->
    <li class="work rise">
      <div class="work__canvas" style="--c:var(--canola)"><p>Instead of liking my stories we could just kiss like real people do.</p><span class="work__tag">Foto van die doek kom binnekort</span></div>
      <div>
        <h3>Instead of liking my stories</h3>
        <dl><dt>Medium</dt><dd>Palette knife op doek</dd><dt>Grootte</dt><dd>Vra vir Andrea</dd><dt>Prys</dt><dd>Op aanvraag</dd></dl>
        <a class="btn" href="{mailto('Kuns: Instead of liking my stories')}">{I["mail"]}Ek wil hierdie een hê</a>
      </div>
    </li>
    <li class="work rise">
      <div class="work__canvas" style="--c:var(--sky)"><p>Is dit net ek? Of voel almal so?</p><span class="work__tag">Foto van die doek kom binnekort</span></div>
      <div>
        <h3>Is dit net ek?</h3>
        <dl><dt>Medium</dt><dd>Palette knife op doek</dd><dt>Grootte</dt><dd>Vra vir Andrea</dd><dt>Prys</dt><dd>Op aanvraag</dd></dl>
        <a class="btn" href="{mailto('Kuns: Is dit net ek?')}">{I["mail"]}Ek wil hierdie een hê</a>
      </div>
    </li>
    <li class="work work--next rise">
      <div class="work__canvas"><p>Die volgende een is nog nat.</p></div>
      <div>
        <h3>Nuwe skilderye</h3>
        <p>Nuwe stukke verskyn eerste op haar Instagram stories, saam met die betaalskakel.</p>
        <a class="btn" href="{IG}" target="_blank" rel="noopener">{I["ig"]}Volg @chameleonqueen_sa</a>
      </div>
    </li>
  </ul>
</section>

<section class="how" aria-labelledby="how-h">
  <h2 id="how-h">So koop jy 'n skildery</h2>
  <ol class="how__steps">
    <li><div>Tik op "Ek wil hierdie een hê".<span>Jou e-pos maak oop met die skildery se naam reeds ingevul.</span></div></li>
    <li><div>Andrea antwoord met die prys en 'n betaalskakel.<span>Sy bevestig ook die grootte en hoe die doek by jou uitkom.</span></div></li>
    <li><div>Betaal, en die doek is joune.<span>Elke skildery is 'n eenmalige stuk.</span></div></li>
  </ol>
</section>
</main>
''' + foot()

for fn, html in (("index.html", home), ("journal.html", journal), ("kuns.html", kuns)):
    open(os.path.join(OUT, fn), "w").write(html)
print("ok")
