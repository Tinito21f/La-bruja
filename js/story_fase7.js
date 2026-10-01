/*
 * LA BRUJA — PRÓLOGO
 * Fase VII: Ruptura (HORROR_STAGE 3) · Biblia §5 (VII), §15 (el límite), §16 (las voces), §21 (el reloj)
 *
 * Apagón. No es el diferencial: es el generador, en el cobertizo, a quince metros del borde de la
 * luz. Sin luz en el porche, el límite es la puerta. Quién sale depende de estados y del huésped
 * (el portador nunca sale). Cruza, arregla, vuelve, la casa se ilumina. Falso alivio. DOOMED sin
 * aviso: quien cruzó vuelve marcado y su reloj arranca. Las voces empiezan a usar la voz de un
 * amigo. Y al final, el marcado sale. Primera sangre: la mano en el arranque.
 *
 * Se consume de la VI: heridas (vi_herido), decision_irse, imposible_quien, puerta_cerrada_llave,
 * mano_marcos (atizador), mano_alex (sartén), llave_inglesa, alex_cruzo / marcos_cruzo.
 * Se deja para la VIII: generador_quien, condena_* (relojes), desaparecido, oyo_voz_irene,
 * animal_abierto, herida_sangra de quien arrancó, faros_vistos / golpes_devueltos del marcado.
 *
 * Presupuesto de anomalías Fase VII: 4 → faros_marcado · golpes_marcado · voz_nombre_irene · luz_apagon_tarde
 */
