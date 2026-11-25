const servicioDatos = new ServicioDatos("http://localhost:3000");

let listaConceptos = [];
let tramiteActual = null;
let idConceptoSeleccionado = null;
let tramiteBloqueado = false;

const zonaConceptos = document.getElementById("zona-conceptos");
const textoFechaTramite = document.getElementById("fecha-tramite");
const listaPagosLateral = document.getElementById("lista-pagos-lateral");
const textoSinPagos = document.getElementById("texto-sin-pagos");
const botonFinalizar = document.getElementById("boton-finalizar");
const cajaResumen = document.getElementById("caja-resumen");
const dialogoFin = document.getElementById("dialogo-fin");
const btnNuevoTramite = document.getElementById("btn-nuevo-tramite");
const btnCerrarApp = document.getElementById("btn-cerrar-app");

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
  tramiteBloqueado = false;
  idConceptoSeleccionado = null;
  botonFinalizar.disabled = false;
  cajaResumen.style.display = "none";
  cajaResumen.innerHTML = "";
  textoFechaTramite.textContent = `Trámite activo: ${tramiteActual.fecha}`;

  resaltarConcepto(null, false);
  pintarPanelLateral();
}

function resaltarConcepto(idConcepto, activo) {
  const tarjetas = document.querySelectorAll(".tarjeta");
  tarjetas.forEach(tarjeta => {
    const esMismo = tarjeta.getAttribute("data-id") === idConcepto;
    if (idConcepto && esMismo && activo) {
      tarjeta.classList.add("resaltada");
    } else if (!idConcepto || esMismo) {
      tarjeta.classList.remove("resaltada");
    }
  });

  const filasLateral = document.querySelectorAll("#lista-pagos-lateral li");
  filasLateral.forEach(fila => {
    const esMismo = fila.getAttribute("data-id") === idConcepto;
    if (idConcepto && esMismo && activo) {
      fila.classList.add("resaltado");
    } else if (!idConcepto || esMismo) {
      fila.classList.remove("resaltado");
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
  if (tramiteBloqueado) return;

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

function pintarResumenFinal() {
  const pagosOrdenados = tramiteActual.obtenerPagosOrdenados();
  const totalRedondeado = tramiteActual.obtenerTotalRedondeadoAbajo();
  const mediaPorConcepto = tramiteActual.obtenerMediaPorConcepto();

  cajaResumen.innerHTML = "";

  const titulo = document.createElement("h2");
  titulo.textContent = `Resumen del trámite (${tramiteActual.fecha})`;
  cajaResumen.appendChild(titulo);

  const lista = document.createElement("ul");

  pagosOrdenados.forEach(pago => {
    const concepto = listaConceptos.find(c => c.id === pago.idConcepto);
    const nombreConcepto = concepto ? concepto.nombre : `Concepto ${pago.idConcepto}`;

    const li = document.createElement("li");
    li.textContent = `${nombreConcepto} — Pagos: ${pago.numPagos} | Total: ${pago.importeTotal.toFixed(2)} € | Aporte medio: ${pago.aporteMedio.toFixed(2)} €`;
    lista.appendChild(li);
  });

  cajaResumen.appendChild(lista);

  const pTotal = document.createElement("p");
  pTotal.innerHTML = `<strong>Gasto total (redondeado abajo):</strong> ${totalRedondeado} €`;
  cajaResumen.appendChild(pTotal);

  const pMedia = document.createElement("p");
  pMedia.innerHTML = `<strong>Gasto medio por concepto:</strong> ${mediaPorConcepto.toFixed(2)} €`;
  cajaResumen.appendChild(pMedia);

  const pAvisoGuardado = document.createElement("p");
  pAvisoGuardado.id = "estado-guardado";
  pAvisoGuardado.textContent = "Guardando registro en el servidor en 10 segundos...";
  cajaResumen.appendChild(pAvisoGuardado);

  cajaResumen.style.display = "block";
}

function finalizarTramite() {
  if (tramiteBloqueado) return;

  if (!tramiteActual || tramiteActual.pagos.length === 0) {
    alert("Debes registrar al menos un pago antes de finalizar el trámite.");
    return;
  }

  tramiteBloqueado = true;
  botonFinalizar.disabled = true;

  pintarResumenFinal();

  setTimeout(async () => {
    try {
      await servicioDatos.guardarRegistro(tramiteActual);
      const estadoGuardado = document.getElementById("estado-guardado");
      if (estadoGuardado) {
        estadoGuardado.textContent = "Registro guardado correctamente en ecoDomestica.json.";
      }
      dialogoFin.showModal();
    } catch (error) {
      console.error("Error al guardar el registro en json-server:", error);
      alert("No se pudo guardar el registro en json-server. Comprueba que esté activo.");
      tramiteBloqueado = false;
      botonFinalizar.disabled = false;
    }
  }, 10000);
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
      if (!tramiteBloqueado) resaltarConcepto(concepto.id, true);
    });

    tarjeta.addEventListener("mouseleave", () => {
      if (!tramiteBloqueado && idConceptoSeleccionado !== concepto.id) {
        resaltarConcepto(concepto.id, false);
      }
    });

    tarjeta.appendChild(img);
    tarjeta.appendChild(nombreDiv);
    tarjeta.appendChild(input);
    zonaConceptos.appendChild(tarjeta);
  });
}

botonFinalizar.addEventListener("click", finalizarTramite);

btnNuevoTramite.addEventListener("click", () => {
  dialogoFin.close();
  solicitarFechaTramite();
});

btnCerrarApp.addEventListener("click", () => {
  dialogoFin.close();
  textoFechaTramite.textContent = "Aplicación finalizada. Puedes cerrar esta pestaña.";
  window.close();
});

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