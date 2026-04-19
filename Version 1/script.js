const reveals = document.querySelectorAll(".reveal");
const countTargets = document.querySelectorAll("[data-count]");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const chipButtons = document.querySelectorAll(".chip[data-chip-group]");
const modalTriggers = document.querySelectorAll("[data-open-modal]");
const modalClosers = document.querySelectorAll("[data-close-modal]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((element) => revealObserver.observe(element));

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const targetValue = Number(element.dataset.count);
      const duration = 1200;
      const start = performance.now();

      const update = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        element.textContent = Math.round(progress * targetValue).toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
      countObserver.unobserve(element);
    });
  },
  { threshold: 0.6 }
);

countTargets.forEach((target) => countObserver.observe(target));

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.dataset.tabGroup;
    const target = button.dataset.tabTarget;

    document
      .querySelectorAll(`[data-tab-group="${group}"]`)
      .forEach((item) => item.classList.toggle("active", item === button));

    document.querySelectorAll(`[data-panel-group="${group}"]`).forEach((panel) => {
      panel.classList.toggle("active", panel.id === target);
    });
  });
});

chipButtons.forEach((chip) => {
  chip.addEventListener("click", () => {
    const group = chip.dataset.chipGroup;

    document
      .querySelectorAll(`.chip[data-chip-group="${group}"]`)
      .forEach((item) => item.classList.toggle("active", item === chip));
  });
});

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const modalId = trigger.dataset.openModal;
    const modal = document.getElementById(modalId);

    if (modal) {
      modal.classList.add("open");
    }
  });
});

modalClosers.forEach((closer) => {
  closer.addEventListener("click", () => {
    closer.closest(".modal")?.classList.remove("open");
  });
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("open");
    }
  });
});
