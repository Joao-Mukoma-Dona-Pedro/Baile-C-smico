(function () {
    const GATE_KEY = "baile_cosmico_gate_passed";
    const NAME_KEY = "baile_cosmico_guest_name";
    const DEFAULT_NAME = "Convidado";
    const params = new URLSearchParams(window.location.search);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function normalizeName(value) {
        return (value || "").trim().replace(/\s+/g, " ").slice(0, 42);
    }

    function assetPrefix() {
        return window.location.pathname.includes("/pages/") ? "../" : "";
    }

    if (sessionStorage.getItem(GATE_KEY) === "1") return;

    document.documentElement.classList.add("cosmic-gate-pending");

    const gate = document.createElement("div");
    gate.className = "cosmic-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-label", "Acesso ao protocolo Baile Cósmico");

    const particles = document.createElement("div");
    particles.className = "cosmic-gate__particles";
    gate.appendChild(particles);

    if (!prefersReducedMotion) {
        const count = window.innerWidth < 640 ? 18 : 28;
        for (let i = 0; i < count; i += 1) {
            const dot = document.createElement("span");
            dot.className = "cosmic-gate__particle";
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.animationDuration = `${6 + Math.random() * 10}s`;
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
            <label for="cosmic-gate-name">Identificação do agente</label>
            <div class="cosmic-gate__row">
                <input id="cosmic-gate-name" name="nome" type="text" autocomplete="name" placeholder="Digite o seu nome" required>
                <button type="submit">Autorizar</button>
            </div>
            <p class="cosmic-gate__hint">Pressione Enter para continuar. O convite personalizado ficará disponível na aba Convite.</p>
        </form>
    `;
    gate.appendChild(panel);
    document.body.prepend(gate);

    const log = gate.querySelector("[data-gate-log]");
    const title = gate.querySelector("[data-gate-title]");
    const form = gate.querySelector("[data-gate-form]");
    const input = gate.querySelector("#cosmic-gate-name");
    const lines = [
        "> Inicializando canal seguro...",
        "> Verificando credenciais do Majestic Eighteen...",
        "> Sincronizando coordenadas do evento: 27.07.2026",
        "> Acesso restrito. Confirme a identidade do agente."
    ];
    const detectedName = normalizeName(params.get("nome"));

    function typeLines(index = 0) {
        if (index >= lines.length) {
            if (detectedName) {
                log.textContent += `\n> Identidade detectada: ${detectedName.toUpperCase()}`;
                input.value = detectedName;
                setTimeout(() => unlock(detectedName), prefersReducedMotion ? 120 : 900);
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

    function unlock(name) {
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
        setTimeout(() => gate.remove(), 560);

        if (!inPages && finalName !== DEFAULT_NAME) {
            const convite = document.querySelector('a[href*="convite"]');
            if (convite) convite.setAttribute("href", `${base}pages/convite.html?nome=${encodeURIComponent(finalName)}`);
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = normalizeName(input.value);
        if (!name) {
            input.focus();
            return;
        }
        log.textContent += `\n> Autorizando agente ${name.toUpperCase()}...`;
        unlock(name);
    });

    if (!prefersReducedMotion) {
        setTimeout(() => title.classList.add("is-glitch"), 500);
        setTimeout(() => title.classList.remove("is-glitch"), 1400);
    }

    typeLines();
})();
