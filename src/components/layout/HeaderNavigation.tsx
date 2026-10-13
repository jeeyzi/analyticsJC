"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { site } from "@/content/site";
import { ActionLink, Button, TextLink } from "@/components/ui/Actions";
import styles from "./HeaderNavigation.module.css";

export function HeaderNavigation() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<EventTarget | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const reset = () => {
      setOpen(false);
      // Un cambio de breakpoint no debe dejar foco en un control oculto.
      const active = document.activeElement === document.body ? lastFocus.current : document.activeElement;
      const toggle = root.current?.querySelector<HTMLButtonElement>("button");
      if (!(active instanceof Node) || !root.current?.contains(active)) return;
      if (desktop.matches && active === toggle) {
        root.current?.querySelector<HTMLAnchorElement>("nav a")?.focus();
      } else if (!desktop.matches && active !== toggle) {
        toggle?.focus();
      }
    };
    desktop.addEventListener("change", reset);
    return () => desktop.removeEventListener("change", reset);
  }, []);

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = document.getElementById(event.currentTarget.hash.slice(1));
    const heading = destination?.matches("h1,h2,h3")
      ? destination
      : destination?.querySelector<HTMLElement>("h1,h2,h3");
    if (!heading) return;
    // Conservar href/hash/desplazamiento nativo. H-17: foco al destino al navegar.
    setOpen(false);
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }

  return (
    <div ref={root} className={styles.navigation}
      onFocusCapture={(event) => { lastFocus.current = event.target; }}
      onBlurCapture={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) lastFocus.current = null;
      }} onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
        root.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    }}>
      <Button variant="secondary" className={styles.toggle}
        aria-expanded={open} aria-controls={panelId}
        aria-label={open ? site.navigation.closeMenu : site.navigation.openMenu}
        onClick={() => setOpen((value) => !value)}>
        {site.navigation.menu}
      </Button>
      <nav id={panelId} className={styles.panel} data-open={open} aria-label={site.navigation.menu}>
        <ul className={styles.links}>
          {site.navigation.links.map((link) => (
            <li key={link.href}><TextLink className={styles.link} href={link.href} onClick={navigate}>{link.label}</TextLink></li>
          ))}
          <li><ActionLink className={styles.cta} href={site.navigation.cta.href} onClick={navigate}>
            {site.navigation.cta.label}
          </ActionLink></li>
        </ul>
      </nav>
    </div>
  );
}
