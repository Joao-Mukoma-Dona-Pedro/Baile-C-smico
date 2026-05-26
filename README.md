# Baile Cosmico

Site narrativo e convite interativo do Majestic Eighteen de Natasha.

## Estrutura final

```text
index.html
pages/
  convite.html
  galeria.html
  depoimentos.html
  curiosidades.html
  playlist.html
assets/
  imagem_do_convite_baile_cosmico.jpeg
  Downloads/
    Tasha's birthday invitation.-1.pdf
imagens/
style/
  style.css
  invite-pdf.css
  galeria.css
  depoimentos.css
  playlist.css
js/
  cosmic-experience.js
  dynamic-invite-pdf.js
  seo.js
  galeria.js
  depoimentos.js
  playlist.js
vercel.json
```

## Convite PDF dinamico

O sistema usa `pdf-lib` no navegador para exportar um PDF a partir do preview do convite (imagem oficial + nome do convidado), garantindo fidelidade visual total.

Fluxo:

```text
/?nome=Natasha
```

- Detecta `nome` na URL ou pede manualmente na pagina do convite.
- Usa a imagem oficial do convite e integra o nome do convidado no preview.
- O download gera um PDF como replica visual do preview (canvas), sem recalcular coordenadas no PDF.
- Ativa o botao `Baixar Convite` para baixar o PDF personalizado.
- Funciona sem backend, compativel com Vercel.

### Posicao do nome no preview

Ajuste apenas em `style/invite-pdf.css` (classe `.pdf-preview-name`). A mascara `.pdf-preview-agent-mask` e opcional.

O PDF descarregado e gerado por rasterizacao do preview: o script mede a posicao real no ecran (`getBoundingClientRect`) e exporta via canvas — nao recalcula texto no PDF.
- `color`: cor RGB normalizada de `0` a `1`.
- `font`: fonte padrao do `pdf-lib`.

## Como trocar a imagem do convite futuramente

Substitua o ficheiro:

```text
assets/imagem_do_convite_baile_cosmico.jpeg
```

## Funcionalidades implementadas

- Personalizacao por link: `/?nome=Natasha`.
- Nome persistido em `localStorage` e preservado nos links internos.
- Preview e download de PDF personalizado em tempo real com `pdf-lib` (o PDF e uma rasterizacao do preview).
- Ajuste automatico de fonte para nomes longos.
- Botao elegante de voltar em todas as paginas.
- Loading screen, transicoes suaves e visual premium/cinematografico.
- Portal hacker cinematografico na primeira visita (`js/cosmic-gate.js`).
- Confirmacao de presenca na pagina do convite (`js/rsvp.js`).

## Teste rapido

```text
http://localhost:4174/pages/convite.html?nome=Natasha
```