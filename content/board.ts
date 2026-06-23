// PUBLIC, de-identified advisory board — disciplines only, NO names.
// The real individuals each seat is modeled on are kept INTERNAL (vault:
// "Board of Advisors/") and must not appear in this repo or the deployed site.

export type Seat = {
  discipline: string;
  focus: string;
};

export const ADVISORY_SEATS: Seat[] = [
  {
    discipline: "Urban Coyote Science",
    focus:
      "What urban coyotes actually do — behavior, diet, territory, and population dynamics, grounded in long-term tracking data.",
  },
  {
    discipline: "Southern California Field Research",
    focus:
      "Region-specific research on coyote behavior, diet, and conflict across Los Angeles and Orange counties.",
  },
  {
    discipline: "Coexistence Program Design",
    focus:
      "Designing and running community coexistence programs; non-lethal strategy, education, and advocacy.",
  },
  {
    discipline: "Municipal Implementation",
    focus:
      "How cities actually stand up programs — community hazing, ordinance design, and tiered response protocols.",
  },
  {
    discipline: "Animal Ethics",
    focus:
      "The moral dimension of coexistence — the cognitive and emotional lives of coyotes, and humane practice.",
  },
  {
    discipline: "Conflict Mapping & Citizen Science",
    focus:
      "Incident-map design and data quality — guarding against reporting bias and fear amplification.",
  },
  {
    discipline: "Urban Ecology & Environmental Justice",
    focus:
      "Equity in who is heard and served, so tools don't quietly favor only affluent, well-connected neighborhoods.",
  },
  {
    discipline: "Non-Lethal Deterrence & Management Realism",
    focus:
      "What the evidence says about deterrents — and the hard cases where management decisions get tested.",
  },
  {
    discipline: "Risk Communication",
    focus:
      "Informing residents without amplifying panic — alerts, messaging, and calibrating public concern.",
  },
];
