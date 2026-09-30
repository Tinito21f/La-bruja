# LA BRUJA — Biblia consolidada del prólogo

Documento de análisis. Fusiona todos los bloques de diseño aportados por el autor
(27-09-2026), resuelve las contradicciones entre versiones y marca las decisiones
abiertas. Es la referencia única para escribir `js/story.js`.

Cuando dos bloques chocan, **manda la versión posterior** (la Propuesta Maestra v0.9),
salvo que el autor indique lo contrario.

**Actualización del 29-09-2026.** Las secciones 14 a 26 recogen las reglas fijas
acordadas con el autor para las fases VI a XII (el límite de la luz, las voces, las dos
criaturas, el huésped con sus tres niveles y el aliento, las heridas, la escala de
violencia, el reloj de las condenas, las muertes por personaje y las ocho mecánicas de
escritura). Cuando choquen con algo anterior, **mandan ellas**. La sección 5 describe
cada fase con el detalle suficiente para escribirla; la 25 fija el presupuesto y el orden.

---

## 0. Las dos normas de cabecera

> Nada terrible ocurre porque el jugador haya pulsado un botón. Ocurre porque lleva
> tiempo adentrándose en una situación cuyo peligro todavía no comprende.

> Primero hacemos que el jugador mire. Después que dude. Después que tema volver a
> mirar. Y solo entonces le enseñamos lo que había allí.

---

## 1. Qué es el prólogo

- Cuatro jóvenes, dos parejas (Nora–Marcos, Álex–Irene), una noche en una cabaña
  levantada sobre el lugar donde quemaron a "la bruja".
- POV coral: el jugador **controla escenas, no personajes**. La narración decide
  quién es el punto de vista. Solo aparece elección de perspectiva cuando dos
  escenas simultáneas tienen peso real.
- **Libertad local, destino global cerrado.** Las decisiones cambian relaciones,
  percepciones, información, orden, quién presencia qué, cómo muere cada uno y qué
  evidencia queda. No cambian la tragedia.
- Los tres muertos son Álex, Marcos e Irene, en orden variable. **Nora nunca ocupa
  el primer hueco de muerte y siempre es el último POV.** Su final es
  NORA_DEAD o NORA_UNKNOWN (retcon aprobado en la Propuesta Maestra).
- Termina en negro → «DIEZ AÑOS DESPUÉS» → Agus contando la historia a Danna.
- El prólogo es un engaño: parece un coral tipo Until Dawn hasta que mueren todos.
- Trata sobre **cuánto consiguen comprender antes de desaparecer y qué dejan detrás**.

---

## 2. Personajes (fichas visuales en `assets/personajes/fichas/`)

### Nora — La creyente
- Rasgos: curiosa, lúcida, irónica, observadora. Intereses: folklore, leyendas,
  brujería, fenómenos. Lema: «Quería pruebas. No esto.» / «A veces las leyendas
  también te encuentran.»
- La nueva del grupo. Pareja de Marcos. No toma setas. Lleva péndulo, cuaderno,
  ouija, velas.
- Eje propio: **FASCINACIÓN**. Lo sobrenatural la recompensa emocionalmente hasta
  que un evento grave rompe la fascinación (FASCINATION_BREAK) y pasa de «Otra
  vez» a «Se acabó».
- Motor: conectar acontecimientos, formular teorías (NORA_THEORIES, algunas
  falsas), anotar. Su cuaderno sobrevive diez años.
- Evolución: fascinación → inquietud → comprensión → terror.
- Condena: flashes del pasado (gente entre los árboles, fuego), nunca voces de amigos.

### Marcos — El racional
- Rasgos: racional, pragmático, cínico, sarcástico, protector. Meta-humor sobre
  clichés del terror. Esconde el miedo bajo lógica y chistes. Amigo de Álex e
  Irene desde la facultad. Lema: «Si me ves muy tranquilo, desconfía.» /
  «Cuando deja de hacer chistes, corre.»
- Eje propio: **CONTROL**. Resolver un problema sube; no poder explicarlo baja.
  Cuanto menos control, más sarcasmo, más irritabilidad, más necesidad de actuar.
- Puede tomar setas (decisión D5). Si las toma: percepciones únicas, nadie le
  cree, él tampoco se cree.
- Su gran contradicción: no cree, pero le aterra equivocarse.
- Condena: la solución racional. El coche que siempre vuelve a la cabaña, la
  figura de Nora en la carretera, impacto, negro.

### Álex — El provocador
- Rasgos: fogoso, vacilón, narcisista, provocador. Intereses: fiesta, alcohol,
  drogas, grabaciones. Lema: «Si algo va a salir mal, al menos que sea divertido.»
  / «Juega con todo. Hasta que algo juega con él.»
- Carisma real: divertido media hora, luego «este tío es gilipollas». Sin filtro.
  Piropea a Nora sin tacto. Trae las setas. Graba todo y habla a cámara. Odia que
  le digan que no haga algo.
- Eje propio: **EGO**. Puede pesar más que el miedo («no tienes huevos» → sube).
- Con miedo se vuelve agresivo y desafiante: golpea, insulta, provoca.
- Saboteador natural de la ouija.
- Condena: algo aprende su juego y se lo devuelve. Golpes que se adelantan, su
  propia voz repitiendo frases de la fiesta, la voz de Irene pidiendo ayuda, y al
  final «Venga. Si estás ahí, sal.» detrás de él.

### Irene — La insinuante
- Rasgos: sutil, seductora, celosa, manipuladora. Intereses: atención, fiesta,
  deseo, juegos sociales. Lema: «No hace falta empujar demasiado. La gente cae
  sola.» / «Nunca compite de frente. Se acerca, sonríe… y desplaza.»
- Amiga de Marcos desde la facultad. Siempre sintió algo por él, nunca pasó nada.
  Ve a Nora como intrusa. Ataca con ambigüedad: anécdotas que excluyen, «¿te
  acuerdas de cuando…?», contacto excesivo. Puede tirar ficha a Marcos a solas.
- La que mejor lee a la gente. Sabe cuándo Álex actúa y cuándo tiene miedo.
- Eje propio: **CELOS / CONTROL SOCIAL**. Medidor oculto adicional: confianza en
  la realidad (su capacidad de reconocer a los demás).
- Con miedo pierde la máscara: llora, suplica, miente, puede abandonar a alguien.
  Busca a Marcos como refugio (y aprovecha para separarlo de Nora).
- Evolución: diversión → sospecha → desconfianza → aislamiento → terror.
- Condena: social, luego el baño de arriba. La bañera que se llena de un color
  imposible, la voz de Álex tras la puerta que pasa a estar arriba, la mujer del
  camisón en el techo. Su cuerpo aparece en la bañera cuando el agua ya no está.

### Dinámicas
- **Nora–Marcos: relación sana y madura por defecto** (pauta del autor, 28-09-2026).
  Se hablan con cariño, se buscan la mano, se creen, no se reprochan delante de los
  demás y resuelven a solas. Solo las decisiones del jugador (frialdad tras el beso,
  confianza rota, resentimiento acumulado) o el huésped la enfrían, y entonces se nota
  precisamente porque el resto del tiempo no es así. Los pensamientos «tensos» de Nora
  apuntan a Álex o a Irene antes que a Marcos.
- Álex–Irene: muy físicos y sexuales en público, compatibles siendo horribles. El
  contacto pasa de sexual a protección (mano bajo la falda → mano entrelazada →
  Irene agarrándole con las dos manos).
- Marcos + Álex + Irene son «los de antes». Nora entra en un grupo con historia.
- Álex sabe lo de Irene y Marcos y le da igual… hasta que Marcos responda.
- La intoxicación amplifica, no crea. Humanizar sin absolver.

---

## 3. La cabaña

| Espacio | Normalidad | Primer terror | Escalada | Pago |
|---|---|---|---|---|
| Comedor (mesa redonda) | fiesta | péndulo | ouija | grabación |
| Cocina | bebidas | sartén templada | placa encendida | sartén humeando sola |
| Salón | descanso | objetos/música | voces/figuras | reagrupamientos |
| Baño inferior | cotidiano | sonidos | refugio inseguro | evidencia menor |
| Dormitorio 1 | intimidad (Álex–Irene) | golpes en armario | imitación | relaciones |
| Dormitorio 2 | pertenencias | objeto desplazado | identidad dudosa | pistas |
| Baño superior | cotidiano | goteo | agua turbia/oscura | Irene / mujer del techo |
| Pasillo/distribuidor | tránsito | pasos | dobles/voces | orientación |
| Buhardilla | trampilla, cuerda, escalera plegable | roces, cuerda que desaparece | cajas, polvo, viga antigua | historia arquitectónica |
| Almacén (planta baja) | irrelevante | estantería ante puerta antigua | acceso | sótano |
| Sótano | inaccesible hasta el final | — | piedra, madera quemada, inscripción | Nora / lore |
| Porche | fumar (seguro) | observación | voces exteriores | falsa seguridad |
| Cobertizo (15 m) | generador | golpes | ruta Marcos | condena |
| Coche | transporte | luces interiores | salida | ruta exterior |
| Bosque | paisaje | sonidos | imitación, desorientación | condena |

Tres zonas: INTERIOR → PORCHE (seguro) → TERRENO (cruzar = DOOMED).
La casa se aprende primero como espacio pequeño y normal; después se desconfía de ella.
Anomalía espacial: **una sola** en todo el prólogo (HORROR 5), nunca se repite.

---

## 4. Sistema

### Estados globales (ocultos)
`HORROR_STAGE` (0–6, **nunca baja**), `HOUSE_ACTIVITY`, `GROUP_COHESION`,
`GROUP_SUPERNATURAL_CREDIBILITY`, `DEATHS`, `OUIJA_STATE`, `TIME_STAGE`.

| HORROR_STAGE | Permitido |
|---|---|
| 0 | detalles totalmente explicables (toda la Fase I) |
| 1 | coincidencias / ouija ambigua |
| 2 | percepciones privadas contradictorias (tras la ouija) |
| 3 | evidencia multitestigo (tras el evento imposible) |
| 4 | amenaza / primera muerte confirmada |
| 5 | casa hostil / aparición clara |
| 6 | colapso / Nora / sótano |

### Estados por personaje
Visibles (y no siempre): **Miedo, Estrés, Lucidez, Intoxicación**.
Ocultos: Paranoia, eje propio (Fascinación / Control / Ego / Celos), DOOMED,
profundidad de ruta por espacio (`DEPTH 0–4`), credibilidad contextual,
`KNOWLEDGE[personaje][hecho]`.

