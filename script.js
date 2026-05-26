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

document.querySelectorAll("[data-services]").forEach((services) => {
  const options = [...services.querySelectorAll("[data-service-option]")];
  const feature = services.querySelector("[data-service-feature]");
  const category = services.querySelector("[data-service-category]");
  const title = services.querySelector("[data-service-title]");
  const description = services.querySelector("[data-service-description]");
  const serviceList = services.querySelector("[data-service-list]");
  const count = services.querySelector("[data-service-count]");
  const cta = services.querySelector("[data-service-cta]");
  const previous = services.querySelector("[data-service-prev]");
  const next = services.querySelector("[data-service-next]");

  if (!options.length || !feature || !category || !title || !description || !serviceList || !count || !cta) return;

  const updateService = (option, index) => {
    options.forEach((item) => {
      const isActive = item === option;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    category.textContent = option.dataset.category || "";
    title.textContent = option.dataset.title || "";
    description.textContent = option.dataset.description || "";
    count.textContent = `${index + 1}/${options.length}`;
    feature.classList.remove("is-updating");
    void feature.offsetWidth;
    feature.classList.add("is-updating");

    serviceList.innerHTML = "";
    (option.dataset.servicesList || "").split(";").filter(Boolean).forEach((item) => {
      const [name, priceValue, timeValue] = item.split("|");
      const row = document.createElement("div");
      const label = document.createElement("small");
      const serviceName = document.createElement("span");
      const price = document.createElement("strong");
      const time = document.createElement("small");

      label.textContent = "Serviço";
      serviceName.textContent = name || "";
      price.textContent = priceValue || "Sob consulta";
      time.textContent = timeValue || "";
      time.className = "service-time";

      row.append(label, serviceName, price, time);
      serviceList.appendChild(row);
    });

    feature.classList.remove("service-bg-feminino", "service-bg-masculino", "service-bg-unhas");
    if (option.dataset.bg) feature.classList.add(option.dataset.bg);

    const serviceName = encodeURIComponent(option.dataset.title || "um serviço");
    cta.href = `https://wa.me/5511942110022?text=Ol%C3%A1%2C%20quero%20agendar%20servi%C3%A7os%20de%20${serviceName}%20na%20Solange%20Cabeleireira.`;
  };

  options.forEach((option, index) => {
    option.addEventListener("click", () => updateService(option, index));
  });

  previous?.addEventListener("click", () => {
    const activeIndex = options.findIndex((option) => option.classList.contains("is-active"));
    const nextIndex = activeIndex <= 0 ? options.length - 1 : activeIndex - 1;
    updateService(options[nextIndex], nextIndex);
  });

  next?.addEventListener("click", () => {
    const activeIndex = options.findIndex((option) => option.classList.contains("is-active"));
    const nextIndex = activeIndex >= options.length - 1 ? 0 : activeIndex + 1;
    updateService(options[nextIndex], nextIndex);
  });

  updateService(options[0], 0);
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
