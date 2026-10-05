/* Study-guide catalog. The site home renders one card per book.
   To add a book: append an object here and add its home page (see hyne.html / logging.html).
   Chapter URLs stay stable; do not special-case a book inside chapter HTML. */
window.STUDY_BOOKS = [
  {
    id: "hyne",
    kicker: "General / Intro",
    title: "General / Intro",
    source: "Hyne, Nontechnical Guide (3rd ed.)",
    href: "hyne.html",
    blurb: "Petroleum systems, drilling, completion, offshore, and production. The original Hyne chapter pages stay at the same URLs."
  },
  {
    id: "logging",
    kicker: "Well logs",
    title: "Well Logging in Nontechnical Language",
    source: "Study notes from the well-logging doc",
    href: "logging.html",
    blurb: "What a log is, how to read the five parts of a print, and the rock and fluid ideas behind porosity, saturation, invasion, and resistivity."
  }
];
