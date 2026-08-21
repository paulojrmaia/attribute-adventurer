# Correção dos erros do projeto

## Diagnóstico

A verificação de tipos passa sem erros, mas o servidor de desenvolvimento está quebrando a cada carregamento de página com o erro:

```text
[lightningcss] @import rules must precede all rules aside from @charset and @layer statements
File: src/styles.css
```

Causa: em `src/styles.css` a fonte do Google (`Press Start 2P` / `VT323`) é carregada com `@import url('https://fonts.googleapis.com/...')` na linha 8, ou seja, depois de `@source` e `@custom-variant`. O Tailwind v4 (Lightning CSS) exige que todos os `@import` venham antes de qualquer outra regra — e fontes remotas não devem ser importadas pelo CSS neste stack.

Enquanto isso não for corrigido, o CSS não é servido: o app aparece sem estilo/pixel art no preview.

## O que será feito

1. Remover o `@import url(...)` das fontes do Google de `src/styles.css`, mantendo os `@import` do Tailwind no topo do arquivo.
2. Carregar as fontes via tags `<link>` no `head()` de `src/routes/__root.tsx` (preconnect para `fonts.googleapis.com` e `fonts.gstatic.com` + stylesheet da fonte).
3. Corrigir os metadados genéricos do `__root.tsx` ("Lovable App" / "Lovable Generated Project") para o título e descrição do Pixel Quest, já que são o fallback do site.
4. Revalidar: recarregar o preview e confirmar que não há mais erro no log do servidor nem no console do navegador, e que a estilização pixel art aparece.

## Detalhes técnicos

- Nenhuma mudança de lógica, rotas ou banco de dados.
- Os `@import "tailwindcss"` e `@import "tw-animate-css"` permanecem como as primeiras linhas de `src/styles.css`.
