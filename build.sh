#!/usr/bin/env bash
# Genera dist/: LaBruja.html (CSS, JS e imágenes incrustadas) + assets/musica (la música se sirve aparte).
# Para enviar el juego: comprime la carpeta dist entera. Para publicar: sube el proyecto tal cual (index.html).
set -e
cd "$(dirname "$0")"
mkdir -p dist/assets
out=dist/LaBruja.html

js=$(cat js/story.js js/story_fase2.js js/story_fase4.js js/story_fase5.js)
for f in assets/fondos/*.webp assets/fondos/*.jpg assets/personajes/fichas/*.webp; do
  [ -f "$f" ] || continue
  case "$f" in *.webp) mime="image/webp";; *.jpg) mime="image/jpeg";; esac
  b64=$(base64 -w0 "$f")
  js=${js//"$f"/"data:$mime;base64,$b64"}
done
fav=$(base64 -w0 assets/favicon.png 2>/dev/null || true)

{
  echo '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#050507"><title>La Bruja</title>'
  [ -n "$fav" ] && echo "<link rel=\"icon\" type=\"image/png\" href=\"data:image/png;base64,$fav\">"
  echo '<style>'
  cat css/style.css
  echo '</style></head><body>'
  sed -n '/<body>/,/<\/body>/p' index.html | sed '1d;$d' | grep -v '<script'
  echo '<script>'
  printf '%s\n' "$js"
  echo '</script><script>'
  cat js/engine.js
  echo '</script></body></html>'
} > "$out"

# La música va al lado del archivo, sin incrustar: pesa demasiado y el navegador la carga a medida que suena.
rm -rf dist/assets/musica
cp -r assets/musica dist/assets/musica
ls -la "$out" && du -sh dist
