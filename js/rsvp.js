(function () {
    const STORAGE_KEY = "baile_cosmico_rsvp";
    const NAME_KEY = "baile_cosmico_guest_name";
    const RSVP_EMAIL = "natashasarahars@gmail.com";
    const FORM_SUBMIT_URL = `https://formsubmit.co/ajax/${encodeURIComponent(RSVP_EMAIL)}`;

    const panel = document.querySelector("[data-rsvp-panel]");
    if (!panel) return;

    const status = panel.querySelector("[data-rsvp-status]");
    const yesBtn = panel.querySelector("[data-rsvp-yes]");
    const noBtn = panel.querySelector("[data-rsvp-no]");
    const fallbackForm = document.querySelector("[data-rsvp-fallback]");

    function guestName() {
        const params = new URLSearchParams(window.location.search);
        const fromUrl = (params.get("nome") || "").trim();
        if (fromUrl) return fromUrl;
        return (localStorage.getItem(NAME_KEY) || "Convidado").trim();
    }

    function readStore() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        } catch {
            return {};
        }
    }

    function writeStore(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function setBusy(isBusy) {
        yesBtn.disabled = isBusy;
        noBtn.disabled = isBusy;
        yesBtn.setAttribute("aria-busy", isBusy ? "true" : "false");
    }

    function renderState() {
        const name = guestName();
        const saved = readStore()[name];
        if (!saved) {
            status.textContent = `${name}, confirme a sua presença no Majestic Eighteen.`;
            yesBtn.disabled = false;
            noBtn.disabled = false;
            return;
        }
        if (saved === "yes") {
            status.textContent = `Presença confirmada, ${name}. O protocolo registou a sua entrada e enviou a confirmação.`;
        } else {
            status.textContent = `Registo recebido, ${name}. A sua resposta foi enviada com discrição.`;
        }
        yesBtn.disabled = true;
        noBtn.disabled = true;
    }

    async function sendEmail(choice, name) {
        const payload = {
            nome: name,
            presenca: choice === "yes" ? "Confirmada" : "Não comparece",
            evento: "Baile Cósmico — Majestic Eighteen",
            data_evento: "27/07/2026",
            _subject: `RSVP Baile Cósmico — ${name}`,
            _template: "table",
            _captcha: "false"
        };

        const response = await fetch(FORM_SUBMIT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(payload)
        });

        let data = {};
        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (!response.ok) {
            throw new Error(data.message || "Não foi possível enviar a confirmação por email.");
        }

        return data;
    }

    function submitFallback(choice, name) {
        if (!fallbackForm) return false;
        fallbackForm.querySelector("[name='nome']").value = name;
        fallbackForm.querySelector("[name='presenca']").value = choice === "yes" ? "Confirmada" : "Não comparece";
        fallbackForm.submit();
        return true;
    }

    async function saveChoice(choice) {
        const name = guestName();
        if (!name || name === "Convidado") {
            status.textContent = "Identifique-se primeiro (portal ou campo de nome) antes de confirmar presença.";
            status.classList.add("is-error");
            return;
        }

        setBusy(true);
        status.classList.remove("is-error");
        status.textContent = "A enviar a confirmação para o protocolo...";

        try {
            await sendEmail(choice, name);
            const store = readStore();
            store[name] = choice;
            writeStore(store);
            renderState();
        } catch (error) {
            console.error(error);
            status.textContent = error.message || "Falha no envio. A tentar método alternativo...";
            status.classList.add("is-error");
            if (submitFallback(choice, name)) return;
            status.textContent = "Não foi possível enviar agora. Verifique a ligação e tente novamente.";
        } finally {
            setBusy(false);
        }
    }

    yesBtn.addEventListener("click", () => saveChoice("yes"));
    noBtn.addEventListener("click", () => saveChoice("no"));
    renderState();
})();
