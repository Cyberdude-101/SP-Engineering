/* ============================================================
   CLUB DATA — this is the only file you need to edit for
   routine updates. Everything else on the site reads from here.
   ============================================================ */

const CLUB = {

  /* ---------- MEETING SCHEDULE ----------
     Set the first meeting of the year once, and the site works
     out every meeting after it. You do not need to come back
     and change this every two weeks. */

  firstMeeting: "2026-08-26",   // YYYY-MM-DD. First meeting of the school year.
  everyNWeeks:  2,              // Meet every other week.
  startTime:    "3:30",
  endTime:      "4:30 PM",
  room:         "Mrs. Best's room (#105)",
  lastMeeting:  "2027-05-26",   // Stop showing dates after the year ends.

  /* Dates we are NOT meeting even though the pattern says we would
     (holidays, exam weeks, snow days). The site skips straight to the
     next one. Add lines in this format:

         skipDates: [
           "2026-12-23",   // winter break
           "2027-03-31"    // testing week
         ],

     Check the date against the schedule on the meetings page first —
     a date that isn't a meeting day anyway will do nothing. */
  skipDates: [],

  /* What we are building at the moment. Shows on the home page
     and the meetings page. Set to "" if you would rather not say. */
  currentUnit: "",


  /* ---------- PROJECTS ----------
     TO ADD A PROJECT: copy one { ... } block, change the fields,
     put it at the TOP of the list. That is the whole job.

     photos:  filenames from the img/ folder. Use [] for none yet.
     diagram: "truss" | "airfoil" | "printer" | "circuit" | ""
     term:    free text, shown as a label on the card.
     current: true puts it in "What we're working on" instead of
              the archive. Only mark one project current. */

  projects: [

    {
      title:   "Wooden Airplanes",
      term:    "Last year",
      current: false,
      diagram: "airfoil",
      blurb:   "We learned what actually keeps a plane in the air — lift, drag, " +
               "centre of gravity — and then built gliders out of balsa and tape " +
               "to find out whose theory survived contact with the hallway.",
      photos:  []
      // No photos in img/ for this one yet. Drop files into img/ and
      // list them here, e.g. photos: ["airplanes-hallway.jpeg"]
    },

    {
      title:   "Popsicle Stick Bridges",
      term:    "Last year",
      current: false,
      diagram: "truss",
      blurb:   "Teams designed and built bridges from popsicle sticks, glue and " +
               "tape, then loaded them until they broke. Trusses held. Most of " +
               "the things that were not trusses did not.",
      photos:  [
        { file: "IMG_0822.jpeg", alt: "Two finished bridges side by side — a covered truss design and a string suspension design" },
        { file: "IMG_0769.jpeg", alt: "A club member holding up their completed truss bridge" }
      ]
    }

  ],


  /* ---------- PEOPLE ---------- */
  leadership: [
    { role: "Teacher Sponsor", name: "Mrs. Best",    email: "cebest@gaston.k12.nc.us" },
    { role: "Founder",         name: "Shin Roh",     email: "shin.roh918@gaston.k12.nc.us" },
    { role: "Founder",         name: "Caleb McLain", email: "caleb.mclain119@gaston.k12.nc.us" }
  ]

};
