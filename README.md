# SP-Engineering

Website for the **Engineering Club at South Point High School**.

Live at <https://cyberdude-101.github.io/SP-Engineering/>

Plain HTML, CSS and JavaScript &mdash; no build step and no frameworks. Edit a
file, commit, push, and GitHub Pages publishes it about a minute later.

---

## Almost everything you need is in `club-data.js`

That one file drives the meeting dates, the project list and the contact
details. You should rarely need to touch anything else.

### The meeting date looks after itself

Set the first meeting of the school year once:

```js
firstMeeting: "2026-08-26",   // first meeting
everyNWeeks:  2,              // every other week
```

The site works out every meeting after that on its own, so the homepage never
goes stale between updates. **You do not need to edit the site every two weeks.**

### Changing one meeting

Three different situations, three different fields. Pick the right one.

**Cancelled** &mdash; no meeting that week, the site jumps to the next one:

```js
skipDates: [ "2026-12-23" ],
```

**Moved** &mdash; same week, different day. Left side is where it *would* have
been, right side is where it went. Do not also add it to `skipDates`:

```js
reschedule: { "2026-09-09": "2026-09-10" },
```

**Extra** &mdash; a one-off that is not part of the pattern:

```js
extraDates: [ "2026-10-14" ],
```

Moved and extra dates get sorted into the right place automatically, even if
you move a meeting earlier. A date that was never a meeting day will not do
anything, so check it against the schedule on the meetings page first.

**If the schedule shifts permanently** &mdash; you end up meeting on the
opposite Wednesdays from now on &mdash; do not use these. Change `firstMeeting`
to the new date and everything re-derives from there.

At the end of the year the site stops showing dates and says so, rather than
displaying something wrong.

### Adding a project

Copy one block in the `projects` list, change the fields, put it at the top:

```js
{
  title:   "Mousetrap Cars",
  term:    "This year",
  current: true,                 // true = "What we're working on"
  diagram: "truss",              // truss | airfoil | printer | circuit | ""
  blurb:   "What we did and how it went.",
  photos:  [
    { file: "IMG_1234.jpeg", alt: "Short description of the photo" }
  ]
},
```

Only mark **one** project `current: true`. Everything else falls into
"Previously" automatically. Set `photos: []` if you have not got pictures yet.

---

## Adding photos

Photos straight off a phone are 3&ndash;5&nbsp;MB each and make the site slow on
cell data. **Resize to about 1400px on the long edge before committing** &mdash;
that lands around 200&nbsp;KB. Any image editor or online resizer works.

Then put the filename in the project's `photos` list with a real `alt`
description (it is what screen readers read out, and what shows if the image
fails to load).

Photos currently sitting unused in `img/`, ready for future pages:
`IMG_0768.jpeg`, `IMG_0774.jpeg`, `IMG_0777.jpeg`.

---

## The rest of the files

| File | What it is |
| --- | --- |
| `index.html` | Home |
| `meetings.html` | Next meeting, full schedule, what a meeting is like |
| `projects.html` | Project list (built from `club-data.js`) |
| `join.html` | How to join, FAQ, contact |
| `club-data.js` | **Schedule, projects, contacts &mdash; edit this one** |
| `diagrams.js` | The four animated drawings |
| `site.js` | Menu, dates, project rendering, photo viewer |
| `style.css` | All styling |
| `img/` | Photos |

### Changing the colours

Everything is at the top of `style.css` under `:root`. Change `--red` and it
updates the whole site.

One warning: the background is nearly black, so a red much darker than the
current `#c8102e` drops below the minimum contrast and the thin lines in the
diagrams start disappearing on phones in daylight. If you want a deeper red,
lighten `--ground` at the same time.

### The animated diagrams

Drop one into any page:

```html
<div class="diagram" data-diagram="truss"></div>
```

Options: `truss`, `airfoil`, `printer`, `circuit`. Add `diagram--hero` to the
class for the large version. They all stop moving for anyone who has reduced
motion switched on.

---

## Running it locally

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. You need a local server rather than opening
the files directly, or the copy button and project list will not work.
