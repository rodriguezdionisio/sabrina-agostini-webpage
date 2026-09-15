const SITE_CONFIG = {
  calendlyUrl: "https://calendly.com/REEMPLAZAR",
  whatsappNumber: "5492804634763",
  whatsappMessage: "Hola, quería consultar por los turnos de nutrición.",
  instagramUrl: "https://instagram.com/lic.agostini.nutricion",
  linkedinUrl: "https://linkedin.com/in/lic-agostini-nutricion",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Av.+38+920,+La+Plata,+Buenos+Aires",
};

function link(type) {
  if (type === "whatsapp") {
    return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
      SITE_CONFIG.whatsappMessage,
    )}`;
  }

  return (
    {
      calendly: SITE_CONFIG.calendlyUrl,
      instagram: SITE_CONFIG.instagramUrl,
      linkedin: SITE_CONFIG.linkedinUrl,
      maps: SITE_CONFIG.mapsUrl,
    }[type] || "#"
  );
}

document.querySelectorAll("[data-link]").forEach((a) => {
  a.href = link(a.dataset.link);

  if (["instagram", "linkedin"].includes(a.dataset.link)) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
});

const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".main-menu");

toggle?.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".main-menu a").forEach((a) =>
  a.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  }),
);

document.getElementById("year").textContent = new Date().getFullYear();
