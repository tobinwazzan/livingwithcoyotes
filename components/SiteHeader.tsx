"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS, JOIN_HREF } from "@/lib/nav";

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Solid (light) chrome everywhere except the very top of the home hero.
  const solid = !isHome || scrolled || open;

  const linkBase = "text-sm font-medium transition-colors";
  const linkColor = solid
    ? "text-bark/75 hover:text-clay"
    : "text-sand/90 hover:text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-bark/10 bg-sand/95 shadow-sm backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6">
        {/* Brand — hidden at the top of the home hero (the hero shows the medallion) */}
        <Link
          href="/"
          aria-label="Coyote Coexistence Council — home"
          className={`flex items-center gap-2.5 transition-opacity duration-300 ${
            solid ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src="/logo-ccc.png"
            alt=""
            width={48}
            height={48}
            className="h-9 w-9 sm:h-11 sm:w-11"
          />
          <span className="hidden text-base font-bold leading-tight text-moss sm:block">
            Coyote Coexistence Council
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${linkBase} ${linkColor} ${
                  active ? (solid ? "text-clay" : "text-white") : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={JOIN_HREF}
            className="rounded-lg bg-clay px-4 py-2 text-sm font-semibold text-sand transition hover:bg-bark"
          >
            Join
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={`md:hidden ${solid ? "text-bark" : "text-sand"}`}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-bark/10 bg-sand md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b border-bark/5 py-3 text-base font-medium ${
                  pathname === item.href ? "text-clay" : "text-bark/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={JOIN_HREF}
              className="mt-3 rounded-lg bg-clay px-4 py-3 text-center font-semibold text-sand"
            >
              Join the Council
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
