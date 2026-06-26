// Content model for "Report a coyote" — the incident-capture tool.
//
// Designed to the CCC board's spec: severity tiers (not raw sightings), root-
// cause fields (attractants + pet/leash), and a calibrated response for EVERY
// tier (White: "tie every tier to a response, or don't collect it"). Location
// stays coarse — city + area, never an exact address (Quinn, privacy).
//
// These option `value`s are the source of truth for both the form and the
// server-side validation. Keep them in sync with the DB check constraints.

export type Option = { value: string; label: string; help?: string };

// --- Severity tiers (the `category` field) ---------------------------------
// `urgency` drives the calibrated response shown on submit and the tone of the
// admin queue. Order is routine → urgent.
export type Category = {
  value: string;
  label: string;
  help: string;
  urgency: "info" | "watch" | "concern" | "urgent";
};

export const CATEGORIES: Category[] = [
  {
    value: "sighting",
    label: "I just saw a coyote",
    help: "It was passing through, or watching from a distance.",
    urgency: "info",
  },
  {
    value: "encounter",
    label: "It came close, lingered, or approached",
    help: "It didn't keep its distance, or showed little fear of people.",
    urgency: "watch",
  },
  {
    value: "pet_chase",
    label: "It chased or threatened a pet",
    help: "It went after a pet, but the pet wasn't injured.",
    urgency: "concern",
  },
  {
    value: "pet_attack",
    label: "It injured or killed a pet",
    help: "We're sorry. This is exactly the kind of event the Council tracks.",
    urgency: "urgent",
  },
  {
    value: "person",
    label: "It acted aggressively toward a person",
    help: "Followed, growled, nipped, or wouldn't back off from someone.",
    urgency: "urgent",
  },
  {
    value: "other",
    label: "Something else",
    help: "A sick or injured coyote, a den, feeding you witnessed, etc.",
    urgency: "watch",
  },
];

export const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);

export const TIME_OF_DAY: Option[] = [
  { value: "dawn", label: "Dawn" },
  { value: "morning", label: "Morning" },
  { value: "midday", label: "Midday" },
  { value: "afternoon", label: "Afternoon" },
  { value: "dusk", label: "Dusk" },
  { value: "night", label: "Night" },
  { value: "unknown", label: "Not sure" },
];

export const BEHAVIORS: Option[] = [
  { value: "avoided", label: "Avoided me / ran off" },
  { value: "indifferent", label: "Ignored me, went about its business" },
  { value: "approached", label: "Approached or came closer" },
  { value: "followed", label: "Followed me or my pet" },
  { value: "aggressive", label: "Growled, lunged, or bit" },
  { value: "unknown", label: "Not sure" },
];

export const PETS: Option[] = [
  { value: "none", label: "No pet involved" },
  { value: "dog_leashed", label: "Dog — on a leash" },
  { value: "dog_offleash", label: "Dog — off leash" },
  { value: "dog_unattended", label: "Dog — unattended (yard / tied out)" },
  { value: "cat_outdoor", label: "Cat — outdoors" },
  { value: "other_pet", label: "Other pet / animal" },
];

// Attractants — the root-cause field. Multi-select.
export const ATTRACTANTS: Option[] = [
  { value: "trash", label: "Unsecured trash" },
  { value: "feeding", label: "Someone feeding wildlife" },
  { value: "fruit", label: "Fallen fruit" },
  { value: "pet_food", label: "Pet food left outside" },
  { value: "cat_colony", label: "Outdoor / feral cats" },
  { value: "water", label: "Open water source" },
  { value: "none", label: "None that I noticed" },
  { value: "unknown", label: "Not sure" },
];

export const ACTIONS: Option[] = [
  { value: "hazed", label: "I hazed it (yelled, waved, made noise)" },
  { value: "left", label: "I left the area" },
  { value: "nothing", label: "I didn't do anything" },
  { value: "reported_elsewhere", label: "I also reported it elsewhere" },
  { value: "other", label: "Other" },
];

// --- Calibrated response, keyed by category --------------------------------
// Shown on submit. Validates the experience, then gives the evidence-based next
// step — and, for the serious tiers, routes to the official channels (the
// Council's tool complements OC Animal Care + Coyote Cacher, it doesn't replace
// them). `emergency: true` surfaces the call-911 line prominently.
export type Response = {
  title: string;
  body: string;
  emergency?: boolean;
  links: { label: string; href: string; external?: boolean }[];
};

export const RESPONSES: Record<string, Response> = {
  sighting: {
    title: "Thanks — this helps, and it's good news.",
    body:
      "A coyote passing through is normal here in Orange County, and a sighting isn't an incident. The best thing you can do is keep them wary: secure attractants on your property and haze any coyote that lingers, so it keeps its natural distance.",
    links: [
      { label: "How to haze a coyote", href: "/faq" },
      { label: "Coyote-proof your yard", href: "/checklist" },
    ],
  },
  encounter: {
    title: "Good to know about — and worth a small response.",
    body:
      "A coyote that comes close or shows little fear is one that's losing its wariness, usually because food is nearby. Haze it firmly so it learns to keep its distance, and check your block for the attractants that draw them in. Hazing works best when the whole neighborhood does it.",
    links: [
      { label: "How to haze a coyote", href: "/faq" },
      { label: "Coyote-proof your yard", href: "/checklist" },
    ],
  },
  pet_chase: {
    title: "Thank you — and we're glad your pet is okay.",
    body:
      "A coyote going after a pet almost always traces to a fixable situation: an off-leash or unattended pet, plus a food source on the block. Keep small pets leashed and close, especially at dawn and dusk, secure attractants, and haze coyotes that come near. Your report helps us spot a hotspot before it gets worse.",
    links: [
      { label: "Pet-safety basics", href: "/faq" },
      { label: "Coyote-proof your yard", href: "/checklist" },
    ],
  },
  pet_attack: {
    title: "We're so sorry this happened.",
    body:
      "If your pet is injured, get it to a veterinarian right away. Please also report the attack to OC Animal Care and to Coyote Cacher so it's officially on record — those channels route the response, and your report to us helps the Council track where conflict is concentrating. When you're ready, it's worth checking what may have drawn the coyote in.",
    links: [
      { label: "OC Animal Care", href: "https://www.ocpetinfo.com/", external: true },
      { label: "Report to Coyote Cacher", href: "https://ucanr.edu/sites/CoyoteCacher/", external: true },
      { label: "Pet-safety basics", href: "/faq" },
    ],
  },
  person: {
    title: "Thank you for flagging this — it matters.",
    body:
      "If anyone is hurt or in immediate danger, call 911 now. A coyote that's aggressive toward people is rare and is the kind of case that warrants an official response: please report it to OC Animal Care as well. Logging it here helps the Council see the pattern and push for action.",
    emergency: true,
    links: [
      { label: "OC Animal Care", href: "https://www.ocpetinfo.com/", external: true },
      { label: "What to do if a coyote approaches you", href: "/faq" },
    ],
  },
  other: {
    title: "Thank you — this is logged.",
    body:
      "Thanks for taking the time. A sick or injured coyote, an active den, or someone feeding wildlife are all useful for the Council to know about. If you saw a coyote that looked sick or injured, OC Animal Care is the right channel to call.",
    links: [
      { label: "OC Animal Care", href: "https://www.ocpetinfo.com/", external: true },
      { label: "Coyote Q&A", href: "/faq" },
    ],
  },
};
