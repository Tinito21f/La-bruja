#!/usr/bin/env bash
export LC_ALL=C
# Verificador estático: banderas leídas que nadie escribe, y escritas que nadie lee.
cd "$(dirname "$0")"
files="js/story.js $(ls js/story_*.js 2>/dev/null)"
escritas=$(grep -oh 'marcar("[a-zA-Z0-9_]*"' $files | sed 's/marcar("//;s/"//' | grep -v '_$' | sort -u)
leidas=$(grep -oh 'bandera("[a-zA-Z0-9_]*"' $files | sed 's/bandera("//;s/"//' | grep -v '_$' | sort -u)
# claves escritas por el motor
motor="marcos_setas alex_setas irene_setas nora_setas fascinacion_rota nora_perdido marcos_perdido alex_perdido irene_perdido"
echo "== Banderas leídas que nadie escribe =="
comm -23 <(echo "$leidas") <( (echo "$escritas"; echo "$motor" | tr " " "
") | sort -u) | grep -v "^$" || echo "(ninguna)"
echo "== Banderas escritas que nadie lee =="
comm -13 <(echo "$leidas") <(echo "$escritas") | grep -v '^$' || echo "(ninguna)"
echo "== Escenas referenciadas que no existen =="
def=$(grep -ohE '^ {2,4}[a-zA-Z0-9_]+: {' $files | sed 's/^ *//;s/: {//' | sort -u)
ref=$(grep -oh '[^a-zA-Z_]a: "[a-zA-Z0-9_]*"' $files | sed 's/.*a: "//;s/"//' | sort -u)
comm -13 <(echo "$def") <(echo "$ref") | grep -v '^$' || echo "(ninguna)"
