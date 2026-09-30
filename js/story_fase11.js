/*
 * LA BRUJA — PRÓLOGO
 * Fase XI: La niña, la anomalía espacial y la tercera muerte (HORROR_STAGE 5) · Biblia §5 (XI), §17, §18, §20, §23.1
 *
 * Quedan dos: Nora y el último, que lleva el huésped. La puerta del porche, abierta desde dentro, da al
 * pasillo de arriba: la única anomalía espacial del prólogo. «La puerta deja de dejarte salir», al pie de la
 * letra. Arriba, la niña: clara, por fin. El cuerpo cosido, los párpados, los dientes de más, la
 * campanilla. Parece pedir ayuda. Muerde y desgarra: incapacita antes de matar. Primera vuelta: no se puede
 * matar. La huida. Y el último ataque del huésped a Nora, en la puerta del almacén, que acaba con la tercera
 * muerte: a manos de Nora, o de la niña. El último aliento va a Nora.
 *
 * Se consume de la X: muerto_*, huesped (el último), intimo_tono, x7_ultimo, huesped_atado, heridas, mano_*.
 * Se deja para la XII: muerto del último (muerte_*), huesped = "nora", nina_vista, mordisco, ofrendas,
 * xi_final (como murió el último), nora_mato.
 *
 * Presupuesto de anomalías Fase XI: 6 (la niña y la puerta no cuentan: son el hito)
 */
