/*
 * LA BRUJA — PRÓLOGO
 * Fase X: Segunda muerte y casa hostil (HORROR_STAGE 4 → 5) · Biblia §5 (X), §17, §18, §20, §22
 *
 * La casa ya no reparte: la puerta que no abre, la bañera de arriba con color, la mujer del techo para
 * Irene, los del pueblo en las ventanas para Nora. Si quedan tres, la segunda condena se cobra: el que no
 * lleva el huésped. Irene, en la bañera (la voz de un muerto tras la puerta que pasa a estar arriba, la
 * mujer del camisón, el agua de un color imposible; su cuerpo aparece cuando el agua ya no está). Álex, el
 * bosque. Marcos, el coche. Vivida desde dentro o vista desde una habitación de distancia. Después quedan
 * dos: Nora y el último, que lleva el huésped. El tramo íntimo empieza. Las siete no llegan.
 *
 * Se consume de la IX: muerto_*, huesped (puede haber cambiado de cuerpo), huesped_anterior, ataque_*,
 * suplica_resultado, huesped_atado / encerrado, segundo_marcado, heridas, mano_*, banera_llena.
 * Se deja para la XI: muerte del segundo, ultimo (R.ultimo), puerta_no_abre, mujer_techo_vista,
 * caras_ventana, banera_color, intimo_* (cómo llegan los dos al final), ofrendas.
 *
 * Presupuesto de anomalías Fase X: 6 → puerta_no_abre · banera_color · mujer_techo · caras_ventana · voz_intercambio · reloj_parado
 */
