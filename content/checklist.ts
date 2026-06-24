// Coyote-proofing checklist — original CCC content. Grounded in the launch
// article's "remove the food rewards" thesis plus standard coexistence guidance
// (CDFW, Project Coyote, Humane World).

export type ChecklistGroup = {
  id: string;
  title: string;
  note?: string;
  items: string[];
};

export const CHECKLIST_INTRO =
  "The most effective way to prevent coyote conflict is to make your property boring to a coyote — no food, no water, no shelter, and no easy path to a pet. Work through this list; even a few changes make a real difference, and it works best when your whole block does it.";

export const CHECKLIST: ChecklistGroup[] = [
  {
    id: "food",
    title: "Food — the #1 attractant",
    note: "Remove the rewards and most coyotes simply move along.",
    items: [
      "Store trash in a secured, animal-proof bin with a locking or heavy lid.",
      "Put trash out the morning of pickup, not the night before.",
      "Never leave pet food or water bowls outside, especially overnight.",
      "Pick up fallen fruit, nuts, and seeds regularly.",
      "Clean up spilled birdseed, or remove feeders — they feed the rodents coyotes hunt.",
      "Secure compost; don't compost meat, dairy, or food scraps in open piles.",
      "Clean grease and scraps off outdoor grills.",
      "Never feed coyotes — and discourage feeding wildlife or unmanaged feral-cat feeding stations nearby.",
    ],
  },
  {
    id: "pets",
    title: "Pets — keep them safe",
    items: [
      "Keep cats indoors, or in a fully enclosed “catio.”",
      "Supervise small dogs outside, especially at dawn and dusk.",
      "Never leave pets unattended in the yard.",
      "Walk dogs on a short, fixed leash (about 6 ft) — not a retractable one.",
      "Pick up dog waste, which can attract coyotes.",
    ],
  },
  {
    id: "water",
    title: "Water",
    items: [
      "Remove or cover standing water — pet bowls, fountains, pooling irrigation — especially in dry months.",
    ],
  },
  {
    id: "shelter",
    title: "Shelter & denning access",
    note: "Coyotes den under structures in spring — close the gaps before pup season.",
    items: [
      "Clear brush piles, tall weeds, and dense ground-level cover.",
      "Block access under decks, sheds, porches, and crawl spaces.",
      "Keep woodpiles tidy and elevated.",
    ],
  },
  {
    id: "fencing",
    title: "Fencing & barriers",
    items: [
      "Make coyote fencing at least 6 feet tall — coyotes clear lower fences.",
      "Add a coyote roller or angled extender to the top.",
      "Add a dig barrier (buried mesh or an L-footer) at the bottom — coyotes dig as well as jump.",
      "Close gaps and keep gates latched.",
    ],
  },
  {
    id: "deterrents",
    title: "Deterrents (once attractants are handled)",
    items: [
      "Install motion-activated lights and/or sprinklers.",
      "Haze any coyote that lingers or approaches: stand tall, be loud, wave your arms — and never run.",
    ],
  },
  {
    id: "community",
    title: "Community — the real multiplier",
    items: [
      "Talk to your neighbors — coyote-proofing works best when the whole block does it.",
      "Report sightings and incidents (OC Animal Care and Coyote Cacher) so your community can respond.",
    ],
  },
];