(() => {
  const R = () => HISTORIA.R;
  const modo = (api, id, m) => m[api.modo(id)] || m.normal;
  const H = (api) => api.bandera("huesped");
  const N = { nora: "Nora", marcos: "Marcos", alex: "Álex", irene: "Irene" };
  const fem = (id) => id === "nora" || id === "irene";
  const y = (id) => (id === "irene" ? "e " : "y ") + N[id];
  const Y = (id) => (id === "irene" ? "E " : "Y ") + N[id];
  const U = (api) => R().ultimo(api) || "marcos";
  // El tercero una vez muerto: lo que registró terceraMuerte; si no, el último aliento; si no, el último por orden de muerte
  const UM = (api) => api.bandera("ultimo_muerto") || api.bandera("huesped_anterior") || porOrden(api)[porOrden(api).length - 1] || "marcos";
  const porOrden = (api) => R().muertos(api).slice().sort((a, b) => ((R().muerte(api, a) || {}).orden || 0) - ((R().muerte(api, b) || {}).orden || 0));
  const llaveFuera = (api) => { const q = R().quienLleva(api, "llave"); return Boolean(q && q !== "nora"); };   // alguien se llevó la llave inglesa en el bolsillo
  const armaAlmacen = (api) => R().mano(api, "nora") || (llaveFuera(api) ? "martillo" : "llave");   // con qué se defiende Nora en el almacén
  // Lo que Nora puede coger en el salón: el atizador, salvo que lo tenga el último en la mano (o con herida en la mano, la sartén no: §23.4)
  const armaSalon = (api) => { const q = R().quienLleva(api, "atizador"); return q && q !== "nora" && R().vivo(api, q) ? "sarten" : "atizador"; };
  // Lo que Nora recuerda de cada uno: lo de siempre, y lo de la V solo si pasó con ella
  const recuerdo = (api, u) => {
    const con = api.bandera("v_nora_con");
    if (u === "marcos") return "Marcos. El del primer domingo con la boca abierta. El de la rodilla debajo de la mesa. " + (con === "marcos" ? "El que me sujetó por la cintura en los dos últimos peldaños." : api.bandera("v_marcos_libre") ? "El que bajó al almacén a las tres y media a arreglar la luz para que no nos quedáramos a oscuras." : "El que dijo «madera vieja» cuando se movió el péndulo.");
    if (u === "irene") return "Irene. La que se ahogó en la mesa. La que va descalza desde las doce. " + (con === "irene" ? "La que me dijo lo de la camisa. La que gritó «hay alguien debajo» conmigo en la buhardilla." : "La que me leía como se lee un libro, y acertaba.");
    return "Álex. El que contó la leyenda con la boca llena de cerveza. El que llevó el vaso toda la noche y no eligió las palabras. " + (api.bandera("v_nora_porche") ? "El de «tú no eres una lámpara»." + (api.bandera("nora_pregunta") === "manipula" ? " El que me contó lo de Rubén en el porche, como quien no quiere la cosa." : "") : "El que me dijo «confía en mí» y lo decía en serio.");
  };

  Object.assign(HISTORIA.presupuestoAnomalias, { XI: 6 });
  Object.assign(HISTORIA.deriva, { XI: { estres: 1, miedo: 0.8 } });

  const saltoPrevio = HISTORIA.prepararSalto;
  HISTORIA.prepararSalto = (api, id) => {
    if (typeof saltoPrevio === "function") saltoPrevio(api, id);
    if (!/^xi\d/.test(id)) return;
    R().saltoBase(api);
    if (!api.bandera("fase10_completa")) {
      const h = H(api);
      const d = h === "marcos" ? "alex" : "marcos";
      ["fase6_completa", "fase7_completa", "fase8_completa", "fase9_completa", "fase10_completa", "evento_imposible", "luz_vuelta", "apagon", "video_mesa_visto", "las_siete", "puerta_no_abre"].forEach((f) => api.marcar(f, true));
      api.marcar("generador_quien", d); api.marcar("primer_cruce", d); api.marcar("desaparecido", d);
      api.marcar("fase_actual", "VIII"); R().cruzar(api, d); R().matar(api, d, d === "alex" ? "bosque" : "coche", d === "alex" ? "el terraplén bajo los pinos" : "el camino, contra el pino grande", "nora"); api.marcar("cuerpo_" + d, d === "alex" ? "terraplen" : "coche");
      const s = h === "marcos" ? "irene" : (d === "alex" ? "marcos" : "alex");
      api.marcar("fase_actual", "X"); R().matar(api, s, s === "irene" ? "banera" : s === "alex" ? "bosque" : "coche", s === "irene" ? "la bañera del baño de arriba" : s === "alex" ? "la grava, a diez metros del porche" : "el pino grande de la entrada, dentro del coche", "nora"); api.marcar("segundo_muerte", s); api.marcar("cuerpo_" + s, s === "irene" ? "banera" : s === "alex" ? "bosque" : "coche");
      api.marcar("intimo_tono", h === "marcos" ? "pareja" : h === "irene" ? "espina" : "distancia");
    }
    R().fase(api, "XI", 5, 3);
    ofrendasRetro(api);
    if (/^xi[3-6]/.test(id) && !api.bandera("nina_vista")) { api.marcar("nina_vista", true); api.marcar("xi2_ultimo", "delante"); }
    if (/^xi[5-6]/.test(id) && !api.bandera("xi_final")) { api.marcar("xi_final", "nina"); }
    if (/^xi[5-6]/.test(id) && R().vivo(api, U(api))) terceraMuerte(api);
  };

  // Lo ya dado que no se contó: el hueso (cualquier caída), el recuerdo (los lapsos)
  function ofrendasRetro(api) {
    if (["nora", "marcos", "alex", "irene"].some((p) => R().herido(api, p, "cojera"))) R().ofrenda(api, "hueso");
    if ((api.bandera("lapsos") || 0) >= 2 || R().nivel(api) >= 3) R().ofrenda(api, "recuerdo");
  }
  function terceraMuerte(api) {
    const u = U(api);
    if (!R().vivo(api, u)) return;
    const f = api.bandera("xi_final") || "nina";
    const como = f === "mata" ? "amigo" : "nina";
    R().matar(api, u, como, "la puerta del almacén", "nora");
    if (f === "mata") api.marcar("mato_nora", u);
    api.marcar("cuerpo_" + u, "almacen");
    api.marcar("ultimo_muerto", u);   // el tercero, por su nombre: huesped_anterior puede venir de la IX si el aliento ya cambió de cuerpo
    // El último aliento va a Nora, siempre (regla oculta, §18). Si R.matar no lo pasó, se pasa.
    if (H(api) !== "nora") { api.marcar("huesped_anterior", H(api)); api.marcar("huesped", "nora"); }
    R().subirNivel(api, 3);
    api.marcar("fase11_completa", true);
  }

  Object.assign(HISTORIA.escenas, {

  // =====================================================================
  // FASE XI — LA NIÑA
  // =====================================================================

  xi1_puerta: {
    pov: "nora",
    fondo: "assets/fondos/pasillo_hostil.jpg",
    ambiente: "arriba",
    musica: "terror",
    lugar: "la puerta", hora: "07:12",
    titulo: "La niña · La puerta",
    alEntrar: (api) => {
      R().fase(api, "XI", 5, 3);
      R().tick(api);
      ofrendasRetro(api);
      api.marcar("anomalia_espacial", true);
      api.presenciar("nora", 3); api.presenciar(U(api), 2);
      api.marcar("fase11_empezada", true);
    },
    texto: (api) => {
      const u = U(api);
      const h = H(api);
      const atado = api.bandera("huesped_atado") && api.bandera("x7_ultimo") === "atame";
      return `
Las siete y doce. El gris.

Nora: Nos vamos.

${N[u]}: La puerta no abre.

Nora: Pues probamos otra vez. Y otra. Hasta que abra o hasta que la tire.

${atado ? "Le desatas. Las manos. El cinturón. " + N[u] + " se frota las muñecas y no te mira, y no dice nada, y le coges de la mano porque es lo que hay." : "Le coges de la mano. Es lo que hay."}

La puerta principal. La llave. Gira. El cerrojo sale con su ruido de hierro viejo.

Y tiras.

Y la puerta viene.

Así. Sin peso. Como viene una puerta. Se abre hacia dentro con el chirrido de siempre, y entra el frío, y entra el gris, y entra el olor.

Y no es el porche.

Es el pasillo.

El de arriba. Con la lámpara de llama falsa haciendo su ciclo. Con la alfombra roja, larga, que se hunde. Con la trampilla, abierta, y la escalera plegable desplegada hasta la alfombra. Con la puerta del baño al fondo, cerrada, con la luz encendida por debajo.

Desde la planta baja, por la puerta principal, el pasillo del primer piso. Como si la casa se hubiera doblado por la mitad.

${N[u]}: No.

Nora: Es el pasillo.

${N[u]}: No. No. No.

Miras atrás. El salón. La mesa. Las sillas. La escalera que sube hacia el pasillo que tienes delante. Miras delante. El pasillo. Con la escalera que baja, a la izquierda, hacia el salón donde estás.

~ La puerta deja de dejarte salir. Lo dijo Álex. No lo dijo entero. La puerta deja de dejarte salir y te deja subir. Solo subir.

Das el paso.

Porque es lo que hay. Porque detrás no hay nada y delante hay algo, aunque sea esto. La alfombra bajo el pie. Se hunde. Es la alfombra. Roja. Húmeda. Con el hilo de agua que baja desde el baño.

${Y(u)} detrás. ${h === u ? "Sin que tires. Entra como quien vuelve a su casa." : "Porque le tiras de la mano."}

Y la puerta, detrás, se cierra. Sola. Y cuando te giras no es la puerta principal: es la puerta del baño. Cerrada. Con la luz por debajo.

Estáis arriba. Habéis salido y estáis arriba.

${modo(api, "nora", {
  lucido: "~ Una puerta que da a un pasillo que está encima de la puerta. No es una ilusión: he pisado la alfombra, he olido el agua. La casa no se molesta en parecer una casa desde hace una hora. Ahora tampoco se molesta en parecer un sitio.",
  asustado: "~ Nos ha subido. Con la puerta. Como se sube a alguien en un ascensor que no ha pedido.",
  tenso: "~ Arriba. Vale. Arriba también hay escalera. Bajar. Buscar otra puerta. Cualquiera.",
  ido: "~ La casa está doblada. Como un papel. Y nosotros en el doblez, donde se juntan las dos mitades.",
  perdido: "~ Nos ha traído donde empezaron las huellas. Para que veamos a quién eran.",
  normal: "~ Arriba. Vale. Vale. Pues arriba. Y de arriba, abajo, y de abajo, fuera. Se puede.",
})}

Y en la trampilla, en el rectángulo negro, con la escalera bajada hasta la alfombra:

[campanilla]

Tin.`;
    },
    opciones: [
      { texto: "Bajar. La escalera. Al salón. Ya.", a: "xi2_nina",
        efecto: (api) => { api.marcar("xi1_nora", "bajar"); api.est("nora", "estres", 4); } },
      { texto: "Mirar la trampilla. Con la linterna. Solo mirar.", a: "xi2_nina", lucida: true,
        efecto: (api) => { api.marcar("xi1_nora", "mira"); api.est("nora", "lucidez", 1); api.est("nora", "miedo", 4); } },
      { texto: (api) => "Ponerte delante de " + N[U(api)] + ". Entre " + (fem(U(api)) ? "ella" : "él") + " y la trampilla.", a: "xi2_nina",
        efecto: (api) => { const u = U(api); api.marcar("xi1_nora", "delante"); api.rel(u, "nora", "afecto", 4); api.est("nora", "eje", 2); } },
      { texto: "Escribir. De pie. «07:12. La puerta da arriba.»", a: "xi2_nina", lucida: true,
        efecto: (api) => { api.marcar("xi1_nora", "escribe"); api.evidencia("cuaderno_puerta_arriba", "nora", "cuaderno de Nora", "nota"); api.est("nora", "lucidez", 1); } },
    ],
  },

  xi2_nina: {
    pov: (api) => U(api),
    fondo: "assets/fondos/buhardilla_soga.jpg",
    titulo: "La niña · Ella",
    hora: "07:15",
    alEntrar: (api) => {
      R().tick(api);
      const u = U(api);
      api.marcar("nina_vista", true);
      api.saber(u, "nina"); api.saber("nora", "nina");
      api.presenciar(u, 3); api.presenciar("nora", 3);
      api.marcar("nina_muerde", R().ofrendas(api) >= 5);   // cinco ofrendas: la casa alimentada (§23.1)
      if (H(api) === u) R().lapso(api);
    },
    texto: (api) => {
      const u = U(api);
      const h = H(api);
      const x1 = api.bandera("xi1_nora");
      const muerde = api.bandera("nina_muerde");
      const inicio = x1 === "bajar" ? "Nora tira de ti hacia la escalera. Hacia abajo. El primer escalón." : x1 === "mira" ? "Nora enciende la linterna. La sube. Hacia el rectángulo negro de la trampilla." : x1 === "delante" ? "Nora se pone delante de ti. Entre tú y la trampilla. Con la espalda hacia ti. Nora, que pesa la mitad que tú." : "Nora escribe. De pie. Con el cuaderno contra la pared. Y la letra le sale de otra.";
      return `
${inicio}

Y baja.

Por la escalera plegable. Un pie. Descalzo. Pequeño. Con los dedos. Con el arco marcado, como los pies mojados en una piscina. Y otro. Y las piernas.

Una niña.

De ocho años. De nueve. Con un vestido que fue blanco. Con las piernas de dos colores, como si fueran de dos niñas, y la costura en la rodilla, con hilo negro, con puntadas cortas, apretadas. Con los brazos igual. Con las manos igual: una más grande que la otra.

Baja el último peldaño. Se queda en la alfombra. A tres metros.

Y levanta la cara.

Los párpados. Cosidos. Con hilo negro, de arriba abajo, sobre los ojos, que se mueven debajo. Y la boca.

La boca sonríe.

Y tiene demasiados dientes. Lo dijo Álex con la lengua en los suyos: demasiados. Dos filas. Tres. Pequeños. Blancos. Hasta donde no llega una boca.

Y en la mano más grande, una campanilla. Sin badajo. Que suena.

[campanilla]

Tin.

${h === u ? `Y dentro de ti, lo que llevas dentro se mueve. Como se mueve un perro cuando entra su dueño. Y te llega, con tu voz, con la voz de debajo:

~ Ella.

Y no sabes si es tuya la palabra o es de lo que lleva la campanilla.` : ""}

Ayúdame.

Lo dice. Con voz de niña. Con voz de niña que lleva mucho tiempo sin usarla. Y da un paso.

Ayúdame.

Con la voz de ${N[porOrden(api)[0]]}. Exacta. Con su ritmo.

Ayúdame.

Con la voz de ${N[porOrden(api)[1] || porOrden(api)[0]]}.

Y da otro paso. Y otro. Y huele. A dulce. A lo del armario y la buhardilla y el almacén. A lo que fue fruta. A lo que se quedó mucho tiempo en un sitio cerrado.

~ No pide ayuda. Lo dijo Álex: parece pedir ayuda. Parece. Es lo que hace.

${muerde ? `Y llega.

Es rápida como no es rápida una niña. Un paso y está en tu mano. La mano. La coge con las dos suyas, la grande y la pequeña, y la boca se abre más de lo que se abre una boca, y los dientes entran.

En la mano. Hasta el hueso. Y no muerde como muerde un animal, de una vez: muerde como se come. Cierra, y tira, y algo se queda en la boca que era tuyo.

El grito no es tuyo. Es de Nora.

Y la niña levanta la cara, con la boca roja, y sonríe con todos los dientes, y suelta.` : `Y se para.

A un metro. Con la campanilla en alto. Con la cara levantada hacia ti. Y huele. Te huele, como huele un perro. Y luego a Nora. Y luego a ti.

Y sonríe. Y se queda ahí. Como quien espera algo que todavía no está listo.`}

${modo(api, u, {
  lucido: `~ Una niña cosida con demasiados dientes. La de la historia de Álex. Con los pies de las huellas. Con la campanilla de la muñeca. Todo lo de esta noche junto, en la alfombra, a tres metros. Y ${muerde ? "me ha comido la mano" : "me huele"}. Ya no hay nada que explicar y por primera vez no quiero explicarlo: quiero bajar.`,
  asustado: `~ Demasiados dientes. Lo dijo Álex. Lo dijo con la lengua. Y ahora ${muerde ? "los tengo en la mano" : "los tengo a un metro"}.`,
  tenso: "~ Abajo. Abajo. Con Nora. Con la mano o sin ella. Abajo.",
  ido: "~ Los ojos se le mueven debajo del hilo. Me miran desde debajo. Como se mira desde debajo del agua.",
  perdido: `~ ${h === u ? "Ella. Es ella. Y lo que llevo dentro la conoce. Se ha puesto de pie por dentro para saludarla." : "Ha venido a por el tres. A oler cuál es. Y me ha olido a mí."}`,
  normal: "~ Nora. Nora, abajo. Nora, corre. Nora.",
})}`;
    },
    opciones: [
      { texto: "Apartar a Nora. Ponerte delante. Que te huela a ti.", a: "xi3_huida",
        efecto: (api) => { const u = U(api); api.marcar("xi2_ultimo", "delante"); api.rel("nora", u, "afecto", 6); api.rel("nora", u, "confianza", 6); api.est(u, "eje", 3); if (api.bandera("nina_muerde")) R().herir(api, u, "mano", "mordisco"); } },
      { texto: "Huir. Escalera abajo. Tirando de Nora.", a: "xi3_huida",
        efecto: (api) => { const u = U(api); api.marcar("xi2_ultimo", "huye"); api.est(u, "estres", 6); if (api.bandera("nina_muerde")) R().herir(api, u, "mano", "mordisco"); } },
      { texto: "Cogerla. Es una niña. Cogerla en brazos.", a: "xi3_huida", impulsiva: true,
        efecto: (api) => { const u = U(api); api.marcar("xi2_ultimo", "coge"); if (api.bandera("nina_muerde")) R().herir(api, u, "mano", "mordisco"); api.est(u, "miedo", 10); api.presenciar(u, 2); } },
      { texto: "«Aquí está.» Señalar a Nora. Con la mano que te queda.", a: "xi3_huida", si: (api) => H(api) === U(api), impulsiva: true,
        efecto: (api) => { const u = U(api); api.marcar("xi2_ultimo", "ofrece"); R().alimentar(api, 3); api.rel("nora", u, "confianza", -30); api.saber("nora", u + "_me_ofrecio"); api.est("nora", "miedo", 10); if (api.bandera("nina_muerde")) R().herir(api, u, "mano", "mordisco"); } },
    ],
  },

  xi3_huida: {
    pov: "nora",
    fondo: "assets/fondos/pasillo_horror.jpg",
    ambiente: "interior",
    titulo: "La niña · La huida",
    hora: "07:18",
    alEntrar: (api) => { R().tick(api); api.presenciar("nora", 2); api.est("nora", "estres", 8); },
    texto: (api) => {
      const u = U(api);
      const h = H(api);
      const x2 = api.bandera("xi2_ultimo");
      const mord = R().herido(api, u, "mano");
      const inicio = x2 === "delante" ? `${N[u]} te aparta. Con el brazo. Se pone delante. Entre tú y ella. ${mord ? "Con la mano que ya no es una mano, goteando en la alfombra." : "Con las manos abiertas, como se para un coche."}\n\nY la niña le huele. Y sonríe. Y no le mira a él: te mira a ti por encima de su hombro.` : x2 === "huye" ? `${N[u]} tira de ti. Hacia la escalera. El primer escalón. El segundo. ${mord ? "Con la mano que ya no es una mano dejando un rastro en la barandilla." : ""}\n\nY la niña no corre. Anda. Detrás. Al ritmo de la campanilla.` : x2 === "coge" ? (mord ? `${N[u]} la coge. En brazos. Como se coge a una niña. Y la niña se deja. Y le rodea el cuello con los brazos de dos colores. Y le muerde.\n\nLa mano. La que la sujeta por debajo. Hasta el hueso. ${Y(u)} la suelta, y la niña cae de pie, y sonríe con la boca roja.` : `${N[u]} la coge. En brazos. Como se coge a una niña. Y la niña se deja. Y le rodea el cuello con los brazos de dos colores. Y le huele. El cuello. Donde estaban las cuatro marcas de los otros.\n\nY se descuelga. Como se descuelga un gato. Cae de pie. Y sonríe.`) : `${N[u]}: Aquí está.\n\nLo dice señalándote. Con la mano. Con su voz. Mirándote. Y la niña te mira. Y da un paso hacia ti.\n\nY se para. A un palmo. Te huele. Y sonríe. Y dice, con la voz de ${N[u]}:\n\nTodavía no.`;
      return `
${inicio}

Bajáis. La escalera. El tercero. El séptimo. Sin contarlos. La barandilla, la alfombra, el salón.

Y la niña baja detrás.

No por la escalera. Por el techo. Como bajan las cosas de esta casa que no caen. Con las manos y los pies en la madera del techo, boca abajo, con el vestido colgando, con la campanilla sonando a cada mano.

[campanilla]

Tin.

[campanilla]

Tin.

El salón. La mesa. Las sillas vacías. La tabla en su caja. ${api.bandera("nora_toma_muneca") ? "La muñeca con los ojos cosidos, que ahora tiene una hermana en el techo." : ""} La puerta principal, que ya no es una puerta. Las ventanas grises.

Y la niña se para. En el techo. Encima de la lámpara. Exactamente encima. Donde se pararon los pasos a las cuatro. Y se queda ahí, boca abajo, mirándoos con los párpados cosidos, sonriendo.

${Y(u)} no corre.

Se ha parado. En mitad del salón. Mirando el arco de la cocina. La puerta del almacén, al fondo, al lado de la nevera.

${h === u ? `${N[u]}: Abajo.

Lo dice bajo. Con su voz. Sin mirarte.

Nora: ${N[u]}.

${N[u]}: Abajo. Con ella. Es donde hay que ir.

Y no es ${fem(u) ? "ella" : "él"}. Y es su boca.` : `${N[u]}: La puerta del almacén.

Nora: ¿Qué?

${N[u]}: Es la única que no ha cambiado. Es la única puerta de esta casa que sigue siendo una puerta.

Y tiene razón. Eso es lo peor: que tiene razón.`}

${modo(api, "nora", {
  lucido: `~ En el techo. Como los pasos. Como la mujer. Todo lo de esta noche tiene el mismo sitio: arriba. ${Y(u)} mira abajo. Es lo único que queda: abajo.`,
  asustado: "~ Está encima de la lámpara. Mirándonos como se mira un fuego. Y sonríe porque sabe cuál es el tres.",
  tenso: "~ La ventana de la cocina. La del almacén. Cualquier hueco. Cualquiera que no sea abajo.",
  ido: "~ La campanilla suena al ritmo de mi nombre. No-ra. No-ra. Como el vaso. Como todo.",
  perdido: "~ Nos lleva abajo. Con la campanilla. Como se lleva a los niños a casa cuando cae el sol.",
  normal: `~ ${N[u]}. ${N[u]}, mírame. Mírame a mí y no a la puerta.`,
})}`;
    },
    opciones: [
      { texto: (api) => "Cogerle la cara a " + N[U(api)] + ". Con las dos manos. «Mírame.»", a: "xi4_ultimo",
        efecto: (api) => { const u = U(api); api.marcar("xi3_nora", "cara"); R().contacto(api, "nora", u, 2); api.est(u, "lucidez", 3); } },
      { texto: (api) => "Coger " + (R().mano(api, "nora") ? R().OBJETOS[R().mano(api, "nora")] : armaSalon(api) === "sarten" ? "la sartén. Del fregadero, del fuego, de donde esté" : "el atizador de la chimenea") + ". Y no soltarlo.", a: "xi4_ultimo",
        efecto: (api) => { api.marcar("xi3_nora", "arma"); if (!R().mano(api, "nora")) R().coger(api, "nora", armaSalon(api)); api.est("nora", "eje", 2); } },
      { texto: "Ir a la ventana de la cocina. Con la silla. Con la cabeza. Con lo que sea.", a: "xi4_ultimo",
        efecto: (api) => { api.marcar("xi3_nora", "ventana"); api.est("nora", "estres", 6); api.saber("nora", "ventanas_cerradas"); } },
      { texto: "Mirar a la niña. A los párpados. Y decirle su nombre. El que sabes.", a: "xi4_ultimo", lucida: true, si: (api) => api.bandera("alda_visto"),
        efecto: (api) => { api.marcar("xi3_nora", "alda"); api.saber("nora", "dije_alda"); R().ofrenda(api, "nombre"); api.est("nora", "miedo", 6); api.est("nora", "lucidez", 2); } },
    ],
  },

  xi4_ultimo: {
    pov: "nora",
    fondo: "assets/fondos/almacen.jpg",
    ambiente: "almacen",
    musica: "terror",
    lugar: "almacén", hora: "07:22",
    titulo: "La niña · El último",
    alEntrar: (api) => { R().tick(api); const u = U(api); R().aSolas(api, "nora"); api.presenciar("nora", 3); api.est(u, "lucidez", -8); },
    texto: (api) => {
      const u = U(api);
      const h = H(api);
      const x3 = api.bandera("xi3_nora");
      const obj = R().mano(api, "nora");
      const inicio = x3 === "cara" ? `Le has cogido la cara. Con las dos manos. «Mírame.» Y te ha mirado. Un segundo. Con su cara. Con ${u === "marcos" ? "la cara del primer domingo" : u === "irene" ? "la cara de debajo de la cara" : "la cara de sin cámara"}. Y luego la cara se ha ido a otro sitio, detrás de los ojos, y lo que ha quedado mirándote no era.` : x3 === "arma" ? `Tienes ${R().OBJETOS[obj] || "el atizador"} en la mano. Pesa lo que pesa. ${Y(u)} lo ha visto y no ha dicho nada.` : x3 === "ventana" ? `La ventana de la cocina no se rompe. Ninguna. Ya lo sabías. Lo has hecho igual, con la silla, con la cabeza, hasta que ${N[u]} te ha cogido del brazo.` : `Le has dicho el nombre. Alda. A la niña del techo. Y la niña ha dejado de sonreír. Un segundo. Y luego ha sonreído más, con más dientes, y ha bajado un palmo.`;
      return `
${inicio}

El almacén.

No has decidido venir. Has venido. ${h === u ? "Detrás de " + N[u] + ", que ha cruzado el arco de la cocina como quien va a lo suyo." : "Detrás de " + N[u] + ", que ha dicho «la única puerta» y ha cruzado el arco."} La luz de tubo. La sartén en el fregadero, ${api.bandera("sarten_tirada") ? "bajo el agua, humeando bajo el agua" : "en el fuego, humeando sin fuego"}. La puerta del almacén. El escalón de piedra. El frío que sube.

Y la estantería. Apartada. La puerta antigua, baja, con clavos. Y el candado.

Abierto.

Colgando del arco, abierto, como si alguien lo hubiera dejado así para que no hubiera que buscar la llave.

${N[u]}: Ahí.

Y se gira.

Y las manos.

Suben. Las dos. ${R().herido(api, u, "mano") ? "La que es una mano y la que ya no." : ""} Despacio. A la altura de tu cuello. Con la cara de la mesa, la de la cocina, la de la escalera. Con «${R().intrusion(api, u, 3)}» en la boca, bajo, a nadie.

Y cierran.

Como en la cocina. Como a los otros. Los dedos alrededor, apretando. Y te empuja contra la estantería, contra los tarros, que caen, que se rompen, y el olor a tierra y a dulce, y la puerta baja detrás, abierta, con la escalera de piedra bajando hacia el negro.

~ ${N[u]}. Soy yo. Soy yo, ${N[u]}.

Y ${fem(u) ? "ella" : "él"} lo sabe. Se le ve saberlo. Y aprieta.

Y la niña baja. Por la pared. Con la campanilla. Despacio. A ver.

${obj ? `${R().OBJETOS[obj].charAt(0).toUpperCase() + R().OBJETOS[obj].slice(1)}. En la mano. Lo notas antes de pensarlo.` : "Nada en la mano. La caja de herramientas, en el estante, a un palmo. " + (llaveFuera(api) ? "La llave inglesa no está: se la llevó " + N[R().quienLleva(api, "llave")] + ". El martillo, sí." : "La llave inglesa.") + " Lo notas antes de pensarlo."}

${modo(api, "nora", {
  lucido: `~ Me está matando ${N[u]}. La única persona que me queda. Con la niña mirando. Y sé que no es ${fem(u) ? "ella" : "él"}, y saberlo no me sirve para el aire, y tengo algo en la mano.`,
  asustado: "~ El tres. Yo no era el tres. Me dijo todavía no. Y ahora me aprieta como si ya.",
  tenso: "~ Pégale. Con todo. Con la llave. Con la estantería. Pégale.",
  ido: "~ La niña mira desde la pared. Con los párpados cosidos. Y sonríe porque va a ver el final. Como se mira un fuego.",
  perdido: "~ Me lleva abajo. Con las manos. Es como se lleva a alguien abajo: por el cuello.",
  normal: `~ ${N[u]}. Joder, ${N[u]}. Suelta. Suelta. Suelta.`,
})}`;
    },
    opciones: [
      { texto: (api) => "Herir. Con " + R().OBJETOS[armaAlmacen(api)] + ". Hasta que no se levante.", a: "xi5_tercera",
        efecto: (api) => { const a = armaAlmacen(api); api.marcar("xi_final", "mata"); api.marcar("nora_mato", true); api.marcar("arma_xi", a); R().coger(api, "nora", a); api.est("nora", "estres", 15); api.est("nora", "lucidez", -6); } },
      { texto: (api) => "Herir. Con " + R().OBJETOS[armaAlmacen(api)] + ". Lo justo. Que suelte.", a: "xi5_tercera",
        efecto: (api) => { const a = armaAlmacen(api); api.marcar("xi_final", "hiere"); api.marcar("arma_xi", a); R().coger(api, "nora", a); api.est("nora", "estres", 10); } },
      { texto: "Huir. Por la escalera de piedra. Abajo. Donde no llegue.", a: "xi5_tercera", impulsiva: true,
        efecto: (api) => { api.marcar("xi_final", "huye"); api.marcar("nora_bajo_antes", true); api.est("nora", "miedo", 10); } },
      { texto: (api) => "No defenderte. Mirar" + (fem(U(api)) ? "la" : "le") + ". Es la última persona que te queda.", a: "xi5_tercera",
        efecto: (api) => { api.marcar("xi_final", "quieta"); api.est("nora", "estres", 8); api.est("nora", "eje", -4); } },
    ],
  },

  xi5_tercera: {
    pov: "nora",
    fondo: "assets/fondos/almacen.jpg",
    titulo: "La niña · La tercera",
    hora: "07:25",
    alEntrar: (api) => { R().tick(api); terceraMuerte(api); api.presenciar("nora", 3); },
    texto: (api) => {
      const u = UM(api);
      const f = api.bandera("xi_final");
      const arma = R().OBJETOS[api.bandera("arma_xi") || armaAlmacen(api)];
      const la = fem(u) ? "la" : "le";
      if (f === "mata") return `
${arma.charAt(0).toUpperCase() + arma.slice(1)}. En la mano. Y la levantas, y baja.

En la cabeza. De lado. Un ruido de hueso. ${N[u]} suelta. Se va hacia atrás con la mano en la sien, y entre los dedos, sangre, y la cara, la suya, un segundo, mirándote.

Y otra vez.

Y otra.

No cuentas. Cuentas después. En el momento no hay números: hay ${fem(u) ? "ella" : "él"} contra la piedra del escalón, y el ruido, y las manos que ya no suben, y otra vez, porque si paras se levanta, porque si paras vuelve a tener esa cara.

Y paras.

${N[u]} en el suelo del almacén. Con la cabeza en el escalón de piedra. Con la cara hacia arriba. Con la cara suya, por fin, la de siempre, sin nada dentro. Con los ojos abiertos.

~ ${recuerdo(api, u)} ${fem(u) ? "La" : "Le"} he matado yo. Con esto. Y tengo la mano llena de lo suyo.

Y algo sale.

No lo ves. Lo notas. Como cuando se te destapa un oído. Un aire que sale de la boca abierta de ${N[u]} y sube, y tú tienes la boca abierta de respirar, y entra.

Frío. Baja. Garganta. Pecho. Debajo del esternón. Y se queda.

~ Aliento.

Eso ha llegado. Con tu voz. Sin que lo pensaras.

Y la niña, en la pared, sonríe. Y baja el último palmo. Y pasa a tu lado. Rozándote. Y entra por la puerta antigua, y baja la escalera de piedra, con la campanilla.

[campanilla]

Tin.

Y ya.

${modo(api, "nora", {
  lucido: `~ Tres. ${fem(u) ? "La" : "Le"} he matado yo. Y lo que llevaba ha entrado en mí, y lo sé porque lo he notado entrar, y porque ahora sé una palabra que no sabía: aliento. Es lo último que voy a aprender de esta casa. No. Es lo penúltimo.`,
  asustado: "~ Lo tengo. Debajo del esternón. Frío. Y sé lo que viene porque lo he visto en los otros: primero los lapsos, después las manos.",
  tenso: "~ Tres. Y yo. Y la niña abajo. Y esto dentro. Vale. Vale. Vale.",
  ido: "~ Ha entrado como entra el agua en un vaso: despacio, con el nivel justo. Ahora estoy llena.",
  perdido: "~ Me lo ha dado. Al morir. Como se da un abrigo. Como se lo dieron entre ellos toda la noche. Y ahora es mío y no hay a quién dárselo.",
  normal: `~ ${N[u]}. ${N[u]}, joder. ${N[u]}.`,
})}`;

      if (f === "hiere") return `
${arma.charAt(0).toUpperCase() + arma.slice(1)}. En la mano. Y la levantas, y baja. Una vez. En la sien. Lo justo.

${N[u]} suelta. Se va hacia atrás con la mano en la cabeza y entre los dedos, sangre. Y la cara, la suya. Un segundo.

${N[u]}: Nora.

Con su voz. La de siempre. La de antes de todo.

${N[u]}: Nora, corre.

Y la niña baja el último palmo.

No es rápida como una niña. Es rápida como es rápido lo que se ha estado aguantando toda la noche. Un paso y está en ${N[u]}. En el cuello. Con las dos manos, la grande y la pequeña. Y la boca.

Lo que hace la boca no se puede mirar y lo miras. Cierra, y tira, y algo se queda en ella que era de ${N[u]}. Y otra vez. En el hombro. En la cara. Como se come. Sin prisa, porque ${N[u]} ya no se levanta, porque ${N[u]} te mira mientras, con el ojo que le queda, y te dice con la boca que ya no es una boca:

Corre.

Y no corres. Te quedas. Con ${arma} en la mano. Mirando.

Y cuando la niña levanta la cara, roja hasta los párpados cosidos, sonriendo con todos los dientes, ${N[u]} ya no mira nada.

Y algo sale.

De lo que queda de la boca de ${N[u]}. Un aire. Sube. Y tú tienes la boca abierta de gritar, y entra.

Frío. Baja. Debajo del esternón. Y se queda.

~ Aliento.

Y la niña pasa a tu lado. Rozándote. Y entra por la puerta antigua, y baja, con la campanilla.

[campanilla]

Tin.

${modo(api, "nora", {
  lucido: `~ Tres. Se ${fem(u) ? "la" : "lo"} ha comido delante de mí, despacio, y me ha dejado mirar. Y lo que llevaba ha entrado en mí. Ahora lo sé: se ha estado aguantando toda la noche para esto.`,
  asustado: "~ Me ha dicho corre. Con la cara comida. Y yo con esto en la mano y sin correr.",
  tenso: "~ Tres. Tres. Y abajo. Y yo. Vale. Vale.",
  ido: "~ El aire ha entrado como entra el agua en un vaso. Ahora estoy llena. Ahora lo entiendo todo y no sirve de nada.",
  perdido: "~ Me lo ha dado. Al morir. Y la niña me ha dejado mirar para que supiera lo que tengo.",
  normal: `~ ${N[u]}. ${N[u]}, joder. ${N[u]}.`,
})}`;

      if (f === "huye") return `
Te sueltas. Con las rodillas, con la cabeza, con lo que hay. Y no vas hacia el salón: vas hacia la puerta antigua. La escalera de piedra. Abajo. Porque es el único sitio donde ${N[u]} no está.

Tres escalones. Cuatro. La piedra fría, mojada. Y arriba, en el almacén, el ruido.

No lo ves. Lo oyes. Los pasos descalzos y pequeños. La campanilla. ${Y(u)}, que no baja detrás de ti, que se ha parado, que dice tu nombre con su voz, la de siempre, la de antes de todo:

${N[u]}: Nora.

Y luego no dice nada. Y luego el ruido de la boca. El que hace una boca con demasiados dientes cuando come sin prisa. ${Y(u)} que no grita, porque para gritar hace falta lo que le está quitando.

Subes. No lo decides. Subes los cuatro escalones.

Y lo ves. Lo que queda. En el suelo del almacén, con la cabeza en el escalón y la niña encima, con el vestido rojo hasta las costuras.

${Y(u)} te mira. Con el ojo. Y algo sale de lo que queda de la boca. Un aire. Sube. Y entra en ti.

Frío. Debajo del esternón.

~ Aliento.

Y la niña se levanta. Y pasa a tu lado. Y baja la escalera de piedra por la que has subido. Con la campanilla.

[campanilla]

Tin.

${modo(api, "nora", {
  lucido: "~ He huido hacia abajo y he vuelto arriba para verlo. Como las huellas: bajan y vuelven. Y lo que llevaba ha entrado en mí en el sitio exacto donde no estaba.",
  asustado: `~ ${fem(u) ? "La" : "Le"} he dejado. Con la niña. Y he subido a mirar. Y me ha mirado con el ojo.`,
  tenso: "~ Tres. Y yo. Y la niña abajo, donde iba a esconderme. Vale.",
  ido: "~ El frío ha entrado por la boca abierta. Como entra el agua. Ahora estoy llena.",
  perdido: "~ Me lo ha dado. Al morir. Y he tenido que subir a recogerlo, como se recoge un paquete.",
  normal: `~ ${N[u]}. ${N[u]}, joder. ${N[u]}.`,
})}`;

      // quieta: «Todavía no». La niña se lleva al último.
      return `
No te defiendes.

Le miras. Con las manos en la estantería, con los tarros rotos, con el aire que no entra. Le miras a la cara, a la suya, la de debajo de lo otro, y la buscas, y la encuentras un segundo.

${Y(u)} suelta.

${N[u]}: Todavía no.

Lo dice mirándote. Con la cara tranquila y los ojos en otro sitio.

${N[u]}: Todavía no.

Y las manos bajan. Y ${fem(u) ? "ella" : "él"} se gira. Hacia la niña, que ha bajado de la pared. Que está en el escalón de piedra, con la campanilla, esperando.

Y va.

Como se va a un sitio al que ya has ido. Sin mirar atrás. Un paso. Y la niña levanta las manos, la grande y la pequeña, y le coge la cara. Como se coge la cara a alguien para soplarle dentro.

Y lo que hace después no se puede mirar y lo miras. La boca. Los dientes. Sin prisa. Como se come. ${Y(u)} no grita, porque para gritar hace falta lo que le está quitando, y te mira mientras, con el ojo que le queda, y no dice nada, porque ya lo ha dicho: todavía no.

Y algo sale. De lo que queda de la boca. Un aire. Sube. Y tú tienes la boca abierta de no gritar, y entra.

Frío. Debajo del esternón. Y se queda.

~ Aliento.

Y la niña pasa a tu lado. Rozándote. Con el vestido rojo hasta las costuras. Y baja la escalera de piedra. Con la campanilla.

[campanilla]

Tin.

${modo(api, "nora", {
  lucido: "~ Todavía no. Me lo ha dicho por tercera vez y ha ido a que se lo comieran para decírmelo. Tres. Y lo que llevaba ha entrado en mí. Ahora sé lo que quería decir todavía no: quería decir después.",
  asustado: `~ Ha ido sol${fem(u) ? "a" : "o"}. A la niña. Como se va cuando te llaman. Y me ha dejado esto dentro.`,
  tenso: "~ Tres. Y esto. Y la escalera. Vale. Vale.",
  ido: "~ El frío ha entrado como entra el agua en un vaso. Ahora estoy llena. Ahora sé lo que sabían todos al final.",
  perdido: "~ Me lo ha dado. Como se da un abrigo. Y la niña me ha dejado mirar para que supiera que ahora es mío.",
  normal: `~ ${N[u]}. ${N[u]}, joder. ${N[u]}.`,
})}`;
    },
    opciones: [{ texto: "...", a: "xi6_sola" }],
  },

  xi6_sola: {
    pov: "nora",
    fondo: "assets/fondos/salon_vacio.jpg",
    ambiente: "interior",
    musica: "terror_suave",
    lugar: "comedor", hora: "07:29",
    titulo: "La niña · Sola",
    alEntrar: (api) => {
      R().tick(api);
      api.marcar("fase11_completa", true);
      api.marcar("nora_sola", true);
      R().lapso(api);
      api.est("nora", "lucidez", -4);
    },
    texto: (api) => {
      const u = UM(api);
      const muertos = porOrden(api);
      return `
Sola.

El salón. La mesa. Las cuatro sillas. La tabla en su caja. ${api.bandera("nora_toma_muneca") ? "La muñeca con los ojos cosidos hacia arriba." : ""} Las velas, consumidas hasta el plato. El cuaderno.

Las siete y veintinueve. El gris.

Te sientas. En tu silla. La de las doce y cuarenta, con la rodilla contra la de Marcos, con el mechero dando vueltas entre los dedos. Buscas el mechero en el bolsillo. Está. Le das vueltas.

Y te llega.

~ Abajo.

Con tu voz. Sin que lo pienses. Una palabra sola, en tu cabeza, con tu voz. Como les llegaba a ellos. Ahora lo sé.

~ Abajo.

No es extrañeza. Ya no. Es como llega el hambre: sabes lo que es aunque no lo hayas pedido.

Y la casa, alrededor, se ha quedado quieta. Sin sartén. Sin grifo. Sin arrastre. Como se queda quieta una habitación cuando ya ha pasado lo que tenía que pasar en ella.

${muertos.map((p) => N[p]).join(". ")}. Tres. ${muertos.filter((p) => p !== u).map((p) => N[p] + " en " + ((R().muerte(api, p) || {}).donde || "su sitio")).join(". ")}. ${Y(u)} en el almacén, con la puerta antigua abierta detrás.

~ Los tres salieron. De una manera u otra. Y yo no he salido. Yo llevo toda la noche dentro, con el cuaderno. Y por eso sigo. Y por eso me han guardado.

${modo(api, "nora", {
  lucido: "~ Sola. Con esto dentro. Con una palabra que no es mía y que ahora sé de dónde viene. La noche ha sido una lista y yo soy la última cosa de la lista, y la lista no acaba en mí: acaba abajo.",
  asustado: "~ Abajo. Lo dice con mi voz. Y sé lo que viene: primero las palabras, después las manos. Y no hay nadie a quien ponerle las manos. Solo yo.",
  tenso: "~ Abajo. Abajo. Que se calle. Que se calle mi voz.",
  ido: "~ Estoy llena. Como el vaso cuando llega a la letra. Ahora sé leer.",
  perdido: "~ Me han dejado para el final porque el final es mío. Lo dijo la voz: uno, dos, tres. Y luego paraba. Y luego era yo, sin número.",
  normal: "~ Sola. Con el cuaderno. Vale. Vale. Se apunta y se sigue. Es lo que sé hacer.",
})}

...

El cuaderno. Lo acercas. Lo abres por el principio.`;
    },
    opciones: [{ texto: "Continuar", a: "xii1_cuaderno" }],
  },

  });
})();
