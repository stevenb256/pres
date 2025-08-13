// Vanilla JS to add navigation, scroll progress, and dots
(function () {
  const sections = Array.from(document.querySelectorAll("section.section"));
  const ids = sections.map(s => s.dataset.section);
  const dots = document.getElementById("dots");
  const progress = document.getElementById("progress");
  const viewport = document.getElementById("viewport");

  // Build nav dots
  ids.forEach((id, i) => {
    const btn = document.createElement("button");
    btn.setAttribute("aria-label", `Go to ${id}`);
    btn.addEventListener("click", () => jumpTo(i));
    dots.appendChild(btn);
  });

  const updateDots = () => {
    const idx = closestSectionIndex();
    Array.from(dots.children).forEach((b, i) => b.classList.toggle("active", i === idx));
  };

  const closestSectionIndex = () => {
    const top = viewport.scrollTop;
    let best = 0, bestDelta = Infinity;
    sections.forEach((s, i) => {
      const delta = Math.abs(s.offsetTop - top);
      if (delta < bestDelta) { best = i; bestDelta = delta; }
    });
    return best;
  };

  const jumpTo = (i) => {
    sections[i].scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Progress bar
  const updateProgress = () => {
    const max = viewport.scrollHeight - viewport.clientHeight;
    const ratio = Math.max(0, Math.min(1, viewport.scrollTop / max));
    progress.style.width = (ratio * 100) + "%";
  };

  // Scroll + resize handlers
  viewport.addEventListener("scroll", () => { updateProgress(); updateDots(); }, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress(); updateDots();

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (["ArrowDown", "PageDown"].includes(e.key)) {
      e.preventDefault();
      jumpTo(Math.min(closestSectionIndex() + 1, sections.length - 1));
    }
    if (["ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      jumpTo(Math.max(closestSectionIndex() - 1, 0));
    }
    if (e.key === "Home") { e.preventDefault(); jumpTo(0); }
    if (e.key === "End") { e.preventDefault(); jumpTo(sections.length - 1); }
  });

  // Button actions
  document.querySelectorAll("[data-jump]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-jump");
      const idx = ids.indexOf(id);
      if (idx >= 0) jumpTo(idx);
    });
  });

  document.querySelectorAll("[data-link]").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("Replace this with your real link before presenting.");
    });
  });
})();