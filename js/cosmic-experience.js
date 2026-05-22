(function () {
    const STORAGE_KEY = "baile_cosmico_guest_name";
    const DEFAULT_NAME = "Convidado";
    const params = new URLSearchParams(window.location.search);

    function normalizeName(value) {
        return (value || "").trim().replace(/\s+/g, " ").slice(0, 42);
    }

    function currentName() {
        const fromUrl = normalizeName(params.get("nome"));
        if (fromUrl) {
            localStorage.setItem(STORAGE_KEY, fromUrl);
            return fromUrl;
        }
        return normalizeName(localStorage.getItem(STORAGE_KEY)) || DEFAULT_NAME;
    }

    function withName(href, name) {
        if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return href;
        const next = new URL(href, window.location.href);
        if (name && name !== DEFAULT_NAME) next.searchParams.set("nome", name);
        else next.searchParams.delete("nome");
        const inPages = window.location.pathname.includes("/pages/");
        const targetInPages = next.pathname.includes("/pages/");
        const file = next.pathname.split("/").filter(Boolean).pop() || "index.html";
        const prefix = targetInPages && !inPages ? "pages/" : inPages && !targetInPages ? "../" : "";
        return `${prefix}${file}${next.search}${next.hash}`;
    }

    function transitionTo(url) {
        document.body.classList.add("cosmic-leaving");
        setTimeout(() => { window.location.href = url; }, 360);
    }

    function injectLoader() {
        const loader = document.createElement("div");
        loader.className = "cosmic-loader";
        loader.innerHTML = "<span></span><p>Sincronizando convite...</p>";
        document.body.appendChild(loader);
        setTimeout(() => loader.classList.add("is-hidden"), 520);
    }

    function injectBack(name) {
        const back = document.createElement("button");
        back.className = "cosmic-back";
        back.type = "button";
        back.innerHTML = "<span aria-hidden='true'>&lsaquo;</span> Voltar";
        back.addEventListener("click", () => {
            if (history.length > 1) history.back();
            else transitionTo(withName(window.location.pathname.includes("/pages/") ? "../index.html" : "index.html", name));
        });
        document.body.prepend(back);
    }

    function setupLinks(name) {
        document.querySelectorAll("a[href]").forEach((link) => {
            const original = link.getAttribute("href");
            const named = withName(original, name);
            if (named !== original) link.setAttribute("href", named);

            const href = link.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.endsWith(".pdf")) return;
            link.addEventListener("click", (event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                event.preventDefault();
                transitionTo(link.getAttribute("href"));
            });
        });
    }

    function setupNamePrompt(name) {
        if (name !== DEFAULT_NAME || !document.body.classList.contains("invite-pdf-page")) return;
        const prompt = document.querySelector("#pdf-guest-name");
        if (prompt) setTimeout(() => prompt.focus(), 650);
    }

    const name = currentName();
    injectLoader();
    injectBack(name);
    setupLinks(name);
    setupNamePrompt(name);
})();