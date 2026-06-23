// The CCC advisory board — nine seats, each modeled on the published work of a
// leading real-world authority. Source: Board of Advisors/BofA.md.

export type Advisor = {
  name: string;
  seat: string;
};

export const ADVISORS: Advisor[] = [
  {
    name: "Stanley Gehrt",
    seat: "Urban coyote science — 25 years, 1,400+ collared coyotes; the data anchor",
  },
  {
    name: "Niamh Quinn",
    seat: "Southern California / Orange County field expert; built Coyote Cacher",
  },
  {
    name: "Camilla Fox",
    seat: "Project Coyote; coexistence program design & advocacy; non-lethal",
  },
  {
    name: "Lynsey White",
    seat: "The practitioner — municipal programs, hazing, ordinances, response protocols",
  },
  {
    name: "Marc Bekoff",
    seat: "Cognitive ethology, compassionate conservation — the ethics & values seat",
  },
  {
    name: "Shelley Alexander",
    seat: "Coyote conflict mapping & citizen science — data quality for the incident map",
  },
  {
    name: "Christopher Schell",
    seat: "Urban ecology + environmental justice — the equity seat",
  },
  {
    name: "Stewart Breck",
    seat: "USDA non-lethal deterrence + management realism — the pragmatist",
  },
  {
    name: "Peter Sandman",
    seat: "Risk communication (“risk = hazard + outrage”) — messaging, alerts, panic",
  },
];
