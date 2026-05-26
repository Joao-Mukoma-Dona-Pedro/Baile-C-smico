# -*- coding: utf-8 -*-
import html
from pathlib import Path

stanzas = [
    ("light", None, "01", "Como descreverias a Natasha em três palavras?", "Allie", ["Altruísta.", "Engenhosa.", "Hella crazy fun."], False, False),
    ("cosmic", "one", "02", "Qual foi o momento mais marcante que já viveste com ela?", "Ariel", ["Acho que foi no aniversário da Relícia.", "Não foi apenas o momento do piquenique,", "mas também todo o processo de preparação.", "", "Foi realmente muito, muito fixe."], False, False),
    ("light", None, "03", "O que sentes quando estás com a Natasha?", "Edvânia", ["Sinto-me muitíssimo feliz,", "porque, às vezes,", "mesmo quando estou sem vontade de sorrir,", "as tuas brincadeiras são sempre", "uma das melhores formas de me alegrar."], False, False),
    ("cosmic", "two", "04", "O que achas que me torna diferente das outras pessoas?", "Evalinda", ["Eis algumas das tuas diferenças:", "", "Possuis um pensamento crítico diferente.", "És empática, algo que admiro muito em ti.", "Tens sabedoria: procuras saber antes de julgar.", "Entendes as nossas diferenças", "e ajudas sempre que podes.", "", "Sabes quando estar séria", "e quando fazer brincadeiras.", "Ajudas as pessoas a sentirem-se melhor.", "És alguém sem preferências:", "todos podem chegar e sentir-se bem-vindos.", "", "Tens humildade, organização,", "mistério e diversão.", "És séria, brincalhona", "e incrível. Acredita!"], True, False),
    ("light", None, "05", "Se tivesses de resumir a energia dela, como seria?", "Mariene", ["Há pessoas cuja presença não se explica:", "sente-se.", "", "Ela é exatamente isso:", "uma energia que não se limita ao espaço que ocupa,", "mas que se estende, silenciosamente,", "a tudo e a todos à volta.", "", "Há nela uma força quase imperceptível à primeira vista,", "mas que, com o tempo,", "se revela e se expande,", "envolvendo quem está por perto", "de forma natural e cativante.", "", "Não é nada forçado,", "nem previamente construído.", "É simplesmente parte de quem ela é:", "simpática, inteligente, sonhadora", "e ambiciosa no sentido mais nobre da palavra.", "", "Talvez seja essa uma das infinitas combinações", "que a tornam tão especial."], True, False),
    ("cosmic", "three", "06", "Qual foi o momento mais engraçado que já tiveste com ela?", "Sócrates", ['És muito engraçada e muito maluquinha, kkk.', "Por isso, é difícil escolher só um momento.", "", "Mas, se tivesse de dizer um,", "escolheria o mais recente:", "o dia em que me deste o meu presente", "e estávamos a caminhar.", "O tio Manguxo quis falar com o sobrinho dele,", "mas ele não estava em condições, juro.", "", "Depois, mais à frente, na faculdade,", "quando me puxaste,", "fizeste aquela cena com a língua", "enquanto fingias chorar.", 'O guarda ficou a olhar para nós com uma cara do tipo:', '"Meu Deus, o que é isto? Tenho mesmo de assistir a isto?"', "", 'Eu comecei a rir e disse:', '"Olha só esse cota."', "Ele desviou o olhar, todo desconfiado,", "e nós começámos a rir dele, kkk.", "", "Ou então quando te vi a beber quissangua.", "Tu não sabes beber quissangua, kkk.", "Os gestos que fazias,", "a agitar, a virar...", "aquilo não estava bom."], True, False),
    ("light", None, "07", "Uma memória pequena, mas especial, que nunca esqueceste?", "Josimira", ["Lembro-me de quando me consolaste,", "na 11.ª classe,", "quando eu tinha dificuldades", "em fazer a minha apresentação em inglês.", "", "Eu sentia-me muito mal por não conseguir falar.", "Enviei-te uma mensagem triste,", "a explicar por que não conseguia falar", "e por que chorei naquele dia", "quando o professor me repreendeu.", "", "Tu disseste-me para me esforçar,", "para não ficar triste,", "e que, apesar de eu ser muito emotiva,", "precisava ultrapassar esse medo de falar."], True, False),
    ("cosmic", "four", "08", "Qual foi uma situação difícil em que viste a força dela?", "Lwena", ["Foi quando descobriste aquilo.", "Sinceramente, admirei muito", "o modo como apoiaste a tua mãe.", "", "Eu sei que viver uma realidade diferente,", "de um dia para o outro,", "é difícil.", "Odiar alguém que tanto amas também é.", "", "E nunca te vi a lamentares-te", "nem a fazeres-te de vítima.", "Isso, sinceramente,", "impressiona-me até hoje."], False, False),
    ("light", None, "09", "Um momento em que pensaste: «ela é mesmo única»?", "Ariel", ["Acho que sempre que via os teus trabalhos.", "Eu ficava a pensar:", "esta miúda é muito competente, juro.", "", "Empenhas-te muito", "e fazes tudo bem", "quando te delegam alguma tarefa.", "Trabalhas com criatividade e responsabilidade.", "", "Sempre te considerei", "uma mulher única lá no Liceu."], False, False),
    ("cosmic", "five", "10", "Como a Natasha mudou desde que a conheces?", "Tóldia", ["A Natasha mudou bastante desde que a conheci.", "Tornou-se mais madura,", "e isso nota-se claramente nas atitudes dela.", "", "Mas talvez a maior mudança", "se tenha refletido em mim,", "porque, aos poucos,", "ela acabou por preencher espaços vazios", "que existiam em mim.", "", "Tornou-se alguém", "por quem criei uma consideração muito especial."], False, False),
    ("light", None, "11", "O que achas que ela ainda não percebe sobre si mesma?", "Baljeet", ["O quão forte e capaz ela é.", "", "Às vezes, gostaria que ela se visse", "como eu a vejo:", "uma miúda incrível,", "determinada", "e cheia de força de vontade.", "", "Acredito que ela conseguirá alcançar", "tudo aquilo que almeja.", "", "BE CONFIDENT, GIRL."], False, False),
    ("cosmic", "six", "12", "Em que momento achas que ela mais brilha?", "Obama", ["Acho que tu estás no teu melhor", "quando entras naquela simbiose", "entre a Natasha emocional", "e a Natasha profissional.", "", "Também acho que brilhas", "quando estás diante de algum impasse da vida", "e precisas de mostrar que sabes alguma coisa.", "", 'Ali tu demonstras:', '"Ya, esta é a Natasha."', "", "Basicamente, acho que brilhas", "quando és a tua parte emocional", "misturada com a profissional,", "e não quando és apenas uma ou apenas outra."], True, False),
    ("light", None, "13", "Qual é o meu maior talento que talvez eu subestime?", "Edvirgem", ["Amiga, tu tens muitos talentos.", "Só o facto de seres brega", "já te torna especial.", "", "És uma miúda que sabe começar uma discussão", "e terminá-la em risos.", "Tens o dom de sensibilizar as pessoas", "e de fazer com que coisas impossíveis", "pareçam possíveis.", "", "Tens o dom de aprender rápido,", "de ajudar mesmo quando parece", "que não te importas com ninguém.", "", "Quase me esquecia:", "tens o dom de ouvir todos", "e de aconselhar sempre que for preciso.", "Tens o dom de fazer as pessoas felizes", "e de organizar o que parece estar um caos.", "", "Sem esquecer que és a minha editora favorita."], True, False),
    ("cosmic", "one", "14", "Como descreverias o coração dela?", "Sócrates", ["Eu diria que o teu coração", "parece o motor de um carro de Fórmula 1,", "pela intensidade com que sente.", "", "Tal como esse motor,", "que tem muita força", "e uma energia muito concentrada,", "o teu coração é bastante intenso.", "", "Parece que tudo aí dentro", "tende ao máximo.", "Mesmo assim, ele resiste", "a tudo e a qualquer coisa a mais", "que as pessoas nem sempre notam."], False, False),
    ("light", None, "15", "O que achas que o futuro reserva para mim?", "João Pedro", ["Acho que, no futuro,", "estudarás numa universidade renomada", "nos Estados Unidos ou na Inglaterra.", "O teu nome sairá em manchetes", "como a estudante angolana", "que fez história ao entrar", "numa universidade de elite.", "", "Brilharás na universidade", "e formar-te-ás com honra.", "Talvez, durante o segundo ano,", "lances o teu livro,", "e ele torne-se um bestseller.", "As pessoas vão amá-lo tanto", "que a Disney produzirá um filme baseado nele.", "", "Nas férias de verão,", "farás intercâmbio em países como França,", "Suíça, Alemanha, Brasil, China e Japão.", "Falarás cerca de seis idiomas", "e, ainda assim,", "vais entrar em mais cursos de línguas.", "", "Depois de uma universidade bem-sucedida,", "farás um mestrado ou doutoramento na Suíça.", "Imagino-te com uma bata,", "calças de ganga, ténis", "e óculos de laboratório.", "Prenderás o cabelo com um elástico", "enquanto observas o comportamento", "de um reator de partículas", "e fazes anotações num bloco muito nerd,", "tipo tu.", "", "Quando terminares o doutoramento em física quântica,", "publicarás um artigo", "que te levará ao teu primeiro Nobel.", "Serás a mulher mais jovem", "a receber um Nobel de Física.", "", "Casarás com um homem bonito,", "terão, no máximo, quatro filhos", "porque acho que ele não vai querer mais do que isso, kkk.", "Entre os 28 e os 35 anos,", "voltarás para Angola", "com o objetivo de contribuir", "para o primeiro laboratório de ciências avançadas.", "", "Também terás um doutoramento em neurocirurgia", "e abrirás uma editora", "para jovens escritores em Angola.", "A Fundação Luméria será reconhecida pela ONU,", "e tu ganharás um lugar lá.", "", "Serás um dos nomes mais mencionados do século XXI.", "Além do teu sucesso académico e profissional,", "serás a mulher ideal de alguém", "e, com certeza, uma linda mãe.", "", "Se quiseres que eu diga tudo,", "terá de ser pessoalmente."], False, True),
    ("cosmic", "two", "16", "Uma coisa que amas nela e nunca disseste?", "Esleidy", ["A tua determinação.", "", "Tu és a definição de tudo ao seu tempo:", "quando é para estudar,", "é mesmo para estudar;", "quando é para rir ou brincar,", "é mesmo para viver esses momentos;", "quando é para ajudar,", "é mesmo para ajudar,", "e não medes esforços para isso.", "", "Então, o que eu mais amo em ti", "é a tua determinação."], False, False),
    ("light", None, "17", "Uma frase que define a Natasha?", "Relícia", ['"Um momento de felicidade!', "Não será isso bastante para preencher uma vida?\"", "", "Ou:", '"Nada é possível até que me provem o contrário."', "", "Ou ainda:", '"Eu não faço porque sei,', 'mas porque quero aprender."', "", "Fico com a última,", "mas as outras também têm muito a ver."], False, False),
    ("cosmic", "three", "18", "Se ela fosse um elemento, qual seria?", "Jota", ["Seria o ar.", "", "Para mim, o ar está ligado", "ao pensamento,", "à criatividade", "e à comunicação.", "", "Ele representa inteligência,", "leveza", "e curiosidade."], False, False),
    ("light", None, "19", "Se ela fosse uma música, qual seria?", "Miriam", ["Suzanne, da Raye.", "", "Tirando uma parte específica da música, kkk,", "ela passa muito a tua vibe."], False, False),
]


