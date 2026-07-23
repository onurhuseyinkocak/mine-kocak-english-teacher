(function () {
  "use strict";

  var languageKey = "mine-kocak-cv-language";
  var root = document.body && document.body.dataset.router === "root";

  function preferredLanguage() {
    var saved = null;
    try { saved = window.localStorage.getItem(languageKey); } catch (error) { saved = null; }
    if (saved === "en" || saved === "th") return saved;
    return navigator.language && navigator.language.toLowerCase().indexOf("th") === 0 ? "th" : "en";
  }

  if (root) {
    window.location.replace("./" + preferredLanguage() + "/");
    return;
  }

  document.querySelectorAll("[data-language]").forEach(function (link) {
    link.addEventListener("click", function () {
      try { window.localStorage.setItem(languageKey, link.dataset.language); } catch (error) { /* Link still works. */ }
    });
  });

  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-document-card]"));
  var dialog = document.querySelector("#document-dialog");
  var image = dialog && dialog.querySelector("#document-dialog-image");
  var privateView = dialog && dialog.querySelector("#document-private-view");
  var title = dialog && dialog.querySelector("#document-dialog-title");
  var meta = dialog && dialog.querySelector("#document-dialog-meta");
  var counter = dialog && dialog.querySelector("#document-dialog-counter");
  var current = 0;

  function renderDocument(index) {
    if (!cards.length || !dialog) return;
    current = (index + cards.length) % cards.length;
    var card = cards[current];
    var source = card.dataset.documentSrc;
    title.textContent = card.dataset.documentTitle;
    meta.textContent = card.dataset.documentMeta;
    counter.textContent = (current + 1) + " / " + cards.length;
    if (source) {
      image.src = source;
      image.alt = card.dataset.documentAlt || card.dataset.documentTitle;
      image.hidden = false;
      privateView.hidden = true;
    } else {
      image.removeAttribute("src");
      image.hidden = true;
      privateView.hidden = false;
      privateView.querySelector("strong").textContent = card.dataset.documentTitle;
      privateView.querySelector("span").textContent = card.dataset.documentMeta;
    }
  }

  function openDocument(index) {
    if (!dialog) return;
    renderDocument(index);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.removeAttribute("hidden");
    var close = dialog.querySelector("[data-document-close]");
    if (close) close.focus();
  }

  function closeDocument() {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.setAttribute("hidden", "hidden");
    if (image) image.removeAttribute("src");
  }

  cards.forEach(function (card, index) { card.addEventListener("click", function () { openDocument(index); }); });
  if (!dialog) return;

  dialog.querySelector("[data-document-close]").addEventListener("click", closeDocument);
  dialog.querySelector("[data-document-prev]").addEventListener("click", function () { renderDocument(current - 1); });
  dialog.querySelector("[data-document-next]").addEventListener("click", function () { renderDocument(current + 1); });
  dialog.addEventListener("click", function (event) { if (event.target === dialog) closeDocument(); });
  dialog.addEventListener("close", function () { if (image) image.removeAttribute("src"); });
  document.addEventListener("keydown", function (event) {
    if (!dialog.open) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); renderDocument(current - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); renderDocument(current + 1); }
  });
})();
