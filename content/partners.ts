// Technical Partners — the operational, animal-care frontline. They contribute
// data and opinions to the Council but do NOT vote (the four tiers vote; the
// Advisory Board guides). Local, real, consent-friendly OC organizations.

export type Partner = { title: string; body: string };

export const TECH_PARTNERS: Partner[] = [
  {
    title: "Veterinarians & clinics",
    body: "They treat the injuries, so they hold the ground truth on real pet conflicts — and they're trusted local voices residents already listen to.",
  },
  {
    title: "Animal control",
    body: "OC Animal Care and city units own the official incident reports, response protocols, and ordinance enforcement — the operational arm of the Council's work.",
  },
  {
    title: "Shelters & rescues",
    body: "Lost-pet intake data, injured-wildlife handling, and deep community reach — closing the loop between what happens and what gets recorded.",
  },
];
