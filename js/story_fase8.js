/*
 * LA BRUJA — PRÓLOGO
 * Fase VIII: Primera desaparición, búsqueda y primera muerte confirmada (HORROR_STAGE 3 → 4)
 * Biblia §5 (VIII), §15 (la regla de fuera), §20 (gore solo en muertes y hallazgos), §21, §22, §23.6
 *
 * La ausencia precede a la certeza. El marcado (desaparecido) ha salido de la luz. El jugador elige
 * vivir su condena desde dentro (tres escenas: el señuelo, fuera, la falsa salida y la muerte) o
 * buscarle desde la luz con los que quedan (tres escenas: la puerta, el borde, el rastro). Las dos
 * ramas dejan las mismas banderas y convergen en el hallazgo. Fuera, la realidad que no ves te mata:
 * el lenguaje es el pasado (la horda con antorchas, solo para Álex; los faros y el coche que vuelve,
 * para Marcos), cada muerte es la consecuencia visible de una decisión tomada bajo una percepción falsa.
 * Después: las grabaciones (lo que nadie vio), la cohesión que se rompe, las voces que devuelven lo dicho.
 *
 * Se consume de la VII: desaparecido, condena_* (relojes), generador_quien, herida_*, oyo_voz_irene,
 * *_miente, animal_abierto, evidencias (video_mesa, video_cobertizo, cuaderno_*).
 * Se deja para la IX: muerto_<x>, muerte_<x>, cuerpo_<x>, segundo_marcado, movil_<x>_hallado,
 * video_mesa_visto, vaso_visto_en_video, culpa_<pj>, voz_devuelta.
 *
 * Presupuesto de anomalías Fase VIII: 5 → antorchas_lejos · faros_coche_vuelta · voz_devuelta · vaso_en_video · sombra_porche
 */