(() => {
  const R = () => HISTORIA.R;
  const modo = (api, id, m) => m[api.modo(id)] || m.normal;
  const H = (api) => api.bandera("huesped");
  const N = { nora: "Nora", marcos: "Marcos", alex: "Álex", irene: "Irene" };
  const fem = (id) => id === "nora" || id === "irene";
  const vivos = (api) => R().vivos(api);
  // El segundo: quien no lleva el huésped, entre los que quedan aparte de Nora. Si quedan dos, nadie.
  const segundo = (api) => { const v = vivos(api).filter((p) => p !== "nora" && p !== H(api)); return v.length ? v[0] : null; };
  const ultimo = (api) => R().ultimo(api);
  const muertoPrimero = (api) => api.bandera("desaparecido") || R().muertos(api)[0] || "alex";
  // La voz que llama: la del muerto que más pesa para cada uno
  const vozQueLlama = (api, id) => { const m = R().muertos(api); if (id === "irene") return m.includes("alex") ? "alex" : m.includes("marcos") ? "marcos" : "alex"; if (id === "alex") return m.includes("marcos") ? "marcos" : "irene"; return m.includes("alex") ? "alex" : "nora"; };

  Object.assign(HISTORIA.presupuestoAnomalias, { X: 6 });
  Object.assign(HISTORIA.deriva, { X: { estres: 0.8, miedo: 0.6 } });

  const saltoPrevio = HISTORIA.prepararSalto;
  HISTORIA.prepararSalto = (api, id) => {
    if (typeof saltoPrevio === "function") saltoPrevio(api, id);
    if (!/^x\d/.test(id)) return;
    R().saltoBase(api);
    if (!api.bandera("fase9_completa")) {
      const h = H(api);
      const d = h === "marcos" ? "alex" : "marcos";
      ["fase6_completa", "fase7_completa", "fase8_completa", "fase9_completa", "evento_imposible", "luz_vuelta", "apagon", "video_mesa_visto"].forEach((f) => api.marcar(f, true));
      api.marcar("generador_quien", d); api.marcar("primer_cruce", d); api.marcar("desaparecido", d);
      R().cruzar(api, d); R().matar(api, d, d === "alex" ? "bosque" : "coche", d === "alex" ? "el terraplén bajo los pinos" : "el camino, contra el pino grande", "nora");
      api.marcar("ataque_victima", h === "marcos" ? "irene" : (d === "alex" ? "marcos" : "alex")); api.marcar("ataque_resultado", "hiere"); api.marcar("huesped_retirado", true); api.marcar("suplica_resultado", "no_cree");
    }
    R().fase(api, "X", 4, 3);
    if (/^x[4-8]/.test(id) && !api.bandera("segundo_muerte") && segundo(api)) api.marcar("segundo_muerte", segundo(api));
    if (/^x[5-8]/.test(id) && api.bandera("segundo_muerte") && R().vivo(api, api.bandera("segundo_muerte"))) matarSegundo(api, "nora");
  };

  function matarSegundo(api, vistoPor) {
    const s = api.bandera("segundo_muerte") || segundo(api);
    if (!s || !R().vivo(api, s)) return;
    const como = s === "irene" ? "banera" : s === "alex" ? "bosque" : "coche";
    const donde = s === "irene" ? "la bañera del baño de arriba" : s === "alex" ? "el borde de los pinos" : "el camino, contra el pino grande";
    R().matar(api, s, como, donde, vistoPor);
    api.marcar("cuerpo_" + s, como);
    api.horror(5);
    if (s === "irene") api.marcar("mujer_techo_vista", true);
  }

  Object.assign(HISTORIA.escenas, {

  // =====================================================================
  // FASE X — CASA HOSTIL
  // =====================================================================

  x1_hostil: {
    pov: "nora",
    fondo: "assets/fondos/salon_gris.jpg",
    ambiente: "interior",
    musica: "terror",
    lugar: "comedor", hora: "06:45",
    titulo: "La casa hostil · La puerta",
    alEntrar: (api) => {
      R().fase(api, "X", 4, 3);
      R().tick(api);
      api.marcar("fase10_empezada", true);
      api.marcar("puerta_no_abre", true);
      api.marcar("caras_ventana", api.anomalia("caras_ventana"));
      api.marcar("reloj_parado", api.anomalia("reloj_parado"));
      if (api.bandera("caras_ventana")) { api.saber("nora", "caras_ventana"); api.presenciar("nora", 2); }
      vivos(api).forEach((p) => api.est(p, "estres", 5));
    },
    texto: (api) => {
      const h = H(api);
      const s = segundo(api);
      const u = ultimo(api);
      const vs = vivos(api);
      const sr = api.bandera("suplica_resultado");
      const caras = api.bandera("caras_ventana");
      const estadoH = !R().vivo(api, h) ? "" : sr === "encerrado" ? `${N[h]} en el almacén, con el cerrojo. Ya no golpea.` : sr === "atado" ? `${N[h]} en la silla, atad${fem(h) ? "a" : "o"}, con la cabeza baja.` : `${N[h]} ${sr === "cree" ? "al lado de quien le creyó" : "al otro lado de la mesa"}, con las manos a la vista y frío.`;
      return `
Las seis y cuarenta y cinco. Quince minutos.

${vs.length === 3 ? "Tres." : "Dos."} ${vs.map((p) => N[p]).join(", ")}. ${estadoH}

Y decides. Tú. Porque nadie más decide ya nada.

Nora: Nos vamos.

${s ? N[s] + ": Son menos cuarto." : N[u] + ": Son menos cuarto."}

Nora: Me da igual. Con luz o sin luz. Cogemos las cosas y salimos a la carretera y andamos. Diez kilómetros. Se andan.

${vs.length === 3 ? "Nadie discute. Ya no queda nadie que discuta." : "No discute. Ya no queda quien discuta."}

La mochila. El cuaderno dentro. ${api.bandera("nora_toma_muneca") ? "La muñeca, no: la muñeca se queda en la mesa con los ojos cosidos hacia arriba." : ""} El móvil al doce por ciento. Las llaves de la casa en tu bolsillo, que ${R().vivo(api, "marcos") ? "Marcos te ha dado sin que se las pidieras" : "cogiste del bolsillo de Marcos y no piensas en eso"}.

La puerta.

Metes la llave. Gira. Dos vueltas. Se oye el cerrojo salir con su ruido de hierro viejo.

Y tiras.

Y la puerta no se abre.

No está atascada. No está hinchada. Tiras y la puerta no viene, como no viene una pared. Como si al otro lado hubiera alguien empujando con el peso. Con las dos manos. Con paciencia.

Nora: Ayuda.

${u ? N[u] + " tira contigo. Los dos. Con el peso." : ""} ${s ? N[s] + " tira. Los tres." : ""} Y la puerta no viene.

~ La puerta deja de dejarte salir. Lo dijo Álex. Lo dijo con el vaso en la mano, señalando esta puerta. Y se rio. Y nos reímos.

La ventana. La del salón. ${caras ? `Y en el cristal, con el gris de fuera detrás, caras.

Pegadas al cristal. Tres. Cuatro. De hombres. Con la boca abierta y los ojos hundidos y el pelo pegado a la frente. Mirando dentro. Como quien mira un fuego.

Un segundo.

Y el cristal devuelve la habitación. La lámpara. La mesa. ${vs.map((p) => N[p]).join(", ")}. Nadie fuera. Nada.

Nadie más las ha visto. Lo sabes porque nadie ha gritado.` : "Devuelve la habitación. La lámpara, la mesa, vosotros. Fuera, el gris. Un gris de nada."}

${api.bandera("reloj_parado") ? "Y el reloj de la cocina. El redondo, de pared, que se ve por el arco. Las seis y cuarenta y cinco. Lo miras. Las seis y cuarenta y cinco. Lo miras un minuto entero contando en voz baja. Las seis y cuarenta y cinco." : ""}

${modo(api, "nora", {
  lucido: "~ Una puerta que no abre con el cerrojo abierto. Ya no hay diferencial, ni bombilla, ni rama. Ya no hay nada que se explique. Es la primera vez en toda la noche que la casa no se molesta en parecer una casa.",
  asustado: "~ Nos ha cerrado. Con los tres dentro. Con los dos. Como se cierra una caja con lo que hay dentro.",
  tenso: "~ La ventana. Romper la ventana. Con una silla. Con el atizador. Con la cabeza.",
  ido: "~ La puerta no está cerrada. Es que ya no es una puerta. Es una pared que se acuerda de haber sido puerta.",
  perdido: `~ Nos quiere aquí. A las siete. Para lo de las siete. ${caras ? "Y los de fuera han venido a verlo." : ""}`,
  normal: "~ Vale. Vale. La puerta no. La ventana. La de la cocina. La de arriba. Alguna.",
})}`;
    },
    opciones: [
      { texto: "La ventana. Con una silla. Romperla.", a: "x2_llamada",
        efecto: (api) => { api.marcar("x1_nora", "ventana"); api.marcar("ventana_rota", false); api.est("nora", "estres", 6); api.presenciar("nora", 1); } },
      { texto: "«Pues nos quedamos. Juntos. En esta mesa. Hasta que abra.»", a: "x2_llamada",
        efecto: (api) => { api.marcar("x1_nora", "mesa"); vivos(api).forEach((p) => api.est(p, "estres", -2)); api.est("nora", "eje", 2); } },
      { texto: "Escribir. «06:45. La puerta no abre. Nadie la sujeta.»", a: "x2_llamada", lucida: true,
        efecto: (api) => { api.marcar("x1_nora", "escribe"); api.evidencia("cuaderno_puerta", "nora", "cuaderno de Nora", "nota"); api.est("nora", "lucidez", 1); } },
      { texto: "Pegar la cara al cristal. Mirar fuera. Aunque haya algo.", a: "x2_llamada", impulsiva: true,
        efecto: (api) => { api.marcar("x1_nora", "cristal"); api.est("nora", "miedo", 6); api.saber("nora", "nadie_fuera"); } },
    ],
  },

  x2_llamada: {
    pov: (api) => segundo(api) || "nora",
    titulo: "La casa hostil · La llamada",
    hora: "06:50",
    alEntrar: (api) => {
      R().tick(api);
      const s = segundo(api);
      if (s) { api.marcar("segundo_muerte", s); api.marcar("voz_intercambio", api.anomalia("voz_intercambio")); api.presenciar(s, 2); api.est(s, "lucidez", -8); }
      api.marcar("banera_color", api.anomalia("banera_color"));
    },
    texto: (api) => {
      const s = segundo(api);
      const h = H(api);
      const x1 = api.bandera("x1_nora");
      const inicio = x1 === "ventana" ? "Nora ha cogido una silla. La ha estrellado contra la ventana del salón. La silla se ha roto. La ventana no. Ni una grieta. Nora se ha quedado mirando el cristal entero con las patas de la silla en la mano." : x1 === "mesa" ? "Nora: Pues nos quedamos. Juntos. En esta mesa. Hasta que abra.\n\nY os habéis sentado. Otra vez. Con las manos en la madera." : x1 === "escribe" ? "Nora ha escrito. La hora. Que la puerta no abre. Que nadie la sujeta. Y ha cerrado el cuaderno como se cierra una puerta que sí cierra." : "Nora ha pegado la cara al cristal. Un minuto. Ha vuelto con la cara blanca. «Nadie», ha dicho. Y no era una buena noticia.";
      if (!s) return `
${inicio}

Dos. Tú y ${N[ultimo(api)]}. ${R().vivo(api, h) && h !== "nora" ? "Y lo que lleva " + N[h] + " dentro, que ya no se esconde." : ""}

${api.bandera("banera_color") ? `Y arriba, el grifo. Otra vez. El chorro contra la porcelana, largo, y el rebosadero tragando.

Y por el hueco de la escalera, bajando por los escalones como baja una alfombra, un olor. Dulce. A fruta pasada. A lo que olía el armario, la buhardilla, el almacén. Y otro debajo: a hierro. A moneda en la boca.

El agua de arriba no es agua.` : "Y arriba, nada. El baño en silencio. Y el silencio del baño baja por la escalera como baja una alfombra."}

${modo(api, "nora", {
  lucido: "~ Dos. Quedamos dos. La casa ya no necesita separarnos: solo tiene que esperar.",
  asustado: "~ Dos. Y el olor. El olor a dulce, que ha bajado a buscarnos.",
  tenso: "~ Que no suba nadie. Que no baje nada. Diez minutos.",
  ido: "~ El agua de arriba suena a otra cosa. A alguien que respira con el grifo.",
  perdido: "~ Ya solo tiene que esperar. Se ha sentado con nosotros a esperar. En la silla vacía.",
  normal: "~ Diez minutos. Dos personas. Una mesa. Se puede.",
})}`;

      const voz = vozQueLlama(api, s);
      const inter = api.bandera("voz_intercambio");
      if (s === "irene") return `
${inicio}

Y arriba, el grifo.

Lo oyes tú primero. Siempre lo oyes tú primero: el chorro contra la porcelana, largo, y el rebosadero tragando con su ruido de garganta. El baño de arriba. La bañera que ${api.bandera("banera_llena") ? "se llenó una vez esta noche y no se vació" : "goteaba a la una y corría a las tres y media"}.

Y por el hueco de la escalera, bajando como baja una alfombra, un olor. Dulce. A fruta pasada. Y otro debajo: a hierro. A moneda en la boca.

Y entonces, arriba, tras la puerta del baño:

Irene.

La voz de ${N[voz]}.

${voz === "alex" ? "La de la mesa. La de «documental número uno». La que está en una zanja con la boca llena." : "La de la ouija. La de «Irene, Irene, mírame». La que está en un coche boca arriba con la fiesta en la radio."}

Irene. Ven.

${inter ? `Irene: ¿Qué?

Lo has dicho. En voz alta. A la escalera. Y la voz contesta. No como una grabación: como alguien.

${N[voz]}: Ven. Que el agua sale rara.

Irene: ${N[voz]} está muerto.

${N[voz]}: Ya. Ven.

Y no es una grabación. Una grabación no contesta. Una grabación no sabe que ${N[voz]} está muerto.` : `Irene. Ven. Que el agua sale rara.

Las palabras exactas. Las tuyas. Las de esta noche, en el baño de arriba, ${api.bandera("v_irene_con") === "marcos" ? "cuando le dijiste a Marcos «ven, el agua sale rara»" : "las que le dijiste a Marcos hace tres horas"}. Devueltas. Con la voz de un muerto.`}

~ Es él. No es él. Es su voz. Su voz está en el vídeo, en la mesa, en mi cabeza. Y en la casa, que se lo quedó todo.

~ Y sube. La voz sube. Ya no está tras la puerta del baño. Está más arriba. En el techo. Como si ${N[voz]} hubiera subido por la pared.

Nora te mira. Te está diciendo que no con la cabeza. Sin decirlo. ${R().vivo(api, h) && h !== "irene" ? N[h] + " no te mira. Mira la escalera. Y sonríe. Un milímetro." : ""}

${modo(api, "irene", {
  lucido: "~ Mis palabras. Con su voz. Desde arriba. Y sé que no es él, y sé que es la casa, y me estoy levantando. Las piernas primero. Es lo que hacen las piernas cuando te llaman con esa voz.",
  asustado: "~ Me llama con la voz de un muerto. Y el muerto sabe que está muerto. Y me llama igual.",
  tenso: "~ Que se calle. Que se calle con su boca. Que deje su boca en paz.",
  ido: "~ La voz sube por la pared como sube el agua por un vaso. Despacio. Con el nivel justo.",
  perdido: "~ Está arriba. Con el agua. Me está preparando el agua. Como se prepara un baño a alguien que llega tarde.",
  normal: "~ No. No, no, no. No subo. No subo. Nora, no me dejes subir.",
})}`;

      if (s === "alex") return `
${inicio}

Y en el cristal.

[toc]

Toc.

[toc]

Toc.

En la ventana del salón. Desde fuera. Un nudillo. Y el tercero, que no llega. Porque el tercero es tuyo.

Y desde fuera, desde el porche, con la voz de ${N[voz]}:

Álex. ${voz === "marcos" ? "No tiene gracia." : "Ven."}

${voz === "marcos" ? "Tus palabras. Las que le gritaste al bosque cuando desapareció. «Marcos, no tiene gracia.» Devueltas. Con su voz. La del coche boca arriba." : "Su voz. La de pedir ayuda de verdad. La de hace tres años en un coche."}

${inter ? `Álex: ¿Marcos?

Lo has dicho. Al cristal. Y contesta.

${N[voz]}: Sal. Que no tiene gracia.

Álex: Estás muerto.

${N[voz]}: Ya. Sal.

Una grabación no contesta. Una grabación no sabe que está muerta.` : `Álex. Sal. Que no tiene gracia.

Otra vez. Igual. Como alguien que se ha aprendido una frase y la prueba con la voz de otro.`}

~ Es su voz. Su voz está en mi cabeza y en el vídeo. Y ahora en el porche. Me la devuelve. Como el tablón. Como todo.

~ Y el tercer golpe es mío. Lleva toda la noche esperando a que lo dé. Y las manos quieren darlo.

Nora te mira. Te está diciendo que no con la cabeza. ${R().vivo(api, h) ? N[h] + " no te mira. Mira la ventana. Y sonríe. Un milímetro." : ""}

${modo(api, "alex", {
  lucido: "~ Marcos muerto llamándome con mis palabras. Sé que es la casa. Sé que no hay nadie. Y tengo la mano levantada para dar el tercero, y no me acuerdo de haberla levantado.",
  asustado: "~ Me llama con la voz de un muerto. Y el muerto sabe que está muerto. Y me llama igual.",
  tenso: "~ Que se calle. Que deje su voz en paz. Que se la devuelva.",
  ido: "~ Los golpes suenan dentro del cristal. En mi reflejo. Es mi reflejo el que llama desde fuera.",
  perdido: "~ Me está esperando para el tercero. Para completarlo. Uno, dos, y yo.",
  normal: "~ No. No, no, no. No salgo. No doy el tercero. Nora, no me dejes salir.",
})}`;

      // Marcos
      return `
${inicio}

Y la ventana.

Abajo, por el camino, entre los pinos, los faros.

Los mismos. Amarillos. Bajos. Parados donde se para un coche que espera. Y ahora, con el gris de fuera, los ves mejor: es un coche. Tu coche. Boca arriba, con un faro apuntando al cielo, en la curva del pino grande. Y detrás del coche, de pie, en el camino, una figura. Con una camisa negra. Con las mangas hasta los nudillos.

Y desde fuera, desde el porche, con la voz de ${N[voz]}:

Marcos. ${voz === "alex" ? "Tu coche." : "Ven."}

${voz === "alex" ? "Sus palabras. Las que te gritó desde el porche a las tres y media: «¡Marcos! ¡Tu coche!». Devueltas. Con su voz. La de la zanja." : "La voz de Nora. Desde fuera. Y Nora está aquí, a un metro, con las manos en la mesa, y no ha abierto la boca."}

${inter ? `Marcos: ¿${N[voz]}?

Lo has dicho. Al cristal. Y contesta.

${N[voz]}: Ven. Que se te ha quedado abierto.

Marcos: ${voz === "alex" ? "Estás muerto." : "Estás aquí."}

${N[voz]}: Ya. Ven.

Una grabación no contesta. Una grabación no sabe lo que sabe.` : `Marcos. Tu coche. Se te ha quedado abierto.

Otra vez. Igual.`}

~ Mi coche está en la curva con un faro al cielo y yo lo sé. Y la figura de la carretera es Nora, y Nora está aquí. Y las dos cosas las estoy viendo, y las dos son mentira, y solo una me deja quieto.

Nora te mira. Te está diciendo que no con la cabeza. ${R().vivo(api, h) ? N[h] + " no te mira. Mira la ventana. Y sonríe. Un milímetro." : ""}

${modo(api, "marcos", {
  lucido: "~ Mi coche, que está donde está. Y la figura, que es Nora, que está aquí. Es la única cosa de la noche que puedo comprobar con la cabeza: me giro, y Nora está. Y sigo mirando la carretera.",
  asustado: "~ Me llama con su voz. Con la de Nora. Sabe que con la de Nora voy. Sabe con qué voz va cada uno.",
  tenso: "~ Un problema. Un coche abierto. Con solución. La única de la noche. Y no puedo ir.",
  ido: "~ Los faros parpadean cuando parpadeo. Los cierro y se apagan. Los abro y siguen.",
  perdido: "~ Es mi coche esperándome para cambiarnos. Yo dentro, él fuera. Ya lo hemos hecho una vez esta noche.",
  normal: "~ No. No salgo. No hay coche. No hay nadie. Nora, no me dejes salir.",
})}`;
    },
    opciones: [{ texto: "Continuar", a: "x3_cartas" }],
  },

  x3_cartas: {
    pov: null,
    titulo: "La casa hostil · Quién lo ve",
    hora: "06:52",
    alEntrar: (api) => R().tick(api),
    texto: (api) => {
      const s = segundo(api);
      if (!s) return `
Dos. Y diez minutos. Y la casa esperando.

Lo que queda se ve desde Nora. No hay otro sitio desde donde verlo.`;
      return `
${N[s]} de pie. ${s === "irene" ? "Mirando la escalera. Con los pies descalzos ya en el primer escalón." : s === "alex" ? "Mirando la ventana. Con la mano levantada para el tercero." : "Mirando la ventana. Con la mano en el bolsillo donde están las llaves, que no están."}

Nora en la mesa. Diciendo que no con la cabeza.

Y ${N[H(api)] === N[s] ? "" : R().vivo(api, H(api)) ? N[H(api)] + ", sonriendo un milímetro." : "el frío, que ya sabe dónde vive."}

¿Desde dónde quieres verlo?`;
    },
    personajes: [
      { id: (api) => segundo(api) || "nora", si: (api) => Boolean(segundo(api)),
        descripcion: (api) => { const s = segundo(api); return s === "irene" ? "Irene. Arriba. El baño. El agua que la llama." : s === "alex" ? "Álex. El porche. El tercer golpe." : "Marcos. El coche. La carretera que vuelve."; }, a: "x4_segunda",
        efecto: (api) => { api.marcar("x_pov", "segundo"); } },
      { id: "nora", descripcion: (api) => segundo(api) ? "Nora. Desde la mesa. A una habitación de distancia. Oyéndolo." : "Nora. Desde la mesa. Con el último.", a: "x4_segunda",
        efecto: (api) => { api.marcar("x_pov", "nora"); } },
    ],
  },

  x4_segunda: {
    pov: (api) => api.bandera("x_pov") === "segundo" && segundo(api) ? segundo(api) : "nora",
    fondo: (api) => { const s = segundo(api); return s === "irene" ? "assets/fondos/bano_rojo.jpg" : s === "alex" ? "assets/fondos/bosque_fuego.jpg" : s === "marcos" ? "assets/fondos/coche.jpg" : "assets/fondos/salon_gris.jpg"; },
    ambiente: (api) => segundo(api) === "irene" ? "bano" : segundo(api) ? "exterior" : "interior",
    musica: "terror",
    lugar: (api) => { const s = segundo(api); return s === "irene" ? "baño de arriba" : s === "alex" ? "porche" : s === "marcos" ? "el camino" : "comedor"; },
    hora: "06:55",
    titulo: "La casa hostil · La segunda",
    alEntrar: (api) => {
      R().tick(api);
      const s = segundo(api);
      if (s) { api.marcar("segundo_muerte", s); api.presenciar(s, 3); api.est(s, "lucidez", -10); if (s !== "nora") R().fuera(api, s, s !== "irene"); }
    },
    texto: (api) => {
      const s = segundo(api);
      const h = H(api);
      const pov = api.bandera("x_pov") === "segundo" && s ? s : "nora";
      const voz = s ? vozQueLlama(api, s) : null;
      if (!s) return `
Dos. Tú y ${N[ultimo(api)]}. En la mesa. Con las manos en la madera.

Y la casa, alrededor, moviéndose. El grifo de arriba. La sartén, que vuelve a humear en el fregadero, bajo el agua, que es donde no puede humear nada. El arrastre debajo de la mesa, un palmo, y otro palmo, como quien se acomoda.

Y los dos quietos. Como se está quieto en un coche cuando pasa algo grande por el arcén.

${modo(api, "nora", {
  lucido: "~ Dos. No hay nadie a quien llamar con una voz. No hay nadie que salga. La casa lo sabe y lo hace igual: se mueve para que sepamos que puede.",
  asustado: "~ Se mueve alrededor como se mueve un animal alrededor de dos personas que no corren.",
  tenso: "~ Quieta. Quieta. Que se mueva ella. Que se canse ella.",
  ido: "~ La casa respira. La oigo. Entra por el grifo y sale por debajo de la mesa.",
  perdido: "~ Nos está dando tiempo. Para lo de las siete. Es educada. Lo de abajo es educado.",
  normal: "~ Cinco minutos. Y luego seis. Y luego las siete. Que lleguen.",
})}`;

      if (s === "irene" && pov === "irene") return `
Subes.

No lo decides. Las piernas. El tercero. El séptimo. La alfombra roja bajo los pies descalzos, fría, y luego no fría: mojada. Hay agua en la alfombra. Un hilo. Desde la puerta del baño hasta la escalera, como un dedo que señala.

El pasillo. La lámpara de llama falsa. La trampilla cerrada. La puerta del baño, con la luz encendida por debajo.

Irene. Ven.

Con la voz de ${N[voz]}. Desde dentro. Desde arriba de dentro.

Abres.

La bañera de patas. Llena. Hasta el borde, y el rebosadero tragando. Y el agua.

No es transparente. No es de ningún color que tenga nombre. Es como el color de una cosa que fue roja hace mucho y se ha quedado con la memoria del rojo. Y huele. A dulce. A hierro. A lo del armario y a lo de la moneda en la boca, las dos cosas.

Y en el espejo, tú. La versión borrada. Y detrás de ti, en el espejo, el techo. Y en el techo, alguien.

Levantas la cabeza.

Una mujer. En el techo. Boca abajo. Con un camisón blanco que cuelga hacia abajo, hacia ti, como cuelga la ropa tendida. Con el pelo colgando. Con la cara donde debería estar la cara y no la miras, no la miras, no puedes no mirarla.

Te mira. Como se mira un fuego.

Y la voz de ${N[voz]}, ahora, sale de ella. De la boca de ella. Con las palabras exactas:

Irene. Ven. Que el agua sale rara.

Y vas.

No lo decides. El cuerpo. Un pie en la bañera, y el agua caliente, y el otro pie, y te sientas, y el agua sube por el top, por el cuello, hasta la barbilla, con su olor. Y la mujer del techo baja. No cae: baja. Despacio. Como baja una cosa que cuelga cuando alguien suelta la cuerda. Con el pelo primero. Con las manos.

Y las manos te cogen la cabeza. Como te la cogió Marcos en la mesa para soplar. Con cuidado.

Y te meten dentro.

El agua. Caliente. Con su color. En los ojos, en la nariz, en la boca. Y no hay aire, como no había en la mesa, una puerta cerrada en la garganta y detrás nada, pero esta vez no es nada: esta vez es el agua, que entra, que llena el sitio del aire, que sabe a dulce y a moneda.

Y por encima del agua, borroso, el techo. Y en el techo, ya no hay nadie. La mujer está aquí. Contigo. Dentro.

~ Álex. Álex, la de verdad. La de hace tres años. Ayúdame tú ahora.

~ Marcos me sopló dentro. Se llevó lo que había. Y lo que había vuelve a por lo que dejó.

Y lo último no es negro. Es el color del agua.

[negro]

...

...

...`;

      if (s === "irene") return `
Irene sube.

No la decide: la ves levantarse como se levanta alguien a quien han llamado por su nombre. El tercero. El séptimo. Y en la alfombra, un hilo de agua que baja desde el baño hasta la escalera, que nadie ha visto hasta ahora.

Nora: ¡Irene!

No se gira. ${R().vivo(api, h) && h !== "irene" ? N[h] + " no se levanta. " + N[h] + " mira la escalera y sonríe un milímetro, y tú no puedes con eso ahora." : ""}

Subes detrás. El tercero. El séptimo. El pasillo. La puerta del baño, cerrada. La luz por debajo. Y el agua, cayendo, y el rebosadero tragando.

Nora: ¡IRENE!

El pomo. Gira. La puerta no abre. Como la de abajo. Como una pared que se acuerda de haber sido puerta.

Y detrás de la puerta, la voz de ${N[voz]}. Diciendo «ven». Diciendo «que el agua sale rara». Con la voz de un muerto. Y luego otra voz, que no es de nadie, que es de una mujer, que dice lo mismo con las mismas palabras.

Y el agua para.

El grifo. El rebosadero. Todo. De golpe. Como se para una frase.

Y la puerta se abre. Sola. Hacia dentro.

El baño. La bañera de patas. Vacía. Seca. Sin una gota, sin vaho, con el esmalte desconchado y el tapón puesto. El espejo, con tu cara. La ventana, con el gris. Nadie.

Irene no está.

~ Ha entrado. La he oído entrar. Y el agua caía. Y la bañera está seca como si no hubiera caído agua en esta casa en cien años.

Bajas. Porque arriba no hay nadie. Bajas, y en el tercer escalón te paras, porque desde abajo, desde el baño que acabas de dejar, oyes otra vez el agua. Cayendo. Como si hubiera empezado ahora.

${modo(api, "nora", {
  lucido: "~ Ha subido. Ha entrado. La puerta no abría. La puerta ha abierto. Y no hay nadie. No hay explicación y no la busco: ya no busco. Solo cuento. Dos.",
  asustado: "~ Se la ha tragado. El baño. Con el agua. Como se traga un desagüe.",
  tenso: "~ Irene. IRENE. Que conteste. Que conteste con cualquier voz.",
  ido: "~ La bañera está seca y mojada. Las dos cosas. Se ve. La sequedad tiene forma de Irene.",
  perdido: "~ Se la ha llevado la mujer. La del techo. Lo dijo Álex: una mujer observando desde las ventanas. Estaba en el techo. Estaba esperándola.",
  normal: "~ Irene. Irene, joder. Irene.",
})}`;

      if (s === "alex" && pov === "alex") return `
La mano. Levantada. Para el tercero.

Y lo das.

[toc]

Toc.

En el cristal. Desde dentro. Tu nudillo. Y el cristal tiembla, y la puerta principal, la que no abría, suena. El cerrojo. Como si alguien lo soltara desde fuera.

Y se abre.

Sola. Hacia fuera. Con el frío. Con el gris.

Nora: ¡ÁLEX, NO!

Y sales. No lo decides: el cuerpo. El porche. La bombilla apagada, con las polillas quietas en el suelo, boca arriba. Los dos escalones. La grava. Y las antorchas.

Ya no están entre los pinos. Están en la grava. En fila. Delante del coche, delante de los troncos, a diez metros, con las formas oscuras detrás y los hierros en la mano. Y en medio de todas, con una antorcha más alta, ${N[voz]}.

Con su cara. Con ${voz === "marcos" ? "la camisa de cuadros y la mano vendada" : "el pelo mojado y la sudadera"}. Sonriendo.

${N[voz]}: Sal. Que no tiene gracia.

Y vas. Los dos escalones. La grava, que cruje. Y en el borde de la luz que ya no hay, la campanilla, que ahora sí la oyes entera:

[campanilla]

Tin.

Y la primera forma da un paso. Y el rastrillo sube.

Lo que pasa después lo cuentas tú, porque nadie más lo ve. El hierro en el hombro, que entra como entra en la tierra. La caída. La grava en la boca. Y ${N[voz]}, agachado, con la antorcha, con su cara, con tu voz:

«Venga. Si estás ahí, sal.»

Y sales.

[negro]

...

...

...`;

      if (s === "alex") return `
Álex da el tercero.

Lo ves. La mano levantada, el nudillo, el cristal. Toc. Y el cerrojo de la puerta principal, que suena solo, y la puerta que se abre hacia fuera con el frío.

Nora: ¡ÁLEX, NO!

Sale. Como se sale cuando te llaman por tu nombre. El porche. Los escalones. ${R().vivo(api, h) && h !== "alex" ? N[h] + " no se levanta. Sonríe un milímetro." : ""}

Vas a la puerta. Con las manos en el marco. Y ves lo que ve la luz que no hay: la grava, gris, y Álex bajando el segundo escalón, y más allá, nada. Ni antorchas. Ni nadie. El gris y los troncos.

Álex se gira. Te mira. Levanta la mano, con la palma abierta.

Y baja a la grava. Y anda. Diez metros. Hacia los troncos. Y se para. Y levanta los brazos, como quien se rinde, o como quien saluda.

Y cae.

Así. Sin que nadie le toque. Como cae alguien a quien le han quitado el suelo. Boca abajo en la grava, con la mano abierta hacia la casa.

Y no se mueve.

~ No había nadie. Lo he visto. He visto la grava vacía y le he visto caer como si le hubieran empujado. Y no había nadie. Nada.

No sales. No puedes. El marco de la puerta te sujeta las manos como si fueran de la puerta.

${modo(api, "nora", {
  lucido: "~ Ha caído. Solo. En diez metros de grava vacía. Es lo más simple que he visto esta noche y no tiene explicación, y es lo que va a haber ahora: cosas simples sin explicación.",
  asustado: "~ Le ha dado. Algo que no veo le ha dado en el hombro. Le he visto doblarse por el hombro.",
  tenso: "~ Álex. ÁLEX. Levántate. Levántate y haz un chiste.",
  ido: "~ Ha caído como cae una polilla. De golpe. Con las alas abiertas.",
  perdido: "~ Se lo han llevado los de las antorchas. Los que no veo. Los que ve él. Y ahora somos dos.",
  normal: "~ Álex. Álex, joder. Álex.",
})}`;

      if (s === "marcos" && pov === "marcos") return `
Las llaves.

Metes la mano en el bolsillo y están. Las del coche. Las que no estaban. Las que estaban en el contacto de un coche boca arriba. Están. Frías.

Y el cerrojo de la puerta principal suena. Solo. Y la puerta se abre hacia fuera con el gris.

Nora: ¡MARCOS!

Y vas. El porche. Los escalones. La grava. Y el coche.

Tu coche. Aquí. A veinte metros, donde siempre. Entero. Con la luz de dentro encendida. Con la puerta del conductor abierta. Como si nunca hubiera bajado por el camino.

Y en el asiento del conductor, con las manos en el volante, tú.

Con la camisa de cuadros. Con la mano vendada. Mirando al frente. Y giras la cabeza, el de dentro, y te miras, y sonríes con tu cara, que no sonríe así.

Marcos: Ven. Que se te ha quedado abierto.

Con tu voz.

Y vas. Porque un coche abierto es un problema con solución, y llevas toda la noche sin ninguno. La grava. La campanilla, que ahora sí la oyes:

[campanilla]

Tin.

Y el de dentro sale. Y te deja el asiento. Y te sientas. Y las llaves en el contacto, y el motor a la primera, y la fiesta en la radio, y el camino.

Y la curva. Y el pino. Y Nora en la carretera con las mangas hasta los nudillos.

Y el pie va solo al freno, otra vez, porque a Nora no se le da, y el volante a la derecha, y el pino.

Y esta vez lo sabes desde antes. Lo sabes desde el porche. Y no sirve para el pie.

[negro]

...

...

...`;

      // Marcos visto por Nora
      return `
Marcos saca las llaves del bolsillo.

Las del coche. Las que no tenía. Las que se quedaron en un contacto boca arriba. Las mira como quien mira una cosa que ha vuelto sola.

Y el cerrojo de la puerta suena. Solo. Y la puerta se abre hacia fuera.

Nora: ¡MARCOS!

Sale. Como se sale cuando te llaman con la voz que va contigo. ${R().vivo(api, h) && h !== "marcos" ? N[h] + " no se levanta. Sonríe un milímetro." : ""}

Vas a la puerta. Con las manos en el marco. La grava gris. Y Marcos andando hacia donde estaba el coche, que no está, que está en la curva con un faro al cielo. Andando hacia veinte metros de grava vacía con las llaves en la mano.

Se para. Donde estaría la puerta del conductor. Abre una puerta que no hay. Se agacha. Se sienta en el aire, a la altura de un asiento.

Y arranca.

Lo oyes. El motor. A la primera, como siempre. Y la fiesta, la carcajada de Irene, los vasos, saliendo de veinte metros de grava vacía.

Y Marcos, sentado en nada, con las manos en un volante que no hay, girando la cabeza hacia ti. Levantando la mano. Con la palma abierta.

Y se va. No hacia el camino: hacia abajo. Como se hunde una cosa en el agua. Despacio. Con las manos en el volante hasta el final.

~ No había coche. He visto la grava. He visto a Marcos sentarse en el aire y arrancar y hundirse. Y he oído el motor. Y he oído la fiesta.

No sales. El marco de la puerta te sujeta las manos como si fueran de la puerta.

${modo(api, "nora", {
  lucido: "~ Un coche que no está. Un motor que se oye. Un hombre que se hunde en la grava. Ya no hay explicación y no la busco. Solo cuento. Dos.",
  asustado: "~ Se lo ha tragado. La grava. Como se traga un camino.",
  tenso: "~ Marcos. MARCOS. Que vuelva. Que vuelva a subir como sube uno que se ha caído al agua.",
  ido: "~ Se ha hundido con las manos en el volante. Como firma. Marcos conduce como firma.",
  perdido: "~ El coche ha venido a por él. Le ha llamado con mi voz y ha venido, y se lo ha llevado abajo, donde van los coches de esta casa.",
  normal: "~ Marcos. Marcos, joder. Marcos.",
})}`;
    },
    opciones: [{ texto: "...", a: "x5_hallazgo2" }],
  },

  x5_hallazgo2: {
    pov: "nora",
    fondo: (api) => { const s = api.bandera("segundo_muerte"); return s === "irene" ? "assets/fondos/bano_sangre.jpg" : s === "alex" ? "assets/fondos/porche.jpg" : s === "marcos" ? "assets/fondos/exterior.webp" : "assets/fondos/salon_gris.jpg"; },
    ambiente: (api) => api.bandera("segundo_muerte") === "irene" ? "bano" : api.bandera("segundo_muerte") ? "exterior" : "interior",
    musica: "terror",
    lugar: (api) => { const s = api.bandera("segundo_muerte"); return s === "irene" ? "baño de arriba" : s ? "porche" : "comedor"; },
    hora: "06:58",
    titulo: "La casa hostil · Lo que queda",
    alEntrar: (api) => {
      R().tick(api);
      const s = api.bandera("segundo_muerte");
      if (s && R().vivo(api, s)) matarSegundo(api, "nora");
      api.horror(5);
      api.marcar("dos", true);
      R().vivos(api).forEach((p) => api.presenciar(p, 2));
    },
    texto: (api) => {
      const s = api.bandera("segundo_muerte");
      const u = ultimo(api);
      const h = H(api);
      if (!s) return `
Dos. Tú y ${N[u]}. En la mesa. Con las manos en la madera. Y la casa, que se ha movido alrededor un rato y ahora se ha parado, como quien espera su turno.

Las siete menos dos.

~ La voz de la buhardilla contaba hasta tres. Uno, dos, tres. Y paraba. Van dos. Y el tres no soy yo, porque a mí me han dicho «todavía no». El tres es ${N[u]}. Y yo soy lo que viene después del tres.

${modo(api, "nora", {
  lucido: `~ Dos. Yo y ${N[u]}. Y ${N[u]} lleva dentro lo que ha matado a los otros, o lo que los ha llamado. Y es la única persona que me queda en el mundo.`,
  asustado: "~ Dos. Y el frío. Y las siete que no llegan.",
  tenso: "~ Siete menos dos. Dos minutos. Y luego la luz. Y luego la puerta.",
  ido: "~ Las sillas vacías no están vacías. Se ve el peso. Se ve la cerveza que baja sola un dedo.",
  perdido: "~ Se ha quedado con dos. Es lo que hace. Reparte hasta que no hay que repartir.",
  normal: "~ Dos. Dos minutos. Se puede.",
})}`;
      const desdeDentro = api.bandera("x_pov") === "segundo" && s ? `
[luz]

La luz vuelve a ser la tuya. La de tus ojos, en ${s === "irene" ? "el pasillo de arriba, con las manos en el marco del baño" : "el marco de la puerta principal, con las manos en la madera"}.

` : "";
      const cuerpo = s === "irene" ? `
El baño. La bañera de patas. Y en la bañera, Irene.

Sin agua. Ni una gota. El esmalte seco, el tapón puesto, y ella dentro, sentada, con la espalda contra la porcelana y la cabeza caída hacia un lado. Con el pelo mojado. Solo el pelo. Con la sudadera empapada y pesada, y el resto de la bañera seco como un hueso.

Con la boca abierta. Con los ojos abiertos. Mirando el techo.

Y en el cuello, cuatro marcas. Rojas. Como cuatro dedos. Como las suyas en el brazo. Como las de todos.

Y en la mano derecha, cerrada, algo. Le abres los dedos. Fríos. Ya.

Un botón. El del top. El que aguantaba. El tercero, que hace tiempo que no estaba.

~ Se ha ahogado en una bañera seca. Se ha ahogado con el agua que no hay. Y la casa ha secado la bañera después, como se seca una mesa.` : s === "alex" ? `
El porche. Los escalones. Y en la grava, a diez metros, Álex.

Boca abajo. Con la mano abierta hacia la casa. Con la camisa estampada abierta y los collares enredados debajo del cuerpo. Y en la espalda, en el hombro, un agujero. Redondo. Del tamaño de un dedo. Como el que deja un diente de rastrillo. Y alrededor, nada: ni sangre en la grava, ni pisadas, ni hierro.

Le das la vuelta. Pesa lo que pesa. Los ojos abiertos. La boca abierta con grava dentro. Y en el cuello, cuatro marcas. Rojas. Como cuatro dedos.

~ Diez metros de grava. Sin nadie. Y un agujero de rastrillo en el hombro. Yo vi la grava vacía. Él vio otra cosa. Y le mató lo que vio él.` : `
La grava. Vacía. Veinte metros hasta donde estaba el coche, que no está, que está en la curva.

Y en la grava, donde se sentó en el aire, Marcos.

Boca arriba. Con las manos cerradas delante del pecho, en la posición de un volante. Con la camisa de cuadros. Con el paño en la mano. Con los ojos abiertos. Y la cabeza hacia un lado, donde no va una cabeza, como en el coche, como si el pino le hubiera alcanzado aquí.

Y en el cuello, cuatro marcas. Rojas. Como cuatro dedos.

~ Se ha matado contra un pino que está a cien metros. Sentado en la grava. Con las manos en un volante que no hay. Y le mató lo que vio él.`;
      return `${desdeDentro}${cuerpo}

Dos.

Tú. Y ${N[u]}. ${R().vivo(api, h) && h === u ? (api.bandera("suplica_resultado") === "encerrado" ? "En el almacén, con el cerrojo, que has abierto tú hace un minuto porque ya no tiene sentido cerrar nada." : api.bandera("suplica_resultado") === "atado" ? "En la silla, atad" + (fem(u) ? "a" : "o") + ", que has soltado tú hace un minuto porque ya no tiene sentido atar nada." : "") : ""}

Las siete menos dos.

~ La voz de la buhardilla contaba hasta tres. Uno, dos, tres. Y paraba. Van dos. Y el tres no soy yo, porque a mí me han dicho «todavía no». El tres es ${N[u]}. Y yo soy lo que viene después del tres.

${modo(api, "nora", {
  lucido: `~ Dos. Yo y ${N[u]}. Y ${N[u]} lleva dentro lo que ha matado a los otros, o lo que los ha llamado, o lo que ha sonreído mientras. Y es la única persona que me queda en el mundo.`,
  asustado: "~ Dos. Y el frío. Y las siete que no llegan. Y el gris de la ventana que no cambia.",
  tenso: "~ Siete menos dos. Dos minutos. Y luego la luz. Y luego la puerta. Y luego el camino con dos cuerpos en él y andar.",
  ido: `~ ${N[s]} mira el techo. Como todos. En el techo tiene que haber algo. Lo voy a mirar yo también. No. No lo miro.`,
  perdido: "~ Se ha llevado a dos para quedarse con dos. Es lo que hace. Reparte hasta que no hay que repartir.",
  normal: `~ ${N[s]}. ${N[s]}, joder. ${N[s]}.`,
})}`;
    },
    opciones: [
      { texto: (api) => "Tapar" + (fem(api.bandera("segundo_muerte") || "irene") ? "la" : "le") + ". Con lo que haya. Y bajar. Volver. Con " + N[ultimo(api)] + ".", a: "x6_intimo", si: (api) => Boolean(api.bandera("segundo_muerte")),
        efecto: (api) => { api.marcar("x5_nora", "tapa"); api.est("nora", "estres", -2); } },
      { texto: "Fotografiar las marcas. Las cuatro. Como las otras.", a: "x6_intimo", lucida: true, si: (api) => Boolean(api.bandera("segundo_muerte")),
        efecto: (api) => { api.marcar("x5_nora", "foto"); api.evidencia("foto_marcas_2", "nora", api.bandera("segundo_muerte") === "irene" ? "baño de arriba" : "porche", "foto"); api.est("nora", "lucidez", 1); } },
      { texto: (api) => "Coger el botón. El de Irene. Guardarlo en el cuaderno.", a: "x6_intimo", si: (api) => api.bandera("segundo_muerte") === "irene",
        efecto: (api) => { api.marcar("x5_nora", "boton"); api.evidencia("boton_irene", "nora", "cuaderno de Nora", "objeto"); } },
      { texto: "No mirar más. Bajar. Cerrar la puerta de ese cuarto. Con llave si la hay.", a: "x6_intimo", si: (api) => Boolean(api.bandera("segundo_muerte")),
        efecto: (api) => { api.marcar("x5_nora", "cierra"); api.est("nora", "miedo", 3); api.est("nora", "eje", -2); } },
      { texto: (api) => "Quedarte en la mesa. Con " + N[ultimo(api)] + ". Que lleguen las siete.", a: "x6_intimo", si: (api) => !api.bandera("segundo_muerte"),
        efecto: (api) => { api.marcar("x5_nora", "mesa"); api.est("nora", "estres", 2); } },
    ],
  },

  x6_intimo: {
    pov: "nora",
    fondo: "assets/fondos/salon_gris.jpg",
    ambiente: "interior",
    musica: "terror_suave",
    lugar: "comedor", hora: "07:00",
    titulo: "Los dos · Las siete",
    alEntrar: (api) => {
      R().tick(api);
      api.marcar("las_siete", true);
      const u = ultimo(api);
      // Cómo llegan los dos al final: lo que hay entre ellos, con la noche entera encima
      const rel = { conf: api.relv("nora", u, "confianza"), afecto: api.relv("nora", u, "afecto"), res: api.relv("nora", u, "resentimiento"), ten: api.relv("nora", u, "tension") };
      const tono = u === "marcos" ? (rel.conf >= 45 && rel.res < 30 ? "pareja" : "frio") : u === "irene" ? (rel.conf >= 40 ? "alianza" : "espina") : (rel.afecto >= 40 ? "cercania" : "distancia");
      api.marcar("intimo_tono", tono);
      api.est("nora", "estres", 3);
    },
    texto: (api) => {
      const u = ultimo(api);
      const h = H(api);
      const tono = api.bandera("intimo_tono");
      const x5 = api.bandera("x5_nora");
      const inicio = x5 === "tapa" ? `${fem(api.bandera("segundo_muerte") || "irene") ? "La" : "Le"} has tapado. Con una toalla, con una manta, con lo que había. Y has bajado. Y has cerrado.` : x5 === "foto" ? "Has fotografiado las marcas. Cuatro. Como las otras cuatro. Como las cuatro de tu tobillo, o de tu muñeca, o de tu cuello, que no tienes, todavía." : x5 === "boton" ? "El botón de Irene, en el cuaderno, entre la página de ALDA y la de las huellas. Un botón. Es lo más pequeño que has guardado esta noche y es lo que más pesa." : "Has cerrado la puerta de ese cuarto. Con la llave que había. Y has bajado. Y no vas a volver a subir.";
      const dos = u === "marcos" ? (tono === "pareja" ? `
Marcos te espera al pie de la escalera. Con la mano vendada. ${h === "marcos" ? "Con frío." : ""} Y te abraza. Así, sin más, como se abraza a alguien que ha vuelto de un sitio. Con la cara en tu pelo.

Marcos: Estás.

Nora: Estoy.

Marcos: Vale. Vale.

Y es Marcos. La voz, las manos, la manera de decir «vale» dos veces. ${h === "marcos" ? "Y el frío. Las manos frías en tu espalda, que no se calientan con tu espalda. Y no dices nada. No hay nada que decir que no sea peor." : "Entero. Con todo lo que ha pasado encima, y entero."}

Os sentáis. En la misma silla, casi. Con la rodilla contra la rodilla, como a la una menos veinte. Y os cogéis la mano por encima de la mesa, no por debajo, porque ya no hay nadie a quien esconderla.` : `
Marcos al pie de la escalera. Con la mano vendada. ${h === "marcos" ? "Con frío." : ""} Y no te abraza. Se queda a un metro. Con las manos a la vista.

Marcos: ¿Estás bien?

Nora: No.

Marcos: Ya.

Y es lo único que dice. Marcos, que lo explica todo, tiene una palabra. Y hay un metro entre los dos que no ha habido en cinco meses, y los dos sabéis de qué está hecho ese metro: de un beso en una mesa, o de un «nada» delante de una ventana, o de una mano en tu tobillo.

Os sentáis. En sillas distintas. Con la mesa entre los dos, como se sienta la gente que va a negociar.`) : u === "irene" ? (tono === "alianza" ? `
Irene al pie de la escalera. Descalza. ${h === "irene" ? "Con la mano en el cuello y frío." : "Con las rodillas temblando."} Y te coge las dos manos. Irene. A ti.

Irene: Quedamos las dos.

Nora: Las dos.

Irene: Pues las dos.

Y os sentáis juntas. En la misma silla, casi. Y te mira como no te ha mirado nunca: sin calcular. ${h === "irene" ? "Y tiene las manos frías, y las tuyas no las calientan, y no dices nada." : "Y es la primera vez en toda la noche que Irene te parece de tu lado, y es la última."}` : `
Irene al pie de la escalera. Descalza. ${h === "irene" ? "Con la mano en el cuello y frío." : "Con las rodillas temblando."} Y no te toca. Se queda a un metro. Con esa cara: la de calcular.

Irene: Quedamos las dos.

Nora: Las dos.

Irene: Qué gracia.

Y no tiene gracia, y lo dice como se dice la hora. Os sentáis. En sillas distintas. Con la mesa entre las dos y la camisa de Marcos, si la llevas, entre las dos también.`) : (tono === "cercania" ? `
Álex al pie de la escalera. Con el pie hinchado. ${h === "alex" ? "Con frío." : ""} Y te abraza. Álex. A ti. Sin la mano donde la pone siempre: con las dos manos en la espalda, como se abraza a alguien que has visto volver de un sitio.

Álex: Estás.

Nora: Estoy.

Álex: Tú no eres una lámpara.

Y se ríe. Corto. Y tú también. Porque hace falta. Os sentáis juntos.` : `
Álex al pie de la escalera. Con el pie hinchado. ${h === "alex" ? "Con frío." : ""} Y no te abraza. Se queda a un metro. Sin sonrisa. Sin cámara. Con las manos vacías.

Álex: Quedamos tú y yo.

Nora: Sí.

Álex: Qué mal reparto.

Y no es un chiste. Os sentáis. En sillas distintas.`);
      return `
${inicio}

${dos}

Las siete.

Lo dice el reloj de la cocina. ${api.bandera("reloj_parado") ? "Que estaba parado en las seis y cuarenta y cinco y ahora dice las siete, sin haber pasado por en medio." : "Lo dices tú. Las siete."}

Y no amanece.

Miras la ventana. El gris. El mismo gris de hace una hora. Un gris de nada, que no es noche y no es día, que no tiene sombras. Las siete y un minuto. Las siete y dos. Y el gris.

Nora: No amanece.

${N[u]}: Es que está nublado.

Nora: No amanece, ${N[u]}.

${N[u]}: Ya.

~ Las siete. Era el plan. Con luz, el coche o andando. Y las siete han llegado y la luz no. La casa ha traído las siete sin traer la luz, como se trae un plato sin comida.

${modo(api, "nora", {
  lucido: "~ No hay amanecer. No hay hora. No hay puerta. Lo que queda es esta mesa y esta persona, y lo que la casa quiera hacer con las dos cosas. Es lo más claro que he pensado en toda la noche.",
  asustado: "~ El gris no cambia. No va a cambiar. Estamos en el sitio donde no cambia.",
  tenso: "~ Las siete. Las siete. Y qué. Y qué. Con gris también se anda.",
  ido: "~ El gris tiene textura. Como la ceniza. Como lo que queda después de un fuego, por fuera de las ventanas, tapándolas.",
  perdido: "~ Ha parado el amanecer. Para que lo de las siete pase a las siete. Es puntual. Lo de abajo es puntual.",
  normal: "~ Dos. Las siete. Gris. Vale. Vale. Pues dos, las siete y gris.",
})}`;
    },
    opciones: [
      { texto: (api) => "Cogerle la mano. La que tenga. Y no soltarla.", a: "x7_dentro",
        efecto: (api) => { const u = ultimo(api); api.marcar("x6_nora", "mano"); R().contacto(api, "nora", u, 2); } },
      { texto: (api) => "«¿Qué te pasa? Dímelo. Lo que sea. Ya da igual.» A " + N[ultimo(api)] + ".", a: "x7_dentro",
        efecto: (api) => { const u = ultimo(api); api.marcar("x6_nora", "pregunta"); api.rel("nora", u, "confianza", 3); api.est(u, "estres", 4); api.saber("nora", u + "_raro"); } },
      { texto: "Abrir el cuaderno. Leerle lo que has escrito. Todo. Desde ALDA.", a: "x7_dentro", lucida: true,
        efecto: (api) => { const u = ultimo(api); api.marcar("x6_nora", "lee"); api.saber(u, "cuaderno_nora"); api.est("nora", "lucidez", 2); api.est("nora", "estres", -3); } },
      { texto: (api) => "Besar" + (fem(ultimo(api)) ? "la" : "le") + ". Porque sí. Porque quedáis dos.", a: "x7_dentro",
        efecto: (api) => { const u = ultimo(api); api.marcar("x6_nora", "beso"); R().contacto(api, "nora", u, 3); api.rel(u, "nora", "afecto", 6); api.marcar("beso_final", u); } },
    ],
  },

  x7_dentro: {
    pov: (api) => ultimo(api),
    titulo: "Los dos · Desde dentro",
    hora: "07:04",
    alEntrar: (api) => {
      R().tick(api);
      const u = ultimo(api);
      if (H(api) === u) { R().lapso(api); api.est(u, "lucidez", -4); }
    },
    texto: (api) => {
      const u = ultimo(api);
      const h = H(api);
      const x6 = api.bandera("x6_nora");
      const inicio = x6 === "mano" ? "Nora te ha cogido la mano. La que tienes. Y no la suelta. Tiene la mano caliente. La tuya no, y lo notas, y ella lo nota." : x6 === "pregunta" ? "Nora: ¿Qué te pasa? Dímelo. Lo que sea. Ya da igual.\n\nY no le has contestado. Tienes la respuesta en la boca y es otra cosa la que sale: «Nada.» Y Nora se lo apunta." : x6 === "lee" ? "Nora te ha leído el cuaderno. Todo. Desde ALDA. Con la voz de leer. Y en cada página había una cosa tuya que no sabías que ella había visto. Marcos raro. Irene rara. La mano. La sonrisa." : "Nora te ha besado. Así, sin más. Con la boca fría y caliente. Y algo se ha movido dentro de ti al besarla, como se mueve el agua de un vaso cuando alguien pasa cerca.";
      if (h !== u) return `
${inicio}

Las siete y cuatro. El gris.

Y tú, con Nora. Los dos. Sin nada dentro que no sea tuyo, o eso crees, porque el frío que tenía ${N[api.bandera("huesped_anterior") || "el otro"]} ya no lo tiene nadie, o lo tiene alguien que no lo sabe.

${modo(api, u, {
  lucido: "~ Dos. Y una casa. Y el gris. No hay nada que arreglar. Nunca ha habido nada que arreglar. Es lo último que voy a aprender.",
  asustado: "~ El frío. Se ha ido con el que lo tenía. O no. O está aquí, en la mesa, esperando a ver en quién cabe.",
  tenso: "~ Andar. Con gris. Con lo que sea. Salir por la ventana que se rompa.",
  ido: "~ Nora tiene la cara de la mesa. La de las doce y cuarenta. Como si la noche no le hubiera pasado. Como si la noche fuera mía.",
  perdido: "~ Lo tengo. Lo tengo yo desde que murió. Lo noto debajo del esternón y no se lo digo porque decirlo es que empiece.",
  normal: "~ Dos. Vale. Con Nora. Es el mejor reparto posible dentro del peor.",
})}`;

      return `
${inicio}

Las siete y cuatro. El gris.

Y dentro.

~ ${R().intrusion(api, u, 3)}

Con tu voz. Sin que lo pienses. Y ya no es extrañeza: es costumbre. Llega, se queda, se va. Como llega el hambre.

Y miras a Nora. Y la ves como se ve a alguien desde muy lejos, desde el fondo de una piscina: la cara, el cuaderno, la mano ${x6 === "mano" ? "en la tuya" : "en la mesa"}. Y ves lo que verías si fueras tú: ${u === "marcos" ? "a la mujer que te puso la rodilla debajo de una mesa hace siete horas" : u === "irene" ? "a la nueva, con la camisa, con el cuaderno, con la cara de apuntarlo todo" : "a la que no era una lámpara"}. Y ves lo otro. Lo que ve lo que llevas dentro.

Ve una puerta. Con candado. Detrás de una estantería. Abajo.

~ Abajo. Con ella.

Lo has pensado. No. Lo has oído. Con tu voz. Y las manos, debajo de la mesa, se han cerrado.

Nora: ¿${N[u]}?

${N[u]}: Nada.

Nora: Has dicho algo.

${N[u]}: No.

Y no lo has dicho. Lo has dicho por dentro. Y Nora lo ha oído, o ha oído la cara, que es lo mismo con Nora.

${modo(api, u, {
  lucido: "~ Ya no me esconde nada. Ya no hace falta. Somos dos y ya sé lo que quiere: que la lleve abajo. Y sé que voy a intentar no hacerlo. Y sé lo que valen mis intentos esta noche.",
  asustado: "~ Abajo. Con ella. Y las manos cerradas. Y Nora mirándome la cara como se mira un reloj.",
  tenso: "~ Fuera. Salir de la mesa. Sentarme lejos. Atarme yo. Que me ate ella.",
  ido: "~ Nora está lejos. En el fondo de un agua. Y yo aquí arriba, con las manos, mirando cómo se hunde despacio.",
  perdido: "~ Abajo. Con todos. Ya están todos abajo menos ella. Y ella es la que más quiere. Lo dijo Álex: la que más quieres.",
  normal: "~ Nada. No he dicho nada. Nora, no me mires así. No me mires como si ya lo supieras.",
})}`;
    },
    opciones: [
      { texto: "Sentarte lejos. Al otro lado de la mesa. Con las manos a la vista.", a: "x8_cierre", si: (api) => H(api) === ultimo(api),
        efecto: (api) => { const u = ultimo(api); api.marcar("x7_ultimo", "lejos"); api.est(u, "estres", 4); api.rel("nora", u, "confianza", 4); } },
      { texto: "«Átame. Con lo que haya. Por favor.»", a: "x8_cierre", si: (api) => H(api) === ultimo(api),
        efecto: (api) => { const u = ultimo(api); api.marcar("x7_ultimo", "atame"); api.marcar("huesped_atado", true); api.rel("nora", u, "afecto", 6); api.est(u, "miedo", 6); } },
      { texto: "No decir nada. Cogerle la mano más fuerte. Que no note el frío.", a: "x8_cierre", si: (api) => H(api) === ultimo(api),
        efecto: (api) => { const u = ultimo(api); api.marcar("x7_ultimo", "calla"); R().contacto(api, u, "nora", 1); R().alimentar(api, 1); } },
      { texto: "«Nora. Abajo hay una puerta.» Decirlo. Como si fuera tuyo.", a: "x8_cierre", si: (api) => H(api) === ultimo(api), impulsiva: true,
        efecto: (api) => { const u = ultimo(api); api.marcar("x7_ultimo", "puerta"); R().alimentar(api, 2); api.saber("nora", u + "_dice_abajo"); api.est("nora", "miedo", 6); } },
      { texto: "Quedarte con ella. Con la mano. Con el gris. Con lo que venga.", a: "x8_cierre", si: (api) => H(api) !== ultimo(api),
        efecto: (api) => { const u = ultimo(api); api.marcar("x7_ultimo", "queda"); R().contacto(api, u, "nora", 1); } },
      { texto: "Levantarte. Buscar por la casa algo con lo que abrir la puerta. Lo que sea.", a: "x8_cierre", si: (api) => H(api) !== ultimo(api),
        efecto: (api) => { const u = ultimo(api); api.marcar("x7_ultimo", "busca"); api.est(u, "eje", 3); api.est(u, "estres", 4); } },
    ],
  },

  x8_cierre: {
    pov: "nora",
    titulo: "Los dos · Lo que queda",
    hora: "07:08",
    alEntrar: (api) => {
      R().tick(api);
      api.marcar("fase10_completa", true);
      const u = ultimo(api);
      R().necesidad(api, "nora", null); R().necesidad(api, u, null);
      api.est("nora", "estres", 3);
    },
    texto: (api) => {
      const u = ultimo(api);
      const h = H(api);
      const x7 = api.bandera("x7_ultimo");
      const muertos = R().muertos(api);
      const est = x7 === "lejos" ? `${N[u]} se ha sentado al otro lado de la mesa. Lejos. Con las manos encima de la madera. Sin que se lo pidieras.` : x7 === "atame" ? `${N[u]}: Átame. Con lo que haya. Por favor.\n\nY le has atado. Con el cinturón. Las manos a la espalda. Y ${fem(u) ? "ella" : "él"} ha dicho «gracias», y era su voz, y luego ha dicho algo más, bajo, que no has entendido, y no era.` : x7 === "calla" ? `${N[u]} te ha apretado la mano. Más fuerte. Con la mano fría, que no se calienta. Y no ha dicho nada. Y tú tampoco.` : x7 === "puerta" ? `${N[u]}: Nora. Abajo hay una puerta.\n\nLo ha dicho como se dice una cosa propia. Con su voz. Mirándote. Y tú sabes lo que hay abajo porque Marcos lo contó, y sabes quién quiere que bajes, y no es ${N[u]}.` : x7 === "busca" ? `${N[u]} ha recorrido la casa. La cocina, el almacén, el baño de abajo. Buscando algo con lo que abrir la puerta. Ha vuelto con la llave inglesa, o con un martillo, o con nada. Y la puerta sigue siendo una pared.` : `${N[u]} se ha quedado. Con la mano. Con el gris.`;
      return `
${est}

Las siete y ocho. El gris.

Dos. ${muertos.map((p) => N[p]).join(", ")} en sus sitios. ${api.bandera("nora_toma_muneca") ? "La muñeca en la mesa, con los ojos cosidos hacia arriba." : ""} La tabla en su caja. El cuaderno abierto.

Escribes:

07:08. No amanece. La puerta no abre. ${N[api.bandera("segundo_muerte") || muertos[1] || "Irene"]}. Quedamos dos. ${h === u ? N[u] + " tiene frío." : "El frío no está en nadie. O está en alguien que no lo sabe."}

Y debajo, sin pensarlo, con la letra que no es tu letra de apuntar:

Empieza fuera.

Lo miras. Lo has escrito tú. No sabes qué quiere decir. Sí lo sabes: que empezó fuera. Que empezó en un porche, con un pie en la grava. Que todo lo que pasa aquí dentro empezó cuando alguien salió.

~ Empieza fuera. Los tres salieron. Álex, Marcos, Irene. Cada uno de una manera. Y yo no he salido. Yo llevo toda la noche dentro, con el cuaderno. Y por eso sigo, y por eso me guarda.

${modo(api, "nora", {
  lucido: `~ Dos. ${N[u]} y yo. Y ${h === u ? "lo que " + N[u] + " lleva dentro, que quiere bajar" : "el frío, que está en alguna parte"}. Y una puerta abajo con candado que Marcos vio a las tres y media. Y yo con un cuaderno. Es todo lo que hay, y es más de lo que tenía a las doce y cuarenta, porque a las doce y cuarenta no sabía nada.`,
  asustado: "~ Empieza fuera. Y termina abajo. Lo sé como se sabe una hora. Y no me lo ha dicho nadie.",
  tenso: "~ Las siete y ocho. Sin luz. Sin puerta. Pues sin luz y sin puerta. Andando por dentro, entonces.",
  ido: "~ La letra de «empieza fuera» no es mía. Es más redonda. Como la de alguien que aprende a escribir. Como la de una niña.",
  perdido: "~ Me guarda. Me ha guardado desde la mesa. Y ahora que quedamos dos, me está enseñando el camino con la letra de otra.",
  normal: "~ Dos. Un cuaderno. Una puerta abajo. Vale. Vale. Se apunta y se sigue.",
})}

...

${N[u]}: Nora.

Con su voz. Mirando la puerta.

${N[u]}: Vamos a probar otra vez.`;
    },
    opciones: [{ texto: "Continuar", a: "xi1_puerta" }],
  },

  });
})();
