/* =========================================================
   script.js - External JavaScript for the e-portfolio
   DOM methods used (Lecture 6): getElementById, querySelector,
   querySelectorAll, getElementsByClassName, innerHTML, style,
   setAttribute, createElement, appendChild, onclick,
   addEventListener, form validation.
   Every feature checks whether its elements exist first, so the
   same file can be linked from every page without errors.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  setupHamburger();
  setupDarkMode();
  setupBackToTop();
  setupFooterYear();
  setupTyping();
  setupAccordion();
  setupSlider();
  setupSkillBars();
  setupProjectFilter();
  setupContactForm();
  setupCounters();
});

/* ---------- 1. Hamburger menu (mobile navigation) ---------- */
function setupHamburger() {
  var btn = document.getElementById("hamburger");
  var menu = document.getElementById("navMenu");
  if (!btn || !menu) return;
  btn.onclick = function () {
    menu.classList.toggle("open");
    btn.classList.toggle("open");
    btn.setAttribute("aria-expanded", menu.classList.contains("open"));
  };
}

/* ---------- 2. Dark mode toggle (remembered with localStorage) ---------- */
function setupDarkMode() {
  var toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggle.innerHTML = "&#9728;"; // sun icon
  }
  toggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    var isDark = document.body.classList.contains("dark");
    toggle.innerHTML = isDark ? "&#9728;" : "&#9790;";
    localStorage.setItem("theme", isDark ? "dark" : "light");
    showToast(isDark ? "Dark mode on" : "Light mode on");
  });
}

/* ---------- 3. Back-to-top button ---------- */
function setupBackToTop() {
  var topBtn = document.getElementById("backToTop");
  if (!topBtn) return;
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) topBtn.classList.add("show");
    else topBtn.classList.remove("show");
  });
  topBtn.onclick = function () { window.scrollTo({ top: 0, behavior: "smooth" }); };
}

/* ---------- 4. Footer year (innerHTML) ---------- */
function setupFooterYear() {
  var year = document.getElementById("year");
  if (year) year.innerHTML = new Date().getFullYear();
}

/* ---------- 5. Typing effect on home page ---------- */
function setupTyping() {
  var el = document.getElementById("typing");
  if (!el) return;
  var words = ["Future Web Designer", "AI & ICT Student", "Software Engineer in training", "Fast Learner"];
  var w = 0, c = 0, deleting = false;
  function tick() {
    var word = words[w];
    c += deleting ? -1 : 1;
    el.innerHTML = "&gt; " + word.substring(0, c) + "_";
    var delay = deleting ? 60 : 120;
    if (!deleting && c === word.length) { deleting = true; delay = 1400; }
    else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 400; }
    setTimeout(tick, delay);
  }
  tick();
}

/* ---------- 6. Accordion ---------- */
function setupAccordion() {
  var headers = document.getElementsByClassName("accordion-header");
  for (var i = 0; i < headers.length; i++) {
    headers[i].addEventListener("click", function () {
      var item = this.parentElement;
      var body = item.querySelector(".accordion-body");
      var isOpen = item.classList.contains("open");
      item.classList.toggle("open");
      this.setAttribute("aria-expanded", !isOpen);
      // change the style property directly (element.style)
      body.style.maxHeight = isOpen ? null : body.scrollHeight + "px";
    });
  }
}

/* ---------- 7. Image slider (auto-play + buttons + dots) ---------- */
function setupSlider() {
  var slider = document.getElementById("slider");
  if (!slider) return;
  var track = slider.querySelector(".slides");
  var images = track.querySelectorAll("img");
  var dotsBox = slider.querySelector(".dots");
  var caption = document.getElementById("sliderCaption");
  var index = 0, timer;

  // Create one dot per image with createElement + appendChild
  for (var i = 0; i < images.length; i++) {
    var dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", "Show slide " + (i + 1));
    dot.setAttribute("data-index", i);
    dot.addEventListener("click", function () { goTo(parseInt(this.getAttribute("data-index"), 10)); restart(); });
    dotsBox.appendChild(dot);
  }
  function goTo(n) {
    index = (n + images.length) % images.length;
    track.style.transform = "translateX(-" + index * 100 + "%)";
    var dots = dotsBox.querySelectorAll(".dot");
    for (var j = 0; j < dots.length; j++) dots[j].classList.toggle("active", j === index);
    if (caption) caption.innerHTML = images[index].alt;
  }
  function restart() { clearInterval(timer); timer = setInterval(function () { goTo(index + 1); }, 4000); }
  slider.querySelector(".prev").onclick = function () { goTo(index - 1); restart(); };
  slider.querySelector(".next").onclick = function () { goTo(index + 1); restart(); };
  slider.addEventListener("mouseenter", function () { clearInterval(timer); }); // pause on hover
  slider.addEventListener("mouseleave", restart);
  goTo(0); restart();
}

