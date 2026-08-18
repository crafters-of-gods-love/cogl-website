
const SITE_CONFIG = {
  javaIp: "craftersofgodslove.mcserver.at",
  bedrockIp: "38.46.216.220",
  bedrockPort: "25777",
  discordUrl: "https://discord.com/invite/UB5mFSA2p7",
  versionText: "1.21.10"
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

$("#java-ip").textContent = SITE_CONFIG.javaIp;
$("#bedrock-ip").textContent = SITE_CONFIG.bedrockIp;
$("#bedrock-port").textContent = SITE_CONFIG.bedrockPort;
$("#server-version").textContent = SITE_CONFIG.versionText;
$("#year").textContent = new Date().getFullYear();

$$("[data-link='discord']").forEach(link => {
  link.href = SITE_CONFIG.discordUrl;
  link.target = "_blank";
  link.rel = "noopener";
});

const toast = $(".toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

$$("[data-copy]").forEach(button => {
  button.addEventListener("click", async () => {
    const type = button.dataset.copy;
    const value = type === "java"
      ? SITE_CONFIG.javaIp
      : type === "bedrock"
        ? `${SITE_CONFIG.bedrockIp}:${SITE_CONFIG.bedrockPort}`
        : type === "discord"
          ? SITE_CONFIG.discordUrl
          : SITE_CONFIG.versionText;
    try {
      await navigator.clipboard.writeText(value);
      const label = type === "java" ? "Java IP" : type === "bedrock" ? "Bedrock address" : type === "discord" ? "Discord link" : "Version";
      showToast(`${label} copied!`);
    } catch {
      showToast("Copying was blocked by your browser.");
    }
  });
});

const menuToggle = $(".menu-toggle");
const nav = $(".main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
$$(".main-nav a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const header = $(".site-header");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 30));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach(el => revealObserver.observe(el));

const sections = $$("main section[id]");
const navLinks = $$(".main-nav a");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(section => sectionObserver.observe(section));

async function loadServerStatus() {
  const label = $("#server-live-label");
  try {
    const response = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(SITE_CONFIG.javaIp)}`);
    if (!response.ok) throw new Error("Status request failed");
    const data = await response.json();
    if (data.online) {
      label.closest(".status-heading")?.classList.remove("is-offline", "is-unknown");
      label.closest(".status-heading")?.classList.add("is-online");
      label.textContent = "LIVE";
      label.style.color = "var(--green)";
      $("#player-count").textContent = data.players?.online ?? "0";
      $("#max-players").textContent = data.players?.max ?? "--";
    } else {
      label.closest(".status-heading")?.classList.remove("is-online", "is-unknown");
      label.closest(".status-heading")?.classList.add("is-offline");
      label.textContent = "OFFLINE";
      label.style.color = "#ff5b5b";
      $("#player-count").textContent = "0";
      $("#max-players").textContent = data.players?.max ?? "--";
    }
  } catch (error) {
    label.closest(".status-heading")?.classList.remove("is-online", "is-offline");
    label.closest(".status-heading")?.classList.add("is-unknown");
    label.textContent = "STATUS UNAVAILABLE";
    label.style.color = "#ffbd59";
    $("#player-count").textContent = "--";
    $("#max-players").textContent = "--";
  }
}
loadServerStatus();


// FINAL POLISH ENHANCEMENTS
const navMore = $(".nav-more");
const navMoreButton = $(".nav-more-button");
const navMoreMenuLinks = $$(".nav-more-menu a");

if (navMore && navMoreButton) {
  navMoreButton.addEventListener("click", event => {
    event.stopPropagation();
    const isOpen = navMore.classList.toggle("open");
    navMoreButton.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", event => {
    if (!navMore.contains(event.target)) {
      navMore.classList.remove("open");
      navMoreButton.setAttribute("aria-expanded", "false");
    }
  });

  navMoreMenuLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMore.classList.remove("open");
      navMoreButton.setAttribute("aria-expanded", "false");
    });
  });
}

const backToTop = $(".back-to-top");
window.addEventListener("scroll", () => {
  if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 700);
}, { passive: true });

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Add brief visual feedback to every copy control.
$$("[data-copy]").forEach(button => {
  button.addEventListener("click", () => {
    button.classList.remove("copy-success");
    void button.offsetWidth;
    button.classList.add("copy-success");
  });
});

// Build-gallery lightbox.
const lightbox = $(".build-lightbox");
const lightboxImage = $(".build-lightbox figure img");
const lightboxTitle = $(".build-lightbox figcaption strong");
const lightboxCredit = $(".build-lightbox figcaption span");
const lightboxItems = $$(".lightbox-image");
let lightboxIndex = 0;
let lightboxPreviouslyFocused = null;

function renderLightbox(index) {
  if (!lightboxItems.length) return;
  lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
  const item = lightboxItems[lightboxIndex];
  lightboxImage.src = item.currentSrc || item.src;
  lightboxImage.alt = item.alt;
  lightboxTitle.textContent = item.dataset.lightboxTitle || item.alt;
  lightboxCredit.textContent = item.dataset.lightboxCredit || "";
}

function openLightbox(index) {
  if (!lightbox) return;
  lightboxPreviouslyFocused = document.activeElement;
  renderLightbox(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $(".lightbox-close")?.focus();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lightboxPreviouslyFocused?.focus();
}

lightboxItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
  item.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(index);
    }
  });
});

$(".lightbox-close")?.addEventListener("click", closeLightbox);
$(".lightbox-prev")?.addEventListener("click", () => renderLightbox(lightboxIndex - 1));
$(".lightbox-next")?.addEventListener("click", () => renderLightbox(lightboxIndex + 1));

lightbox?.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", event => {
  if (!lightbox?.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") renderLightbox(lightboxIndex - 1);
  if (event.key === "ArrowRight") renderLightbox(lightboxIndex + 1);
});

// Keep active state accurate for dropdown links and More button.
const allTrackedLinks = [...$$(".main-nav > a"), ...navMoreMenuLinks];
const moreSectionIds = new Set(navMoreMenuLinks.map(link => link.getAttribute("href")));

const polishSectionObserver = new IntersectionObserver(entries => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  const href = `#${visible.target.id}`;

  allTrackedLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === href);
  });

  navMoreButton?.classList.toggle("active", moreSectionIds.has(href));
}, { rootMargin: "-28% 0px -62% 0px", threshold: [0.05, 0.2, 0.45] });

$$("main section[id]").forEach(section => polishSectionObserver.observe(section));
