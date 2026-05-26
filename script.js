const menuButton = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#nav-menu");
document.body.classList.add("js-ready");

if (menuButton && navMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      element.classList.add("in-view");
      return;
    }

    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add("in-view"));
}

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;

    document.querySelectorAll("details[open]").forEach((openDetail) => {
      if (openDetail !== detail) openDetail.open = false;
    });
  });
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const carouselScope = carousel.closest(".testimonial-layout") || carousel;
  const cards = [...carousel.querySelectorAll(".testimonial-card")];
  const previousButton = carouselScope.querySelector("[data-carousel-prev]");
  const nextButton = carouselScope.querySelector("[data-carousel-next]");
  const dotsWrap = carouselScope.querySelector("[data-carousel-dots]");

  if (cards.length === 0 || !previousButton || !nextButton || !dotsWrap) return;

  let currentIndex = 0;
  let autoplayId;

  const buildDots = () => {
    dotsWrap.innerHTML = "";

    cards.forEach((card, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      const customerName = card.querySelector("strong")?.textContent || `cliente ${index + 1}`;
      dot.setAttribute("aria-label", `Ver depoimento de ${customerName}`);
      dot.addEventListener("click", () => {
        currentIndex = index;
        updateCarousel();
        restartAutoplay();
      });
      dotsWrap.appendChild(dot);
    });
  };

  const updateCarousel = () => {
    currentIndex = (currentIndex + cards.length) % cards.length;

    cards.forEach((card, index) => {
      const isActive = index === currentIndex;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-hidden", String(!isActive));
    });

    dotsWrap.querySelectorAll(".carousel-dot").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
      dot.setAttribute("aria-current", index === currentIndex ? "true" : "false");
    });
  };

  const next = () => {
    currentIndex += 1;
    updateCarousel();
  };

  const previous = () => {
    currentIndex -= 1;
    updateCarousel();
  };

  const stopAutoplay = () => {
    window.clearInterval(autoplayId);
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayId = window.setInterval(next, 4200);
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  previousButton.addEventListener("click", () => {
    previous();
    restartAutoplay();
  });

  nextButton.addEventListener("click", () => {
    next();
    restartAutoplay();
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  buildDots();
  updateCarousel();
  startAutoplay();
});

window.addEventListener("load", () => {
  if (window.lucide) {
    window.lucide.createIcons({
      attrs: {
        "aria-hidden": "true"
      }
    });
  }
});
