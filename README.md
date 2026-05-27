# Baile Cosmico

Site narrativo e convite interativo do Majestic Eighteen de Natasha.

## Estrutura final

```text
index.html
pages/
  convite.html
  galeria.html
  depoimentos.html
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
  mission-data.js
  cosmic-experience.js
  dynamic-invite-pdf.js
  seo.js
  galeria.js
  depoimentos.js
  playlist.js
vercel.json
```

## Convite PDF dinamico

O sistema usa `pdf-lib` no navegador para exportar um PDF a partir do preview do convite, garantindo fidelidade visual total.

Fluxo:

```text
/?nome=Natasha
```

- Detecta `nome` na URL ou pede manualmente na pagina do convite.
- Usa a imagem oficial do convite e integra o nome do convidado no preview.
- Integra a assinatura cosmica confidencial a partir de `js/mission-data.js`.
- O download gera um PDF como replica visual do preview (canvas), sem recalcular posicoes no PDF.
- Ativa o botao `Baixar Convite` para baixar o PDF personalizado.
- Funciona sem backend, compativel com Vercel.

## Sistema de identidade confidencial

Os dados oficiais ficam em:

```text
js/mission-data.js
```

Estrutura:

```js
const CONFIDENTIAL_CODES = {
    1: "RA 13h DEC -49°",
    2: "RA 18h DEC +38°",
    3: "RA 05h DEC -05°",
    4: "RA 17h DEC -23°"
};

const GUESTS = [
    {
        nome: "Joao Mukoma Dona Pedro",
        codigo: 4,
        aliases: ["Joao", "Joao Pedro", "Joao Mukoma"]
    }
];
```

Para editar convidados, altere `GUESTS`.
Para editar assinaturas cosmicas, altere `CONFIDENTIAL_CODES`.

O reconhecimento ignora maiusculas/minusculas, acentos, nomes parciais e sobrenomes adicionais quando estes estiverem nos aliases do convidado.

### Posicao no preview

Ajuste apenas em `style/invite-pdf.css`:

- `.pdf-preview-name`: nome do convidado.
- `.pdf-preview-agent-mask`: area escurecida ao lado da fingerprint.
- `.pdf-preview-agent-code`: assinatura cosmica confidencial.

O PDF descarregado e gerado por rasterizacao do preview: o script mede a posicao real no ecra (`getBoundingClientRect`) e exporta via canvas.

## Como trocar a imagem do convite futuramente

Substitua o ficheiro:

```text
assets/imagem_do_convite_baile_cosmico.jpeg
```

## Funcionalidades implementadas

- Personalizacao por link: `/?nome=Natasha`.
- Nome persistido em `localStorage` e preservado nos links internos.
- Preview e download de PDF personalizado em tempo real com `pdf-lib`.
- Ajuste automatico de fonte para nomes longos.
- Botao elegante de voltar em todas as paginas.
- Loading screen, transicoes suaves e visual premium/cinematografico.
- Portal cinematografico na primeira visita (`js/cosmic-gate.js`).
- Confirmacao de presenca na pagina do convite (`js/rsvp.js`).

## Teste rapido

```text
http://localhost:4174/pages/convite.html?nome=Natasha
```
