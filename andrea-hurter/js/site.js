/* Andrea Hurter — site behaviour. No libraries. */
(() => {
  const root = document.documentElement;
  root.classList.remove("no-js");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, v);
      } catch {}
    },
  };

  /* ---------- skin: the chameleon ---------- */
  const hexToRgb = (h) => {
    const n = parseInt(h.replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const lum = ([r, g, b]) => {
    const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const onColour = (hex) => (lum(hexToRgb(hex)) > 0.2 ? "#17140f" : "#f4f5f1");

  // el = a scoped surface (gallery, lightbox) or the whole page
  function setSkin(hex, el = root) {
    el.style.setProperty("--skin", hex);
    el.style.setProperty("--on-skin", onColour(hex));
  }

  // the user's chosen skin from the menu re-colours every skin surface
  const saved = store.get("ah-skin");
  if (saved) setSkin(saved);

  /* ---------- menu ---------- */
  const burger = document.querySelector(".burger");
  const menu = document.getElementById("menu");
  let lastFocus = null;
  function openMenu(open) {
    if (!menu) return;
    if (open) {
      lastFocus = document.activeElement;
      root.setAttribute("data-menu-open", "");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Maak die kieslys toe");
      menu.removeAttribute("inert");
      setTimeout(() => menu.querySelector("a")?.focus({ preventScroll: true }), 80);
    } else {
      root.removeAttribute("data-menu-open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Maak die kieslys oop");
      menu.setAttribute("inert", "");
      lastFocus?.focus?.({ preventScroll: true });
    }
  }
  burger?.addEventListener("click", () => openMenu(!root.hasAttribute("data-menu-open")));
  menu?.addEventListener("click", (e) => {
    if (e.target.closest("a")) openMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.hasAttribute("data-menu-open")) openMenu(false);
    if (e.key === "Tab" && root.hasAttribute("data-menu-open")) {
      const f = [...menu.querySelectorAll("a, button, [tabindex='0']"), burger];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && i === f.length - 1) {
        e.preventDefault();
        f[0].focus();
      }
    }
  });

  /* skin scrubber: drag a finger along the strip and the whole site changes colour */
  const stops = ["#f2c300", "#ee7f1b", "#c8321f", "#9b6a93", "#afcbe6", "#8fa83a", "#17140f"];
  const mix = (a, b, t) => {
    const A = hexToRgb(a),
      B = hexToRgb(b);
    return (
      "#" +
      A.map((v, i) =>
        Math.round(v + (B[i] - v) * t)
          .toString(16)
          .padStart(2, "0")
      ).join("")
    );
  };
  const colourAt = (p) => {
    const x = Math.min(0.9999, Math.max(0, p)) * (stops.length - 1);
    const i = Math.floor(x);
    return mix(stops[i], stops[i + 1], x - i);
  };
  const strip = document.querySelector(".skinner__strip");
  if (strip) {
    const knob = strip.querySelector(".skinner__knob");
    let p = parseFloat(store.get("ah-skin-p") ?? "0");
    const paint = (np, persist) => {
      p = Math.min(1, Math.max(0, np));
      knob.style.setProperty("--x", p * 100 + "%");
      strip.setAttribute("aria-valuenow", Math.round(p * 100));
      strip.setAttribute("aria-valuetext", colourName(p));
      const c = colourAt(p);
      setSkin(c);
      document.querySelectorAll("[data-skin-scope]").forEach((el) => setSkin(c, el));
      if (persist) {
        store.set("ah-skin", c);
        store.set("ah-skin-p", String(p));
      }
    };
    const names = ["Canola", "Naartjie", "Massey-rooi", "Sonsak-pers", "Lug", "Koring", "Ink"];
    const colourName = (q) => names[Math.round(q * (names.length - 1))];
    knob.style.setProperty("--x", p * 100 + "%");
    strip.setAttribute("aria-valuetext", colourName(p));
    const fromEvent = (e) => {
      const r = strip.getBoundingClientRect();
      return (e.clientX - r.left) / r.width;
    };
    let dragging = false;
    strip.addEventListener("pointerdown", (e) => {
      dragging = true;
      strip.setPointerCapture(e.pointerId);
      paint(fromEvent(e), false);
    });
    strip.addEventListener("pointermove", (e) => dragging && paint(fromEvent(e), false));
    const end = () => {
      if (!dragging) return;
      dragging = false;
      paint(p, true);
    };
    strip.addEventListener("pointerup", end);
    strip.addEventListener("pointercancel", end);
    strip.addEventListener("keydown", (e) => {
      const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
      if (step) {
        e.preventDefault();
        paint(p + step / (stops.length - 1) / 2, true);
      }
    });
  }

  /* ---------- reveals ---------- */
  const rises = document.querySelectorAll(".rise");
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px" }
    );
    rises.forEach((el) => io.observe(el));
  } else rises.forEach((el) => el.classList.add("is-in"));

  /* ---------- gallery ---------- */
  const gallery = document.querySelector(".gallery");
  if (gallery) initGallery(gallery);

  function initGallery(g) {
    const wall = g.querySelector(".wall");
    const items = [...wall.querySelectorAll("li")];
    const data = items.map((li) => {
      const img = li.querySelector("img");
      return {
        li,
        src: img.currentSrc || img.src,
        big: li.dataset.big,
        alt: img.alt,
        cap: li.querySelector("figcaption span").textContent,
        skin: li.dataset.skin,
        tags: li.dataset.tags.split(" "),
        wide: li.classList.contains("is-wide"),
      };
    });
    let visible = data.slice();
    const userSkin = () => store.get("ah-skin");

    // chameleon: the gallery takes the colour of whatever photo you're looking at
    const skinFromPhoto = (d) => setSkin(d.skin, g);

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (g.dataset.view !== "wall") return;
          const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (best) skinFromPhoto(data.find((d) => d.li === best.target));
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.5, 1] }
      );
      items.forEach((li) => io.observe(li));
    }

    /* view toggle */
    const viewBtns = g.querySelectorAll("[data-set-view]");
    const setView = (v) => {
      g.dataset.view = v;
      viewBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setView === v)));
      if (v === "stack") renderStack();
    };
    viewBtns.forEach((b) => b.addEventListener("click", () => setView(b.dataset.setView)));

    /* filters */
    const filterBtns = g.querySelectorAll("[data-filter]");
    filterBtns.forEach((b) =>
      b.addEventListener("click", () => {
        const f = b.dataset.filter;
        filterBtns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        visible = data.filter((d) => f === "alles" || d.tags.includes(f));
        data.forEach((d) => (d.li.hidden = !visible.includes(d)));
        top = 0;
        if (g.dataset.view === "stack") renderStack();
        else if (visible[0]) skinFromPhoto(visible[0]);
        const live = g.querySelector("[data-live]");
        if (live) live.textContent = `${visible.length} foto's`;
      })
    );

    /* stack — flick through her photos like a deck of cards */
    const deck = g.querySelector(".stack__deck");
    const capEl = g.querySelector("[data-stack-cap]");
    const countEl = g.querySelector("[data-stack-count]");
    let top = 0;
    let cards = [];

    function renderStack() {
      deck.innerHTML = "";
      cards = visible.map((d, i) => {
        const f = document.createElement("figure");
        f.className = "stack__card" + (d.wide ? " is-wide" : "");
        const im = document.createElement("img");
        im.src = d.big;
        im.alt = d.alt;
        im.loading = i < 3 ? "eager" : "lazy";
        im.decoding = "async";
        im.draggable = false;
        f.append(im);
        deck.append(f);
        return f;
      });
      position();
    }
    function position() {
      if (!visible.length) return;
      cards.forEach((c, i) => {
        const pos = (i - top + visible.length) % visible.length;
        c.dataset.pos = pos < 3 ? String(pos) : "hidden";
        c.style.transform = "";
        c.setAttribute("aria-hidden", pos === 0 ? "false" : "true");
      });
      const d = visible[top];
      capEl.textContent = d.cap;
      countEl.textContent = `${top + 1} van ${visible.length}`;
      skinFromPhoto(d);
    }
    const go = (dir) => {
      if (!visible.length) return;
      const card = cards[top];
      if (!reduced && dir > 0) {
        card.style.transform = `translate(${dir * 130}%, -6%) rotate(${dir * 22}deg)`;
        card.style.opacity = "0";
        setTimeout(() => (card.style.opacity = ""), 420);
      }
      top = (top + (dir > 0 ? 1 : -1) + visible.length) % visible.length;
      setTimeout(position, reduced || dir < 0 ? 0 : 90);
    };
    g.querySelector("[data-stack-next]")?.addEventListener("click", () => go(1));
    g.querySelector("[data-stack-prev]")?.addEventListener("click", () => go(-1));
    deck.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Enter") openLightbox(visible[top]);
    });

    let sx = 0,
      sy = 0,
      dx = 0,
      active = null,
      moved = false;
    deck.addEventListener("pointerdown", (e) => {
      const c = e.target.closest(".stack__card");
      if (!c || c.dataset.pos !== "0") return;
      active = c;
      sx = e.clientX;
      sy = e.clientY;
      dx = 0;
      moved = false;
      c.classList.add("is-dragging");
      c.setPointerCapture(e.pointerId);
    });
    deck.addEventListener("pointermove", (e) => {
      if (!active) return;
      dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (Math.abs(dx) > 6) moved = true;
      active.style.transform = `translate(${dx}px, ${dy * 0.25}px) rotate(${dx / 14}deg)`;
    });
    const release = () => {
      if (!active) return;
      const c = active;
      active = null;
      c.classList.remove("is-dragging");
      if (Math.abs(dx) > 90) {
        c.style.transform = `translate(${Math.sign(dx) * 140}%, 0) rotate(${Math.sign(dx) * 24}deg)`;
        c.style.opacity = "0";
        setTimeout(() => (c.style.opacity = ""), 420);
        top = (top + 1) % visible.length;
        setTimeout(position, 90);
      } else {
        c.style.transform = "";
        if (!moved) openLightbox(visible[top]);
      }
    };
    deck.addEventListener("pointerup", release);
    deck.addEventListener("pointercancel", release);

    /* lightbox */
    const lb = document.getElementById("lightbox");
    const lbImg = lb.querySelector("img");
    const lbCap = lb.querySelector("[data-lb-cap]");
    const lbCount = lb.querySelector("[data-lb-count]");
    let lbIndex = 0;
    function showLb(i) {
      lbIndex = (i + visible.length) % visible.length;
      const d = visible[lbIndex];
      lbImg.src = d.big;
      lbImg.alt = d.alt;
      lbCap.textContent = d.cap;
      lbCount.textContent = `${lbIndex + 1} van ${visible.length}`;
      setSkin(d.skin, lb);
    }
    function openLightbox(d) {
      showLb(visible.indexOf(d));
      lb.showModal();
    }
    items.forEach((li, i) =>
      li.querySelector("button").addEventListener("click", () => openLightbox(data[i]))
    );
    lb.querySelector("[data-lb-next]").addEventListener("click", () => showLb(lbIndex + 1));
    lb.querySelector("[data-lb-prev]").addEventListener("click", () => showLb(lbIndex - 1));
    lb.querySelector("[data-lb-close]").addEventListener("click", () => lb.close());
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") showLb(lbIndex + 1);
      if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    });
    let lx = null;
    const stage = lb.querySelector(".lightbox__stage");
    stage.addEventListener("pointerdown", (e) => (lx = e.clientX));
    stage.addEventListener("pointerup", (e) => {
      if (lx === null) return;
      const d = e.clientX - lx;
      lx = null;
      if (Math.abs(d) > 50) showLb(lbIndex + (d < 0 ? 1 : -1));
    });

    setView(matchMedia("(min-width: 768px)").matches ? "wall" : "stack");
    if (userSkin() && g.dataset.view === "wall") setSkin(userSkin(), g);
  }

  /* ---------- booking picker: builds the email for you ---------- */
  const picker = document.querySelector(".picker");
  if (picker) {
    const send = document.querySelector("[data-book-send]");
    const chips = picker.querySelectorAll(".chip");
    const update = () => {
      const picked = [...chips].filter((c) => c.getAttribute("aria-pressed") === "true").map((c) => c.dataset.want);
      const subject = picked.length ? `Booking: ${picked.join(" + ")}` : "Booking enquiry";
      const body = `Hi Andrea,\n\nI'd love to book you for: ${picked.join(", ") || "..."}\nDate:\nWhere:\nAbout the event / project:\n\n`;
      send.href = `mailto:andreahurter55@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      send.querySelector("span").textContent = picked.length ? `E-pos Andrea oor ${picked.join(" + ").toLowerCase()}` : "E-pos Andrea";
    };
    chips.forEach((c) =>
      c.addEventListener("click", () => {
        c.setAttribute("aria-pressed", String(c.getAttribute("aria-pressed") !== "true"));
        update();
      })
    );
    update();
  }

  /* ---------- footer name: touch it and the letters stretch ---------- */
  document.querySelectorAll(".bigname").forEach((el) => {
    const letters = [...el.textContent.trim()];
    el.setAttribute("aria-label", el.textContent.trim());
    el.textContent = "";
    const spans = letters.map((ch) => {
      const s = document.createElement("span");
      s.textContent = ch === " " ? " " : ch;
      s.setAttribute("aria-hidden", "true");
      el.append(s);
      return s;
    });
    const play = (x) => {
      spans.forEach((s) => {
        const r = s.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - x) / window.innerWidth;
        const k = Math.max(0, 1 - d * 5);
        s.style.setProperty("--w", 75 + k * 25 + "%");
        s.style.setProperty("--wg", Math.round(800 - k * 500));
        s.classList.toggle("is-hot", k > 0.7);
      });
    };
    const calm = () =>
      spans.forEach((s) => {
        s.style.removeProperty("--w");
        s.style.removeProperty("--wg");
        s.classList.remove("is-hot");
      });
    el.addEventListener("pointermove", (e) => play(e.clientX));
    el.addEventListener("pointerdown", (e) => play(e.clientX));
    el.addEventListener("pointerleave", calm);
    el.addEventListener("pointerup", (e) => e.pointerType !== "mouse" && setTimeout(calm, 600));
    // phones: the name breathes as it scrolls into view
    if (!reduced && "IntersectionObserver" in window) {
      new IntersectionObserver(
        ([en]) => {
          if (en.isIntersecting) {
            let x = 0;
            const t = setInterval(() => {
              play((x / 20) * window.innerWidth);
              if (++x > 20) {
                clearInterval(t);
                calm();
              }
            }, 45);
          }
        },
        { threshold: 0.9 }
      ).observe(el);
    }
  });

  /* ---------- journal: years bars grow in ---------- */
  const bars = document.querySelectorAll(".years__bars .bar-line");
  if (bars.length && "IntersectionObserver" in window && !reduced) {
    bars.forEach((b) => b.style.setProperty("--grow", 0));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.style.setProperty("--grow", 1);
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.6 }
    );
    bars.forEach((b) => io.observe(b));
  }

  /* ---------- journal: copy a line ---------- */
  document.querySelectorAll("[data-copy]").forEach((b) =>
    b.addEventListener("click", async () => {
      const text = b.dataset.copy;
      const label = b.querySelector(".copy");
      try {
        await navigator.clipboard.writeText(text);
        label.textContent = "Gekopieer";
      } catch {
        label.textContent = "Kon nie kopieer nie";
      }
      b.classList.add("is-copied");
      setTimeout(() => {
        b.classList.remove("is-copied");
        label.textContent = "Kopieer";
      }, 1800);
    })
  );

  /* ---------- journal: your page ---------- */
  const pad = document.getElementById("jou-bladsy");
  if (pad) {
    const promptEl = document.querySelector("[data-prompt]");
    const prompts = [...document.querySelectorAll("#prompts li")].map((li) => li.textContent);
    let pi = 0;
    document.querySelector("[data-next-prompt]")?.addEventListener("click", () => {
      pi = (pi + 1) % prompts.length;
      promptEl.textContent = prompts[pi];
    });
    const savedEl = document.querySelector("[data-saved]");
    pad.value = store.get("ah-journal") ?? "";
    let t;
    pad.addEventListener("input", () => {
      clearTimeout(t);
      savedEl.textContent = "";
      t = setTimeout(() => {
        store.set("ah-journal", pad.value);
        savedEl.textContent = "Gestoor op hierdie foon.";
      }, 500);
    });
    document.querySelector("[data-clear]")?.addEventListener("click", () => {
      pad.value = "";
      store.set("ah-journal", "");
      savedEl.textContent = "Bladsy skoon.";
      pad.focus();
    });
  }
})();
