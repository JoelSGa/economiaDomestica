const servicioDatos = new ServicioDatos("http://localhost:3000");

let listaConceptos = [];
let tramiteActual = null;

const zonaConceptos = document.getElementById("zona-conceptos");
const textoFechaTramite = document.getElementById("fecha-tramite");

function renderizarConceptos(conceptos) {
  zonaConceptos.innerHTML = "";

  conceptos.forEach(concepto => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    tarjeta.dataset.id = concepto.id;

    tarjeta.innerHTML = `
      <img src="${concepto.img}" alt="${concepto.nombre}" data-id="${concepto.id}">
      <div class="nombre-concepto">${concepto.nombre}</div>
      <input type="number" class="input-importe" min="0.01" step="0.01" placeholder="Importe (€)">
    `;

    zonaConceptos.appendChild(tarjeta);
  });
}

function solicitarFechaTramite() {
  const patronFecha = /^(0[1-9]|1[0-2])\/\d{4}$/;
  let fecha = "";

  while (!patronFecha.test(fecha)) {
    fecha = prompt("Nuevo trámite: introduce mes y año (MM/AAAA):");
    if (fecha === null) {
      fecha = new Intl.DateTimeFormat("es-ES", { month: "2-digit", year: "numeric" }).format(new Date());
      break;
    }
    fecha = fecha.trim();
  }

  tramiteActual = new Tramite(fecha);
  textoFechaTramite.textContent = `Trámite activo: ${tramiteActual.fecha}`;
}

async function iniciarAplicacion() {
  try {
    listaConceptos = await servicioDatos.obtenerConceptos();
    renderizarConceptos(listaConceptos);
    solicitarFechaTramite();
  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    zonaConceptos.innerHTML = "<p>Error al conectar con json-server. Asegúrate de tenerlo arrancado.</p>";
  }
}

document.addEventListener("DOMContentLoaded", iniciarAplicacion);