(() => {
  const R = () => HISTORIA.R;
  const modo = (api, id, m) => m[api.modo(id)] || m.normal;
  const H = (api) => api.bandera("huesped");
  const N = { nora: "Nora", marcos: "Marcos", alex: "Álex", irene: "Irene" };
  const goers = (api) => ({ marcos: ["marcos"], alex: ["alex"], ambos: ["alex", "marcos"] })[api.bandera("generador_quien") || "marcos"] || ["marcos"];
  const arrancador = (api) => goers(api).includes("marcos") ? "marcos" : "alex";
  const marcosPuedeSalir = (api) => H(api) !== "marcos" && !R().herido(api, "marcos", "cojera");
  const alexPuedeSalir = (api) => H(api) !== "alex";
  // El primero que cruzó: el de la V si lo hubo; si no, el del generador
  const primerCruce = (api) => api.bandera("primer_cruce") || (api.bandera("alex_cruzo") ? "alex" : api.bandera("marcos_cruzo") ? "marcos" : arrancador(api));

  Object.assign(HISTORIA.presupuestoAnomalias, { VII: 4 });
  Object.assign(HISTORIA.deriva, { VII: { estres: 0.6, miedo: 0.4 } });

  const saltoPrevio = HISTORIA.prepararSalto;
  HISTORIA.prepararSalto = (api, id) => {
    if (typeof saltoPrevio === "function") saltoPrevio(api, id);
    if (!/^vii\d/.test(id)) return;
    R().saltoBase(api);
    R().fase(api, "VII", 3, 2);
    if (!api.bandera("fase6_completa")) { api.marcar("fase6_completa", true); api.marcar("evento_imposible", true); api.marcar("imposible_quien", "alex"); api.marcar("decision_irse", "amanecer"); api.marcar("puerta_cerrada_llave", true); R().coger(api, "marcos", "atizador"); }
    if (/^vii[3-8]/.test(id) && !api.bandera("generador_quien")) api.marcar("generador_quien", H(api) === "marcos" ? "alex" : "marcos");
    if (/^vii[5-8]/.test(id) && !api.bandera("luz_vuelta")) { api.marcar("luz_vuelta", true); goers(api).forEach((p) => R().cruzar(api, p)); R().herir(api, arrancador(api), "sangra", "generador"); }
  };

  Object.assign(HISTORIA.escenas, {

  // =====================================================================
  // FASE VII — RUPTURA
  // =====================================================================

  vii1_apagon: {
    pov: "nora",
    fondo: "assets/fondos/salon_apagon.jpg",
    ambiente: "interior",
    musica: null,
    lugar: "comedor", hora: "04:40",
    titulo: "La ruptura · El apagón",
    alEntrar: (api) => {
      R().fase(api, "VII", 3, 2);
      R().tick(api);
      api.marcar("apagon", true);
      ["nora", "marcos", "alex", "irene"].forEach((p) => api.presenciar(p, 1.5));
      api.est("marcos", "eje", -6);
    },
    texto: (api) => {
      const h = H(api);
      const q = api.bandera("imposible_quien") || "alex";
      const marcosCojo = R().herido(api, "marcos", "cojera");
      return `
Cuatro sillas juntas. Cuatro personas de cara a la escalera. La lámpara amarilla encima. ${R().lleva(api, "marcos", "atizador") ? "El atizador apoyado en la silla de Marcos." : ""} ${R().lleva(api, "alex", "sarten") ? "La sartén de hierro en el suelo, al lado de Álex." : ""} El cuaderno abierto. Las velas, tus velas, a un dedo del plato.

Cuatro y cuarenta. Nadie habla desde hace seis minutos. Lo sabes porque los has contado.

[golpe]

Y la luz se va.

[corte]

[negro]

No parpadea. No baja. Se va. La lámpara, la de la cocina, la del pasillo de arriba que se veía por el hueco de la escalera. Todas. Y con la luz se va un ruido que no sabías que estaba: el zumbido de la nevera. La casa se queda sin voz.

Negro. El negro de verdad. Solo el rojo de la chimenea, a brasas, y las dos velas, que ahora son lo único.

Irene: No.

Irene: No, no, no.

Álex: Tranquila.

Irene: No me digas tranquila.

Marcos ya tiene el móvil en la mano. La linterna. Un cono blanco que cruza la mesa y encuentra la escalera vacía, la puerta cerrada, el arco de la cocina. Nada. Nadie.

Marcos: El diferencial.

${marcosCojo ? "Se levanta. Se sienta. El pie. Se vuelve a levantar con el atizador de bastón y va al almacén cojeando, con la linterna por delante, y tú vas detrás porque nadie va solo a ningún sitio." : "Se levanta. Va al almacén con la linterna por delante. Y tú vas detrás, porque lo ha dicho él: nadie va solo a ningún sitio."}

El almacén. El frío que sale del escalón de piedra. La caja gris. La tapa. Marcos la levanta.

${api.bandera("cuadro_visto") ? "Marcos: Está subido.\n\nNora: ¿Qué?\n\nMarcos: El diferencial. Está subido. Todo está subido. No es esto." : "Marcos: Bajado.\n\nNora: ¿Qué?\n\nMarcos: El diferencial. Estaba bajado. Lo subo. Y nada. No es esto."}${api.bandera("cuadro_visto") ? "" : "\n\nY la estantería del fondo. Con un hueco de dos dedos entre la madera y la pared. Y la pared, que no es de madera: piedra. Marcos la mira dos segundos más de la cuenta y no dice nada."}

Se queda mirando la caja con la linterna. Y se le ve la cara de cuando una cosa no tiene solución, que es la cara que menos le has visto en cinco meses.

Marcos: Es el generador.

Nora: ¿Qué generador?

Marcos: La casa no tiene red. Tiene un generador de gasolina en el cobertizo. Lo vi al llegar. Se ha parado. O se ha quedado sin gasolina. O...

No dice el «o».

El cobertizo está fuera. A quince metros de la puerta. A quince metros de donde ya no hay luz de porche, porque el porche también se ha apagado.

Volvéis a la mesa. Las velas. Irene con las dos manos en el brazo de Álex. Álex con la cara de la linterna desde abajo, que es como sale mejor y ahora no.

${h === "marcos" ? "Marcos se sienta. Deja la linterna en la mesa apuntando al techo. Y no dice nada más. Marcos, con un problema con solución a quince metros, no dice nada más." : "Marcos deja la linterna en la mesa apuntando al techo. Se le ve calcular. Quince metros, un tirador, tres minutos. Se le ve calcular y se le ve que el cálculo no le gusta."}

${modo(api, "nora", {
  lucido: "~ Un generador que se para a las cuatro y cuarenta, con todos sentados, después de lo de la escalera. Tiene una explicación mecánica. Lo sé. Y sé que voy a tener que verla con mis ojos para creérmela.",
  asustado: "~ La puerta deja de dejarte salir. Lo dijo Álex. Y la casa se ha quedado a oscuras para que salgamos. Para que alguien salga.",
  tenso: "~ Un generador. Ahora un generador. Esta casa tiene la instalación de un barco hundido, lo dijo Marcos, y el barco se está hundiendo.",
  ido: "~ Las velas hacen dos sombras de cada uno. Ocho. Somos ocho en la mesa. Cuatro que se mueven y cuatro que no.",
  perdido: "~ Ha apagado la luz. Ella. Como en la ouija. Para hacer lo que hace cuando no la vemos.",
  normal: "~ Velas. Traje velas. Para la luz. Álex se rio. Que se ría ahora.",
})}

Tienes las velas. Tienes el móvil al treinta por ciento. Tienes a Marcos mirando la puerta con la cara de un cálculo.`;
    },
    opciones: [
      { texto: "Encender las velas que quedan en la mochila. «Para la luz.»", a: "vii2_quien",
        efecto: (api) => { api.marcar("vii_nora", "velas"); api.est("nora", "estres", -3); api.est("irene", "miedo", -3); api.est("nora", "eje", 2); } },
      { texto: "«Nadie sale. Aguantamos con las velas hasta las siete.»", a: "vii2_quien",
        efecto: (api) => { api.marcar("vii_nora", "nadie"); api.rel("irene", "nora", "confianza", 4); api.rel("marcos", "nora", "tension", 3); api.est("nora", "estres", 2); } },
      { texto: "Coger la linterna grande del almacén. La de verdad. Y ponerla en la mesa.", a: "vii2_quien", lucida: true,
        efecto: (api) => { api.marcar("vii_nora", "linterna"); R().coger(api, "nora", "linterna"); api.est("nora", "lucidez", 1); } },
      { texto: "Sentarte al lado de Irene. Cogerle la mano que no tiene en Álex.", a: "vii2_quien",
        efecto: (api) => { api.marcar("vii_nora", "irene"); R().contacto(api, "nora", "irene", 1); api.rel("irene", "nora", "resentimiento", -4); } },
    ],
  },

  vii2_quien: {
    pov: null,
    fondo: "assets/fondos/salon_apagon.jpg",
    titulo: "La ruptura · Quién sale",
    hora: "04:44",
    alEntrar: (api) => R().tick(api),
    texto: (api) => {
      const h = H(api);
      const vn = api.bandera("vii_nora");
      const mp = marcosPuedeSalir(api);
      const marcosCojo = R().herido(api, "marcos", "cojera");
      const alexCojo = R().herido(api, "alex", "cojera");
      const inicio = vn === "velas" ? `
Nora enciende las otras dos velas. Cuatro llamas en la mesa. Las coloca en las esquinas de la tabla, que sigue en su caja, como se colocan las cosas en un altar. Nadie hace el chiste.

Nora: Para la luz.

Álex no se ríe. Es la primera vez que no se ríe de eso.` : vn === "nadie" ? `
Nora: Nadie sale. Aguantamos con las velas hasta las siete.

Marcos: Son dos horas y cuarto.

Nora: Ya.

Marcos: Con dos velas.

Nora: Cuatro.

Marcos: Con cuatro velas y sin nevera y sin saber qué hay arriba.` : vn === "linterna" ? `
Nora ha vuelto del almacén con la linterna grande. La de verdad, la de pilas, la que estaba en la estantería al lado de la garrafa. La deja en la mesa. Marcos la mira como se mira una decisión ya tomada.` : `
Nora se ha sentado al lado de Irene. Le ha cogido la mano que no tiene en Álex. Irene no la ha apartado. Irene, que aparta las manos, no ha apartado esa.`;
      const marcosSubio = api.bandera("v_nora_con") === "marcos" || ["marcos", "nora_marcos"].includes(api.bandera("vi_sube"));
      const marcosHizo = (marcosSubio ? "ha subido a la buhardilla y " : "") + (api.bandera("v_marcos_libre") ? "ha bajado al almacén y arreglado una bombilla y un diferencial" : "ha arreglado una bombilla y ha aguantado la escalera");
      const marcosLinea = h === "marcos" ? `
Marcos no se ofrece.

Marcos, que se ofrece para todo lo que tiene solución, que ${marcosHizo}, está sentado con las manos en la mesa y mira la puerta como quien mira una pared.

Álex: ¿Marcos?

Marcos: Todavía no.

Álex: ¿Todavía no qué?

Marcos: Nada. Que... ve tú. Yo me quedo con ellas.

Y no es cobardía. Se le vería. Es otra cosa. Es como si alguien le hubiera dicho que no saliera y él hubiera dicho que vale.` : marcosCojo ? `
Marcos: Voy yo.

Nora: Con ese pie.

Marcos: Es un tirador. No hay que correr.

Nora: Marcos.

Y se calla. Porque el pie es el tamaño de la rodilla y lo sabe, y porque salir cojeando a un sitio sin luz es lo único que Marcos no puede explicar como una buena idea.

Álex: Voy yo.` : `
Marcos: Voy yo.

Lo dice antes de que nadie lo pregunte. Se levanta. ${R().lleva(api, "marcos", "atizador") ? "Coge el atizador." : ""} Coge el móvil, con la linterna puesta.

Irene: Nadie sale.

Marcos: He dicho que nadie sale y nadie sube. Y hace media hora que no se puede hacer ninguna de las dos cosas. Es un generador, Irene. Un tirador. Tres minutos.

Irene: Dijiste que nadie.

Marcos: Ya sé lo que dije.`;
      const alexLinea = h === "marcos" || marcosCojo ? "" : `
Álex: Voy contigo.

Marcos: No.

Álex: No te vas a ir tú solo a la caseta de los cadáveres con mi documental a medias.

Marcos: Álex.

Álex: Dos mejor que uno. Lo dijiste tú. Nadie va solo.

Y ahí Marcos no tiene respuesta, porque es su regla.`;
      return `${inicio}
${marcosLinea}
${alexLinea}

${alexCojo ? "Álex tiene el pie en una silla. Lo baja. Aguanta el peso. Le tiembla la cara y no la voz." : ""}

La puerta. La llave está en el bolsillo de Marcos desde las cuatro y media. ${mp ? "La saca. La mira. Como si pesara." : "La saca y la deja en la mesa, delante de Álex, como se pone una cosa que ya no es tuya."}

Fuera, sin porche encendido, no hay luz. Ninguna. El límite ya no está en la grava: está en el marco de esta puerta. Y todos lo sabéis sin que nadie lo haya dicho.

¿Quién sale?`;
    },
    personajes: [
      { id: "marcos", si: (api) => marcosPuedeSalir(api),
        descripcion: (api) => "Salir solo. La linterna, el tirador, tres minutos. Y volver.", a: "vii3_cruce",
        efecto: (api) => { api.marcar("generador_quien", "marcos"); api.est("marcos", "eje", 3); } },
      { id: "alex", si: (api) => alexPuedeSalir(api),
        descripcion: (api) => marcosPuedeSalir(api) ? "Salir con Marcos. Dos mejor que uno. El documental a medias." : "Salir solo. Con el móvil. Con la sartén o sin ella. Que Marcos no puede.", a: "vii3_cruce",
        efecto: (api) => { api.marcar("generador_quien", marcosPuedeSalir(api) ? "ambos" : "alex"); api.est("alex", "eje", 3); } },
    ],
  },

  vii3_cruce: {
    pov: (api) => goers(api).includes("marcos") && goers(api).length === 1 ? "marcos" : "alex",
    fondo: "assets/fondos/exterior.webp",
    ambiente: "exterior",
    musica: "terror",
    lugar: "fuera", hora: "04:46",
    titulo: "La ruptura · El cruce",
    alEntrar: (api) => {
      R().tick(api);
      const g = goers(api);
      g.forEach((p) => { R().fuera(api, p, true); api.presenciar(p, 1.5); });
      api.marcar("campanilla_cruce", true);
      // El lenguaje de fuera, con el filtro de cada uno. Cada uno lo suyo; nunca lo del otro.
      if (g.includes("marcos")) { api.marcar("faros_marcado", api.anomalia("faros_marcado")); if (api.bandera("faros_marcado")) api.saber("marcos", "faros_camino"); }
      if (g.includes("alex")) { api.marcar("golpes_marcado", api.anomalia("golpes_marcado")); if (api.bandera("golpes_marcado")) api.saber("alex", "golpes_devueltos"); }
    },
    texto: (api) => {
      const g = goers(api);
      const dos = g.length === 2;
      const pov = g.includes("marcos") && !dos ? "marcos" : "alex";
      const faros = api.bandera("faros_marcado");
      const golpes = api.bandera("golpes_marcado");
      const cojo = R().herido(api, pov, "cojera");
      const puerta = `
La llave. Dos vueltas al revés. El cerrojo sale con el mismo ruido de hierro viejo con el que entró, y la puerta se abre, y no entra luz porque no hay luz.

Entra frío. Y el olor a pino. Y otro olor debajo, que ya conoces: a leña. A algo que ardió hace mucho y sigue oliendo.

El porche. A oscuras. La bombilla de las polillas, muerta. Los dos escalones. Y más allá, la nada con forma de bosque.

${cojo ? "Bajas el primer escalón con el pie malo por delante. Duele. Bajas el segundo. Duele más. Un tullido cruza despacio, y despacio, fuera, es peor." : "Bajas los dos escalones."} La grava. Mojada. Cruje.

Y cuando el segundo pie deja el escalón:

[campanilla]

Tin.

Un sonido. Metálico. Pequeño. Muy pequeño. Como una cucharilla contra un vaso, pero más agudo, y más lejos, y más corto. Mezclado con el viento en las copas. Tan mezclado que no sabes si lo has oído.

No lo comentas. ${dos ? "Álex tampoco. O no lo ha oído. O sí." : "No hay nadie a quien comentárselo."}`;

      if (pov === "marcos") return `${puerta}

Quince metros. La linterna hace un cono en la grava, y la grava se acaba, y empieza la tierra, y la tierra sube hacia el cobertizo: un bulto negro con tejado de chapa, a la izquierda del coche.

El coche. Pasas a dos metros. La luz de dentro, apagada. ${api.bandera("marcos_cruzo") ? "Ya has estado aquí esta noche. Con Álex mirando. Con la luz del porche apagándose. Y has vuelto. Y ahora vuelves a estar." : "Lo miras como se mira una cosa que ha hecho algo raro y no lo va a admitir."}

${faros ? `Y entre los pinos, abajo, por el camino de tierra, a lo lejos, dos luces.

Amarillas. Bajas. Juntas. Como los faros de un coche viejo subiendo despacio por el camino.

Te paras. Apagas la linterna. Para verlas mejor. Para que no te vean.

Suben. Se ven un momento entre dos troncos. Se van. Se vuelven a ver, más cerca. Y el ruido: un motor. Antiguo. De los que suenan a lata. Subiendo.

~ Un coche. Alguien viene. A las cinco de la mañana por un camino sin salida. Un vecino. Un guarda. Alguien.

~ No hay vecinos. Lo miramos en el mapa. No hay nada hasta el pueblo.

Los faros se paran. Entre los árboles. A cien metros. A doscientos. No sabes calcular distancias sin luz. Se quedan ahí. Encendidos. Mirando la casa.

Enciendes la linterna. Te das la vuelta. Cobertizo. Tirador. Tres minutos. Es lo que sabes hacer.` : `Nada más. La grava, la tierra, el bulto del cobertizo. El viento arriba, en las copas, que suena a mar. Y tu respiración, que se oye demasiado aquí fuera, como si el bosque la devolviera.`}

${modo(api, "marcos", {
  lucido: `~ ${faros ? "Faros. Un motor. En un camino sin salida. Hay tres explicaciones y las tres necesitan que haya alguien, y no hay nadie. Cobertizo. Tirador. Ya pensaré." : "Quince metros. Diez segundos a paso normal. Un tirador, tres intentos como mucho. Y el pulso a ciento veinte, que es lo único que no me cuadra."}`,
  asustado: `~ ${faros ? "Nos miran. Los faros nos miran. Como los ojos de un perro en la cuneta." : "Un tin. Metal contra metal. La chapa del cobertizo con el viento. Tiene que ser la chapa. Tiene que ser."}`,
  tenso: "~ Tirador. Gasolina. Tirador. Vuelta. No mires el coche. No mires los árboles. Tirador.",
  ido: `~ ${faros ? "Los faros parpadean como una respiración. Suben cuando inspiro. Bajan cuando suelto." : "La grava brilla sin luz. Brilla sola. Es un camino que se enciende cuando lo pisas."}`,
  perdido: `~ ${faros ? "Es mi coche. Es mi coche subiendo por el camino con alguien dentro. Y yo aquí. Y mi coche allí." : "Ha sonado. La campanilla. Ya soy suyo. Lo dijo Álex: cuando decide que eres suyo. Ya."}`,
  normal: "~ Quince metros. Tres minutos. Que no se diga. Que no se diga delante de Nora.",
})}

El cobertizo. La puerta de tablas. El pestillo, por fuera, abierto.`;

      // Álex (solo o con Marcos)
      return `${puerta}

Quince metros. ${dos ? "Marcos delante con la linterna. Tú detrás con el móvil." : "El móvil de linterna. Un cono blanco que se come la grava."} El coche a dos metros, con la luz de dentro apagada. ${api.bandera("alex_cruzo") ? "Ya has estado aquí esta noche. Con el pie en la grava y la luz apagándose. Y has seguido. Y ahora sigues otra vez." : ""} El bulto del cobertizo, a la izquierda, con tejado de chapa.

${golpes ? `Y llamas. Sin querer. Con los nudillos. En la chapa del coche al pasar, toc, toc, como llamas a las mesas y a los vasos y a la gente.

Y la chapa contesta.

[toc]

Toc.

Antes de que levantes la mano para el tercero. Desde dentro del coche. Desde el bosque. No sabes desde dónde. Solo que ha sido antes.

Te paras. ${dos ? "Marcos no se para. No lo ha oído. Se le ve no oírlo." : ""}

Y entonces, desde los árboles, con tu voz, con la voz de hace cuatro horas, con la sonrisa entera:

${api.hayEvidencia("video_brindis") ? "«¡Documental número uno! Cuatro idiotas en la casa de una bruja.»\n\nTu voz. Tus palabras. Las del brindis." : "«" + R().voz(api, "alex", 0) + "»\n\nTu voz. Tus palabras. De esta noche."} Desde los pinos. Como si alguien las hubiera grabado y las pusiera ahora, bajo, para ti.

~ Me lo devuelve. Mi juego. Los golpes. Mi voz. Me lo está devolviendo todo, como se devuelve un favor.

${api.hayEvidencia("video_brindis") ? "~ Grabé eso. Marcos grabó eso. Está en su móvil. Nadie ha estado en su móvil." : "~ Lo dije yo. Esta noche. En la mesa. Nadie lo grabó."} Nadie ha estado en los pinos.` : `Nada. El cono de luz, la tierra, el cobertizo. El viento arriba, en las copas. Y tú con las ganas de decir algo a cámara y sin cámara, porque el móvil es la linterna y no se puede tener todo.`}

${modo(api, "alex", {
  lucido: `~ ${golpes ? "Mi voz. Mis palabras exactas. " + (api.hayEvidencia("video_brindis") ? "Solo hay dos sitios donde están: el móvil de Marcos y mi cabeza. Y los pinos no tienen ninguno de los dos." : "Solo hay un sitio donde están: mi cabeza. Y los pinos no tienen cabeza.") : "Quince metros de tierra a oscuras. Es lo más sencillo de la noche y tengo el pulso en la garganta. Bien. Por lo menos es mío."}`,
  asustado: `~ ${golpes ? "Me lo devuelve. Todo. Como el tablón del porche. Sabe mi voz. Sabe mis chistes." : "El tin. Ha sonado un tin. Como el de la historia. Como el que hice con los dedos."}`,
  tenso: "~ Cobertizo. Generador. Tirador. Que no se diga que Álex se ha quedado en un escalón dos veces.",
  ido: `~ ${golpes ? "Mi voz sonaba mejor desde los pinos. Más grave. Más de verdad. Como si allí supieran hacerla bien." : "La grava brilla sin luz. Brilla sola. Es un camino. Ya lo era antes."}`,
  perdido: `~ ${golpes ? "Está aprendiendo. Primero los golpes. Luego mi voz. Luego lo que quiera. Y me llama para que vaya a enseñarle más." : "Ha sonado. Ya soy suyo. Lo dije yo: cuando decide que eres suyo. Lo dije yo y era verdad."}`,
  normal: "~ Quince metros. Tres minutos. Y una historia buenísima para contar dentro, si dentro sigue habiendo alguien que se ría.",
})}

El cobertizo. La puerta de tablas. El pestillo, por fuera, abierto.`;
    },
    opciones: [
      { texto: "Entrar. Sin mirar atrás. El tirador.", a: "vii4_generador",
        efecto: (api) => { api.marcar("vii_cruce", "entra"); } },
      { texto: "Mirar los árboles con la linterna. Un segundo. Solo para saber.", a: "vii4_generador",
        efecto: (api) => { api.marcar("vii_cruce", "mira"); const p = goers(api).includes("marcos") && goers(api).length === 1 ? "marcos" : "alex"; api.est(p, "miedo", 5); api.presenciar(p, 1); api.saber(p, "miro_arboles_cruce"); } },
      { texto: "Contestar. «¿Quién anda ahí?» A los pinos.", a: "vii4_generador", si: (api) => api.bandera("faros_marcado") || api.bandera("golpes_marcado"),
        efecto: (api) => { api.marcar("vii_cruce", "habla"); const p = goers(api).includes("marcos") && goers(api).length === 1 ? "marcos" : "alex"; api.est(p, "eje", 2); api.est(p, "miedo", 4); R().alimentar(api, 0); } },
      { texto: "Mirar el coche por dentro. Con la linterna pegada al cristal.", a: "vii4_generador", lucida: true,
        efecto: (api) => { api.marcar("vii_cruce", "coche"); const p = goers(api).includes("marcos") && goers(api).length === 1 ? "marcos" : "alex"; api.saber(p, "coche_vacio"); api.est(p, "lucidez", 1); } },
    ],
  },

  vii4_generador: {
    pov: (api) => goers(api).includes("marcos") && goers(api).length === 1 ? "marcos" : "alex",
    fondo: "assets/fondos/cobertizo.jpg",
    titulo: "La ruptura · El generador",
    hora: "04:49",
    alEntrar: (api) => {
      R().tick(api);
      const a = arrancador(api);
      R().herir(api, a, "sangra", "generador");   // primera sangre: la mano en el arranque. La ofrenda cae con la herida.
      api.marcar("animal_abierto", true);
      goers(api).forEach((p) => { api.saber(p, "animal_abierto"); api.presenciar(p, 1.5); });
      api.marcar("generador_arrancado", true);
    },
    texto: (api) => {
      const g = goers(api);
      const dos = g.length === 2;
      const pov = g.includes("marcos") && !dos ? "marcos" : "alex";
      const a = arrancador(api);
      const vc = api.bandera("vii_cruce");
      const antes = vc === "mira" ? "Has mirado los árboles con la linterna. Un segundo. Troncos. Solo troncos. Y el cono de luz que se acababa antes de llegar a nada, que es lo peor que puede hacer un cono de luz." : vc === "habla" ? "«¿Quién anda ahí?» Lo has dicho a los pinos. Y los pinos no han contestado, que es lo que hacen los pinos. Y aun así te has quedado esperando." : vc === "coche" ? "Has pegado la linterna al cristal del coche. Los asientos. El volante. Nadie. Ni delante ni detrás. Y una cosa: el retrovisor interior, girado hacia el asiento de atrás. Marcos no lo deja así. Marcos deja los retrovisores como los deja." : "Has entrado sin mirar atrás. Es lo único que te has permitido.";
      return `
${antes}

La puerta del cobertizo. Tablas. Se abre hacia fuera, y al abrirla, en el umbral, en el suelo de tierra, hay algo.

Un conejo.

Abierto. De arriba abajo, como un libro. Con lo de dentro fuera, ordenado, a los lados, como si alguien lo hubiera puesto ahí para mirarlo. Sin sangre alrededor. Ni una gota en la tierra. Como si lo hubieran abierto en otro sitio y lo hubieran traído.

Fresco. Le brillan los ojos con la linterna.

${dos ? "Marcos: No lo mires.\n\nÁlex: Ya lo he mirado.\n\nMarcos: Pues no lo pises." : pov === "marcos" ? "~ Un zorro. Una garduña. Los bichos hacen esto. Los bichos lo hacen con dientes, y esto no tiene dientes, y lo hacen para comer, y esto no se lo han comido." : "~ Animales encontrados abiertos delante de la puerta. Lo dije yo. Lo conté yo. Está en la historia y está en el suelo."}

Pasas por encima. Dentro.

El cobertizo. Dos por tres. Olor a gasolina y a tierra. Una garrafa roja. Herramientas de otro. Y el generador: una caja naranja con un motor, un depósito, un tirador con cuerda, como una cortadora de césped.

${dos ? "Marcos mira" : "Miras"} el depósito. Medio. No es la gasolina.

${a === pov ? "Coges el tirador. Tiras." : "Marcos coge el tirador. Tira."} El motor tose y no. Otra vez. Tose y no.

Y a la tercera, la mano resbala.

La chapa del arranque tiene un borde. Como una lata abierta. Y ${a === pov ? "tu mano" : "la mano de Marcos"} baja por ese borde con el peso del tirón, y se abre, y la sangre sale antes que el dolor, oscura, mucha, goteando en la tierra del suelo.

${a === pov ? `Miras la mano. La palma. Un corte de un lado a otro, hondo, blanco un segundo y luego rojo. Gotea. Gotea en la tierra y la tierra se lo bebe.

~ Primera sangre. Eso ha sonado a algo. A algo que dijo Álex con los dedos en la mesa.` : `Marcos mira la mano. La palma abierta. Gotea en la tierra y la tierra se lo bebe.

Marcos: No es nada.

Es bastante.`}

Y el cuarto tirón. Con la mano así. Con la sangre en la cuerda.

El motor arranca.

[luz]

Un ruido enorme en un sitio pequeño. Humo. Y por la puerta abierta, entre los pinos, a quince metros, la casa.

Encendida.

Todas las ventanas. El porche con su bombilla y sus polillas. La luz amarilla del salón cayendo sobre la grava como algo que se ha derramado. Y dentro, a través del cristal, ${goers(api).length === 2 ? "dos figuras de pie. Nora. Irene." : "tres figuras de pie. Nora. Irene. Y " + (goers(api)[0] === "marcos" ? "Álex" : "Marcos") + "."} Mirando hacia aquí.

Es lo más bonito que has visto en toda la noche. Una casa encendida. Te das cuenta de que tienes las rodillas flojas.

${modo(api, pov, {
  lucido: `~ Un generador que se para con el depósito a medias. Eso es una bujía, un filtro, una cosa con nombre. ${a === pov ? "Y una mano abierta que va a necesitar puntos." : "Y la mano de Marcos, que va a necesitar puntos."} Y un conejo. El conejo no tiene nombre.`,
  asustado: `~ La sangre en la tierra. La tierra se la ha bebido. Como si tuviera sed. Como si llevara tiempo esperándola.`,
  tenso: "~ Fuera. Fuera de aquí. Cerrar y correr. No correr. Andar rápido. Fuera.",
  ido: "~ El motor suena como el arrastre. Como lo de detrás de la puerta del almacén. El mismo ritmo. La misma cosa pesada moviéndose un palmo.",
  perdido: `~ ${a === pov ? "Le he dado sangre. Me la ha pedido con el borde de la chapa y se la he dado. Es la tercera. Nombre, aliento, sangre." : "Marcos le ha dado sangre. Se la ha pedido y se la ha dado. Es la tercera. Nombre, aliento, sangre."}`,
  normal: "~ Encendida. La casa está encendida. Ahora dentro, y una cerveza, y que alguien se ría.",
})}

La puerta del cobertizo, detrás, se mueve con el viento. Golpea. Se abre. Golpea.`;
    },
    opciones: [
      { texto: "Volver. Andando. Sin mirar los pinos. Sin correr.", a: "vii5_vuelta",
        efecto: (api) => { api.marcar("vii_generador", "vuelve"); } },
      { texto: "Mirar el conejo. De cerca. Con la linterna. Saber qué lo ha hecho.", a: "vii5_vuelta", lucida: true,
        efecto: (api) => { api.marcar("vii_generador", "conejo"); const p = goers(api).includes("marcos") && goers(api).length === 1 ? "marcos" : "alex"; api.saber(p, "conejo_sin_dientes"); api.est(p, "miedo", 4); api.est(p, "lucidez", 1); } },
      { texto: "Grabar. El generador en marcha, la casa encendida, el conejo. Documental.", a: "vii5_vuelta", si: (api) => goers(api).includes("alex"),
        efecto: (api) => { api.marcar("vii_generador", "graba"); api.evidencia("video_cobertizo", "alex", "cobertizo", "video"); api.est("alex", "eje", 2); } },
      { texto: "Cerrar el cobertizo con el pestillo. Por fuera. Por orden. Y después volver.", a: "vii5_vuelta", si: (api) => goers(api).includes("marcos"),
        efecto: (api) => { api.marcar("vii_generador", "pestillo"); api.marcar("cobertizo_cerrado", true); api.est("marcos", "eje", 3); } },
      { texto: "Correr. Los quince metros. Con la mano como esté.", a: "vii5_vuelta", impulsiva: true,
        efecto: (api) => { api.marcar("vii_generador", "corre"); const p = goers(api).includes("marcos") && goers(api).length === 1 ? "marcos" : "alex"; api.est(p, "estres", 5); api.est(p, "miedo", 3); if (R().herido(api, p, "cojera")) api.est(p, "estres", 5); } },
    ],
  },

  vii5_vuelta: {
    pov: "nora",
    fondo: "assets/fondos/salon_noche.jpg",
    ambiente: "interior",
    musica: "fiesta_baja",
    lugar: "comedor", hora: "04:53",
    titulo: "La ruptura · La casa se ilumina",
    alEntrar: (api) => {
      R().tick(api);
      api.marcar("luz_vuelta", true);
      // DOOMED sin aviso. Quien cruzó está marcado. No se lee en pantalla.
      goers(api).forEach((p) => { R().fuera(api, p, false); R().cruzar(api, p); });
      api.marcar("primer_cruce", primerCruce(api));
      ["nora", "marcos", "alex", "irene"].forEach((p) => api.est(p, "estres", -6));
      api.est("marcos", "eje", 4);
      api.rel("nora", "marcos", "afecto", 3);
      R().contacto(api, "nora", arrancador(api), 1);   // lavar y vendar es contacto (§23.7)
    },
    texto: (api) => {
      const g = goers(api);
      const dos = g.length === 2;
      const a = arrancador(api);
      const h = H(api);
      const vg = api.bandera("vii_generador");
      const entra = vg === "corre" ? `La puerta se abre de golpe y ${dos ? "Álex entra corriendo con Marcos detrás" : N[g[0]] + " entra corriendo"}, y la cierra con la espalda, y se queda contra ella respirando como quien ha subido diez pisos.` : vg === "pestillo" ? `Se oye el pestillo del cobertizo desde aquí: hierro contra hierro. Luego los pasos en la grava. Luego la puerta. Marcos entra${dos ? " con Álex" : ""} y cierra con dos vueltas, por orden, como hace las cosas.` : `Los pasos en la grava. La puerta. ${dos ? "Marcos y Álex entran" : N[g[0]] + " entra"} con el frío detrás y la cara de quien vuelve de más lejos de quince metros.`;
      return `
[luz]

La luz vuelve.

Así. Sin avisar. La lámpara, la cocina, el pasillo de arriba por el hueco de la escalera. El zumbido de la nevera, que ahora oyes porque lo has echado de menos. Las velas siguen ardiendo y de repente no hacen falta, y las miras como se mira a alguien que se ha quedado hablando solo.

Irene suelta el aire. Con ruido.

${entra}

${a === "marcos" ? "Marcos con la mano derecha cerrada contra el pecho. Y entre los dedos, sangre. Mucha. Goteando por la muñeca hasta el codo." : "Álex con la mano derecha cerrada contra el pecho. Y entre los dedos, sangre. Goteando por la muñeca hasta el codo."}

Nora: ¿Qué te ha pasado?

${N[a]}: El tirador. La chapa. No es nada.

Es bastante. Le coges la mano. La abres. Un corte de un lado a otro de la palma, hondo, que se abre como una boca cuando estira los dedos.

Nora: Cocina. Ya.

${a === "marcos" ? (h === "marcos" ? "Te deja llevarle. Sin decir nada. Marcos, que explica sus heridas, no dice nada de esta. Mira la mano como si fuera de otro." : "Te deja llevarle. Y hace el chiste. El primero desde las cuatro. «Si me ves muy tranquilo, desconfía.» Y se ríe. Y tú también, porque hace falta.") : "Se deja llevar. Y habla. «Documental número seis: Álex se abre la mano con una cortadora de césped.» Habla porque no hablar es peor, y tú se lo agradeces."}

El grifo de la cocina. Agua fría sobre la palma. La sangre se va rosa por el desagüe. ${N[a]} aprieta los dientes. Le envuelves la mano con el paño limpio, el de cuadros, apretado, y le dices que la tenga en alto.

Y cuando volvéis a la mesa, Álex ha puesto música.

[musica:fiesta_baja]

Baja. Algo de Irene. Algo alegre que no pega con nada y por eso pega. Irene ha abierto cuatro cervezas. ${R().herido(api, "marcos", "sangra") ? "Marcos coge la suya con la mano buena." : R().herido(api, "alex", "sangra") ? "Álex coge la suya con la mano buena y brinda con nadie." : "Marcos coge la suya."}

Álex: Se acabó.

Marcos: Se acabó qué.

Álex: Lo que sea. Se ha acabado. Es un generador con una bujía de mierda. Y ahora hay luz. Y ahora hay cerveza.

Y durante un minuto es verdad. Es verdad entera. Cuatro personas en una cabaña con luz y cerveza y música, a las cinco menos cinco, con una mano vendada${["marcos", "alex", "irene"].some((p) => R().herido(api, p, "cojera")) ? " y un pie hinchado" : ""} y una historia que contar en el trabajo el lunes.

${dos ? "Álex mira a Marcos. Marcos mira la cerveza." : g[0] === "alex" ? "Álex, con la cerveza en la mano buena, mira la puerta. Solo un momento. Luego a Irene. Luego la puerta otra vez." : "Marcos, con la cerveza en la mano buena, mira la puerta. Solo un momento. Luego a ti. Luego la puerta otra vez."}

${modo(api, "nora", {
  lucido: `~ Han salido y han vuelto. Han cruzado quince metros a oscuras y han vuelto con una mano abierta y un generador en marcha. Es lo más normal que ha pasado en toda la noche. Y no dejo de mirar${dos ? "les" : g[0] === "alex" ? "le a Álex" : " a Marcos"} como se mira a alguien que ha vuelto de un sitio.`,
  asustado: "~ Sangre. La primera. Se la ha llevado la tierra de fuera. Nombre, aliento, sangre. Lo dijo Álex con los dedos.",
  tenso: "~ Música. Cerveza. «Se acabó.» Como después de la ouija. Como después de la rama. Cada vez que Álex dice se acabó, empieza otra cosa.",
  ido: "~ La luz ha vuelto distinta. Más amarilla. Más de vela. Como si la casa se hubiera encendido por dentro y no por el generador.",
  perdido: `~ ${g[0] === "alex" ? "Álex" : "Marcos"} mira la puerta. Le llaman desde fuera. Le han llamado al salir y le siguen llamando. Y va a ir.`,
  normal: "~ Luz. Cerveza. Un chiste. Vale. Vale. Cinco minutos de fiesta. Los voy a apuntar.",
})}`;
    },
    opciones: [
      { texto: "Beber. Reírte de lo de la bujía. Que sean cinco minutos de fiesta.", a: "vii6_marcado",
        efecto: (api) => { api.marcar("vii_vuelta", "fiesta"); api.consumir("nora", "cerveza"); api.est("nora", "estres", -4); api.rel("nora", "alex", "resentimiento", -3); } },
      { texto: "Sentarte al lado del que ha salido. Con la mano en su rodilla. Sin decir nada.", a: "vii6_marcado",
        efecto: (api) => { api.marcar("vii_vuelta", "rodilla"); const p = arrancador(api); R().contacto(api, "nora", p, 1); } },
      { texto: "Escribir. «04:53. Han salido. Han vuelto. Sangre en la chapa.»", a: "vii6_marcado", lucida: true,
        efecto: (api) => { api.marcar("vii_vuelta", "escribe"); api.evidencia("cuaderno_generador", "nora", "cuaderno de Nora", "nota"); api.est("nora", "lucidez", 1); } },
      { texto: "«¿Qué habéis visto fuera?» A los que han salido. Delante de todos.", a: "vii6_marcado",
        efecto: (api) => { api.marcar("vii_vuelta", "pregunta"); goers(api).forEach((p) => api.est(p, "estres", 4)); api.est("nora", "eje", 2); } },
    ],
  },

  vii6_marcado: {
    pov: (api) => primerCruce(api),
    titulo: "La ruptura · Desde dentro",
    hora: "04:58",
    alEntrar: (api) => {
      R().tick(api);
      const p = primerCruce(api);
      api.marcar("marcado_pov", p);
      api.presenciar(p, 1);
      api.est(p, "lucidez", -3);
      // Contaminación: lo que ve el marcado desde dentro de la luz. Solo él.
      if (p === "marcos") api.saber("marcos", "faros_ventana"); else api.saber("alex", "golpes_ventana");
    },
    texto: (api) => {
      const p = primerCruce(api);
      const vv = api.bandera("vii_vuelta");
      const sangra = R().herido(api, p, "sangra");
      const preg = vv === "pregunta" ? (p === "marcos" ? `
Nora: ¿Qué habéis visto fuera?

Delante de todos. Con la voz de las preguntas serias.

Marcos: Un conejo muerto. Y un generador con la bujía sucia.

${api.bandera("faros_marcado") ? "No dices lo de los faros. Lo tienes en la boca y no sale. Sale otra cosa: «nada más». Y te oyes decir «nada más» como se oye a otro." : "Y es verdad. Todo lo que dices es verdad. Y aun así te suena a mentira."}` : `
Nora: ¿Qué habéis visto fuera?

Delante de todos. Con la voz de las preguntas serias.

Álex: Un conejo abierto como un libro. Y un generador de mierda.

${api.bandera("golpes_marcado") ? "No dices lo de la voz. Tu voz desde los pinos. Lo tienes en la boca y sale otra cosa: «nada más». Álex, que lo cuenta todo, diciendo «nada más». Y te oyes decirlo como se oye a otro." : "Y es verdad. Y aun así te suena a mentira, y a Nora se le ve que también."}`) : "";
      if (p === "marcos") return `${preg}

La mesa. ${R().herido(api, "marcos", "sangra") ? "La cerveza en la mano buena. La otra en alto, con el paño de cuadros, que ya está oscuro por dentro." : "La cerveza en la mano. Álex, enfrente, con la mano del paño en alto y la cerveza en la otra. El paño ya está oscuro por dentro."} ${vv === "rodilla" ? "Nora con la mano en tu rodilla. Sin decir nada. Es su manera." : ""} Álex contando lo del conejo con más detalles de los que hubo. Irene sin reírse.

Y la ventana.

La del salón, la que da al camino. Negra, como todas. Devuelve la habitación: la lámpara, la mesa, las caras.

Y detrás del reflejo, entre los pinos, dos luces.

Amarillas. Bajas. Quietas.

Los faros.

${api.bandera("faros_marcado") ? "Los mismos. " : ""}A cien metros. A doscientos. Encendidos. Mirando la casa.

Te quedas mirándolos por encima del hombro de Álex. Álex sigue hablando. Nadie mira la ventana. Nadie más los ve, porque nadie más mira, o porque no están.

~ Un coche parado en el camino. Con las luces. A las cinco de la mañana. Sin que suba. Sin que se vaya.

~ Mi coche está fuera. A veinte metros. Con la luz de dentro apagada. Mi coche no está en el camino.

Nora: ¿Qué miras?

Marcos: Nada.

Lo has dicho rápido. Demasiado. Nora te mira un segundo más de lo que se mira a alguien que ha dicho «nada». Y se lo apunta. Nora se lo apunta todo.

${sangra ? "La mano late. Debajo del paño. Al ritmo de los faros, que no tienen ritmo, y aun así." : ""}

${modo(api, "marcos", {
  lucido: "~ Los veo. Ahora, con luz, desde dentro. Nadie más los ve porque nadie más mira. O porque solo los veo yo. Y las dos explicaciones me dejan igual: mirando la ventana y diciendo «nada».",
  asustado: "~ Me han seguido. Han subido detrás de mí y se han parado donde se acaba la luz. Y esperan.",
  tenso: "~ Nada. He dicho nada. A Nora. Nunca le he dicho nada a Nora. Y ahora no puedo decirle otra cosa.",
  ido: "~ Los faros parpadean cuando parpadeo. Los cierro y se apagan. Los abro y siguen. Son míos.",
  perdido: "~ Es mi coche. Es mi coche en el camino con alguien al volante que tiene mis manos. Y me está esperando para cambiarnos.",
  normal: "~ Faros. Un coche parado. Se lo digo. No se lo digo. Se lo digo luego.",
})}`;

      return `${preg}

La mesa. La cerveza. ${sangra ? "La mano en alto con el paño de cuadros, que ya está oscuro por dentro." : ""} ${vv === "rodilla" ? "Nora con la mano en tu rodilla, sin decir nada, que en Nora es raro y en ti más." : ""} Marcos explicando lo de la bujía a Irene, que no escucha. Y tú contando lo del conejo con más detalles de los que hubo, porque es lo que sabes hacer.

Y en mitad de un detalle, la ventana.

[toc]

Toc.

En el cristal. Desde fuera. Un nudillo.

[toc]

Toc.

Te callas. A mitad de frase. Álex no se calla a mitad de nada.

Nadie más lo ha oído. Marcos sigue con la bujía. Irene mira a Marcos. Nora te mira a ti.

Y el tercero no llega. ${api.bandera("v_nora_porche") ? "Como no llegaba el tuyo en el porche. " : ""}Lo esperas. Te oyes esperarlo. Y no llega, porque el tercero es tuyo, porque siempre has sido tú el que da el tercero.

~ Me lo devuelve. Aquí dentro. Con luz. Con todos delante. Y solo yo lo oigo, y eso es exactamente lo que quiere.

Nora: ¿Qué?

Álex: Nada. Se me ha ido.

Se te ha ido. A Álex no se le va nada. Nora te mira un segundo más de lo que se mira a alguien que ha dicho «nada». Y se lo apunta.

${modo(api, "alex", {
  lucido: "~ Dos golpes en el cristal que solo oigo yo. Con luz. Con gente. Si lo digo, soy el fumado que oye cosas. Si no lo digo, soy Álex callándose algo, y eso se nota más.",
  asustado: "~ Me ha seguido. Ha entrado conmigo. Está en el cristal, por fuera, con los nudillos, esperando el tercero.",
  tenso: "~ Nada. He dicho nada. Yo. Que lo cuento todo. Nora lo ha visto. Nora lo ve todo, como Irene, pero peor, porque lo apunta.",
  ido: "~ Los golpes suenan dentro del cristal. En el reflejo. Es mi reflejo el que llama. Quiere entrar.",
  perdido: "~ Me está llamando para que salga a dar el tercero. Y voy a ir. Lo sé como sé mi nombre. Que también sabe.",
  normal: "~ Toc, toc. Y no toc. Vale. Vale. Me lo guardo. Álex guardándose algo. El documental se ha ido a la mierda.",
})}`;
    },
    opciones: [
      { texto: "Decirlo. Ahora. Delante de todos. Lo que has visto y lo que oyes.", a: "vii7_voces",
        efecto: (api) => { const p = primerCruce(api); api.marcar(p + "_cuenta_fuera", true); api.marcar("vii_marcado", "cuenta"); api.contar(p, "nora", p === "marcos" ? "faros_camino" : "golpes_devueltos"); api.est(p, "estres", -3); api.rel("nora", p, "confianza", 3); } },
      { texto: "«Nada.» Otra vez. Y mirar la cerveza.", a: "vii7_voces",
        efecto: (api) => { const p = primerCruce(api); api.marcar(p + "_miente", true); api.marcar("vii_marcado", "miente"); api.est(p, "estres", 4); api.rel("nora", p, "confianza", -3); api.saber("nora", p + "_miente"); } },
      { texto: "Levantarte. Ir a la ventana. Pegar la cara al cristal.", a: "vii7_voces",
        efecto: (api) => { const p = primerCruce(api); api.marcar("vii_marcado", "ventana"); api.est(p, "miedo", 5); api.est(p, "lucidez", -2); api.presenciar(p, 1.5); api.saber(p, "ventana_nadie"); } },
      { texto: "Beber. De un trago. Que se vaya con la cerveza.", a: "vii7_voces",
        efecto: (api) => { const p = primerCruce(api); api.marcar("vii_marcado", "bebe"); api.consumir(p, "cerveza"); api.consumir(p, "chupito"); api.est(p, "estres", -2); } },
    ],
  },

  vii7_voces: {
    pov: "irene",
    titulo: "La ruptura · Su nombre",
    hora: "05:02",
    alEntrar: (api) => {
      R().tick(api);
      const v = api.anomalia("voz_nombre_irene");
      api.marcar("oyo_voz_irene", v);
      if (v) { api.saber("irene", "oi_mi_nombre_marcos"); api.presenciar("irene", 1.5); R().ofrenda(api, "nombre"); }
    },
    texto: (api) => {
      const h = H(api);
      const p = primerCruce(api);
      const vm = api.bandera("vii_marcado");
      const voz = api.bandera("oyo_voz_irene");
      const inicio = vm === "cuenta" ? (p === "marcos" ? `
Marcos: He visto faros. En el camino. Un coche parado, con las luces, a cien metros. Cuando iba al cobertizo y ahora. Desde la ventana.

Silencio.

Álex: ¿Y no lo dices?

Marcos: Lo estoy diciendo.

Todos miráis la ventana. Negra. Devuelve la habitación. Nadie ve faros. Marcos mira la ventana y se le ve verlos.` : `
Álex: He oído golpes. En la ventana. Dos. Y fuera, mi voz. La de la fiesta. Desde los pinos.

Silencio.

Marcos: Fumado oyes cosas.

Álex: No he fumado desde las tres.

Y es verdad. Y Marcos lo sabe. Y Marcos no dice nada más.`) : vm === "miente" ? `
${N[p]} ha dicho «nada». Dos veces. Y ha mirado la cerveza. Y tú le has leído: ${N[p]} tiene una cosa en la boca y no la suelta. ${p === "marcos" ? "Marcos, que no se guarda nada porque cree que guardarse cosas es de tontos." : "Álex, que no se guarda nada porque no le cabe."}` : vm === "ventana" ? `
${N[p]} se ha levantado. Ha ido a la ventana. Ha pegado la cara al cristal, con las manos a los lados, como un niño. Y se ha quedado así. Diez segundos. Veinte.

Nora: ¿${N[p]}?

Y ha vuelto a la mesa. «Nada.» Con la cara de haber visto nada. Que es la peor cara que hay.` : `
${N[p]} se ha bebido la cerveza de un trago y ha cogido la botella y se ha servido un chupito y se lo ha bebido. Y otro. Como quien apaga algo.`;
      return `${inicio}

Cinco y dos minutos. Lo ha dicho Nora. Nora dice la hora como otros tocan madera.

Faltan dos horas para las siete. La música sigue, baja, y ya no es de fiesta: es de sala de espera. ${["alex", "marcos"].filter((p) => R().herido(api, p, "cojera")).map((p) => N[p] + " tiene el pie en la silla. ").join("")}${["marcos", "alex"].filter((p) => R().herido(api, p, "sangra")).map((p) => N[p] + " la mano en alto. ").join("")}Tú tienes las dos manos en la mesa y ${R().herido(api, "irene", "cojera") ? "el pie malo en la otra silla, descalzo, del tamaño de la rodilla" : "los pies descalzos encogidos bajo la silla"}, porque el suelo está frío, porque todo está frío.

${h === "irene" ? `Y te llega. Con tu voz.

~ ${R().intrusion(api, "irene", 2)}

Te lo quedas. Como se queda un sabor. Miras a Álex. Miras a Marcos. No sabes a cuál de los dos iba.` : ""}

${voz ? `Y entonces, desde fuera, desde el porche, a través de la puerta cerrada con llave:

[susurro]

Irene.

Con la voz de Marcos.

No la de la mesa. La de la ouija. ${api.bandera("marcos_accion") === "rescate" ? "La de cuando dijo tu nombre agachado sobre ti, «Irene, Irene, mírame», la que solo le has oído una vez." : "La de cuando dijo «¿Irene?» con la luz yéndose, la que solo le has oído una vez."} Desde fuera. Desde el porche donde no hay nadie.

Irene.

Miras a Marcos. Está aquí. Con la mano en alto y la cerveza en la otra. Con la boca cerrada.

Marcos: ¿Qué?

Irene: Nada.

Miras la puerta. Cerrada. Dos vueltas. La llave en el bolsillo de ${marcosPuedeSalir(api) ? "Marcos" : "Álex"}.

Irene.

Otra vez. Más bajo. Como quien no quiere que le oigan los demás. Como quien te llama solo a ti.

~ Sabe su voz. La de Marcos. La aprendió esta noche, cuando él dijo mi nombre encima de mí. La ha cogido de ahí. Y la usa desde fuera para que abra.

~ No. He oído el viento. He oído la música. He puesto su nombre encima porque es el nombre que quiero oír.

${modo(api, "irene", {
  lucido: "~ Tres veces. Con la voz de Marcos. Desde un porche vacío con la puerta cerrada. Y Marcos aquí, con la boca cerrada. Es la cuarta vez esta noche que alguien dice mi nombre y no es nadie, y ya sé de quién es la voz que va a usar la quinta.",
  asustado: "~ Me llama. Con su voz. Sabe que con su voz voy. Sabe con qué voz va cada una.",
  tenso: "~ Que se calle. Que se calle Marcos, que no está hablando. Que se calle lo que habla con su boca.",
  ido: "~ Su voz sonaba mejor desde fuera. Más de cerca. Más de verdad que la de aquí dentro.",
  perdido: "~ Me está eligiendo. Primero Álex, luego Marcos. Está probando con qué voz abro la puerta. Y con la de Marcos casi.",
  normal: "~ El viento. La música. Un nombre. Y no me muevo de esta silla aunque me llame el Papa.",
})}` : `Nadie dice nada. La música. La nevera. El generador, fuera, lejos, como un motor de barco.

Y en el silencio, sin voz, sin golpe, sin nada, tienes la certeza más grande de toda la noche: que ahí fuera hay alguien que sabe cómo os llamáis.

${modo(api, "irene", {
  lucido: "~ Dos horas. Cuatro personas. Una mesa. Y yo, que leo a la gente, sin saber leer a ninguno de los tres. Eso es lo que más me asusta: que se me ha ido la única cosa que sé hacer.",
  asustado: "~ Sabe mi nombre. Lo dijo el vaso. Lo dije yo. Lo tiene.",
  tenso: "~ Dos horas. Que sean dos horas de reloj, no de esta casa.",
  ido: "~ La música suena a otra cosa. A la misma canción, pero cantada por alguien que la está aprendiendo.",
  perdido: "~ Está fuera. Esperando a que uno abra. Y uno va a abrir. Lo sé porque sé quién.",
  normal: "~ Dos horas. Con la mano de Álex. Con los pies fríos. Se puede.",
})}`}`;
    },
    opciones: [
      { texto: "«Marcos. ¿Has dicho mi nombre?» Delante de todos.", a: "vii8_salida", si: (api) => api.bandera("oyo_voz_irene"),
        efecto: (api) => { api.marcar("vii_irene", "pregunta"); api.marcar("irene_cuenta_voz", true); api.contar("irene", "nora", "oi_mi_nombre_marcos"); api.est("marcos", "estres", 4); api.est("irene", "estres", 3); } },
      { texto: "No decir nada. Cogerte al brazo de Álex con las dos manos.", a: "vii8_salida",
        efecto: (api) => { api.marcar("vii_irene", "alex"); R().contacto(api, "irene", "alex", 1); api.marcar("irene_cuenta_voz", false); } },
      { texto: "Contestar. Bajo. «¿Qué?» A la puerta.", a: "vii8_salida", si: (api) => api.bandera("oyo_voz_irene"),
        efecto: (api) => { api.marcar("vii_irene", "contesta"); api.marcar("irene_cuenta_voz", false); api.est("irene", "miedo", 5); api.est("irene", "lucidez", -2); api.saber("irene", "contesto_voz"); } },
      { texto: "Mirar a Marcos. Leerle. Ver si sabe que le han robado la voz.", a: "vii8_salida", lucida: true,
        efecto: (api) => { api.marcar("vii_irene", "lee"); api.marcar("irene_cuenta_voz", false); api.saber("irene", H(api) === "marcos" ? "marcos_raro" : "marcos_asustado"); api.est("irene", "lucidez", 1); } },
      { texto: "«Ya.» A la puerta. Sin saber por qué.", a: "vii8_salida", si: (api) => H(api) === "irene",
        efecto: (api) => { api.marcar("vii_irene", "ya"); R().lapso(api); api.saber("nora", "irene_raro"); api.saber("alex", "irene_rara"); api.est("irene", "lucidez", -2); } },
    ],
  },

  vii8_salida: {
    pov: "nora",
    titulo: "La ruptura · Voy a mear",
    hora: "05:06",
    alEntrar: (api) => {
      R().tick(api);
      const p = primerCruce(api);
      api.marcar("desaparecido", p);
      api.marcar("desaparecido_hora", "05:06");
      api.marcar("fase7_completa", true);
      R().fuera(api, p, true);
      api.marcar("puerta_cerrada_llave", false);
      // Marcos sale sin el atizador: se queda apoyado en su silla (lo lee la VIII)
      if (p === "marcos" && R().lleva(api, "marcos", "atizador")) { R().soltar(api, "marcos"); api.marcar("atizador_silla", true); }
      api.est("nora", "estres", 4);
    },
    texto: (api) => {
      const p = primerCruce(api);
      const h = H(api);
      const vi = api.bandera("vii_irene");
      const inicio = vi === "pregunta" ? `
Irene: Marcos. ¿Has dicho mi nombre?

Marcos: No.

Irene: Desde fuera. Con tu voz.

Marcos: Estoy aquí.

Irene: Ya lo sé.

Y no dice más. Y Marcos la mira, y Álex la mira, y tú la miras, y por primera vez esta noche Irene no tiene la cara puesta. Tiene la de debajo.` : vi === "contesta" ? `
Irene ha dicho «¿qué?». Bajo. A la puerta. Y se ha quedado esperando una respuesta, y la puerta no ha contestado, y ella ha tragado y ha cogido su vaso.` : vi === "ya" ? `
Irene ha dicho «ya». A la puerta. Bajo, como se contesta a alguien. Álex le ha preguntado ya qué. Ella ha dicho nada. Y tú lo has apuntado, porque ya es la tercera vez que Irene contesta a algo que no habla.` : `
Irene se ha cogido al brazo de Álex con las dos manos. No ha dicho nada. Irene, que siempre tiene algo que decir, lleva diez minutos sin tener nada.`;
      const sale = p === "alex" ? `
Álex se levanta.

Álex: Voy a mear.

Marcos: Al de abajo.

Álex: Al de abajo huele a pino químico y a cadáver.

Marcos: Álex.

Álex: Al de abajo. Vale. Al de abajo.

Y va hacia el pasillo del baño de abajo. Y en el pasillo se para. Y en vez de girar a la derecha, a la puerta del baño, gira a la izquierda. A la puerta principal.

Nora: Álex.

Álex: Un cigarro. En el porche. Debajo de la luz. Un minuto. Me veis desde aquí.

Marcos: Está cerrada.

${marcosPuedeSalir(api) ? "Álex: Tienes la llave." : "Álex: Tengo la llave. Desde el apagón. Nadie me la ha pedido."}

Marcos: No.

Álex: Marcos. Un minuto. Debajo de la bombilla. Con la puerta abierta.

${h === "marcos" ? "Y Marcos no dice nada más. Marcos, que había dicho que nadie sale, mira a Álex sacarse la llave del bolsillo, y no le reconoces la cara: es la de quien ya lo sabía." : !marcosPuedeSalir(api) ? "Y Marcos no dice nada más, porque no tiene con qué. Álex ya tiene la mano en el bolsillo." : "Y Marcos, que tiene " + (R().herido(api, "marcos", "cojera") ? "un tobillo del tamaño de la rodilla" : R().herido(api, "marcos", "sangra") ? "una mano abierta" : "el cuerpo entero") + " y dos horas de reglas, se cansa. Se le ve cansarse. Saca la llave. Se la tira por encima de la mesa."}

Álex: Un minuto.

Abre. Dos vueltas al revés. Deja la llave puesta, porque va a volver. El frío. La bombilla del porche, encendida, con sus polillas. Álex sale. Deja la puerta entornada. Se ve la brasa encenderse. Se ve su espalda contra la barandilla. A cuatro metros.

Un minuto.

${api.bandera("alex_miente") ? "Álex mira los árboles. No fuma. Tiene el cigarro encendido en la mano y no fuma. Mira los árboles como se mira a alguien que te ha dicho algo." : "Álex fuma. Mira los árboles. Da una calada larga."}

Dos minutos.

Irene: Álex.

Y la espalda de Álex ya no está contra la barandilla. Está en el primer escalón. En el segundo.

Nora: ¡Álex!

Se gira. Te mira desde el segundo escalón. Con el cigarro en la boca. Con la cara de Álex. Y levanta la mano, así, con la palma abierta, como quien dice «un momento».

Y baja a la grava.

Y se va de la luz.` : `
Marcos se levanta.

${goers(api).includes("marcos") ? "Marcos: Voy a cerrar el cobertizo." : "Marcos: Voy a apagar la luz del coche."}

Nora: ¿Qué?

Marcos: ${!goers(api).includes("marcos") ? "Se ha vuelto a encender. La luz de dentro del coche. Si se queda así, mañana no arranca. Y entonces sí que no sale nadie." : api.bandera("cobertizo_cerrado") ? "He cerrado el pestillo y no estoy seguro. Y si entra un bicho y toca el generador, nos quedamos a oscuras otra vez." : "Lo he dejado abierto. Con la puerta dando golpes. Si se cierra sola con el viento y ahoga el motor, nos quedamos a oscuras otra vez."}

Nora: Marcos. No.

Marcos: Está encendido el porche. Son quince metros con luz. Un minuto.

Nora: Has dicho que nadie sale.

${goers(api).includes("marcos") ? "Marcos: Y he salido. Y he vuelto. Es un pestillo." : "Marcos: Es mi coche. Es un botón."}

Lo dice con la voz de las explicaciones. Y tú le conoces desde marzo y sabes que cuando Marcos explica dos veces la misma cosa es que no es esa cosa.

${api.bandera("marcos_miente") ? "Y mira la ventana. Al decirlo. Mira la ventana como se mira a alguien que te ha dicho algo." : "Y no te mira. Marcos siempre te mira cuando te dice que no. Ahora mira la puerta."}

${marcosPuedeSalir(api) ? "Saca la llave." : "Le tiende la mano abierta a Álex. Álex le da la llave. Nadie dice nada."} Dos vueltas al revés. El frío. La bombilla del porche con sus polillas. Deja la llave puesta por dentro, que es lo que hace Marcos: dejar las cosas donde hacen falta. ${api.bandera("atizador_silla") ? "El atizador, apoyado en su silla. " : ""}Sale. Deja la puerta entornada. Se ve su espalda bajar los escalones${R().herido(api, "marcos", "cojera") ? ", un escalón y el pie malo, otro escalón y el pie malo," : ""} con la linterna.

Un minuto. La linterna cruza la grava hacia ${goers(api).includes("marcos") ? "el cobertizo" : "el coche"}. Llega. Se para.

Dos minutos.

Y la linterna no vuelve hacia la casa. Gira. Hacia el coche. Hacia el camino.

Nora: ¡Marcos!

Se para. Se gira. Ves la linterna girar hacia ti, y detrás de la linterna nada, porque la linterna te ciega, y en el centro de la luz una mano levantada, con la palma abierta, como quien dice «un momento».

Y la linterna se va por el camino.

Y se va de la luz.`;
      return `${inicio}
${sale}

...

La puerta entornada. El frío entrando hasta la tabla. La bombilla del porche con sus polillas dando vueltas, siempre en el mismo sentido.

Y nadie en el porche.

${h === "marcos" && p === "alex" ? "Marcos no se ha levantado. Marcos, que se levanta para todo, está sentado con las manos en la mesa mirando la puerta abierta como se mira una cosa que ya sabías." : h === "irene" ? "Irene no ha gritado. Irene, que grita con las ramas, mira la puerta abierta y traga, con la mano en el cuello, y dice bajo: «Ya.»" : "Irene ha gritado su nombre. Álex ha gritado su nombre. Tú también. La bombilla del porche sigue encendida, con sus polillas, y nadie."}

${modo(api, "nora", {
  lucido: `~ Ha levantado la mano. «Un momento.» Con su cara. Con su gesto. Y ha bajado a la grava como se baja a por algo que se te ha caído. No ha huido. Ha ido. Eso es lo que no me cuadra: que ha ido.`,
  asustado: `~ Se ha ido de la luz. ${N[p]}. Con la palma abierta. Como se despide alguien que va a volver. Y no va a volver. Lo sé como sé la hora.`,
  tenso: "~ Un minuto. Ha dicho un minuto. Voy a contar sesenta segundos y a los sesenta salgo yo.",
  ido: "~ Las polillas han cambiado de sentido. Cuando ha bajado el escalón. Ahora van al revés. Nunca van al revés.",
  perdido: "~ Le han llamado. Le llevan llamando desde que volvió. Y ha ido. Como se va a una mesa cuando dicen tu nombre.",
  normal: "~ Sesenta segundos. Y luego la linterna, y luego Marcos, y luego los cuatro en la puerta gritando. Sesenta.",
})}

...`;
    },
    opciones: [{ texto: "Continuar", a: "viii1_ausencia" }],
  },

  });
})();
