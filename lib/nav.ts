// Single source of truth for site navigation.
// Add a page here and it appears in the header, mobile menu, and footer.

export type NavItem = { label: string; href: string };

export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Charter", href: "/charter" },
  { label: "Membership", href: "/membership" },
  { label: "The Pack", href: "/pack" },
  { label: "Coyote Q&A", href: "/faq" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

// The primary call-to-action, rendered as a button (kept separate from NAV_ITEMS).
export const JOIN_HREF = "/join";