(() => {
  const R = () => HISTORIA.R;
  const modo = (api, id, m) => m[api.modo(id)] || m.normal;
  const H = (api) => api.bandera("huesped");
  const N = { nora: "Nora", marcos: "Marcos", alex: "Álex", irene: "Irene" };
  const D = (api) => api.bandera("desaparecido") || "alex";
  const otro = (api) => D(api) === "alex" ? "marcos" : "alex";
  // Quién busca con Nora: el otro hombre si puede andar y no es el huésped; si no, Irene
  const buscador = (api) => { const o = otro(api); return !R().herido(api, o, "cojera") && R().vivo(api, o) ? o : "irene"; };
  const puedeCruzarBuscador = (api) => H(api) !== buscador(api);

  Object.assign(HISTORIA.presupuestoAnomalias, { VIII: 5 });
  Object.assign(HISTORIA.deriva, { VIII: { estres: 0.6, miedo: 0.5 } });

  const saltoPrevio = HISTORIA.prepararSalto;
  HISTORIA.prepararSalto = (api, id) => {
    if (typeof saltoPrevio === "function") saltoPrevio(api, id);
    if (!/^viii/.test(id)) return;
    R().saltoBase(api);
    R().fase(api, "VIII", 3, 2);
    if (!api.bandera("fase7_completa")) {
      api.marcar("fase6_completa", true); api.marcar("fase7_completa", true); api.marcar("evento_imposible", true); api.marcar("imposible_quien", "alex");
      api.marcar("generador_quien", H(api) === "marcos" ? "alex" : "marcos"); api.marcar("luz_vuelta", true); api.marcar("apagon", true);
      const g = H(api) === "marcos" ? "alex" : "marcos"; R().cruzar(api, g); R().herir(api, g, "sangra", "generador");
      api.marcar("primer_cruce", g); api.marcar("desaparecido", g); R().fuera(api, g, true); api.marcar("desaparecido_hora", "05:06");
    }
    if (/^viii_c/.test(id)) api.marcar("viii_rama", "condena");
    if (/^viii_s/.test(id)) api.marcar("viii_rama", "busqueda");
    if (/^viii[5-9]/.test(id) && !api.bandera("muerto_" + D(api))) { api.marcar("viii_rama", api.bandera("viii_rama") || "busqueda"); resolverCondena(api, false); resolverBusqueda(api, false); }
  };

  // ---------- La condena, se vea o no: el desaparecido muere. Cómo, según quién es. ----------
  function resolverCondena(api, seguida) {
    if (api.bandera("condena_resuelta")) return;
    api.marcar("condena_resuelta", true);
    const d = D(api);
    R().fuera(api, d, true);
    if (!seguida) {
      // Lo que haría él solo: Álex sigue la voz; Marcos coge el coche. Siempre.
      api.marcar("viii_c_decision", d === "alex" ? "voz" : "coche");
      api.marcar("viii_c_final", d === "alex" ? (api.valor("alex", "eje") >= 70 ? "grita" : "corre") : "frena");
    }
    if (d === "alex") { api.marcar("alex_graba_bosque", true); api.evidencia("movil_alex_bosque", "alex", "borde de los pinos, grabando", "video"); }
    else { api.evidencia("coche_volcado", "marcos", "el camino, contra el pino grande", "objeto"); }
  }
  // ---------- La búsqueda, se vea o no: quién sale a mirar, hasta dónde, qué encuentra ----------
  function resolverBusqueda(api, seguida) {
    if (api.bandera("busqueda_resuelta")) return;
    api.marcar("busqueda_resuelta", true);
    const b = buscador(api);
    api.marcar("buscador", b);
    if (!seguida) {
      // Cruza el buscador si tiene el control muy alto y no es el huésped. Nora, si la fascinación no se ha roto y va acompañada.
      const cruza = puedeCruzarBuscador(api) && (b === "marcos" ? api.valor("marcos", "eje") >= 70 : api.valor("alex", "eje") >= 70);
      api.marcar("viii_s_cruza", cruza);
      if (cruza) { R().cruzar(api, b); if (!api.bandera("fascinacion_rota")) R().cruzar(api, "nora"); }
      api.marcar("viii_s_grita", true);
    }
    api.marcar("sombra_porche", api.anomalia("sombra_porche"));
  }
  // ---------- El hallazgo: la muerte se registra aquí si la rama fue la búsqueda ----------
  function hallar(api) {
    const d = D(api);
    if (!api.bandera("muerto_" + d)) R().matar(api, d, d === "alex" ? "bosque" : "coche", d === "alex" ? "el terraplén bajo los pinos" : "el camino, contra el pino grande", "nora");
    api.marcar("cuerpo_" + d, d === "alex" ? "terraplen" : "coche");
    const mm = api.bandera("muerte_" + d); if (mm && !mm.visto_por) { mm.visto_por = "nora"; api.marcar("muerte_" + d, mm); }
    if (d === "alex") { api.marcar("movil_alex_hallado", true); api.marcar("alex_graba_bosque", true); api.evidencia("movil_alex_bosque", "nora", "bolsillo de Nora", "video"); }
    else { api.marcar("coche_hallado", true); }
    api.horror(4);
    R().fuera(api, "nora", false); R().fuera(api, buscador(api), false);
    // El segundo marcado, si lo hay
    const seg = R().marcados(api).find((p) => p !== d && p !== "nora") || null;
    api.marcar("segundo_marcado", seg);
    ["nora", "marcos", "alex", "irene"].forEach((p) => { if (R().vivo(api, p)) { api.saber(p, "muerte_" + d); api.presenciar(p, 3); } });
    api.marcar("fascinacion_rota", true);
  }

  Object.assign(HISTORIA.escenas, {

  // =====================================================================
  // FASE VIII — LA DESAPARICIÓN
  // =====================================================================

  viii1_ausencia: {
    pov: "nora",
    fondo: "assets/fondos/porche.jpg",
    ambiente: "exterior",
    musica: "terror",
    lugar: "porche", hora: "05:09",
    titulo: "La desaparición · La ausencia",
    alEntrar: (api) => {
      R().fase(api, "VIII", 3, 2);
      R().tick(api);
      api.marcar("fase8_empezada", true);
      ["nora", "marcos", "alex", "irene"].forEach((p) => api.est(p, "estres", 6));
    },
    texto: (api) => {
      const d = D(api);
      const o = otro(api);
      const h = H(api);
      const b = buscador(api);
      return `
Sesenta segundos. Los has contado. A los sesenta estás en la puerta.

El porche. La bombilla con sus polillas. La barandilla. Los dos escalones. La grava, mojada, brillando hasta donde llega la luz y luego no.

Nora: ¡${N[d].toUpperCase()}!

Tu voz se va por los pinos y no vuelve. Ni un eco. Como si el bosque se la quedara.

${o === "marcos" ? (R().herido(api, "marcos", "cojera") ? "Marcos detrás de ti, en la puerta, con el atizador de bastón y la cara blanca.\n\nMarcos: ¡ÁLEX! ¡ÁLEX, JODER!" : "Marcos a tu lado, en el porche, con la linterna del móvil barriendo la grava.\n\nMarcos: ¡ÁLEX! ¡ÁLEX, JODER!") : (R().herido(api, "alex", "cojera") ? "Álex detrás de ti, en la puerta, apoyado en el marco con el pie malo en el aire.\n\nÁlex: ¡MARCOS! ¡MARCOS, NO TIENE GRACIA!" : "Álex a tu lado, en el porche, con el móvil de linterna barriendo la grava.\n\nÁlex: ¡MARCOS! ¡MARCOS, NO TIENE GRACIA!")}

Irene en la puerta. Con las dos manos en el marco. Sin salir. ${h === "irene" ? "Mirando los pinos como se mira a alguien que se ha ido a hacer un recado." : "Con la cara de debajo de la cara."}

${d === "marcos" ? "El coche. A veinte metros. Lo ves con la luz del porche: un bulto. La puerta del conductor, abierta. La luz de dentro, encendida. Y nadie." : "La brasa. En la grava, a tres metros de la luz. El cigarro de Álex, encendido todavía, tirado, con la punta naranja. Lo ha dejado caer. Álex no deja caer un cigarro."}

Nada. Ni un paso. Ni una rama. El viento en las copas, que suena a mar. El generador, lejos, como un motor de barco. Y la ausencia, que tiene forma: la forma de ${N[d]} en el sitio donde no está.

~ Ha bajado a la grava. Ha levantado la mano. Un momento. Y no ha vuelto. Hace tres minutos. Cuatro. Tres minutos no es nada. Tres minutos es todo lo que ha tardado todo lo demás esta noche.

${modo(api, "nora", {
  lucido: `~ ${d === "marcos" ? "La puerta del coche abierta y la luz de dentro encendida. Marcos no deja puertas abiertas. Marcos cierra el coche dos veces con el mando." : "Un cigarro en la grava. Álex no tira un cigarro entero. Álex apura hasta el filtro."} Eso es lo que sé. Lo demás es la oscuridad.`,
  asustado: "~ Se lo ha llevado. Le ha llamado y ha ido y se lo ha llevado. Lo dijo Álex: viene a por la persona que más quieres. Y ha empezado.",
  tenso: "~ Salir. Buscarle. Ahora. Con la linterna. Diez metros. Veinte. Los que hagan falta.",
  ido: "~ La grava brilla hasta donde llega la luz y luego sigue brillando. Sola. Como un camino que se ha aprendido tu nombre.",
  perdido: "~ Está entre los troncos. Como la gente de antes. De pie. Mirando la casa. Ya es uno de ellos.",
  normal: "~ Cuatro minutos. Vale. Vale. O sale alguien o entra él. Una de las dos.",
})}

Dos cosas pasan a la vez. Aquí, en la luz. Y allí, donde ${N[d]} ha ido.

¿Cuál quieres ver?`;
    },
    personajes: [
      {
        id: (api) => D(api),
        descripcion: (api) => D(api) === "alex" ? "Seguirle. Fuera. Donde no llega la luz. Donde le llaman." : "Seguirle. Fuera. Al coche. A la carretera que vuelve.",
        a: "viii_c1",
        efecto: (api) => { api.marcar("viii_rama", "condena"); resolverBusqueda(api, false); },
      },
      {
        id: "nora",
        descripcion: (api) => "Quedarte en la luz. Buscarle desde aquí. Con " + N[buscador(api)] + ".",
        a: "viii_s1",
        efecto: (api) => { api.marcar("viii_rama", "busqueda"); resolverCondena(api, false); },
      },
    ],
  },

  // ---------- LA CONDENA, DESDE DENTRO ----------

  viii_c1: {
    pov: (api) => D(api),
    fondo: (api) => D(api) === "alex" ? "assets/fondos/bosque.jpg" : "assets/fondos/coche.jpg",
    ambiente: "exterior",
    musica: "terror",
    lugar: "fuera", hora: "05:10",
    titulo: "La condena · El señuelo",
    alEntrar: (api) => {
      R().tick(api);
      resolverCondena(api, true);
      const d = D(api);
      api.presenciar(d, 2);
      api.est(d, "lucidez", -6);
      api.marcar("antorchas_lejos", api.anomalia("antorchas_lejos"));
    },
    texto: (api) => {
      const d = D(api);
      if (d === "alex") return `
La grava. Mojada. Cruje. Y luego no cruje, porque se acaba, porque empieza la tierra, y la tierra no hace ruido.

Has levantado la mano. «Un momento.» Lo has hecho con la palma abierta, como se hace, y has bajado a la grava con el cigarro en la boca, y el cigarro ya no está en la boca, y no te acuerdas de haberlo tirado.

Y has ido hacia la izquierda. Hacia los pinos. Porque desde los pinos, desde el mismo sitio de antes, exactamente el mismo:

Álex.

La voz de Irene. La de verdad. La de pedir ayuda. La de hace tres años en un coche. No la de la mesa, que está en la mesa, detrás de ti, a diez metros, con las dos manos en el marco de la puerta.

Álex. Ayúdame.

Y vas. Porque cuando Irene pide ayuda con esa voz se va. Se va siempre. Es lo único que has hecho bien en cinco años.

La luz del porche te da en la espalda. La sombra se te alarga por delante, hasta los troncos, y se mete entre ellos, y tú detrás de tu sombra.

~ Está dentro. La he visto. Está en la puerta con las manos en el marco. Y me llama desde aquí. Las dos cosas. Otra vez las dos cosas.

~ Pero esta voz es la de verdad. Y la de la puerta es la de siempre. Y si tengo que elegir una...

${api.bandera("golpes_marcado") ? "Y los golpes. Toc, toc. A tu paso. En los troncos, a la altura de tu mano, como si alguien fuera a tu lado llamando a cada pino. Antes que tú. Siempre antes." : ""}

Los pinos. Negros. Con las copas arriba sonando a mar. El suelo de agujas, blando, que no hace ruido. Y delante, a veinte metros, a treinta, un claro donde la voz.

Álex. Aquí.

${api.bandera("antorchas_lejos") ? `Y una luz.

No la del porche. Otra. Naranja. Baja. Entre los troncos, a la izquierda, lejos. Una. Y otra al lado. Y otra. Como velas. Como velas grandes que se mueven despacio, a la altura de una mano que las lleva.

Antorchas.

Vienen. No hacia ti. Hacia la casa. ${api.bandera("nora_cuenta_gente") ? "Como iban los de los troncos que vio Nora: hacia la casa, como quien va a un fuego." : "Como iban los del pueblo en mi historia: hacia la casa, como quien va a un fuego."}` : `Y nada. Nadie en el claro. La voz se ha ido a otro sitio. Más adentro. Como se va alguien que quiere que la sigas.`}

${modo(api, "alex", {
  lucido: "~ La voz de Irene no puede estar aquí. Irene está en la puerta. Lo sé. Lo he visto. Y estoy andando hacia la voz como si no lo supiera, porque saberlo no me sirve para las piernas.",
  asustado: "~ Me llama. Con la voz de cuando de verdad. Y voy. Y no puedo no ir. Es como la botella: cuando señala, vas.",
  tenso: "~ Irene. Joder, Irene. Donde estés. Dilo otra vez. Dilo otra vez y voy.",
  ido: "~ Las agujas no suenan. Piso y no suenan. Como si el suelo estuviera de acuerdo en que no me oigan.",
  perdido: "~ Ya sé las voces. Ya sé que es ella y no es ella. Y voy igual, porque a lo mejor esta vez sí.",
  normal: "~ Veinte metros. Miro el claro, no hay nadie, vuelvo. Documental número tres, toma dos.",
})}

Detrás de ti, la luz del porche. Más pequeña. Más amarilla. Más lejos de lo que has andado.`;

      return `
${["marcos", "ambos"].includes(api.bandera("generador_quien")) ? "El pestillo del cobertizo, echado. Ya está. Y al volver, a mitad de la grava, la luz de dentro del coche. Otra vez. " : ""}La grava. Mojada. Cruje. El coche, a veinte metros. Lo has mirado desde el porche con la linterna y has visto la puerta del conductor. Abierta.

Tú la cerraste. Al llegar. Con el mando. Dos veces.

Has levantado la mano. «Un momento.» Con la palma abierta, como se hace. Y has bajado. Porque una puerta abierta de tu coche es un problema con solución, y llevas toda la noche sin ninguno.

El coche. La luz de dentro encendida. Amarilla, débil, la de encima del retrovisor. Los asientos. El volante. Nadie. ${api.sabe("marcos", "coche_vacio") ? "El retrovisor interior, girado hacia el asiento de atrás. Lo giras a su sitio. Con la mano buena." : ""} Las llaves.

Las llaves puestas.

En el contacto. Tus llaves. Las que tienes en el bolsillo. Metes la mano en el bolsillo: la llave de la casa. La del coche, no. La del coche está en el contacto.

~ Me las he dejado. Al llegar. No. Cerré con el mando y me lo guardé. Me lo guardé aquí.

Te sientas. En el asiento del conductor. Porque es tu sitio. Porque el coche huele a tu coche y hace ocho horas todo era esto: un coche, una carretera, cuatro amigos.

${api.bandera("faros_marcado") ? `Y por el parabrisas, abajo, entre los pinos, por el camino de tierra, los faros.

Los mismos. Amarillos. Bajos. Parados. A cien metros. A doscientos. Mirando.

Y el motor de lata. Subiendo. Sin que los faros se muevan.` : `Y por el parabrisas, el camino. Negro. Bajando entre los pinos hasta el pueblo, que está a una hora. A una hora hay gente. A una hora hay un teléfono que funciona y un médico para la mano de ${api.bandera("generador_quien") === "marcos" || api.bandera("generador_quien") === "ambos" ? "esta mano" : "Álex"} y un guardia civil que sepa qué hacer con una casa así.`}

~ Una hora. Bajar, llamar, subir con alguien. Una hora y media. A las siete estoy aquí con luz y con gente. Es lo lógico. Es lo primero lógico de toda la noche.

Giras la llave.

El coche arranca a la primera. Como siempre. Los faros. El salpicadero. La radio, apagada. El olor a tu coche.

${modo(api, "marcos", {
  lucido: "~ Las llaves estaban en el contacto. Y yo las tenía en el bolsillo. Una de las dos cosas es mentira y las dos las he visto. Bajar. Llamar. Volver. Con eso no hace falta saber cuál.",
  asustado: "~ Alguien ha puesto las llaves. Alguien que quiere que baje. Y estoy bajando.",
  tenso: "~ Una hora. Una hora de tierra y luego asfalto y luego un pueblo con luz. Es la única cosa de esta noche que tiene un final.",
  ido: "~ El motor suena como el arrastre. Como lo de detrás de la puerta. La misma cosa pesada moviéndose un palmo. Pero ahora la muevo yo.",
  perdido: "~ El coche quería que viniera. Ha encendido la luz toda la noche para que viniera. Y ahora me lleva.",
  normal: "~ Bajar. Llamar. Subir con alguien. Marcha atrás, camino, una hora. Lo puedo hacer con los ojos cerrados.",
})}

Metes primera. La casa, en el retrovisor, encendida. Con dos figuras en el porche. Nora. Y alguien.`;
    },
    opciones: [
      // Álex
      { texto: "Seguir la voz. Al claro. Adonde diga.", a: "viii_c2", si: (api) => D(api) === "alex",
        efecto: (api) => { api.marcar("viii_c_decision", "voz"); api.est("alex", "eje", 2); } },
      { texto: "«¡IRENE!» Gritar. Que conteste. Que conteste bien.", a: "viii_c2", si: (api) => D(api) === "alex",
        efecto: (api) => { api.marcar("viii_c_decision", "grito"); api.est("alex", "miedo", 4); R().ofrenda(api, "nombre"); } },
      { texto: "Sacar el móvil. Grabar. Documental número siete. Y seguir andando.", a: "viii_c2", si: (api) => D(api) === "alex",
        efecto: (api) => { api.marcar("viii_c_decision", "graba"); api.marcar("alex_graba_bosque", true); } },
      { texto: "Volver. A la luz. Ahora.", a: "viii_c2", si: (api) => D(api) === "alex",
        efecto: (api) => { api.marcar("viii_c_decision", "vuelve"); api.est("alex", "miedo", 5); api.est("alex", "lucidez", 2); } },
      // Marcos
      { texto: "Bajar por el camino. Al pueblo. A por alguien.", a: "viii_c2", si: (api) => D(api) === "marcos",
        efecto: (api) => { api.marcar("viii_c_decision", "coche"); api.est("marcos", "eje", 3); } },
      { texto: "Dar las luces largas. Tres veces. A los faros de abajo.", a: "viii_c2", si: (api) => D(api) === "marcos" && api.bandera("faros_marcado"),
        efecto: (api) => { api.marcar("viii_c_decision", "luces"); api.est("marcos", "miedo", 4); } },
      { texto: "Apagar el motor. Salir. Volver a la casa con las llaves en la mano.", a: "viii_c2", si: (api) => D(api) === "marcos",
        efecto: (api) => { api.marcar("viii_c_decision", "vuelve"); api.est("marcos", "miedo", 5); api.est("marcos", "lucidez", 2); } },
      { texto: "Tocar el claxon. Largo. Que salgan. Que vengan todos al coche.", a: "viii_c2", si: (api) => D(api) === "marcos",
        efecto: (api) => { api.marcar("viii_c_decision", "claxon"); api.est("marcos", "eje", 2); } },
    ],
  },

  viii_c2: {
    pov: (api) => D(api),
    fondo: (api) => D(api) === "alex" ? "assets/fondos/bosque_fuego.jpg" : "assets/fondos/coche.jpg",
    titulo: "La condena · Fuera",
    hora: "05:16",
    alEntrar: (api) => {
      R().tick(api);
      const d = D(api);
      api.est(d, "miedo", 15); api.est(d, "lucidez", -8);
      api.marcar("faros_coche_vuelta", api.anomalia("faros_coche_vuelta"));
    },
    texto: (api) => {
      const d = D(api);
      const dec = api.bandera("viii_c_decision");
      if (d === "alex") {
        const inicio = dec === "grito" ? `
Álex: ¡IRENE!

Tu voz se va por los pinos y no vuelve. Ni un eco. Y luego sí. Vuelve. Con tu voz. Desde delante.

¡IRENE!

Tu grito. Exacto. Devuelto desde el claro, como una pelota. Y después, más bajo, con la voz de ella:

Aquí.` : dec === "graba" ? `
El móvil. La luz de la pantalla en tu cara desde abajo, que es como mejor sales.

Álex: Documental número siete. Estoy en el bosque. Irene me llama desde el bosque. Irene está en la casa. Ninguna de las dos cosas es mentira.

Lo dices andando. La cámara graba negro y ramas y tu respiración.` : dec === "vuelve" ? `
Te das la vuelta. A la luz. Ahora.

La luz del porche. Amarilla. Entre los troncos. A treinta metros.

Andas hacia ella. Diez pasos. Veinte. Y sigue a treinta metros. Como un cuadro que no se acerca.

Te paras. Miras atrás, hacia el claro. Miras la luz. Y la luz está a la izquierda ahora. No delante. A la izquierda, donde no estaba la casa.

~ Me he girado. Con el miedo se gira uno. Es eso. He girado y la casa está donde está.

Andas hacia la luz de la izquierda. Y la luz se va a la derecha.` : `
Sigues la voz. Al claro. Las agujas blandas. Los troncos que van pasando a los lados como gente de pie.

Álex.

Más adentro. Siempre un poco más adentro. Como se lleva a un perro con la mano cerrada.`;
        return `${inicio}

Y entonces lo ves.

No una luz. Muchas. Entre los troncos, a la izquierda, a la derecha, delante. Naranjas. Bajas. A la altura de una mano. Moviéndose despacio, con el balanceo de quien anda.

Antorchas.

Diez. Veinte. No sabes contar sin luz. Y detrás de cada una, una forma. Oscura. De pie. Con algo en la otra mano: un palo, un hierro, una cosa larga con dientes. Rastrillos. Azadas. Lo que se coge de un cobertizo cuando se va a buscar a alguien.

Y no vienen hacia ti.

Van hacia la casa. Despacio. Entre los pinos. Como quien va a un fuego.

Y huele. A leña. A pelo quemado. A algo más viejo que las dos cosas.

~ Es la historia. Es mi historia. Los hombres del pueblo con antorchas yendo a por la casa. Lo conté yo. Lo conté con esta voz. Y ahora está aquí, con sus pies, con su olor, andando.

~ No hay nadie. Es la luz del porche entre los troncos. Es el porro de hace dos horas. Es el miedo, que hace luces.

Una de las formas se para. Gira la cabeza. Hacia ti.

No tiene cara. Tiene el hueco donde va la cara, con la luz de la antorcha detrás.

Y levanta la mano. Con la palma abierta. Como quien dice «un momento».

Como has hecho tú. En el porche. Hace diez minutos.

${modo(api, "alex", {
  lucido: "~ Antorchas. Rastrillos. La historia entera con los pies puestos. No existe. Lo sé. Y me ha hecho el gesto. Mi gesto. Y saber que no existe no me ha servido para dejar de verlo.",
  asustado: "~ Van a la casa. Van a por ellos. Van a por Irene con rastrillos. Y yo aquí. Y yo aquí sin nada.",
  tenso: "~ Corre. Corre, imbécil. Da igual hacia dónde. Corre.",
  ido: "~ Las antorchas se mueven al ritmo de mi respiración. Cuando la aguanto, se paran. Cuando la suelto, siguen. Las llevo yo.",
  perdido: "~ Me han visto. Ya saben cuál soy. Me han hecho mi gesto para que sepa que me conocen desde antes de nacer.",
  normal: "~ Vale. Vale. Esto no está. Esto no está y voy a andar hacia la luz que no se mueve. La que sea.",
})}

Y detrás de ti, cerca, con tu voz, con tu sonrisa entera, la de la mesa, la de las cuatro veces que contaste la historia:

«Venga. Si estás ahí, sal.»`;
      }

      // Marcos
      const inicio = dec === "luces" ? `
Las largas. Tres veces. Al camino. A los faros de abajo.

Y los faros de abajo contestan. Tres veces. Exactas. Con el mismo ritmo. Como un espejo.

Y se mueven. Suben.` : dec === "vuelve" ? `
Apagas el motor. Sacas la llave. La aprietas en el puño como se aprieta una cosa que quieres que sea verdad.

Abres la puerta. Sales. La grava. La casa, encendida, a veinte metros.

Y la casa está a treinta. Andas. Y está a cuarenta. Como un cuadro que no se acerca.

Te paras. Miras el coche. Está a dos metros. Miras la casa. A cincuenta. Con las dos figuras en el porche, pequeñas, que no gritan, que no se mueven, que miran.

~ La perspectiva. La noche. El miedo. Los ojos no miden bien sin luz. Lo sé. Lo estudié.

Vuelves al coche. Porque el coche sí está donde está. Te sientas. Giras la llave.` : dec === "claxon" ? `
El claxon. Largo. Un segundo. Tres. Cinco.

La casa, en el retrovisor, no se mueve. Las dos figuras del porche no se mueven. Nadie sale corriendo. Nadie levanta un brazo.

Como si no lo oyeran. Como si el claxon sonara dentro del coche y solo dentro.

Sueltas. Y en el silencio, desde abajo, otro claxon. Igual. Largo. Contestando.` : `
Marcha atrás. Primera. El camino.

Bajas. Los faros hacen un túnel de tierra y ramas. El coche va como va tu coche, que es como debe ir un coche. Las manos en el volante. ${R().herido(api, "marcos", "sangra") ? "La derecha con el paño de cuadros, que mancha el cuero. Da igual." : "Las dos enteras, a las diez y diez, como te enseñaron. Da igual."}`;
      return `${inicio}

El camino baja. Entre los pinos. Con las curvas que conoces de subir esta tarde, hace un siglo, con Álex cantando.

Y la radio se enciende.

Sola. Con un chasquido. Sin que la toques.

Y suena la fiesta.

No una canción. La fiesta. Vuestra fiesta. La carcajada de Irene, la que reconocerías en cualquier parte. Los vasos. Y Álex, con la sonrisa entera:

${api.hayEvidencia("video_brindis") ? "«¡Documental número uno! Cuatro idiotas en la casa de una bruja. ¿Qué podría salir mal?»" : "«" + R().voz(api, "alex", 0) + "»"}

${api.hayEvidencia("video_brindis") ? "Tu grabación. La del brindis. Las doce y cuarenta. Está en tu móvil. Tu móvil está en tu bolsillo. La radio no tiene tu móvil." : "La voz de Álex. Lo que dijo esta noche, en la mesa. Nadie lo grabó. La radio no tiene a Álex."}

~ Bluetooth. Se ha conectado solo. Lo hace. Lo ha hecho otras veces.

~ Nunca lo ha hecho. Y no está sonando por el móvil. Está sonando por la radio, por la FM, con la frecuencia de una emisora que no existe.

Apagas la radio. Sigue sonando.

${api.bandera("faros_coche_vuelta") ? `Y delante, en una recta, los faros.

En mitad del camino. Parados. Amarillos. Bajos. A cincuenta metros. Un coche viejo, cruzado, con las luces dadas, y nadie dentro.

Frenas. El coche se para. Tu coche. A cincuenta metros del otro.

Y el otro no está. Solo el camino. Y la recta. Y el negro.` : `Y el camino sube.

No baja. Sube. La curva que tenía que ir a la izquierda va a la derecha, y el coche sube, y entre los pinos, delante, una luz amarilla con polillas.

El porche.

La casa. Encendida. Con dos figuras que miran.

Has bajado tres minutos. Has vuelto sin girar. Estás donde has empezado.`}

Y la fiesta sigue sonando. Y ahora, entre la fiesta, otra cosa. Debajo de la carcajada de Irene. Una voz que dice tu nombre, despacio, como se lee una lista.

${modo(api, "marcos", {
  lucido: "~ El camino baja al pueblo. No tiene otra salida. Lo miré en el mapa con Nora. Y he vuelto sin girar. Hay una explicación y no la tengo, y sin explicación no sé conducir.",
  asustado: "~ Me devuelve. Cada vez que bajo me devuelve. Como el vaso a la E. Como se devuelve una cosa que es tuya.",
  tenso: "~ Otra vez. Bajo otra vez. Con los ojos en el camino. Sin radio. Sin mirar los pinos. Otra vez.",
  ido: "~ La fiesta suena mejor por la radio. Más de verdad. Como si la de hace ocho horas fuera la copia.",
  perdido: "~ Me está leyendo el nombre. Como en la hoguera. Uno detrás de otro. Y cuando llegue al mío se me para el coche.",
  normal: "~ Bajar. Otra vez. Despacio. Los faros en el camino y no en los pinos. Se puede. Se puede.",
})}

Metes primera. Otra vez.`;
    },
    opciones: [
      // Álex
      { texto: "Correr. Hacia la luz. La que sea. Sin mirar atrás.", a: "viii_c3", si: (api) => D(api) === "alex",
        efecto: (api) => { api.marcar("viii_c_final", "corre"); api.est("alex", "estres", 8); } },
      { texto: "Girarte. «¿Quién coño eres?» A la voz. A tu voz.", a: "viii_c3", si: (api) => D(api) === "alex",
        efecto: (api) => { api.marcar("viii_c_final", "grita"); api.est("alex", "eje", 3); api.est("alex", "miedo", 4); } },
      { texto: "Quedarte quieto. Contra un tronco. Que pasen. Van a la casa, no a ti.", a: "viii_c3", si: (api) => D(api) === "alex", lucida: true,
        efecto: (api) => { api.marcar("viii_c_final", "quieto"); api.est("alex", "lucidez", 1); api.est("alex", "estres", 6); } },
      { texto: "Seguir a las antorchas. A la casa. Si van a la casa, van a la luz.", a: "viii_c3", si: (api) => D(api) === "alex",
        efecto: (api) => { api.marcar("viii_c_final", "sigue"); api.est("alex", "miedo", 6); } },
      // Marcos
      { texto: "Bajar otra vez. Despacio. Los ojos en el camino y en nada más.", a: "viii_c3", si: (api) => D(api) === "marcos",
        efecto: (api) => { api.marcar("viii_c_final", "baja"); api.est("marcos", "eje", 2); } },
      { texto: "Acelerar. Que se acabe el camino o que se acabe el coche.", a: "viii_c3", si: (api) => D(api) === "marcos", impulsiva: true,
        efecto: (api) => { api.marcar("viii_c_final", "acelera"); api.est("marcos", "estres", 8); } },
      { texto: "Frenar. Apagar el motor. Quedarte dentro con las puertas cerradas hasta que amanezca.", a: "viii_c3", si: (api) => D(api) === "marcos", lucida: true,
        efecto: (api) => { api.marcar("viii_c_final", "frena"); api.est("marcos", "lucidez", 1); api.est("marcos", "estres", 6); } },
      { texto: "Dar la vuelta. A la casa. A la luz del porche. A Nora.", a: "viii_c3", si: (api) => D(api) === "marcos",
        efecto: (api) => { api.marcar("viii_c_final", "vuelve"); api.est("marcos", "miedo", 4); } },
    ],
  },

  viii_c3: {
    pov: (api) => D(api),
    fondo: (api) => D(api) === "alex" ? "assets/fondos/bosque_fuego.jpg" : "assets/fondos/coche.jpg",
    musica: "terror",
    titulo: "La condena · La falsa salida",
    hora: "05:24",
    alEntrar: (api) => {
      R().tick(api);
      const d = D(api);
      api.presenciar(d, 3);
      // La muerte. Nunca GAME OVER: cambia el POV. Se registra aquí; nadie la ha visto.
      R().matar(api, d, d === "alex" ? "bosque" : "coche", d === "alex" ? "el terraplén bajo los pinos" : "el camino, contra el pino grande", null);
      api.marcar("muerte_vivida", d);
    },
    texto: (api) => {
      const d = D(api);
      const fin = api.bandera("viii_c_final");
      if (d === "alex") {
        const inicio = fin === "grita" ? `
Te giras.

Álex: ¿Quién coño eres?

A tu voz. A la sonrisa que no ves. Y la sonrisa contesta, con tu voz, con tu cadencia, con tu manera de dejar el silencio antes de la última palabra:

«Sois unos putos gilipollas.»

La frase de Nora. Con tu voz. La casa lo mezcla todo. Como tú mezclaste la historia.` : fin === "quieto" ? `
Contra un tronco. La corteza en la espalda. Sin respirar.

Pasan. Las antorchas. A cinco metros. A tres. Las formas oscuras con sus hierros, andando despacio hacia la casa, con el olor a leña y a pelo. Una. Otra. No te miran. No te ven. Van a lo suyo.

Y la última se para. Delante de ti. A un metro. Sin cara. Con la antorcha en alto.

Y te huele. Como huele un perro.` : fin === "sigue" ? `
Sigues a las antorchas. Detrás. A diez metros. Si van a la casa, van a la luz, y la luz es lo único que quieres.

Y van. Entre los pinos. Y la luz del porche aparece delante, amarilla, con sus polillas.

Y las antorchas se paran. En el borde de la luz. Todas. En fila. Como se para la gente delante de un fuego.

Y se giran.` : `
Corres.

Las agujas blandas. Los troncos. La luz del porche a la derecha, amarilla, entre los pinos, a treinta metros, a treinta metros, a treinta metros.

Corres hacia ella y no se acerca. Y las antorchas sí. Detrás. A los lados. Con el balanceo de quien anda, y tú corres, y ellas andan, y siguen a los lados.`;
        return `${inicio}

${api.bandera("alex_graba_bosque") ? "El móvil, en la mano, grabando. Lo levantas. Que quede. Que quede lo que sea esto." : ""}

Y la luz.

Ahí. Delante. Amarilla. Grande. Con las polillas dando vueltas. El porche. Los dos escalones. La barandilla.

Y no es el porche.

Es una antorcha. Una sola, clavada en la tierra, con las polillas dando vueltas, en mitad de un claro. Y detrás de la antorcha, el hueco. El terraplén. El barranco seco por donde bajó el arroyo, con las piedras abajo, blancas, a cuatro metros, que viste esta tarde desde el coche y dijiste «ahí me caigo yo».

Lo ves un segundo. Un segundo entero. La antorcha que es la luz que no es el porche. El borde. El aire.

Y el pie ya está en el aire.

Porque corrías. Porque hacia la luz se corre. Porque la realidad que no ves te mata, y la has visto un segundo tarde.

Caes.

No es largo. Es cuatro metros. Es el hombro contra una piedra, y algo que se rompe con un ruido que oyes desde dentro, y el cuello contra la siguiente, y las piedras blancas que ya no son blancas.

Estás boca arriba. Los pinos arriba. Las copas sonando a mar. No puedes mover las piernas. No sabes dónde tienes las piernas. Tienes la boca llena de algo caliente que sube y no baja.

Y las antorchas.

En el borde. Arriba. En fila. Mirando hacia abajo. Sin caras. Con los hierros.

Y una baja.

Despacio. Por las piedras. Con el rastrillo. Sin prisa, porque no tienes piernas.

${api.bandera("alex_graba_bosque") ? "El móvil, a un metro, entre las piedras, con la pantalla hacia arriba. Grabando. El cielo. Las copas. Y lo que baja." : ""}

~ Irene. Irene, la de verdad. La del coche hace tres años. Ayúdame. Ayúdame tú ahora.

Y detrás de tu cabeza, en la piedra, pegado al oído, con tu voz, bajo, como se dice un secreto:

«Venga. Si estás ahí, sal.»

[negro]

...

...

...`;
      }

      // Marcos
      const inicio = fin === "acelera" ? `
Aceleras.

Segunda. Tercera. El camino de tierra que salta bajo las ruedas. Los faros que hacen un túnel de ramas. La fiesta por la radio, la carcajada de Irene a todo volumen, y tu nombre debajo, leído despacio.

Que se acabe el camino o que se acabe el coche.` : fin === "frena" ? `
Frenas. Apagas el motor. Las luces. Todo.

Negro. El coche. Tú dentro. Las puertas cerradas. Hasta que amanezca. Dos horas. Se puede.

Y la radio sigue sonando. Sin motor. Sin batería. La fiesta. La carcajada de Irene. Tu nombre.

Y por el parabrisas, entre los pinos, una luz naranja. Baja. Y otra. Y otra. Como velas grandes que anda alguien.

Arrancas. Porque las puertas cerradas de un coche no son nada, lo sabes, lo estudiaste.` : fin === "vuelve" ? `
La vuelta. A la casa. A la luz del porche. A Nora.

Giras en la recta. Los faros barren los pinos. Y el camino sube, con sus curvas, y arriba la luz amarilla con polillas.

Vas. Con la mano manchando el cuero. Con la fiesta en la radio. Con tu nombre debajo.` : `
Bajas. Otra vez. Despacio. Los ojos en el camino y en nada más. ${R().herido(api, "marcos", "sangra") ? "La mano buena en el volante y la otra en el muslo, sangrando en el pantalón." : "Las dos manos en el volante, a las diez y diez, como te enseñaron."}

El camino baja. Las curvas. Los pinos. La fiesta en la radio, más baja ahora, como si la casa se estuviera quedando sin ella.`;
      return `${inicio}

Y la curva.

La grande. La que va a la izquierda, con el pino grande en el vértice, el que Álex señaló esta tarde: «ahí te la pegas tú». Con la luz de los faros llega, y el volante gira, y el coche entra.

Y hay alguien en la carretera.

En mitad del camino. Después de la curva. De pie. Con la luz de los faros encima.

Nora.

Con tu camisa. La negra. Con las mangas hasta los nudillos. Con el mechero en la mano dándole vueltas. Mirándote venir. Sin apartarse.

Nora.

Y el pie va solo al freno, y la mano sola al volante, porque a Nora no se le da, porque es Nora, porque hace ocho horas te puso la rodilla contra la tuya por debajo de una mesa y ahí sigue.

El volante a la derecha. Las ruedas que patinan en la tierra mojada. El pino grande.

Y el segundo. Un segundo entero, antes del pino, con los faros ya en el tronco, en el que miras al retrovisor y ves el camino vacío. Nadie. Ninguna Nora. La carretera sola.

Porque Nora está en la casa. Con las manos en el marco de la puerta. Y lo has sabido todo el rato, y no te ha servido para el pie.

El pino.

El ruido no es un ruido. Es un sitio. Estás dentro de él. El cristal que se hace polvo. El volante que entra. El techo que es el suelo. Vueltas. Una. Dos. Y el silencio, que es peor.

Boca abajo. Colgando del cinturón. Con el techo a un palmo. Con algo dentro que no está donde estaba: lo notas cuando respiras, que es como respirar a través de una tela mojada. ${R().herido(api, "marcos", "sangra") ? "La mano buena no la ves. La otra sí. La ves por el cristal roto, fuera, en la tierra, con el paño de cuadros todavía puesto." : "Una mano no la ves. La otra sí. La ves por el cristal roto, fuera, en la tierra, con los dedos abiertos."}

Y la radio.

Sigue. La fiesta. Álex diciendo «${api.hayEvidencia("video_brindis") ? "documental número uno" : R().voz(api, "alex", 0)}». La carcajada de Irene. Los vasos. A todo volumen, en un coche volcado, en mitad de un camino, a las cinco y media de la mañana.

Y por el hueco del cristal, entre los pinos, una luz naranja. Baja. Y otra. Y otra. Acercándose. Despacio. Con el balanceo de quien anda. Con el olor a leña.

~ Nora. Nora, que no estaba. Nora, que está en la puerta. Dile que no estaba. Díselo tú, que ella te cree.

~ Cuando dejo de hacer chistes es que pasa algo. Lo sabe ella. Lo sabe desde marzo, y no se lo ha dicho a nadie.

Y en la radio, debajo de la fiesta, la voz que lee la lista llega a tu nombre. Lo dice entero. Con los apellidos. Como en la hoguera.

[negro]

...

...

...`;
    },
    opciones: [{ texto: "...", a: "viii5_hallazgo" }],
  },

  // ---------- LA BÚSQUEDA, DESDE LA LUZ ----------

  viii_s1: {
    pov: "nora",
    fondo: "assets/fondos/porche.jpg",
    ambiente: "exterior",
    musica: "terror",
    lugar: "porche", hora: "05:10",
    titulo: "La búsqueda · La puerta",
    alEntrar: (api) => { R().tick(api); resolverBusqueda(api, true); api.presenciar("nora", 1); },
    texto: (api) => {
      const d = D(api);
      const b = buscador(api);
      const h = H(api);
      return `
Te quedas en la luz. Es lo que hay que hacer. Lo dijo Marcos: nadie sale. Y ha salido ${d === "marcos" ? "él" : "Álex"}, y ahora la regla es tuya.

${b === "marcos" ? `Marcos coge la linterna grande. ${R().lleva(api, "marcos", "atizador") ? "Y el atizador." : ""}

Marcos: Voy hasta el coche. Hasta el coche y no más. Me ves desde aquí.

Nora: Marcos.

Marcos: Hasta el coche.

${h === "marcos" ? "Y no se mueve. Con la linterna en la mano, en el porche, mirando la grava. Marcos, que ha dicho «hasta el coche», no baja el primer escalón.\n\nMarcos: Todavía no.\n\nNora: ¿Qué?\n\nMarcos: Nada. Que... voy contigo. Los dos. No solo." : "Y baja. Los dos escalones. La grava. La linterna hasta el coche, hasta el bulto, hasta la puerta abierta con la luz de dentro. Se para ahí. Da la vuelta al coche. Nadie."}` : b === "alex" ? `Álex coge el móvil. La linterna. ${R().lleva(api, "alex", "sarten") ? "Y la sartén de hierro, que en su mano parece lo que es: una sartén." : ""}

Álex: Voy hasta el coche. Hasta el coche y no más.

Y baja. Los dos escalones. La grava. Con el pie como esté. La luz hasta el coche, hasta la puerta abierta, hasta la luz de dentro. Se para. Da la vuelta. Nadie.

Álex: ¡MARCOS! ¡LAS LLAVES NO ESTÁN!` : `Irene sale contigo. Descalza. Hasta el borde del porche. Con las dos manos en la barandilla.

Irene: Yo no bajo.

Nora: Nadie baja.

Irene: Tú tampoco.

Nora: Yo tampoco.

Y os quedáis las dos en la barandilla mirando la grava, y la linterna en tu mano hace lo que puede, que es veinte metros.`}

${api.bandera("sombra_porche") ? `Y en el borde de la luz, donde la grava deja de brillar, algo.

Una sombra. Baja. Pequeña. Del tamaño de un niño de pie. Un segundo. Y un tronco. Es un tronco. Es el tocón que había esta tarde.

Y el tocón no está donde estaba esta tarde.` : "Nada. La grava. Los pinos. El viento arriba. El generador lejos."}

Nora: ¡${N[d].toUpperCase()}!

Nada.

${b === "irene" ? "Irene: ¡" + N[d].toUpperCase() + "!\n\nNada. Y en el nada, algo: que Irene ha gritado su nombre con la voz de verdad. La de pedir." : ""}

~ ${d === "marcos" ? "Las llaves del coche las tiene Marcos. En el bolsillo. Las vi. Y el coche está abierto con la luz de dentro. Y no está el coche vacío: está el coche esperando." : "Ha ido a la izquierda. A los pinos. " + (api.bandera("alex_oyo_irene_fuera") ? "Donde Álex oyó a Irene. " : "") + (api.bandera("nora_vio_gente") ? "Donde yo vi a la gente. " : "") + "Ha ido al mismo sitio, y no ha vuelto del mismo sitio."}

${modo(api, "nora", {
  lucido: "~ Cinco minutos. Veinte metros de luz. Y más allá, lo que hay más allá. Si salgo, somos dos fuera. Si no salgo, es uno. Las matemáticas de esta noche son horribles.",
  asustado: "~ La sombra. Pequeña. Como las huellas. Está en el borde. Esperando a ver quién sale.",
  tenso: "~ Salir. Salir ya. Me da igual la regla. Me da igual Marcos. Salir.",
  ido: "~ La grava brilla hasta donde llega la luz. Y luego sigue brillando. Como si supiera por dónde ha ido.",
  perdido: "~ Está entre los troncos. De pie. Mirando la casa. Ya es uno de ellos. Ya huele a leña.",
  normal: "~ Hasta el coche. Hasta el borde. Y no más. Es lo que se puede.",
})}`;
    },
    opciones: [
      { texto: "Bajar. Hasta el borde de la luz. Con " + "la linterna. Y gritar desde allí.", a: "viii_s2",
        efecto: (api) => { api.marcar("viii_s_nora", "borde"); api.est("nora", "miedo", 4); } },
      { texto: "Quedarte en el porche. Que baje quien baje. Tú, la luz.", a: "viii_s2",
        efecto: (api) => { api.marcar("viii_s_nora", "porche"); api.est("nora", "estres", 4); api.est("nora", "lucidez", 1); } },
      { texto: "Encender las luces del coche. Las largas. Que el bosque se vea.", a: "viii_s2", lucida: true, si: (api) => D(api) === "alex",
        efecto: (api) => { api.marcar("viii_s_nora", "luces"); api.est("nora", "eje", 2); api.saber("nora", "coche_luces"); } },
      { texto: "Gritar su nombre. Otra vez. Hasta que se te vaya la voz.", a: "viii_s2", impulsiva: true,
        efecto: (api) => { api.marcar("viii_s_nora", "grita"); api.est("nora", "estres", 6); api.est("nora", "miedo", 3); R().ofrenda(api, "nombre"); } },
    ],
  },

  viii_s2: {
    pov: "nora",
    fondo: "assets/fondos/exterior.webp",
    titulo: "La búsqueda · El borde",
    hora: "05:15",
    alEntrar: (api) => { R().tick(api); api.presenciar("nora", 1.5); },
    texto: (api) => {
      const d = D(api);
      const b = buscador(api);
      const h = H(api);
      const sn = api.bandera("viii_s_nora");
      const inicio = sn === "luces" ? `
Las luces del coche. Marcos las dejó puestas con el mando en el bolsillo; el mando, en el bolsillo de Marcos, que está aquí. Las largas.

El bosque se ve.

Blanco. Los troncos como huesos. Las agujas del suelo, planas, brillantes. Treinta metros de bosque iluminado, y en los treinta metros, nada. Ni Álex. Ni nadie. Y detrás de los treinta metros, el negro, más negro por contraste, como una pared.` : sn === "grita" ? `
Has gritado. Hasta que la voz se ha ido. Hasta que ha salido la voz de debajo de la voz, la que no usas. ${N[d]}. ${N[d]}. ${N[d]}.

Y a la séptima vez, desde los pinos, el nombre. Devuelto. ${N[d]}. Con una voz que no es de nadie y tiene tu ronquera. Exacta. Como una pelota.

Te callas.` : sn === "porche" ? `
Te quedas en el porche. La luz. Alguien tiene que ser la luz, y eres tú, con las manos en la barandilla y la linterna apuntando a la grava.` : `
Bajas. Los dos escalones. La grava. La linterna por delante. Hasta el borde: donde la grava deja de brillar con la luz del porche y sigue brillando con la tuya.

Aquí. Un pie más y ya es fuera.`;
      return `${inicio}

${b === "marcos" && h !== "marcos" ? `Marcos a tu lado, en el borde. Con la linterna grande. Con el atizador. Con el paño de cuadros oscuro.

Marcos: Diez metros. Entro diez metros, miro, salgo. Tú aquí, con la luz hacia mí, para que la vea.

Nora: Marcos.

Marcos: Diez metros.

Y es lo lógico. Es exactamente lo lógico. Y le miras la cara, y la cara es la de siempre, la de resolver, y no sabes si eso te tranquiliza.` : b === "marcos" ? `Marcos a tu lado. En el borde. Con la linterna. Y no da el paso.

Marcos: Todavía no.

Nora: ¿Todavía no qué?

Marcos: No sé. No sé qué he dicho.

Y no lo sabe. Se le ve no saberlo. Y se queda en el borde, con la linterna apuntando a los pinos, como si estuviera de guardia.` : b === "alex" ? `Álex a tu lado, en el borde. Con el móvil. Con el pie como esté.

Álex: Diez metros. Miro y vuelvo. Grabando.

Nora: Álex.

Álex: Es Marcos, Nora. Es Marcos. Marcos no se va sin decir adónde. Marcos deja una nota en la nevera para ir a mear.

Y tiene razón. Y se le ve que tener razón le da más miedo.` : `Irene detrás de ti, en el porche. En la barandilla. Sin bajar. Descalza. Con la voz de pedir.

Irene: Nora. No.

Nora: Diez metros.

Irene: Nora, te lo pido yo. Te lo pido yo, que no te pido nada.

Y es verdad. Irene no te ha pedido nada en toda la noche. Y ahora te pide esto.`}

${d === "marcos" ? "El coche no está. Donde estaba, a veinte metros, dos surcos en la grava, recientes, hacia el camino. Un motor: lo habéis oído hace cinco minutos y nadie ha dicho nada, porque un motor es una cosa normal. Y al lado de los surcos, en la grava, una mancha. Oscura. Con la forma de una mano. " + (R().herido(api, "marcos", "sangra") ? "La de Marcos, con el corte." : "De alguien que se apoyó con la mano abierta para levantarse.") + " Ha estado en el suelo. Ha estado en el suelo y se ha levantado, y se ha llevado el coche." : "Los pinos. A tres metros. Las agujas del suelo. Y en las agujas, huellas. De zapatilla. De Álex. Entrando. Una detrás de otra. Y ninguna volviendo."}

${modo(api, "nora", {
  lucido: `~ ${d === "marcos" ? "La mancha en el asiento tiene la forma de la mano izquierda. Marcos se cortó la derecha. O se ha sentado al revés. O la mano no es suya." : "Huellas que entran y no salen. Como las de la buhardilla. Exactamente como las de la buhardilla."} Un pie más y ya es fuera. Un pie.`,
  asustado: "~ Diez metros. Diez metros es lo que dijo Álex de la grava. Diez metros es lo que se dice antes.",
  tenso: "~ Un pie. Uno. Y luego otro. Y luego los que hagan falta. Me da igual el borde.",
  ido: "~ La grava sigue brillando fuera de la luz. Me está enseñando el camino. Me lo está poniendo fácil.",
  perdido: "~ Está esperando a que pise. Como con Álex. Como con la gente de los troncos. Un pie y ya soy suya.",
  normal: "~ Diez metros con la luz detrás. Se puede. Se ha podido toda la noche. Hasta ahora.",
})}`;
    },
    opciones: [
      { texto: "Cruzar. Diez metros. Con " + "él. Con la luz del porche a la espalda.", a: "viii_s3", si: (api) => puedeCruzarBuscador(api) && buscador(api) !== "irene",
        efecto: (api) => { const b = buscador(api); api.marcar("viii_s_cruza", true); R().cruzar(api, b); R().cruzar(api, "nora"); R().fuera(api, "nora", true); R().fuera(api, b, true); api.est("nora", "miedo", 6); api.presenciar("nora", 2); } },
      { texto: "Cruzar sola. Diez metros. Que se queden en la luz.", a: "viii_s3",
        efecto: (api) => { api.marcar("viii_s_cruza", true); api.marcar("viii_s_sola", true); R().cruzar(api, "nora"); R().fuera(api, "nora", true); api.est("nora", "miedo", 8); api.est("nora", "eje", 3); api.presenciar("nora", 2); } },
      { texto: "No cruzar. Hasta el borde y no más. Gritar desde aquí. Esperar.", a: "viii_s3",
        efecto: (api) => { api.marcar("viii_s_cruza", false); api.est("nora", "estres", 5); api.est("nora", "lucidez", 1); } },
      { texto: "Que cruce él solo. Diez metros. Tú, la luz.", a: "viii_s3", si: (api) => puedeCruzarBuscador(api) && buscador(api) !== "irene",
        efecto: (api) => { const b = buscador(api); api.marcar("viii_s_cruza", true); api.marcar("viii_s_solo_el", true); R().cruzar(api, b); R().fuera(api, b, true); api.est("nora", "estres", 4); api.rel("nora", b, "confianza", 3); } },
    ],
  },

  viii_s3: {
    pov: "nora",
    fondo: (api) => D(api) === "alex" ? "assets/fondos/bosque.jpg" : "assets/fondos/coche.jpg",
    titulo: "La búsqueda · El rastro",
    hora: "05:24",
    alEntrar: (api) => { R().tick(api); api.presenciar("nora", 2); },
    texto: (api) => {
      const d = D(api);
      const b = buscador(api);
      const cruza = api.bandera("viii_s_cruza");
      const sola = api.bandera("viii_s_sola");
      const solo = api.bandera("viii_s_solo_el");
      if (d === "alex") return `
${cruza ? (sola ? `Cruzas. Sola. Un pie. Otro. Las agujas blandas que no hacen ruido. La luz del porche en la espalda, y tu sombra por delante, larga, metiéndose entre los troncos.

[campanilla]

Tin.

Lo oyes. Esta vez lo oyes. Pequeño, metálico, mezclado con el viento. Y sigues.` : solo ? `${N[b]} cruza. Solo. Diez metros. Con la linterna. Tú en el borde, con la tuya apuntándole, para que la vea.

Le ves entrar entre los troncos. La linterna que barre las agujas. Diez metros. Se para.

${N[b]}: ¡Aquí! ¡Nora, aquí!` : `Cruzáis. Los dos. Un pie. Otro. Las agujas blandas. La luz del porche en la espalda y las dos linternas por delante.

[campanilla]

Tin.

Lo oís. Los dos. Ninguno lo dice.`) : `No cruzas. El borde. La luz. Gritas. ${b === "irene" ? "Irene grita." : N[b] + " grita."} Diez minutos. Quince.

Y a los quince, desde los pinos, a diez metros, una luz.

Pequeña. Rectangular. Azul. En el suelo. Entre las agujas.

Un móvil. Con la pantalla encendida. Grabando.`}

El móvil de Álex.

En el suelo, entre las agujas, a diez metros del borde, con la pantalla hacia arriba, grabando. El contador corriendo: 14:32. 14:33. Lleva un cuarto de hora grabando el cielo.

${cruza && !solo ? "Lo coges. Tienes la mano en él y no paras la grabación. No sabes por qué. Sí lo sabes: porque si la paras, se acaba." : "Lo trae " + N[b] + ". Con la mano extendida, como se lleva una cosa que quema. Grabando todavía."}

Y desde donde está el móvil, hacia delante, las huellas siguen. Diez metros más. Veinte. Hasta un claro.

Y el claro se acaba.

El terraplén. El barranco seco por donde bajó el arroyo, que visteis esta tarde desde el coche, con las piedras blancas abajo, a cuatro metros. Álex dijo «ahí me caigo yo». Se rio. Todos os reísteis.

La linterna baja. Por las piedras.

Blancas. Y luego no.

Álex.

Boca arriba. Con la cabeza en un ángulo que no tiene una cabeza. Con la camisa estampada abierta, como siempre, y el pecho, y los collares. Con un brazo debajo del cuerpo y el otro extendido, con la palma abierta, como quien dice «un momento».

Y la boca. Abierta. Llena de algo oscuro que ha salido y ha bajado por la mejilla hasta la piedra.

Y los ojos abiertos. Mirando arriba. Mirando las copas, o mirándote a ti, que estás donde estaban las copas.

${modo(api, "nora", {
  lucido: "~ Se ha caído. Corría y se ha caído. Cuatro metros. La cabeza contra la piedra. Es lo que pasa cuando se corre a oscuras por un bosque. Es una muerte que tiene nombre. Y no me sirve, porque nadie corre a oscuras por un bosque sin que le persigan.",
  asustado: "~ La mano. La palma abierta. Como cuando bajó a la grava. Se ha muerto haciendo el gesto de que volvía.",
  tenso: "~ No. No, no, no. Álex, no. Levántate, gilipollas. Levántate y di que era broma.",
  ido: "~ Las piedras eran blancas esta tarde. Ahora son de otro color. La casa las ha pintado con él.",
  perdido: "~ Se lo ha llevado. Le ha llamado con la voz de Irene y se lo ha llevado hasta aquí y lo ha tirado. Como se tira algo que ya has usado.",
  normal: "~ Álex. Álex, joder. Álex.",
})}`;

      return `
${cruza ? (sola ? `Cruzas. Sola. Un pie. Otro. La grava que se acaba y el camino de tierra que empieza. La luz del porche en la espalda.

[campanilla]

Tin.

Lo oyes. Pequeño, metálico, mezclado con el viento. Y sigues. Por el camino. Hacia abajo.` : solo ? `${N[b]} cruza. Solo. Por el camino. Con la linterna. Tú en el borde, con la tuya.

Diez metros. Veinte. La linterna que baja por el camino y se para. Y se queda quieta. Mucho rato.

${N[b]}: ¡Nora! ¡NORA!` : `Cruzáis. Los dos. La grava que se acaba y el camino de tierra que empieza. Las dos linternas por delante.

[campanilla]

Tin.

Lo oís. Los dos. Ninguno lo dice.`) : `No cruzas. El borde. Gritas. ${b === "irene" ? "Irene grita." : N[b] + " grita."} Diez minutos. Quince.

Y a los quince, abajo, en el camino, entre los pinos, una luz.

Amarilla. Fija. Apuntando al cielo. Como apuntan los faros de un coche que no está como debe estar un coche.`}

Los faros.

Abajo. En la curva grande. La del pino que Álex señaló esta tarde: «ahí te la pegas tú». Uno de los faros apunta al cielo. El otro está apagado. Y el ruido del motor, que sigue, ahogado, y otro ruido debajo, que tardas en reconocer.

Música.

La fiesta. ${api.hayEvidencia("video_brindis") ? "La grabación del brindis. Álex diciendo «documental número uno»." : "Álex diciendo «" + R().voz(api, "alex", 0) + "». Sin grabación que lo explique."} La carcajada de Irene. A todo volumen. Saliendo de un coche volcado en mitad del camino.

${cruza ? "Bajas. Corriendo. Con la linterna saltando. Los cien metros de camino que Marcos bajó esta tarde en primera diciendo «esta cuesta no la sube ni Dios»." : N[b] + " baja. Corriendo. Tú detrás, porque ya da igual el borde, porque el borde era para esto."}

El coche.

Boca arriba. Con el techo aplastado contra la tierra. Con el morro dentro del pino grande, doblado, como si el pino lo hubiera mordido. Con el cristal en polvo alrededor, brillando con la linterna como si hubiera nevado.

Y una mano fuera.

Por la ventana del conductor. En la tierra. ${R().herido(api, "marcos", "sangra") ? "Con el paño de cuadros todavía puesto, oscuro, y los dedos abiertos." : "Con los dedos abiertos, como quien suelta algo."}

Te agachas. La linterna dentro.

Marcos.

Colgando del cinturón. Boca abajo. Con la cabeza contra el techo y el cuello doblado hacia donde no se dobla un cuello. Con los ojos abiertos. Con la boca abierta y algo oscuro que ha salido y se ha quedado en el techo, que ahora es el suelo.

Y la radio. Sonando. La carcajada de Irene. Los vasos. Álex. «¿Qué podría salir mal?»

Alargas la mano. La apagas.

Sigue sonando.

${modo(api, "nora", {
  lucido: "~ Se ha salido en la curva. A oscuras, con una mano abierta, a cincuenta. Es lo que pasa. Es una muerte con nombre. Y no me sirve, porque Marcos no conduce a cincuenta por un camino de tierra. Marcos conduce como firma.",
  asustado: "~ La radio. Sigue. Sin batería. Con la fiesta. La casa se ha quedado con la fiesta y la pone para él.",
  tenso: "~ No. No, no, no. Marcos, no. Marcos, mírame. Mírame, joder, que no me has mirado al salir.",
  ido: "~ Colgando del cinturón. Como el péndulo. Como la piedra en el hilo, que se movía sola un centímetro.",
  perdido: "~ Le ha devuelto. El camino le ha devuelto al pino. Como el vaso a la E. Como se devuelve una cosa que es tuya.",
  normal: "~ Marcos. Marcos, joder. Marcos.",
})}`;
    },
    opciones: [{ texto: "...", a: "viii5_hallazgo" }],
  },

  // ---------- CONVERGENCIA: EL HALLAZGO ----------

  viii5_hallazgo: {
    pov: "nora",
    fondo: (api) => D(api) === "alex" ? "assets/fondos/bosque.jpg" : "assets/fondos/coche.jpg",
    ambiente: "exterior",
    musica: "terror",
    lugar: (api) => D(api) === "alex" ? "el terraplén" : "el camino",
    hora: "05:30",
    titulo: "La primera muerte · El hallazgo",
    alEntrar: (api) => {
      R().tick(api);
      resolverCondena(api, false); resolverBusqueda(api, false);
      hallar(api);
    },
    texto: (api) => {
      const d = D(api);
      const rama = api.bandera("viii_rama");
      const b = buscador(api);
      const h = H(api);
      const vivos = R().vivos(api).filter((p) => p !== "nora");
      const desdeDentro = rama === "condena" ? (d === "alex" ? `
[luz]

La luz vuelve a ser la tuya. La de tu linterna, en tu mano, apuntando abajo. Al terraplén. A las piedras blancas que no son blancas.

Has seguido las huellas con ${N[b]}. Hasta el claro. Hasta el borde. ${api.bandera("alex_graba_bosque") ? "Y el móvil de Álex, entre las agujas, grabando el cielo: catorce minutos." : "Y el móvil de Álex, entre las agujas, con la pantalla hacia arriba, apagado."}

Y abajo, Álex.

Boca arriba. Con la cabeza en un ángulo que no tiene una cabeza. Con un brazo debajo y el otro extendido, con la palma abierta, como quien dice «un momento». Con la boca llena de algo oscuro que ha bajado hasta la piedra. Con los ojos abiertos mirando las copas.` : `
[luz]

La luz vuelve a ser la tuya. La de tu linterna, en tu mano, bajando por el camino con ${N[b]} detrás.

Los faros. Uno apuntando al cielo. La curva grande. El pino que Álex señaló esta tarde.

El coche, boca arriba, con el morro dentro del tronco. El cristal en polvo, brillando. Una mano fuera, por la ventana, en la tierra${R().herido(api, "marcos", "sangra") ? ", con el paño de cuadros oscuro" : ""}.

Y dentro, colgando del cinturón, Marcos. Con el cuello doblado hacia donde no se dobla. Con los ojos abiertos.

Y la radio. La fiesta. La carcajada de Irene. Sin batería.`) : "";
      return `${desdeDentro}

...

Nadie dice nada. ${b === "irene" ? "Irene, detrás de ti, hace un ruido que no es una palabra. Y luego otro. Y luego se sienta en el suelo, en las agujas, con las manos en la boca." : b === "marcos" ? "Marcos, a tu lado, con la linterna quieta. Sin decir «se ha caído». Sin decir «un accidente». Marcos, que tiene un nombre para todo, mirando a Álex sin ninguno." : "Álex, a tu lado, con el móvil en la mano. Sin grabar. Álex, que lo graba todo, con el móvil apagado, mirando a Marcos."}

${d === "alex" ? `Bajas. Por las piedras. Con las manos. Te cortas una rodilla y no lo notas hasta mañana.

Álex. De cerca. Huele a lo que huele. A cerveza y a porro y a él, y debajo, ya, a otra cosa. La camisa estampada. Los collares enredados en el pecho, como esta noche a la una menos veinte. La mano abierta.

Le tocas. La mejilla. Fría. Ya. Tan pronto.

Y algo más. En el cuello. Debajo de la mandíbula. Cuatro marcas. Rojas. Como cuatro dedos. ${api.hayEvidencia("marca_brazo_irene") ? "Como las del brazo de Irene. " : ""}${api.hayEvidencia("marca_tobillo_nora") ? "Como las de tu tobillo. " : api.hayEvidencia("marca_muneca_nora") ? "Como las de tu muñeca. " : ""}Y no son de la caída, porque la caída no aprieta.` : `Te agachas. La linterna dentro del coche. Metes la mano por la ventana. Le tocas la cara, que está donde no debería estar una cara. Fría. Ya. Tan pronto.

Y algo más. En el cuello. Debajo de la mandíbula, a la vista porque la cabeza cae hacia atrás. Cuatro marcas. Rojas. Como cuatro dedos. ${api.hayEvidencia("marca_brazo_irene") ? "Como las del brazo de Irene. " : api.hayEvidencia("marca_tobillo_nora") ? "Como las de tu tobillo. " : ""}Y no son del cinturón, porque el cinturón no aprieta ahí.`}

~ No puede ser. No puede ser y es. Es esto lo que había en la historia debajo de la historia: que se muere uno. Que se muere de verdad, con la boca llena, en una zanja, y que da igual lo que sabías.

${api.bandera("nora_toma_muneca") || api.hayEvidencia("cuaderno_alda") ? "~ Quería pruebas. No esto." : "~ Vine a mirar. A ver si era verdad. Es verdad."}

${h === "marcos" && R().vivo(api, "marcos") ? "Marcos se agacha a tu lado. Le mira. Y dice, bajo, a nadie, como quien contesta:\n\nMarcos: Uno.\n\nNora: ¿Qué?\n\nMarcos: Nada." : h === "irene" ? "Irene, en el suelo, con las manos en la boca. Y entre las manos, bajo, como quien contesta a alguien:\n\nIrene: Uno." : ""}

${modo(api, "nora", {
  lucido: "~ Cuatro marcas en el cuello. Como las de Irene. Como las mías. Le ha sujetado alguien antes de que cayera. Alguien con cuatro dedos. Alguien de esta casa.",
  asustado: "~ Uno. Ha dicho uno. Como se cuenta. Como contaba la voz de la buhardilla. Uno, dos, tres.",
  tenso: "~ Levantarle. Taparle. Hacer algo con las manos. Cualquier cosa que no sea mirarle la boca.",
  ido: "~ Tiene los ojos abiertos y me mira. Y en los ojos hay copas de pinos. Y detrás de las copas, antorchas.",
  perdido: "~ Le han sujetado. Le han sujetado como a Irene, como a mí, y le han soltado en el aire. Es lo que hace: sujeta y suelta.",
  normal: "~ Uno. Es el primero. Lo dijo Álex: los tres. No. Lo dijo... no lo dijo nadie. Lo sé yo.",
})}

Las cinco y media. Faltan hora y media para las siete. Y sois tres.`;
    },
    opciones: [
      { texto: "Taparle. Con tu camisa. La de Marcos. Y quedarte con él un minuto.", a: "viii6_grabaciones",
        efecto: (api) => { api.marcar("viii_hallazgo", "tapa"); api.marcar("camisa_en_cuerpo", true); api.est("nora", "estres", -3); api.est("nora", "miedo", 3); } },
      { texto: "Coger su móvil. Parar la grabación. Guardarlo.", a: "viii6_grabaciones", si: (api) => D(api) === "alex",
        efecto: (api) => { api.marcar("viii_hallazgo", "movil"); api.est("nora", "lucidez", 1); api.est("nora", "eje", 1); } },
      { texto: "Apagar el motor. Quitar la llave del contacto. Guardársela.", a: "viii6_grabaciones", si: (api) => D(api) === "marcos",
        efecto: (api) => { api.marcar("viii_hallazgo", "llave"); api.marcar("llave_coche", "nora"); api.est("nora", "lucidez", 1); } },
      { texto: "Fotografiar las marcas del cuello. Con flash. Antes de que nadie lo toque.", a: "viii6_grabaciones", lucida: true,
        efecto: (api) => { api.marcar("viii_hallazgo", "foto"); api.evidencia("foto_marcas_cuello", "nora", D(api) === "alex" ? "el terraplén" : "el camino", "foto"); api.est("nora", "lucidez", 2); api.est("nora", "estres", 4); } },
      { texto: "No tocarle más. Subir. Volver a la luz. Ahora.", a: "viii6_grabaciones",
        efecto: (api) => { api.marcar("viii_hallazgo", "sube"); api.est("nora", "miedo", 4); api.est("nora", "estres", 2); } },
    ],
  },

  viii6_grabaciones: {
    pov: "nora",
    fondo: "assets/fondos/salon_gris.jpg",
    ambiente: "interior",
    musica: "terror_suave",
    lugar: "comedor", hora: "05:40",
    titulo: "La primera muerte · Las grabaciones",
    alEntrar: (api) => {
      R().tick(api);
      api.marcar("video_mesa_visto", true);
      api.marcar("vaso_en_video", api.bandera("vaso_final") && api.anomalia("vaso_en_video"));
      ["nora", "marcos", "alex", "irene"].forEach((p) => { if (R().vivo(api, p)) { api.saber(p, "video_mesa"); if (api.bandera("vaso_en_video")) api.saber(p, "vaso_solo_video"); } });
      api.marcar("video_mesa_registrado", true);
      api.est("irene", "lucidez", 4);   // enseñarlo la vuelve creíble aunque esté hecha polvo
    },
    texto: (api) => {
      const d = D(api);
      const vivos = R().vivos(api).filter((p) => p !== "nora");
      const h = H(api);
      const vh = api.bandera("viii_hallazgo");
      const movil = api.bandera("movil_alex_hallado") && api.bandera("alex_graba_bosque");
      const vaso = api.bandera("vaso_en_video");
      const inicio = vh === "tapa" ? `Le has tapado con la camisa. La de Marcos. La que ${api.sabe("nora", "irene_camisa") ? "Irene le regaló hace tres años" : "cogiste esta mañana sin preguntar"}. Se ha quedado allí, con la camisa encima de la cara, y tú con la camiseta, con el frío por dentro.` : vh === "movil" ? "Tienes el móvil de Álex en el bolsillo. Has parado la grabación. Catorce minutos y cincuenta segundos de cielo y de lo que sea que hay antes del cielo." : vh === "llave" ? "Tienes la llave del coche en el bolsillo. Has apagado el motor. La radio ha seguido sonando dos segundos más y se ha callado, como quien termina una frase." : vh === "foto" ? "Has fotografiado las marcas. Con flash. Cuatro dedos en un cuello. La foto está en tu móvil, entre la del símbolo de la mesa y la de la viga. Un catálogo." : "Has subido. Sin tocarle más. Sin mirar atrás. La luz del porche. La puerta. Dentro.";
      return `
${inicio}

Dentro. La mesa. Tres sillas ocupadas y una vacía, y nadie se sienta en la vacía, y nadie la aparta.

${vivos.includes("marcos") ? "Marcos con las manos en la mesa. Sin chistes. Sin explicaciones. Con la cara de quien ha visto una cosa sin nombre y está buscándole uno, y no lo encuentra, y sigue buscando." : "Álex con las manos en la cara. Álex, que no se tapa la cara ni para llorar. Y por debajo de las manos, un ruido que no es una risa."} Irene ${h === "irene" ? "con la mano en el cuello, quieta, mirando la silla vacía como quien mira a alguien sentado." : "con las rodillas en el pecho, en la silla, descalza, temblando de una manera que no es de frío."}

Y el móvil de Irene. En la mesa. Donde lo dejó Álex después de la ouija.

Irene: Ponlo.

Nora: ¿Qué?

Irene: El vídeo. El de la mesa. Ponlo.

Lo pones. Los tres alrededor de una pantalla. La tabla. Las velas. Álex con los dedos en el vaso, moviéndolo a ADIÓS, riéndose. «Bueno, chicos. Ha sido emocionante.»

Y su risa en la pantalla es peor que cualquier cosa de esta noche.

Lo adelantas. Irene con las manos en el cuello. Marcos ${api.bandera("marcos_accion") === "rescate" ? "rodeando la mesa, agachándose, soplando" : api.bandera("marcos_accion") === "lampara" ? "subiéndose a la silla" : "cruzando hacia la cocina"}. El fogonazo. El negro. La cámara grabando el negro con el rojo de la chimenea.

${vaso ? `Y al final. Cuando Álex para la grabación con el móvil en la mano, girándolo, un segundo antes del corte, la cámara pasa por la mesa.

Y el vaso se mueve.

Solo. Sin manos. Sin nadie. Dos centímetros hacia el borde. Hacia donde estabas tú.

Lo rebobinas. Otra vez. Dos centímetros. Solo.

Nadie dice nada. Irene deja de temblar. ${vivos.includes("marcos") ? "Marcos lo mira cuatro veces. A la quinta no dice ideomotor. No dice nada." : "Álex lo mira una vez y aparta el móvil como si quemara."}

~ Lo vi. Al final. Unos centímetros más lejos. Lo vi y pensé que cualquiera lo había rozado. Y está grabado. Nadie lo rozó. Lo tengo grabado.` : `Y el final. Álex cogiendo el móvil. «Documental número dos. La ouija. Ha sobrevivido todo el mundo.» Su cara en la pantalla. Su sonrisa entera.

Ha sobrevivido todo el mundo.

Irene para el vídeo. Deja el móvil boca abajo.`}

${movil ? `Y el otro. El de Álex. Catorce minutos de bosque.

Nadie quiere ponerlo. Lo pones tú. El negro. Las ramas. Su respiración. «Documental número siete. Estoy en el bosque. Irene me llama desde el bosque.» ${api.bandera("viii_rama") === "condena" ? "Y luego correr. Y luego el cielo, quieto, catorce minutos de copas de pinos." : "Y luego un ruido. Y luego el cielo, quieto, catorce minutos de copas de pinos."}

Y en el minuto once, con el cielo quieto, bajo, muy bajo, con la voz de Álex:

«Venga. Si estás ahí, sal.»

Irene se levanta y va al baño de abajo y la oís vomitar.` : ""}

${modo(api, "nora", {
  lucido: `~ ${vaso ? "Está grabado. Es la primera cosa de esta noche que no depende de quién la cuente. Un vaso que se mueve solo en un vídeo. Y lo hemos visto los tres. Y no nos sirve para nada, porque ya sabemos que es verdad." : "«Ha sobrevivido todo el mundo.» Lo dijo a cámara. Con su cara. Y ahora su cara está en una zanja mirando el cielo."}`,
  asustado: "~ Su risa. La de la pantalla. Le voy a oír reírse el resto de mi vida y no va a haber resto de mi vida.",
  tenso: "~ Basta de vídeos. Basta de mirar pantallas. Siete. Faltan ochenta minutos para las siete.",
  ido: "~ En el vídeo somos cinco. Los cuatro y la que está sentada en la silla de Irene mientras Irene está en el suelo. Se ve. No se ve. Se ve.",
  perdido: "~ Lo grabó para que lo viéramos ahora. La casa. Le hizo grabar para tener con qué enseñarnos.",
  normal: "~ Está grabado. Todo. Y no lo va a ver nadie que no esté en esta mesa.",
})}`;
    },
    opciones: [
      { texto: "Guardar los dos móviles. En tu mochila. Con el cuaderno. Todo junto.", a: "viii7_cohesion",
        efecto: (api) => { api.marcar("viii_grab", "guarda"); api.evidencia("video_mesa", "nora", "mochila de Nora", "video"); api.est("nora", "lucidez", 1); api.est("nora", "eje", 2); } },
      { texto: "«Nadie lo ha rozado. Lo hemos visto los tres.» Decirlo en voz alta.", a: "viii7_cohesion", si: (api) => api.bandera("vaso_en_video"),
        efecto: (api) => { api.marcar("viii_grab", "dice"); R().vivos(api).forEach((p) => { if (p !== "nora") { api.est(p, "miedo", 4); api.rel(p, "nora", "confianza", 4); } }); } },
      { texto: "Borrar el vídeo del bosque. Que nadie vuelva a oír eso.", a: "viii7_cohesion", si: (api) => api.bandera("movil_alex_hallado"), impulsiva: true,
        efecto: (api) => { api.marcar("viii_grab", "borra"); api.marcar("video_bosque_borrado", true); api.est("nora", "estres", 4); } },
      { texto: "Escribir. Todo. La hora del hallazgo. Las marcas. Lo del vaso.", a: "viii7_cohesion", lucida: true,
        efecto: (api) => { api.marcar("viii_grab", "escribe"); api.evidencia("cuaderno_muerte1", "nora", "cuaderno de Nora", "nota"); api.est("nora", "lucidez", 2); api.est("nora", "estres", -3); } },
    ],
  },

  viii7_cohesion: {
    pov: "irene",
    titulo: "La primera muerte · La culpa",
    hora: "05:47",
    alEntrar: (api) => {
      R().tick(api);
      const d = D(api);
      // Culpas: quién le dejó salir. Marcos dio la llave; Nora no le paró; Irene le llamó (o eso cree)
      if (d === "alex") { api.marcar("culpa_marcos", true); api.rel("irene", "marcos", "resentimiento", 8); api.rel("irene", "nora", "resentimiento", 4); }
      else { api.marcar("culpa_nora", true); api.rel("irene", "nora", "resentimiento", 6); api.rel("alex", "nora", "resentimiento", 6); api.rel("alex", "irene", "afecto", -4); }
      api.est("irene", "eje", -8);
    },
    texto: (api) => {
      const d = D(api);
      const h = H(api);
      const vivos = R().vivos(api).filter((p) => p !== "nora" && p !== "irene");
      const otroVivo = vivos[0];
      if (d === "alex") return `
Álex.

Álex, al que le lamiste el pulgar en la mesa a la una menos veinte. Álex, con la mano donde la tiene siempre. Álex, que te guiñó un ojo mientras te ahogabas${api.bandera("irene_senal") ? " y no lo entendió" : ""}. Álex, que era horrible, y tú también, y erais compatibles siendo horribles.

En una zanja. Con la boca llena. Con la mano abierta.

Y aquí, en la mesa, Marcos. ${R().herido(api, "marcos", "sangra") ? "Con la mano vendada. " : ""}Con la cara de buscar nombres.

Irene: Le diste la llave.

Marcos: Irene.

Irene: Le diste la llave, Marcos. Dijiste que nadie sale. Lo dijiste tú. Y le diste la llave.

Marcos: Me pidió un minuto.

Irene: ¡Y le diste la llave!

Te has levantado. No sabías que te habías levantado. Tienes las manos en la mesa y tiemblan y no te importa.

${h === "marcos" ? "Marcos te mira. Y no dice nada. No dice «tenía razón». No dice «era su decisión». Te mira como se mira una cosa que ya sabías que iba a pasar." : "Marcos no se defiende. Marcos, que lo explica todo, no explica esto. Se queda con las manos en la mesa y la cabeza baja, y por primera vez en cinco años le ves la coronilla."}

Nora: Irene.

Irene: Y tú no le paraste. Estabas al lado de la puerta. Le viste bajar. Le llamaste una vez. Una.

Nora: Le llamé.

Irene: Una vez.

Y Nora no contesta. Y en la cara de Nora hay algo que no habías visto en toda la noche, que es que te está dando la razón.

~ Le llamé yo. Desde los árboles. Con mi voz. Es lo que dijo. Me oyó a mí. Y fue.

~ No. Yo estaba en la puerta. Con las manos en el marco. Yo no le llamé. Le llamó lo que sabe mi voz.

Te sientas. Te miras las manos. ${h === "irene" ? "Y una de ellas está cerrada, con los nudillos blancos, y no te acuerdas de haberla cerrado.\n\n~ " + R().intrusion(api, "irene", 2) : "Y no sabes leer a nadie. Ni a Marcos. Ni a Nora. Se te ha ido la única cosa que sabes hacer, y se ha ido con Álex."}

${modo(api, "irene", {
  lucido: "~ Marcos dio la llave. Nora no le paró. Yo estaba en la puerta. Y ninguno de los tres le mató, y los tres lo hicimos. Eso es lo que sé leer ahora. Eso y nada más.",
  asustado: "~ Me oyó. Con mi voz. La de pedir ayuda. Y fue. Álex, que no va a ningún sitio por nadie, fue por mí.",
  tenso: "~ La llave. La puta llave. Y el «un minuto». Y el «nadie sale» de Marcos, que vale lo que valen las cosas de Marcos.",
  ido: "~ La silla de Álex sigue caliente. La toco y está caliente. Y hace veinte minutos que está en una zanja.",
  perdido: "~ Uno. Ya ha dicho uno. Y no me suelta el cuello desde la mesa. Me está guardando para el final.",
  normal: "~ Álex. Álex, hijo de puta. Te dije que no subieras a ningún sitio. Te lo dije de todos los sitios.",
})}`;

      return `
Marcos.

Marcos, al que le sujetaste el pelo en tu bañera hace cinco años. Marcos, que nunca te besó en el sofá de Rubén${api.bandera("p3") === "beso" || api.bandera("p3") === "beso_fuerte" ? " y te ha besado esta noche" : ""}. Marcos, que te sopló dentro cuando no respirabas${api.bandera("marcos_accion") === "rescate" ? "" : ", o no, o fue la lámpara"}. Marcos, que lo explicaba todo.

Colgando de un cinturón en un coche boca arriba, con la fiesta en la radio.

Y aquí, en la mesa, Nora. ${api.bandera("camisa_en_cuerpo") ? "Con la camiseta y sin la camisa. " : ""}Con el cuaderno cerrado. Con la cara de quien ha visto lo que ha visto.

Irene: Le dejaste salir.

Nora: Irene.

Irene: Dijo «voy a cerrar el cobertizo» y le dejaste salir. Tú. Que le conoces desde marzo. Yo le conozco desde hace cinco años y sé que Marcos no va a cerrar ningún cobertizo a las cinco de la mañana. Marcos deja una nota en la nevera para ir a mear.

Álex: Irene.

Irene: ¡Y ella le dejó!

Te has levantado. Tienes las manos en la mesa y tiemblan. Y Nora no se defiende. Nora, que lo apunta todo, no tiene nada que apuntar.

Nora: Le llamé.

Irene: Una vez.

Nora: Le llamé y levantó la mano.

Y se calla. Y en la cara de Nora hay una cosa que no le has visto en toda la noche: que te está dando la razón. Y no te sirve de nada tenerla.

Álex está de pie. Con el pie como esté. Y no hace ningún chiste, y no graba, y tiene la mandíbula de Marcos, la que ponía Marcos cuando le tocaba ser el adulto.

Álex: Se acabó. Nos vamos. Ahora. Andando si hace falta.

Nora: Son las seis menos cuarto.

Álex: Me da igual la hora.

Nora: Está oscuro hasta las siete y hay un coche en el camino con Marcos dentro.

Y Álex se sienta. Porque es verdad. Porque el camino pasa por el coche. Porque nadie va a pasar por el coche.

~ Marcos. Marcos, que no me dijo que sí en el sofá. Que no me dijo que sí en cinco años. Y ahora ya no me va a decir nada.

${h === "irene" ? `Y te llega. Con tu voz.

~ ${R().intrusion(api, "irene", 2)}

Miras a Nora. A Álex. No sabes a cuál iba. Sabes que iba.` : "Y no sabes leer a Álex. Ni a Nora. Se te ha ido la única cosa que sabes hacer, y se ha ido en el coche."}

${modo(api, "irene", {
  lucido: "~ Nora le dejó salir. Álex le dio cuerda toda la noche. Yo le pedí que subiera conmigo hace dos horas. Y ninguno le mató, y los tres lo hicimos. Es lo único que sé leer ahora.",
  asustado: "~ Le llamaron con mi voz. Como a Álex. Con mi voz de pedir. Y fue. Fue por mí, y yo estaba en la puerta.",
  tenso: "~ «Voy a cerrar el cobertizo.» Y ella asintió. Y yo también. Y Álex también. Los tres. Pues los tres.",
  ido: "~ La silla de Marcos sigue caliente. La toco y está caliente. Y hace veinte minutos que cuelga de un cinturón.",
  perdido: "~ Uno. Ya ha dicho uno. Con mi voz. Me está guardando para el final, y el final es el baño de arriba, y lo sé desde que subí.",
  normal: "~ Marcos. Marcos, joder. Que te dije que no salieras. Que te lo dije yo.",
})}`;
    },
    opciones: [
      { texto: "Sentarte. Callarte. Coger la mano de quien tengas al lado.", a: "viii8_voces",
        efecto: (api) => { api.marcar("viii_culpa", "mano"); const o = R().vivos(api).find((p) => p !== "irene" && p !== "nora") || "nora"; R().contacto(api, "irene", o, 1); api.est("irene", "estres", -3); } },
      { texto: "«Fue mi voz. Le llamó mi voz. Me oyó a mí.» Decirlo.", a: "viii8_voces",
        efecto: (api) => { api.marcar("viii_culpa", "voz"); api.marcar("irene_cuenta_voz", true); api.est("irene", "estres", 4); api.rel("nora", "irene", "confianza", 4); api.saber("nora", "irene_cree_voz"); } },
      { texto: "Irte al baño de abajo. Cerrar. Que nadie te vea la cara.", a: "viii8_voces",
        efecto: (api) => { api.marcar("viii_culpa", "bano"); api.est("irene", "eje", 2); api.est("irene", "miedo", 4); R().necesidad(api, "irene", "herida"); } },
      { texto: "Mirar a los dos que quedan. Leerles. Aunque no puedas.", a: "viii8_voces", lucida: true,
        efecto: (api) => { api.marcar("viii_culpa", "lee"); api.est("irene", "lucidez", 2); const hh = H(api); if (hh === "marcos" && R().vivo(api, "marcos")) api.saber("irene", "marcos_raro"); } },
    ],
  },

  viii8_voces: {
    pov: (api) => R().vivos(api).find((p) => p !== "nora" && p !== "irene") || "irene",
    fondo: "assets/fondos/salon_gris.jpg",
    titulo: "La primera muerte · Lo dicho",
    hora: "05:52",
    alEntrar: (api) => {
      R().tick(api);
      const v = api.anomalia("voz_devuelta");
      api.marcar("voz_devuelta", v);
      const d = D(api);
      api.marcar("voz_devuelta_frase", R().voz(api, d, 0));
      const o = R().vivos(api).find((p) => p !== "nora" && p !== "irene") || "irene";
      if (v) { api.saber(o, "voz_muerto"); api.presenciar(o, 2); }
      if (api.bandera("segundo_marcado") === o) api.est(o, "lucidez", -4);
    },
    texto: (api) => {
      const d = D(api);
      const o = R().vivos(api).find((p) => p !== "nora" && p !== "irene") || "irene";
      const h = H(api);
      const v = api.bandera("voz_devuelta");
      const frase = api.bandera("voz_devuelta_frase");
      const marcado = api.bandera("segundo_marcado") === o;
      const vc = api.bandera("viii_culpa");
      const inicio = vc === "voz" ? `
Irene: Fue mi voz. Le llamó mi voz. Me oyó a mí.

Lo ha dicho a la mesa. Sin la voz. Y nadie le ha dicho que no.` : vc === "bano" ? `
Irene se ha ido al baño de abajo. Ha cerrado. Se oye el grifo. Se oye que no es el grifo.` : vc === "lee" ? `
Irene te mira. Como te miraba antes: un segundo por delante de lo que vas a decir. Y ves que no llega. Que va un segundo por detrás. Que te lee y no sabe qué pone.` : `
Irene se ha sentado. Se ha callado. Te ha cogido la mano por encima de la mesa y no la suelta, y su mano está fría, o la tuya.`;
      if (o === "marcos") return `${inicio}

La mesa. Tres. La silla de Álex vacía, con su cerveza a medias delante, con el cenicero lleno de sus colillas.

${marcado ? "Y la ventana. No la miras. La miras. Los faros siguen ahí, abajo, entre los pinos. Quietos. Esperando. Y ahora sabes qué esperan, porque has visto un coche boca arriba en tu cabeza toda la noche y era el tuyo." : R().herido(api, "marcos", "sangra") ? "Y la mano. Late. Debajo del paño. Como algo que quiere salir." : "Y las manos. Quietas en la mesa. Enteras. Y aun así, algo que late."}

Nora escribe. Irene ${vc === "bano" ? "en el baño." : "con la cabeza en la mesa."} Y tú, con nada que arreglar por primera vez en tu vida.

${v ? `Y desde fuera. Desde el porche. A través de la puerta.

«${frase}»

La voz de Álex.

Exacta. Con su ritmo. Con la sonrisa dentro de la voz. Las palabras que dijo esta noche, en esta mesa, ${frase.length > 30 ? "cuando todavía era una fiesta" : "hace unas horas"}. Devueltas desde el porche. Desde donde no hay nadie, porque Álex está en una zanja con la boca llena.

Nora levanta la cabeza. Lo ha oído. Irene también.

Nadie va a la puerta.

«${frase}»

Otra vez. Igual. Como una grabación. No: como alguien que se ha aprendido una frase y la prueba.

~ Está en mi móvil. O en el de Irene. O en la cabeza de cada uno. Lo dijo aquí, en esta mesa, y la casa estaba aquí, en esta mesa, y se lo quedó.

~ Cuanto más hablamos dentro, más tiene. Eso lo pensó Nora hace tres horas y me lo dijo y me reí.` : `Y nada. La nevera. El generador lejos. Y las tres respiraciones, que se oyen demasiado.

Y en el silencio, sin voz, sin golpe, tienes la certeza más grande de la noche: que la casa está esperando a que uno de los tres diga algo, para quedárselo.`}

${modo(api, "marcos", {
  lucido: `~ ${v ? "Su voz. Sus palabras. Grabadas en dos móviles y en tres cabezas. Y reproducidas desde un porche vacío. No hay explicación eléctrica para esto. Es la primera vez que lo pienso entero: no hay explicación." : "Tres personas. Una mesa. Ochenta minutos. Y nada que arreglar. Es lo único que no sé hacer, y es lo único que queda."}`,
  asustado: `~ ${marcado ? "Los faros. Siguen ahí. Me esperan a mí. Álex ha ido primero porque le llamaron primero. A mí me llamaron después." : "Su voz. Desde fuera. Y yo aquí sin hacer un chiste, porque ya no me sale ninguno."}`,
  tenso: "~ Que se calle. Que se calle Álex. Que se calle lo que habla con la boca de Álex.",
  ido: `~ ${v ? "Suena mejor desde fuera. Más él. Como si el de aquí dentro fuera la copia y el de fuera el original." : "La silla de Álex está más cerca de la mesa que antes. Alguien la ha acercado. Nadie la ha tocado."}`,
  perdido: `~ ${h === "marcos" ? "Uno. Lo he dicho yo. Uno. Y lo que llevo dentro lo ha contado conmigo." : "Se lo ha comido. La voz. Se ha comido a Álex y ahora tiene su voz para usarla. Como un abrigo."}`,
  normal: "~ Ochenta minutos. Tres personas. Una puerta. Que nadie hable con la puerta.",
})}`;

      // Álex vivo, Marcos muerto
      return `${inicio}

La mesa. Tres. La silla de Marcos vacía, con su cerveza a medias, ${R().lleva(api, "marcos", "atizador") ? "con el atizador apoyado en el respaldo" : "un poco separada de la mesa, como la dejó"}.

${marcado ? "Y la ventana. No la miras. La miras. Y en el cristal, dos golpes que solo oyes tú, toc, toc, y el tercero que no llega porque el tercero es tuyo." : R().herido(api, "alex", "cojera") ? "Y el pie. Late. Como algo que quiere salir." : R().herido(api, "alex", "sangra") ? "Y la mano. Late. Debajo del paño. Como algo que quiere salir." : "Y nada. Y eso también late."}

Nora escribe. Irene ${vc === "bano" ? "en el baño." : "con la cabeza en la mesa."} Y tú sin documental, sin chiste, sin nada que decir a cámara, con las manos vacías por primera vez desde que tienes manos.

${v ? `Y desde fuera. Desde el porche. A través de la puerta.

«${frase}»

La voz de Marcos.

Exacta. Con su ritmo. Con la seriedad dentro de la voz. Las palabras que dijo esta noche, en esta mesa, cuando todavía tenía palabras para todo. Devueltas desde el porche. Desde donde no hay nadie, porque Marcos está colgando de un cinturón con la fiesta en la radio.

Nora levanta la cabeza. Lo ha oído. Irene también.

Nadie va a la puerta.

«${frase}»

Otra vez. Igual. Como una grabación. No: como alguien que se ha aprendido una frase y la prueba.

~ Está en mi cabeza. Y en la de Nora. Y en el vídeo. Lo dijo aquí, y la casa estaba aquí, y se lo quedó. Como se queda los golpes. Como se queda mi voz.

~ Cuanto más hablamos dentro, más tiene. Lo dijo Nora. Me reí.` : `Y nada. La nevera. El generador lejos. Y las tres respiraciones, que se oyen demasiado.

Y en el silencio, sin voz, sin golpe, se te ocurre lo peor que se te ha ocurrido en toda la noche: que la casa no está esperando nada. Que ya lo tiene.`}

${modo(api, "alex", {
  lucido: `~ ${v ? "Su voz. Sus palabras. Devueltas desde un porche vacío. Lo conté yo: voces que te llaman por tu nombre. Lo conté como se cuenta un chiste, y la casa se lo tomó en serio." : "Tres personas. Una mesa. Ochenta minutos. Y yo de adulto. Yo. Marcos se reiría. Marcos no se va a reír."}`,
  asustado: `~ ${marcado ? "Los golpes. Siguen. Me esperan a mí. Marcos ha ido primero porque bajó primero. A mí me toca el tercero." : "Su voz. Desde fuera. Y yo sin un chiste, porque el chiste era él."}`,
  tenso: "~ Que se calle. Que se calle Marcos. Que se calle lo que habla con su boca.",
  ido: `~ ${v ? "Suena mejor desde fuera. Más él. Como si el Marcos de dentro fuera el que me inventé y el de fuera el de verdad." : "El atizador está más cerca de la mesa que antes. Alguien lo ha movido. Nadie lo ha tocado."}`,
  perdido: "~ Se lo ha comido. La voz. Se ha comido a Marcos y ahora tiene su voz para usarla. Como un abrigo.",
  normal: "~ Ochenta minutos. Tres personas. Una puerta. Y que nadie hable con la puerta. Ni yo.",
})}`;
    },
    opciones: [
      { texto: "«No contestéis. Nadie contesta a eso.» A la mesa. Bajo.", a: "viii9_cierre", si: (api) => api.bandera("voz_devuelta"),
        efecto: (api) => { const o = R().vivos(api).find((p) => p !== "nora" && p !== "irene") || "irene"; api.marcar("viii_voz", "nadie"); api.est(o, "eje", 2); R().vivos(api).forEach((p) => api.rel(p, o, "confianza", 2)); } },
      { texto: "Ir a la puerta. Pegar la oreja. Solo escuchar.", a: "viii9_cierre", si: (api) => api.bandera("voz_devuelta"),
        efecto: (api) => { const o = R().vivos(api).find((p) => p !== "nora" && p !== "irene") || "irene"; api.marcar("viii_voz", "puerta"); api.est(o, "miedo", 5); api.est(o, "lucidez", -2); api.saber(o, "escucho_puerta"); } },
      { texto: "Coger el atizador. Ponerlo encima de la mesa. Delante de ti.", a: "viii9_cierre",
        efecto: (api) => { const o = R().vivos(api).find((p) => p !== "nora" && p !== "irene") || "irene"; api.marcar("viii_voz", "atizador"); R().coger(api, o, "atizador"); api.est(o, "eje", 2); } },
      { texto: "Beber la cerveza del muerto. La de la silla vacía. De un trago.", a: "viii9_cierre", impulsiva: true,
        efecto: (api) => { const o = R().vivos(api).find((p) => p !== "nora" && p !== "irene") || "irene"; api.marcar("viii_voz", "cerveza"); api.consumir(o, "cerveza"); api.est(o, "estres", -3); api.rel("irene", o, "resentimiento", 4); } },
    ],
  },

  viii9_cierre: {
    pov: "nora",
    titulo: "La primera muerte · Los que quedan",
    hora: "05:58",
    alEntrar: (api) => {
      R().tick(api);
      api.marcar("fase8_completa", true);
      const R_ = R();
      const o = R_.vivos(api).find((p) => p !== "nora" && p !== "irene") || null;
      // Necesidades para la IX: quién sangra, quién tiene frío, quién no aguanta la habitación
      R_.necesidad(api, "irene", "frio");
      if (o) R_.necesidad(api, o, R_.herido(api, o, "sangra") ? "herida" : o === "alex" ? "fumar" : "mear");
      R_.necesidad(api, "nora", R_.herido(api, "nora", "mano") ? "herida" : "sed");
      api.est("nora", "estres", 4);
    },
    texto: (api) => {
      const d = D(api);
      const o = R().vivos(api).find((p) => p !== "nora" && p !== "irene") || null;
      const h = H(api);
      const seg = api.bandera("segundo_marcado");
      const vv = api.bandera("viii_voz");
      const inicio = vv === "nadie" ? `${N[o]}: No contestéis. Nadie contesta a eso.\n\nLo ha dicho bajo. Y nadie ha contestado. Y la voz de fuera ha dicho la frase una vez más, y luego no.` : vv === "puerta" ? `${N[o]} ha ido a la puerta. Ha pegado la oreja. Un minuto. Dos. Y ha vuelto con la cara de haber oído algo que no va a decir.` : vv === "atizador" ? `${N[o]} tiene el atizador encima de la mesa. Delante. Con la mano encima. Como se tiene la mano encima de un perro.` : vv === "cerveza" ? `${N[o]} se ha bebido la cerveza de ${N[d]}. La de la silla vacía. De un trago. Irene le ha mirado como se mira a alguien que ha pisado una tumba.` : `${o ? N[o] + " con las manos en la mesa." : "Irene con las manos en la mesa."} Nadie ha ido a la puerta.`;
      return `
${inicio}

Las seis menos dos minutos. Faltan sesenta y dos para las siete. Lo has dicho en voz alta. Nadie te ha pedido que lo dijeras.

Tres.

Tú, ${api.bandera("camisa_en_cuerpo") ? "con la camiseta y sin la camisa, " : ""}con el cuaderno abierto y una página que dice lo que dice. Irene, ${h === "irene" ? "con la mano en el cuello y los ojos en la silla vacía, quieta, como quien escucha a alguien sentado" : "descalza, con las rodillas en el pecho, temblando de una manera que ya no es de frío"}. ${o === "marcos" ? "Marcos, " + (R().herido(api, "marcos", "sangra") ? "con la mano vendada y " : "con ") + (R().lleva(api, "marcos", "atizador") ? "el atizador" : "las manos en la mesa") + (seg === "marcos" ? " y la mirada en la ventana, en los faros que no ve nadie más" : "") + "." : o === "alex" ? "Álex, " + (R().herido(api, "alex", "cojera") ? "con el pie hinchado y " : "con ") + "el móvil apagado" + (seg === "alex" ? " y la mirada en el cristal, en los golpes que no oye nadie más" : "") + "." : ""}

Y la silla vacía. Con la cerveza a medias. Que nadie aparta.

${seg ? `~ ${N[seg]}. Mira la ventana como miraba ${N[d]} la puerta. Exactamente igual. Con la cara de quien ha oído su nombre.` : "~ Uno. Y los que quedan somos tres. Y la casa sabe contar."}

Escribes. Debajo de todo lo demás:

05:30. ${N[d]}. ${d === "alex" ? "El terraplén. Cuatro metros. Cuatro marcas en el cuello." : "El coche. La curva del pino. Cuatro marcas en el cuello."} ${api.bandera("vaso_en_video") ? "El vaso se mueve solo en el vídeo." : ""} ${api.bandera("voz_devuelta") ? "Su voz desde el porche. Sus palabras." : ""} Quedamos tres.

Y lo cierras.

${modo(api, "nora", {
  lucido: `~ ${seg ? "Dos cruzaron. Uno ha muerto. El otro mira la ventana. Las matemáticas de esta noche son las de siempre: lo que sale de la luz no vuelve entero." : "Cruzó uno. Ha muerto uno. Y nadie más ha cruzado. Es lo único que se puede hacer: no cruzar. Y quedan sesenta minutos de no cruzar."}`,
  asustado: "~ Sabe contar. Uno. Y va a decir dos. Y va a decir tres. Y a mí me deja para el final porque lo mío no se cuenta.",
  tenso: "~ Sesenta minutos. Sesenta. Con la luz. Con la puerta. Con los tres en la mesa. Se puede.",
  ido: "~ La silla vacía no está vacía. Se ve que no. Se ve el peso. Se ve la cerveza que baja sola un dedo.",
  perdido: "~ Está sentado con nosotros. Ha vuelto de la zanja con la boca llena y se ha sentado en su silla. Y por eso nadie la aparta.",
  normal: "~ Tres. Sesenta minutos. Una puerta cerrada. Y que nadie se levante.",
})}

...`;
    },
    opciones: [{ texto: "Continuar", a: "ix1_nivel3" }],
  },

  });
})();
