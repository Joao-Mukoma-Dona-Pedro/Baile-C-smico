(function () {
    const GATE_KEY = "baile_cosmico_gate_passed";
    const NAME_KEY = "baile_cosmico_guest_name";
    const DEFAULT_NAME = "Convidado";
    const TRANSMISSION_DURATION = 30000;
    const BURN_DURATION = 7200;
    const BURN_INTENSITY = window.innerWidth < 640 ? 0.9 : 1.38;
    const BURN_SPREAD_SPEED = 0.86;
    const BURN_PARTICLE_DENSITY = window.innerWidth < 640 ? 0.78 : 1.08;
    const BURN_FLAME_HEIGHT = window.innerWidth < 640 ? 0.86 : 1.12;
    const BURN_SMOKE_DENSITY = window.innerWidth < 640 ? 0.72 : 1;
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
            <canvas class="cosmic-transmission__burn" data-burn-canvas aria-hidden="true"></canvas>
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
    const burnCanvas = gate.querySelector("[data-burn-canvas]");
    const lines = [
        "> Inicializando canal seguro...",
        "> Verificando credenciais do Majestic Eighteen...",
        "> Sincronizando frequencia do evento: 27.07.2026",
        "> Acesso restrito. Confirme a identidade do agente."
    ];
    const detectedName = normalizeName(params.get("nome"));
    let countdownTimer = null;
    let burnFrame = 0;
    let burnAudioContext = null;

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
        if (burnFrame) cancelAnimationFrame(burnFrame);
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

    function primeBurnAudio() {
        if (prefersReducedMotion || burnAudioContext) return;
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return;
        try {
            burnAudioContext = new AudioCtor();
            burnAudioContext.resume?.();
        } catch {
            burnAudioContext = null;
        }
    }

    function playBurnAudio() {
        if (!burnAudioContext) return;
        try {
            burnAudioContext.resume?.();
            const duration = Math.min(BURN_DURATION / 1000, 5.8);
            const sampleRate = burnAudioContext.sampleRate;
            const buffer = burnAudioContext.createBuffer(1, Math.floor(sampleRate * duration), sampleRate);
            const data = buffer.getChannelData(0);
            for (let index = 0; index < data.length; index += 1) {
                const time = index / sampleRate;
                const fadeIn = Math.min(1, time / 0.7);
                const fadeOut = Math.max(0, 1 - Math.max(0, time - duration + 1.4) / 1.4);
                const envelope = fadeIn * fadeOut;
                const crackle = Math.random() > 0.982 ? (Math.random() * 2 - 1) * 0.9 : 0;
                data[index] = ((Math.random() * 2 - 1) * 0.12 + crackle) * envelope;
            }

            const source = burnAudioContext.createBufferSource();
            const filter = burnAudioContext.createBiquadFilter();
            const gain = burnAudioContext.createGain();
            source.buffer = buffer;
            filter.type = "bandpass";
            filter.frequency.value = 1250;
            filter.Q.value = 0.9;
            gain.gain.value = 0.075;
            source.connect(filter);
            filter.connect(gain);
            gain.connect(burnAudioContext.destination);
            source.start();
        } catch {
            // Audio is optional; visual destruction continues if a browser blocks it.
        }
    }

    function resizeBurnCanvas() {
        if (!burnCanvas) return null;
        const rect = transmission.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        burnCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
        burnCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
        burnCanvas.style.width = `${rect.width}px`;
        burnCanvas.style.height = `${rect.height}px`;
        return { width: burnCanvas.width, height: burnCanvas.height, dpr };
    }

    function randomEdgePoint(width, height, inset) {
        const side = Math.floor(Math.random() * 4);
        const progress = Math.random();
        if (side === 0) return { x: inset + progress * (width - inset * 2), y: inset };
        if (side === 1) return { x: width - inset, y: inset + progress * (height - inset * 2) };
        if (side === 2) return { x: inset + progress * (width - inset * 2), y: height - inset };
        return { x: inset, y: inset + progress * (height - inset * 2) };
    }

    function startCinematicBurn() {
        if (prefersReducedMotion || !burnCanvas) return 420;

        const canvasSize = resizeBurnCanvas();
        if (!canvasSize) return BURN_DURATION;

        const ctx = burnCanvas.getContext("2d");
        if (!ctx) return BURN_DURATION;

        burnCanvas.hidden = false;
        burnCanvas.classList.add("is-active");
        playBurnAudio();

        const particles = [];
        const flameFronts = [];
        const startTime = performance.now();
        const intensity = BURN_INTENSITY;
        const spreadSpeed = Math.max(0.35, BURN_SPREAD_SPEED);
        const flameHeight = BURN_FLAME_HEIGHT;
        const smokeDensity = BURN_SMOKE_DENSITY;

        function noise2d(x, y, time) {
            const waveA = Math.sin(x * 0.021 + time * 0.0019) * Math.cos(y * 0.017 - time * 0.0014);
            const waveB = Math.sin((x + y) * 0.011 + time * 0.0027);
            const waveC = Math.cos((x - y) * 0.015 - time * 0.0021);
            return (waveA + waveB + waveC) / 3;
        }

        function createFlameFronts(width, height) {
            const count = Math.round((window.innerWidth < 640 ? 34 : 54) * intensity);
            const frontInset = Math.min(width, height) * 0.028;
            for (let index = 0; index < count; index += 1) {
                const side = index % 4;
                const lane = Math.random();
                let x = frontInset + lane * (width - frontInset * 2);
                let y = frontInset + lane * (height - frontInset * 2);
                let nx = 0;
                let ny = -1;
                if (side === 0) {
                    y = frontInset;
                    ny = 1;
                } else if (side === 1) {
                    x = width - frontInset;
                    nx = -1;
                    ny = 0;
                } else if (side === 2) {
                    y = height - frontInset;
                    ny = -1;
                } else {
                    x = frontInset;
                    nx = 1;
                    ny = 0;
                }

                flameFronts.push({
                    x,
                    y,
                    nx,
                    ny,
                    side,
                    phase: Math.random() * Math.PI * 2,
                    width: (14 + Math.random() * 34) * canvasSize.dpr,
                    height: (90 + Math.random() * 185) * canvasSize.dpr * flameHeight,
                    speed: 0.75 + Math.random() * 1.6,
                    heat: 0.75 + Math.random() * 0.9,
                    delay: Math.random() * 0.24,
                    turbulence: 0.8 + Math.random() * 1.7
                });
            }
        }

        function spawnParticle(width, height, progress, type) {
            const edgeInset = Math.min(width, height) * (0.018 + progress * 0.33 * spreadSpeed);
            const point = randomEdgePoint(width, height, edgeInset);
            const centerPull = progress * 0.68;
            const centerX = width / 2;
            const centerY = height / 2;
            const heat = type === "ember" ? 1 : Math.random();
            particles.push({
                x: point.x * (1 - centerPull) + centerX * centerPull + (Math.random() - 0.5) * 22,
                y: point.y * (1 - centerPull) + centerY * centerPull + (Math.random() - 0.5) * 22,
                vx: (Math.random() - 0.5) * (0.75 + progress),
                vy: type === "smoke"
                    ? -(0.18 + Math.random() * 0.8 + progress * 0.9)
                    : -(0.45 + Math.random() * 1.9 + progress * 1.4),
                radius: (type === "ash" ? 0.8 + Math.random() * 2.8 : type === "smoke" ? 18 + Math.random() * 42 : 1.3 + Math.random() * 5.8) * canvasSize.dpr,
                life: 0,
                maxLife: (type === "ash" ? 1300 + Math.random() * 2100 : type === "smoke" ? 1450 + Math.random() * 2300 : 520 + Math.random() * 1250) / Math.max(0.65, intensity),
                heat,
                type
            });
        }

        function drawFlameTongue(front, progress, now) {
            const spread = Math.max(0, Math.min(1, (progress - front.delay) / Math.max(0.08, 1 - front.delay)));
            if (spread <= 0) return;

            const turbulent = noise2d(front.x, front.y, now) * front.turbulence;
            const pulse = 0.74 + Math.sin(now * 0.008 * front.speed + front.phase) * 0.22 + turbulent * 0.16 + Math.random() * 0.08;
            const height = front.height * (0.45 + spread * 1.15) * pulse;
            const width = front.width * (0.85 + spread * 0.5);
            const inward = Math.min(canvasSize.width, canvasSize.height) * spread * 0.31 * spreadSpeed;
            const baseX = front.x + front.nx * inward;
            const baseY = front.y + front.ny * inward;
            const tipX = baseX + front.nx * height + Math.sin(now * 0.004 + front.phase) * width * (0.55 + turbulent * 0.14);
            const tipY = baseY + front.ny * height + Math.cos(now * 0.0045 + front.phase) * width * (0.55 + turbulent * 0.12);
            const tangentX = front.ny;
            const tangentY = -front.nx;
            const sway = (Math.sin(now * 0.006 * front.speed + front.phase) + turbulent * 0.55) * width * 0.95;

            ctx.save();
            ctx.globalCompositeOperation = "lighter";

            const outer = ctx.createRadialGradient(tipX, tipY, 0, baseX, baseY, Math.max(width, height) * 1.04);
            outer.addColorStop(0, `rgba(255, 244, 185, ${0.36 * spread})`);
            outer.addColorStop(0.15, `rgba(255, 157, 44, ${0.5 * spread})`);
            outer.addColorStop(0.38, `rgba(213, 45, 13, ${0.4 * spread})`);
            outer.addColorStop(0.72, `rgba(47, 7, 3, ${0.26 * spread})`);
            outer.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = outer;

            ctx.beginPath();
            ctx.moveTo(baseX - tangentX * width, baseY - tangentY * width);
            ctx.bezierCurveTo(
                baseX - tangentX * width * 1.3 + front.nx * height * 0.2,
                baseY - tangentY * width * 1.3 + front.ny * height * 0.2,
                tipX - tangentX * width * 0.35 + sway,
                tipY - tangentY * width * 0.35 - sway * 0.2,
                tipX,
                tipY
            );
            ctx.bezierCurveTo(
                tipX + tangentX * width * 0.35 + sway * 0.4,
                tipY + tangentY * width * 0.35,
                baseX + tangentX * width * 1.25 + front.nx * height * 0.16,
                baseY + tangentY * width * 1.25 + front.ny * height * 0.16,
                baseX + tangentX * width,
                baseY + tangentY * width
            );
            ctx.closePath();
            ctx.fill();

            const core = ctx.createRadialGradient(tipX, tipY, 0, baseX, baseY, Math.max(width, height) * 0.62);
            core.addColorStop(0, `rgba(255, 247, 204, ${0.78 * spread * front.heat})`);
            core.addColorStop(0.2, `rgba(255, 183, 54, ${0.62 * spread})`);
            core.addColorStop(0.54, `rgba(236, 65, 14, ${0.3 * spread})`);
            core.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = core;

            ctx.beginPath();
            ctx.moveTo(baseX - tangentX * width * 0.42, baseY - tangentY * width * 0.42);
            ctx.quadraticCurveTo(
                baseX + front.nx * height * 0.42 + Math.sin(now * 0.006 + front.phase) * width,
                baseY + front.ny * height * 0.42 + Math.cos(now * 0.006 + front.phase) * width,
                tipX,
                tipY
            );
            ctx.quadraticCurveTo(
                baseX + front.nx * height * 0.35 - Math.cos(now * 0.005 + front.phase) * width,
                baseY + front.ny * height * 0.35 + Math.sin(now * 0.005 + front.phase) * width,
                baseX + tangentX * width * 0.42,
                baseY + tangentY * width * 0.42
            );
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        function drawVolumetricFire(width, height, progress, now) {
            const centerX = width / 2;
            const centerY = height / 2;
            const coreRadius = Math.max(width, height) * (0.08 + progress * 0.42);
            ctx.save();
            ctx.globalCompositeOperation = "screen";
            const bloom = ctx.createRadialGradient(centerX, centerY, coreRadius * 0.14, centerX, centerY, coreRadius * 1.34);
            bloom.addColorStop(0, `rgba(255, 229, 154, ${0.09 * progress})`);
            bloom.addColorStop(0.3, `rgba(255, 105, 30, ${0.14 * progress})`);
            bloom.addColorStop(0.68, `rgba(55, 7, 3, ${0.22 * progress})`);
            bloom.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = bloom;
            ctx.fillRect(0, 0, width, height);

            flameFronts.forEach((front) => drawFlameTongue(front, progress, now));
            ctx.restore();
        }

        function drawSmokeCeiling(width, height, progress, now) {
            ctx.save();
            ctx.globalCompositeOperation = "source-over";
            for (let i = 0; i < 9; i += 1) {
                const drift = noise2d(i * 130, height * 0.18, now) * 42 * canvasSize.dpr;
                const x = width * (i / 8) + drift;
                const y = height * (0.05 + progress * 0.28) + Math.sin(now * 0.0015 + i) * 24 * canvasSize.dpr;
                const radius = (70 + progress * 145 + i * 7) * canvasSize.dpr;
                const smoke = ctx.createRadialGradient(x, y, 0, x, y, radius);
                smoke.addColorStop(0, `rgba(38, 30, 26, ${0.12 * progress * smokeDensity})`);
                smoke.addColorStop(0.45, `rgba(10, 8, 7, ${0.18 * progress * smokeDensity})`);
                smoke.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = smoke;
                ctx.beginPath();
                ctx.ellipse(x, y, radius * 1.35, radius * 0.62, Math.sin(now * 0.0008 + i) * 0.22, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        function drawCharredEdges(width, height, progress, flicker) {
            const edge = Math.min(width, height) * (0.022 + progress * 0.38 * spreadSpeed);
            const glow = ctx.createRadialGradient(width / 2, height / 2, Math.max(1, edge * 0.25), width / 2, height / 2, Math.max(width, height) * 0.78);
            glow.addColorStop(0, `rgba(0, 0, 0, ${0.2 * progress})`);
            glow.addColorStop(Math.max(0.08, 1 - progress * 0.92), `rgba(0, 0, 0, ${0.12 + progress * 0.38})`);
            glow.addColorStop(1, `rgba(255, ${67 + flicker * 76}, 16, ${0.46 + progress * 0.5})`);
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, width, height);

            const char = ctx.createRadialGradient(width / 2, height / 2, Math.max(1, Math.min(width, height) * (0.28 - progress * 0.16)), width / 2, height / 2, Math.max(width, height) * 0.72);
            char.addColorStop(0, "rgba(0, 0, 0, 0)");
            char.addColorStop(0.52, `rgba(32, 9, 2, ${0.18 + progress * 0.42})`);
            char.addColorStop(1, `rgba(0, 0, 0, ${0.68 + progress * 0.28})`);
            ctx.fillStyle = char;
            ctx.fillRect(0, 0, width, height);
        }

        function drawHeatBands(width, height, progress, now) {
            ctx.save();
            ctx.globalCompositeOperation = "screen";
            for (let i = 0; i < 7; i += 1) {
                const y = height * (0.12 + i * 0.13) + Math.sin(now / 360 + i) * 14 * canvasSize.dpr;
                const alpha = (0.025 + progress * 0.045) * (1 - i / 10);
                const gradient = ctx.createLinearGradient(0, y - 22, width, y + 22);
                gradient.addColorStop(0, "rgba(255,255,255,0)");
                gradient.addColorStop(0.45, `rgba(255, 180, 92, ${alpha})`);
                gradient.addColorStop(0.55, `rgba(123, 246, 255, ${alpha * 0.7})`);
                gradient.addColorStop(1, "rgba(255,255,255,0)");
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.ellipse(width / 2 + Math.sin(now / 500 + i) * 18, y, width * (0.38 + progress * 0.16), 16 + progress * 18, Math.sin(now / 900 + i) * 0.08, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        function drawParticle(particle, delta) {
            particle.life += delta;
            particle.x += particle.vx * delta * 0.06;
            particle.y += particle.vy * delta * 0.06;
            particle.vx += Math.sin((particle.life + particle.x) * 0.012) * 0.014;
            const age = Math.min(1, particle.life / particle.maxLife);
            const alpha = Math.max(0, 1 - age);

            if (particle.type === "ash") {
                ctx.fillStyle = `rgba(190, 178, 151, ${0.28 * alpha})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fill();
                return particle.life < particle.maxLife;
            }

            if (particle.type === "smoke") {
                const smoke = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * (1 + age * 1.2));
                smoke.addColorStop(0, `rgba(112, 97, 84, ${0.18 * alpha})`);
                smoke.addColorStop(0.48, `rgba(44, 35, 31, ${0.11 * alpha})`);
                smoke.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = smoke;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius * (1 + age), 0, Math.PI * 2);
                ctx.fill();
                return particle.life < particle.maxLife;
            }

            const flame = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * (1 + age * 1.8));
            flame.addColorStop(0, `rgba(255, 246, 178, ${0.92 * alpha})`);
            flame.addColorStop(0.22, `rgba(255, 143, 42, ${0.82 * alpha})`);
            flame.addColorStop(0.58, `rgba(181, 36, 12, ${0.44 * alpha})`);
            flame.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = flame;
            ctx.beginPath();
            ctx.ellipse(particle.x, particle.y, particle.radius * (0.9 + particle.heat), particle.radius * (1.8 + particle.heat * 1.8), particle.vx * 0.2, 0, Math.PI * 2);
            ctx.fill();
            return particle.life < particle.maxLife;
        }

        let previous = startTime;
        function render(now) {
            const elapsed = now - startTime;
            const delta = Math.min(48, now - previous);
            previous = now;
            const progress = Math.min(1, elapsed / BURN_DURATION);
            const eased = 1 - Math.pow(1 - progress, 2.4);
            const flicker = Math.random();
            const { width, height } = canvasSize;
            burnCanvas.style.setProperty("--burn-progress", eased.toFixed(3));

            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = "source-over";
            drawCharredEdges(width, height, eased, flicker);
            drawSmokeCeiling(width, height, eased, now);
            drawVolumetricFire(width, height, eased, now);
            drawHeatBands(width, height, eased, now);

            const spawnCount = Math.round((6 + eased * 28) * intensity * BURN_PARTICLE_DENSITY);
            for (let i = 0; i < spawnCount; i += 1) spawnParticle(width, height, eased, "ember");
            if (Math.random() < 0.72 * intensity) spawnParticle(width, height, eased, "smoke");
            if (Math.random() < 0.9 * BURN_PARTICLE_DENSITY) spawnParticle(width, height, eased, "ash");

            ctx.globalCompositeOperation = "lighter";
            for (let index = particles.length - 1; index >= 0; index -= 1) {
                if (!drawParticle(particles[index], delta)) particles.splice(index, 1);
            }

            if (progress < 1) {
                burnFrame = requestAnimationFrame(render);
            } else {
                burnFrame = 0;
            }
        }

        createFlameFronts(canvasSize.width, canvasSize.height);
        burnFrame = requestAnimationFrame(render);
        return BURN_DURATION;
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

        transmissionStatus.textContent = mission ? "IDENTIDADE VALIDADA" : "CANAL RESERVADO";
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
        const burnTime = startCinematicBurn();
        setTimeout(() => persistAndEnter(name), prefersReducedMotion ? 420 : burnTime + 420);
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = normalizeName(input.value);
        if (!name) {
            input.focus();
            return;
        }
        primeBurnAudio();
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
