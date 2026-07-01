// Single source of truth for site navigation.
// Top-level items can carry `children` — rendered as a dropdown on desktop and
// an indented group on mobile. Keeps the bar from over-crowding.

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const NAV_ITEMS: NavItem[] = [
  {
    label: "About",
    href: "/about",
    children: [{ label: "Charter", href: "/charter" }],
  },
  {
    label: "Membership",
    href: "/membership",
    children: [
      { label: "Contribute", href: "/contribute" },
      { label: "The Pack", href: "/pack" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Report", href: "/report" },
      { label: "Habitat & Corridors", href: "/corridors" },
      { label: "Coyote Q&A", href: "/faq" },
      { label: "Wall of Understanding", href: "/understanding" },
    ],
  },
  { label: "Forum", href: "/forum" },
  { label: "Contact", href: "/contact" },
];

// The primary call-to-action, rendered as a button (kept separate from NAV_ITEMS).
export const JOIN_HREF = "/join";
