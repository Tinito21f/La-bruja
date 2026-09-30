#!/usr/bin/env bash
export LC_ALL=C
# Verificador estático: banderas leídas que nadie escribe, escritas que nadie lee, y escenas referenciadas
# que no existen. Entiende las banderas dinámicas más comunes:
#   api.marcar(p + "_miente")            → sufijo «_miente» en juego (alex_miente, marcos_miente…)
#   const clave = "v_resuelta_" + ruta    → prefijo «v_resuelta_» en juego
#   [...].forEach((f) => api.marcar(f))   → las cadenas de la lista cuentan como escritas
cd "$(dirname "$0")"
files="js/story.js $(ls js/story_*.js 2>/dev/null)"
escritas=$(grep -oh 'marcar("[a-zA-Z0-9_]*"' $files | sed 's/marcar("//;s/"//' | grep -v '_$' | sort -u)
listas=$(grep -hE 'forEach\(\([a-z]+\) => api\.marcar\(' $files | grep -oE '"[a-zA-Z0-9_]+"' | tr -d '"' | sort -u)
leidas=$(grep -oh 'bandera("[a-zA-Z0-9_]*"' $files | sed 's/bandera("//;s/"//' | grep -v '_$' | sort -u)
# claves escritas por el motor
motor="marcos_setas alex_setas irene_setas nora_setas fascinacion_rota nora_perdido marcos_perdido alex_perdido irene_perdido"
# prefijos ("algo_" + x) y sufijos (x + "_algo") que aparecen concatenados en el código
pref=$(grep -ohE '"[a-zA-Z0-9_]+_" \+' $files | sed -E 's/"([a-zA-Z0-9_]+_)" \+/\1/' | sort -u)
suf=$(grep -ohE '\+ "_[a-zA-Z0-9_]+"' $files | sed -E 's/\+ "(_[a-zA-Z0-9_]+)"/\1/' | sort -u)
re=""
for p in $pref; do re="$re|^$p"; done
for s in $suf; do re="$re|$s\$"; done
re="${re#|}"
filtro_dinamico() { if [ -n "$re" ]; then grep -vE "$re"; else cat; fi; }

echo "== Banderas dinámicas reconocidas (prefijos / sufijos) =="
echo "  prefijos: $(echo $pref | tr '\n' ' ')"
echo "  sufijos:  $(echo $suf | tr '\n' ' ')"
echo "== Banderas leídas que nadie escribe =="
comm -23 <(echo "$leidas") <( (echo "$escritas"; echo "$listas"; echo "$motor" | tr " " "
") | sort -u) | grep -v "^$" | filtro_dinamico || echo "(ninguna)"
echo "== Banderas escritas que nadie lee =="
comm -13 <( (echo "$leidas"; echo "$motor" | tr " " "
") | sort -u) <( (echo "$escritas"; echo "$listas") | sort -u) | grep -v '^$' | filtro_dinamico || echo "(ninguna)"
echo "== Escenas referenciadas que no existen =="
def=$(grep -ohE '^ {2,4}[a-zA-Z0-9_]+: \{' $files | sed 's/^ *//;s/: {//' | sort -u)
ref=$(grep -oh '[^a-zA-Z_]a: "[a-zA-Z0-9_]*"' $files | sed 's/.*a: "//;s/"//' | sort -u)
comm -13 <(echo "$def") <(echo "$ref") | grep -v '^$' || echo "(ninguna)"
echo "== Posibles destinos dinámicos (a: (api) => …) que no son escenas (revisar a mano) =="
dyn=$(grep -hE '(^|[^a-zA-Z_])a: \(api\) =>' $files | grep -oE '"[a-zA-Z0-9_]+"' | tr -d '"' | sort -u)
conocidas=$( (echo "$escritas"; echo "$leidas"; echo "$listas"; echo "$motor" | tr " " "
"; printf 'nora\nmarcos\nalex\nirene\n') | sort -u)
comm -23 <(echo "$dyn") <(echo "$def") | comm -23 - <(echo "$conocidas") | grep -v '^$' | filtro_dinamico || echo "(ninguno)"
