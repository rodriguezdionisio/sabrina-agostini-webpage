const SITE_CONFIG = {
  calendlyUrl: "https://nutreando.com/sabrina-agostini/reservar?step=service",
  whatsappNumber: "5492804634763",
  whatsappMessage: "Hola, quería consultar por los turnos de nutrición.",
  instagramUrl: "https://instagram.com/lic.agostini.nutricion",
  linkedinUrl: "https://linkedin.com/in/lic-agostini-nutricion",
  clinics: [
    {
      name: "Ondas de Choque",
      address: "Av. 13 Nº 493",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Av.+13+493,+La+Plata,+Buenos+Aires",
    },
    {
      name: "Cirec",
      address: "Calle 35 Nº 828",
      mapsUrl: "https://maps.app.goo.gl/kwDjUVU7ErWvgsZ29",
    },
  ],
};

function link(type) {
  if (type === "whatsapp") {
    return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`;
  }
  return ({ calendly: SITE_CONFIG.calendlyUrl, instagram: SITE_CONFIG.instagramUrl, linkedin: SITE_CONFIG.linkedinUrl }[type] || "#");
}

document.querySelectorAll("[data-link]").forEach((a) => {
  a.href = link(a.dataset.link);
  if (["instagram", "linkedin"].includes(a.dataset.link)) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
});

document.querySelectorAll(".brand-mark").forEach((mark) => {
  const logo = document.createElement("img");
  logo.src = "assets/images/logo-gris.jpeg";
  logo.alt = "Sabrina Agostini — Lic. en Nutrición";
  logo.width = 38;
  logo.height = 38;
  logo.style.width = "38px";
  logo.style.height = "38px";
  logo.style.objectFit = "contain";
  logo.style.borderRadius = "50%";
  mark.replaceChildren(logo);
});

const photoSlots = document.querySelectorAll(".photo-placeholder");
const photoConfig = [
  ["assets/images/sabrina-001.jpeg", "Sabrina Agostini — Lic. en Nutrición"],
  ["assets/images/sabrina-002.jpeg", "Sabrina Agostini"],
];
photoSlots.forEach((slot, index) => {
  const [src, alt] = photoConfig[index] || photoConfig[0];
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.loading = index === 0 ? "eager" : "lazy";
  img.decoding = "async";
  img.className = "real-photo";
  slot.replaceChildren(img);
  slot.classList.add("has-real-photo");
});

const instagramPosts = ["assets/images/Instagram-post-fractura-error.jpeg", "assets/images/Instagram-post-hidratacion-gym.jpeg", "assets/images/Instagram-post-multivitaminico.jpeg"];
document.querySelectorAll(".instagram-grid > div").forEach((slot, index) => {
  const img = document.createElement("img");
  img.src = instagramPosts[index];
  img.alt = `Contenido de Sabrina Agostini sobre nutrición — publicación ${index + 1}`;
  img.loading = "lazy";
  img.decoding = "async";
  img.className = "instagram-photo";
  slot.replaceChildren(img);
});

const whatsappFloat = document.querySelector(".whatsapp-float");
if (whatsappFloat) {
  const icon = document.createElement("img");
  icon.src = "assets/images/logo-whatsapp.png";
  icon.alt = "WhatsApp";
    whatsappFloat.replaceChildren(icon);
}

const dynamicStyles = document.createElement("style");
dynamicStyles.textContent = `
  .photo-placeholder.has-real-photo { padding: 0; overflow: hidden; background: var(--sand); }
  .real-photo { width: 100%; height: 100%; min-height: inherit; display: block; object-fit: cover; }
  .instagram-grid div { overflow: visible; }
  .instagram-photo { width: 100%; height: auto; display: block; object-fit: initial; transition: transform .3s ease; background: transparent; }
  .instagram-grid div:hover .instagram-photo { transform: scale(1.03); }
  .whatsapp-float { background: var(--sage); color: #fff; display: grid; place-items: center; box-shadow: 0 12px 28px rgba(40,48,41,.18); }
  .clinic-list { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; margin-top: 28px; }
  .clinic-card { padding: 22px; background: var(--cream); border: 1px solid rgba(40,48,41,.08); }
  .clinic-card h3 { font-family: var(--serif); font-size: 23px; font-weight: 500; margin-bottom: 8px; }
  .clinic-card p { color: var(--muted); font-size: 13px; margin: 0 0 16px; }
  .clinic-card .button { min-height: 38px; padding-inline: 15px; font-size: 11px; }
  @media (max-width: 760px) { .clinic-list { grid-template-columns: 1fr; } }
`;
document.head.appendChild(dynamicStyles);

const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".main-menu");
toggle?.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".main-menu a").forEach((a) => a.addEventListener("click", () => {
  menu.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();