### Relaciones (ocultas, por pareja)
confianza, afecto, resentimiento, tensión sexual, protección, celos.
Nunca números en pantalla: se ven en quién cree, acompaña, arriesga, se enfada.

### Tipos de decisión (el jugador nunca ve la etiqueta)
MICRO (2–4 s, personalidad) · SOCIAL (relaciones) · EXPLORACIÓN (información) ·
POV (qué escena presencia) · CRÍTICA (irreversible).

### Fenómenos
- Presupuesto de anomalías por fase (Fase I: máx. 3 de una biblioteca de 10–12).
- Clasificación por testigos: PRIVATE → MULTI_WITNESS → CONTRADICTED → RECORDED.
- Semillas obligatorias: GIRL_APPEARANCE requiere 2 de {CHILD_VOICE,
  SMALL_FOOTPRINTS, CHILD_OBJECT, SHADOW_SMALL, OUIJA_CHILD_REFERENCE}.
  WOMAN_APPEARANCE requiere ruidos en techo, arañazos, polvo cayendo, miradas
  arriba. Bañera: goteo → agua → color → otra cosa. Sartén: templada → placa → humo.
- Niveles de lore 0–3; **máximo nivel 1 en el prólogo**.
- Hipótesis (no canon): la entidad aprende las voces con las horas.

### Condena
Cruzar el terreno activa `DOOMED` sin aviso. Se puede volver a entrar.
DOOMED → contaminación → presión de aislamiento → señuelo → falsa salida →
amenaza → muerte. 10–20 minutos. Quince pasos mínimos de una ruta mortal; no se
puede saltar del 3 al 14. La muerte no se anuncia: negro y cambio de POV.
La ausencia precede a la certeza.

### Resolución automática del personaje no controlado
personalidad + estado psicológico + relaciones + información conocida + posición
+ flags + contexto de escena. Nunca congelado, nunca aleatorio.

---

## 5. Estructura (grafo definitivo)

```
FIESTA → DESINHIBICIÓN → MICROANOMALÍAS → LEYENDA ÁLEX → CONTRAHISTORIA NORA
→ OUIJA → PRIMERA DISPERSIÓN (rutas A/B) → REAGRUPAMIENTO → EVIDENCIA COMPARTIDA
→ RUPTURA / APAGÓN → PRIMER CRUCE DEL LÍMITE → DOOM_1 → FALSO ALIVIO
→ PRIMERA DESAPARICIÓN → BÚSQUEDA → PRIMERA MUERTE CONFIRMADA → HORROR 4
→ GRABACIONES / RECONSTRUCCIÓN → SEGUNDA DISPERSIÓN FORZADA → MUERTE 2
→ CASA HOSTIL → ANOMALÍA ESPACIAL → MUERTE 3 → NORA ÚNICO POV → REGLA INTUIDA
→ OUIJA: ABAJO → SÓTANO → NORA_DEAD / NORA_UNKNOWN → MESA VACÍA → NEGRO
→ DIEZ AÑOS DESPUÉS
```

Cada fase destruye una seguridad: estamos entre amigos → conocemos la historia →
controlamos el juego → sabemos dónde están los demás → podemos confiar en nuestros
sentidos → podemos salir → podemos sobrevivir.

### Fase I — Desinhibición (20–30 min, HORROR 0)
Apertura in medias res. Bloques A–M, decisiones D1–D18. Rotación de POV
Marcos → Nora → Álex → Irene. Primera elección real de perspectiva en D10.
Decisiones sistémicas: D5 setas de Marcos, D11A buhardilla de Irene, D11B sartén,
D14 símbolo de la mesa (foto/nota/nada), D16 responder a los golpes, D18 música.
Converge en «Vale. Yo tengo una historia.»

### Fase II — Leyenda de Álex
Texto definitivo: el monólogo completo aportado por el autor (campanilla, siete
ofrendas, niña construida, «Él también le tiene miedo», pactos que se cobran en
quien más quieres, «La puerta deja de dejarte salir»). Microdecisiones de
reacción sin cortar el relato. Pequeños fenómenos integrados en la broma.

### Fase III — Contrahistoria de Nora (< 2 min)
La mujer existió, ayudaba, fue denunciada, Inquisición, tenía una hija, las
atrocidades aparecen mucho después. Álex: «Pregúntaselo. A ella.» → «Entonces no
puede pasar nada.»

### Fase IV — Ouija (HORROR 1 → 2) · `js/story_fase4.js` (reescrita 28-09-2026)
Trece escenas en una sola cadena con POV dinámico. Al montar la mesa el jugador elige
carta (Nora / Marcos / Irene; Álex no es elegible porque lleva el vaso) y esa carta
decide **qué información privada posee el jugador**, no qué ocurre. Ocurre lo mismo
siempre:

1. Preparación con la mesa llena del caos de la fiesta. Álex e Irene improvisan una
   broma: Irene afloja la bombilla de la lámpara colgante y prueba golpes con el talón
   desnudo contra el travesaño mientras Álex distrae a Nora con el péndulo. Solo POV
   Irene lo ve; Marcos puede fijarse en la silla sin entender nada.
2. Álex mueve el vaso a ADIÓS antes de empezar; Nora se mosquea de verdad; Álex baja el
   tono («Palabra. De médium.»).
3. Respuestas falsas de Álex, que es el único que toca el vaso: SÍ (pregunta Irene), NO
   (¿te cae bien Álex?), IRENE (¿con quién de esta mesa quieres hablar?). Golpes de
   Irene. Nora, si no entra al trapo de «estoy sintiendo una energía», ve dos llamas
   inclinarse a la vez (anomalía privada `llama_velas`). No existe la opción «mirar la
   vela»: la decisión es social.
4. Al escribirse IRENE, Irene deja de respirar de verdad. CONTACTO. Álex cree que actúa
   (si ella le hace una señal, le guiña un ojo). Se levanta, golpea la mesa, las velas se
   apagan, la bombilla parpadea y muere. Todo tiene explicación menos el ahogo, y eso
   solo lo sabe Irene.
5. Marcos reacciona a oscuras: persona / lámpara / cocina (POV Marcos elige; si no,
   `decidirMarcos`: afecto y protección hacia Irene contra su necesidad de control, con
   las setas restando y la mirada de Irene sumando). Si Irene se viene abajo y él le hace
   la respiración, siente una corriente helada en dirección contraria: HUÉSPED = Marcos.
   Ocurre la llevemos o no; solo en su POV lo lee el jugador. Si no, HUÉSPED = Irene y
   respira sola.
6. Se descubre la broma: Marcos con la bombilla floja, o Nora pillando a Álex arreglándola
   demasiado rápido («¿Cómo sabías que era la bombilla?»). «Sois unos gilipollas.» Álex
   cobra el «yo nunca» de Nora («Estamos en paz»). Si hubo golpes reales en Fase I,
   Marcos puede preguntar por los de la pared: «Esos no» es la única frase honesta de
   Irene y nadie la cree. Irene miente («me he metido demasiado en el papel») o dice la
   verdad una vez; la cree, como mucho, Marcos si sintió el frío. Todos reinterpretan el
   ahogo como teatro. La tensión cae: es la anestesia antes de ALDA.
7. Si Marcos la rescató, Irene le besa («Mi héroe»): convierte su miedo en poder social.
   Nora tiene tres posiciones reales (reproche a Irene / broma / frialdad con Marcos) y
   una cuarta lúcida (callarse). Sin POV Nora, `decidirNora` usa confianza en Marcos,
   resentimiento con Irene, alcohol y estrés; el silencio es una reacción posible y pesa.
   El texto reconoce si ya hubo boca de Irene en Marcos esta noche.
8. Irene se queda o se va con frases, no con etiquetas («Estoy bien. Seguid.» / «Voy a por
   una cerveza.» / «Necesito mear.»). Sin POV Irene, `decidirIrene`: si la sostuvieron se
   queda; si nadie la tocó se va, al baño si no tiene la máscara puesta.
9. Sesión seria con Nora al mando y Álex moviendo: SÍ («Estoy moviéndolo. No estoy...
   eligiendo.»), ALDA (Nora la reconoce y lo oculta; a Álex le cambia la cara y Nora lo
   ve), AJOBA (las letras de ABAJO desordenadas; Irene lee «alcoba, le falta una ele»;
   Nora lo anota tal cual con jota), nada, nada. La sesión no es Google. Si Irene subió
   al baño, oye su nombre en el pasillo (`voz_nombre`) y puede grabarse un vídeo.
10. Vuelta al tono ocioso: Álex pone música, «Se acabó el velatorio», cervezas, «Hasbro
    satánico», Álex a cámara con el móvil de Irene. Marcos: «Efecto ideomotor. Lo digo
    para que conste.» Señal mínima del huésped desde fuera (manos heladas de Marcos /
    Irene tragando con la mano en el cuello). El vaso unos centímetros más lejos
    (`vaso_final`). HORROR 2.

Ningún vaso se mueve solo en cámara durante la sesión. Lo que la hace real para Nora es
ALDA. Álex es el único que sabe con certeza que no eligió ALDA ni AJOBA, y nadie le cree.
Lo que Nora explica del ritual sigue siendo creencia suya, no regla del mundo.

### Fase V — Primera dispersión (HORROR 2) · `js/story_fase5.js` (escrita 28-09-2026)
Nadie explora. A las 03:30 se dispersan por necesidades: Álex sale a fumar y le ofrece
un porro a Nora (Nora no fuma tabaco); Irene sube a por una sudadera; Marcos va al
cuadro de luces; Nora quiere ver la cuerda de la trampilla. **La configuración sale del
estado, no de un menú**, y las parejas no solo caben: son donde se planta el huésped.

- **Decisión de Nora** (única decisión previa): salir con Álex, subir sola, o pedirle a
  Marcos que suba con ella (solo si confía en él o tiene miedo alto).
- **Reparto** (`repartir`): Marcos acepta subir con Nora salvo que ella le dejara helado
  con el beso. Irene pide compañía a Marcos si oyó su nombre en la ouija, tiene miedo
  o hay tensión con él; Marcos acepta si la aprecia o la rescató. Si Irene es la
  huésped no pide nada y sube callada, pero Marcos puede seguirla porque la ha visto
  rara. Configuraciones resultantes: 2+1+1 lo normal, 2+2 (Álex+Nora / Irene+Marcos) la
  cargada, 1+1+1+1 cuando las relaciones están bien y nadie tiene miedo.
