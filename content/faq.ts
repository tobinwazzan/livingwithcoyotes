// Plain-language coyote FAQ — written to be both resident-facing content and
// the source of FAQPage structured data (answers must read well as plain text).

export type FaqItem = { q: string; a: string };

export const FAQ_INTRO =
  "Plain answers to the questions Orange County residents actually ask about coyotes — what's normal, what isn't, and what to do. If you remember one thing: a sighting isn't an incident, and the fix usually starts in your own yard.";

// "What neighbors are asking right now" — the living layer of the page. We read
// the local conversation (Nextdoor, neighborhood threads, meetings) and answer
// the questions that keep recurring, in an "even-though" frame: validate the
// real fear first, then meet it with the evidence. Bump NEIGHBORS_UPDATED
// whenever this list changes so the page reads as current, not stale.
export const NEIGHBORS_UPDATED = "June 2026";

export const NEIGHBORS_INTRO =
  "We read the local conversation — Nextdoor, neighborhood threads, what comes up at meetings — and answer the questions that keep recurring. The fear behind these is real; our job is to meet it honestly, not wave it away.";

export const NEIGHBORS_ASKING: FaqItem[] = [
  {
    q: "“A coyote took a dog on our street — are they getting bolder?”",
    a: "Losing a pet this way is genuinely awful, and we won't pretend otherwise. But a single attack — even a few in one season — isn't proof that coyotes as a whole are escalating. What usually concentrates conflict on one block is a local food source (an unsecured trash run, someone feeding, fallen fruit, an unmanaged cat colony) plus off-leash or unsupervised pets at dawn and dusk. The honest read is almost always 'a specific, fixable situation here,' not 'the coyotes have changed.' Secure the attractants on your street, keep small pets leashed and close, and haze any coyote that lingers.",
  },
  {
    q: "“Why don't we just trap and remove them?”",
    a: "It's the most common ask, and it feels decisive — which is exactly why it's worth being straight about. Coyotes removed from good habitat are typically replaced within weeks, often by animals that breed faster to fill the gap, so the relief is temporary and the problem returns. Cities that lean on removal don't stay coyote-free; they stay on a treadmill. That's why wildlife agencies and researchers lead with attractant control, hazing, and pet safety — they actually lower conflict — while keeping a transparent, last-resort path for a genuinely dangerous, food-conditioned individual. Removal as a strategy fails; removal as a rare exception has its place.",
  },
  {
    q: "“They're out in the daytime now — isn't that a sign something's wrong?”",
    a: "Not by itself. Daytime activity rises in late spring and early summer when adults are feeding pups, and urban coyotes shift their hours to match quiet streets — a coyote trotting through at 9am is usually just a coyote with somewhere to be. What does warrant attention is a coyote that approaches people, follows without leaving when hazed, or shows no wariness at all. That's a behavior worth reporting, not a time of day.",
  },
  {
    q: "“Is it safe to let my cat out, or walk my small dog at dusk?”",
    a: "Here's the part we won't soften: free-roaming cats and unattended small dogs are the pets most at risk, and cats are among the most common mammals found in local coyote-diet studies. That isn't said to frighten you — it's the single clearest lever you have. Keep cats indoors or in a 'catio,' walk small dogs on a short (non-retractable) leash, avoid the dawn and dusk window in known-active areas, and don't leave pets unattended in an unfenced yard. Do that and you've removed most of the real risk.",
  },
];

