// The sections below the hero: fade-ins, the "Sound familiar?" cards turning over,
// the feature tour, and the last deleted message turning into the promise.
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

  // Sound familiar: while the grid is on screen, turn one card over at a time.
  var cards = Array.prototype.slice.call(document.querySelectorAll(".m-card"));
  if (cards.length) {
    cards.forEach(function (c) { c.addEventListener("click", function () { c.classList.toggle("on"); }); });
    if (!calm && !still) {
      var i = 0, timer = null;
      onView(document.querySelector(".m-grid"), function (seen) {
        clearInterval(timer);
        if (!seen) return;
        timer = setInterval(function () {
          cards.forEach(function (c) { c.classList.remove("on"); });
          cards[i % cards.length].classList.add("on");
          i++;
        }, 1800);
      }, 0.3);
    } else if (still) {
      cards.forEach(function (c, n) { if (n % 2) c.classList.add("on"); });
    }
  }

  // Inside the app: a tab per feature; the phone shows its real screen.
  var tour = document.querySelector(".tour");
  if (tour) {
    var tabs = tour.querySelectorAll(".t-tab"), shots = tour.querySelectorAll(".t-device img");
    var at = 0, auto = null, chosen = false;
    function show(n) {
      at = n;
      tabs.forEach(function (t, k) { t.classList.toggle("on", k === n); t.setAttribute("aria-selected", String(k === n)); });
      shots.forEach(function (s, k) { s.classList.toggle("on", k === n); });
      // Restart the progress bar.
      tour.classList.remove("auto"); void tour.offsetWidth; if (!chosen && !calm) tour.classList.add("auto");
    }
    tabs.forEach(function (t, k) {
      t.addEventListener("click", function () { chosen = true; clearInterval(auto); tour.classList.remove("auto"); show(k); });
    });
    if (!calm && !still) {
      onView(tour, function (seen) {
        clearInterval(auto);
        if (!seen || chosen) return;
        show(at);
        auto = setInterval(function () { show((at + 1) % tabs.length); }, 6000);
      }, 0.35);
    }
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