def verse_html(lines):
    parts = []
    for line in lines:
        parts.append("<br>" if line == "" else html.escape(line) + "<br>")
    return "\n                    ".join(parts)


def build_section(mode, bg, num, question, author, lines, dense, epic):
    classes = ["cordel-stanza", "reveal", f"cordel-stanza--{mode}"]
    if dense:
        classes.append("is-dense")
    if epic:
        classes.append("is-epic")
    data = f' data-bg="{bg}"' if bg else ""
    return f"""        <section class="{' '.join(classes)}"{data}>
            <div class="cordel-stanza__bg" aria-hidden="true"></div>
            <article class="cordel-panel">
                <p class="cordel-number">{num}</p>
                <h2 class="cordel-question">{html.escape(question)}</h2>
                <p class="cordel-author">{html.escape(author)}</p>
                <div class="cordel-verse">
                    {verse_html(lines)}
                </div>
            </article>
        </section>"""


sections = "\n".join(build_section(*s) for s in stanzas)

page = f"""<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Depoimentos emocionais sobre Natasha, organizados como cordel moderno no universo do Baile Cósmico.">
    <meta name="theme-color" content="#070a1f">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://baile-cosmico.vercel.app/pages/depoimentos.html">
    <link rel="icon" href="../favicon.svg" type="image/svg+xml">
    <link rel="preload" as="image" href="../imagens/foto-header.jpeg">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Baile Cósmico">
    <meta property="og:title" content="Depoimentos para Natasha | Baile Cósmico">
    <meta property="og:description" content="Um livro emocional interativo com memórias, carinho e palavras especiais para Natasha.">
    <meta property="og:url" content="https://baile-cosmico.vercel.app/pages/depoimentos.html">
    <meta property="og:image" content="https://baile-cosmico.vercel.app/imagens/foto-header.jpeg">
    <meta name="twitter:card" content="summary_large_image">
    <title>Depoimentos para Natasha | Baile Cósmico</title>
    <link rel="stylesheet" href="../style/depoimentos.css">
    <link rel="stylesheet" href="../style/experience.css">
    <link rel="stylesheet" href="../style/cosmic-gate.css">
    <script>
        if (!sessionStorage.getItem("baile_cosmico_gate_passed")) {{
            document.documentElement.classList.add("cosmic-gate-pending");
        }}
    </script>
</head>
<body class="cordel-page" data-page-title="Depoimentos para Natasha">
    <a class="skip-link" href="#conteudo">Saltar para o conteúdo</a>
    <header class="cordel-hero" role="banner">
        <nav class="links" aria-label="Navegação principal">
            <a href="../index.html">Início</a>
            <a href="convite.html">Convite</a>
            <a href="galeria.html">Galeria</a>
            <a href="curiosidades.html">Curiosidades</a>
            <a href="playlist.html">Playlist</a>
        </nav>
        <div class="cordel-hero__content reveal">
            <p class="eyebrow">Baile Cósmico</p>
            <h1><span>Depoimentos</span><span>para Natasha</span></h1>
            <p class="cordel-hero__intro">
                Um livro emocional em estrofes — vozes que guardam carinho,
                memória e pequenos universos sobre quem ela é.
            </p>
        </div>
    </header>
    <main id="conteudo">
{sections}
    </main>
    <footer>
        <p>Desenvolvido por <a href="https://github.com/Joao-Mukoma-Dona-Pedro" target="_blank" rel="noopener noreferrer">João Pedro</a></p>
    </footer>
    <script src="../js/cosmic-gate.js"></script>
    <script src="../js/seo.js" defer></script>
    <script src="../js/depoimentos.js" defer></script>
    <script src="../js/cosmic-experience.js" defer></script>
</body>
</html>
"""

Path("pages/depoimentos.html").write_text(page, encoding="utf-8")
print("OK", Path("pages/depoimentos.html").stat().st_size)
