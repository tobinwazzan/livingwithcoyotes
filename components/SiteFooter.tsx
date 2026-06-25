import Link from "next/link";
import Image from "next/image";
import { NAV_ITEMS, JOIN_HREF } from "@/lib/nav";

export default function SiteFooter() {
  return (
    <footer className="bg-dusk text-sand/70">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo-ccc.png"
                alt=""
                width={48}
                height={48}
                className="h-11 w-11"
                aria-hidden="true"
              />
              <span className="font-semibold text-sand">
                Coyote Coexistence Council
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed">
              Working together to keep our neighborhoods safe and our coyotes
              wild — bringing residents, cities, and wildlife experts to one
              table.
            </p>
          </div>

          <nav className="flex flex-col gap-2.5 sm:items-end">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-sand/80 transition-colors hover:text-sand"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/faq"
              className="text-sm text-sand/80 transition-colors hover:text-sand"
            >
              FAQ
            </Link>
            <Link
              href="/checklist"
              className="text-sm text-sand/80 transition-colors hover:text-sand"
            >
              Yard checklist
            </Link>
            <Link
              href="/supporters"
              className="text-sm text-sand/80 transition-colors hover:text-sand"
            >
              Supporters
            </Link>
            <Link
              href={JOIN_HREF}
              className="text-sm font-semibold text-clay transition-colors hover:text-sand"
            >
              Join the Council →
            </Link>
          </nav>
        </div>

        <div className="mt-10 border-t border-sand/15 pt-6 text-center text-xs text-sand/50">
          © {new Date().getFullYear()} Coyote Coexistence Council ·{" "}
          <Link href="/privacy" className="transition-colors hover:text-sand">
            Privacy
          </Link>{" "}
          · livingwithcoyotes.org
        </div>
      </div>
    </footer>
  );
}
