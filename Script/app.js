const servicioDatos = new ServicioDatos("http://localhost:3000");

let listaConceptos = [];
let tramiteActual = null;
let idConceptoSeleccionado = null;

const zonaConceptos = document.getElementById("zona-conceptos");
const textoFechaTramite = document.getElementById("fecha-tramite");
const listaPagosLateral = document.getElementById("lista-pagos-lateral");
const textoSinPagos = document.getElementById("texto-sin-pagos");

function obtenerFechaActualFormateada() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const anio = hoy.getFullYear();
  return `${mes}/${anio}`;
}

function solicitarFechaTramite() {
  const patronFecha = /^(0[1-9]|1[0-2])\/\d{4}$/;
  let fecha = "";

  while (!patronFecha.test(fecha)) {
    fecha = prompt("Nuevo trámite: introduce mes y año (MM/AAAA):");
    if (fecha === null) {
      fecha = obtenerFechaActualFormateada();
      break;
    }
    fecha = fecha.trim();
  }

  tramiteActual = new Tramite(fecha);
  textoFechaTramite.textContent = `Trámite activo: ${tramiteActual.fecha}`;
}

function resaltarConcepto(idConcepto, activo) {
  const tarjetas = document.querySelectorAll(".tarjeta");
  tarjetas.forEach(tarjeta => {
    if (tarjeta.getAttribute("data-id") === idConcepto) {
      if (activo) {
        tarjeta.classList.add("resaltada");
      } else {
        tarjeta.classList.remove("resaltada");
      }
    }
  });

  const filasLateral = document.querySelectorAll("#lista-pagos-lateral li");
  filasLateral.forEach(fila => {
    if (fila.getAttribute("data-id") === idConcepto) {
      if (activo) {
        fila.classList.add("resaltado");
      } else {
        fila.classList.remove("resaltado");
      }
    }
  });
}

function pintarPanelLateral() {
  listaPagosLateral.innerHTML = "";

  if (!tramiteActual || tramiteActual.movimientos.length === 0) {
    textoSinPagos.style.display = "block";
    return;
  }

  textoSinPagos.style.display = "none";

  tramiteActual.movimientos.forEach(mov => {
    const item = document.createElement("li");
    item.setAttribute("data-id", mov.idConcepto);

    if (mov.idConcepto === idConceptoSeleccionado) {
      item.classList.add("resaltado");
    }

    const spanNombre = document.createElement("span");
    spanNombre.textContent = mov.nombre;

    const spanImporte = document.createElement("span");
    spanImporte.textContent = `${mov.importe.toFixed(2)} €`;

    item.appendChild(spanNombre);
    item.appendChild(spanImporte);
    listaPagosLateral.appendChild(item);
  });
}

function gestionarClicImagen(concepto, tarjeta) {
  const inputImporte = tarjeta.querySelector(".input-importe");
  const valorTexto = inputImporte.value.trim().replace(",", ".");
  const importe = parseFloat(valorTexto);

  if (Number.isNaN(importe) || !Number.isFinite(importe) || importe <= 0) {
    alert(`Introduce un importe numérico válido mayor que 0 para "${concepto.nombre}".`);
    inputImporte.value = "";
    inputImporte.focus();
    return;
  }

  if (idConceptoSeleccionado && idConceptoSeleccionado !== concepto.id) {
    resaltarConcepto(idConceptoSeleccionado, false);
  }
  idConceptoSeleccionado = concepto.id;

  tramiteActual.agregarPago(concepto, importe);
  inputImporte.value = "";

  pintarPanelLateral();
  resaltarConcepto(concepto.id, true);
}

function renderizarConceptos(conceptos) {
  zonaConceptos.innerHTML = "";

  conceptos.forEach(concepto => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    tarjeta.setAttribute("data-id", concepto.id);

    const img = document.createElement("img");
    img.setAttribute("src", concepto.img);
    img.setAttribute("alt", concepto.nombre);

    const nombreDiv = document.createElement("div");
    nombreDiv.className = "nombre-concepto";
    nombreDiv.textContent = concepto.nombre;

    const input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("min", "0.01");
    input.setAttribute("step", "0.01");
    input.setAttribute("placeholder", "Importe (€)");
    input.className = "input-importe";

    img.addEventListener("click", () => gestionarClicImagen(concepto, tarjeta));

    tarjeta.addEventListener("mouseenter", () => {
      resaltarConcepto(concepto.id, true);
    });

    tarjeta.addEventListener("mouseleave", () => {
      if (idConceptoSeleccionado !== concepto.id) {
        resaltarConcepto(concepto.id, false);
      }
    });

    tarjeta.appendChild(img);
    tarjeta.appendChild(nombreDiv);
    tarjeta.appendChild(input);
    zonaConceptos.appendChild(tarjeta);
  });
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