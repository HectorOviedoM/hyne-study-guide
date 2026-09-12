(function () {
  "use strict";

  var search = document.getElementById("site-search");
  if (!search) return;

  var path = (window.location.pathname || "").toLowerCase();
  var file = path.split("/").pop() || "index.html";
  if (file === "" || file === "/") file = "index.html";

  document.querySelectorAll(".site-header nav a").forEach(function (a) {
    var href = (a.getAttribute("href") || "").toLowerCase();
    if (href === file || (file === "index.html" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  // Sticky TOC highlight on chapter pages
  var tocLinks = document.querySelectorAll(".toc-aside a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var headings = [];
    tocLinks.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (el) headings.push({ id: id, el: el, link: link });
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          tocLinks.forEach(function (l) {
            l.classList.toggle("active", l.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    headings.forEach(function (h) { observer.observe(h.el); });
  }

  function normalize(s) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function filterHub(q) {
    var cards = document.querySelectorAll(".chapter-card");
    var any = false;
    cards.forEach(function (card) {
      var text = normalize(card.textContent);
      var show = !q || text.indexOf(q) !== -1;
      card.classList.toggle("hidden", !show);
      if (show) any = true;
    });
    var nm = document.getElementById("no-match");
    if (nm) nm.classList.toggle("show", !any && q.length > 0);
  }

  function filterChapter(q) {
    var main = document.querySelector(".chapter-main");
    if (!main) return;
    var sections = main.querySelectorAll("h2[id], h3[id]");
    sections.forEach(function (h) {
      if (!q) {
        h.classList.remove("hidden-heading");
        return;
      }
      var block = [h];
      var n = h.nextElementSibling;
      while (n && n.tagName !== "H2" && !(n.tagName === "H3" && h.tagName === "H2")) {
        if (n.tagName === "H2" || (h.tagName === "H3" && n.tagName === "H3")) break;
        block.push(n);
        n = n.nextElementSibling;
      }
      var text = normalize(block.map(function (el) { return el.textContent; }).join(" "));
      var match = text.indexOf(q) !== -1 || normalize(h.textContent).indexOf(q) !== -1;
      h.classList.toggle("hidden-heading", !match);
      // Also dim non-matching sibling content lightly via opacity on following until next heading
      var sib = h.nextElementSibling;
      while (sib && sib.tagName !== "H2" && !(h.tagName === "H3" && sib.tagName === "H3") && sib.tagName !== "H2") {
        if (sib.tagName === "H2" || (h.tagName === "H3" && sib.tagName === "H3")) break;
        if (sib.classList && (sib.classList.contains("check") || sib.classList.contains("key-terms") || sib.classList.contains("chapter-nav"))) break;
        sib.style.display = match || !q ? "" : "none";
        sib = sib.nextElementSibling;
      }
    });

    // Also filter TOC
    tocLinks.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (!el) return;
      var show = !q || normalize(el.textContent).indexOf(q) !== -1 ||
        (el.parentElement && normalize(el.parentElement.textContent).indexOf(q) !== -1);
      // Simpler: match link text + heading text
      show = !q || normalize(link.textContent + " " + (el.textContent || "")).indexOf(q) !== -1;
      link.parentElement.style.display = show ? "" : "none";
    });
  }

  var isHub = !!document.querySelector(".chapter-grid");

  search.addEventListener("input", function () {
    var q = normalize(search.value);
    if (isHub) filterHub(q);
    else filterChapter(q);
  });

  // Clear filter display when emptied
  search.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      search.value = "";
      search.dispatchEvent(new Event("input"));
      search.blur();
    }
  });
})();
