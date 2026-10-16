// The hero scene: Rahim sends a message, your sleeping phone gets the notification, Rahim deletes it
// for everyone, you open the chat and it's gone, and NothingLost shows the copy it kept. Loops.
(function () {
  var scene = document.getElementById("scene");
  var beats = document.querySelectorAll("#beats li");
  if (!scene) return;
  var inner = scene.querySelector(".scene-in");
  var typed = scene.querySelector(".typed");
  var TEXT = "I'll send the money tonight, promise";
  var STATES = ["typing", "sent", "fly", "awake", "press", "menu", "pick", "deleted", "tapnote", "chat", "alert", "tap", "open", "fade"];
  var BEAT = { typing: 0, awake: 1, press: 2, tapnote: 3, alert: 4 };

  // Scale the scene to its box, and on wide screens also to the screen's height,
  // so the whole story fits in view at once.
  function fit() {
    var stage = scene.parentElement;
    var k = (stage.clientWidth - 32) / inner.offsetWidth;
    if (innerWidth > 900) {
      k = Math.min(k, (innerHeight - 150) / inner.offsetHeight);
    }
    scene.style.setProperty("--k", Math.max(0.45, Math.min(1, k)).toFixed(3));
  }
  fit();
  addEventListener("resize", fit);

  function beat(n) { beats.forEach(function (li, i) { li.classList.toggle("on", i === n); }); }
  function add(s) { scene.classList.add(s); if (s in BEAT) beat(BEAT[s]); }

  // #still=N holds the scene at state N (for checking each step by eye).
  var still = /#still=(\d+)/.exec(location.hash);
  if (still) {
    var n = +still[1];
    STATES.slice(0, n + 1).forEach(function (s) { if (s !== "fade" && s !== "fly") add(s); });
    if (n === 0) typed.textContent = TEXT.slice(0, 30);
    else scene.classList.remove("typing");
    return;
  }

  // People who prefer less motion get the ending, held still.
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    ["sent", "awake", "deleted", "chat", "open"].forEach(function (s) { scene.classList.add(s); });
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
        if (i < TEXT.length) timers.push(setTimeout(type, 45));
      })();
    });
    at(2500, function () { scene.classList.remove("typing"); typed.textContent = ""; add("sent"); add("fly"); });
    at(3200, function () { add("awake"); });
    at(5600, function () { add("press"); });
    at(6100, function () { add("menu"); });
    at(6900, function () { add("pick"); });
    at(7300, function () { add("deleted"); });
    at(8800, function () { add("tapnote"); });
    at(9200, function () { add("chat"); });
    at(11400, function () { add("alert"); });
    at(13300, function () { add("tap"); });
    at(13700, function () { add("open"); });
    at(18200, function () { add("fade"); });
    at(18800, play);
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
