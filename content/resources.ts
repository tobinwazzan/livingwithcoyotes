// Source: writing/learn-and-watch.md — every link verified working June 2026.
// Edit here to update the Resources page; the page renders this data directly.

export type Resource = {
  title: string;
  url: string;
  source: string;
  length?: string;
  blurb: string;
};

export type ResourceGroup = {
  id: string;
  icon: string;
  heading: string;
  note?: string;
  items: Resource[];
};

export const RESOURCE_INTRO =
  "You don't have to become an expert — you just have to understand a few true things about the coyotes you already live near. Most of this is video, most of it is short, and all of it comes from credible sources: wildlife agencies, science institutions, and leading coexistence groups. Start at the top. If you only have ten minutes, watch the first two.";

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    id: "watch-first",
    icon: "▶",
    heading: "Watch first — short & practical",
    note: "Most under ~10 minutes.",
    items: [
      {
        title: "How to Haze a Coyote",
        url: "https://www.youtube.com/watch?v=rlxMPpFQClM",
        source: "LA Animal Services",
        length: "~4 min",
        blurb:
          "The single most useful skill, from a Southern California city agency: what to actually do when a coyote won't move along.",
      },
      {
        title: "Living With Coyotes: Hazing",
        url: "https://www.youtube.com/watch?v=V0CS4_-sQDE",
        source: "Town of Oakville",
        length: "~4 min",
        blurb:
          "A clean, on-the-street demonstration that's become a model for cities across North America.",
      },
      {
        title: "How to Haze Coyotes",
        url: "https://www.youtube.com/watch?v=PnSo45n3mHM",
        source: "Florida Fish & Wildlife",
        length: "~4 min",
        blurb:
          "A second take on the same techniques — repetition helps it stick.",
      },
      {
        title: "Coexisting With Urban Coyotes",
        url: "https://www.youtube.com/watch?v=2v4WK65w8pg",
        source: "Michigan DNR",
        length: "~5 min",
        blurb:
          "The “what's pulling them into my yard” video: food, garbage, pets, and how to make your property boring to a coyote.",
      },
      {
        title: "Pet Safety — Coyote Awareness, Ep. 2",
        url: "https://www.youtube.com/watch?v=ug4Pv3rUVis",
        source: "City of Foster City (with a CDFW biologist)",
        length: "~6 min",
        blurb:
          "Specifically about protecting small dogs and cats — the fear most residents actually have.",
      },
      {
        title: "Coyote Safety",
        url: "https://www.youtube.com/watch?v=NHib3MqQkj8",
        source: "California Academy of Sciences",
        length: "~6 min",
        blurb:
          "How to read coyote behavior — why “bold” is usually normal, and when it isn't.",
      },
      {
        title: "Coyotes: Safety & Coexistence in California",
        url: "https://www.youtube.com/watch?v=OdOewqXCS-I",
        source: "California Dept. of Fish & Wildlife",
        length: "~12 min",
        blurb:
          "The authoritative California explainer: biology, why they thrive here, food-conditioning vs. normal boldness, and what to do. If you watch one longer one, watch this.",
      },
    ],
  },
  {
    id: "go-deeper",
    icon: "▶",
    heading: "Go deeper — documentaries, talks & news",
    items: [
      {
        title: "Coyote Crossing",
        url: "https://www.youtube.com/watch?v=B8amc6NgRpE",
        source: "Lodger Films for PBS SoCal",
        length: "~60 min",
        blurb:
          "A full Southern California documentary blending science, Indigenous knowledge, and resident stories. The most local deep-dive here.",
      },
      {
        title: "Coyotes Among Us — a talk by Dr. Stanley Gehrt",
        url: "https://www.youtube.com/watch?v=UZqYFrRpqzA",
        source: "San Francisco Public Library",
        length: "~70 min",
        blurb:
          "The scientist who has GPS-collared 1,400+ urban coyotes over 25 years, explaining what the data actually show.",
      },
      {
        title: "Urban Coyotes: Keep Pets Safe, Coyotes Wild & Rodents Nervous",
        url: "https://www.youtube.com/watch?v=XPWxc0ZSZCs",
        source: "Project Coyote",
        length: "~50 min",
        blurb:
          "A complete community-education talk — ideal to screen at an HOA or neighborhood meeting.",
      },
      {
        title: "Researching How to Live With Coyotes",
        url: "https://www.youtube.com/watch?v=pUEm7q-ZSrU",
        source: "National Geographic (Short Film Showcase)",
        blurb:
          "A short, beautifully made film on how human-altered landscapes set the stage for conflict.",
      },
      {
        title: "Urban Coyotes (Georgia Outdoors)",
        url: "https://www.pbs.org/video/urban-coyotes-fkbfrb/",
        source: "Georgia Public Broadcasting / PBS",
        length: "~26 min",
        blurb:
          "Follows a research project tracking individual city coyotes. Free, no login.",
      },
      {
        title: "A Coyote Comeback (Urban Nature)",
        url: "https://www.pbs.org/video/wttw-presents-urban-nature-coyote-comeback/",
        source: "WTTW Chicago / PBS",
        length: "~8 min",
        blurb:
          "A tight, well-produced explainer with Stan Gehrt. Free, no login.",
      },
      {
        title: "How Coyotes Are Adapting to Urban Life",
        url: "https://www.pbs.org/video/urban-coyotes-1756583266/",
        source: "PBS News Hour",
        length: "~6 min",
        blurb:
          "A 2025 segment featuring urban ecologist Christopher Schell. Free, no login.",
      },
    ],
  },
  {
    id: "listen",
    icon: "♪",
    heading: "Listen — podcasts for the commute",
    items: [
      {
        title: "The Unstoppable Wily Coyote",
        url: "https://www.nationalgeographic.com/podcasts/overheard/article/episode-2-backyard-coyotes",
        source: "Overheard at National Geographic",
        length: "~24 min",
        blurb: "Why coyotes are everywhere, told as a story.",
      },
      {
        title: "Coexisting With Urban Coyotes Is Easier Than You Think",
        url: "https://news.mongabay.com/podcast/2026/04/coexisting-with-americas-growing-urban-coyote-population-is-easier-than-you-think/",
        source: "Mongabay Newscast",
        blurb:
          "An interview with Camilla Fox of Project Coyote (full transcript on the page if you'd rather read it).",
      },
    ],
  },
  {
    id: "tools",
    icon: "✦",
    heading: "Tools & organizations — bookmark these",
    items: [
      {
        title: "Project Coyote",
        url: "https://projectcoyote.org",
        source: "projectcoyote.org",
        blurb:
          "The leading coexistence organization — guides, signage, and webinars in their Coexist and Learn hubs.",
      },
      {
        title: "Urban Coyote Research Project",
        url: "https://urbancoyoteresearch.com",
        source: "urbancoyoteresearch.com",
        blurb:
          "Dr. Stanley Gehrt's 25-year Chicago study — the empirical backbone for almost everything here.",
      },
      {
        title: "Coyote Cacher",
        url: "https://ucanr.edu/site/coyote-cacher",
        source: "UC ANR",
        blurb:
          "California-wide coyote incident-reporting tool with a live map and zip-code alerts, built by Dr. Niamh Quinn — the model for the Council's own reporting tool.",
      },
      {
        title: "What to Do About Coyotes",
        url: "https://www.humaneworld.org/en/resources/what-do-about-coyotes",
        source: "Humane World for Animals",
        blurb:
          "A thorough coexistence guide with printable PDFs (hazing, conflict plans, pet protection).",
      },
      {
        title: "CDFW — Coyotes",
        url: "https://www.wildlife.ca.gov/HWC/Coyotes",
        source: "CA Dept. of Fish & Wildlife",
        blurb: "The official California guidance for policy and legal questions.",
      },
    ],
  },
  {
    id: "local",
    icon: "◉",
    heading: "Local — Orange County",
    items: [
      {
        title: "OC Animal Care — Coyote Encounters",
        url: "https://www.ocpetinfo.com/education-resources/coyote-encounters",
        source: "OC Animal Care",
        blurb:
          "The county-wide reporting hub and the emergency numbers residents actually need. Start here for a live incident.",
      },
      {
        title: "Huntington Beach — Coyote Information",
        url: "https://www.huntingtonbeachca.gov/services/coyote_information.php",
        source: "City of Huntington Beach",
        blurb:
          "One of OC's most complete city programs (reporting map, monthly reports, management plan) — a strong model.",
      },
      {
        title: "Anaheim — Coyotes",
        url: "https://www.anaheim.net/4653/Coyotes",
        source: "City of Anaheim",
        blurb:
          "A representative OC city page with hazing guidance, fence standards, and online reporting.",
      },
    ],
  },
  {
    id: "read",
    icon: "❧",
    heading: "For the readers — books & printable guides",
    items: [
      {
        title: "Coyote America: A Natural and Supernatural History",
        url: "https://www.hachettebookgroup.com/titles/dan-flores/coyote-america/9780465098538/?lens=basic-books",
        source: "Dan Flores (2016)",
        blurb:
          "The definitive popular book — reads like a story; explains how a century of extermination made coyotes more common.",
      },
      {
        title: "Coyotes Among Us: Secrets of the City's Top Predator",
        url: "https://urbancoyoteresearch.com/coyotes-among-us",
        source: "Stanley D. Gehrt & Kerry Luft",
        blurb:
          "The Chicago study distilled for a general reader — the most empirically grounded book here.",
      },
      {
        title: "Coyote at the Kitchen Door: Living With Wildlife in Suburbia",
        url: "https://openlibrary.org/search?q=coyote+at+the+kitchen+door+DeStefano",
        source: "Stephen DeStefano (2010, Harvard Univ. Press)",
        blurb:
          "Calmer and more ecological than the advocacy titles — context before tips.",
      },
      {
        title: "Coyote Hazing Field Guide: What–When–How (PDF)",
        url: "https://projectcoyote.org/wp-content/uploads/2015/10/Hazing_Field_Guide_2015.pdf",
        source: "Project Coyote",
        blurb: "Two pages; print it and keep it.",
      },
      {
        title: "Coexisting With Coyotes — brochure (PDF)",
        url: "https://projectcoyote.org/wp-content/uploads/2015/10/Coexisting_Brochure_oct2015.pdf",
        source: "Project Coyote",
        blurb: "The best single handout for a newcomer.",
      },
    ],
  },
];
