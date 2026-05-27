(function () {
    const GATE_KEY = "baile_cosmico_gate_passed";
    const NAME_KEY = "baile_cosmico_guest_name";
    const DEFAULT_NAME = "Convidado";
    const TRANSMISSION_DURATION = 30000;
    const params = new URLSearchParams(window.location.search);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function normalizeName(value) {
        return (value || "").trim().replace(/\s+/g, " ").slice(0, 42);
    }

    function missionFor(name) {
        return window.BaileCosmicoMission?.resolveGuest(name) || null;
    }

    function firstName(value) {
        return normalizeName(value).split(" ")[0] || DEFAULT_NAME;
    }

    function chooseTemplate(name, mission) {
        if (window.BaileCosmicoMission?.missionMessage) {
            return [
                mission ? "TRANSMISSAO CONFIDENCIAL" : "CANAL RESERVADO // BAILE COSMICO",
                "",
                window.BaileCosmicoMission.missionMessage(name, mission),
                "",
                "Esta mensagem sera destruida em 30 segundos."
            ].join("\n");
        }

        const templates = [
            [
                "TRANSMISSAO CONFIDENCIAL",
                "",
                `Agente ${firstName(name)},`,
                "",
                "O universo convocou-te atraves de um canal reservado.",
                "",
                "A tua identidade orbital foi validada em silencio.",
                "",
                "Atravessa o portal quando a noite acender.",
                "",
                "Esta mensagem sera destruida em 30 segundos."
            ],
            [
                "CANAL RESTRITO // BAILE COSMICO",
                "",
                `Agente ${firstName(name)},`,
                "",
                "Uma frequencia rara encontrou o teu nome no escuro.",
                "",
                "A autorizacao foi selada sem testemunhas.",
                "",
                "Mantem a calma. O embarque aproxima-se.",
                "",
                "Esta mensagem sera destruida em 30 segundos."
            ],
            [
                "PROTOCOLO ORBITAL CONFIDENCIAL",
                "",
                `Agente ${firstName(name)},`,
                "",
                "A central recebeu o teu sinal e abriu uma rota secreta.",
                "",
                "Nada precisa ser explicado. Apenas seguido.",
                "",
                "Quando o brilho chamar, atravessa.",
                "",
                "Esta mensagem sera destruida em 30 segundos."
            ]
        ];

        let hash = 0;
        const seed = normalizeName(name).toLowerCase();
        for (let index = 0; index < seed.length; index += 1) {
            hash = (hash + seed.charCodeAt(index) * (index + 1)) % templates.length;
        }
        return templates[hash].join("\n");
    }

    if (sessionStorage.getItem(GATE_KEY) === "1") return;

    document.documentElement.classList.add("cosmic-gate-pending");

    const gate = document.createElement("div");
    gate.className = "cosmic-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-label", "Acesso ao protocolo Baile Cosmico");

    const particles = document.createElement("div");
    particles.className = "cosmic-gate__particles";
    gate.appendChild(particles);

    const smoke = document.createElement("div");
    smoke.className = "cosmic-gate__smoke";
    gate.appendChild(smoke);

    if (!prefersReducedMotion) {
        const count = window.innerWidth < 640 ? 18 : 30;
        for (let i = 0; i < count; i += 1) {
            const dot = document.createElement("span");
            dot.className = "cosmic-gate__particle";
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.animationDuration = `${7 + Math.random() * 12}s`;
            dot.style.animationDelay = `${Math.random() * 6}s`;
            particles.appendChild(dot);
        }
    }

    const panel = document.createElement("div");
    panel.className = "cosmic-gate__panel";
    panel.innerHTML = `
        <h2 class="cosmic-gate__title" data-gate-title>PROTOCOLO BAILE_COSMICO</h2>
        <pre class="cosmic-gate__log" data-gate-log aria-live="polite"></pre>
        <form class="cosmic-gate__form" data-gate-form>
            <label for="cosmic-gate-name">Identificacao do agente</label>
            <div class="cosmic-gate__row">
                <input id="cosmic-gate-name" name="nome" type="text" autocomplete="name" placeholder="Escreve o teu nome" required>
                <button type="submit">Autorizar</button>
            </div>
            <p class="cosmic-gate__hint">Prima Enter para abrir o canal reservado.</p>
        </form>
        <section class="cosmic-transmission" data-transmission hidden>
            <div class="cosmic-transmission__scan" aria-hidden="true"></div>
            <pre class="cosmic-transmission__text" data-transmission-text aria-live="polite"></pre>
            <div class="cosmic-transmission__footer">
                <span data-transmission-status>CANAL ENCRIPTADO</span>
                <span data-transmission-countdown>30</span>
            </div>
        </section>
    `;
    gate.appendChild(panel);
    document.body.prepend(gate);

    const log = gate.querySelector("[data-gate-log]");
    const title = gate.querySelector("[data-gate-title]");
    const form = gate.querySelector("[data-gate-form]");
    const input = gate.querySelector("#cosmic-gate-name");
    const transmission = gate.querySelector("[data-transmission]");
    const transmissionText = gate.querySelector("[data-transmission-text]");
    const transmissionStatus = gate.querySelector("[data-transmission-status]");
    const transmissionCountdown = gate.querySelector("[data-transmission-countdown]");
    const lines = [
        "> Inicializando canal seguro...",
        "> Verificando credenciais do Majestic Eighteen...",
        "> Sincronizando frequencia do evento: 27.07.2026",
        "> Acesso restrito. Confirme a identidade do agente."
    ];
    const detectedName = normalizeName(params.get("nome"));
    let countdownTimer = null;

    function typeInto(element, text, speed = 34) {
        element.textContent = "";

        if (prefersReducedMotion) {
            element.textContent = text;
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            let index = 0;
            const timer = setInterval(() => {
                element.textContent += text[index] || "";
                element.scrollTop = element.scrollHeight;
                index += 1;
                if (index >= text.length) {
                    clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    }

    function typeLines(index = 0) {
        if (index >= lines.length) {
            if (detectedName) {
                log.textContent += `\n> Identidade detectada: ${detectedName.toUpperCase()}`;
                input.value = detectedName;
                setTimeout(() => startTransmission(detectedName), prefersReducedMotion ? 120 : 900);
            } else {
                input.focus();
            }
            return;
        }
        const delay = prefersReducedMotion ? 0 : 380;
        setTimeout(() => {
            log.textContent += (index ? "\n" : "") + lines[index];
            log.scrollTop = log.scrollHeight;
            typeLines(index + 1);
        }, delay);
    }

    function persistAndEnter(name) {
        const finalName = normalizeName(name) || DEFAULT_NAME;
        localStorage.setItem(NAME_KEY, finalName);
        sessionStorage.setItem(GATE_KEY, "1");
        document.documentElement.classList.remove("cosmic-gate-pending");

        const inPages = window.location.pathname.includes("/pages/");
        const base = inPages ? "../" : "";
        const next = new URL(window.location.href);
        if (finalName !== DEFAULT_NAME) next.searchParams.set("nome", finalName);
        else next.searchParams.delete("nome");
        window.history.replaceState({}, "", `${next.pathname}${next.search}${next.hash}`);

        gate.classList.add("is-leaving");
        setTimeout(() => gate.remove(), 620);

        if (!inPages && finalName !== DEFAULT_NAME) {
            const convite = document.querySelector('a[href*="convite"]');
            if (convite) convite.setAttribute("href", `${base}pages/convite.html?nome=${encodeURIComponent(finalName)}`);
        }
    }

    async function startTransmission(name) {
        const finalName = normalizeName(name) || DEFAULT_NAME;
        const mission = missionFor(finalName);

        form.hidden = true;
        log.hidden = true;
        transmission.hidden = false;
        panel.classList.add("is-transmitting");
        title.textContent = "TRANSMISSAO CONFIDENCIAL";
        if (!prefersReducedMotion) title.classList.add("is-glitch");

        transmissionStatus.textContent = mission ? `IDENTIDADE VALIDADA // ${mission.codigoConfidencial}` : "CANAL RESERVADO";
        const startedAt = Date.now();
        countdownTimer = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((TRANSMISSION_DURATION - (Date.now() - startedAt)) / 1000));
            transmissionCountdown.textContent = String(remaining).padStart(2, "0");
            if (remaining <= 5 && !prefersReducedMotion) panel.classList.add("is-critical");
            if (remaining === 0) {
                clearInterval(countdownTimer);
                destroyTransmission(finalName);
            }
        }, 250);

        await typeInto(transmissionText, chooseTemplate(finalName, mission), prefersReducedMotion ? 0 : 32);
    }

    function destroyTransmission(name) {
        transmissionStatus.textContent = "AUTODESTRUICAO INICIADA";
        panel.classList.remove("is-critical");
        panel.classList.add("is-burning");
        setTimeout(() => persistAndEnter(name), prefersReducedMotion ? 420 : 3200);
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = normalizeName(input.value);
        if (!name) {
            input.focus();
            return;
        }
        log.textContent += `\n> Validando identidade de ${name.toUpperCase()}...`;
        log.textContent += "\n> Canal reservado aberto.";
        startTransmission(name);
    });

    if (!prefersReducedMotion) {
        setTimeout(() => title.classList.add("is-glitch"), 500);
        setTimeout(() => title.classList.remove("is-glitch"), 1400);
    }

    typeLines();
})();
