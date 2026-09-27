const CLINICS = [
  {
    name: "Cirec",
    address: "Calle 35 Nº 828",
    city: "La Plata, Buenos Aires",
    mapsUrl: "https://www.google.com/maps/place/Cirec+Kinesiolog%C3%ADa+y+fisioterapia/@-34.9073525,-57.9717977,17z/data=!3m1!4b1!4m6!3m5!1s0x95a2e795108e2fc3:0xe78c50b308df24b8!8m2!3d-34.9073525!4d-57.969977!16s%2Fg%2F1q62fnwd6?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D",
  },
];

function renderClinics() {
  const list = document.getElementById("clinic-list");
  if (!list) return;

  list.innerHTML = CLINICS.map((clinic) => `
    <article class="clinic-card">
      <h3>${clinic.name}</h3>
      <p>${clinic.address}<br>${clinic.city}</p>
      <a class="button button-small" href="${clinic.mapsUrl}" target="_blank" rel="noopener noreferrer">Cómo llegar</a>
    </article>
  `).join("");
}

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
  })
);

renderClinics();

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const CONSENT_KEY = "sabrina_privacy_consent_v1";
const META_PIXEL_ID = "1598224428515477";
let metaPixelInitialized = false;
let metaPageViewTracked = false;
let mapViewObserver = null;
let mapViewTracked = false;

function readConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function storeConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Si el navegador bloquea el almacenamiento, la elección dura esta visita.
  }
}

function loadMap() {
  const iframe = document.querySelector("[data-consent-src]");
  if (!iframe || iframe.hasAttribute("src")) return;

  iframe.src = iframe.dataset.consentSrc;
  iframe.hidden = false;
  document.querySelector("[data-map-consent]")?.setAttribute("hidden", "");
}

function unloadMap() {
  const iframe = document.querySelector("[data-consent-src]");
  if (!iframe) return;

  iframe.removeAttribute("src");
  iframe.hidden = true;
  document.querySelector("[data-map-consent]")?.removeAttribute("hidden");
}

function createMetaPixelQueue() {
  if (window.fbq) return;

  const fbq = window.fbq = function () {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, arguments);
    } else {
      fbq.queue.push(arguments);
    }
  };

  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
}

function loadMetaPixel() {
  createMetaPixelQueue();

  if (!document.getElementById("meta-pixel-script")) {
    const script = document.createElement("script");
    script.id = "meta-pixel-script";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  if (!metaPixelInitialized) {
    window.fbq("init", META_PIXEL_ID);
    metaPixelInitialized = true;
  }

  window.fbq("consent", "grant");

  if (!metaPageViewTracked) {
    window.fbq("track", "PageView");
    metaPageViewTracked = true;
  }
}

function revokeMetaPixelConsent() {
  if (typeof window.fbq === "function") {
    window.fbq("consent", "revoke");
  }
}

function startMapViewTracking() {
  const map = document.querySelector(".map-placeholder");
  if (!map || mapViewTracked || mapViewObserver || !("IntersectionObserver" in window)) return;

  mapViewObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;

    trackMetaEvent("trackCustom", "MapView", getCtaParameters(map, "map"));
    mapViewTracked = true;
    mapViewObserver.disconnect();
    mapViewObserver = null;
  }, { threshold: 0.35 });

  mapViewObserver.observe(map);
}

function stopMapViewTracking() {
  mapViewObserver?.disconnect();
  mapViewObserver = null;
}

function getCtaLocation(link) {
  if (link.classList.contains("whatsapp-float")) return "floating_whatsapp";
  if (link.closest(".site-header")) return "header";
  if (link.closest(".hero")) return "hero";
  if (link.closest(".service-card")) return "services";
  if (link.closest("#consultorio")) return "consultorio";
  if (link.closest(".final-cta")) return "final_cta";
  if (link.closest(".site-footer")) return "footer";
  return "page";
}

function getServiceName(link) {
  const serviceTitle = link.closest(".service-card")?.querySelector("h3")?.textContent;
  if (!serviceTitle) return "general";

  return serviceTitle
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function getCtaParameters(link, leadType) {
  return {
    lead_type: leadType,
    cta_location: getCtaLocation(link),
    service_name: getServiceName(link),
    cta_text: (link.textContent || link.getAttribute("aria-label") || "").trim().slice(0, 100),
  };
}

function trackMetaEvent(eventType, eventName, parameters) {
  if (readConsent() !== "accepted" || typeof window.fbq !== "function") return;
  window.fbq(eventType, eventName, parameters);
}

function registerMetaCtaEvents() {
  document.querySelectorAll('a[href*="nutreando.com"]').forEach((link) => {
    link.addEventListener("click", () => {
      const parameters = getCtaParameters(link, "reservation");
      trackMetaEvent("track", "Lead", parameters);
      trackMetaEvent("trackCustom", "ReservationClick", parameters);
    });
  });

  document.querySelectorAll('a[href^="https://wa.me/"]:not([data-no-meta-event])').forEach((link) => {
    link.addEventListener("click", () => {
      const parameters = getCtaParameters(link, "whatsapp");
      trackMetaEvent("track", "Lead", parameters);
      trackMetaEvent("track", "Contact", parameters);
    });
  });

  document.querySelectorAll('a[href*="google.com/maps"]').forEach((link) => {
    link.addEventListener("click", () => {
      trackMetaEvent("track", "FindLocation", getCtaParameters(link, "location"));
    });
  });

}

function createConsentBanner() {
  const banner = document.createElement("section");
  banner.className = "consent-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-modal", "false");
  banner.setAttribute("aria-labelledby", "consent-title");
  banner.hidden = true;
  banner.innerHTML = `
    <div class="consent-copy">
      <strong id="consent-title">Tu privacidad importa</strong>
      <p>Usamos almacenamiento técnico para recordar tu elección. Con tu permiso también podemos cargar Google Maps y Meta Pixel para medir visitas e interacciones. <a href="privacidad.html">Ver política de privacidad</a>.</p>
    </div>
    <div class="consent-actions">
      <button class="button button-secondary" type="button" data-consent-reject>Rechazar opcionales</button>
      <button class="button" type="button" data-consent-accept>Aceptar</button>
    </div>`;

  document.body.appendChild(banner);
  return banner;
}

const consentBanner = createConsentBanner();

function applyConsent(value) {
  if (value === "accepted") {
    loadMap();
    loadMetaPixel();
    startMapViewTracking();
  }
  if (value === "rejected") {
    unloadMap();
    revokeMetaPixelConsent();
    stopMapViewTracking();
  }
  window.sabrinaConsent = value;
  consentBanner.hidden = true;
  window.dispatchEvent(new CustomEvent("sabrina:consent-change", { detail: value }));
}

function chooseConsent(value) {
  storeConsent(value);
  applyConsent(value);
}

consentBanner.querySelector("[data-consent-accept]")?.addEventListener("click", () => chooseConsent("accepted"));
consentBanner.querySelector("[data-consent-reject]")?.addEventListener("click", () => chooseConsent("rejected"));

document.querySelectorAll("[data-privacy-settings]").forEach((button) => {
  button.addEventListener("click", () => {
    consentBanner.hidden = false;
    consentBanner.querySelector("[data-consent-accept]")?.focus();
  });
});

document.querySelector("[data-load-map]")?.addEventListener("click", loadMap);
registerMetaCtaEvents();

const savedConsent = readConsent();
if (savedConsent === "accepted" || savedConsent === "rejected") {
  applyConsent(savedConsent);
} else {
  consentBanner.hidden = false;
}
