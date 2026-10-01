/*
 * LA BRUJA — PRÓLOGO
 * Fase IX: El huésped a nivel tres y la súplica (HORROR_STAGE 4) · Biblia §5 (IX), §18, §19, §22, §23
 *
 * Nivel 3: el huésped pierde el control y ataca para matar. Mata solo si el jugador lo permite: a solas
 * con él y sin defenderse. La segunda dispersión sale de las necesidades: alguien deja la mesa (lavarse
 * una herida, agua, frío) y el huésped va detrás. El jugador elige vivirlo desde la víctima (huir, herir
 * en defensa, herir queriendo matar, no defenderse) o desde el huésped (el impulso, que se puede rechazar).
 * Nora nunca muere aquí: el huésped la suelta con su firma, «Todavía no». Después, la súplica: vuelve a
 * ser él, o lo parece, y pide que le crean. Sin medidor. Las únicas señales fiables son la firma y el
 * frío. Luego la necesidad saca a alguien de la luz (segundo cruce, si no lo hubo) y la casa aprieta.
 *
 * Se consume de la VIII: muerto_*, desaparecido, segundo_marcado, huesped, huesped_comida, heridas,
 * mano_*, nec_*, voz_devuelta. Se deja para la X: ataque_victima, ataque_resultado, huesped_retirado,
 * suplica_resultado, muerte por el huésped o del huésped (mato_<pj>), el nuevo portador si lo hay,
 * segundo cruce, banera_llena, sarten_humo.
 *
 * Presupuesto de anomalías Fase IX: 5 → sarten_humo · grifo_arriba · arrastre_mesa · voz_intercambio · puerta_no_abre
 */