/* ---------- 8. Animated skill bars ---------- */
function setupSkillBars() {
  var fills = document.querySelectorAll(".skill-fill");
  if (!fills.length) return;
  setTimeout(function () {
    for (var i = 0; i < fills.length; i++) fills[i].style.width = fills[i].getAttribute("data-level") + "%";
  }, 300);
  var resetBtn = document.getElementById("replaySkills");
  if (resetBtn) resetBtn.onclick = function () {
    for (var i = 0; i < fills.length; i++) fills[i].style.width = "0";
    setTimeout(setupSkillBars, 50);
  };
}

/* ---------- 9. Project filter buttons ---------- */
function setupProjectFilter() {
  var buttons = document.querySelectorAll(".filter-btn");
  var cards = document.querySelectorAll(".project-card");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-filter");
      buttons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      cards.forEach(function (card) {
        var show = cat === "all" || card.getAttribute("data-category") === cat;
        card.classList.toggle("hide", !show);
      });
    });
  });
}

/* ---------- 10. Number counters on home page ---------- */
function setupCounters() {
  var nums = document.querySelectorAll(".num[data-target]");
  nums.forEach(function (el) {
    var target = parseInt(el.getAttribute("data-target"), 10), cur = 0;
    var step = Math.max(1, Math.ceil(target / 40));
    var t = setInterval(function () {
      cur = Math.min(target, cur + step);
      el.innerHTML = cur + (el.getAttribute("data-suffix") || "");
      if (cur >= target) clearInterval(t);
    }, 35);
  });
}

/* ---------- 11. Contact form validation ---------- */
function setupContactForm() {
  var form = document.getElementById("contactForm");
  if (!form) return;
  var charCount = document.getElementById("charCount");
  var msg = document.getElementById("message");
  msg.addEventListener("input", function () { charCount.innerHTML = msg.value.length + " / 500"; });

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // stay on page (no server for this assignment)
    var ok = true;
    ok = check("name", /^[A-Za-z\u4e00-\u9fa5 ]{2,40}$/, "Please enter your name (2-40 letters).") && ok;
    ok = check("email", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Please enter a valid email, e.g. name@example.com.") && ok;
    ok = check("phone", /^\d{4}-\d{4}$/, "Phone format must be 1234-5678.") && ok;
    ok = check("subject", /.+/, "Please choose a subject.") && ok;
    ok = check("message", /^[\s\S]{10,500}$/, "Message must be 10-500 characters.") && ok;

    var result = document.getElementById("formResult");
    if (ok) {
      var name = document.getElementById("name").value;
      result.className = "form-result success";
      result.innerHTML = "Thank you, <strong>" + escapeHtml(name) + "</strong>! Your message has been received (demo only - not actually sent).";
      form.reset();
      charCount.innerHTML = "0 / 500";
      var inputs = form.querySelectorAll(".valid");
      for (var i = 0; i < inputs.length; i++) inputs[i].classList.remove("valid");
      showToast("Message sent!");
    } else {
      result.className = "form-result";
    }
  });
  form.addEventListener("reset", function () {
    var errs = form.querySelectorAll(".error-msg");
    for (var i = 0; i < errs.length; i++) errs[i].innerHTML = "";
    var fields = form.querySelectorAll("input, select, textarea");
    for (var j = 0; j < fields.length; j++) fields[j].classList.remove("invalid", "valid");
  });
}

/* Validate one field against a regular expression and show the error */
function check(id, pattern, message) {
  var field = document.getElementById(id);
  var error = document.getElementById(id + "Error");
  var valid = pattern.test(field.value.trim());
  field.classList.toggle("invalid", !valid);
  field.classList.toggle("valid", valid);
  error.innerHTML = valid ? "" : message;
  return valid;
}

function escapeHtml(s) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(s));
  return div.innerHTML;
}

/* ---------- 12. Toast message (createElement + appendChild) ---------- */
function showToast(text) {
  var toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.innerHTML = text;
  toast.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
}

/* Print CV button (used on Personal Info page) */
function printCV() { window.print(); }
