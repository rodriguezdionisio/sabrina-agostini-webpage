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
      <p>Usamos almacenamiento técnico para recordar tu elección. Con tu permiso también podemos cargar servicios externos, como Google Maps, y futuras herramientas de medición. <a href="privacidad.html">Ver política de privacidad</a>.</p>
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
  if (value === "accepted") loadMap();
  if (value === "rejected") unloadMap();
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

const savedConsent = readConsent();
if (savedConsent === "accepted" || savedConsent === "rejected") {
  applyConsent(savedConsent);
} else {
  consentBanner.hidden = false;
}
