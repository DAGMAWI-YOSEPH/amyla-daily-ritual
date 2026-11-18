/**
 * AMYLA Daily Ritual — demo waitlist form
 * Stores signups in localStorage and shows success feedback.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "amyla_waitlist";
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function loadList() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveEntry(email) {
    var list = loadList();
    if (list.indexOf(email) === -1) {
      list.push(email);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
    return list.length;
  }

  function showToast(message) {
    var toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    // reflow for transition
    void toast.offsetWidth;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.classList.remove("show");
    }, 3800);
  }

  function handleSubmit(event) {
    event.preventDefault();
    var form = event.currentTarget;
    var input = form.querySelector('input[type="email"]');
    var msg = form.querySelector(".form-msg");
    var btn = form.querySelector('button[type="submit"]');
    var email = (input.value || "").trim().toLowerCase();

    input.classList.remove("invalid");
    msg.classList.remove("error");
    msg.textContent = "";

    if (!email) {
      input.classList.add("invalid");
      msg.textContent = "Please enter your email address.";
      msg.classList.add("error");
      input.focus();
      return;
    }

    if (!EMAIL_RE.test(email)) {
      input.classList.add("invalid");
      msg.textContent = "That doesn't look like a valid email.";
      msg.classList.add("error");
      input.focus();
      return;
    }

    var count = saveEntry(email);

    // Button success state
    btn.classList.add("success");
    var originalHTML = btn.innerHTML;
    btn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> You\'re on the list';

    msg.textContent = "Welcome to AMYLA — we'll be in touch soon.";
    input.value = "";
    input.blur();

    showToast(
      "You're on the early-access list (" + count +
        (count === 1 ? " signup" : " signups") + " so far)."
    );

    setTimeout(function () {
      btn.classList.remove("success");
      btn.innerHTML = originalHTML;
      msg.textContent = "";
    }, 4000);
  }

  function init() {
    var forms = document.querySelectorAll(".waitlist-form");
    forms.forEach(function (form) {
      form.addEventListener("submit", handleSubmit);

      var input = form.querySelector('input[type="email"]');
      if (input) {
        input.addEventListener("input", function () {
          input.classList.remove("invalid");
          var msg = form.querySelector(".form-msg");
          if (msg && msg.classList.contains("error")) {
            msg.textContent = "";
            msg.classList.remove("error");
          }
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
