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
  convite-base.pdf
  convite-base-preview.png
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

O sistema usa `pdf-lib` no navegador para abrir `assets/convite-base.pdf`, escrever o nome do convidado e gerar um novo PDF em tempo real.

Fluxo:

```text
/?nome=Natasha
```

- Detecta `nome` na URL ou pede manualmente na pagina do convite.
- Preserva o design do PDF original.
- Substitui apenas o placeholder abaixo de `AGENTE No.`.
- Gera preview visual no site usando `assets/convite-base-preview.png`, alinhado as mesmas coordenadas do PDF.
- Ativa o botao `Baixar Convite` para baixar o PDF personalizado.
- Funciona sem backend, compativel com Vercel.

## Coordenadas usadas

O nome e aplicado apenas no canto inferior esquerdo, abaixo da impressao digital, no espaco onde estava:

```text
(INSIRA O SEU NUMERO DE AGENTE)
```

### Posicao do nome no preview

Ajuste apenas em `style/invite-pdf.css` (classes `.pdf-preview-name` e `.pdf-preview-agent-mask`).

O PDF descarregado e gerado por rasterizacao do preview: o script mede a posicao real no ecran (`getBoundingClientRect`) e exporta via canvas — nao recalcula texto no PDF.
- `color`: cor RGB normalizada de `0` a `1`.
- `font`: fonte padrao do `pdf-lib`.

## Como trocar o PDF base futuramente

1. Exporte um convite sem nome em PDF.
2. Substitua o arquivo:

```text
assets/convite-base.pdf
```

3. Se quiser usar outro caminho, altere `basePdfUrl` em:

```text
js/dynamic-invite-pdf.js
```

## Funcionalidades implementadas

- Personalizacao por link: `/?nome=Natasha`.
- Nome persistido em `localStorage` e preservado nos links internos.
- Preview e download de PDF personalizado em tempo real com `pdf-lib`.
- Nome aplicado somente na regiao `AGENTE No.`, sem alterar o centro do convite.
- Ajuste automatico de fonte para nomes longos.
- Botao elegante de voltar em todas as paginas.
- Loading screen, transicoes suaves e visual premium/cinematografico.
- Portal hacker cinematografico na primeira visita (`js/cosmic-gate.js`).
- Confirmacao de presenca na pagina do convite (`js/rsvp.js`).

## Teste rapido

```text
http://localhost:4174/pages/convite.html?nome=Natasha
```