- **Dos cartas** (máximo dos rutas jugadas): el grupo de Nora y el grupo de la huésped
  (si la huésped va con Nora: Irene, o Álex si Irene no oyó nada). Las rutas no seguidas
  se resuelven con `resolverRuta(api, ruta, false)` con las mismas banderas.
- **Rutas y percepción privada (una por ruta, nunca compartida):**
  - Porche (Álex, ± Nora): golpes en la barandilla que se adelantan a su mano; la luz
    interior del coche de Marcos se enciende sola; Álex oye a Irene decir su nombre
    desde los árboles (Irene está arriba); puede bajar hasta el último escalón y hasta
    poner un pie en la grava sin cruzar (`alex_piso_grava`, semilla de la Fase VII).
    Nora, si va, ve un segundo a gente de pie entre los troncos mirando la casa y huele
    a leña y a pelo (su lenguaje de condena; nunca voces).
  - Arriba (Irene, ± Marcos): un golpe dentro del armario del dormitorio; el olor
    dulce; una marca a la altura de la cadera en el fondo del armario; el agua que
    suena y no corre; la voz de Álex pegada a la puerta del baño (Álex está fuera).
    En pareja, quien se queda en el pasillo oye el grifo y quien entra lo ve seco.
  - Almacén (Marcos solo): el piloto rojo de la placa encendido con el mando en cero;
    el diferencial saltado; la única pared de piedra de la casa detrás de la
    estantería, con aire frío por la rendija; un arrastre con peso detrás. Si aparta la
    estantería: la puerta antigua, baja, con candado. No se abre. Es el sótano de la
    Fase XII, que ahora existe mucho antes de que Nora lo necesite.
  - Buhardilla (Nora, ± Marcos): la viga vieja, quemada, con seis rayas iguales y una
    séptima más nueva; huellas pequeñas y descalzas en el polvo que van hasta la pared
    caliente de la chimenea y no vuelven; una muñeca de trapo con los párpados cosidos y
    algo duro dentro que no suena (si Nora la abre: una campanilla sin badajo). La
    trampilla se cierra con ella dentro; sola, al bajar, la cuerda ha desaparecido.
- **El huésped a nivel 1.** Un pensamiento que no es suyo («Abajo.» en Marcos frente a
  la estantería, que es AJOBA cobrándose; «Aliento.» en el pasillo o en el baño: una
  de las siete ofrendas de la leyenda). Un lapso: no contesta a su nombre, no recuerda
  haber movido la estantería o cogido una muñeca. Y **si va acompañado y su estado o la
  relación lo cargan** (`danoMarcosA`, `danoIreneAMarcos`): Marcos sujeta el brazo de
  Irene o el tobillo de Nora en la escalera diciendo «Todavía no» (su firma; conecta
  con «la puerta deja de dejarte salir»); Irene sostiene la mano de Marcos bajo el agua
  hirviendo. Quedan marcas como evidencia y el huésped no se acuerda. Desde fuera:
  Marcos no hace chistes; Irene deja de leer a la gente.
- **Reagrupamiento** (`v9_regreso`, POV Nora): cada uno decide en su ruta si lo cuenta.
  Álex lo cuenta todo; Irene no cuenta nunca salvo que no pueda más; Marcos cuenta los
  hechos (diferencial, puerta) y calla lo que oyó; Nora cuenta o apunta. Que les crean
  lo decide `api.contar` (credibilidad + confianza). Contradicción central: Álex oyó a
  Irene fuera e Irene oyó a Álex arriba, al mismo tiempo, cada uno donde no estaba el
  otro. La muñeca, si Nora la baja, es el primer objeto que ven los cuatro. Las marcas
  se ven y nadie sabe explicarlas, tampoco quien las hizo. Cierra con el techo encima
  de la mesa, «algo que todavía no ha empezado a andar»: los pasos de la Fase VI.
- Sin niña, sin mujer. Semillas dejadas: huellas pequeñas y objeto de niña (dos de las
  cinco que exige GIRL_APPEARANCE), arañazos bajo el suelo, mirada al techo.

### Fase V — Retoque (29-09-2026, aplicado): el eje de Nora y los que se quedan · +5 escenas (`vb4_irene_nora`, `vq1_dormitorio`, `vq2_almacen_dos`, `vq3_porche_reto`, `vq4_cruce`)
La fase escrita se mantiene. Se rehace el reparto y se añaden unas seis escenas.

- **Nora decide con quién sube, no si sube.** `v1_necesidades` pasa a cuatro salidas con
  un pensamiento previo que las justifica desde ella: con Marcos («si hay algo arriba
  quiero su mano en la escalera»), con Irene («llevo toda la noche sin hablar con ella a
  solas y arriba no hay nadie que nos oiga»), sola («que es como se miran las cosas de
  verdad»), o el porche con Álex si acepta el porro (no le apetece; es la única vez en toda
  la noche que va a tener al amigo de Marcos sin Marcos ni Irene delante: acepta por
  información). `v1_nora = "marcos" | "irene" | "sola" | "alex"`.
- **Los dos que quedan siembran, nunca esperan** (`v_quedan`):
  - Nora con Marcos → quedan **Irene y Álex** (`v_quedan = "irene_alex"`). Se van al
    dormitorio o al baño de abajo a lo suyo y ahí entra la casa: el armario golpea con ellos
    dentro, o el agua de la bañera. Si Irene es la huésped, para en seco a mitad y dice
    «Todavía no»; Álex se lo toma como un juego. Es la escena más inquietante de la fase y
    no tiene ni una gota de sobrenatural visible.
  - Nora con Irene → quedan **Álex y Marcos** (`v_quedan = "alex_marcos"`). Álex arrastra a
    Marcos al almacén a abrir el candado con la caja de herramientas; no pueden; oyen el
    arrastre los dos (primera percepción compartida, solo entre dos, y Álex es el testigo
    que nadie cree). O salen al porche a ver la luz del coche y Álex le reta a ir: Marcos
    llega al último escalón y no baja, igual que Álex. Aquí cabe el **cruce real** (§21):
    si el jugador insiste dos veces, Álex o Marcos pisan la grava más allá de la luz
    (`alex_cruzo` / `marcos_cruzo`) y su reloj arranca.
  - Nora sola o con Álex → reparto actual.
- **Irene y Nora en la buhardilla** (tres versiones por estado): la conversación pendiente
  (la camisa, Marcos, «la nueva»); la alianza inesperada si las dos han visto cosas que
  los chicos no creen (`nora_vio_llama` o `alda_visto`, y `ahogo_real`); o el peligro si
  Irene es la huésped, cargada, a solas en el sitio de las huellas que no vuelven
  (`danoIreneANora`: marca en la muñeca de Nora, evidencia `marca_muneca_nora`). Nunca han
  estado a solas en todo el juego: por eso pesa. `irene_nora = "conversacion" | "alianza" |
  "peligro"`. Opcional: un roce de dos frases en la puerta del baño en la V cuando Nora
  sube al pasillo y oye a Irene dentro, sin decisión, que deje preparada la buhardilla.
- **El porche de Álex y Nora** se reescribe dentro de las escenas que existen. La entrada
  con el pensamiento de Nora. El tanteo de Álex tiene dos capas: la de siempre (el piropo,
  «tú no eres una lámpara») y la que él no controla, que es que le gusta hablar de «los de
  antes» porque es donde se siente dueño de Marcos. Las opciones de Nora son **cómo
  pregunta**, no qué: con paciencia (le deja hablar y se entera de más), con asertividad
  (le corta el piropo y pregunta directo: lo justo, y gana respeto), con manipulación (le
  sigue el juego y saca más, y Álex lo nota después). `nora_pregunta`. Tres o cuatro
  golpes, no más; cada uno mueve la relación Álex–Nora y deja un conocimiento nuevo del
  Marcos de antes: Rubén, el sofá, la noche que Irene se fue a las siete y media, o qué
  fue Marcos antes de ser el racional (`saber("nora", "marcos_pasado_*")`). Una sola
  pregunta posible sobre Irene («¿Y a Irene qué le pasa conmigo?»), contestada con una
  verdad envuelta en broma. Álex decide una vez desde su POV, en el coche: seguir tanteando
  o dejarla en paz cuando ve que va en serio (`alex_tanteo`). Salidas: conflicto (Nora
  entra sola y Álex se queda fuera con el coche encendido), acercamiento (entran juntos y
  Álex le dice algo de Marcos que no ha dicho a nadie), comprensión sin cariño (se
  entienden y siguen sin gustarse). `salida_porche`. Desembocan igual en el
  reagrupamiento; cambia con qué llega Nora a la mesa y cómo mira a Marcos. La luz del
  coche corta la conversación: a partir de ahí no hay tiempo para hablar. El juego se
  acelera desde aquí: fricción y suspense, nunca charla que frene.
- **Cartas**: siguen siendo dos rutas jugadas como máximo. La segunda carta es el grupo de
  la huésped; si la huésped va con Nora, el grupo de los que quedan.
- Nombres orientativos de escenas nuevas: `vq1_dormitorio` (Irene y Álex),
  `vq2_almacen_dos` y `vq3_porche_reto` (Álex y Marcos), `vb4_irene_nora` (buhardilla).

### Fase V — Reestructura en dos tramos (30-09-2026, aplicada) · +4 escenas (`vn1_mesa`, `v5_cuerda`, `v6_reparto2`, `vq1_dormitorio` reescrita)
La V se juega en dos tramos, porque la subida a la buhardilla vuelve en la VI y el porche
con Álex tenía que ir antes, no en lugar de subir.

- **Tramo 1 (03:30–03:40, necesidades).** Álex al porche con el porro; Irene arriba (con
  Marcos si se lo pide o si él la sigue); Marcos al cuadro de luces si queda libre. Nora
  decide solo dos cosas: salir al porche con Álex (`v_nora_porche`) o quedarse en la mesa
  con la tabla (`vn1_mesa`: la casa sonando alrededor, el cuaderno, la cuerda quieta).
  Segunda carta: el grupo de la huésped. Todas las rutas del tramo 1 terminan en
  `v5_cuerda`.
- **Tramo 2 (03:42–04:00, la cuerda).** Todos de vuelta a la mesa; nadie cuenta nada
  todavía; la cuerda de la trampilla se mueve (corriente, claro). Nora decide con quién
  sube (`v2_nora`: sola, Marcos si confía o tiene miedo, Irene) y `v6_reparto2` reparte a
  los que quedan: Nora con Marcos → Irene y Álex al dormitorio; Nora con Irene → Álex sigue
  a Marcos al almacén (segunda visita si ya estuvo: `segunda`) y al porche; Nora sola → los
  tres en la mesa. `v_nora_con` guarda con quién subió (lo leen VI, VII, IX, XI).
