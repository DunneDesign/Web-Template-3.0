const initializeSite = () => {
  // Mobile Hamburger Toggle
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");
  const dropdownButtons = document.querySelectorAll(".drop-btn");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      
      // Animate hamburger to 'X' shape
      const spans = hamburger.querySelectorAll("span");
      if (navLinks.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(7px, -7px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });
  }

  // Touch-friendly Mobile Dropdown Handler
  dropdownButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        const content = btn.nextElementSibling;
        if (content) {
          content.classList.toggle("active");
          const arrow = btn.querySelector(".arrow");
          if (arrow) {
            arrow.style.transform = content.classList.contains("active") ? "rotate(180deg)" : "rotate(0deg)";
            arrow.style.display = "inline-block";
            arrow.style.transition = "transform 0.3s ease";
          }
        }
      }
    });
  });

  // Intersection Observer for Scroll Appearance Animations
  const animElements = document.querySelectorAll(".scroll-anim, .scroll-anim-slide-left, .scroll-anim-slide-right");
  const statNumbers = document.querySelectorAll(".stat-counter");

  // Fallback if IntersectionObserver is not supported or fails
  if (!window.IntersectionObserver) {
    animElements.forEach(el => el.classList.add("animate-visible"));
    statNumbers.forEach(num => {
      const targetVal = num.getAttribute("data-target");
      if (targetVal) num.textContent = targetVal;
    });
  } else {
    const appearanceObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-visible");
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    animElements.forEach(el => {
      appearanceObserver.observe(el);
    });

    const countUp = (targetEl) => {
      const targetVal = parseInt(targetEl.getAttribute("data-target"), 10);
      let count = 0;
      const duration = 2000; // 2 seconds animation
      const increment = Math.ceil(targetVal / (duration / 16)); // ~60fps

      const timer = setInterval(() => {
        count += increment;
        if (count >= targetVal) {
          targetEl.textContent = targetVal;
          clearInterval(timer);
        } else {
          targetEl.textContent = count;
        }
      }, 16);
    };

    const statObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    statNumbers.forEach(num => {
      statObserver.observe(num);
    });
  }

  // Accordion (FAQ Toggle) Logic
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach(question => {
    question.addEventListener("click", () => {
      const parent = question.parentElement;
      const isActive = parent.classList.contains("active");
      
      // Close all other active items
      document.querySelectorAll(".faq-item").forEach(item => {
        item.classList.remove("active");
      });

      if (!isActive) {
        parent.classList.add("active");
      }
    });
  });
};

// Check readyState to ensure script executes even if DOMContentLoaded has already fired
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSite);
} else {
  initializeSite();
}

