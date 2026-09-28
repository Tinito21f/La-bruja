# La Bruja — Prólogo

Aventura narrativa web sin dependencias. Terror psicológico coral: cuatro amigos, una cabaña, una noche.

## Cómo probarlo
Arranca el servidor de vista previa y abre `http://localhost:8123/`:

    powershell -NoProfile -ExecutionPolicy Bypass -File .claude\servir.ps1

Saltos de prueba: `index.html#o1_ouija` (ouija), `index.html#v1_necesidades` (dispersión). Añade `?debug` a la dirección para ver el selector «Ir a…» con todas las escenas.

## Cómo se juega
- **Pantalla de inicio**: Continuar (con la hora y el lugar donde se quedó), Nueva partida, sonido. El primer clic desbloquea el audio.
- **Lectura**: cada clic o espacio revela un golpe (la narración se agrupa hasta un diálogo, un pensamiento, un silencio o una frase corta). Mantener pulsado avanza rápido. Flecha abajo muestra toda la escena. `A` activa la lectura automática, `H` abre el historial, `Esc` cierra paneles.
- **Cabecera**: el retrato muestra la ficha grande al pulsarlo y late cuando cambia una relación. «Ver detalles» abre los indicadores. El menú (☰) tiene lectura automática, historial, sonido, pantalla de inicio y empezar de nuevo.
- Bajo el título de cada escena se ve la hora y el lugar.

## Estructura
- `docs/BIBLIA_PROLOGO.md` — diseño consolidado. **Referencia única para escribir la historia.**
- `docs/diseno-original/` — capturas del material original del autor.
- `js/story.js` — Fase I (escenas, personajes, estados iniciales, relaciones, catálogo de música).
- `js/story_fase2.js` — Fases II y III. `js/story_fase4.js` — Fase IV (la ouija). `js/story_fase5.js` — Fase V (la dispersión).
- `js/engine.js` — el motor: estados, relaciones, conocimiento, evidencias, HORROR_STAGE, POV, texto por golpes, directivas de escena, música, ambiente sintetizado, efectos, historial, guardado.
- `assets/fondos/` — escenarios (JPEG por espacio y por nivel de horror). `assets/personajes/fichas/` — cartas de personaje. `assets/musica/` — pistas (no se suben al repositorio público).

## Directivas de escena
Una línea sola entre corchetes dentro del texto dispara un efecto al llegar a ella y no se muestra:
`[negro]` `[luz]` `[parpadeo]` `[temblor]` `[golpe]` `[toc]` `[clic]` `[campanilla]` `[arrastre]` `[corte]` (la música se corta en seco) `[silencio]` (se funde) `[musica:clave]`.

## Música y ambiente
- El ambiente (chimenea, viento, zumbido, goteo) se sintetiza en el navegador y suena siempre por debajo, por zona: `interior`, `exterior`, `arriba`, `bano`, `cocina`, `almacen`.
- La música va por claves en `HISTORIA.musica` con volumen por clave: `fiesta`, `fiesta_southbound`, `fiesta_prnstar`, `fiesta_runrunrun`, `fiesta_seven`, `fiesta_baja`, `terror`, `terror_suave`. Fiesta hasta el final de la botella o el póker; después el terror ambiental, en dos volúmenes, con cortes donde la escena lo pide.
- Las pistas actuales son canciones comerciales: valen para jugar en local y para enviar la carpeta `dist` a alguien, pero **no deben publicarse en un sitio público**. Por eso `assets/musica/*.mp3` está en `.gitignore`: la versión de GitHub Pages suena solo con el ambiente sintetizado hasta que haya pistas libres de derechos.

## Distribución
`bash build.sh` genera `dist/`: `LaBruja.html` (CSS, JS e imágenes incrustadas) y `assets/musica/` al lado. Para enviar el juego, comprime la carpeta `dist` entera. Para publicar, sube el proyecto tal cual (`index.html` en la raíz).

## Estado
- Fases I a V escritas y probadas. Fase VI (evidencia compartida) en adelante: pendiente. Arranca con las banderas `cree_*`, `huesped_lapso`, las marcas y lo que sabe cada uno (ver Biblia, secciones 5, 12 y 13).
- Fondos reservados para las fases siguientes: `pasillo_hostil`, `pasillo_horror`, `bano_agua`, `bano_rojo`, `bano_sangre`, `bano_sucio`, `bano_horror`, `buhardilla_soga`, `salon_apagon`, `salon_gris`, `bosque_fuego`, `sotano_escalera`, `cobertizo`, `coche`, `dormitorio_nora`.
- `check.sh` verifica banderas y referencias entre escenas.

Depuración en consola del navegador: `BRUJA.estado()`, `BRUJA.ir("id_escena")`, `BRUJA.sfx.golpe()`.