- **El dormitorio (`vq1_dormitorio`).** Irene y Álex en mitad del acto, ella debajo. Sin el
  huésped (POV Irene): por encima del hombro de Álex, el armario que estaba cerrado, abierto
  un palmo, y dentro, a la altura de una niña, algo blanco que se mueve (`irene_vio_sombra`,
  semilla SHADOW_SMALL dentro del presupuesto); el toc; Irene decide (parar, seguir con los
  ojos cerrados, abrir el armario ella, hacérselo mirar a él). Con Irene huésped (POV Álex):
  las uñas entran en la espalda hasta sangrar, el mordisco en el cuello que no suelta,
  «Todavía no» al armario; Álex decide si le gusta (alimenta al huésped y da la ofrenda de
  sangre), si la para, si enciende la luz para verle la cara, o si la deja. Quedan
  `aranazos_alex` y `mordisco_alex` como marcas que Nora ve en el reagrupamiento y que el
  epílogo cita.
- **Reagrupamiento (`v9_regreso`, 04:00).** Los que quedan llegan del dormitorio o del
  almacén, o siguen en la mesa; Marcos corrobora las huellas si subió con Nora
  (`marcos_dijo_no_ratas`, que la VI cobra cuando dice «Ratas»); la credibilidad de Irene
  con Nora abre la carta de la VI (`cree_irene_nora`).

### Fase VI — Evidencia compartida (HORROR 2 → 3) · `js/story_fase6.js` (escrita 29-09-2026) · 8 escenas
Huésped a nivel 2 (§18). Violencia: heridas leves (§20). Anomalías: 4.

1. **Los pasos.** En el techo, encima de la mesa, en la buhardilla que Nora acaba de
   cerrar. Los cuatro los oyen: la primera percepción de todos a la vez. «Ratas.» «No.»
   Quien vio las huellas sabe que no son ratas y decide si lo dice.
2. **El clic.** La trampilla se abre sola. Solo el clic; nunca cae la cuerda (§8).
3. **Segunda subida, corta.** Quién sube y con quién sale del estado y de quién creyó a
   quién en `v9_regreso` (`cree_*`). Combinaciones: Nora con Marcos; Nora con Irene si no
   ocurrió en la V; Marcos solo; Álex solo por ego. A solas con el huésped a nivel 2 puede
   haber herida (§19), nunca muerte. **Primeras heridas del prólogo**: la escalera plegable
   que cede, la trampilla que se cierra sobre una mano. Nadie muere.
4. **Falsa alarma real.** Una rama contra el tejado. El grupo se relaja justo antes de lo
   gordo. Marcos lo explica y esta vez tiene razón.
5. **La primera mención de irse.** La dice Irene o Nora (si `fascinacion_rota`); nunca
   Álex. Marcos: el coche, la carretera, la hora. Se decide no irse todavía, o irse «cuando
   amanezca».
6. **El evento imposible.** Todos ven a alguien subir la escalera y ese alguien entra por
   la puerta del porche un momento después. No se enseña quién subió. Si alguien cruzó en
   la V (`alex_cruzo` / `marcos_cruzo`), el que entra por el porche es él, y desaparece esa
   misma noche (§21: primera muerte en la VII). HORROR 3.
7. **«Todo el mundo se queda aquí.»** Marcos. La frase que la casa incumple en la VII.
8. **Reagrupamiento** con lo que cada uno vio en la V. Las marcas del huésped ya no se
   explican con «el agua».

Semillas: la voz de la niña (`CHILD_VOICE`) puede sonar en la buhardilla si hay dos
semillas previas; de la mujer, polvo que cae y miradas arriba. Necesidades (§23.5) fijadas
al salir: quién tiene frío, quién sangra, quién quiere fumar.

### Fase VII — Ruptura (HORROR 3) · `js/story_fase7.js` (escrita 29-09-2026) · 8 escenas
Violencia: primera sangre. Anomalías: 4.

1. **Apagón.** No es el diferencial (Marcos ya lo subió): es el generador, en el cobertizo,
   a quince metros del borde de la luz. Salón a oscuras (`salon_apagon`), velas, móviles
   como linternas.
2. **Quién sale** depende de estados y del huésped: Marcos por control (por defecto); Álex
   por ego si Marcos duda o si alguien le dice que no lo haga; Irene nunca sola; Nora solo
   si nadie más va y su fascinación no se ha roto. El portador del huésped nunca sale
   (§18). Pueden ir uno o dos. Objeto a mano: la linterna o el atizador (§23.4).
3. **El cruce.** El borde de la luz del porche. La campanilla, una vez, casi inaudible
   (§9.1). Fuera, el lenguaje del pasado con el filtro de cada uno (§15): primer contacto,
   corto, sin muerte.
4. **El generador.** Se arregla: gasolina, el tirador. Primera sangre: la mano en el
   arranque, la chapa. `herida_*` con «sangra».
5. **Vuelve. La casa se ilumina.** Falso alivio: música, cervezas, «se acabó», el chiste de
   Marcos que vuelve.
6. **DOOMED sin aviso.** Quien cruzó está marcado: `condena_<pj>` arranca (§21). Desde
   fuera: miente sobre lo que vio, se queda mirando la puerta, contesta tarde.
7. **Las voces empiezan con nombres** (§16): alguien oye su nombre desde fuera, con la voz
   de quien está dentro.
8. Si hubo cruce en la V, aquí cae la **primera muerte** (la desaparición del que entró por
   el porche) y el generador es el segundo cruce.

### Fase VIII — Primera desaparición, búsqueda y primera muerte confirmada (HORROR 3 → 4) · `js/story_fase8.js` (escrita 29-09-2026) · 12 escenas, con las dos condenas (Álex: el bosque; Marcos: el coche) y las dos búsquedas
Violencia: primera sangre y el primer hallazgo. Anomalías: 5.

1. **La ruta de condena del marcado** (§22), vivida desde dentro si el jugador la elige con
   la carta, o vista desde el grupo como desaparición. Diez a veinte minutos, quince pasos
   (§4): contaminación, aislamiento, señuelo (una voz, la luz del coche), falsa salida,
   amenaza, muerte. Fuera, la percepción no es fiable (§23.6).
2. **La ausencia precede a la certeza.** «¿Dónde está?» El grupo se da cuenta tarde.
3. **La búsqueda** con luz: hasta el borde y no más allá, o más allá (segundo cruce,
   segundo reloj). Quién busca a quién lo deciden la relación y el miedo.
4. **El hallazgo.** El cuerpo o el rastro. Gore de hallazgo (§20): lo más crudo hasta
   entonces. Primera muerte confirmada: HORROR 4. `muerte_<pj>` con cómo, dónde, fase y
   quién lo vio. Quien toca primero el cuerpo recibe el huésped si el muerto lo llevaba
   (§18).
5. **Las grabaciones.** El grupo pone una vez el vídeo de la mesa o el audio de Álex, en
   texto y sin interfaz: lo que enseña depende de las banderas (el ahogo sí; el frío nunca;
   la sombra en la escalera si ocurrió el evento imposible). Pasa a RECORDED: credibilidad
   alta para quien lo enseña aunque esté hecho polvo.
6. **La cohesión se rompe.** Culpas: quién le dejó salir. Nora anota (`cuaderno_*`). Irene
   deja de leer a la gente o se agarra a Marcos; Álex, si vive, agresivo y desafiante.
7. **Las voces devuelven la primera frase dicha** (§16, §23.2), con la voz del muerto.

### Fase IX — El huésped a nivel tres y la súplica (HORROR 4) · `js/story_fase9.js` (escrita 29-09-2026) · 8 escenas
Nivel 3 por defecto aquí; antes si se alimentó (§18). Violencia: mutilación. Anomalías: 5.

1. **El ataque.** A solas con alguien, el huésped pierde el control: sujeta, golpea, ahoga,
   quema. El otro se defiende con lo que hay a mano (§23.4): huir (lleva al límite), herir
   en defensa propia (queda marca, la relación se rompe, el huésped se retira con un
   lapso), herir queriendo matar (§22: matar al amigo). Mutilación posible: la mano, el
   ojo, el oído.
2. **La súplica.** Justo después, vuelve a ser él, o lo parece, y pide que le crean.
   Plantilla con dos destinatarios (§18). Sin medidor. A veces el regreso es real. El
   jugador decide si le cree; la escena decide si es cómplice.
3. **Segunda dispersión forzada por necesidad real** (§23.5): una herida que sangra y hay
   que lavar, frío, sed, mear, o el que no soporta estar en la misma habitación que el
   huésped. Nadie explora. Configuración por estado, como en la V.
4. **Segundo cruce**, si no lo hubo: la necesidad saca a alguien de la luz (el coche, el
   cobertizo, el bosque a mear).
5. **La casa aprieta**: la sartén humea sola (templada → placa → humo, cumplido), el grifo
   de arriba corre y nadie lo abrió, el arrastre ya no está detrás de la estantería.

### Fase X — Segunda muerte y casa hostil (HORROR 4 → 5) · `js/story_fase10.js` (escrita 29-09-2026) · 8 escenas
Violencia: mutilación. Anomalías: 6.

1. **La segunda condena se cobra**, o el huésped mata si el jugador lo permitió (a solas,
   nivel 3, sin defenderse). Ruta vivida o vista.
2. **Casa hostil** (HORROR 5): puertas que no abren, la bañera de arriba con color (goteo →
   agua → color, cumplido), la mujer del techo para Irene si vive, los del pueblo en las
   ventanas para Nora. Una aparición clara permitida.
3. **Los que quedan** son dos. Empieza el tramo íntimo: Nora y el último superviviente.
   Afecto, culpa, deseo o bronca bajo miedo, según la relación y su naturaleza.
4. Si el cuerpo del huésped murió, el huésped ya está en otro (§18): el jugador lo lee por
   señales desde fuera, sin que nadie lo diga.

### Fase XI — La niña, la anomalía espacial y la tercera muerte (HORROR 5) · `js/story_fase11.js` (escrita 29-09-2026) · 6 escenas
Violencia: lo grotesco. Anomalías: 6.

