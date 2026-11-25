# Práctica: Economía Doméstica (Versión 2)
**Centro:** Colegio Calasanz Salamanca (Centro Privado Concertado)  
**Dirección:** Paseo de Canalejas, 139-159, 37001 Salamanca  
**Contacto:** Tel.: 923 26 79 61 | Fax: 923 27 04 54 | [www.calasanzsalamanca.es](https://www.calasanzsalamanca.es)

---

## Recomendaciones y Criterios Generales de Evaluación

1. **Continuidad:** Tienes que partir de la primera versión de la práctica *"Economía Doméstica"*. No se evaluarán prácticas que se hayan empezado de cero, ni que se hayan cambiado de repositorio. El objetivo es realizar los cambios necesarios para cumplir con los nuevos requisitos detallados en este enunciado.
2. **Revisión previa:** Lee con detenimiento este enunciado, muchas de las instrucciones que contiene ya se han implementado en la versión anterior.
3. **Diseño:** El diseño de la página seguirá siendo lo más sencillo posible, ya que el objetivo de esta práctica no es tanto la apariencia de la página como la parte dinámica de la misma.
4. **Arquitectura y código:** Organiza el código de la manera más legible posible. Utiliza funciones, programación funcional, arrays, POO, objetos nativos, etc.
5. **Persistencia:** Los conceptos, y los pagos que se hacen de ellos, deberán almacenarse en un fichero JSON que será accesible utilizando AJAX. Tendrás que usar, para poder manipularlos después con JavaScript, arrays de objetos.
6. **Entrega:** En esta versión la entrega consistirá en el texto `"ENTREGADO"`, y se evaluará el contenido del repositorio indicado para la versión anterior. Debes ir haciendo uso del control de versiones y no subir todo el último día.
7. **Etiquetado (Tags):** Una vez terminado el desarrollo, deberás crear una etiqueta llamada `v2.0_tuNombre`. Si necesitaras generar etiqueta de nuevo, ve incrementando el número de versión, por ejemplo, `v2.1_tuNombre`. La profesora evaluará la última etiqueta generada antes de la fecha tope de entrega.
8. **Calificación:**
   * **a. Bloques funcionales de la rúbrica:**
     * **i.** Carga inicial de conceptos e inicio de trámite solicitando mes y año.
     * **ii.** Registro de pagos por concepto validando importes mayores que `0` (con aviso en caso contrario).
     * **iii.** Panel lateral dinámico con historial de pagos y sombreado/desombreado acumulado por concepto.
     * **iv.** Resumen final con fecha/hora, ordenación por número de pagos, cálculos de medias y redondeos solicitados.
     * **v.** Ventana emergente al finalizar con el detalle de los conceptos pagados.
     * **vi.** Limpieza automática del DOM y variables internas a los 10 segundos manteniendo la persistencia del trámite.
   * **b.** No crear la etiqueta de entrega supondrá **-0,5 puntos** a restar a la calificación obtenida en la práctica.
   * **c.** No hacer un uso recomendable del control de versiones supondrá **-0,5 puntos** en la nota final. Con uso recomendable se refiere a hacer subidas periódicas, que los comentarios de los commits tengan el formato adecuado (*Conventional Commits*) y den información adecuada, que no se elimine el repositorio para crear otro nuevo a la mitad del desarrollo, etc.
   * **d.** No organizar los distintos documentos según el tipo restará **-0,5 puntos** a la nota final.
   * **e.** No se evaluarán proyectos en repositorios diferentes al de la primera versión, por lo que un cambio de repositorio supondrá un **0** en la evaluación de la práctica.

---

## Enunciado

1. **Formato JSON:** El fichero JSON tendrá el formato que se puede ver en el JSON proporcionado con este enunciado. Cada alumno puede meter sus conceptos propios, no hace falta que mantenga los incluidos en el JSON proporcionado. Todos los conceptos deberán estar registrados como se indica en el mismo, mientras que el formato de almacenamiento de los pagos realizados podrá variar siempre y cuando se mantenga la referencia a los conceptos.
2. **Carga dinámica inicial:** Al cargar la página, los datos de cada concepto (nombre y URL de la imagen) se cargarán dinámicamente mediante una petición a `json-server`.
3. **Inicio de trámite:** Cuando se empiece un nuevo trámite, se pedirá al usuario que indique mes y año. Este dato se almacenará para cada trámite, no para cada pago realizado.
4. **Estructura de objetos:** Los datos de cada concepto, los pagos realizados y la cantidad del pago han de almacenarse en objetos tal y como se ve en el JSON proporcionado:
   * **Conceptos:** Se almacenará el `nombre` (cadena), si se considera `imprescindible` o no (booleano) y dentro de cuál de las siguientes categorías puede clasificarse:
     * Cultura (`CULT`)
     * Alimentación (`ALI`)
     * Deporte (`DEP`)
     * Ocio (`OC`)
     * Servicios básicos (`S_BAS`)
   * **Trámites:** Se almacenará mes y año y, para cada concepto dentro de este: el concepto (a través de su `id`), el número de pagos (valor numérico) y el importe total (valor numérico). Además, se podrá almacenar cualquier dato que se considere necesario para el correcto funcionamiento de la aplicación siempre y cuando no contravenga lo indicado en este enunciado.
5. **Comportamiento de la página:**
   * **5.1. Control de importe y clic:** Con cada imagen se incluirá un control para que el usuario indique el importe del pago que va a realizar. Cuando se pulse la imagen, se añadirá esa cantidad al total de pagos realizados de ese concepto. El registro del pago solo se llevará a cabo en caso de que la cantidad sea mayor a `0` y, en caso contrario, se informará al usuario de que no puede registrarse un pago sin importe.
   * **5.2. Panel lateral derecho:** La página tendrá en su lateral derecho una sección, bien diferenciada desde el principio, que ocupará todo el alto de la página (la página no debe tener scroll) y un 25% del ancho de la misma. En esta zona:
     * **5.2.1.** Cada vez que el usuario haga un pago se mostrará la información del dinero gastado mostrando el concepto y cantidad.
     * **5.2.2.** Cada vez que se añada un importe, en esta zona se resaltará en algún color todas las veces que se haya hecho un pago de ese concepto. A la vez, se quitará el sombreado que tenga el concepto añadido justo antes del que se esté incluyendo.
     * **5.2.3.** La información de esta zona solo se eliminará cuando finaliza un trámite de registro de pagos, tal y como se explica en el punto 7 *(y punto 8)*.
   * **5.3. Ejemplo de funcionamiento de la sección detallada en el punto 5.2:**
     * **5.3.1.** Se incluye un pago de 50€ en concepto de luz. Se incluirá una línea con `"Luz 50€"` y con el fondo (solo de la línea, no de toda la zona) en algún color.
     * **5.3.2.** Se hace otro pago, de 35€, en concepto de extraescolares: Se incluirá una nueva línea (debajo de la anterior) con `"Extraescolares 35€"` y con el fondo en el color elegido (el color que remarca siempre es el mismo). En este momento, la línea de `"Luz 50€"` dejará de estar resaltada.
     * **5.3.3.** Se registra otro pago de luz de 25€: Se incluirá una tercera línea, esta vez con `"Luz 25€"`. En ese momento se sombrearán las dos líneas en las que aparece el concepto Luz y se quitará el sombreado del concepto Extraescolares.
6. **Resumen al finalizar el trámite:** Al final de la página habrá un apartado, vacío pero visible, y un botón para finalizar el trámite y ver un resumen de los gastos realizados (solo aparecerán los conceptos de los que se haya registrado, al menos, un pago):
   * **6.1.** Al pulsar dicho botón, se mostrará en el apartado la lista de gastos realizados.
   * **6.2.** La primera línea de la lista será la fecha y hora de la finalización del trámite.
   * **6.3.** Cada concepto aparecerá solo una vez con el número de pagos del mismo que se han realizado, el aporte medio y el aporte total.
   * **6.4.** La lista aparecerá ordenada por número de pagos, de más a menos.
   * **6.5.** Cada concepto y el número de pagos aparecerán en una línea diferente.
   * **6.6.** Tras el detalle de todos los gastos, aparecerá el montante final. Esta cantidad se mostrará sin decimales, redondeada hacia abajo.
   * **6.7.** Como última línea se mostrará el precio medio por concepto incluido, con tres decimales.
   * **6.8.** El aspecto final de la información será algo similar a:
     ```text
     Fecha: DD/MM/AAAA HH:MM
     Luz --- 2 pagos 15,78€ 31,56€
     Comunidad 2 pagos 110€---- 220€
     Agua 1 pago 16,78€---- 16,78€
     Gasto final: xx €
     Gasto medio: xx,xxx €/concepto
     ```
7. **Ventana emergente de detalle:** Además, al finalizar el trámite, se mostrará una ventana emergente mostrando, por cada concepto del que se haya hecho al menos un pago, la información del mismo (sacada del JSON):
   * **7.1.** *"La Luz es un gasto imprescindible de categoría Servicios Básicos."*
   * **7.2.** *"El gimnasio es un gasto prescindible de categoría Deportes."*
   * **7.3.** etc.
8. **Cierre y limpieza automática:** 10 segundos después de la finalización del trámite se limpiará la zona lateral de información, la sección donde se muestra el resumen, y variables y arrays internos utilizados. También se cerrará la ventana. La información de cada trámite se almacenará en este momento.