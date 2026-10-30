/* ==========================================================
   TRANQUIL TREE — theme.js. Plain JS, no libraries.
   Cart: /cart/add.js + /cart/change.js, then the cart-drawer section
   is re-rendered by Shopify. Search: predictive search section.
   Every part checks its element exists, so sections can be removed,
   reordered or added in the theme editor without breaking anything.
   ========================================================== */
(() => {
const T = window.theme || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || T.motion === false;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const icon = n => `<svg class="i" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

/* ---------- money ---------- */
function formatMoney(cents, format = T.moneyFormat || 'R{{amount}}'){
  cents = Number(cents) || 0;
  const fmt = (n, d, t = ',', dec = '.') => {
    const [w, f] = (n / 100).toFixed(d).split('.');
    return w.replace(/\B(?=(\d{3})+(?!\d))/g, t) + (f ? dec + f : '');
  };
  return format.replace(/\{\{\s*(\w+)\s*\}\}/, (_, k) => ({
    amount: fmt(cents, 2),
    amount_no_decimals: fmt(cents, 0),
    amount_with_comma_separator: fmt(cents, 2, '.', ','),
    amount_no_decimals_with_comma_separator: fmt(cents, 0, '.', ','),
    amount_with_space_separator: fmt(cents, 2, ' ', ','),
    amount_no_decimals_with_space_separator: fmt(cents, 0, ' ', ','),
    amount_with_apostrophe_separator: fmt(cents, 2, "'", '.'),
  }[k] ?? fmt(cents, 2)));
}

/* ---------- toast ---------- */
function toast(msg){
  let el = $('.toast');
  if(!el){ el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = msg; el.classList.add('is-on');
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('is-on'), 3200);
}

/* ---------- layers: menu, search, cart ---------- */
let lastFocus = null;
function setMenuTop(){
  const h = $('[data-header]');
  if(h) document.documentElement.style.setProperty('--menu-top', Math.max(0, h.getBoundingClientRect().bottom) + 'px');
}
function openLayer(id){
  const el = document.getElementById(id); if(!el) return false;
  if(id === 'menu' && el.classList.contains('is-open') && innerWidth >= 1024){ closeAll(); return true; }
  closeAll(true);
  lastFocus = document.activeElement;
  if(id === 'menu'){ setMenuTop(); $('[data-menu-scrim]')?.classList.add('is-open'); }
  el.classList.add('is-open');
  if(id === 'cart') $('[data-scrim]')?.classList.add('is-open');
  if(!(id === 'menu' && innerWidth >= 1024)) document.body.style.overflow = 'hidden';
  $$(`[aria-controls="${id}"]`).forEach(b => b.setAttribute('aria-expanded', 'true'));
  setTimeout(() => { const f = id === 'search' ? $('input[type="search"]', el) : $('[data-close], a, button', el); f && f.focus({ preventScroll:true }); }, 80);
  return true;
}
function closeAll(silent){
  $$('.menu.is-open, .panel.is-open, .drawer.is-open, .scrim.is-open, .menu-scrim.is-open').forEach(el => el.classList.remove('is-open'));
  $$('[aria-controls="menu"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  document.body.style.overflow = '';
  if(!silent && lastFocus) lastFocus.focus({ preventScroll:true });
}
function openSheet(id){
  const el = document.getElementById(id); if(!el) return;
  closeAll(true);
  el.classList.add('is-open'); $('[data-sheet-scrim]')?.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('[data-sheet-close]', el)?.focus({ preventScroll:true }), 60);
}
function closeSheets(){
  $$('.sheet.is-open, .sheet-scrim.is-open').forEach(el => el.classList.remove('is-open'));
  document.body.style.overflow = '';
}

/* ---------- cart ---------- */
const Cart = {
  async add(id, quantity = 1){
    const res = await fetch(T.routes.cartAdd + '.js', {
      method:'POST', headers:{ 'Content-Type':'application/json', Accept:'application/json' },
      body: JSON.stringify({ items:[{ id:Number(id), quantity:Number(quantity) || 1 }] })
    });
    const data = await res.json();
    if(!res.ok){ toast(data.description || data.message || 'That could not be added. Please try again.'); return false; }
    await this.refresh();
    return true;
  },
  async change(line, quantity){
    const res = await fetch(T.routes.cartChange + '.js', {
      method:'POST', headers:{ 'Content-Type':'application/json', Accept:'application/json' },
      body: JSON.stringify({ line:Number(line), quantity:Math.max(0, Number(quantity)) })
    });
    if(!res.ok){ const d = await res.json().catch(() => ({})); toast(d.description || 'That could not be changed.'); }
    await this.refresh();
  },
  async refresh(){
    const res = await fetch(`${T.routes.root}?section_id=cart-drawer`);
    if(!res.ok) return;
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    const inner = $('[data-cart-inner]', doc), now = $('[data-cart-inner]');
    if(inner && now) now.innerHTML = inner.innerHTML;
    const n = Number($('[data-cart-count]', doc)?.textContent || 0);
    $$('[data-count]').forEach(el => { el.textContent = n; el.classList.toggle('has', n > 0); });
    loadPair();
  }
};
async function loadPair(){
  const box = $('[data-pair-for]'); if(!box || box.dataset.loaded) return;
  box.dataset.loaded = 1;
  try{
    const res = await fetch(`${T.routes.recommendations}?product_id=${box.dataset.pairFor}&limit=4&intent=related&section_id=recs-pair`);
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    const row = $('.pair-row', doc);
    if(row){ box.innerHTML = `<p>${esc(box.dataset.pairTitle)}</p>` + row.outerHTML; box.hidden = false; }
  }catch(e){}
}
async function addWithButton(btn, id, qty){
  const label = $('.btn-t', btn);
  btn.classList.add('is-loading'); btn.setAttribute('aria-busy', 'true');
  const ok = await Cart.add(id, qty);
  btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy');
  if(!ok) return;
  if(label){ const old = label.textContent; btn.classList.add('is-done'); label.textContent = 'Added'; setTimeout(() => { btn.classList.remove('is-done'); label.textContent = old; }, 1400); }
  else { btn.classList.add('is-done'); setTimeout(() => btn.classList.remove('is-done'), 1400); }
  if(document.body.classList.contains('tmpl-cart')) location.reload(); else openLayer('cart');
}

/* ---------- variant helpers ---------- */
function pickVariant(variants, chosen){
  return variants.find(v => v.options.every((o, i) => chosen[i] === undefined || o === chosen[i]));
}

/* ---------- quick add (products with flavours or sizes) ---------- */
async function openQuickAdd(handle){
  const body = $('[data-qv-body]'); if(!body) return;
  body.innerHTML = '<p class="search-empty">Loading…</p>';
  openSheet('qv-sheet');
  let p;
  try{ p = await (await fetch(`${T.routes.root}products/${handle}.js`)).json(); }catch(e){ body.innerHTML = '<p class="search-empty">That product could not load. Please try again.</p>'; return; }
  const title = $('[data-qv-title]'); if(title) title.textContent = `Choose ${p.options[0]?.name?.toLowerCase() || 'an option'}`;
  let v = p.variants.find(x => x.available) || p.variants[0];
  const sized = u => u + (u.includes('?') ? '&' : '?') + 'width=240';
  const img = p.featured_image ? `<div class="ph has-img"><img class="pi" src="${sized(p.featured_image)}" alt="${esc(p.title)}" width="96" height="96"></div>` : `<div class="ph">${icon('image')}</div>`;
  body.innerHTML = `
    <div class="qv">${img}<div><b>${esc(p.title)}</b><span class="price" data-qv-price>${formatMoney(v.price)}</span><br><a href="${p.url}">See everything about it</a></div></div>
    ${p.options.map((o, i) => `<fieldset class="opts"><legend>${esc(o.name)}</legend><div class="opt-row">${o.values.map(val => `<label><input type="radio" name="qv-${i}" value="${esc(val)}" data-qv-opt="${i}" ${v.options[i] === val ? 'checked' : ''}><span>${esc(val)}</span></label>`).join('')}</div></fieldset>`).join('')}
    <div style="height:16px"></div>
    <button class="btn btn-wide" type="button" style="min-height:56px" data-qv-add="${v.id}" ${v.available ? '' : 'disabled'}><span class="btn-t">${v.available ? 'Add to cart' : 'Sold out'}</span></button>
    <div style="height:8px"></div>`;
  body.onchange = () => {
    const chosen = p.options.map((_, i) => $(`input[name="qv-${i}"]:checked`, body)?.value);
    v = pickVariant(p.variants, chosen) || v;
    $('[data-qv-price]', body).textContent = formatMoney(v.price);
    const b = $('[data-qv-add]', body); b.dataset.qvAdd = v.id; b.disabled = !v.available;
    $('.btn-t', b).textContent = v.available ? 'Add to cart' : 'Sold out';
  };
}

/* ---------- product page ---------- */
function initProduct(root = document){
  const wrap = $('[data-product]', root); if(!wrap || wrap.dataset.ready) return;
  wrap.dataset.ready = 1;
  const variants = JSON.parse($('[data-variants]')?.textContent || '[]');
  const form = $('[data-product-form]', wrap);
  const idInput = $('[data-variant-id]', wrap);
  const mainAdd = $('[data-main-add]', wrap);
  let qty = 1;

  // quantity
  wrap.addEventListener('click', e => {
    const b = e.target.closest('[data-pq]'); if(!b) return;
    qty = Math.max(1, qty + Number(b.dataset.pq));
    const v = $('[data-pq-val]', wrap); if(v) v.textContent = qty;
    const inp = $('[data-pq-input]', wrap); if(inp) inp.value = qty;
  });

  // variant picker
  const picker = $('[data-variant-picker]', wrap);
  picker && picker.addEventListener('change', () => {
    const chosen = $$('fieldset', picker).map(fs => $('input:checked', fs)?.value);
    const v = pickVariant(variants, chosen); if(!v) return;
    if(idInput) idInput.value = v.id;
    $$('[data-price]').forEach(el => {
      el.innerHTML = formatMoney(v.price) + (v.compare_at_price > v.price ? ` <s class="was">${formatMoney(v.compare_at_price)}</s>` : '');
    });
    [mainAdd, $('[data-sb-add]')].forEach(b => { if(!b) return; b.disabled = !v.available; const l = $('.btn-t', b); if(l) l.textContent = v.available ? 'Add to cart' : 'Sold out'; });
    const url = new URL(location.href); url.searchParams.set('variant', v.id); history.replaceState(null, '', url);
    if(v.featured_media){ const slide = $(`[data-media-id="${v.featured_media.id}"]`, wrap); const g = $('[data-gallery]', wrap); if(slide && g) g.scrollTo({ left:slide.offsetLeft - g.offsetLeft, behavior: reduce ? 'auto' : 'smooth' }); }
  });

  // add to cart without leaving the page
  form && form.addEventListener('submit', e => {
    e.preventDefault();
    addWithButton(mainAdd, idInput.value, qty);
  });

  // gallery dots
  const g = $('[data-gallery]', wrap), dots = $$('[data-dots] button', wrap);
  if(g && dots.length){
    const step = () => (g.firstElementChild.offsetWidth + 8);
    g.addEventListener('scroll', () => { const i = Math.round(g.scrollLeft / step()); dots.forEach((d, j) => j === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')); }, { passive:true });
    dots.forEach((d, i) => d.addEventListener('click', () => g.scrollTo({ left:i * step(), behavior: reduce ? 'auto' : 'smooth' })));
  }

  // slim add-to-cart bar once the main button scrolls away (phones)
  const sb = $('[data-sticky-buy]');
  if(sb && mainAdd){
    new IntersectionObserver(([en]) => { const on = !en.isIntersecting && en.boundingClientRect.top < 0; sb.classList.toggle('is-on', on); sb.setAttribute('aria-hidden', String(!on)); }).observe(mainAdd);
    $('[data-sb-add]', sb)?.addEventListener('click', () => form?.requestSubmit());
  }

  // goes well with
  $$('[data-recs]').forEach(async sec => {
    if(sec.dataset.loaded) return; sec.dataset.loaded = 1;
    try{
      const doc = new DOMParser().parseFromString(await (await fetch(sec.dataset.url)).text(), 'text/html');
      const fresh = $('[data-recs]', doc);
      if(fresh && fresh.innerHTML.trim()) sec.innerHTML = fresh.innerHTML; else sec.remove();
      initWords(sec); initReveal(sec);
    }catch(e){}
  });
}

/* ---------- product rails: dots under the bestsellers swipe ---------- */
function initRails(root = document){
  $$('[data-rail]', root).forEach(rail => {
    if(rail.dataset.ready) return; rail.dataset.ready = 1;
    const box = rail.parentElement.querySelector('[data-rail-dots]'); if(!box) return;
    box.innerHTML = [...rail.children].map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('');
    const dots = [...box.children];
    rail.addEventListener('scroll', () => { const c = rail.firstElementChild; if(!c) return; const i = Math.round(rail.scrollLeft / (c.offsetWidth + 14)); dots.forEach((d, j) => d.classList.toggle('on', j === i)); }, { passive:true });
  });
}

/* ---------- live feeds: best-sellers rows and tile photos ---------- */
// Rows with no collection picked load her best-sellers (Shopify's sales order);
// tiles with no photo borrow the photo of the first product their search finds.
const fetchDoc = async url => new DOMParser().parseFromString(await (await fetch(url)).text(), 'text/html');
function initFeeds(root = document){
  $$('[data-feed-src]', root).forEach(async box => {
    if(box.dataset.loaded) return; box.dataset.loaded = 1;
    try{
      const feed = $('[data-feed]', await fetchDoc(box.dataset.feedSrc)); if(!feed || !feed.children.length) return;
      const limit = Number(box.dataset.feedLimit) || 12;
      box.innerHTML = [...feed.children].slice(0, limit).map(c => c.outerHTML).join('');
      if(box.hasAttribute('data-rail')){ delete box.dataset.ready; initRails(box.parentElement); }
      initReveal(box);
    }catch(e){}
  });
  $$('[data-thumb-src]', root).forEach(async ph => {
    if(ph.dataset.loaded) return; ph.dataset.loaded = 1;
    try{
      const t = $('[data-thumb]', await fetchDoc(ph.dataset.thumbSrc));
      if(t){ ph.innerHTML = t.innerHTML; ph.classList.add('has-img'); }
    }catch(e){}
  });
  // search page opened from a tile or menu: show the tile's name as the heading
  const st = $('[data-search-title]'), title = new URLSearchParams(location.search).get('title');
  if(st && title && !st.dataset.set){ st.dataset.set = 1; st.textContent = title; document.title = title + ' – ' + document.title.split(' – ').pop(); const f = $('.shop-find input[name="q"]'); if(f) f.value = ''; }
}

/* ---------- predictive search ---------- */
function initSearch(){
  const input = $('[data-search-input]'), out = $('[data-search-results]');
  if(!input || !out || input.dataset.ready) return; input.dataset.ready = 1;
  let timer, ctrl;
  const run = async () => {
    const q = input.value.trim();
    if(!q){ out.innerHTML = ''; return; }
    ctrl?.abort(); ctrl = new AbortController();
    try{
      const url = `${T.routes.predictive}?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=8&section_id=predictive-search`;
      const doc = new DOMParser().parseFromString(await (await fetch(url, { signal:ctrl.signal })).text(), 'text/html');
      const sec = $('.shopify-section', doc) || doc.body;
      out.innerHTML = sec.innerHTML;
    }catch(e){}
  };
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 180); });
  $('[data-chips]')?.addEventListener('click', e => { const b = e.target.closest('button'); if(b){ input.value = b.textContent.trim(); run(); input.focus(); } });
}

/* ---------- collection: sort, filters, load more ---------- */
function goWithForm(form){
  const params = new URLSearchParams();
  new FormData(form).forEach((v, k) => { if(v !== '') params.append(k, v); });
  const sort = $('[data-sort-select]')?.value; if(sort && !params.has('sort_by')) params.set('sort_by', sort);
  location.search = params.toString();
}
function initCollection(root = document){
  const sel = $('[data-sort-select]', root);
  if(sel && !sel.dataset.ready){
    sel.dataset.ready = 1;
    sel.addEventListener('change', () => { const u = new URL(location.href); u.searchParams.set('sort_by', sel.value); u.searchParams.delete('page'); location.href = u; });
  }
  $$('[data-filter-form]', root).forEach(form => {
    if(form.dataset.ready) return; form.dataset.ready = 1;
    if(form.hasAttribute('data-manual')) form.addEventListener('submit', e => { e.preventDefault(); goWithForm(form); });
    else { let t; form.addEventListener('change', () => { clearTimeout(t); t = setTimeout(() => goWithForm(form), 250); }); form.addEventListener('submit', e => { e.preventDefault(); goWithForm(form); }); }
  });
}
async function loadMore(a){
  a.classList.add('is-loading');
  try{
    const doc = new DOMParser().parseFromString(await (await fetch(a.href)).text(), 'text/html');
    const grid = $('[data-shop-grid]'), more = $('[data-more]');
    $$('[data-shop-grid] > .card', doc).forEach(c => grid.appendChild(c));
    const nm = $('[data-more]', doc); if(more && nm) more.innerHTML = nm.innerHTML;
    initReveal(grid);
  }catch(e){ location.href = a.href; }
}

/* ---------- clicks ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-open],[data-close],[data-scrim],[data-menu-scrim],[data-add],[data-qv],[data-qv-add],[data-line],[data-top],[data-sheet],[data-sheet-close],[data-sheet-scrim],[data-load-more]');
  if(!t) return;
  if(t.matches('[data-open]')){ if(openLayer(t.dataset.open)) e.preventDefault(); return; }
  if(t.matches('[data-close],[data-scrim],[data-menu-scrim]')){ closeAll(); return; }
  if(t.matches('[data-sheet]')){ openSheet(t.dataset.sheet); return; }
  if(t.matches('[data-sheet-close],[data-sheet-scrim]')){ closeSheets(); return; }
  if(t.matches('[data-top]')){ scrollTo({ top:0, behavior: reduce ? 'auto' : 'smooth' }); return; }
  if(t.matches('[data-line]')){ Cart.change(t.dataset.line, t.dataset.qtyTo); return; }
  if(t.matches('[data-qv]')){ e.preventDefault(); openQuickAdd(t.dataset.qv); return; }
  if(t.matches('[data-qv-add]')){ closeSheets(); addWithButton(t, t.dataset.qvAdd, 1); return; }
  if(t.matches('[data-add]')){ e.preventDefault(); addWithButton(t, t.dataset.add, 1); return; }
  if(t.matches('[data-load-more]')){ e.preventDefault(); loadMore(t); return; }
});
document.addEventListener('keydown', e => { if(e.key === 'Escape'){ closeAll(); closeSheets(); } });

/* ---------- footer columns: closed on phones, open on desktop ---------- */
const syncCols = () => $$('[data-fcols] details').forEach(d => d.open = innerWidth >= 768);

/* ---------- word-by-word headlines ---------- */
// Words inside <em class="hl-src"> are marked so they turn yellow once built.
function splitWords(el){
  if(el.dataset.split) return; el.dataset.split = 1;
  el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  const words = [];
  el.childNodes.forEach(n => {
    const hl = n.nodeType === 1 && n.classList.contains('hl-src');
    (n.textContent || '').split(/\s+/).filter(Boolean).forEach(w => words.push({ w, hl }));
  });
  el.innerHTML = words.map((x, i) => `<span class="w${x.hl ? ' hl' : ''}" aria-hidden="true"><span style="--i:${i}">${esc(x.w)}</span></span>`).join(' ');
}
const wordIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => { if(en.isIntersecting){ en.target.classList.add('is-in'); wordIO.unobserve(en.target); } }), { rootMargin:'0px 0px -10% 0px' }) : null;
function initWords(root = document){
  $$('[data-words]', root).forEach(el => {
    if(el.dataset.split) return;
    if(reduce){ el.classList.add('is-in'); return; }
    splitWords(el);
    if(el.hasAttribute('data-words-now') || !wordIO) requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
    else wordIO.observe(el);
  });
}

/* ---------- cards and boxes rise in as they reach the screen ---------- */
const rvIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => { if(en.isIntersecting){ en.target.classList.add('is-in'); rvIO.unobserve(en.target); } }), { rootMargin:'0px 0px -8% 0px' }) : null;
function initReveal(root = document){
  if(reduce || !rvIO) return;
  $$('.card, .retreat, .trust li, .f-join-in, .week, .path, .need', root).forEach(el => {
    if(el.classList.contains('rv')) return;
    const i = [...el.parentElement.children].indexOf(el) % 6;
    el.classList.add('rv'); el.style.setProperty('--rv', i); rvIO.observe(el);
  });
}

/* ---------- scroll engine: hero, travelling tiles, story, Shop button ---------- */
let S = {};
function collect(){
  S = {
    hero: $('[data-hero]'), travel: $('[data-travel]'), track: $('[data-track]'),
    story: $('[data-story]'), lines: $$('.story-line'), storyEnd: $('[data-story-end]'),
    fab: $('[data-fab]'), footer: $('.footer'), tCount: $('[data-travel-count]'), header: $('[data-header]')
  };
}
function sizeTravel(){
  if(reduce || !S.travel || !S.track) return;
  const overflow = Math.max(0, S.track.scrollWidth - innerWidth);
  S.travel.style.height = `calc(100svh + ${overflow}px)`;
  S.travel._overflow = overflow;
}
let ticking = false;
function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }
function frame(){
  ticking = false;
  const vh = innerHeight;
  S.header && S.header.classList.toggle('is-scrolled', scrollY > 8);
  if(S.hero){
    const hr = S.hero.getBoundingClientRect();
    if(!reduce) S.hero.style.setProperty('--hp', clamp(-hr.top / (hr.height * 0.45)).toFixed(3));
    S.fab && S.fab.classList.toggle('is-on', hr.bottom < 0 && (!S.footer || S.footer.getBoundingClientRect().top > vh - 40));
  } else if(S.fab){
    S.fab.classList.toggle('is-on', scrollY > vh * .6 && (!S.footer || S.footer.getBoundingClientRect().top > vh - 40));
  }
  if(!reduce && S.travel && S.track){
    const tr = S.travel.getBoundingClientRect();
    if(tr.top < vh && tr.bottom > 0){
      const tp = clamp(-tr.top / Math.max(1, S.travel._overflow || 1));
      S.track.style.setProperty('--tx', `${-(S.travel._overflow || 0) * tp}px`);
      S.travel.style.setProperty('--tp', tp.toFixed(3));
      if(S.tCount){ const n = Number(S.tCount.dataset.total) || 4; S.tCount.textContent = `${Math.min(n, 1 + Math.floor(tp * n))} of ${n}`; }
    }
  }
  if(!reduce && S.story){
    const sr = S.story.getBoundingClientRect();
    if(sr.top < vh && sr.bottom > 0){
      const p = clamp(-sr.top / (sr.height - vh));
      const lp = clamp(p / 0.55);
      S.lines.forEach((l, i) => l.classList.toggle('is-on', lp >= (i + 0.5) / S.lines.length));
      S.story.style.setProperty('--sp', clamp((p - 0.58) / 0.3).toFixed(3));
      S.story.style.setProperty('--sf', clamp((p - 0.56) / 0.08).toFixed(3));
      const se = clamp((p - 0.86) / 0.1);
      S.story.style.setProperty('--se', se.toFixed(3));
      S.storyEnd && S.storyEnd.classList.toggle('live', se > .5);
    }
  }
}

/* ---------- hero photo leans toward the mouse (desktop) ---------- */
function initHeroPointer(){
  const hm = S.hero; if(!hm || reduce || hm.dataset.ptr || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  hm.dataset.ptr = 1;
  hm.addEventListener('pointermove', e => { const r = hm.getBoundingClientRect();
    hm.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3));
    hm.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3)); });
  hm.addEventListener('pointerleave', () => { hm.style.setProperty('--mx', 0); hm.style.setProperty('--my', 0); });
}

/* ---------- start ---------- */
function init(root = document){
  if(reduce) document.documentElement.classList.add('still');
  collect();
  initWords(root); initReveal(root); initRails(root); initFeeds(root); initProduct(root); initCollection(root); initSearch();
  initHeroPointer(); syncCols(); sizeTravel(); frame();
  loadPair();
}
addEventListener('scroll', onScroll, { passive:true });
addEventListener('resize', () => { sizeTravel(); syncCols(); setMenuTop(); onScroll(); });
document.fonts && document.fonts.ready.then(() => { sizeTravel(); frame(); });
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init()); else init();

// Theme editor: re-run when a section is added, changed or reordered.
['shopify:section:load', 'shopify:section:reorder', 'shopify:section:unload'].forEach(ev => document.addEventListener(ev, e => {
  setTimeout(() => init(e.target), 0);
}));
document.addEventListener('shopify:block:select', e => { const s = e.target.closest('.sheet'); if(s) openSheet(s.id); });

window.TT = { Cart, openLayer, closeAll, toast, formatMoney };
})();
