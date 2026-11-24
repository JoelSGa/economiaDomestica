class Concepto {
  static NOMBRES_CATEGORIAS = {
    CULT: "Cultura",
    ALI: "Alimentación",
    DEP: "Deportes",
    OC: "Ocio",
    S_BAS: "Servicios Básicos"
  };

  constructor({ id, nombre, img, imprescindible, categoria }) {
    this.id = String(id);
    this.nombre = String(nombre);
    this.img = String(img);
    this.imprescindible = Boolean(imprescindible);
    this.categoria = String(categoria);
  }

  obtenerDescripcion() {
    const tipo = this.imprescindible ? "imprescindible" : "prescindible";
    const nombreCat = Concepto.NOMBRES_CATEGORIAS[this.categoria] || this.categoria;
    return `${this.nombre} es un gasto ${tipo} de categoría ${nombreCat}.`;
  }
}

class PagoConcepto {
  constructor(idConcepto, importeInicial = 0) {
    this.idConcepto = String(idConcepto);
    this.importeTotal = Number(importeInicial);
    this.numPagos = importeInicial > 0 ? 1 : 0;
  }

  sumarPago(importe) {
    this.importeTotal = Number((this.importeTotal + Number(importe)).toFixed(2));
    this.numPagos += 1;
  }

  get aporteMedio() {
    return this.numPagos > 0 ? this.importeTotal / this.numPagos : 0;
  }
}

class Tramite {
  constructor(fecha = "") {
    this.fecha = String(fecha);
    this.pagos = [];
    this.movimientos = [];
  }

  agregarPago(concepto, importe) {
    const cantidad = Number(importe);
    const existente = this.pagos.find(p => p.idConcepto === concepto.id);

    if (existente) {
      existente.sumarPago(cantidad);
    } else {
      this.pagos.push(new PagoConcepto(concepto.id, cantidad));
    }

    this.movimientos.push({
      idConcepto: concepto.id,
      nombre: concepto.nombre,
      importe: cantidad
    });
  }

  obtenerPagosOrdenados() {
    return [...this.pagos].sort((a, b) => b.numPagos - a.numPagos);
  }

  obtenerTotalRedondeadoAbajo() {
    const suma = this.pagos.reduce((acc, p) => acc + p.importeTotal, 0);
    return Math.floor(suma);
  }

  obtenerMediaPorConcepto() {
    if (this.pagos.length === 0) return 0;
    const suma = this.pagos.reduce((acc, p) => acc + p.importeTotal, 0);
    return suma / this.pagos.length;
  }

  exportarParaJSON() {
    return {
      fecha: this.fecha,
      pagos: this.pagos.map(p => ({
        idConcepto: p.idConcepto,
        importeTotal: p.importeTotal,
        numPagos: p.numPagos
      }))
    };
  }
}