(function () {
  "use strict";

  var storageKey = "mine-kocak-cv-language";
  var root = document.body && document.body.dataset.router === "root";

  function preferredLanguage() {
    var saved = null;
    try {
      saved = window.localStorage.getItem(storageKey);
    } catch (error) {
      saved = null;
    }

    if (saved === "en" || saved === "th") {
      return saved;
    }

    return navigator.language && navigator.language.toLowerCase().indexOf("th") === 0 ? "th" : "en";
  }

  if (root) {
    window.location.replace("./" + preferredLanguage() + "/");
    return;
  }

  document.querySelectorAll("[data-language]").forEach(function (link) {
    link.addEventListener("click", function () {
      try {
        window.localStorage.setItem(storageKey, link.dataset.language);
      } catch (error) {
        // Private browsing can disable local storage. The link still works.
      }
    });
  });

  var dialog = document.querySelector("#video-dialog");
  var videoFrame = dialog && dialog.querySelector("iframe");
  var triggers = document.querySelectorAll("[data-video-trigger]");
  var closeButtons = document.querySelectorAll("[data-video-close]");

  function openVideo() {
    if (!dialog) return;
    if (videoFrame && !videoFrame.getAttribute("src")) {
      videoFrame.setAttribute("src", videoFrame.dataset.src);
    }
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.removeAttribute("hidden");
      document.body.classList.add("modal-open");
    }
  }

  function closeVideo() {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    } else {
      dialog.setAttribute("hidden", "hidden");
      document.body.classList.remove("modal-open");
    }
    if (videoFrame) videoFrame.removeAttribute("src");
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", openVideo);
  });

  closeButtons.forEach(function (button) {
    button.addEventListener("click", closeVideo);
  });

  if (dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeVideo();
    });
    dialog.addEventListener("close", function () {
      document.body.classList.remove("modal-open");
      if (videoFrame) videoFrame.removeAttribute("src");
    });
  }
})();
