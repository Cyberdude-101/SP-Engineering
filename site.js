/* ============================================================
   South Point Engineering Club — shared behaviour.
   Reads everything from club-data.js. You should rarely need
   to edit this file.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

  /* ---------- Dates ----------
     Parsed by hand rather than with new Date("2026-08-26"), which
     browsers read as UTC and can land on the wrong day locally. */

  function parseDate(text) {
    var bits = String(text).split("-");
    return new Date(+bits[0], +bits[1] - 1, +bits[2]);
  }

  function midnight(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function key(d) {
    var m = String(d.getMonth() + 1);
    var day = String(d.getDate());
    return d.getFullYear() + "-" + (m.length < 2 ? "0" + m : m) + "-" + (day.length < 2 ? "0" + day : day);
  }

  function daysBetween(a, b) {
    return Math.round((midnight(b) - midnight(a)) / 86400000);
  }

  /* Minutes past midnight for a time written the friendly way in
     club-data.js ("3:30", "4:15 PM"). With no AM/PM, anything before 8
     is taken as afternoon — this is an after-school club, so "3:30"
     means half three, not dawn. */
  function clockMinutes(text) {
    var m = String(text).match(/(\d{1,2}):(\d{2})\s*([AP]M)?/i);
    if (!m) return null;

    var hour = +m[1];
    var mark = (m[3] || "").toUpperCase();

    if (mark === "PM" && hour !== 12) hour += 12;
    else if (mark === "AM" && hour === 12) hour = 0;
    else if (!mark && hour < 8) hour += 12;

    return hour * 60 + (+m[2]);
  }

  /* Length of a meeting, worked out from the start and end times rather
     than written down separately — one less thing to forget to update. */
  function meetingLength() {
    var from = clockMinutes(CLUB.startTime);
    var to   = clockMinutes(CLUB.endTime);
    if (from === null || to === null || to <= from) return null;
    return to - from;
  }

  /* Build every meeting date for the year:
       1. walk the every-other-Wednesday pattern forward
       2. drop anything on skipDates
       3. move anything listed in reschedule to its new date
       4. add any one-off extraDates
     A moved or extra date can land out of order, so the list is
     sorted and de-duplicated at the end rather than as we go. */
  function allMeetingDates() {
    var out    = [];
    var cursor = parseDate(CLUB.firstMeeting);
    var end    = CLUB.lastMeeting ? parseDate(CLUB.lastMeeting) : null;
    var skip   = CLUB.skipDates || [];
    var moved  = CLUB.reschedule || {};
    var step   = (CLUB.everyNWeeks || 1) * 7;
    var guard  = 0;

    while (guard++ < 400) {
      if (end && cursor > end) break;
      var k = key(cursor);
      if (skip.indexOf(k) === -1) {
        out.push(moved[k] ? parseDate(moved[k]) : new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + step);
    }

    (CLUB.extraDates || []).forEach(function (d) { out.push(parseDate(d)); });

    out.sort(function (a, b) { return a - b; });

    var seen = {}, unique = [];
    out.forEach(function (d) {
      var k = key(d);
      if (!seen[k] && (!end || d <= end)) { seen[k] = true; unique.push(d); }
    });
    return unique;
  }

  function upcomingMeetings(count) {
    var today = midnight(new Date());
    return allMeetingDates()
      .filter(function (d) { return d >= today; })
      .slice(0, count);
  }

  function longDate(d) {
    return DAYS[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + d.getDate();
  }

  function relative(d) {
    var n = daysBetween(new Date(), d);
    if (n === 0) return "Today";
    if (n === 1) return "Tomorrow";
    if (n < 7)   return "This " + DAYS[d.getDay()];
    if (n < 14)  return "Next " + DAYS[d.getDay()];
    return "In " + n + " days";
  }

  /* ---------- Next meeting block ---------- */
  function renderNextMeeting() {
    var host = document.querySelector("[data-next-meeting]");
    if (!host) return;

    var next = upcomingMeetings(1)[0];

    if (!next) {
      host.innerHTML =
        '<p class="nm-status">Between school years</p>' +
        '<p class="nm-when">Dates for next year go up in August</p>' +
        '<p class="nm-where">We meet every other Wednesday in ' + CLUB.room + '</p>';
      return;
    }

    var unit = CLUB.currentUnit
      ? '<p class="nm-unit">Currently building: <strong>' + CLUB.currentUnit + "</strong></p>"
      : "";
    var mins = meetingLength();

    host.innerHTML =
      '<p class="nm-status">Next meeting &middot; ' + relative(next) + "</p>" +
      '<p class="nm-when">' + longDate(next) + "</p>" +
      '<p class="nm-where">' + CLUB.startTime + "&ndash;" + CLUB.endTime +
        " &nbsp;&middot;&nbsp; " + CLUB.room + "</p>" +
      (mins
        ? '<div class="nm-dim" aria-hidden="true">' +
            "<span>" + CLUB.startTime + "</span><i></i><span>" + mins +
            " MIN</span><i></i><span>" + CLUB.endTime + "</span>" +
          "</div>"
        : "") + unit;
  }

  /* ---------- Full schedule (meetings page) ---------- */
  function renderSchedule() {
    var host = document.querySelector("[data-schedule]");
    if (!host) return;

    // Deliberately short. Publishing the whole year means every one of
    // those dates is a promise, and later ones are the most likely to move.
    var list = upcomingMeetings(4).slice(1);
    if (!list.length) {
      host.innerHTML = '<p class="muted">Nothing else on the calendar yet.</p>';
      return;
    }

    // No "next" highlight here — the next meeting has its own block above.
    host.innerHTML = "<ol class='sched'>" + list.map(function (d) {
      return "<li><span class='sched-date'>" + longDate(d) + "</span></li>";
    }).join("") + "</ol>";
  }

  /* ---------- Diagrams ---------- */
  function renderDiagrams() {
    document.querySelectorAll("[data-diagram]").forEach(function (host) {
      var svg = DIAGRAMS[host.dataset.diagram];
      if (!svg) return;
      host.innerHTML = svg;

      // The diagrams are drawn long and thin, which leaves them tiny in a
      // narrow card. data-viewbox crops in so they sit taller there.
      var box = host.dataset.viewbox;
      var el  = box && host.querySelector("svg");
      if (el) el.setAttribute("viewBox", box);
    });
  }

  /* ---------- Projects ---------- */
  function projectCard(p) {
    var photos = (p.photos || []).map(function (ph) {
      return '<button type="button" class="pj-shot" data-lightbox>' +
               '<img src="img/' + ph.file + '" alt="' + ph.alt + '" loading="lazy" />' +
             "</button>";
    }).join("");

    var gallery = photos
      ? '<div class="pj-shots">' + photos + "</div>"
      : '<p class="pj-nophotos">Photos from this one are still being sorted out.</p>';

    var diagram = p.diagram
      ? '<div class="diagram diagram--card" data-diagram="' + p.diagram + '"></div>'
      : "";

    return '<article class="pj">' +
             '<div class="pj-head">' +
               '<span class="pj-term">' + p.term + "</span>" +
               "<h3>" + p.title + "</h3>" +
             "</div>" +
             diagram +
             "<p>" + p.blurb + "</p>" +
             gallery +
           "</article>";
  }

  function renderProjects() {
    var host = document.querySelector("[data-projects]");
    if (!host) return;

    var all      = CLUB.projects || [];
    var current  = all.filter(function (p) { return p.current; });
    var archive  = all.filter(function (p) { return !p.current; });
    var html     = "";

    if (current.length) {
      html += "<section class='pj-group'><h2>What we're working on</h2>" +
              "<div class='pj-grid'>" + current.map(projectCard).join("") + "</div></section>";
    } else {
      html += "<section class='pj-group'><h2>What we're working on</h2>" +
              "<p class='pj-empty'>This year's first project hasn't been decided yet. " +
              "Come to a meeting and have a say in it.</p></section>";
    }

    if (archive.length) {
      html += "<section class='pj-group'><h2>Previously</h2>" +
              "<div class='pj-grid'>" + archive.map(projectCard).join("") + "</div></section>";
    }

    host.innerHTML = html;
    renderDiagrams();   // cards were just injected, so wire up their diagrams
  }

  /* ---------- Leadership ---------- */
  function renderLeadership() {
    var host = document.querySelector("[data-leadership]");
    if (!host) return;

    host.innerHTML = "<dl class='people'>" + CLUB.leadership.map(function (p) {
      return "<dt>" + p.role + "</dt>" +
             "<dd>" + p.name + " &middot; <a href='mailto:" + p.email + "'>" + p.email + "</a></dd>";
    }).join("") + "</dl>";
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links  = document.getElementById("nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Copy the meeting details ---------- */
  function initCopy() {
    var btn = document.querySelector("[data-copy]");
    if (!btn) return;

    var hint = btn.querySelector(".copy-hint");
    var idle = hint ? hint.textContent : "";

    btn.addEventListener("click", function () {
      var next = upcomingMeetings(1)[0];
      if (!next) return;

      var text = "Engineering Club — Next Meeting\n" +
                 "Date: " + longDate(next) + "\n" +
                 "Time: " + CLUB.startTime + "–" + CLUB.endTime + "\n" +
                 "Where: " + CLUB.room;

      function done(msg) {
        if (!hint) return;
        hint.textContent = msg;
        setTimeout(function () { hint.textContent = idle; }, 2200);
      }

      // Needs a secure context, so keep a fallback for files opened off disk.
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () { done("Copied"); },
          function () { done("Press Ctrl+C to copy"); }
        );
      } else {
        var box = document.createElement("textarea");
        box.value = text;
        box.setAttribute("readonly", "");
        box.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(box);
        box.select();
        try {
          done(document.execCommand("copy") ? "Copied" : "Press Ctrl+C to copy");
        } catch (e) {
          done("Press Ctrl+C to copy");
        }
        document.body.removeChild(box);
      }
    });
  }

  /* ---------- Photo viewer ---------- */
  function initLightbox() {
    var box = document.getElementById("lightbox");
    if (!box) return;

    var full    = box.querySelector("img");
    var caption = box.querySelector(".lb-caption");
    var shots   = [];
    var at      = 0;
    var restore = null;

    function collect() {
      shots = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox] img"));
    }

    function show(i) {
      at = (i + shots.length) % shots.length;
      full.src = shots[at].src;
      full.alt = shots[at].alt;

      // Never blow a photo up past its own resolution — a small source
      // stretched to fill the screen looks far worse than a small photo.
      full.style.maxWidth = "";
      // Keep the 100% cap as well, or this overflows a narrow screen.
      full.onload = function () {
        full.style.maxWidth = "min(100%, " + Math.min(1100, full.naturalWidth) + "px)";
      };
      if (full.complete && full.naturalWidth) full.onload();

      caption.textContent = shots[at].alt +
        (shots.length > 1 ? "  (" + (at + 1) + " of " + shots.length + ")" : "");
      box.querySelector("[data-dir]").hidden = shots.length < 2;
      box.querySelectorAll("[data-dir]").forEach(function (b) { b.hidden = shots.length < 2; });
    }

    function open(i) {
      restore = document.activeElement;
      show(i);
      box.setAttribute("open", "");
      document.body.style.overflow = "hidden";
      box.querySelector(".lb-close").focus();
    }

    function close() {
      box.removeAttribute("open");
      document.body.style.overflow = "";
      if (restore) restore.focus();
    }

    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-lightbox]");
      if (trigger) {
        collect();
        open(shots.indexOf(trigger.querySelector("img")));
      }
    });

    box.addEventListener("click", function (e) {
      var dir = e.target.closest("[data-dir]");
      if (dir) { show(at + (dir.dataset.dir === "next" ? 1 : -1)); return; }
      if (e.target === box || e.target.closest(".lb-close")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!box.hasAttribute("open")) return;
      if (e.key === "Escape")     close();
      if (e.key === "ArrowLeft")  show(at - 1);
      if (e.key === "ArrowRight") show(at + 1);
    });
  }

  /* ---------- Typing tagline (home page only) ---------- */
  function initTyping() {
    var el = document.getElementById("typing");
    if (!el) return;

    var phrase = CLUB.tagline || "";
    if (!phrase) { el.remove(); return; }

    if (reduceMotion) {
      el.textContent = phrase;
      el.classList.add("done");
      return;
    }

    var i = 0;
    (function next() {
      if (i < phrase.length) {
        el.textContent += phrase.charAt(i++);
        setTimeout(next, 62);
      } else {
        el.classList.add("done");
      }
    })();
  }

  /* ---------- Go ---------- */
  renderDiagrams();
  renderNextMeeting();
  renderSchedule();
  renderProjects();
  renderLeadership();
  initNav();
  initCopy();
  initLightbox();
  initTyping();
})();
