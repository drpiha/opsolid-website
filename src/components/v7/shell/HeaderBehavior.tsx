"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { keyForPublicPath, type L3 } from "@/lib/v7-routes";
import { rememberLocale } from "./locale-cookie";

const OPEN_DELAY = 150;
const CLOSE_DELAY = 300;

/**
 * All header behaviour, ported from the prototype script (PLAN 3.4); renders nothing and reads only the DOM.
 * - Desktop (>= 961 px): mouse hover opens a panel after 150 ms, leaving closes after 300 ms unless pinned; the
 *   chevron toggles a pinned panel; ArrowDown on it opens and focuses the first link; focus leaving the item, an
 *   outside click or a link click closes. One panel at a time; .is-open on the li and aria-expanded are the state.
 * - Escape closes the phone menu (focus back to the toggle) or the open panel (focus back to its chevron).
 * - Phone menu: toggle, body lock, one group open at a time, inert page behind it, any link click closes.
 * - Call bar (<= 960 px): shows after the first touch, wheel or key once past 0.9 viewport heights, never over
 *   #kontakt or the footer.
 * - Active top item and aria-current follow client navigation; every route change closes panels and the menu.
 */
export function HeaderBehavior() {
  const pathname = usePathname();
  const reset = useRef<() => void>(() => {});

  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>("[data-header]");
    if (!header) return;
    const items = Array.from(header.querySelectorAll<HTMLElement>(".wk-nav-item"));
    const desk = window.matchMedia("(min-width: 961px)");
    const toggle = header.querySelector<HTMLButtonElement>("[data-menu-toggle]");
    const mnav = document.getElementById("wk-mnav");
    const groups = mnav ? Array.from(mnav.querySelectorAll("details")) : [];
    const bar = document.querySelector<HTMLElement>("[data-callbar]");
    const offs: (() => void)[] = [];
    const on = <E extends Event>(el: EventTarget, type: string, fn: (e: E) => void, opts?: AddEventListenerOptions) => {
      el.addEventListener(type, fn as EventListener, opts);
      offs.push(() => el.removeEventListener(type, fn as EventListener, opts));
    };

    // ---- desktop panels ----
    let current: HTMLElement | null = null;
    let pinned = false;
    let openT = 0;
    let closeT = 0;
    const chev = (li: HTMLElement) => li.querySelector<HTMLButtonElement>(".wk-nav-chev");
    const set = (li: HTMLElement, open: boolean) => {
      li.classList.toggle("is-open", open);
      chev(li)?.setAttribute("aria-expanded", String(open));
    };
    const clear = () => {
      clearTimeout(openT);
      clearTimeout(closeT);
    };
    const closeAll = () => {
      clear();
      items.forEach((li) => set(li, false));
      current = null;
      pinned = false;
    };
    const open = (li: HTMLElement, pin: boolean) => {
      clear();
      items.forEach((o) => o !== li && set(o, false));
      set(li, true);
      current = li;
      pinned = pin;
    };
    for (const li of items) {
      on<PointerEvent>(li, "pointerenter", (e) => {
        if (e.pointerType !== "mouse" || !desk.matches) return;
        clearTimeout(closeT);
        if (current === li) return;
        clearTimeout(openT);
        openT = window.setTimeout(() => open(li, false), OPEN_DELAY);
      });
      on<PointerEvent>(li, "pointerleave", (e) => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(openT);
        if (current !== li || pinned) return;
        closeT = window.setTimeout(() => current === li && !pinned && closeAll(), CLOSE_DELAY);
      });
      on<FocusEvent>(li, "focusout", (e) => {
        if (current === li && !li.contains(e.relatedTarget as Node | null)) closeAll();
      });
      const c = chev(li);
      if (!c) continue;
      on(c, "click", () => (current === li && pinned ? closeAll() : open(li, true)));
      on<KeyboardEvent>(c, "keydown", (e) => {
        if (e.key !== "ArrowDown") return;
        e.preventDefault();
        open(li, true);
        li.querySelector<HTMLElement>(".wk-mega a")?.focus();
      });
    }

    // ---- phone menu ----
    let lastEscape = 0;
    const behind = () => [document.getElementById("main"), document.querySelector(".wk-footer"), bar];
    const menuOpen = () => !!mnav?.classList.contains("is-open");
    const setMenu = (open: boolean) => {
      if (!mnav || !toggle) return;
      if (open) {
        groups.forEach((d) => (d.open = false));
        mnav.scrollTop = 0;
        root.classList.add("is-touched");
      }
      mnav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("is-locked", open);
      behind().forEach((el) => el?.toggleAttribute("inert", open));
    };
    groups.forEach((d) =>
      on(d, "toggle", () => {
        if (d.open) groups.forEach((o) => o !== d && (o.open = false));
      }),
    );
    if (toggle) on(toggle, "click", () => Date.now() - lastEscape > 500 && setMenu(!menuOpen()));
    if (mnav) on<MouseEvent>(mnav, "click", (e) => (e.target as Element).closest("a") && setMenu(false));

    // ---- document: Escape, outside click, link clicks ----
    on<KeyboardEvent>(document, "keydown", (e) => {
      if (e.key !== "Escape") return;
      if (menuOpen()) {
        lastEscape = Date.now();
        setMenu(false);
        toggle?.focus();
        return;
      }
      if (current) {
        const li = current;
        const inside = li.querySelector(".wk-mega")?.contains(document.activeElement);
        closeAll();
        if (inside) chev(li)?.focus();
      }
    });
    on<MouseEvent>(document, "click", (e) => {
      const el = e.target as Element;
      const remember = el.closest<HTMLElement>("a[data-remember]")?.dataset.remember;
      if (remember) rememberLocale(remember as L3);
      if (current && (!el.closest(".wk-nav-item") || el.closest(".wk-mega a"))) closeAll();
    });
    on(desk, "change", () => {
      closeAll();
      setMenu(false);
    });

    // ---- call bar ----
    const onScroll = () => {
      if (!bar) return;
      const vh = window.innerHeight;
      let hide = window.scrollY < vh * 0.9 || !root.classList.contains("is-touched");
      for (const el of [document.getElementById("kontakt"), document.querySelector(".wk-footer")]) {
        const r = el?.getBoundingClientRect();
        if (r && r.top < vh && r.bottom > 0) hide = true;
      }
      bar.classList.toggle("is-on", !hide);
    };
    const touchEvents = ["touchstart", "wheel", "keydown"];
    const touched = () => {
      root.classList.add("is-touched");
      touchEvents.forEach((t) => window.removeEventListener(t, touched));
      onScroll();
    };
    touchEvents.forEach((t) => window.addEventListener(t, touched, { passive: true }));
    offs.push(() => touchEvents.forEach((t) => window.removeEventListener(t, touched)));
    on(window, "scroll", onScroll, { passive: true });
    onScroll();

    reset.current = () => {
      closeAll();
      setMenu(false);
      onScroll();
    };
    return () => {
      reset.current = () => {};
      closeAll();
      setMenu(false);
      offs.forEach((f) => f());
    };
  }, []);

  // Active state and reset on every client navigation (the header sits in the persistent locale layout).
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-header]");
    if (!header) return;
    let map: Record<string, string> = {};
    try {
      map = JSON.parse(header.dataset.pillar || "{}");
    } catch {
      /* keep the empty map */
    }
    const here = keyForPublicPath(window.location.pathname);
    const group = here ? map[here.key] : undefined;
    document.querySelectorAll<HTMLElement>("[data-group]").forEach((el) => {
      el.toggleAttribute("data-active", el.dataset.group === group);
      if (!el.dataset.hub) return;
      if (here && el.dataset.hub === here.key && !here.sub) el.setAttribute("aria-current", "page");
      else el.removeAttribute("aria-current");
    });
    reset.current();
  }, [pathname]);

  return null;
}