export const FAQS: FaqItem[] = [
  {
    q: "Is a coyote in my yard dangerous?",
    a: "Usually not. A coyote passing through — even pausing to look at you before trotting off — is a healthy animal doing what it normally does; a sighting is not an incident. Real risk comes from a small number of coyotes that have learned to associate people with food and lost their wariness. Keep pets supervised, never feed or approach a coyote, and haze any coyote that lingers or comes close.",
  },
  {
    q: "I keep seeing coyotes in my neighborhood — should I be worried?",
    a: "Seeing coyotes is normal in Orange County. They live in the open-space corridors stitched between our neighborhoods and are active year-round. Frequent sightings mean coyotes are present, not that an attack is imminent. The useful response is prevention: remove food attractants from your property, supervise pets, and haze coyotes that don't keep their distance so they stay wary of people.",
  },
  {
    q: "How do I haze a coyote (scare it away)?",
    a: "Make yourself big, loud, and unwelcome: stand tall, wave your arms, shout firmly, and make noise — clap, shake a can of coins, use a whistle or an air horn. Keep eye contact and never run, which can trigger a chase. Keep it up until the coyote leaves. Hazing works best when a whole neighborhood does it consistently, before a coyote has been rewarded for approaching people. It changes behavior without harming the animal.",
  },
  {
    q: "A coyote attacked my pet — what should I do?",
    a: "First, get your pet to a veterinarian right away if it's injured. Then report the incident to OC Animal Care and to Coyote Cacher so it's on record and routed to the right response — a genuine pet attack is exactly the kind of event your community needs to know about. Afterward, look at what may have drawn the coyote in (food, an unsecured area, an unsupervised pet) and tighten it up. Losing or risking a pet is genuinely painful, and your report helps protect the next animal.",
  },
  {
    q: "Are coyotes a danger to children?",
    a: "Coyote attacks on people are very rare, and on children rarer still — you are far more likely to be bitten by a domestic dog. Still, never let children approach or feed wildlife, supervise kids in areas with known coyote activity, and teach them to 'be big and loud' rather than run if a coyote comes close. The same rule that protects pets protects kids: keep coyotes wary, and never let them associate people with food.",
  },
  {
    q: "What attracts coyotes to my yard?",
    a: "Food and water, almost always. The big draws are unsecured trash, fallen fruit, pet food left outside, bird-seed spillage (which feeds the rodents coyotes hunt), unmanaged feral-cat colonies, accessible water, and brushy hiding spots. The single most effective thing you can do is remove these rewards — it makes your property boring to a coyote, and it works far better than any gadget.",
  },
  {
    q: "Why does it seem like there are more coyotes lately?",
    a: "Coyotes are highly adaptable and thrive alongside us because our neighborhoods offer food, water, and few threats. A century of trying to exterminate them actually spread them farther and made them more numerous, because removal triggers faster breeding and new animals moving in. So it's less that coyotes suddenly arrived and more that the landscape we've built suits them — which is also why the fix is about managing our own habits, not the coyotes.",
  },
  {
    q: "Can't the city just remove or kill the coyotes?",
    a: "Removal feels decisive but rarely works for long. A coyote removed from good habitat is typically replaced within weeks — often by animals that breed faster to fill the gap — so the problem returns. That's why wildlife agencies and researchers generally reach for non-lethal tools first: securing attractants, hazing, and pet safety actually reduce conflict, while indiscriminate removal mostly resets the clock. A credible plan keeps a transparent, last-resort option for a genuinely dangerous, food-conditioned individual — but that's the exception, not the strategy.",
  },
  {
    q: "A coyote followed or approached me — what do I do?",
    a: "Don't run. Stop, face the coyote, make yourself big and loud, and back away slowly while continuing to haze it. A coyote that follows you — especially in spring — may be escorting you away from a den; keep hazing and moving, and the behavior usually stops once you've left the area. Report bold or following behavior so your community can respond.",
  },
  {
    q: "Is it legal to harm a coyote in California?",
    a: "This isn't legal advice, and rules vary by city — check the California Department of Fish and Wildlife (wildlife.ca.gov) and your municipality. In general, discharging a firearm is prohibited in most cities, poisons are illegal, and methods are regulated. Beyond the law, individual lethal action usually doesn't solve the problem. The reliable, legal, and effective path is attractant management and hazing.",
  },
  {
    q: "When are coyotes most active or most bold?",
    a: "Coyotes are most visible around dawn and dusk, though urban coyotes adjust to human schedules. In Orange County they are active year-round — there is no winter lull. Behavior concentrates during late-spring pup-rearing, when adults are more protective near dens and you may see more daytime activity. None of this means danger by default; it means it's a good time to be consistent about hazing and pet supervision.",
  },
  {
    q: "Where do I report a coyote sighting or incident in Orange County?",
    a: "For a live emergency, call your local animal control or 911. To log a sighting or incident, use OC Animal Care (ocpetinfo.com) and Coyote Cacher (ucanr.edu/site/coyote-cacher), UC's California-wide reporting tool with a live map. Reporting matters: standardized data is how communities tell a calm area from a hot one and direct help where it's actually needed.",
  },
  {
    q: "What is the Coyote Coexistence Council, and how do I join?",
    a: "The Coyote Coexistence Council is a facilitated forum bringing Orange County residents, municipal officials, and wildlife experts together to build and implement evidence-based coexistence plans. Residents can join at livingwithcoyotes.org/join; municipal representatives and experts are appointed or nominated by their cities. Membership gives you a say in your city's plan, plain-language guidance, and updates as the Council takes shape.",
  },
];
