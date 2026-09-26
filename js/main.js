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