1. **La niña, clara.** Requiere las semillas (§4) y al menos cinco ofrendas (§23.1). El
   cuerpo cosido, los párpados, los dientes de más, la campanilla sin badajo. Parece pedir
   ayuda. Muerde y desgarra: incapacita antes de matar (`marca_mordisco_<pj>`, ofrenda
   carne). Primera vuelta: **no se puede matar**. Se huye, se le cierra una puerta, se la
   encierra. El fuego queda apuntado (§24).
2. **La única anomalía espacial del prólogo**: la puerta del porche, abierta desde dentro,
   da al pasillo de arriba. Una vez. «La puerta deja de dejarte salir», cumplido al pie de
   la letra. Nunca se repite.
3. **La tercera muerte**, con Nora delante o a una habitación de distancia. El último
   aliento va a Nora (§18).
4. Lo de abajo ya está debajo de la mesa. La sartén paga (§3).

### Fase XII — Nora (HORROR 6) · `js/story_fase12.js` (escrita 29-09-2026) · 8 escenas
Sin presupuesto de anomalías.

1. **Nora sola, y no sola**: el huésped está en ella. Sus pensamientos `~` ya no son todos
   suyos y el jugador lo sabe porque los ha visto en otros. «Abajo.»
2. **El cuaderno**: «Empieza fuera.» / «Los tres salieron.» Lo que Nora escribió toda la
   noche (evidencias `cuaderno_*`) se relee en texto, en su orden.
3. **La ouija escribe ABAJO sin manos.** Son sus manos. Nadie lo dirá nunca.
4. **El almacén, la estantería, la puerta antigua** (el candado: la llave inglesa si la
   lleva, o ya abierto), la escalera de piedra (`sotano_escalera`), el sótano: piedra,
   madera quemada, la inscripción (lore nivel 1, §4).
5. **Final A** (NORA_DEAD): muerte aparente, desde dentro, gore contenido, negro.
   **Final B** (NORA_UNKNOWN): segunda cámara (el móvil de Irene o de Marcos, encendido en
   la mesa), incredulidad, corte. Cuál de los dos depende de las ofrendas entregadas y de
   si Nora bajó con luz.
6. **La mesa vacía**, batería baja, nada, negro.
7. **DIEZ AÑOS DESPUÉS**: el epílogo ensamblado (§23.8). Agus a Danna, con lo que quedó.

---

## 6. Reglas duras del motor narrativo (fusión de las dos listas)

1. Nunca modificar HORROR_STAGE salvo que la escena lo autorice; nunca reducirlo.
2. Nunca salvar ni resucitar a un DOOMED; nunca matarlo inmediatamente.
3. Nunca revelar lore por encima del nivel permitido ni inventar lore o reglas sobrenaturales.
4. Nunca inventar respuestas de la ouija: catálogo cerrado.
5. Nunca congelar personajes fuera del POV.
6. Nunca convertir una decisión de exploración directamente en aparición.
7. Una exploración puede terminar sin que ocurra absolutamente nada.
8. Nunca fenómenos «porque dan miedo»: cada uno con antecedente o pago futuro.
9. Nunca niña ni mujer sin sus semillas previas.
10. Nunca el mismo lenguaje de horror para dos personajes.
11. Nunca jumpscares como sustituto de progresión.
12. Nunca microdecisión convertida en rama larga.
13. Nunca decisión sin consecuencia narrativa identificable.
14. Nunca invalidar una decisión anterior sin causa.
15. Nunca GAME OVER. La muerte cambia el POV, no reinicia.
16. Nunca revelar la identidad real de ninguna entidad durante el prólogo.

---

## 7. Evidencias que sobreviven diez años
Cuaderno de Nora (ALDA y AJOBA con jota) · vídeo de la mesa (el móvil de Irene graba la
broma, el ahogo, el apagón y el rescate; nunca el frío) · foto del símbolo · grabación
de Álex · móvil de Marcos (opcional: segundo ángulo de la ouija) · vídeo del coche ·
grabación de Irene (opcional: diez segundos en el baño de arriba) · tablero de ouija ·
péndulo · objetos de buhardilla · marcas en baño · evidencia del sótano.
Cada escena importante responde: **¿qué queda después?**

---

## 8. Contradicciones resueltas (manda la versión posterior)

| Tema | Versión antigua | Versión que manda |
|---|---|---|
| Leyenda de Álex | resumen de la curandera que traslada el mal, «Cuando ella vuelva a llamaros…» | monólogo completo con campanilla y siete ofrendas |
| Irene | empática, confía demasiado, «de las más sensatas» | insinuante, celosa, manipuladora (se conserva: la mejor lectora de personas, «Tú también lo has visto», confianza en la realidad) |
| Muertes | los cuatro mueren, cualquiera puede ser el último | Nora siempre última, NORA_DEAD / NORA_UNKNOWN |
| Álex sube y ve a la niña | bloque del POV coral | prohibido; la niña es un proceso |
| Primera evidencia compartida | cae la cuerda de la buhardilla | solo «clic» de la trampilla |

## 9. Decisiones cerradas (28-09-2026)

1. **Señal al cruzar el límite**: una campanilla, una sola vez, casi inaudible, mezclada con el ambiente. Conecta con la campanilla de la niña en la leyenda. Nadie la comenta en el prólogo.
2. **Irene**: la insinuante, tal como está en fichas y juego. Ojos azules.
3. **Alda**: palabra sin significado fijado en todo el prólogo. Nora la anota; Danna la encuentra.
4. **Sabotajes de la ouija** (revisado 28-09-2026): Álex lleva el vaso toda la sesión y sus respuestas falsas son fijas (ADIÓS, SÍ, NO, IRENE); lo que el jugador decide es desde qué POV las ve y qué hace cada uno alrededor. Irene aporta la bombilla floja y los golpes con el talón (va descalza desde la Fase I). El «yo nunca he hecho trampas en una ouija» de Nora (bebió) se cobra al descubrirse la broma: «Tú hiciste trampas con catorce años. Estamos en paz.» Las respuestas reales (ALDA, AJOBA) llegan a través de las manos de Álex, que no las elige; **Nora sabe que ALDA es real porque nadie puede conocer la palabra**, y lo oculta. El vaso solo se mueve sin manos al final, fuera de cámara.
5. **Evidencias obligatorias**: solo el cuaderno de Nora y el vídeo de la mesa (móvil de Irene desde la ouija). El resto, variable.

## 10. Sistemas del motor (implementados en Fase I)

### Vestuario (fichas)
Nora: pantalón negro con cinturón, camiseta holgada sin nada debajo, **la camisa negra de Marcos** encima (la que Irene le regaló a él hace tres años). Marcos: camisa de cuadros sobre camiseta negra. Álex: camisa estampada abierta, collares. Irene: top blanco de botones que no cierran, shorts vaqueros. **Nora no fuma tabaco**, solo porros. **Nora nunca toma setas**.

### Consumo gradual
`api.consumir(id, tipo)`. Nada es inmediato. Seta: +1,5 intox y −0,5 lucidez por escena, **sin fin, todo el prólogo**; varias setas se suman. Porro: 3 escenas. Chupito: 2. Cerveza: 1. Lucidez no baja de 20 por consumo. Cada escena etiqueta su **consumo narrativo** (lo que el texto dice que beben). **Deriva de fondo** en Fase I: +0,5 intox a todos por escena; desaparece cuando la noche cambia. Si Marcos rechaza su seta, Álex se la come y cuenta.

### AUTO_RESOLVE
En cada bifurcación de perspectiva, cada carta lleva `auto(api)`: lo que hace ese personaje si no le seguimos. Reglas **deterministas con umbrales**, **esencia antes que estados**: Marcos casi nunca hace nada poco racional; Álex e Irene terrenales, Álex despreocupado, Irene más lista. Deja los mismos flags, conocimientos y relaciones que la rama visible (la rama visible aplica sus efectos en `alEntrar` para que pesen igual). El jugador **no ve nada explícito**: solo lo que oye a los personajes y los indicadores en Ver detalles. Lo no visto no se puede asegurar.

### Credibilidad
`api.credibilidad(id)` → alta / media / baja, según lucidez menos miedo, estrés e intoxicación. Cuando alguien cuente lo que hizo fuera de cámara, que le crean depende de cómo suene en ese momento. Para Fase II.

### Marcos graba
Opciones de grabar o fotografiar en momentos que le pegan, siempre con alternativas igual de buenas: el brindis (vídeo), la sartén con el reloj (foto), la pared que golpea (audio). Evidencias persistentes.

### Muerte fuera de cámara
Misma máquina que AUTO_RESOLVE. Matices pendientes al llegar a las rutas de condena.

## 11. Lo que falta recibir
- Edad, estudios y ciudad de los cuatro (pendientes en las fichas).
- Recibido el 28-09-2026: los fondos (35 JPEG por espacio y por nivel de horror en
  `assets/fondos/`) y la música (cinco canciones de fiesta y una hora de terror ambiental,
  fuera del repositorio público).

## 12. Elección de POV por incidente (Fase IV)
Una carta al principio de un incidente largo fija `ouija_pov` y la cadena entera usa
`pov: (api) => P(api)`. No son tres cadenas: es una sola con bloques condicionados por la
carta. Cada POV tiene exactamente dos momentos propios (Nora: la llama y el beso; Irene:
la preparación y el ahogo; Marcos: la reacción y el traspaso) y microdecisiones
caracterizadas en el resto, nunca etiquetas («mirar la vela», «quedarse por miedo»). Lo
que hacen los otros dos se resuelve con `decidirMarcos`, `decidirNora` y `decidirIrene`
en el `alEntrar` de la escena siguiente, dejando **las mismas banderas** que la rama
visible. El mundo no cambia según dónde esté la cámara; cambia lo que el jugador sabe.

## 13. El huésped (CONTACTO) — para las fases V en adelante
Banderas: `contacto = true`, `contacto_inicial = "irene"`, `huesped = "irene" | "marcos"`.
Nadie lo llama posesión: para los personajes solo ha habido un ahogo y una broma.

- **Gradual y difuso.** Nivel 0 en la Fase IV: una sola señal desde fuera (las manos
  heladas de Marcos en la nuca de Nora, «Es la casa»; Irene tragando con la mano en el
  cuello cada vez que se ríe). Sube como mucho un nivel por fase y **nunca baja**.
