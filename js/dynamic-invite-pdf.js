(function () {
    const STORAGE_KEY = "baile_cosmico_guest_name";
    const DEFAULT_NAME = "Convidado";

    // CONFIGURACAO DO PDF DINAMICO
    // Troque o arquivo assets/convite-base.pdf para mudar o convite base.
    // Coordenadas em pontos PDF: origem (0,0) fica no canto inferior esquerdo.
    // A area abaixo substitui apenas o texto "(INSIRA O SEU NUMERO DE AGENTE)".
    const INVITE_CONFIG = {
        basePdfUrl: "../assets/convite-base.pdf",
        pageIndex: 0,
        filePrefix: "convite-baile-cosmico",
        agentName: {
            x: 93,
            y: 27,
            maxWidth: 92,
            fontSize: 7.8,
            minFontSize: 5.2,
            font: "CourierBold",
            color: { r: 0.91, g: 0.74, b: 0.43 },
            uppercase: true,
            letterSpacing: 0.35,
            coverPlaceholder: {
                x: 56,
                y: 19,
                width: 80,
                height: 21,
                color: { r: 0.02, g: 0.025, b: 0.06 },
                opacity: 0.86
            }
        }
    };

    const params = new URLSearchParams(window.location.search);
    const form = document.querySelector("[data-pdf-name-form]");
    const input = document.querySelector("#pdf-guest-name");
    const previewName = document.querySelector("[data-pdf-preview-name]");
    const status = document.querySelector("[data-pdf-status]");
    const download = document.querySelector("[data-download-invite]");
    let currentBlobUrl = "";

    if (!form || !input || !previewName || !download) return;

    function normalizeName(value) {
        return (value || "").trim().replace(/\s+/g, " ").slice(0, 42);
    }

    function displayName(value) {
        const name = normalizeName(value) || DEFAULT_NAME;
        return INVITE_CONFIG.agentName.uppercase ? name.toLocaleUpperCase("pt-PT") : name;
    }

    function initialName() {
        const fromUrl = normalizeName(params.get("nome"));
        if (fromUrl) return fromUrl;
        return normalizeName(localStorage.getItem(STORAGE_KEY)) || "";
    }

    function slugify(value) {
        return normalizeName(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "convidado";
    }

    function setStatus(message, isError = false) {
        status.textContent = message;
        status.classList.toggle("is-error", isError);
    }

    function setDownloadEnabled(enabled) {
        download.classList.toggle("is-disabled", !enabled);
        download.setAttribute("aria-disabled", enabled ? "false" : "true");
    }

    async function getFont(pdfDoc, fontName) {
        const { StandardFonts } = PDFLib;
        const fonts = {
            TimesRomanBoldItalic: StandardFonts.TimesRomanBoldItalic,
            TimesRomanBold: StandardFonts.TimesRomanBold,
            HelveticaBold: StandardFonts.HelveticaBold,
            CourierBold: StandardFonts.CourierBold,
            Courier: StandardFonts.Courier
        };
        return pdfDoc.embedFont(fonts[fontName] || StandardFonts.CourierBold);
    }

    function textWidth(font, text, size, letterSpacing) {
        const base = font.widthOfTextAtSize(text, size);
        return base + Math.max(0, text.length - 1) * letterSpacing;
    }

    function fitFontSize(font, text, desiredSize, minSize, maxWidth, letterSpacing) {
        let size = desiredSize;
        while (size > minSize && textWidth(font, text, size, letterSpacing) > maxWidth) size -= 0.2;
        return Math.max(size, minSize);
    }

    function drawLetterSpacedText(page, text, x, y, options) {
        let cursor = x;
        [...text].forEach((char) => {
            page.drawText(char, { ...options, x: cursor, y });
            cursor += options.font.widthOfTextAtSize(char, options.size) + options.letterSpacing;
        });
    }

    async function generateInvitePdf(name) {
        if (!window.PDFLib) throw new Error("O pdf-lib não carregou. Confirma a ligação ou recarrega a página.");
        const { PDFDocument, rgb } = PDFLib;
        const response = await fetch(INVITE_CONFIG.basePdfUrl, { cache: "no-store" });
        if (!response.ok) throw new Error("PDF base não encontrado em assets/convite-base.pdf.");

        const pdfDoc = await PDFDocument.load(await response.arrayBuffer());
        const page = pdfDoc.getPages()[INVITE_CONFIG.pageIndex] || pdfDoc.getPages()[0];
        const font = await getFont(pdfDoc, INVITE_CONFIG.agentName.font);
        const finalText = displayName(name);
        const area = INVITE_CONFIG.agentName;
        const fontSize = fitFontSize(font, finalText, area.fontSize, area.minFontSize, area.maxWidth, area.letterSpacing);
        const finalWidth = textWidth(font, finalText, fontSize, area.letterSpacing);
        const x = area.x - finalWidth / 2;
        const y = area.y;

        if (area.coverPlaceholder) {
            const mask = area.coverPlaceholder;
            page.drawRectangle({
                x: mask.x,
                y: mask.y,
                width: mask.width,
                height: mask.height,
                color: rgb(mask.color.r, mask.color.g, mask.color.b),
                opacity: mask.opacity
            });
        }

        drawLetterSpacedText(page, finalText, x, y, {
            size: fontSize,
            font,
            color: rgb(area.color.r, area.color.g, area.color.b),
            letterSpacing: area.letterSpacing
        });

        return pdfDoc.save();
    }

    async function updatePreview(name, { autoDownload = false } = {}) {
        const finalName = normalizeName(name);
        if (!finalName) {
            setStatus("Escreve um nome para gerar o convite personalizado.", true);
            setDownloadEnabled(false);
            return;
        }

        try {
            setStatus("A gerar o PDF personalizado em alta qualidade...");
            setDownloadEnabled(false);
            localStorage.setItem(STORAGE_KEY, finalName);

            const pdfBytes = await generateInvitePdf(finalName);
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
            currentBlobUrl = URL.createObjectURL(blob);
            previewName.textContent = displayName(finalName);
            download.href = currentBlobUrl;
            download.download = `${INVITE_CONFIG.filePrefix}-${slugify(finalName)}.pdf`;
            setDownloadEnabled(true);
            setStatus(`Pré-visualização pronta para ${finalName}. Nome aplicado apenas na área AGENTE N.º.`);
            if (autoDownload) download.click();
        } catch (error) {
            console.error(error);
            setStatus(error.message || "Não foi possível gerar o PDF personalizado.", true);
            setDownloadEnabled(false);
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        updatePreview(input.value);
    });

    download.addEventListener("click", (event) => {
        if (download.getAttribute("aria-disabled") === "true") event.preventDefault();
    });

    const name = initialName();
    if (name) {
        input.value = name;
        updatePreview(name);
    } else {
        setStatus("Escreve o nome do convidado para gerar a pré-visualização.");
        input.focus();
    }

    window.BaileCosmicoInviteConfig = INVITE_CONFIG;
})();