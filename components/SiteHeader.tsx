"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS, JOIN_HREF, type NavItem } from "@/lib/nav";
import ThemeToggle from "@/components/ThemeToggle";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { getHeaderUser } from "@/app/account/actions";

type Auth = { signedIn: boolean; firstName: string | null };

function Caret({ className = "" }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M3 4.5 6 7.5 9 4.5" />
    </svg>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reflect sign-in state in the header. Check the session cookie locally first
  // (no network for signed-out visitors), then fill in the name from the server.
  useEffect(() => {
    let ok = true;
    getSupabaseBrowser()
      .auth.getSession()
      .then(({ data }) => {
        if (!ok) return;
        if (data.session) {
          setAuth({ signedIn: true, firstName: null });
          getHeaderUser().then((r) => ok && setAuth(r));
        } else {
          setAuth({ signedIn: false, firstName: null });
        }
      });
    return () => {
      ok = false;
    };
  }, [pathname]);

  // Close menus whenever the route changes.
  useEffect(() => {
    setOpen(false);
    setUserMenu(false);
  }, [pathname]);

  // Close the user menu on any outside click.
  useEffect(() => {
    if (!userMenu) return;
    const close = () => setUserMenu(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [userMenu]);

  const solid = !isHome || scrolled || open;

  const linkBase = "text-sm font-medium transition-colors";
  const linkColor = solid
    ? "text-ink/75 hover:text-clay"
    : "text-sand/90 hover:text-white";
  const activeColor = solid ? "text-clay" : "text-white";

  const panel =
    "min-w-[190px] rounded-xl border border-line/15 bg-surface p-1.5 shadow-lg";
  const itemLink =
    "block rounded-lg px-3 py-2 text-sm font-medium text-ink/80 transition hover:bg-card hover:text-clay";

  function DesktopItem({ item }: { item: NavItem }) {
    const active = pathname === item.href;
    if (!item.children) {
      return (
        <Link
          href={item.href}
          className={`${linkBase} ${linkColor} ${active ? activeColor : ""}`}
        >
          {item.label}
        </Link>
      );
    }
    const childActive = item.children.some((c) => c.href === pathname);
    return (
      <div className="group relative">
        <Link
          href={item.href}
          className={`inline-flex items-center gap-1 ${linkBase} ${linkColor} ${
            active || childActive ? activeColor : ""
          }`}
        >
          {item.label}
          <Caret className="opacity-70 transition-transform group-hover:rotate-180" />
        </Link>
        <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <div className={panel}>
            {item.children.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className={`${itemLink} ${c.href === pathname ? "bg-card text-clay" : ""}`}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-line/10 bg-surface/95 shadow-sm backdrop-blur"
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
            className="h-10 w-10 sm:h-12 sm:w-12"
          />
          <span className="hidden flex-col leading-[1.12] sm:flex">
            {["oyote", "oexistence", "ouncil"].map((rest) => (
              <span
                key={rest}
                className="text-[13px] font-bold uppercase tracking-[0.14em] text-heading"
              >
                <span className="text-clay">C</span>
                {rest}
              </span>
            ))}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <DesktopItem key={item.label} item={item} />
          ))}

          <ThemeToggle
            className={
              solid ? "text-ink/70 hover:text-clay" : "text-sand/90 hover:text-white"
            }
          />

          {auth?.signedIn ? (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setUserMenu((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenu}
                className={`inline-flex items-center gap-1 ${linkBase} ${linkColor}`}
              >
                {auth.firstName || "Account"}
                <Caret className={`opacity-70 transition-transform ${userMenu ? "rotate-180" : ""}`} />
              </button>
              {userMenu && (
                <div className={`absolute right-0 top-full z-50 mt-3 ${panel}`}>
                  <Link href="/account" className={itemLink}>
                    Account
                  </Link>
                  <p className="px-3 pb-1.5 pt-0.5 text-xs text-ink/45">
                    Contact info and preferences
                  </p>
                  <a href="/logout" className={`${itemLink} border-t border-line/10`}>
                    Sign out
                  </a>
                </div>
              )}
            </div>
          ) : auth ? (
            <>
              <Link href="/login" className={`${linkBase} ${linkColor}`}>
                Sign in
              </Link>
              <Link
                href={JOIN_HREF}
                className="rounded-lg bg-clay px-4 py-2 text-sm font-semibold text-sand transition hover:bg-bark"
              >
                Join
              </Link>
            </>
          ) : null}
        </nav>

        {/* Mobile: theme toggle + menu button */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle className={solid ? "text-ink" : "text-sand"} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={solid ? "text-ink" : "text-sand"}
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
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-line/10 bg-card md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className={`block border-b border-line/5 py-3 text-base font-medium ${
                    pathname === item.href ? "text-clay" : "text-ink/80"
                  }`}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 border-l border-line/10 pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className={`block py-2.5 text-sm ${
                          pathname === c.href ? "text-clay" : "text-ink/65"
                        }`}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {auth?.signedIn ? (
              <>
                <Link
                  href="/account"
                  className="border-b border-line/5 py-3 text-base font-medium text-ink/80"
                >
                  {auth.firstName || "Account"}
                </Link>
                <a
                  href="/logout"
                  className="block py-3 text-base font-medium text-ink/70"
                >
                  Sign out
                </a>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="border-b border-line/5 py-3 text-base font-medium text-ink/80"
                >
                  Sign in
                </Link>
                <Link
                  href={JOIN_HREF}
                  className="mt-3 rounded-lg bg-clay px-4 py-3 text-center font-semibold text-sand"
                >
                  Join the Council
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
