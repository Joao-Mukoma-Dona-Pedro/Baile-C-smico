const tracks = [
    {
        titulo: "Here Comes The Cowboy",
        artista: "Mac DeMarco",
        capa: "../images/foto32.jpeg",
        url: "https://open.spotify.com/album/4i608RpN07GeF7DBW0N1nA",
        descricao: "Album calmo e contemplativo que traz um clima sonhador e noturno para a playlist.",
        mood: "album indie e contemplativo"
    }
    ,{
        titulo: "Salad Days",
        artista: "Mac DeMarco",
        capa: "../images/foto24.jpeg",
        url: "https://open.spotify.com/album/7xPhDaYZ2ejV04aNtdBdvj",
        descricao: "Um dos albuns mais marcantes do Mac DeMarco, perfeito para reforcar a nostalgia da noite.",
        mood: "album nostalgico e charmoso"
    }
    ,{
        titulo: "2",
        artista: "Mac DeMarco",
        capa: "../images/Foto 3.jpeg",
        url: "https://open.spotify.com/search/mac%20demarco%20album%202",
        descricao: "A fase mais crua e vintage do artista, muito boa para dar personalidade a selecao.",
        mood: "album cru e vintage"
    }
    ,{
        titulo: "Addicted",
        artista: "Jorja Smith",
        capa: "../images/foto-header.jpeg",
        url: "https://open.spotify.com/search/addicted%20jorja%20smith",
        descricao: "Uma faixa suave e envolvente para abrir a atmosfera do baile com elegancia.",
        mood: "suave, noturno e marcante"
    },
    {
        titulo: "Pink + White",
        artista: "Frank Ocean",
        capa: "../images/Foto 3.jpeg",
        url: "https://open.spotify.com/search/pink%20and%20white%20frank%20ocean",
        descricao: "Traz um brilho sentimental e moderno para a playlist.",
        mood: "sonhador e emocional"
    },
    {
        titulo: "97",
        artista: "Doja Cat",
        capa: "../images/Foto 8.jpeg",
        url: "https://open.spotify.com/search/97%20doja%20cat",
        descricao: "Uma energia mais ousada para quebrar o ritmo com atitude.",
        mood: "confiante e urbano"
    },
    {
        titulo: "PRIDE",
        artista: "Kendrick Lamar",
        capa: "../images/foto24.jpeg",
        url: "https://open.spotify.com/search/pride%20kendrick%20lamar",
        descricao: "Calma, profunda e perfeita para uma pausa contemplativa.",
        mood: "introspectivo e sofisticado"
    },
    {
        titulo: "LOVE",
        artista: "Kendrick Lamar e Zacari",
        capa: "../images/foto29.jpeg",
        url: "https://open.spotify.com/search/love%20kendrick%20lamar",
        descricao: "Romantica e acessivel, combina muito bem com o clima do evento.",
        mood: "romantico e caloroso"
    },
    {
        titulo: "Heathens",
        artista: "Twenty One Pilots",
        capa: "../images/Foto 14.jpeg",
        url: "https://open.spotify.com/search/heathens%20twenty%20one%20pilots",
        descricao: "Um lado mais misterioso e dramatico para a sequencia musical.",
        mood: "sombrio e cinematografico"
    },
    {
        titulo: "Cara Metade",
        artista: "TRX",
        capa: "../images/Foto 16.jpeg",
        url: "https://open.spotify.com/search/cara%20metade%20trix",
        descricao: "Uma escolha emocional que aproxima a playlist do teu gosto pessoal.",
        mood: "afetivo e melancolico"
    },
    {
        titulo: "Nove e Meia",
        artista: "TRX",
        capa: "../images/Foto 17.jpeg",
        url: "https://open.spotify.com/search/nove%20e%20meia%20trix",
        descricao: "Acrescenta identidade e um toque mais intimo a selecao.",
        mood: "urbano e sensivel"
    },
    {
        titulo: "Cyaho",
        artista: "Molchat Doma",
        capa: "../images/Foto 19.jpeg",
        url: "https://open.spotify.com/search/cyaho%20molchat%20doma",
        descricao: "Uma textura fria e hipnotica para um momento mais alternativo.",
        mood: "frio e hipnotico"
    },
    {
        titulo: "No Idea",
        artista: "Don Toliver",
        capa: "../images/Foto 20.jpeg",
        url: "https://open.spotify.com/search/no%20idea%20don%20toliver",
        descricao: "Mistura suavidade e groove moderno de forma muito eficiente.",
        mood: "fluido e moderno"
    },
    {
        titulo: "FE!N",
        artista: "Travis Scott",
        capa: "../images/foto21.jpeg",
        url: "https://open.spotify.com/search/fein%20travis%20scott",
        descricao: "Serve para levantar a energia da pista de forma agressiva.",
        mood: "intenso e explosivo"
    },
    {
        titulo: "Smells Like Teen Spirit",
        artista: "Nirvana",
        capa: "../images/foto22.jpeg",
        url: "https://open.spotify.com/search/smells%20like%20teen%20spirit%20nirvana",
        descricao: "Classico absoluto para dar peso e rebeldia a playlist.",
        mood: "iconico e rebelde"
    },
    {
        titulo: "Come As You Are",
        artista: "Nirvana",
        capa: "../images/foto23.jpeg",
        url: "https://open.spotify.com/search/come%20as%20you%20are%20nirvana",
        descricao: "Mantem o tom rock de forma mais arrastada e memoravel.",
        mood: "grunge e atmosferico"
    },
    {
        titulo: "Lithium",
        artista: "Nirvana",
        capa: "../images/foto25.jpeg",
        url: "https://open.spotify.com/search/lithium%20nirvana",
        descricao: "Outra entrada forte para a parte mais crua e emocional da lista.",
        mood: "cru e catartico"
    },
    {
        titulo: "Crazy Train",
        artista: "Ozzy Osbourne",
        capa: "../images/foto26.jpeg",
        url: "https://open.spotify.com/search/crazy%20train%20ozzy%20osbourne",
        descricao: "Uma explosao classica para um momento de energia maxima.",
        mood: "classico e eletrico"
    },
    {
        titulo: "Made For Lovin You",
        artista: "KISS",
        capa: "../images/foto27.jpeg",
        url: "https://open.spotify.com/search/made%20to%20love%20you%20kiss",
        descricao: "Fecha bem a lista com um espirito mais grandioso e romantico.",
        mood: "romantico e poderoso"
    },
    {
        titulo: "Money",
        artista: "The Drums",
        capa: "../images/foto28.jpeg",
        url: "https://open.spotify.com/search/money%20the%20drums",
        descricao: "Indie direto e melancolico para manter o charme noturno da playlist.",
        mood: "indie e nostalgico"
    },
    {
        titulo: "Eleanor Rigby",
        artista: "The Beatles",
        capa: "../images/foto29.jpeg",
        url: "https://open.spotify.com/search/eleanor%20rigby%20the%20beatles",
        descricao: "Um classico dramatico e sofisticado que acrescenta profundidade a selecao.",
        mood: "classico e teatral"
    },
    {
        titulo: "Dark Red",
        artista: "Steve Lacy",
        capa: "../images/foto31.jpeg",
        url: "https://open.spotify.com/search/dark%20red%20steve%20lacy",
        descricao: "Suave, sensual e perfeita para o clima mais intimo da noite.",
        mood: "sedutor e nocturno"
    },
    {
        titulo: "Mystery of Love",
        artista: "Sufjan Stevens",
        capa: "../images/foto32.jpeg",
        url: "https://open.spotify.com/search/mystery%20of%20love%20sufjan%20stevens",
        descricao: "Uma faixa delicada e cinematografica para um momento mais sensivel.",
        mood: "delicado e poetico"
    },
    {
        titulo: "Soundtrack for Your Backseat",
        artista: "Sundiver Ca",
        capa: "../images/Foto 1.jpeg",
        url: "https://open.spotify.com/search/soundtrack%20for%20your%20backseat%20sundiver",
        descricao: "Entra com atmosfera jovem e flutuante, como trilha de fim de noite.",
        mood: "flutuante e juvenil"
    },
    {
        titulo: "Blue Hair",
        artista: "TV Girl",
        capa: "../images/Foto 2.jpeg",
        url: "https://open.spotify.com/search/blue%20hair%20tv%20girl",
        descricao: "Indie lo-fi com uma melancolia muito reconhecivel.",
        mood: "lo-fi e nostalgico"
    },
    {
        titulo: "Construção",
        artista: "Chico Buarque",
        capa: "../images/Foto 4.jpeg",
        url: "https://open.spotify.com/search/construcao%20chico%20buarque",
        descricao: "Uma obra intensa e lirica que eleva o peso artistico da playlist.",
        mood: "litrario e dramatico"
    },
    {
        titulo: "U Can't Touch This",
        artista: "MC Hammer",
        capa: "../images/Foto 5.jpeg",
        url: "https://open.spotify.com/search/u%20cant%20touch%20this%20mc%20hammer",
        descricao: "Energia divertida e classica para soltar um momento mais leve.",
        mood: "festivo e retro"
    },
    {
        titulo: "Tag, You're It",
        artista: "Melanie Martinez",
        capa: "../images/Foto 6.jpeg",
        url: "https://open.spotify.com/search/tag%20youre%20it%20melanie%20martinez",
        descricao: "Creepy pop com personalidade forte e teatral.",
        mood: "sombrio e pop"
    },
    {
        titulo: "Hope",
        artista: "XXX TENTACION",
        capa: "../images/Foto 7.jpeg",
        url: "https://open.spotify.com/search/hope%20xxxtentacion",
        descricao: "Curta, intensa e emotiva, boa para um momento mais confessional.",
        mood: "emocional e cru"
    },
    {
        titulo: "Like Him",
        artista: "Tyler, The Creator",
        capa: "../images/Foto 9.jpeg",
        url: "https://open.spotify.com/search/like%20him%20tyler%20the%20creator",
        descricao: "Fecha com um tom introspectivo e moderno, muito bem encaixado no conjunto.",
        mood: "moderno e reflexivo"
    }
    ];

