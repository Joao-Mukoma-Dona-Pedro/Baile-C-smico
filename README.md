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
  agradecimentos.html
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

```text
PDF: 360 x 504 pt
Centro do nome: x = 93 pt
Linha base do nome: y = 27 pt
Largura maxima: 92 pt
Mascara do placeholder: x = 56 pt, y = 19 pt, width = 80 pt, height = 21 pt
```

## Onde configurar posicao, fonte e tamanho do nome

Abra `js/dynamic-invite-pdf.js` e ajuste o bloco `INVITE_CONFIG.agentName`:

```js
agentName: {
  x: 93,
  y: 27,
  maxWidth: 92,
  fontSize: 7.8,
  minFontSize: 5.2,
  font: "CourierBold",
  color: { r: 0.91, g: 0.74, b: 0.43 },
  uppercase: true,
  letterSpacing: 0.35,
  coverPlaceholder: {
    x: 56,
    y: 19,
    width: 80,
    height: 21
  }
}
```

- `x`: centro horizontal do nome na area `AGENTE No.`.
- `y`: linha base vertical do nome.
- `maxWidth`: largura maxima antes de reduzir a fonte automaticamente.
- `fontSize`: tamanho inicial do nome.
- `minFontSize`: menor tamanho permitido para nomes longos.
- `coverPlaceholder`: mascara escura aplicada so sobre o texto antigo.
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
- Mensagem final clara: "Tudo isso foi apenas uma experiencia artistica/interativa para surpreender os convidados."

## Teste rapido

```text
http://localhost:4174/pages/convite.html?nome=Natasha
```