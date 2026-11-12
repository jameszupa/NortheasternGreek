/**
 * NORTHEASTERN GREEK — EDITABLE CONTENT
 * ------------------------------------
 * This file is the single source of truth for chapter listings and sample events.
 * Do not add unverified websites, descriptions, recognition claims, or events.
 * Real event listings should replace DEMO_EVENTS only after permission/verification.
 */

const SITE_CONFIG = {
  siteName: "Northeastern Greek",
  // Set this to a real, monitored address when you are ready to accept requests.
  contactEmail: null,
  chapterDirectorySource: "https://csi.studentlife.northeastern.edu/fsl-join-us/",
};

const COUNCILS = [
  { id: "IFC", name: "Interfraternity Council", kicker: "INTERFRATERNITY" },
  { id: "Panhellenic", name: "Panhellenic Council", kicker: "PANHELLENIC" },
  { id: "MGC", name: "Multicultural Greek Council", kicker: "MULTICULTURAL" },
  { id: "NPHC", name: "National Pan-Hellenic Council", kicker: "NPHC" },
];

const CHAPTERS = [
  {
    id: "sigma-chi", name: "Sigma Chi", type: "Fraternity", council: "IFC",
    greekLetters: null, description: null, website: "https://northeasternsigs.com/",
    instagram: null, logo: null,
  },
  {
    id: "beta-theta-pi", name: "Beta Theta Pi", type: "Fraternity", council: "IFC",
    greekLetters: null, description: null, website: null, instagram: null, logo: null,
  },
  {
    id: "beta-chi-theta", name: "Beta Chi Theta", type: "Fraternity", council: "MGC",
    greekLetters: null, description: null, website: null, instagram: null, logo: null,
  },
  {
    id: "sigma-beta-rho", name: "Sigma Beta Rho", type: "Fraternity", council: "MGC",
    greekLetters: null, description: null, website: null, instagram: null, logo: null,
  },
  {
    id: "alpha-chi-omega", name: "Alpha Chi Omega", type: "Sorority", council: "Panhellenic",
    greekLetters: null, description: null, website: null, instagram: null, logo: null,
  },
  {
    id: "delta-gamma", name: "Delta Gamma", type: "Sorority", council: "Panhellenic",
    greekLetters: null, description: null, website: null, instagram: null, logo: null,
  },
  {
    id: "kappa-phi-lambda", name: "Kappa Phi Lambda", type: "Sorority", council: "MGC",
    greekLetters: null, description: null, website: null, instagram: null, logo: null,
  },
  {
    id: "alpha-kappa-alpha", name: "Alpha Kappa Alpha", type: "Sorority", council: "NPHC",
    greekLetters: null, description: null, website: null, instagram: null, logo: null,
  },
];

/**
 * Fictional, illustrative events. None are real scheduled activities.
 * Every event is attributed to "Demo Chapter", never to a real organization.
 */
const DEMO_EVENTS = [
  {
    id: "demo-recruitment", title: "Recruitment Info Night", date: "2026-11-10",
    time: "6:00 PM – 7:30 PM", category: "Recruitment", host: "Demo Chapter",
    location: "Example campus location", description: "An example information session where prospective members could learn about joining a chapter.",
  },
  {
    id: "demo-service", title: "Community Service Day", date: "2026-11-15",
    time: "10:00 AM – 1:00 PM", category: "Community", host: "Demo Chapter",
    location: "Example campus location", description: "A sample service event illustrating how community activities could appear on this calendar.",
  },
  {
    id: "demo-study", title: "Study Hall & Tutoring", date: "2026-11-18",
    time: "4:00 PM – 6:00 PM", category: "Academic", host: "Demo Chapter",
    location: "Example campus location", description: "A fictional peer study session for demonstration purposes.",
  },
  {
    id: "demo-social", title: "Fall Social Mixer", date: "2026-11-21",
    time: "7:00 PM – 9:00 PM", category: "Social", host: "Demo Chapter",
    location: "Example campus location", description: "An example social gathering shown to demonstrate event discovery.",
  },
  {
    id: "demo-fundraiser", title: "Philanthropy Fundraiser", date: "2026-11-22",
    time: "11:00 AM – 3:00 PM", category: "Philanthropy", host: "Demo Chapter",
    location: "Example campus location", description: "A fictional fundraiser showing how a chapter could share a philanthropic event.",
  },
  {
    id: "demo-dec-social", title: "Winter Community Mixer", date: "2026-12-08",
    time: "5:30 PM – 7:00 PM", category: "Social", host: "Demo Chapter",
    location: "Example campus location", description: "An illustrative event to demonstrate browsing between months.",
  },
  {
    id: "demo-dec-service", title: "Holiday Service Project", date: "2026-12-12",
    time: "12:00 PM – 2:00 PM", category: "Community", host: "Demo Chapter",
    location: "Example campus location", description: "A sample service activity; not an actual scheduled event.",
  },
  {
    id: "demo-jan-info", title: "Spring Welcome Session", date: "2027-01-19",
    time: "6:00 PM – 7:00 PM", category: "Recruitment", host: "Demo Chapter",
    location: "Example campus location", description: "An illustrative information session for the prototype calendar.",
  },
];