- **Desde dentro (cuando el huésped es POV):** pensamientos intrusivos en las líneas `~`
  que no son suyos. Primero extrañeza («eso no lo he pensado yo»). Después paranoia
  hostil hacia alguien concreto (en Marcos, hacia quien le quita el control; en Irene,
  hacia quien le quita a Marcos). Después impulsos: opciones que el jugador puede
  rechazar, siempre con una alternativa igual de buena y sin etiqueta. Lo evidente es
  la duda y el miedo interno del POV, no el fenómeno.
- **Desde fuera (cuando no lo es):** cambios de actitud que los demás notan y el jugador
  lee en el texto: contesta tarde, mira demasiado rato, tiene frío, se queda quieto,
  deja de hacer chistes (Marcos) o deja de leer a la gente (Irene, su medidor oculto de
  confianza en la realidad). Los demás lo racionalizan (setas, susto, alcohol) hasta
  que no pueden.
- **Peligro a solas.** Ya en el nivel 1 (Fase V), si el huésped va acompañado y su
  estado o la relación con el otro están cargados, sujeta o quema: deja marca y no se
  acuerda. A partir del nivel 2, compartir escena a solas con el huésped puede ser una
  ruta de condena para el otro. La muerte no se anuncia. El huésped no lo sabe, o lo
  sabe demasiado tarde. Su firma verbal es «Todavía no».
- **Finales.** El huésped abre variantes. En Marcos conecta con su condena racional (el
  coche que vuelve, la figura de Nora en la carretera: quién conduce y qué ve). En Irene
  con el baño de arriba: el ahogo de la ouija es un ahogamiento en seco y la bañera lo
  cobra. Quién es el huésped condiciona quién muere primero y qué queda grabado.
- **Lo que sabe cada uno al salir de la ouija.** Irene: que el ahogo fue real
  (`ahogo_real`). Marcos: si hizo la respiración, el frío (`aliento_frio`) y quizá cree a
  Irene (`marcos_cree_irene`). Nora: quizá la llama (`llama_velas`) y ALDA. Álex: nada;
  es el que menos información auténtica tiene pese a llevar el vaso, y el único que sabe
  que no eligió las palabras.
- **La intoxicación acelera, no crea.** Marcos con setas se lo achaca a las setas y el
  jugador también; sin setas no tiene excusa y pesa más.
- **Irene fuera de la mesa.** Si se fue al baño en la ouija (`irene_fuera = "bano"`), su
  ruta de la Fase V (la voz) ya tiene un primer paso dado. Si se fue a por una cerveza,
  no.

---

## 14. Decisiones cerradas (29-09-2026)
Mandan sobre lo anterior cuando choquen. Las tres primeras quedaron pendientes de
confirmación explícita del autor y se adoptan por defecto hasta que diga lo contrario.

1. **El huésped pasa de cuerpo por el aliento y acaba en Nora** (regla oculta, §18).
2. **Las muertes pueden adelantarse hasta la VII** si alguien cruza de verdad en la V (§21).
3. **La niña no se puede matar en esta primera vuelta.** Aparece, muerde y aterra. El
   puzzle del fuego se decide después de que el prólogo entero se haya jugado una vez (§24).
4. **Doce fases.** Primera vuelta: una sola versión de cada muerte por personaje más la
   variante del huésped (§22).
5. **Ocho mecánicas de escritura entran ahora** (§23). Las que necesitan interfaz o cambian
   el contrato con el jugador esperan (§24).
6. **La luz no se cuenta.** Hay luz o no la hay. La batería aparece en el texto, nunca como
   contador.
7. **No se reescribe lo que funciona.** Fases I a IV intactas. La V se retoca solo en lo
   que dice §5 (el eje de Nora y los que se quedan).
8. **Nora–Marcos, pareja sana por defecto** (28-09-2026), también bajo miedo: solo el
   huésped y las decisiones del jugador la enfrían.
9. **El gore es de las muertes y de los hallazgos, nunca de las anomalías** (§20).
10. **Dentro de la casa la lógica sirve; fuera de la luz, no** (§15). Se respeta en cada
    escena exterior y no se explica nunca en el texto.
11. **Orden de escritura**: Biblia → bloque 1 (V retoque + VI) → bloque 2 (VII, VIII, IX)
    → bloque 3 (X, XI, XII). Cada bloque se prueba en el navegador y con `check.sh` antes
    del siguiente, y se publica al terminar (§25).

## 15. El límite de la luz y la regla de fuera
- **El límite es el borde de la luz del porche.** No una línea en el suelo: donde deja de
  llegar la luz. Sin luz en el porche (apagón), el límite es la puerta.
- **Cruzarlo no mata: marca.** `condena_<pj>` arranca (§21). Señal única: la campanilla,
  una vez, casi inaudible, mezclada con el ambiente (§9.1). Nadie la comenta.
- **Se puede volver a entrar**, y se vuelve: la casa deja entrar a los marcados. Lo que la
  Biblia no permite es salvarlos. La libertad está en cómo y cuándo, no en si.
- **Fuera, la realidad que no ves te mata.** Desde el cruce, lo que lee el jugador no es
  fiable (§23.6): se mezclan la noche del fuego, la gente entre los árboles, la horda con
  rastrillos, azadas y antorchas. Ninguna muerte exterior es gratuita: siempre es la
  consecuencia visible de una decisión tomada bajo una percepción falsa. Huyes de una
  visión y caes por un terraplén real; te escondes de las antorchas en el cobertizo y es el
  generador lo que te quema.
- **Un solo lenguaje fuera, el pasado, con el filtro de cada uno** (respeta la regla 10):
  - Nora ve a los aldeanos con claridad porque los ha leído; huele a leña y a pelo. Nunca
    voces de amigos.
  - Marcos los ve como faros y ruido de motor hasta que es tarde.
  - Álex los oye, y oye su propio juego devuelto: golpes que se adelantan, sus frases de la
    fiesta, la voz de Irene pidiendo ayuda.
  - Irene los ve en los cristales y en el agua.
- **La horda con antorchas como persecución completa se reserva para una sola muerte**: la
  de Álex en el bosque. Es la imagen más grande del prólogo y no se repite como fondo.
- **La asimetría central**: dentro de la casa la lógica sirve (una puerta se cierra, un
  objeto se usa, una herida se venda); fuera de la luz no, porque fuera no ves la realidad.
- Las zonas de §3 se mantienen: INTERIOR → PORCHE (seguro mientras haya luz) → TERRENO.

## 16. Las voces
- **Qué son.** Lo que la casa ha aprendido esta noche. No inventa: repite. Cuanto más
  habláis dentro, más tiene.
- **Escalada fija**: (1) nombres, lo primero que le dieron (la pregunta de Irene en la
  ouija: `voz_nombre`, `voz_desertor`); (2) frases enteras con la voz de un amigo, y solo
  frases dichas en voz alta en la casa (§23.2); (3) un intercambio corto, pregunta y
  respuesta; (4) la voz de la propia víctima. Por fase: (1) desde la V, (2) desde la VII,
  (3) desde la IX, (4) solo dentro de una ruta de condena.
- **Función única**: sacar a alguien de la luz o separarlo del grupo. No hacen daño; llevan
  al sitio donde se hace.
- **Ya usadas**: la de Irene con Álex y la de Álex con Irene en la V, cada uno donde no
  estaba el otro. Esa contradicción es la prueba de que son señuelo, y nadie la junta hasta
  la VIII.
- **Regla de catálogo**: ninguna voz dice nada que no esté en la lista de lo dicho (§23.2),
  en un catálogo mínimo por personaje (frases de la fiesta ya escritas en la Fase I) o en
  el catálogo cerrado de la ouija (regla 4). La grabación de Álex y el vídeo de la mesa
  importan porque la casa tiene la misma memoria que ellos.
- Nora nunca oye voces de amigos. Las voces la rodean sin hablarle.

## 17. Las criaturas: dos cosas, no un bestiario
Todo es lo mismo y nadie lo sabe; el jugador junta las piezas después. Ninguna identidad
se revela (regla 16).

- **Lo de abajo.** Sin cuerpo. No se ve nunca: frío, olor dulce, arrastre, la puerta con
  candado, el pensamiento «Abajo». Cobra las ofrendas (§23.1). **No se puede matar.**
  Reclama a Nora en la XII.
- **La niña construida.** Cuerpo cosido, párpados cosidos, demasiados dientes, la
  campanilla sin badajo. Un proceso, no un fantasma: huellas, objeto, voz, sombra pequeña,
  y solo después la aparición (semillas de §4; ya lleva dos). Engaña: parece pedir ayuda.
  **Hace daño físico**: muerde y desgarra, incapacita antes de matar. Clara solo en la XI
  (en la IX si el grupo fuerza las semillas). Antes, un mordisco en la VIII o la IX como
  evidencia real (`marca_mordisco_<pj>`) sin verla entera. Primera vuelta: no matable.
- **La mujer del techo.** Ruidos en el techo, arañazos, polvo, miradas arriba (semillas de
  §4). Vive en el baño de arriba y en el techo. Es la condena de Irene; solo Irene la ve
  entera.
- **Lo de fuera que abre animales.** Solo efectos: lo que aparece en la puerta del porche,
  un olor, un rastro. Nunca se ve.
- **Los del pueblo.** El pasado. No atacan: anuncian el fuego. Solo Nora los ve claros (§15).
- **La casa.** Encierra o abre en el momento justo; nunca mata sola. Una sola anomalía
  espacial (§5, Fase XI).
- **La hipótesis de la bruja.** El huésped puede decir cosas que suenan a ella: nombres,
  «él también le tiene miedo». No se confirma nunca en el prólogo: la revelación es de
  Agus y Danna.

## 18. El huésped: tres niveles, el aliento y la súplica
Amplía §13, que sigue vigente.

- **Niveles** (`huesped_nivel`). **1** (V): lapsos, un pensamiento ajeno, y si va
  acompañado y cargado sujeta o quema. **2** (VI por defecto): a solas con él es peligroso:
  hiere (§19), no mata; miente; desde fuera deja de ser él durante tramos largos. **3** (IX
  por defecto; VII u VIII si se alimenta): pierde el control y ataca para matar. Nunca dos
  niveles en la misma fase; nunca baja.
- **Alimentarlo** acelera: quedarse a solas con él repetidas veces (`huesped_solas`
  cuenta), un beso o un boca a boca más, no defenderse la primera vez, tocarle para
  consolarle (§23.7). **No alimentarlo**: si el grupo no lo deja a solas con nadie, no mata
  nunca y esa muerte la pone la casa por otra vía.
