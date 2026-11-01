export const brand = {
  name: "VergeCare (Beta)",
  shortName: "VergeCare",
  engine: "your caretaker",
  tagline: "Property care, remembered.",
  description:
    "Your AI Property Caretaker. Spots issues, creates snag lists, finds handymen and keeps costs under control.",
} as const;

export const howItWorks = [
  {
    title: "Check in",
    body: "Do a video clip for each issue. Narrate as you film",
  },
  {
    title: "Get your Issues snag list",
    body: "Your caretaker lists every issue and its trade.",
  },
  {
    title: "Track it all",
    body: "Your property's issues and bills tracker, until every fix is done.",
  },
] as const;

export const colors = {
  ink: "#071617",
  teal: "#134e4a",
  signal: "#d4f34a",
  mist: "#eef4f2",
  cloud: "#f7faf9",
} as const;
