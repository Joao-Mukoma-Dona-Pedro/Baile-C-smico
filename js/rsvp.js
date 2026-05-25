(function () {
    const STORAGE_KEY = "baile_cosmico_rsvp";
    const NAME_KEY = "baile_cosmico_guest_name";

    const panel = document.querySelector("[data-rsvp-panel]");
    if (!panel) return;

    const status = panel.querySelector("[data-rsvp-status]");
    const yesBtn = panel.querySelector("[data-rsvp-yes]");
    const noBtn = panel.querySelector("[data-rsvp-no]");

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

    function renderState() {
        const name = guestName();
        const saved = readStore()[name];
        if (!saved) {
            status.textContent = `${name}, confirme a sua presença no Majestic Eighteen.`;
            return;
        }
        if (saved === "yes") {
            status.textContent = `Presença confirmada, ${name}. O protocolo registrou a sua entrada no Baile Cósmico.`;
        } else {
            status.textContent = `Registo recebido, ${name}. A sua resposta foi guardada com discrição.`;
        }
        yesBtn.disabled = true;
        noBtn.disabled = true;
    }

    function saveChoice(choice) {
        const name = guestName();
        const store = readStore();
        store[name] = choice;
        writeStore(store);
        renderState();
    }

    yesBtn.addEventListener("click", () => saveChoice("yes"));
    noBtn.addEventListener("click", () => saveChoice("no"));
    renderState();
})();
