/* ============================================================
   CLUB DATA. The only file you need to edit for
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
  endTime:      "4:15 PM",
  room:         "Mrs. Best's room (#105)",
  lastMeeting:  "2027-05-26",   // Stop showing dates after the year ends.

  /* ---- CHANGING A SINGLE MEETING ----
     Three different things can happen. Pick the right one.

     1. CANCELLED. No meeting that week, next one is as normal.

            skipDates: [
              "2026-12-23"    // winter break
            ],

     2. MOVED. Same week, different day. Left side is the date it
        WOULD have been, right side is where it went. Do NOT also put
        it in skipDates; this replaces it.

            reschedule: {
              "2026-09-09": "2026-09-10"    // assembly, moved to Thursday
            },

     3. EXTRA. A one-off meeting that isn't part of the pattern
        (build day before a competition, catch-up session).

            extraDates: [
              "2026-10-14"
            ],

     Check the date against the schedule on the meetings page first.
     A date that was never a meeting day will do nothing.

     If the whole schedule shifts permanently (you end up meeting on
     the opposite Wednesdays from now on), don't use these. Change
     firstMeeting to the new date instead, and everything re-derives. */
  skipDates:  [],
  reschedule: {},
  extraDates: [],

  /* What we are building at the moment. Shows on the home page
     and the meetings page. Set to "" if you would rather not say. */
  currentUnit: "",

  /* The line that types itself out under the club name on the home page.
     Home page only. It's a slogan, and it wears thin if it's everywhere.
     Set to "" to turn the effect off. */
  tagline: "Design. Build. Test to failure.",


  /* ---------- PROJECTS ----------
     TO ADD A PROJECT: copy one { ... } block, change the fields,
     put it at the TOP of the list. That is the whole job.

     photos:  filenames from the img/ folder. Use [] for none yet.
              Two show per row. If you list an odd number, the LAST one
              runs full width as the feature, so put the best one last.
     diagram: name of an animated drawing, or "" for none.
              The full list is in the README.
     term:    free text, shown as a label on the card.
     current: true puts it in "What we're working on" instead of
              the archive. Only mark one project current. */

  projects: [

    {
      title:   "Wooden Airplanes",
      term:    "Last year",
      current: false,
      diagram: "airfoil",
      blurb:   "We covered what keeps a plane in the air: lift, drag and center of " +
               "gravity. Then we built gliders out of foam plates, wood, glue and " +
               "duct tape, and flew them down the hallway.",
      photos:  [
        { file: "airplanes-hallway.jpg", alt: "Two club members in the school hallway holding the gliders they built from folded card and tape, with a third design in the foreground" }
      ]
    },

    {
      title:   "Popsicle Stick Bridges",
      term:    "Last year",
      current: false,
      diagram: "truss",
      blurb:   "Teams designed and built bridges out of popsicle sticks, glue and " +
               "tape, then added weight until they failed.",
      photos:  [
        { file: "IMG_0769.jpeg", alt: "A club member holding up their completed truss bridge" },
        { file: "bridge-build-classroom.jpg", alt: "Club members working on a popsicle-stick bridge across two desks during a build session" },
        { file: "IMG_0822.jpeg", alt: "Two finished bridges side by side, a covered truss design and a string suspension design" }
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
