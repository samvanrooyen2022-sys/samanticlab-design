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

  /* ---------- top bar turns solid once you leave the hero ---------- */
  const bar = document.querySelector(".bar");
  const solidAt = document.body.dataset.page === "home" ? () => window.innerHeight * 0.6 : () => 40;
  const onScroll = () => bar?.classList.toggle("is-solid", window.scrollY > solidAt());
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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
    if (!root.hasAttribute("data-menu-open")) return;
    if (e.key === "Escape") openMenu(false);
    if (e.key === "Tab") {
      const f = [...menu.querySelectorAll("a, button"), burger];
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
      { rootMargin: "0px 0px -8% 0px" }
    );
    rises.forEach((el) => io.observe(el));
  } else rises.forEach((el) => el.classList.add("is-in"));

  /* ---------- lightbox: shared by the gallery and any zoomable photo ---------- */
  const lb = document.getElementById("lightbox");
  let lbList = [];
  let lbIndex = 0;
  function showLb(i) {
    lbIndex = (i + lbList.length) % lbList.length;
    const d = lbList[lbIndex];
    const img = lb.querySelector("img");
    img.src = d.big;
    img.alt = d.alt;
    lb.querySelector("[data-lb-cap]").textContent = d.cap;
    lb.querySelector("[data-lb-count]").textContent = lbList.length > 1 ? `${lbIndex + 1} van ${lbList.length}` : "";
  }
  function openLightbox(list, i) {
    if (!lb) return;
    lbList = list;
    lb.toggleAttribute("data-single", list.length < 2);
    showLb(i);
    lb.showModal();
  }
  if (lb) {
    lb.querySelector("[data-lb-next]").addEventListener("click", () => showLb(lbIndex + 1));
    lb.querySelector("[data-lb-prev]").addEventListener("click", () => showLb(lbIndex - 1));
    lb.querySelector("[data-lb-close]").addEventListener("click", () => lb.close());
    lb.addEventListener("keydown", (e) => {
      if (lbList.length < 2) return;
      if (e.key === "ArrowRight") showLb(lbIndex + 1);
      if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    });
    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target.classList.contains("lightbox__stage")) lb.close();
    });
    let lx = null;
    const stage = lb.querySelector(".lightbox__stage");
    stage.addEventListener("pointerdown", (e) => (lx = e.clientX));
    stage.addEventListener("pointerup", (e) => {
      if (lx === null || lbList.length < 2) return;
      const d = e.clientX - lx;
      lx = null;
      if (Math.abs(d) > 50) showLb(lbIndex + (d < 0 ? 1 : -1));
    });
  }
  document.querySelectorAll("img.zoomable").forEach((img) => {
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    const open = () =>
      openLightbox([{ big: img.dataset.big || img.currentSrc || img.src, alt: img.alt, cap: img.dataset.cap || "" }], 0);
    img.addEventListener("click", open);
    img.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open()));
  });

  /* ---------- home: drag the photo strip with a mouse ---------- */
  document.querySelectorAll(".strip__track").forEach((t) => {
    let down = false,
      sx = 0,
      sl = 0;
    t.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      sx = e.clientX;
      sl = t.scrollLeft;
      t.classList.add("is-dragging");
    });
    addEventListener("pointermove", (e) => {
      if (down) t.scrollLeft = sl - (e.clientX - sx);
    });
    addEventListener("pointerup", () => {
      down = false;
      t.classList.remove("is-dragging");
    });
  });

  /* ---------- gallery page ---------- */
  const gallery = document.querySelector(".gallery");
  if (gallery) initGallery(gallery);

  function initGallery(g) {
    const items = [...g.querySelectorAll(".wall li")];
    const data = items.map((li) => {
      const img = li.querySelector("img");
      return {
        li,
        big: li.dataset.big || img.currentSrc || img.src,
        alt: img.alt,
        cap: li.querySelector("figcaption").textContent,
        tags: li.dataset.tags.split(" "),
        wide: li.classList.contains("is-wide"),
      };
    });
    let visible = data.slice();
    let top = 0;
    let cards = [];
    const deck = g.querySelector(".stack__deck");
    const capEl = g.querySelector("[data-stack-cap]");
    const countEl = g.querySelector("[data-stack-count]");

    const viewBtns = g.querySelectorAll("[data-set-view]");
    const setView = (v) => {
      g.dataset.view = v;
      viewBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setView === v)));
      if (v === "stack") renderStack();
    };
    viewBtns.forEach((b) => b.addEventListener("click", () => setView(b.dataset.setView)));

    const filterBtns = g.querySelectorAll("[data-filter]");
    const live = g.querySelector("[data-live]");
    filterBtns.forEach((b) =>
      b.addEventListener("click", () => {
        const f = b.dataset.filter;
        filterBtns.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        visible = data.filter((d) => f === "alles" || d.tags.includes(f));
        data.forEach((d) => (d.li.hidden = !visible.includes(d)));
        top = 0;
        if (g.dataset.view === "stack") renderStack();
        if (live) live.textContent = `${visible.length} foto's`;
      })
    );

    // stack: flick through her photos like a deck of cards
    function renderStack() {
      deck.innerHTML = "";
      cards = visible.map((d, i) => {
        const f = document.createElement("figure");
        f.className = "stack__card" + (d.wide ? " is-wide" : "");
        const im = document.createElement("img");
        im.src = d.big;
        im.alt = d.alt;
        im.loading = i < 3 ? "eager" : "lazy";
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
      capEl.textContent = visible[top].cap;
      countEl.textContent = `${top + 1} van ${visible.length}`;
    }
    const fling = (card, dir) => {
      if (!reduced) {
        card.style.transform = `translate(${dir * 140}%, -4%) rotate(${dir * 24}deg)`;
        card.style.opacity = "0";
        setTimeout(() => (card.style.opacity = ""), 420);
      }
    };
    const go = (dir) => {
      if (!visible.length) return;
      if (dir > 0) fling(cards[top], 1);
      top = (top + dir + visible.length) % visible.length;
      setTimeout(position, reduced || dir < 0 ? 0 : 90);
    };
    g.querySelector("[data-stack-next]").addEventListener("click", () => go(1));
    g.querySelector("[data-stack-prev]").addEventListener("click", () => go(-1));
    deck.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Enter") openLightbox(visible, top);
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
      if (Math.abs(dx) > 6) moved = true;
      active.style.transform = `translate(${dx}px, ${(e.clientY - sy) * 0.25}px) rotate(${dx / 14}deg)`;
    });
    const release = () => {
      if (!active) return;
      const c = active;
      active = null;
      c.classList.remove("is-dragging");
      if (Math.abs(dx) > 90) {
        fling(c, Math.sign(dx));
        top = (top + 1) % visible.length;
        setTimeout(position, 90);
      } else {
        c.style.transform = "";
        if (!moved) openLightbox(visible, top);
      }
    };
    deck.addEventListener("pointerup", release);
    deck.addEventListener("pointercancel", release);

    items.forEach((li, i) =>
      li.querySelector("button").addEventListener("click", () => openLightbox(visible, visible.indexOf(data[i])))
    );

    setView(matchMedia("(min-width: 768px)").matches ? "wall" : "stack");
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

  /* ---------- footer name: the letters float up around your finger ---------- */
  document.querySelectorAll(".bigname").forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.textContent = "";
    const spans = [...text].map((ch) => {
      const s = document.createElement("span");
      s.textContent = ch === " " ? " " : ch;
      s.setAttribute("aria-hidden", "true");
      el.append(s);
      return s;
    });
    const play = (x) => {
      spans.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const d = (r.left + r.width / 2 - x) / window.innerWidth;
        const k = Math.max(0, 1 - Math.abs(d) * 6);
        s.style.setProperty("--y", -k * 0.14 + "em");
        s.style.setProperty("--rot", k * (i % 2 ? 7 : -7) + "deg");
        s.classList.toggle("is-hot", k > 0.6);
      });
    };
    const calm = () =>
      spans.forEach((s) => {
        s.style.removeProperty("--y");
        s.style.removeProperty("--rot");
        s.classList.remove("is-hot");
      });
    el.addEventListener("pointermove", (e) => play(e.clientX));
    el.addEventListener("pointerdown", (e) => play(e.clientX));
    el.addEventListener("pointerleave", calm);
    el.addEventListener("pointerup", (e) => e.pointerType !== "mouse" && setTimeout(calm, 700));
    // a wave runs through the name once when it scrolls into view
    if (!reduced && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        ([en]) => {
          if (!en.isIntersecting) return;
          io.disconnect();
          let x = 0;
          const t = setInterval(() => {
            play((x / 24) * window.innerWidth);
            if (++x > 24) {
              clearInterval(t);
              calm();
            }
          }, 50);
        },
        { threshold: 0.8 }
      );
      io.observe(el);
    }
  });

  /* ---------- journal ---------- */
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

  document.querySelectorAll("[data-copy]").forEach((b) =>
    b.addEventListener("click", async () => {
      const label = b.querySelector(".copy");
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
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

  /* ---------- art stand-ins: if a hotlinked image fails, the tile keeps its colour ---------- */
  document.querySelectorAll("img[data-art]").forEach((img) => {
    const hide = () => (img.style.visibility = "hidden");
    if (img.complete && !img.naturalWidth) hide();
    img.addEventListener("error", hide);
  });
})();
