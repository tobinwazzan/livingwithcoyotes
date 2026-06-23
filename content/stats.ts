// "By the Numbers" — ANONYMIZED AGGREGATE ONLY.
//
// These figures come from the Council's own analysis of PUBLIC neighbor
// discussion on Orange County Nextdoor (search term "coyote", 50-mile radius,
// year 2026, pulled 21 Jun 2026; 95 discussions analyzed).
//
// HARD RULES (non-negotiable):
//   - NO verbatim quotes from any post.
//   - NO real resident names, pet names, or usernames.
//   - Aggregate counts, percentages, and PARAPHRASED themes ONLY.
//   - Framed as the Council's analysis of public discussion — a SIGNAL of
//     concern, not a verified incident count.
//
// Source numbers below are authoritative. Do not invent others.

export type Stat = {
  value: string;
  label: string;
  sub?: string;
};

export const STATS: Stat[] = [
  {
    value: "95",
    label: "neighbor discussions analyzed",
    sub: "Public Orange County Nextdoor threads about coyotes, 2026.",
  },
  {
    value: "468",
    label: "reactions on a single post",
    sub: "Top threads drew 468, 334, 207, 141, and 103 reactions — the demand for a coordinated response is real.",
  },
  {
    value: "1 in 3",
    label: "posts call for self-protection",
    sub: "Only about 1 in 4 lead with coexistence; the rest are neutral. That gap is exactly what the Council exists to bridge.",
  },
  {
    value: "Pet safety",
    label: "the single most-discussed concern",
    sub: "Recurring reports of cat and dog losses — some despite protective gear — dominate the conversation.",
  },
  {
    value: "Laguna Woods & Irvine",
    label: "the loudest OC hotspots",
    sub: "Followed by Orange, Lake Forest, Costa Mesa, and Mission Viejo. Laguna Woods has already hired a wildlife hazing contractor.",
  },
  {
    value: "Year-round",
    label: "Orange County has no winter lull",
    sub: "Coyotes stay active across every season here — coexistence is a year-round practice, not a seasonal scare.",
  },
];

export const STATS_SOURCE =
  "Source: the Council's analysis of 95 public Orange County Nextdoor discussions about coyotes (50-mile radius, 2026; reviewed 21 Jun 2026).";

export const STATS_CAVEAT =
  "These figures are a signal of concern, not a verified incident count. Voluntary posts over-represent who posts — typically more-online, more-affluent, English-speaking neighborhoods — so this reflects the loudest part of the conversation, not every community equally. Closing that gap is part of our equity commitment.";