(() => {
  const R = () => HISTORIA.R;
  const modo = (api, id, m) => m[api.modo(id)] || m.normal;
  const H = (api) => api.bandera("huesped");
  const N = { nora: "Nora", marcos: "Marcos", alex: "Álex", irene: "Irene" };
  const fem = (id) => id === "nora" || id === "irene";
  const O = (api) => R().vivos(api).find((p) => p !== "nora" && p !== "irene") || null;   // el hombre que queda
  const objeto = (api, id) => R().mano(api, id);
  // A quién ataca el huésped: quien deja la mesa por su necesidad. Irene si la lleva Marcos; el hombre que queda si la lleva Irene; Nora si no hay otro.
  const victimaPorDefecto = (api) => {
    const h = H(api);
    if (h === "marcos") return R().vivo(api, "irene") ? "irene" : "nora";
    const o = O(api);
    return o || "nora";
  };
  const V = (api) => api.bandera("ataque_victima") || victimaPorDefecto(api);
  const lugarAtaque = (api) => V(api) === "nora" ? "cocina" : "bano";
  // Destinatario de la súplica: la víctima si vive; si no, el hombre que queda; si no, Nora
  const destinatario = (api) => { const v = V(api); if (R().vivo(api, v) && v !== H(api)) return v; const o = O(api); if (o && o !== H(api)) return o; return "nora"; };

  Object.assign(HISTORIA.presupuestoAnomalias, { IX: 5 });
  Object.assign(HISTORIA.deriva, { IX: { estres: 0.7, miedo: 0.5 } });

  const saltoPrevio = HISTORIA.prepararSalto;
  HISTORIA.prepararSalto = (api, id) => {
    if (typeof saltoPrevio === "function") saltoPrevio(api, id);
    if (!/^ix\d/.test(id)) return;
    R().saltoBase(api);
    if (!api.bandera("fase8_completa")) {
      const h = H(api);
      const d = h === "marcos" ? "alex" : "marcos";
      ["fase6_completa", "fase7_completa", "fase8_completa", "evento_imposible", "luz_vuelta", "apagon"].forEach((f) => api.marcar(f, true));
      api.marcar("generador_quien", d); api.marcar("primer_cruce", d); api.marcar("desaparecido", d);
      api.marcar("fase_actual", "VIII"); R().cruzar(api, d); R().matar(api, d, d === "alex" ? "bosque" : "coche", d === "alex" ? "el terraplén bajo los pinos" : "el camino, contra el pino grande", "nora");
      api.marcar("cuerpo_" + d, d === "alex" ? "terraplen" : "coche"); api.marcar("video_mesa_visto", true);
    }
    R().fase(api, "IX", 4, 3);
    if (/^ix[3-8]/.test(id) && !api.bandera("ataque_victima")) { api.marcar("ataque_victima", victimaPorDefecto(api)); api.marcar("ataque_pov", "victima"); }
    if (/^ix[4-8]/.test(id) && !api.bandera("ataque_resultado")) api.marcar("ataque_resultado", "hiere");
    if (/^ix[5-8]/.test(id) && api.bandera("huesped_retirado") === undefined) api.marcar("huesped_retirado", api.bandera("ataque_resultado") === "hiere");
    if (/^ix[6-8]/.test(id) && !api.bandera("suplica_resultado")) api.marcar("suplica_resultado", "no_cree");
  };

  // ---------- El ataque, resuelto: lo que pasa cuando no lo llevamos desde la víctima ----------
  function resolverAtaque(api, resultado) {
    const h = H(api), v = V(api), lugar = lugarAtaque(api);
    api.marcar("ataque_resultado", resultado);
    api.marcar("huesped_ataco", resultado !== "rechazo");
    if (resultado === "rechazo") { api.marcar("huesped_retirado", true); R().lapso(api); api.est(h, "estres", 8); return; }
    R().aSolas(api, v);
    api.est(v, "miedo", 15); api.est(v, "estres", 12);
    if (resultado === "todavia") { api.marcar("huesped_retirado", false); R().herir(api, v, "mano", "huesped"); api.saber(v, h + "_me_ataco"); api.rel(v, h, "confianza", -30); return; }
    if (resultado === "huye") { api.marcar("huesped_retirado", false); R().alimentar(api, 1); api.saber(v, h + "_me_ataco"); api.rel(v, h, "confianza", -30); api.est(v, "lucidez", -3); return; }
    if (resultado === "hiere") {
      api.marcar("huesped_retirado", true);
      R().herir(api, h, "sangra", "defensa"); api.evidencia("herida_defensa_" + h, h, lugar === "bano" ? "baño de arriba" : "cocina", "marca");
      api.saber(v, h + "_me_ataco"); api.saber(h, "me_defendio_" + v);
      api.rel(v, h, "confianza", -25); api.rel(h, v, "resentimiento", 10); api.rel(v, h, "afecto", -10);
      return;
    }
    if (resultado === "mata") {
      // Matar al amigo. El aliento va a quien lo mató; a Nora solo si no queda otro.
      const receptor = v === "nora" ? (O(api) && O(api) !== h ? O(api) : "nora") : v;
      api.marcar("mato_" + v, h);
      api.saber(v, "mate_a_" + h);
      R().matar(api, h, "amigo", lugar === "bano" ? "el baño de arriba" : "la cocina", receptor);
      api.marcar("huesped_retirado", false);
      R().vivos(api).forEach((p) => { api.rel(p, v, "confianza", -20); api.rel(p, v, "miedo", 0); });
      api.est(v, "lucidez", -10); api.est(v, "estres", 20);
      return;
    }
    if (resultado === "muere") {
      // No se defendió. Nora nunca: a Nora la suelta.
      if (v === "nora") { resolverAtaque(api, "todavia"); return; }
      R().matar(api, v, "huesped", lugar === "bano" ? "la bañera del baño de arriba" : "la cocina", h);
      api.marcar("huesped_retirado", false); R().alimentar(api, 2);
      api.saber(h, "mate_a_" + v);
      return;
    }
  }
  // Lo que haría la víctima sola: se defiende si tiene la cabeza y algo en la mano; si no, huye; si está perdida, no se defiende
  function decidirVictima(api) {
    const v = V(api);
    if (v === "nora") return api.lucido("nora") || objeto(api, "nora") ? "hiere" : "todavia";
    if (api.modo(v) === "perdido") return "muere";
    if (objeto(api, v) || api.lucido(v) || api.valor(v, "eje") >= 60) return "hiere";
    return "huye";
  }

  Object.assign(HISTORIA.escenas, {

  // =====================================================================
  // FASE IX — EL HUÉSPED A NIVEL TRES
  // =====================================================================

  ix1_nivel3: {
    pov: "nora",
    fondo: "assets/fondos/salon_gris.jpg",
    ambiente: "interior",
    musica: "terror_suave",
    lugar: "comedor", hora: "06:02",
    titulo: "Nivel tres · Las necesidades",
    alEntrar: (api) => {
      R().fase(api, "IX", 4, 3);
      R().tick(api);
      api.marcar("fase9_empezada", true);
      const h = H(api);
      api.est(h, "lucidez", -6);
      R().vivos(api).forEach((p) => api.est(p, "estres", 4));
    },
    texto: (api) => {
      const h = H(api);
      const o = O(api);
      const v = victimaPorDefecto(api);
      const d = api.bandera("desaparecido");
      const seg = api.bandera("segundo_marcado");
      const necO = o ? R().necesidad(api, o) : null;
      const salidaV = v === "irene" ? (R().herido(api, "irene", "cojera") ? "Irene se levanta. Con el pie como esté. Dice que va a lavarse la cara. Al de arriba, porque el de abajo huele a lo que huele. Sube la escalera cojeando, agarrada a la barandilla, sin mirar atrás." : "Irene se levanta. Dice que va a lavarse la cara. Al de arriba, porque el de abajo huele a lo que huele. Sube la escalera descalza, sin mirar atrás.") : v === "nora" ? "Tienes sed. Una sed de horas. " + (R().herido(api, "nora", "mano") ? "Y la mano, la de la trampilla, que late. " : "") + "El grifo de la cocina está a cuatro pasos." : (o === "alex" ? "Álex se levanta. Dice que necesita mear y fumar y no en ese orden. Irene le dice que ni se le ocurra. Álex dice que arriba, al baño de arriba, con la ventana, que es fumar sin salir. Y sube. " + (R().herido(api, "alex", "cojera") ? "Con el pie a rastras, un escalón y una pausa." : "De dos en dos, como si todavía fuera Álex.") : "Marcos se levanta. Dice que va a mear. Al de arriba, que el de abajo huele a lo que huele. Sube la escalera " + (R().herido(api, "marcos", "cojera") ? "cojeando, agarrado a la barandilla" : R().lleva(api, "marcos", "atizador") ? "sin el atizador, que deja en la silla" : "despacio, como quien cuenta los escalones") + ", sin mirar atrás.");
      return `
Las seis y dos minutos. Cincuenta y ocho para las siete. Los cuentas hacia atrás ahora. Es lo único que sabes hacer con la boca cerrada.

Tres. La silla vacía. ${api.bandera("camisa_en_cuerpo") ? "Tú con la camiseta, con el frío por dentro, sin la camisa, que se ha quedado en una zanja tapando una cara." : "Tú con la camisa de Marcos, que huele a él y a esta noche."} Irene ${h === "irene" ? "con la mano en el cuello y los ojos en la silla vacía, quieta, como quien escucha a alguien sentado en ella" : "con las rodillas en el pecho, temblando de una manera que ya no es de frío"}. ${o ? N[o] + (h === o ? ", con las manos en la mesa, quieto, mirándolas como se miran las manos de otro." : seg === o ? ", con la mirada en la ventana, en lo que solo ve él." : ", con las manos en la mesa, sin nada que arreglar.") : ""}

${h === "marcos" ? "Marcos no ha hablado desde el hallazgo. Ni una explicación. Ni un chiste. Marcos, que cuando deja de hacer chistes es que pasa algo. Lo sabes desde marzo, sin que nadie te lo dijera." : "Irene no ha leído a nadie desde el hallazgo. Irene, que va un segundo por delante de lo que dice la gente, va ahora un minuto por detrás. Y mira a " + (o ? N[o] : "ti") + " como se mira a alguien que acaba de conocer."}

Y las necesidades. La casa las tiene todas contadas. Frío. Sed. Una herida que sangra y hay que lavar. Mear. Fumar. Lo que hace que la gente se levante de una mesa.

${salidaV}

${v !== "nora" ? `Y ${N[h]} se levanta detrás.

${h === "marcos" ? "Sin decir nada. " + (R().herido(api, "marcos", "sangra") ? "Con la mano vendada. " : "") + (R().lleva(api, "marcos", "atizador") ? "Sin el atizador, que deja apoyado en la silla. " : "") + "Marcos, que no sube escaleras si no se lo piden, sube la escalera detrás de Irene." : "Sin decir nada. Descalza. Irene, que no va a ningún sitio detrás de nadie, va detrás de " + N[o] + "."}

Nora: ${N[h]}.

${N[h]}: Voy a ver que esté bien.

Lo dice sin girarse. Con una voz que es la suya. Casi.` : `Y te levantas. La cocina. El grifo. Cuatro pasos.

Y ${N[h]} se levanta detrás.

${h === "marcos" ? "Sin decir nada. Sin el atizador. Marcos detrás de ti hacia la cocina, como esta tarde hace un siglo, cuando fue a por hielo." : "Sin decir nada. Descalza. Irene detrás de ti hacia la cocina, que es donde Irene no entra nunca."}

Nora: ¿Qué?

${N[h]}: Agua. Yo también.

Lo dice sin mirarte. Con una voz que es la suya. Casi.`}

${modo(api, "nora", {
  lucido: `~ ${N[h]} detrás de ${v === "nora" ? "mí" : N[v]}. Sin que nadie se lo pida. Con esa voz. Llevo toda la noche apuntando cuándo ${N[h]} no es ${N[h]}, y esta es la vez que más lo apunto.`,
  asustado: "~ Uno. Dijo uno. Y ahora se levanta. Y va detrás. Como se va detrás de la segunda cosa de una lista.",
  tenso: "~ Que no vaya. Que se siente. Que no suba nadie. Que no se quede nadie a solas con nadie. Lo dijo Marcos. Lo dijo él.",
  ido: "~ Se ha levantado un segundo antes de decidirlo. Lo he visto. El cuerpo primero y la cara después. Como una marioneta a la que le sobra hilo.",
  perdido: "~ Va a por ella. A por él. A por el segundo. Lo lleva dentro desde la mesa y ahora ha decidido que ya.",
  normal: "~ Vale. Vale. Nadie a solas. Voy detrás. O no voy. Una de las dos y rápido.",
})}

Dos cosas pasan a la vez. ${v === "nora" ? "En la cocina, contigo. Y dentro de " + N[h] + "." : "Arriba, con " + N[v] + ". Y dentro de " + N[h] + "."}`;
    },
    opciones: [{ texto: "Continuar", a: "ix2_cartas" }],
  },

  ix2_cartas: {
    pov: null,
    titulo: "Nivel tres · A solas",
    hora: "06:05",
    alEntrar: (api) => { R().tick(api); if (!api.bandera("ataque_victima")) api.marcar("ataque_victima", victimaPorDefecto(api)); },
    texto: (api) => {
      const h = H(api), v = V(api);
      return `
${v === "nora" ? "La cocina. La luz de tubo. El grifo. Y " + N[h] + " en el arco, detrás." : "El baño de arriba. La bañera de patas. El grifo. Y " + N[h] + " en la puerta, detrás."}

${N[V(api)]}, que se levanta de la mesa y no sabe lo que se levanta detrás. Y ${N[H(api)]}, que lo sabe desde dentro y no puede decirlo.

¿A quién quieres llevar?`;
    },
    personajes: [
      { id: (api) => V(api), descripcion: (api) => V(api) === "nora" ? "Tú. En la cocina. Con el grifo y con lo que haya a mano." : N[V(api)] + ". En el baño. Con el agua. Y con " + N[H(api)] + " en la puerta.", a: "ix3_ataque",
        efecto: (api) => { api.marcar("ataque_pov", "victima"); } },
      { id: (api) => H(api), descripcion: (api) => N[H(api)] + ". Desde dentro. Con las manos que no son suyas y los pensamientos que tampoco.", a: "ix3_ataque",
        efecto: (api) => { api.marcar("ataque_pov", "huesped"); } },
    ],
  },

  ix3_ataque: {
    pov: (api) => api.bandera("ataque_pov") === "huesped" ? H(api) : V(api),
    fondo: (api) => lugarAtaque(api) === "bano" ? "assets/fondos/bano_agua.jpg" : "assets/fondos/cocina_noche.jpg",
    ambiente: (api) => lugarAtaque(api) === "bano" ? "bano" : "cocina",
    musica: "terror",
    lugar: (api) => lugarAtaque(api) === "bano" ? "baño de arriba" : "cocina",
    hora: "06:07",
    titulo: "Nivel tres · El ataque",
    alEntrar: (api) => { R().tick(api); const h = H(api); api.marcar("banera_llena", lugarAtaque(api) === "bano"); api.presenciar(V(api), 2); api.est(h, "lucidez", -4); },
    texto: (api) => {
      const h = H(api), v = V(api), pov = api.bandera("ataque_pov") || "victima";
      const lugar = lugarAtaque(api);
      const obj = objeto(api, v);
      const objTxt = obj ? R().OBJETOS[obj] : null;
      const yaMarcada = api.sabe(v, h + "_me_sujeto") || api.sabe(v, h + "_me_quemo") || api.sabe(v, h + "_me_hirio");
      if (pov === "huesped") {
        // Desde dentro. Nivel tres: el impulso, con una alternativa igual de buena y sin etiqueta.
        const escena = lugar === "bano" ? `
El baño de arriba. ${N[v]} con las manos bajo el grifo${v === "irene" ? ", echándose agua en la cara, con el pelo mojado en las sienes" : ", lavándose la cara, con el pelo mojado"}. La bañera de patas detrás, con el tapón puesto, que alguien ha puesto, que has puesto tú al entrar sin acordarte.

Y el grifo de la bañera abierto. Llenándose. Lo has abierto tú. No te acuerdas.

${N[v]}: ¿Qué haces?

Lo dices: «Nada.» Y la boca dice otra cosa por dentro.

~ ${R().intrusion(api, h, 3)}

Estás a un paso. Tienes las manos a los lados. Y las manos suben solas, despacio, como suben las manos en los sueños, hasta la altura de su nuca.

${N[v]} te ve en el espejo. La cara. Tu cara. Y algo en tu cara que no es tuyo, y ${N[v]} lo ve, y se le va el color.

${N[v]}: ${N[h]}.

Y tú oyes tu nombre como se oye desde el fondo de una piscina.` : `
La cocina. La luz de tubo. Nora ${R().herido(api, "nora", "mano") ? "con la mano bajo el grifo, la del paño, con el agua fría llevándose lo que llevaba el paño" : "con las manos bajo el grifo, con el agua fría, como quien se lava algo que no se ve"}. De espaldas a ti.

Y tú en el arco. Y luego no en el arco: a un paso de ella. No te acuerdas del paso.

~ ${R().intrusion(api, h, 3)}

Las manos suben solas. Despacio. Como suben las manos en los sueños. Hasta la altura de su nuca, donde le has puesto la mano toda la noche, donde ella se gira siempre.

Se gira. Te ve la cara. Tu cara. Y algo en tu cara que no es tuyo, y Nora lo ve, y se le va el color.

Nora: ${N[h]}.

Y tú oyes tu nombre como se oye desde el fondo de una piscina.`;
        return `${escena}

Y aquí, un segundo. Uno. En el que las manos son tuyas todavía. Un segundo entero en el que puedes cerrarlas, o bajarlas, o irte.

${modo(api, h, {
  lucido: "~ Un segundo. Lo sé porque lo estoy contando. Es lo único mío: contar. Uno. Y en el uno, las manos son mías.",
  asustado: "~ Quiere que apriete. Lo quiere con mis manos. Y yo quiero que no. Y no sé cuál de los dos gana esta vez.",
  tenso: "~ Fuera. Salir. Cerrar la puerta. Con el pestillo por fuera. Antes de que el segundo se acabe.",
  ido: "~ Las manos suben como sube el agua de la bañera. Sin prisa. Con el nivel justo.",
  perdido: "~ Ya. Ahora. Es el segundo. Uno, dos. Y este es el dos.",
  normal: "~ No. No, no, no. Bajar las manos. Bajarlas. Ya.",
})}`;
      }

      // Desde la víctima
      const entra = lugar === "bano" ? `
El baño de arriba. La luz encendida. La bañera de patas, con el esmalte desconchado. El espejo con el azogue gastado. La ventana con la luna que ya no está: el cielo, por la ventana, empieza a no ser negro. Gris. Un gris de nada.

${v === "irene" ? "Te lavas la cara. Con las dos manos. El agua fría, y luego caliente, como siempre en esta casa. Te miras en el espejo. La versión borrada. Y detrás de la versión borrada, la puerta." : "Meas. Te lavas las manos. El agua fría y luego caliente, como siempre en esta casa. Te miras en el espejo. Y detrás de tu cara, la puerta."}

Y ${N[h]} en la puerta.

${N[v]}: ¿Qué?

${N[h]}: Nada.

Entra. Cierra. Y va a la bañera. Y pone el tapón. Y abre el grifo. El agua empieza a caer en la porcelana con el ruido que hace el agua cuando va a tardar.

${N[v]}: ¿Qué haces?

${N[h]}: Nada.

Y se pone detrás de ti. A un paso. Lo ves en el espejo. Con la cara. Con algo en la cara que no es ${fem(h) ? "suya" : "suyo"}, y lo ves, y se te va el color.

${yaMarcada ? "Lo has visto antes. En " + (v === "irene" ? "el pasillo, con la mano en tu brazo" : v === "marcos" ? "la cocina, con la mano bajo el agua" : "la buhardilla, con la mano en tu muñeca") + ". Es la misma cara. Y ahora sabes lo que viene después de esa cara." : "Es la cara de la mesa. " + (v === "irene" ? (api.bandera("marcos_accion") === "rescate" ? "La de cuando se agachó sobre ti y te sopló dentro." : "La de cuando volvió la luz y te miró como si no te conociera.") : "La de cuando dejó de respirar y volvió con otra cara puesta.") + " La misma."}` : `
La cocina. La luz de tubo. El grifo. ${R().herido(api, "nora", "mano") ? "La mano bajo el agua fría, la de la trampilla, y el agua llevándose la costra, rosa por el desagüe." : "Las manos bajo el agua fría, como quien se lava algo que no se ve."}

Y ${N[h]} en el arco. Y luego no en el arco: a un paso, detrás. No le has oído dar el paso.

Te giras. La cara. Su cara. Y algo en la cara que no es suyo: los ojos en otro sitio, la boca a medio decir una cosa que no dice.

${yaMarcada ? "Lo has visto antes. Es la cara de la escalera. La de «todavía no». Y ahora sabes lo que viene después." : "Es la cara de la mesa. La de la ouija. La misma."}`;

      return `${entra}

Y las manos.

Suben. Las dos. Despacio. A la altura de tu cuello. ${N[h]}: «${R().intrusion(api, h, 3)}» Lo dice bajo, y no es a ti, y no es ${fem(h) ? "ella" : "él"}.

[susto]

Y cierran.

${lugar === "bano" ? `No en el cuello. En la nuca. Con la mano entera en el pelo. Y empuja. Hacia abajo. Hacia la bañera, que se llena, que ya tiene dos dedos, tres, y el agua fría, y luego caliente, como siempre en esta casa.

La cara en el agua. Tres dedos de agua bastan. Lo sabes ahora.` : `En el cuello. Los dedos alrededor, apretando, como se sujeta algo que puede escaparse. Y te empuja contra la encimera, contra la piedra, con el grifo abierto detrás mojándote la espalda.

Y no entra aire. Como en la mesa. Como a Irene. Una puerta cerrada en la garganta y detrás, nada.`}

~ ${N[h]}. ${N[h]}, no. ${N[h]}, soy yo.

Y ${fem(h) ? "ella" : "él"} lo sabe. Se le ve saberlo. Y aprieta.

${objTxt ? `${objTxt.charAt(0).toUpperCase() + objTxt.slice(1)}. ${obj === "sarten" ? (lugar === "bano" ? "En el suelo del baño, donde la has dejado al entrar, porque ya no la sueltas." : "En el suelo, al lado de la encimera, donde la dejaste.") : obj === "atizador" ? "Apoyado en la pared, donde lo dejaste." : obj === "llave" ? "En el bolsillo de atrás." : obj === "botella" ? (lugar === "bano" ? "En el borde del lavabo, donde la has dejado." : "En la encimera, a un palmo de la mano.") : obj === "linterna" ? "En el bolsillo, larga, de pilas, con peso." : "A mano."} Lo notas antes de pensarlo.` : "Nada a mano. Las manos. Las uñas. Los pies. Lo que hay."}

${modo(api, v, {
  lucido: `~ ${N[h]} pesa lo que pesa. Yo no puedo con ${fem(h) ? "ella" : "él"} de frente. Puedo con lo que tengo a mano, o puedo con la puerta, o puedo no poder. Tres cosas. Una.`,
  asustado: "~ Me está matando. Me está matando con su cara. Con su cara puesta. Y no es su cara.",
  tenso: "~ Pégale. Pégale con lo que sea. Con la cabeza. Con la puta bañera. Pégale.",
  ido: "~ El agua sube. Como en la ouija. Como subía el aire que no entraba. Es la misma cosa con otra forma.",
  perdido: `~ Es la segunda. Uno, y ahora yo. ${fem(h) ? "Ella" : "Él"} lo cuenta desde dentro. Y va por dos.`,
  normal: `~ ${N[h]}. Joder, ${N[h]}. Suelta. Suelta. Suelta.`,
})}`;
    },
    opciones: [
      // Desde el huésped: el impulso, o rechazarlo
      { texto: "Apretar. Que se calle. Que se quede.", a: "ix4_despues", si: (api) => api.bandera("ataque_pov") === "huesped",
        efecto: (api) => { resolverAtaque(api, decidirVictima(api)); api.marcar("huesped_eligio", "ataca"); } },
      { texto: "Bajar las manos. Salir. Cerrar la puerta con el pestillo por fuera.", a: "ix4_despues", si: (api) => api.bandera("ataque_pov") === "huesped",
        efecto: (api) => { resolverAtaque(api, "rechazo"); api.marcar("huesped_eligio", "rechaza"); api.est(H(api), "lucidez", 3); } },
      { texto: "Decir su nombre. En voz alta. Con tu voz. Para saber si sale.", a: "ix4_despues", si: (api) => api.bandera("ataque_pov") === "huesped",
        efecto: (api) => { const h = H(api); api.marcar("huesped_eligio", "nombre"); if (api.lucido(h)) { resolverAtaque(api, "rechazo"); } else { resolverAtaque(api, decidirVictima(api)); } R().ofrenda(api, "nombre"); } },
      // Desde la víctima
      { texto: "Huir. Empujar. La puerta. La escalera. La luz.", a: "ix4_despues", si: (api) => api.bandera("ataque_pov") !== "huesped",
        efecto: (api) => resolverAtaque(api, "huye") },
      { texto: (api) => "Herir" + (objeto(api, V(api)) ? ". Con " + R().OBJETOS[objeto(api, V(api))] + ". Lo justo para que suelte." : ". Con las uñas, con la cabeza, con lo que hay. Lo justo para que suelte."), a: "ix4_despues", si: (api) => api.bandera("ataque_pov") !== "huesped",
        efecto: (api) => resolverAtaque(api, "hiere") },
      { texto: (api) => "Herir" + (objeto(api, V(api)) ? ". Con " + R().OBJETOS[objeto(api, V(api))] + ". Hasta que no se levante." : ". Con la piedra de la encimera. Con la bañera. Hasta que no se levante."), a: "ix4_despues", si: (api) => api.bandera("ataque_pov") !== "huesped", impulsiva: true,
        efecto: (api) => resolverAtaque(api, "mata") },
      { texto: (api) => "No defenderte. Es " + (fem(H(api)) ? "ella" : "él") + ". Va a parar. Tiene que parar.", a: "ix4_despues", si: (api) => api.bandera("ataque_pov") !== "huesped",
        efecto: (api) => resolverAtaque(api, "muere") },
    ],
  },

  ix4_despues: {
    pov: (api) => { const v = V(api); return R().vivo(api, v) && v !== H(api) ? v : "nora"; },
    titulo: "Nivel tres · Después",
    hora: "06:10",
    alEntrar: (api) => { R().tick(api); if (!api.bandera("ataque_resultado")) resolverAtaque(api, decidirVictima(api)); },
    texto: (api) => {
      const h0 = api.bandera("huesped_anterior") && api.bandera("ataque_resultado") === "mata" ? api.bandera("huesped_anterior") : H(api);
      const h = H(api), v = V(api), res = api.bandera("ataque_resultado"), lugar = lugarAtaque(api);
      const pov = R().vivo(api, v) && v !== h0 ? v : "nora";
      const obj = objeto(api, v);
      const objTxt = obj ? R().OBJETOS[obj] : "las manos";
      if (res === "rechazo") return `
${pov === v ? `Y ${N[h0]} baja las manos.

Así. Sin que hagas nada. Las manos que subían bajan, despacio, como si pesaran, y ${fem(h0) ? "ella" : "él"} da un paso atrás, y otro, y sale, y cierra la puerta.

Y oyes el pestillo. Por fuera.

${N[v]}: ¿${N[h0]}?

Nada. Los pasos alejándose. La escalera. Y tú con la cara mojada mirando una puerta cerrada por fuera, que es lo mejor que te ha pasado en toda la noche.` : `${N[h0]} ha vuelto a la mesa. Solo. Con la cara blanca y las manos metidas debajo de los muslos, sentado encima de ellas, como se sienta un niño para no tocar nada.

Nora: ¿Y ${N[v]}?

${N[h0]}: En el baño. He cerrado. Por fuera.

Nora: ¿Por qué?

${N[h0]}: Para que no entre nadie.

No dice «para que no entre yo». Lo dices tú por dentro.`}

${modo(api, pov, {
  lucido: `~ Ha parado. ${fem(h0) ? "Ella" : "Él"} ha parado a ${fem(h0) ? "ella" : "él"}. Con las manos a un palmo. Eso es lo que hay dentro todavía: alguien que puede parar. Por ahora.`,
  asustado: "~ El pestillo. Por fuera. Me ha encerrado para salvarme. O para tenerme.",
  tenso: "~ Fuera. De aquí. De esta casa. Ya. Con pestillo o sin él.",
  ido: "~ Las manos bajaban como baja el agua cuando quitas el tapón. Despacio y con un ruido dentro.",
  perdido: "~ Todavía no. No me ha dicho «todavía no», pero lo ha hecho. Me ha dejado para después.",
  normal: "~ Ha parado. Vale. Vale. Ha parado y no sé por qué y no lo voy a preguntar.",
})}`;

      if (res === "todavia") return `
Y ${N[h0]} suelta.

Así. Los dedos que se abren. El aire que entra, feo, de tubería, y tú contra la encimera con el grifo mojándote la espalda.

${N[h0]}: Todavía no.

Lo dice mirándote. Con la cara tranquila y los ojos en otro sitio.

${N[h0]}: Todavía no.

Y sale de la cocina. Sin correr. Como se sale de una habitación donde ya has hecho lo que venías a hacer.

Te miras la mano. ${R().herido(api, "nora", "mano") ? "La de la trampilla. Y ahora también la muñeca" : "La muñeca"}, hinchada, torcida, con los dedos que no cierran. Te la ha roto al soltar, o al apretar, o en medio.

~ Todavía no. A mí no. A mí todavía no. Me guarda. Me guarda para el final.

${modo(api, "nora", {
  lucido: "~ Me ha soltado. No porque yo haya hecho nada. Porque no me tocaba. Hay un orden. Lo dijo la voz de la buhardilla contando: uno, dos, tres. Y yo no estoy en el tres.",
  asustado: "~ Todavía no. Todavía. Es un plazo. Me ha dado un plazo con su cara puesta.",
  tenso: "~ La mano. La puta mano. Y él arriba. Y Irene arriba. Y yo aquí con una mano que no cierra.",
  ido: "~ Me ha soltado como se suelta un vaso que ya está en la letra. Con cuidado. Para que no se mueva de donde lo ha puesto.",
  perdido: "~ Me guarda. Soy la última. Lo sé desde la ouija. Lo sabe desde la ouija. Y ahora me lo ha dicho.",
  normal: "~ Respira. Respira. Y no vuelvas a quedarte a solas con él. Con ella. Con nadie.",
})}`;

      if (res === "huye") return `
Empujas. Con todo. Con las rodillas, con la cabeza, con lo que hay. ${lugar === "bano" ? "La cara sale del agua. Toses. El agua te sale por la nariz." : "El cuello se suelta. El aire entra, feo, de tubería."} Y ${N[h0]} se va hacia atrás, un paso, y tú ya estás en la puerta.

La puerta. ${lugar === "bano" ? "El pasillo. La escalera. El tercero, el séptimo, sin contarlos." : "El arco. El salón."} La mesa. ${R().vivos(api).filter((p) => p !== v && p !== h0).map((p) => N[p]).join(" y ") || "Nadie"} en la mesa, ${R().vivos(api).filter((p) => p !== v && p !== h0).length ? "levantándose" : "y las sillas vacías"}.

Y la puerta principal. La abres. El porche. La bombilla con las polillas. El aire.

Y te paras en el porche. En la luz. Porque más allá de la luz está lo de ${N[api.bandera("desaparecido") || "alex"]}, y lo sabes, y el cuerpo lo sabe antes que tú.

Detrás, en la casa, ${N[h0]} no viene. No baja. No sale. Se queda donde estaba, con el grifo abierto, ${lugar === "bano" ? "con la bañera llenándose" : "con el agua corriendo"}.

~ No me ha seguido. Me ha dejado ir. Porque fuera es peor, y lo sabe. Porque fuera no hace falta que me sujete nadie.

${modo(api, pov, {
  lucido: "~ He salido. Hasta la luz. Y la luz es un porche de dos metros con un bosque alrededor. Es la salida más pequeña del mundo, y no hay otra.",
  asustado: `~ ${fem(h0) ? "Ella" : "Él"} dentro. Lo de fuera, fuera. Y yo en dos metros de bombilla con polillas.`,
  tenso: "~ Que no baje. Que no baje. Y si baja, la grava. Me da igual la grava.",
  ido: "~ Las polillas dan vueltas al revés. Desde que ha salido " + N[api.bandera("desaparecido") || "alex"] + ". Nadie lo ha mirado.",
  perdido: "~ Me ha dejado salir a la luz para que la luz me entregue. Como a los otros. Como al primero.",
  normal: "~ Respira. Respira. Estás en el porche. Estás en la luz. Ahora, la mesa. Ahora, los demás.",
})}`;

      if (res === "hiere") return `
${objTxt.charAt(0).toUpperCase() + objTxt.slice(1)}. ${obj === "sarten" ? "La coges por el mango. Pesa lo que pesa el hierro. Y la levantas, y baja." : obj === "atizador" ? "Lo coges. El gancho. Y lo levantas, y baja." : obj === "llave" ? "La sacas del bolsillo. La llave inglesa. Pesa. Y la levantas, y baja." : obj === "botella" ? "La coges por el cuello. Y la levantas, y baja. Se rompe." : obj === "linterna" ? "La sacas. Larga. De pilas. Y la levantas, y baja." : "Las uñas. En la cara. Con las dos manos. Y la cabeza, hacia atrás, contra la suya."}

Un ruido. De hueso. De piel que se abre. ${N[h0]} suelta. Se va hacia atrás con la mano en ${lugar === "bano" ? "la sien" : "la cara"}, y entre los dedos, sangre. Oscura. Mucha.

Y ${fem(h0) ? "ella" : "él"} te mira.

Con su cara. La suya. La de siempre. Como quien se despierta en una habitación que no es la suya.

${N[h0]}: ¿Qué...?

${N[v]}: No te acerques.

${N[h0]}: ¿Qué me has hecho?

Lo pregunta ${fem(h0) ? "ella" : "él"}. Con la sangre entre los dedos. Con la cara de no saber. Y se le ve no saber. Y eso es lo peor que has visto esta noche después de lo de ${N[api.bandera("desaparecido") || "alex"]}.

~ Le he abierto la cabeza. A ${N[h0]}. Con ${objTxt}. Y me mira como si yo fuera lo que le estaba matando.

~ Y a lo mejor lo soy. A lo mejor ahora lo soy yo.

${lugar === "bano" ? "La bañera sigue llenándose. Cierras el grifo. Se oye el agua irse por el rebosadero, como una garganta." : "El grifo sigue abierto. Lo cierras. El silencio de la cocina es más grande que la cocina."}

${modo(api, pov, {
  lucido: `~ Ha parado en cuanto ha sangrado. Como si lo que fuera saliera con la sangre. Como si el dolor lo despertara. Eso lo apunto: el dolor lo despierta. Por ahora.`,
  asustado: "~ Le he pegado. A " + N[h0] + ". Con todo. Y me mira con su cara y no sé cuál de las dos caras me da más miedo.",
  tenso: "~ Otra vez. Si se mueve, otra vez. Me da igual la cara.",
  ido: `~ La sangre de ${N[h0]} es del mismo color que la de ${N[api.bandera("desaparecido") || "alex"]}. Lo sé porque lo he visto todo esta noche. Todo.`,
  perdido: "~ Le he abierto para que salga. Y ha salido. Un poco. Lo he visto salir por la cabeza. Y vuelve a entrar.",
  normal: `~ ${N[h0]}. ${N[h0]}, joder. Que era yo. Que soy yo.`,
})}`;

      if (res === "mata") {
        const nuevo = H(api);
        return `
${objTxt.charAt(0).toUpperCase() + objTxt.slice(1)}. ${obj ? "Lo coges. Lo levantas. Y baja." : "La piedra de la encimera. Le empujas la cabeza contra ella. Una vez."}

Y otra vez.

Y otra.

No cuentas. Cuentas después. En el momento no hay números: hay ${fem(h0) ? "ella" : "él"} contra el suelo, y el ruido, y las manos que ya no suben, y otra vez, porque si paras se levanta, porque si paras vuelve a tener esa cara.

Y paras.

${N[h0]} en el suelo. ${lugar === "bano" ? "Entre la bañera y el lavabo, con la cabeza en el zócalo, con el agua de la bañera cayendo por el borde y llegando hasta el pelo." : "Entre la encimera y la nevera, con la cabeza en el zócalo."} Con la cara hacia arriba. Con la cara suya, por fin, la de siempre, sin nada dentro. Con los ojos abiertos.

Y algo sale.

No lo ves. Lo notas. Como cuando se te destapa un oído. Un aire que sale de la boca abierta de ${N[h0]} y no va a ningún sitio, y luego sí. Hacia ${nuevo === v ? "ti. Sube. Te entra por la boca, que tienes abierta de respirar, y baja, frío, y se queda." : N[nuevo] + ", que está en la puerta, que ha subido con el ruido, que tiene la boca abierta. Le entra. Lo ves entrarle: se le va el color y le vuelve de otro sitio."}

Y ya.

~ Le he matado. A ${N[h0]}. ${h0 === "marcos" ? "Al que explica las cosas. Al que le sujeté el pelo. Al que" : "A la que lee a la gente. A la que se ahogó en la mesa. A la que"} me estaba matando con las manos.

~ Y no me estaba matando ${fem(h0) ? "ella" : "él"}. Lo sé. Lo sabía mientras. Y he seguido.

${modo(api, pov, {
  lucido: "~ Está muerto. Muerta. Se ha ido lo que tenía dentro y se ha ido con ello. Y lo que tenía dentro no se ha ido: se ha movido. Lo he notado moverse.",
  asustado: "~ Dos. Ya somos dos los que hemos matado esta noche. La casa y yo.",
  tenso: "~ Levántate. No te levantes. Levántate y ten tu cara. Ten tu cara, joder.",
  ido: `~ Los ojos de ${N[h0]} miran el techo. Como los de ${N[api.bandera("desaparecido") || "alex"]}. Todos acaban mirando el techo. Como si allí hubiera algo.`,
  perdido: `~ Lo tengo ${nuevo === v ? "yo" : N[nuevo]}. Ha salido de ${N[h0]} y ha entrado ${nuevo === v ? "en mí. Lo noto. Frío. Debajo del esternón." : "en " + N[nuevo] + ". Se lo he dado yo."}`,
  normal: `~ ${N[h0]}. ${N[h0]}, joder. ${N[h0]}.`,
})}`;
      }

      // muere (v no es Nora): lo cuenta Nora, que sube con el ruido
      return `
El ruido. Arriba. Un golpe, y agua, y luego nada. Y el nada dura más que el golpe.

Subes. El tercero. El séptimo. El pasillo. La puerta del baño, cerrada.

La abres.

${N[h0]} de pie. Con las manos mojadas hasta el codo. Con la cara suya, la de siempre, mirando la bañera como quien mira una cosa que no entiende.

Y en la bañera, ${N[v]}.

Boca abajo. Con el pelo flotando. Con el agua hasta el borde, y el grifo abierto, y el rebosadero tragando con un ruido de garganta. Con ${v === "irene" ? "la sudadera hinchada de aire, como una vela" : "la camisa hinchada de aire, como una vela"}. Quieto. Quieta. Como se está en el agua cuando ya no se está.

${N[h0]}: No sé.

Nora: ¿Qué?

${N[h0]}: No sé. Estaba... no sé.

Y se mira las manos. Y tarda en mirarlas. Y se le ve no acordarse, y es la cosa más horrible que has visto en toda la noche, y has visto mucho.

Cierras el grifo. El agua deja de caer. El rebosadero traga lo último. Y el silencio del baño es más grande que el baño.

~ Dos. La voz de la buhardilla contaba hasta tres. Uno en la zanja. Dos en la bañera. Y ${N[h0]} con las manos mojadas diciendo «no sé».

${modo(api, "nora", {
  lucido: `~ ${N[h0]} ${fem(h0) ? "la" : "le"} ha ahogado. Con las manos. Y no se acuerda. Y lo que sea que ${fem(h0) ? "la" : "le"} tiene ya no necesita esconderse, porque ya solo quedamos ${fem(h0) ? "ella" : "él"} y yo.`,
  asustado: `~ Dos. Y quedamos dos. Y ${fem(h0) ? "ella" : "él"} tiene las manos mojadas y su cara y no se acuerda.`,
  tenso: "~ Sácala. Sácalo. Del agua. Ahora. Aunque no sirva. Aunque no sirva de nada.",
  ido: `~ El pelo de ${N[v]} flota como flotan las cosas que ya pesan menos. Como si el agua se lo hubiera quedado.`,
  perdido: "~ Dos. Lo ha dicho la bañera con el rebosadero. Dos. Y el tres soy yo, y lo sabe, y se ha mojado las manos para mí.",
  normal: `~ ${N[v]}. ${N[v]}, joder. ${N[v]}.`,
})}`;
    },
    opciones: [
      { texto: "Volver a la mesa. Con los que queden. Sin dejar de mirar la escalera.", a: "ix5_suplica",
        efecto: (api) => { api.marcar("ix4_nora", "mesa"); } },
      { texto: (api) => "Sacar" + (fem(V(api)) ? "la" : "le") + " del agua. Aunque no sirva.", a: "ix5_suplica", si: (api) => api.bandera("ataque_resultado") === "muere",
        efecto: (api) => { api.marcar("ix4_nora", "saca"); api.est("nora", "estres", 6); api.marcar("cuerpo_" + V(api), "banera_fuera"); } },
      { texto: (api) => "Coger " + (objeto(api, V(api)) ? R().OBJETOS[objeto(api, V(api))] : lugarAtaque(api) === "cocina" ? "la sartén de hierro" : R().quienLleva(api, "atizador") ? "la botella de la mesa" : "el atizador de abajo") + " y no soltarlo en lo que queda de noche.", a: "ix5_suplica", si: (api) => api.bandera("ataque_resultado") === "hiere" || api.bandera("ataque_resultado") === "huye" || api.bandera("ataque_resultado") === "todavia",
        efecto: (api) => { const v = V(api); api.marcar("ix4_nora", "arma"); if (!objeto(api, v)) { const obj = lugarAtaque(api) === "cocina" ? "sarten" : R().quienLleva(api, "atizador") ? "botella" : "atizador"; R().coger(api, v, obj); if (obj === "atizador") api.marcar("atizador_silla", false); } api.est(v, "eje", 2); } },
      { texto: "Escribir. La hora. Lo que ha pasado. Con la mano que quede.", a: "ix5_suplica", lucida: true,
        efecto: (api) => { api.marcar("ix4_nora", "escribe"); api.evidencia("cuaderno_ataque", "nora", "cuaderno de Nora", "nota"); api.est("nora", "lucidez", 1); } },
      { texto: "Lavarte las manos. Mucho rato. Hasta que el agua salga fría otra vez.", a: "ix5_suplica", si: (api) => api.bandera("ataque_resultado") === "mata",
        efecto: (api) => { api.marcar("ix4_nora", "lava"); const v = V(api); api.est(v, "estres", -4); api.est(v, "lucidez", -2); } },
    ],
  },

  ix5_suplica: {
    pov: (api) => destinatario(api),
    fondo: "assets/fondos/salon_gris.jpg",
    ambiente: "interior",
    musica: "terror_suave",
    lugar: "comedor", hora: "06:16",
    titulo: "Nivel tres · La súplica",
    alEntrar: (api) => {
      R().tick(api);
      if (api.bandera("huesped_retirado") === undefined) api.marcar("huesped_retirado", ["hiere", "rechazo"].includes(api.bandera("ataque_resultado")));
    },
    texto: (api) => {
      const h = H(api), v = V(api), res = api.bandera("ataque_resultado");
      const dest = destinatario(api);
      const retirado = api.bandera("huesped_retirado");
      const vivos = R().vivos(api);
      if (!R().vivo(api, h) || res === "mata") {
        // No hay súplica: el portador ha muerto. El aliento ya está en otro.
        const nuevo = H(api);
        return `
La mesa. ${vivos.length === 2 ? "Dos." : "Tres."} Y ${N[api.bandera("huesped_anterior") || h]} arriba, en el suelo, con los ojos abiertos.

Nadie dice nada durante mucho rato. La nevera. El generador lejos. Y el cielo por la ventana, gris. Un gris que todavía no es luz.

${nuevo === dest ? `Y el frío. Debajo del esternón. Como un hielo que no se termina de deshacer. Lo notas al respirar.

~ ${R().intrusion(api, nuevo, 1)}

Eso ha llegado. Con tu voz. Sin que lo pensaras.` : `${N[nuevo]} tiene frío. Se le ve: se frota los brazos, el pecho, como quien se frota una marca. Y no hay marca.`}

${modo(api, dest, {
  lucido: "~ Está muerto. Muerta. Y lo que llevaba no ha muerto. Lo dijo Álex de la bruja: se cobra en quien más quieres. Y se ha cobrado, y ha cambiado de sitio, y sé exactamente a dónde.",
  asustado: "~ Dos. Y el frío. Y quedamos los que quedamos. Y uno de nosotros lo tiene.",
  tenso: "~ Las siete. Cuarenta y cuatro minutos. Se puede. Se puede con lo que sea que quede.",
  ido: "~ El frío tiene forma. Es alargado. Está debajo del esternón y se mueve cuando respiro.",
  perdido: `~ ${nuevo === dest ? "Lo tengo. Lo noto. Y ya sé lo que viene: primero los lapsos, después las manos." : "Lo tiene " + N[nuevo] + ". Se lo ha dado " + N[api.bandera("huesped_anterior") || h] + " al morir. Como se da un abrigo."}`,
  normal: "~ Cuarenta y cuatro minutos. Y que nadie se quede a solas con nadie. Ni conmigo.",
})}`;
      }

      const llega = res === "muere" ? `
${N[h]} baja la escalera. Despacio. Con las manos mojadas hasta el codo, goteando en cada peldaño. Con su cara.

Se sienta. Delante de ti. Y te mira. Y llora.

${N[h]}: No he sido yo.

Lo dice bajo. Con la voz rota. Con la cara de ${h === "marcos" ? "Marcos, la de cuando no encuentra el nombre de una cosa" : "Irene, la de debajo de la cara"}.

${N[h]}: Nora. Mírame. No he sido yo. Sabes que no he sido yo.` : res === "hiere" ? `
${N[h]} entra en el salón. Con la mano en ${lugarAtaque(api) === "bano" ? "la sien" : "la cara"}, y la sangre entre los dedos, y su cara. La suya.

Se sienta. Lejos. Al otro lado de la mesa. Con las manos a la vista, encima de la madera, como se ponen las manos delante de alguien que tiene un arma.

${N[h]}: No he sido yo.

Lo dice bajo. Sin la voz de nada. Con la voz de ${h === "marcos" ? "Marcos cuando ha perdido" : "Irene cuando no queda máscara"}.

${N[h]}: ${N[dest]}. Mírame. No he sido yo. Sabes que no he sido yo.` : res === "todavia" || res === "huye" ? `
${N[h]} entra en el salón. ${res === "huye" ? "Baja la escalera despacio, con las manos a la vista, como quien se acerca a un animal." : "Sale de la cocina despacio, con las manos a la vista, como quien se acerca a un animal."} Con su cara. La suya. Y llora.

Se sienta. Lejos. Al otro lado de la mesa.

${N[h]}: No he sido yo.

Lo dice bajo. Con la voz rota.

${N[h]}: ${N[dest]}. Mírame. Sabes que no he sido yo.` : `
${N[h]} abre el pestillo del baño. Desde fuera. Y no entra: se queda en el pasillo, con las manos a la vista, como quien se acerca a un animal.

${N[h]}: Sal. Ya puedes. Sal.

Y bajáis. Y en la mesa, ${fem(h) ? "ella" : "él"} se sienta lejos, al otro lado, con las manos encima de la madera.

${N[h]}: No sé qué ha pasado ahí arriba. Sé que he parado. Sé que he cerrado. ${N[dest]}. Mírame.`;

      const suplica = h === "marcos" ? `
Marcos: Piénsalo. Piénsalo como lo pensarías tú. Llevo desde las tres con un frío que no es mío. Con lapsos. Con palabras que no son mías. Lo sabes: me lo has visto. Y ahora he ${res === "muere" ? "hecho eso, ahí arriba," : "hecho eso"} y no me acuerdo. No me acuerdo, ${N[dest]}. Y no me acuerdo porque no era yo, y si no era yo, ahora sí soy yo, porque ${res === "hiere" ? "el golpe me ha despertado" : "ha parado"}. Es lógico. Es lo único lógico de toda la noche.

Y es lógico. Eso es lo peor. Marcos, con la cara rota, construyendo un argumento. Como en la contrahistoria. Como siempre.

Marcos: No me dejes solo. Si me dejas solo, vuelve. Contigo delante no vuelve. Lo sé. Lo he notado. Contigo delante no puede.

${dest === "nora" ? "Y te mira como te miró el primer domingo, dormido en tu cama con la boca abierta, en la foto del móvil. Con esa cara. Y no sabes si es la cara o es la foto." : "Y te mira como te miró en el sofá de Rubén cuando no te miró. Con esa cara. Y no sabes si es la cara o son los cinco años."}` : `
Irene: ${dest === "alex" ? "Álex. Mírame. Tú sabes cuándo actúo. Lo sabes desde siempre. ¿Estoy actuando?" : dest === "marcos" ? "Marcos. Me conoces desde hace cinco años. Sabes cuándo miento. ¿Estoy mintiendo?" : "Nora. Tú lo apuntas todo. Apunta esto: no he sido yo."}

Lo dice sin la voz de nada. Con la voz de debajo. Y es la voz más verdadera que le has oído en toda la noche, y por eso no te fías, porque Irene sabe exactamente cuál es la voz más verdadera y cuándo usarla.

Irene: Desde la mesa. Desde que no respiraba. Hay algo que se me metió y no sé qué es y me hace cosas. Me hace coger a la gente. Me hace decir «todavía no». ${dest === "alex" ? (api.bandera("irene_paro_alex") ? "Te lo dije en la cama. «Todavía no.» Con los dientes en tu cuello. Y seguiste." : "Lo he dicho delante de ti. Y te reíste. Y tenías que reírte, porque era una broma, y no era una broma.") : "Lo has visto. Me lo has visto hacer."} Y ahora ha parado. Ha parado porque ${res === "hiere" ? "me has hecho daño" : "me has mirado"}, y cuando me miras no puede. ${dest === "alex" ? "Tú eres el único que me mira de verdad. El único. Por eso te quiero, imbécil." : "Contigo delante no puede."}

${dest === "alex" ? "Y te lo da. Lo que quieres oír. Exactamente. Con las palabras que llevas cinco años esperando y que nunca dice. Y lo sabes. Y funciona igual." : "Y te lee. Aunque no pueda. Te lee lo justo para saber qué frase, y la dice."}

Irene: No me dejes sola. Si me dejas sola, vuelve. Contigo no.`;

      const senal = retirado ? "" : `

Y mientras habla, ${fem(h) ? "ella" : "él"} tiene frío. Lo ves: se le ha erizado el brazo, se frota el pecho con la mano libre, como quien se frota una marca. Y no hay marca. Y en la última frase, bajo, casi sin voz, como si fuera parte de la frase:

${N[h]}: ...todavía no.

${N[dest]}: ¿Qué?

${N[h]}: Nada. Que todavía no me creo que haya pasado.`;

      return `${llega}
${suplica}${senal}

~ ${retirado ? "Y a lo mejor es verdad. A lo mejor el golpe lo ha despertado. Tiene la cara puesta. La suya. Y la voz. Y ninguna de las dos cosas me sirve para saberlo." : "Y a lo mejor es verdad. Y a lo mejor «todavía no» es una frase que dice cualquiera. Y a lo mejor no."}

${modo(api, dest, {
  lucido: `~ Sin medidor. Sin prueba. Su cara, su voz, su lógica. Y las tres cosas las tenía también cuando ${res === "muere" ? "apretaba" : "subían las manos"}. Es la decisión más importante de la noche y la tengo que tomar con lo mismo con lo que se toma una en un bar.`,
  asustado: `~ Si le creo y no es ${fem(h) ? "ella" : "él"}, me mata. Si no le creo y es ${fem(h) ? "ella" : "él"}, ${fem(h) ? "la" : "le"} dejo sola con eso. Y no hay tercera.`,
  tenso: "~ Que se calle. Que deje de tener esa cara. Que deje de tener razón.",
  ido: "~ Habla y las palabras llegan un poco tarde. Como si alguien las dijera antes en otra habitación y " + (fem(h) ? "ella" : "él") + " repitiera.",
  perdido: `~ Es ${fem(h) ? "ella" : "él"} hablando por su boca. Con su lógica. Con su cara. Me está pidiendo que ${fem(h) ? "la" : "le"} deje entrar. Y va a entrar.`,
  normal: `~ ${N[h]}. Joder, ${N[h]}. No sé. No sé. No sé.`,
})}`;
    },
    opciones: [
      { texto: "Creerle. Sentarte a su lado. Cogerle la mano.", a: "ix6_dispersion", si: (api) => R().vivo(api, H(api)) && api.bandera("ataque_resultado") !== "mata",
        efecto: (api) => { const h = H(api), d = destinatario(api); api.marcar("suplica_resultado", "cree"); R().contacto(api, d, h, 2); api.rel(d, h, "confianza", 10); if (!api.bandera("huesped_retirado")) R().alimentar(api, 2); api.saber(d, "crei_a_" + h); } },
      { texto: "No creerle. «No te acerques.» Y no soltar lo que tengas en la mano.", a: "ix6_dispersion", si: (api) => R().vivo(api, H(api)) && api.bandera("ataque_resultado") !== "mata",
        efecto: (api) => { const h = H(api), d = destinatario(api); api.marcar("suplica_resultado", "no_cree"); api.rel(h, d, "resentimiento", 8); api.rel(d, h, "confianza", -8); api.est(h, "estres", 8); api.est(d, "eje", 2); } },
      { texto: "Atarle. Con el cinturón. Las manos a la espalda. «Por si acaso. Por ti.»", a: "ix6_dispersion", si: (api) => R().vivo(api, H(api)) && api.bandera("ataque_resultado") !== "mata",
        efecto: (api) => { const h = H(api), d = destinatario(api); api.marcar("suplica_resultado", "atado"); api.marcar("huesped_atado", true); api.rel(h, d, "resentimiento", 6); api.rel(d, h, "afecto", 2); api.est(h, "miedo", 6); R().vivos(api).forEach((p) => { if (p !== h) api.est(p, "estres", -3); }); } },
      { texto: "Encerrarle. En el almacén. Con el cerrojo. Hasta las siete.", a: "ix6_dispersion", si: (api) => R().vivo(api, H(api)) && api.bandera("ataque_resultado") !== "mata",
        efecto: (api) => { const h = H(api), d = destinatario(api); api.marcar("suplica_resultado", "encerrado"); api.marcar("huesped_encerrado", true); api.rel(h, d, "resentimiento", 12); api.est(h, "miedo", 10); api.est(h, "estres", 10); api.est(d, "estres", -4); } },
      { texto: "Seguir. Con el frío dentro. Sin decir nada a nadie.", a: "ix6_dispersion", si: (api) => !R().vivo(api, H(api)) || api.bandera("ataque_resultado") === "mata",
        efecto: (api) => { api.marcar("suplica_resultado", "sin_suplica"); } },
    ],
  },

  ix6_dispersion: {
    pov: "nora",
    titulo: "Nivel tres · La segunda dispersión",
    hora: "06:24",
    alEntrar: (api) => {
      R().tick(api);
      const o = O(api);
      const h = H(api);
      // La necesidad saca a alguien de la luz: el hombre que queda, si no está atado ni encerrado ni marcado ya
      const puede = o && o !== h && R().vivo(api, o) && !api.bandera("segundo_marcado") && !R().marcado(api, o);
      api.marcar("ix6_puede_salir", Boolean(puede));
    },
    texto: (api) => {
      const h = H(api), o = O(api), sr = api.bandera("suplica_resultado");
      const vivos = R().vivos(api);
      const puede = api.bandera("ix6_puede_salir");
      const estadoH = sr === "atado" ? `${N[h]} en la silla, con las manos a la espalda, atad${fem(h) ? "a" : "o"} con ${R().vivo(api, "alex") ? "el cinturón de Álex" : h === "marcos" ? "su propio cinturón" : "el cinturón de Marcos"}. Sin decir nada. Mirando la mesa.` : sr === "encerrado" ? `${N[h]} en el almacén. Con el cerrojo echado por fuera. Se oye, de vez en cuando, un golpe. Una vez. Como un nudillo. Y luego nada.` : sr === "cree" ? `${N[h]} al lado de ${N[destinatario(api)]}. Con la mano cogida. Con la cara puesta. Y frío. Se le ve el frío.` : sr === "no_cree" ? `${N[h]} al otro lado de la mesa. Lejos. Con las manos encima de la madera, a la vista. Y ${N[destinatario(api)]} con ${objeto(api, destinatario(api)) ? R().OBJETOS[objeto(api, destinatario(api))] : "las manos"} sin soltar.` : !R().vivo(api, h) || api.bandera("huesped_anterior") ? `${vivos.length === 2 ? "Dos." : "Tres."} Los que quedan. Y ${N[h]} con frío, frotándose el pecho.` : `${N[h]} en su silla.`;
      const sale = puede ? (o === "alex" ? `
Y Álex se levanta.

Álex: Necesito fumar. En el porche. Debajo de la bombilla. Un minuto.

Nora: Álex.

Álex: Nora. Llevo desde las cuatro sin fumar. Con esto. Con todo esto. Un minuto debajo de la luz.

Y es verdad. Se le ve la verdad: las manos, la mandíbula, el pie que mueve. No es valor. Es necesidad. La casa las tiene todas contadas.

Nora: Con la puerta abierta. Y yo en la puerta.

Álex: Con la puerta abierta.` : `
Y Marcos se levanta.

Marcos: El coche. Si a las siete no arranca, quiero saberlo ahora. Quiero saber si arranca. Quiero saber algo.

Nora: Marcos.

Marcos: Desde el porche. Lo miro desde el porche. Con la luz.

Y es verdad. Se le ve: Marcos necesita un problema con solución, y el coche es el único que queda. No es valor. Es necesidad.

Nora: Con la puerta abierta. Y yo en la puerta.

Marcos: Con la puerta abierta.`) : `
Nadie se levanta. ${o && R().marcado(api, o) ? N[o] + " mira la ventana, como lleva mirándola desde el generador. Ya está fuera aunque esté dentro. Lo sabes." : "Nadie puede. Nadie quiere."} La casa las tiene todas contadas, las necesidades, y esta vez no encuentra ninguna que sirva.`;
      return `
Las seis y veinticuatro. Treinta y seis para las siete. El cielo, por la ventana, gris. Un gris de nada que todavía no es luz.

${estadoH}

${sale}

${puede ? `Y sale. Al porche. La bombilla con sus polillas. La brasa${o === "alex" ? " que se enciende" : " de la linterna"}. Su espalda contra la barandilla. A cuatro metros. Con la puerta abierta y tú en el marco, con las dos manos en el marco, como Irene hace una hora.

Un minuto.

${N[o]}: Nora.

Nora: ¿Qué?

${N[o]}: ${o === "alex" ? "¿Oyes eso?" : "Hay un coche. Abajo. En el camino. Con las luces. ¿Lo ves?"}

Nora: No.

${N[o]}: ${o === "alex" ? "Alguien me ha llamado. Con tu voz." : "Está parado. Me está esperando."}

Y no te ha mirado al decirlo. Mira los pinos. ${o === "alex" ? "Y da un paso. Hacia el escalón." : "Y da un paso. Hacia el escalón."}

Nora: ¡${N[o].toUpperCase()}!

Se para. Con un pie en el primer escalón. Se gira. Te mira. Con su cara. Y levanta la mano, con la palma abierta, como quien dice «un momento».

Y tú ya has visto ese gesto esta noche.` : ""}

${modo(api, "nora", {
  lucido: `~ ${puede ? "Un minuto. La palma abierta. Un momento. Es exactamente lo mismo, y lo sé, y lo estoy viendo otra vez, y no me sirve para las piernas." : "Nadie sale. Es la primera vez en toda la noche que nadie sale. Y la casa lo sabe, y ahora tendrá que hacerlo de otra manera."}`,
  asustado: `~ ${puede ? "El gesto. El mismo gesto. Y yo en la puerta, con las manos en el marco, como Irene." : "No hay nadie que salga. Entonces entra ella. Entra ella a por el segundo."}`,
  tenso: "~ Treinta y seis minutos. Que nadie baje un escalón. Que nadie diga «un minuto». Nadie.",
  ido: "~ El gris de la ventana no es el amanecer. Es otra cosa. Es la casa que se ha quedado sin negro.",
  perdido: `~ ${puede ? "Le llama. Con mi voz esta vez. Ha aprendido la mía." : "Está esperando. En el almacén. Debajo de la mesa. En quien lo lleve. Está esperando a que dé la hora."}`,
  normal: "~ Treinta y seis. Se puede. Con la puerta cerrada. Con todos dentro. Se puede.",
})}`;
    },
    opciones: [
      { texto: "Salir tú también. Al escalón. Cogerle del brazo. Tirar de él hacia dentro.", a: "ix7_aprieta", si: (api) => api.bandera("ix6_puede_salir"),
        efecto: (api) => { const o = O(api); api.marcar("ix6_nora", "tira"); R().contacto(api, "nora", o, 1); api.rel(o, "nora", "afecto", 4); api.est("nora", "miedo", 4); api.marcar("ix6_salio", false); } },
      { texto: "Gritar su nombre. Desde el marco. Sin soltar la puerta.", a: "ix7_aprieta", si: (api) => api.bandera("ix6_puede_salir"),
        efecto: (api) => { const o = O(api); api.marcar("ix6_nora", "grita"); const cruza = api.valor(o, "lucidez") < 50 || api.valor(o, "miedo") >= 55; api.marcar("ix6_salio", cruza); if (cruza) { R().cruzar(api, o); api.marcar("segundo_marcado", o); api.est(o, "lucidez", -4); } } },
      { texto: "Cerrar la puerta. Con llave. Con él fuera. Un minuto es un minuto.", a: "ix7_aprieta", si: (api) => api.bandera("ix6_puede_salir"), impulsiva: true,
        efecto: (api) => { const o = O(api); api.marcar("ix6_nora", "cierra"); api.marcar("ix6_salio", true); R().cruzar(api, o); api.marcar("segundo_marcado", o); api.rel(o, "nora", "resentimiento", 10); api.est("nora", "estres", 8); } },
      { texto: "Quedarte en la mesa. Con las manos en la madera. Contar los minutos.", a: "ix7_aprieta", si: (api) => !api.bandera("ix6_puede_salir"),
        efecto: (api) => { api.marcar("ix6_nora", "mesa"); api.est("nora", "estres", 3); } },
      { texto: "Ir al almacén. Pegar la oreja a la puerta. Escuchar.", a: "ix7_aprieta", si: (api) => !api.bandera("ix6_puede_salir") && api.bandera("huesped_encerrado"),
        efecto: (api) => { api.marcar("ix6_nora", "almacen"); api.est("nora", "miedo", 4); api.saber("nora", "golpes_almacen"); } },
    ],
  },

  ix7_aprieta: {
    pov: (api) => { const o = O(api); const h = H(api); if (R().vivo(api, "irene") && "irene" !== h) return "irene"; if (o && o !== h) return o; return "nora"; },
    fondo: "assets/fondos/cocina_noche.jpg",
    ambiente: "cocina",
    musica: "terror",
    lugar: "cocina", hora: "06:31",
    titulo: "Nivel tres · La casa aprieta",
    alEntrar: (api) => {
      R().tick(api);
      api.marcar("sarten_humo", api.anomalia("sarten_humo"));
      api.marcar("grifo_arriba", api.anomalia("grifo_arriba"));
      api.marcar("arrastre_mesa", api.anomalia("arrastre_mesa"));
      R().vivos(api).forEach((p) => api.presenciar(p, 1.5));
      api.horror(4);
    },
    texto: (api) => {
      const h = H(api), o = O(api);
      const pov = R().vivo(api, "irene") && "irene" !== h ? "irene" : (o && o !== h ? o : "nora");
      const salio = api.bandera("ix6_salio");
      const in6 = api.bandera("ix6_nora");
      const inicio = in6 === "tira" ? `Nora ha salido al escalón. Le ha cogido del brazo a ${N[o]}. Ha tirado. Y ${N[o]} ha vuelto, con la cara de quien despierta, y ha dicho «¿qué?» como si no hubiera pasado nada. Y no ha pasado nada. Está dentro.` : in6 === "grita" ? (salio ? `Nora ha gritado desde el marco. Y ${N[o]} ha bajado a la grava con la mano levantada. Y se ha ido de la luz. Y ha vuelto, dos minutos después, con las zapatillas mojadas y la cara de otro, diciendo «${o === "alex" ? "solo era un cigarro" : "solo era el coche"}».` : `Nora ha gritado desde el marco. Y ${N[o]} se ha quedado en el escalón. Y ha vuelto. Con la cara de quien despierta.`) : in6 === "cierra" ? `Nora ha cerrado la puerta. Con llave. Con ${N[o]} fuera. Un minuto. Y a los tres, ${N[o]} ha llamado, y Nora ha abierto, y ${N[o]} ha entrado con las zapatillas mojadas hasta el cordón y la cara de otro, sin preguntar por qué la llave.` : in6 === "almacen" ? `Nora ha ido al almacén. Ha pegado la oreja. Y ha vuelto con la cara de haber oído algo que no va a decir.` : `Nadie ha salido. Todos en la mesa. Con las manos en la madera.`;
      const sarten = api.bandera("sarten_humo") ? `
Y en la cocina, la sartén.

La de hierro. En el fuego. Con el mando en cero, que lo miró Marcos a las dos, y a las tres y media, y todas las veces.

Humea.

Un hilo de humo gris que sube recto desde el aceite viejo, sin corriente, sin fuego, sin nada. Se ve desde la mesa por el arco. Se huele: a aceite quemado. A cocina de alguien que está cocinando.

${pov === "irene" ? "Irene: La sartén." : pov === "nora" ? "Nora: La sartén." : N[pov] + ": La sartén."}

Nadie va a mirarla. Nadie va a girar el mando del cero al cero.` : `
Y en la cocina, la sartén. En el fuego. Con el mando en cero. Quieta. La miras por el arco. Y la miras tanto que te parece que humea, y no humea, y sigues mirándola.`;
      const grifo = api.bandera("grifo_arriba") ? `
Y arriba, el grifo.

[goteo]

Se oye desde la mesa. El chorro contra la porcelana. El baño de arriba. ${api.bandera("banera_llena") ? "La bañera, que alguien llenó, que se cerró, que está cerrada." : "El grifo que Irene cerró apretando, a las dos" + (api.sabe("marcos", "grifo_corria") ? ", y Marcos oyó a las tres y media" : "") + "."} Corriendo. Con ese ruido que hace el agua cuando lleva rato cayendo.

Nadie sube a cerrarlo.` : "";
      const arrastre = api.bandera("arrastre_mesa") ? `
Y debajo de la mesa.

[arrastre]

Un arrastre.

Bajo. Una vez. Como algo pesado que se mueve un palmo sobre piedra y se para. ${api.bandera("arrastre_almacen") ? (api.sabe("marcos", "arrastre") ? "Marcos lo oyó detrás de la estantería del almacén. " : "") + (api.bandera("alex_oyo_arrastre") ? "Álex también. " : "") : ""}Ahora no está detrás de la estantería. Está debajo. Justo debajo. Debajo de la madera donde tenéis las manos.

Nadie quita las manos de la mesa. Nadie las quita porque quitarlas sería admitir que hay algo debajo que las ha oído.` : "";
      return `
${inicio}

Las seis y treinta y uno. Veintinueve minutos.

${sarten}
${grifo}
${arrastre}

${h === pov ? "" : (api.bandera("huesped_encerrado") ? "Y del almacén, un golpe. Uno. Como un nudillo. Y luego «ya», bajo, con la voz de " + N[h] + ", a nadie." : api.bandera("huesped_atado") ? N[h] + ", atad" + (fem(h) ? "a" : "o") + " en la silla, no mira la sartén, ni el techo, ni la mesa. Mira la puerta. Y sonríe. Un milímetro." : R().vivo(api, h) ? N[h] + " no mira la sartén, ni el techo, ni la mesa. Mira la puerta. Y sonríe. Un milímetro. Como se sonríe a alguien que conoces." : "")}

${modo(api, pov, {
  lucido: "~ La sartén, el grifo, lo de debajo. Todo lo de esta noche a la vez, y en la misma habitación. Ya no reparte. Ya no necesita repartir.",
  asustado: "~ Está debajo. Debajo de la mesa. Debajo de las manos. Y ha esperado a que estuviéramos todos sentados para moverse.",
  tenso: "~ Veintinueve minutos. Veintinueve. Con las manos en la mesa. No mires la sartén. No mires la sartén.",
  ido: "~ El humo de la sartén sube recto y se dobla hacia el arco. Hacia nosotros. Como si oliera.",
  perdido: "~ Ya no se esconde. Ya somos pocos. Cuando se es pocos, se enseña.",
  normal: "~ Veintinueve minutos. Una sartén. Un grifo. Y lo que sea. Se puede. Se tiene que poder.",
})}`;
    },
    opciones: [
      { texto: "Ir a la cocina. Girar el mando del cero al cero. Tirar la sartén al fregadero.", a: "ix8_cierre", si: (api) => api.bandera("sarten_humo"),
        efecto: (api) => { api.marcar("ix7_accion", "sarten"); api.marcar("sarten_tirada", true); } },
      { texto: "Subir a cerrar el grifo. Con alguien. Sin mirar la bañera.", a: "ix8_cierre", si: (api) => api.bandera("grifo_arriba"),
        efecto: (api) => { api.marcar("ix7_accion", "grifo"); R().vivos(api).forEach((p) => api.est(p, "miedo", 3)); } },
      { texto: "Quitar las manos de la mesa. Levantarse. Todos. Al lado de la puerta.", a: "ix8_cierre",
        efecto: (api) => { api.marcar("ix7_accion", "puerta"); R().vivos(api).forEach((p) => api.est(p, "estres", -2)); } },
      { texto: "No moverse. Ni las manos. Que se mueva la casa. Vosotros no.", a: "ix8_cierre", lucida: true,
        efecto: (api) => { api.marcar("ix7_accion", "quietos"); R().vivos(api).forEach((p) => api.est(p, "lucidez", 1)); } },
    ],
  },

  ix8_cierre: {
    pov: "nora",
    fondo: "assets/fondos/salon_gris.jpg",
    ambiente: "interior",
    lugar: "comedor", hora: "06:38",
    titulo: "Nivel tres · Los que quedan",
    alEntrar: (api) => {
      R().tick(api);
      api.marcar("fase9_completa", true);
      const R_ = R();
      R_.vivos(api).forEach((p) => api.est(p, "estres", 3));
      api.marcar("muertes_ix", R_.muertos(api).length);
    },
    texto: (api) => {
      const h = H(api), o = O(api);
      const vivos = R().vivos(api);
      const muertos = R().muertos(api);
      const seg = api.bandera("segundo_marcado");
      const sr = api.bandera("suplica_resultado");
      const acc = api.bandera("ix7_accion");
      const inicio = acc === "sarten" ? "La sartén está en el fregadero. Con el agua encima. El humo se ha ido con un siseo, como se va una cosa que no quería irse." : acc === "grifo" ? "El grifo de arriba está cerrado. Habéis subido dos, sin mirar la bañera, y lo habéis cerrado, y habéis bajado sin mirar la bañera, y la bañera se ha quedado mirándoos." : acc === "puerta" ? "Estáis de pie. Al lado de la puerta. Con las manos fuera de la mesa. Como se espera un tren." : "No os habéis movido. Ni las manos. Y la casa se ha movido alrededor: el humo, el agua, lo de abajo. Y luego se ha parado. Como quien espera su turno.";
      return `
${inicio}

Las seis y treinta y ocho. Veintidós minutos para las siete.

${vivos.length === 3 ? "Tres." : "Dos."} ${vivos.map((p) => N[p]).join(", ")}. ${muertos.map((p) => { const m = api.bandera("muerte_" + p) || {}; return N[p] + (m.como === "amigo" ? ", arriba, en el suelo" : m.como === "huesped" ? (api.bandera("cuerpo_" + p) === "banera_fuera" ? ", en el suelo del baño, mojad" + (fem(p) ? "a" : "o") : ", en la bañera") : m.como === "coche" ? ", en el coche" : ", en la zanja"); }).join(". ")}.

${R().vivo(api, h) ? (sr === "encerrado" ? N[h] + " en el almacén. Con el cerrojo. Ya no golpea." : sr === "atado" ? N[h] + " en la silla, atad" + (fem(h) ? "a" : "o") + ". Con la cabeza baja. Con frío." : N[h] + (sr === "cree" ? " al lado de quien le ha creído. Con la mano cogida. Con frío." : " al otro lado de la mesa. Con las manos a la vista. Con frío.")) : ""}

${seg ? N[seg] + " con la mirada en la ventana. Con las zapatillas mojadas. Con la cara del que se ha ido aunque esté sentado." : ""}

${api.bandera("huesped_anterior") && H(api) !== api.bandera("huesped_anterior") ? (H(api) === "nora" ? "Y tú con frío. Debajo del esternón. Como un hielo que no se termina de deshacer. No se lo has dicho a nadie. No hay a quién." : N[H(api)] + " con frío. Frotándose el pecho. Como quien se frota una marca. Y no hay marca.") : ""}

Escribes. Con la mano que queda. Debajo de todo lo demás:

06:38. ${muertos.length === 2 ? "Dos." : "Uno."} ${api.bandera("ataque_resultado") === "mata" ? N[api.bandera("huesped_anterior") || h] + ". Arriba. Lo hice yo. O lo hizo " + N[V(api)] + "." : api.bandera("ataque_resultado") === "muere" ? N[V(api)] + ". La bañera. " + N[h] + " con las manos mojadas." : api.bandera("ataque_resultado") === "todavia" ? N[h] + ". La cocina. Mi mano. «Todavía no.»" : api.bandera("ataque_resultado") === "hiere" ? N[h] + ". Le abrieron la cabeza. Se despertó. O no." : api.bandera("ataque_resultado") === "huye" ? N[h] + ". El baño. " + N[V(api)] + " salió corriendo." : N[h] + ". Paró. Cerró por fuera."} ${api.bandera("sarten_humo") ? "La sartén humea sola." : ""} ${api.bandera("arrastre_mesa") ? "Lo de abajo está debajo de la mesa." : ""} Quedamos ${vivos.length}.

Y lo cierras.

${modo(api, "nora", {
  lucido: `~ Veintidós minutos. ${vivos.length === 3 ? "Tres personas" : "Dos personas"}. Una casa que ya no reparte. ${R().vivo(api, h) ? "Y " + N[h] + ", que es " + N[h] + " o no lo es, y no hay manera de saberlo salvo esperar a que lo demuestre." : "Y el frío, que ha cambiado de sitio."}`,
  asustado: "~ Uno, dos. Y tres. La voz contaba hasta tres. Y luego paraba. Y yo no estaba en el tres. Yo estaba después.",
  tenso: "~ Veintidós. Se puede. Con la puerta cerrada. Con las manos donde se vean. Se puede.",
  ido: "~ El gris de la ventana no cambia. Lleva media hora sin cambiar. Como si el amanecer se hubiera parado a esperar.",
  perdido: "~ Lo de abajo está debajo de la mesa. Lo de arriba está en la bañera. Y lo de dentro está sentado con nosotros. Y las siete no van a llegar.",
  normal: "~ Veintidós minutos. Y luego luz. Y luego el camino. Y luego nadie va a creerse nada de esto. Bien.",
})}

...`;
    },
    opciones: [{ texto: "Continuar", a: "x1_hostil" }],
  },

  });
})();
