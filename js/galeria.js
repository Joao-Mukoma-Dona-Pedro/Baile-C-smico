const imagens = Array.from(document.querySelectorAll('.galeria img'));
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const legenda = document.getElementById('legenda');
const contador = document.getElementById('contador');
const fechar = document.getElementById('fechar');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const miniaturas = document.getElementById('miniaturas');
const playPause = document.getElementById('playPause');
const fullscreenBtn = document.getElementById('fullscreen');

let indiceAtual = 0;
let slideshowAtivo = false;
let slideshowInterval = null;

function criarMiniaturas() {
    miniaturas.innerHTML = '';

    imagens.forEach((img, indice) => {
        const thumb = document.createElement('img');
        thumb.src = img.src;
        thumb.alt = img.alt;
        thumb.addEventListener('click', () => abrirImagem(indice));
        miniaturas.appendChild(thumb);
    });
}

function atualizarMiniaturas() {
    const thumbs = miniaturas.querySelectorAll('img');

    thumbs.forEach((thumb, indice) => {
        thumb.classList.toggle('ativa', indice === indiceAtual);
    });

    const thumbAtiva = thumbs[indiceAtual];
    if (thumbAtiva) {
        thumbAtiva.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
        });
    }
}

function atualizarImagem() {
    const img = imagens[indiceAtual];
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    legenda.textContent = img.alt;
    contador.textContent = `${indiceAtual + 1} / ${imagens.length}`;
    atualizarMiniaturas();
}

function abrirImagem(indice) {
    indiceAtual = indice;
    modal.classList.add('ativo');
    atualizarImagem();
}

function fecharModal() {
    modal.classList.remove('ativo');
    pararSlideshow();
}

function mostrarProxima() {
    indiceAtual = (indiceAtual + 1) % imagens.length;
    atualizarImagem();
}

function mostrarAnterior() {
    indiceAtual = (indiceAtual - 1 + imagens.length) % imagens.length;
    atualizarImagem();
}

function iniciarSlideshow() {
    slideshowAtivo = true;
    playPause.textContent = 'Pause';

    slideshowInterval = setInterval(() => {
        mostrarProxima();
    }, 2500);
}

function pararSlideshow() {
    slideshowAtivo = false;
    playPause.textContent = 'Play';
    clearInterval(slideshowInterval);
    slideshowInterval = null;
}

function alternarSlideshow() {
    if (slideshowAtivo) {
        pararSlideshow();
    } else {
        iniciarSlideshow();
    }
}

async function alternarFullscreen() {
    if (!document.fullscreenElement) {
        await modal.requestFullscreen();
    } else {
        await document.exitFullscreen();
    }
}

imagens.forEach((img, indice) => {
    img.addEventListener('click', () => abrirImagem(indice));
});

fechar.addEventListener('click', fecharModal);
next.addEventListener('click', mostrarProxima);
prev.addEventListener('click', mostrarAnterior);
playPause.addEventListener('click', alternarSlideshow);
fullscreenBtn.addEventListener('click', alternarFullscreen);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        fecharModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('ativo')) return;

    if (e.key === 'Escape') fecharModal();
    if (e.key === 'ArrowRight') mostrarProxima();
    if (e.key === 'ArrowLeft') mostrarAnterior();
    if (e.key.toLowerCase() === 'f') alternarFullscreen();

    if (e.key === ' ') {
        e.preventDefault();
        alternarSlideshow();
    }
});

criarMiniaturas();
