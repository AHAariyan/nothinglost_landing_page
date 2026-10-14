// The hero scene: Rahim sends a message, your sleeping phone gets the notification,
// Rahim deletes it for everyone, and NothingLost shows the copy it kept. Loops.
(function () {
  var scene = document.getElementById("scene");
  var beats = document.querySelectorAll("#beats li");
  if (!scene) return;
  var typed = scene.querySelector(".typed");
  var TEXT = "I'll send the money tonight, promise";
  var STATES = ["typing", "sent", "fly", "awake", "press", "menu", "pick", "deleted", "alert", "tap", "open", "fade"];

  // Scale the scene (760px wide, 660px on phones) to fit its box.
  function fit() {
    var inner = scene.querySelector(".scene-in"), w = scene.parentElement.clientWidth - 16;
    scene.style.setProperty("--k", Math.min(1, w / inner.offsetWidth).toFixed(3));
  }
  fit();
  addEventListener("resize", fit);

  function beat(n) { beats.forEach(function (li, i) { li.classList.toggle("on", i === n); }); }
  function add(s) { scene.classList.add(s); }

  // #still=N holds the scene at state N (for checking each step by eye).
  var still = /#still=(\d+)/.exec(location.hash);
  if (still) {
    var n = +still[1], BEAT = { awake: 1, press: 2, alert: 3 }, b = 0;
    STATES.slice(0, n + 1).forEach(function (s) { if (s !== "fade" && s !== "fly") add(s); if (BEAT[s]) b = BEAT[s]; });
    if (n === 0) typed.textContent = TEXT.slice(0, 14);
    if (n > 0) scene.classList.remove("typing");
    beat(b);
    return;
  }

  // People who prefer less motion get the ending, held still.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    ["sent", "awake", "deleted", "open"].forEach(add);
    beats.forEach(function (li) { li.classList.add("on"); });
    return;
  }

  var timers = [];
  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }

  function play() {
    timers.forEach(clearTimeout); timers = [];
    STATES.forEach(function (s) { scene.classList.remove(s); });
    typed.textContent = "";
    beat(0);

    at(500, function () {
      add("typing");
      var i = 0;
      (function type() {
        typed.textContent = TEXT.slice(0, ++i);
        if (i < TEXT.length) timers.push(setTimeout(type, 38));
      })();
    });
    at(2300, function () { scene.classList.remove("typing"); typed.textContent = ""; add("sent"); add("fly"); });
    at(3000, function () { add("awake"); beat(1); });
    at(5400, function () { add("press"); beat(2); });
    at(5900, function () { add("menu"); });
    at(6700, function () { add("pick"); });
    at(7100, function () { add("deleted"); });
    at(8300, function () { add("alert"); beat(3); });
    at(10000, function () { add("tap"); });
    at(10400, function () { add("open"); });
    at(15000, function () { add("fade"); });
    at(15600, play);
  }

  // Start when the scene is on screen, so nobody misses the beginning.
  if ("IntersectionObserver" in window) {
    var started = false;
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting && !started) { started = true; play(); }
    }, { threshold: 0.3 }).observe(scene);
  } else {
    play();
  }
})();
