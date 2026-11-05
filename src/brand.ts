export const brand = {
  name: "VergeCare(Beta)",
  shortName: "VergeCare",
  engine: "your caretaker",
  tagline: "Property care, remembered.",
  description:
    "Your AI Property Caretaker. Spots repair issues, creates snag and wish lists, finds handymen and keeps costs under control.",
} as const;

export const howItWorks = [
  {
    title: "Check in your property",
    body: "Do a video clip showing and narrating a repair issue eg (weeded garden, moulds on the wall, damped wall, electrical issue, burnt carpet, broken window) or wish-to-have (a couch, a work desk, an electrical appliance, a chandelier)",
  },
  {
    title: "Get your repair and wish list",
    body: "Your caretaker gives you a repair or a wishlist tracker board with costed budget, finds matched handymen and stores.",
  },
  {
    title: "Track it all",
    body: "Your property's repair issues or wishlist until everything is fixed or done.",
  },
] as const;

export const colors = {
  ink: "#071617",
  teal: "#134e4a",
  signal: "#d4f34a",
  mist: "#eef4f2",
  cloud: "#f7faf9",
} as const;
