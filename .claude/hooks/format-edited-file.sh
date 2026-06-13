#!/usr/bin/env bash
# PostToolUse hook: formata o arquivo que o Claude acabou de editar.
#
# Este repo usa ESLint 9 + Prettier (NÃO Biome). Espelha o que o lint-staged faz
# no pre-commit (.lintstagedrc.json): `eslint --fix` + `prettier --write`, porém
# apenas no arquivo recém-editado, evitando o custo de rodar no repo inteiro.
#
# Lê o JSON do evento no stdin, extrai tool_input.file_path e formata se for um
# arquivo suportado. Nunca bloqueia o fluxo: sai com 0 mesmo em falha.

set -u

input="$(cat)"

# Extrai o file_path do JSON sem depender de jq (node é garantido neste repo).
file="$(printf '%s' "$input" | node -e "
let raw = '';
process.stdin.on('data', (c) => { raw += c; });
process.stdin.on('end', () => {
  try {
    const json = JSON.parse(raw);
    process.stdout.write(json.tool_input?.file_path ?? '');
  } catch {
    process.stdout.write('');
  }
});
" 2>/dev/null)"

[ -z "$file" ] && exit 0
[ -f "$file" ] || exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

case "$file" in
  # TS/JS: ESLint corrige o que dá, depois Prettier formata.
  *.ts | *.tsx | *.mts | *.cts | *.js | *.jsx | *.mjs | *.cjs)
    pnpm exec eslint --fix "$file" >/dev/null 2>&1
    pnpm exec prettier --write "$file" >/dev/null 2>&1
    ;;
  # JSON/CSS/MD/YAML: só Prettier.
  *.json | *.jsonc | *.css | *.scss | *.md | *.mdx | *.yml | *.yaml)
    pnpm exec prettier --write "$file" >/dev/null 2>&1
    ;;
  *) ;;
esac

exit 0