- **La regla oculta del aliento** (nunca se lee en pantalla): entró por el aliento (el
  rescate de la ouija) y solo sale por el aliento. Un boca a boca, un beso, un grito a un
  palmo de la cara lo cambian de persona. No se destruye: se mueve. Cuando muere el cuerpo
  que lo lleva, el último aliento va al más cercano, o a quien primero toca el cuerpo.
  Semilla puesta: Irene besó a Marcos tras el rescate «buscándole el frío con la lengua».
- **Reglas de escritura para que haya una sola línea de huésped por partida** (primera
  vuelta):
  1. El portador nunca es el primero en morir: no cruza el límite mientras lo lleva (no
     sale al generador; si es POV, la opción no aparece y el texto lo caracteriza: se queda
     en la puerta, «Todavía no»).
  2. El portador puede morir segundo solo a manos de un amigo (defensa a matar, §22). El
     aliento va entonces a quien lo mató, que hereda `huesped_nivel` sin reinicio y se
     escribe desde dentro solo con la capa genérica de intrusiones (`~` ajenos y un impulso
     por escena); la súplica no se repite.
  3. Si no, el portador es la tercera muerte, en el tramo íntimo, y el aliento va a Nora.
  4. Nora solo lo recibe del último. Las demás transferencias por aliento (fuera del boca a
     boca de la IX) quedan para la segunda vuelta (§24).
- **Mata solo si el jugador lo permite**: a solas con él en nivel 3 y sin defenderse.
- **Defenderse** (§23.4): huir (lleva al límite), herir en defensa propia (queda marca, la
  relación se rompe, el huésped se retira con un lapso: `huesped_retirado` durante una
  fase), herir queriendo matar (§22: matar al amigo, una de las muertes que más pesan).
- **La súplica.** Tras el primer ataque, la escena moral del prólogo. Vuelve a ser él, o lo
  parece, y pide que le crean. Plantilla con dos destinatarios: Marcos-huésped a Nora o a
  Irene, con lógica («sabes que no he sido yo, mírame»); Irene-huésped a Álex, leyéndole y
  dándole lo que quiere oír. Sin medidor. A veces el regreso es real. Las únicas señales
  fiables son la firma («Todavía no») y el frío, y el texto las pone o no según
  `huesped_retirado`. Se escribe una vez, se abre por destinatario y se cuida más que
  ninguna otra escena, porque ahí se decide si el jugador se siente cómplice.
- **En Nora (XII)**: sus `~` dejan de ser suyos y el jugador lo reconoce porque lo ha visto
  en otros. «Abajo» es AJOBA cobrándose en ella.

## 19. Heridas: cuatro estados físicos
`herida_<pj>` es un conjunto: puede haber más de una. Empiezan en la VI (trampilla,
escalera); nunca antes. No hay curación: una herida dura el prólogo.

| Estado | Cómo se gana | Qué cierra | Qué abre |
|---|---|---|---|
| cojera | escalera plegable, trampilla, la grava, un terraplén | correr, bajar deprisa, cargar con alguien | ser el que se queda, el que no llega |
| mano | quemadura, mordisco, la chapa del generador, defensa | sujetar la escalera, dos manos (escalera y linterna), abrir el candado, la sartén | pedir ayuda: contacto (§23.7) |
| sangra | primera sangre (VII), defensa, la niña | esconderse mucho rato (deja rastro), callarse (dolor) | lavarse: dispersión (§23.5); la ofrenda sangre |
| sentido | golpe en la cabeza, el ojo, el oído (el grito del huésped) | un canal de percepción: las descripciones lo omiten | percepción no fiable dentro de la casa (§23.6) |

- Cada herida cierra opciones en el texto (la opción no aparece, sin explicación) y cambia
  lo que hace el personaje cuando no se le lleva (AUTO_RESOLVE con `herida_*`).
- Vendar, lavar, sujetar es contacto (§23.7). Una herida que sangra sin lavar es la
  necesidad dominante de ese personaje en la siguiente dispersión.
- Un tullido no cruza corriendo: cruza despacio, y fuera despacio es peor.

## 20. Escala de violencia por fase

| Fase | Permitido |
|---|---|
| I–V | nada físico; marcas del huésped desde la V |
| VI | heridas leves (escalera, trampilla) |
| VII–VIII | primera sangre; el primer hallazgo es lo más crudo hasta entonces |
| IX–X | mutilación: la mano, el ojo, el mordisco; el ataque del huésped |
| XI–XII | lo grotesco: la niña, la tercera muerte, el sótano |

- **El gore es de las muertes y de los hallazgos, nunca de las anomalías.** Mientras la
  casa solo insinúa, cuando mata lo hace con cuerpo, sangre y tiempo. Las anomalías siguen
  siendo un vaso que se mueve, un grifo que suena, una cuerda que no está.
- **Las muertes pueden ser largas**, vividas desde dentro hasta el final (Marcos en el
  coche volcado oyendo la fiesta por la radio con las antorchas entre los pinos; Irene en
  la bañera con el agua subiendo y la puerta abriéndose hacia el techo). Nunca se
  anuncian: negro y cambio de POV (regla 15).
- La violencia nunca sustituye a la progresión (regla 11): cada golpe en su fase, no antes.

## 21. El reloj de las condenas
- **Un contador por personaje** desde que cruza: `condena_<pj>` = escenas desde el cruce.
  Quince pasos mínimos (§4) repartidos entre fases. La muerte cae cuando el contador se
  cumple **y el personaje está solo**, en cualquier fase a partir de HORROR 3.
- **Dos relojes pueden correr a la vez**: si dos cruzan seguidos, las muertes se juntan; si
  nadie cruza en una fase, se espacian.
- **Las fases son hitos, no horas.** La primera desaparición, la búsqueda y la primera
  muerte confirmada las dispara «quien cruzó primero», no «la Fase VIII».
- **Tres palancas para morir antes o después, todas por decisión:**
  1. Cruzar antes: en la V (Álex insistiendo dos veces en la grava; Marcos en el porche con
     Álex). Quien cruza en la V llega a la VI marcado, es el que «entra por el porche» y
     desaparece; primera muerte en la VII; el generador pasa a ser el segundo cruce.
  2. Alimentar al huésped (§18): nivel 3 en la VII u VIII y puede matar antes.
  3. La niña: forzar sus semillas (bajar la muñeca, subir dos veces, seguir las huellas) la
     trae en la IX; evitarlas la retrasa a la XI.
- **Lo que no se mueve**: mueren tres y Nora es la última; nadie muere antes de que los
  cuatro hayan visto algo juntos (el evento imposible, final de la VI); ninguna muerte
  llega sin una decisión previa que la explique; nadie muere antes de la ouija; ningún
  cuarto sobrevive.
- **Los que quedan.** De la VIII a la XI, cada escena de grupo se escribe para dos, tres o
  cuatro vivos comprobando quién está (como `v9_regreso`), nunca para cuatro nombres fijos.
- **Partida rápida** (ejemplo): Álex cruza en la V; en la VI entra por el porche y
  desaparece; en la VII Marcos baja el apagón y cruza; el huésped alimentado está en nivel
  3; en la VIII encuentran a Álex en el bosque; en la IX Irene-huésped ataca a Marcos
  herido y suplica; dos muertes en la X; Nora sola en la XI, la niña, el sótano en la XII.
- **Partida lenta**: nadie cruza hasta el generador, el huésped no encuentra a nadie a
  solas, la niña llega en la XI, las tres muertes caen en la X y la XI seguidas, con el
  grupo entero hasta casi el final. Es la que más pesa.

## 22. Muertes por personaje
Una ruta por personaje, escrita una vez, que se abre en los dos últimos tramos. La ruta
principal sirve como primera, segunda o tercera muerte: cambia quién la ve, no su texto.
Primera vuelta: la principal más la variante del huésped. Las demás, para la segunda
vuelta (§24).

| Personaje | Ruta principal | Variante del huésped | Segunda vuelta |
|---|---|---|---|
| Álex | El bosque siguiendo la voz de Irene: la horda con antorchas, su juego devuelto, «Venga. Si estás ahí, sal.» detrás de él | muerto por el huésped a solas (Irene-huésped, la que mejor le lee) | el coche con Marcos |
| Marcos | El coche que vuelve: sale a por ayuda, la carretera devuelve el coche a la cabaña, la figura de Nora en la carretera, impacto | si lo lleva Irene: muerto por el huésped; si lo lleva él: muerto por un amigo en defensa | el generador |
| Irene | La bañera de arriba: el agua que sube de un color imposible, la voz de Álex tras la puerta que pasa a estar arriba, la mujer del camisón; el cuerpo en la bañera cuando el agua ya no está | si lo lleva Marcos: muerta por el huésped; si lo lleva ella: muerta por un amigo en defensa | el bosque con la voz de Álex |
| Nora | El sótano: Final A (muerta) o Final B (desaparecida) | — | — |

- Cada muerte registra `muerte_<pj> = { como, donde, fase, visto_por }` para el epílogo.
- Matar al amigo: opción real desde la IX contra el portador; deja `mato_<pj>` y rompe
  todas las relaciones del que mata con los que quedan.

## 23. Las ocho mecánicas de escritura
Todas son banderas y condiciones en las opciones; ninguna añade una pantalla. Cada una
dice quién la alimenta y quién la cobra; si una no tiene cobro, se quita.

1. **Las siete ofrendas** (contador oculto). Banderas `ofrenda_nombre`, `ofrenda_aliento`,
   `ofrenda_sangre`, `ofrenda_hueso`, `ofrenda_carne`, `ofrenda_recuerdo`, `ofrenda_alma`.
   *Alimenta*: nombre (la ouija, IV: ya dado), aliento (el rescate, IV: ya dado; la VI lo
   marca al entrar a partir de `contacto` y `voz_desertor`), sangre (la primera herida que
   cae al suelo, VII), hueso (una fractura: escalera, trampilla, terraplén), carne (el
   mordisco o una herida de defensa, IX+), recuerdo (el tercer lapso del huésped), alma (la
   XII). *Cobra*: la niña clara necesita cinco; la casa hostil (X) sube de tono con cuatro;
   el huésped tiene más frases de lo de abajo por cada ofrenda; el Final A o B de la XII
   depende de que estén las siete. Nadie lo lee nunca en pantalla.
