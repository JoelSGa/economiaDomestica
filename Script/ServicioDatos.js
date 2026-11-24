class ServicioDatos {
  constructor(urlBase = "http://localhost:3000") {
    this.urlBase = urlBase;
  }

  async obtenerConceptos() {
    const respuesta = await fetch(`${this.urlBase}/conceptos`);
    if (!respuesta.ok) {
      throw new Error(`Error al leer conceptos: ${respuesta.status}`);
    }
    const listaCruda = await respuesta.json();
    return listaCruda.map(item => new Concepto(item));
  }

  async guardarRegistro(tramite) {
    const respuesta = await fetch(`${this.urlBase}/registros`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tramite.exportarParaJSON())
    });
    if (!respuesta.ok) {
      throw new Error(`Error al guardar el registro: ${respuesta.status}`);
    }
    return await respuesta.json();
  }
}