const playlistGrid = document.getElementById("playlist-grid");
const coverAtual = document.getElementById("cover-atual");
const tituloAtual = document.getElementById("titulo-atual");
const artistaAtual = document.getElementById("artista-atual");
const descricaoAtual = document.getElementById("descricao-atual");
const faixasAtual = document.getElementById("faixas-atual");
const spotifyLink = document.getElementById("spotify-link");

let indiceAtual = 0;

function atualizarCartoesAtivos() {
    const cards = document.querySelectorAll(".track-card");

    cards.forEach((card, indice) => {
        card.classList.toggle("ativa", indice === indiceAtual);
    });
}

function animarTrocaDeCapa() {
    coverAtual.classList.remove("troca");
    void coverAtual.offsetWidth;
    coverAtual.classList.add("troca");
}

function selecionarFaixa(indice) {
    const faixa = tracks[indice];

    indiceAtual = indice;
    coverAtual.src = faixa.capa;
    coverAtual.alt = `Capa de ${faixa.titulo}`;
    tituloAtual.textContent = faixa.titulo;
    artistaAtual.textContent = faixa.artista;
    descricaoAtual.textContent = faixa.descricao;
    faixasAtual.textContent = `Mood: ${faixa.mood}.`;
    spotifyLink.href = faixa.url;
    atualizarCartoesAtivos();
    animarTrocaDeCapa();
}

function renderizarPlaylist() {
    playlistGrid.innerHTML = "";

    tracks.forEach((track, indice) => {
        const card = document.createElement("article");
        card.className = "track-card";
        card.dataset.index = indice;
        card.innerHTML = `
            <img src="${track.capa}" alt="Capa de ${track.titulo}">
            <div class="track-content">
                <h3>${track.titulo}</h3>
                <p>${track.artista}</p>
                <span class="track-tag">Faixa selecionavel</span>
                <p class="album-mini">${track.mood}</p>
                <a class="track-link" href="${track.url}" target="_blank" rel="noopener noreferrer">Abrir no Spotify</a>
            </div>
        `;

        card.addEventListener("click", () => selecionarFaixa(indice));
        playlistGrid.appendChild(card);
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
        selecionarFaixa((indiceAtual + 1) % tracks.length);
    }

    if (event.key === "ArrowLeft") {
        selecionarFaixa((indiceAtual - 1 + tracks.length) % tracks.length);
    }

    if (event.key === "Enter") {
        window.open(tracks[indiceAtual].url, "_blank", "noopener,noreferrer");
    }
});

renderizarPlaylist();
selecionarFaixa(0);