2. **La casa recuerda lo dicho.** `dichos[pj]`: la lista de frases que un personaje dijo en
   voz alta porque el jugador eligió una opción entre comillas («…»). Única adición al
   motor para el bloque 1: al elegir una opción cuyo texto empieza por « se guarda la frase
   en `estado.dichos[pov]`, y `api.dicho(pj, n)` la devuelve. Las partidas guardadas antes
   arrancan con la lista vacía y las voces tiran del catálogo mínimo (§16). *Cobra*: las
   voces de nivel 2 y 3 devuelven esas frases exactas con la voz de quien las dijo: en el
   bosque, tras una puerta, en la condena de Álex (su juego devuelto), y en la XII para
   Nora, las voces de los tres muertos con lo que ella eligió que dijeran.
3. **Las heridas** (§19). *Cobra*: opciones cerradas, AUTO_RESOLVE, dispersión por
   necesidad, hallazgo.
4. **Objetos a mano, sin inventario.** `mano_<pj>` = null | "sarten" | "atizador" |
   "linterna" | "cuerda" | "botella" | "llave" (inglesa). Solo cabe uno; coger otro suelta
   el anterior y el texto lo dice. La escalera plegable no se lleva: se sujeta. Todos
   establecidos antes: la sartén de hierro (cocina, I), el atizador (chimenea, I), la
   botella (mesa, I), la cuerda de la trampilla (V, si no desapareció), la llave inglesa
   (caja de herramientas del almacén, V retoque), la linterna grande (almacén, V).
   *Alimenta*: opciones caracterizadas («Coge el atizador. Por si acaso.»). *Cobra*: la
   defensa (§18), cruzar con luz (linterna: ves, y una mano menos), el candado (llave, XII),
   sujetar la escalera (dos manos). Con `herida: mano` no se lleva la sartén ni se sujeta
   la escalera.
5. **Necesidades como motor de separación.** `nec_<pj>` = "frio" | "sed" | "herida" |
   "mear" | "fumar" | "sueno" | null: la necesidad dominante, fijada por las escenas, no
   contada. *Alimenta*: cada fase la asigna a partir de lo que pasó (Irene con frío desde la
   V, Álex fumar, Marcos sed, la herida que sangra, sueño a partir de las cinco). *Cobra*:
   las dispersiones (V, VI, IX) y el destino de quien no se lleva (AUTO_RESOLVE: va a su
   necesidad: el baño, el porche, la cocina). Siempre con motivo; nadie «explora».
6. **Percepción no fiable.** `fiable(pj)` es falso si está fuera de la luz (`fuera_<pj>`), o
   en modo `perdido` o `ido`, o tiene `herida: sentido`, o es el huésped a nivel 2 o más.
   *Cobra*: con POV no fiable el texto describe cosas falsas y las opciones se basan en
   ellas (una puerta que no está, una voz que es de nadie, la carretera que sigue); el
   jugador solo lo detecta por contradicciones con lo que sabe o con lo que otro ve
   después. Nunca un aviso. Dentro de la casa la lógica funciona; fuera, no.
7. **Contacto: consuela y propaga.** Abrazar, coger la mano, dormir apoyado, vendar, lavar
   una herida: baja el miedo, sube el afecto, y la pareja sana lo usa por defecto. Pero el
   contacto con el portador cuenta (`huesped_contacto`) y acelera (§18), y el contacto de
   aliento lo mueve (regla oculta). *Cobra*: el jugador no lo sabe, y cuando lo sospecha ya
   no quiere tocar a nadie: la pareja sana se enfría por miedo, no por reproche.
8. **El epílogo ensamblado.** «Diez años después» no es un texto fijo. Se monta con las
   evidencias que sobrevivieron (las que quedaron dentro de la casa o en los cuerpos
   hallados; obligatorias el cuaderno y el vídeo de la mesa), lo que sabía cada uno al
   morir (`conocimiento`), lo que Nora escribió (`cuaderno_*`), cómo y en qué orden murió
   cada uno (`muerte_<pj>`) y el final (NORA_DEAD / NORA_UNKNOWN). Agus cuenta a Danna;
   Danna encuentra ALDA. Dos partidas dan dos relatos. Es el pago de todo el sistema de
   conocimiento.

## 24. Después (segunda vuelta, cuando el prólogo entero se haya jugado una vez)
- El cuaderno en pantalla, en su letra, con solo lo que Nora decidió escribir.
- Revisar las grabaciones con interfaz (RECORDED: el vaso moviéndose cuando nadie miraba,
  la sombra en la escalera).
- La luz y la batería como recurso con contador.
- El puzzle de la niña: matable con fuego. La solución está en la leyenda (la encerraron y
  le prendieron fuego): chimenea, velas, gasolina del generador. El fuego trae al pasado y
  quien lo enciende paga. Matarla no salva a nadie: cambia la evidencia que queda, el
  tiempo que gana el grupo y quién muere cómo. Si chirría en la primera prueba, se quita.
- Las variantes de muerte extra (§22, columna «segunda vuelta») y la súplica con más
  destinatarios.
- Transferencias del huésped por aliento fuera de la IX.
- Exportar e importar la partida; móvil; modo de dos personas en tiempo real.

## 25. Presupuesto de escenas y orden de escritura
Escritas: 65 (I: 31, II: 7, III: 1, IV: 13, V: 13). Una partida recorre unas 50.

| Fase | Escenas | Bloque | Qué incluye |
|---|---|---|---|
| V (retoque) | +6 | 1 | El eje de Nora, Irene y Nora en la buhardilla, Irene y Álex solos, Álex y Marcos solos, el porche reescrito |
| VI | 8 | 1 | Pasos, trampilla, segunda subida, falsa alarma, el evento imposible |
| VII | 8 | 2 | Apagón, el generador, el primer cruce, falso alivio |
| VIII | 10 | 2 | Primera desaparición, búsqueda, primer hallazgo, grabaciones |
| IX | 10 | 2 | El huésped en nivel tres, su ataque, la súplica, segunda dispersión |
| X | 8 | 3 | Segunda muerte, casa hostil |
| XI | 10 | 3 | La niña, la anomalía espacial, tercera muerte |
| XII | 8 | 3 | Nora sola, el cuaderno, ABAJO, el sótano, dos finales, diez años después |
| Rutas de condena | 18 | 2 y 3 | Seis por personaje (Álex, Marcos, Irene), repartidas entre la VIII y la XI según quién cruza y cuándo |

Techo: 86 nuevas (unas 150 en total). Objetivo: 70, plegando las rutas de condena dentro
de las fases donde se juegan. Una partida ve unas 45 de las nuevas. Cuatro horas y media de
lectura tranquila en total.

**Cada bloque, antes del siguiente:** `check.sh` limpio (banderas leídas y escritas,
escenas referenciadas); recorrido en el navegador con `?debug` por las combinaciones de
huésped (Irene / Marcos), configuración de dispersión y orden de muertes; `bash build.sh`;
envío a GitHub. El autor revisa cuando quiera y en el orden que quiera; la escritura no
espera a la revisión.

**Rendimiento:** máximo para las escenas con muchos estados (dispersiones, condenas,
súplica, Nora sola) y el epílogo; medio vale para lo mecánico (fondos y música, pruebas,
construcción, envíos, transiciones sencillas).

## 26. Arranque de la Fase VI: lo que se consume de la IV y la V
La VI arranca de estas banderas y no inventa ninguna que no esté aquí o en §23.

- **Huésped**: `huesped` ("irene" | "marcos"), `huesped_nivel` (1), `contacto`,
  `contacto_inicial`, `marcos_accion` ("rescate" | "lampara" | "cocina"), `huesped_lapso`,
  `huesped_sujeto`, `huesped_quemo`; marcas `marca_brazo_irene`, `marca_tobillo_nora`,
  `quemadura_marcos` (y `marca_muneca_nora` tras el retoque).
- **Lo que sabe cada uno** (`api.sabe`): Irene `ahogo_real`, `oi_mi_nombre`,
  `oi_alex_puerta`, `golpe_armario`, `marca_armario`, `marcos_me_sujeto`; Marcos
  `aliento_frio`, `diferencial`, `puerta_almacen`, `placa_piloto`, `arrastre`,
  `grifo_corria`, `huellas_pequenas`, `irene_me_quemo`; Nora `alda`, `llama_velas`,
  `huellas_pequenas`, `marcas_viga`, `muneca`, `cuerda_desaparecio`, `gente_arboles`,
  `marcos_me_sujeto`; Álex `no_elegi_alda`, `luz_coche`, `oi_irene_fuera`.
- **Quién cree a quién**: las doce `cree_<a>_<b>` del reagrupamiento; `marcos_cree_irene`,
  `nora_cree_irene`, `alex_cree_irene` de la ouija.
- **Dispersión**: `v1_nora`, `v_nora_con`, `v_irene_con`, `v_quedan` (nuevo), `v_ruta`,
  `alex_piso_grava`, `alex_quiso_cruzar`, `alex_cruzo` / `marcos_cruzo` (nuevos),
  `luz_coche`, `alex_oyo_irene_fuera`, `irene_oyo_alex_puerta`, `nora_vio_gente`,
  `arrastre_almacen`, `marcos_movio_estanteria`, `cuadro_visto`, `huellas_vistas`,
  `trampilla_cerro`, `cuerda_desaparece`, `nora_toma_muneca`, `nora_abre_muneca`,
  `marcos_penso_abajo`, `irene_espejo`, `nora_porro`, `salida_porche`, `irene_nora`,
  `nora_pregunta` (nuevos); lo contado: `alex_cuenta`, `irene_cuenta`,
  `marcos_cuenta_puerta`, `marcos_cuenta_arrastre`, `marcos_cuenta_grifo`,
  `nora_cuenta_huellas`, `nora_cuenta_gente`.
- **Ouija**: `voz_desertor` (Irene oyó su nombre), `irene_fuera`, `irene_beso_marcos`,
  `nora_reaccion_beso`, `alda_visto`, `ajoba_visto`, `vaso_final`, `ouija_cerrada`.
- **Evidencias**: `video_mesa` (obligatoria), `cuaderno_*`, `video_marcos_ouija`,
  `video_irene_bano`, `audio_irene_bano`, `video_coche_luz`, `foto_cuadro`,
  `foto_buhardilla`, `foto_arboles`, `video_trampilla`, `muneca_buhardilla`, las marcas.
- **Presupuesto de anomalías**: VI 4, VII 4, VIII 5, IX 5, X 6, XI 6, XII sin límite.
- **Saltos de prueba** (`prepararSalto`): al entrar por `?debug` en una escena de la VI en
  adelante se fijan valores por defecto coherentes (huésped Marcos por rescate, nivel según
  fase, sin cruces, sin heridas) para que cualquier escena se pueda abrir sola.
