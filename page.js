// The sections below the hero: fade-ins, the brand tabs, the in-app test on the drawn phone,
// the Play button dock on phones, and the last deleted message turning into the promise.
(function () {
  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var watch = "IntersectionObserver" in window;
  // #static shows everything at once (for checking the page by eye).
  var still = /#static/.test(location.hash);

  function onView(el, fn, threshold) {
    if (!watch || still) { fn(true); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { fn(e.isIntersecting); });
    }, { threshold: threshold || 0.2 }).observe(el);
  }

  // Fade up once, the first time each block comes into view.
  document.querySelectorAll(".reveal").forEach(function (el) {
    var done = false;
    onView(el, function (seen) { if (seen && !done) { done = true; el.classList.add("in"); } }, 0.15);
  });

  // Your phone: brand tabs (arrow keys move between them, as tabs should).
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".b-tab"));
  if (tabs.length) {
    function pick(t, focus) {
      tabs.forEach(function (o) {
        var on = o === t;
        o.setAttribute("aria-selected", String(on));
        o.tabIndex = on ? 0 : -1;
        document.getElementById(o.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) t.focus();
    }
    tabs.forEach(function (t, k) {
      t.addEventListener("click", function () { pick(t); });
      t.addEventListener("keydown", function (e) {
        var n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (e.key === "Home") n = -k; else if (e.key === "End") n = tabs.length - 1 - k;
        if (n === undefined) return;
        e.preventDefault();
        pick(tabs[(k + n + tabs.length) % tabs.length], true);
      });
    });
    pick(tabs[0]);
  }

  // Setup: the in-app test, played on the drawn phone. Timings follow the app's own test
  // (the test message shows for 2.5 s, then it is swapped for "This message was deleted").
  var tp = document.getElementById("tp"), step = document.getElementById("tp-step");
  if (tp) {
    var STEPS = [
      [0, "", "Tap Try it now"],
      [900, "press", "Tap Try it now"],
      [1500, "n1", "A test message arrives"],
      [4000, "gone", "It's deleted, the way a chat app does it"],
      [5000, "n2", "Recover caught it"],
      [7600, "list", "The copy it kept, in the Deleted tab"]
    ];
    var END = ["press", "n1", "gone", "n2", "list"];
    var jobs = [];
    function say(t) { if (step) step.textContent = t; }
    function run() {
      jobs.forEach(clearTimeout); jobs = [];
      END.forEach(function (c) { tp.classList.remove(c); });
      STEPS.forEach(function (s) {
        jobs.push(setTimeout(function () { if (s[1]) tp.classList.add(s[1]); say(s[2]); }, s[0]));
      });
      jobs.push(setTimeout(run, 12000));
    }
    if (calm || still) { ["gone", "list"].forEach(function (c) { tp.classList.add(c); }); say("The copy it kept, in the Deleted tab"); }
    else onView(tp, function (seen) {
      if (seen) { if (!jobs.length) run(); }
      else { jobs.forEach(clearTimeout); jobs = []; }
    }, 0.4);
  }

  // Phones: once the first screen has scrolled away, keep a Play button in reach (not over the last one).
  var dock = document.getElementById("dock"), intro = document.querySelector(".intro"), end = document.getElementById("get");
  if (dock && intro && watch) {
    dock.hidden = false;
    var pastIntro = false, atEnd = false;
    function sync() { dock.classList.toggle("show", pastIntro && !atEnd); }
    new IntersectionObserver(function (e) { pastIntro = !e[0].isIntersecting; sync(); }).observe(intro);
    if (end) new IntersectionObserver(function (e) { atEnd = e[0].isIntersecting; sync(); }).observe(end);
  }

  // The last word: "This message was deleted" becomes the promise.
  var bub = document.querySelector(".e-bub");
  if (bub) {
    if (calm || still) bub.classList.add("said");
    else onView(bub, function (seen) {
      if (seen) setTimeout(function () { bub.classList.add("said"); }, 1400);
    }, 0.6);
  }
})();

// Email signup: the block stays hidden until data-endpoint on #signup holds the provider's form URL.
// The form posts into a hidden iframe, so no backend or CORS is needed.
(function () {
  var box = document.getElementById("signup");
  var url = box && (box.getAttribute("data-endpoint") || "").trim();
  if (!url || url.indexOf("https://") !== 0) return;
  var form = box.querySelector("form"), email = form.querySelector('input[type="email"]');
  var trap = form.querySelector(".su-trap input"), note = box.querySelector(".su-status"), btn = form.querySelector("button");
  form.action = url;
  email.name = box.getAttribute("data-field") || "email_address";
  box.hidden = false;
  form.addEventListener("submit", function (e) {
    if (trap.value) { e.preventDefault(); return; }
    setTimeout(function () {
      form.reset();
      btn.disabled = true;
      note.textContent = "Almost there. Check your inbox and tap the link to confirm.";
      setTimeout(function () { btn.disabled = false; }, 4000);
    }, 0);
  });
})();
