(function () {
    const STORAGE_KEY = "baile_cosmico_guest_name";
    const DEFAULT_NAME = "Convidado";
    const EXPORT_MAX_EDGE = 2400;

    const INVITE_CONFIG = {
        basePdfUrl: "../assets/convite-base.pdf",
        pageIndex: 0,
        filePrefix: "convite-baile-cosmico"
    };

    const params = new URLSearchParams(window.location.search);
    const form = document.querySelector("[data-pdf-name-form]");
    const input = document.querySelector("#pdf-guest-name");
    const previewShell = document.querySelector("[data-pdf-preview-shell]");
    const previewImage = document.querySelector(".pdf-preview-image");
    const previewMask = document.querySelector(".pdf-preview-agent-mask");
    const previewName = document.querySelector("[data-pdf-preview-name]");
    const status = document.querySelector("[data-pdf-status]");
    const download = document.querySelector("[data-download-invite]");
    let currentBlobUrl = "";

    if (!form || !input || !previewShell || !previewName || !previewImage || !download) return;

    function normalizeName(value) {
        return (value || "").trim().replace(/\s+/g, " ").slice(0, 42);
    }

    function displayName(value) {
        return normalizeName(value) || DEFAULT_NAME;
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

    function waitForImage(img) {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise((resolve, reject) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", () => reject(new Error("Imagem do preview não carregou.")), { once: true });
        });
    }

    function waitForLayout() {
        return new Promise((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(resolve));
        });
    }

    function exportScale(shellWidth, shellHeight) {
        const maxSide = Math.max(shellWidth, shellHeight);
        return Math.min(3, EXPORT_MAX_EDGE / Math.max(maxSide, 1));
    }

    /** object-fit: cover — igual ao CSS do preview */
    function drawImageCover(ctx, img, width, height) {
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const scale = Math.max(width / iw, height / ih);
        const drawW = iw * scale;
        const drawH = ih * scale;
        const offsetX = (width - drawW) / 2;
        const offsetY = (height - drawH) / 2;
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    }

    function drawRoundedRect(ctx, x, y, w, h, radius) {
        const r = Math.min(radius, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Rasteriza o preview tal como o browser o desenha (posições lidas do DOM).
     * Não altera CSS nem recalcula coordenadas PDF à parte.
     */
    async function renderPreviewCanvas(finalText) {
        previewName.textContent = finalText;
        await document.fonts.ready;
        await waitForImage(previewImage);
        await waitForLayout();

        const shellW = previewShell.offsetWidth;
        const shellH = previewShell.offsetHeight;
        if (!shellW || !shellH) throw new Error("Preview indisponível. Recarrega a página.");

        const scale = exportScale(shellW, shellH);
        const canvasW = Math.round(shellW * scale);
        const canvasH = Math.round(shellH * scale);
        const canvas = document.createElement("canvas");
        canvas.width = canvasW;
        canvas.height = canvasH;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas não suportado neste browser.");

        drawImageCover(ctx, previewImage, canvasW, canvasH);

        const shellRect = previewShell.getBoundingClientRect();
        const sx = canvasW / shellRect.width;
        const sy = canvasH / shellRect.height;

        if (previewMask) {
            const maskRect = previewMask.getBoundingClientRect();
            const mx = (maskRect.left - shellRect.left) * sx;
            const my = (maskRect.top - shellRect.top) * sy;
            const mw = maskRect.width * sx;
            const mh = maskRect.height * sy;
            ctx.fillStyle = getComputedStyle(previewMask).backgroundColor || "rgba(3, 5, 13, 0.88)";
            drawRoundedRect(ctx, mx, my, mw, mh, 2 * scale);
        }

        const nameRect = previewName.getBoundingClientRect();
        const nameStyle = getComputedStyle(previewName);
        const fontSize = parseFloat(nameStyle.fontSize) * sx;
        const fontWeight = nameStyle.fontWeight || "800";
        const fontFamily = nameStyle.fontFamily || '"Courier New", Courier, monospace';
        const textColor = nameStyle.color || "#e8bd6e";
        const centerX = (nameRect.left - shellRect.left + nameRect.width / 2) * sx;
        const centerY = (nameRect.top - shellRect.top + nameRect.height / 2) * sy;

        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (nameStyle.textShadow && nameStyle.textShadow !== "none") {
            ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
            ctx.shadowBlur = 4 * scale;
        }

        const text = nameStyle.textTransform === "uppercase" ? finalText.toLocaleUpperCase("pt-PT") : finalText;
        ctx.fillText(text, centerX, centerY);
        ctx.shadowBlur = 0;
        return canvas;
    }

    function canvasToPngBytes(canvas) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error("Não foi possível exportar a imagem do preview."));
                        return;
                    }
                    blob.arrayBuffer().then(resolve).catch(reject);
                },
                "image/png",
                1
            );
        });
    }

    async function getBasePageSize() {
        if (!window.PDFLib) return { width: 360, height: 504 };
        try {
            const response = await fetch(INVITE_CONFIG.basePdfUrl, { cache: "force-cache" });
            if (!response.ok) return { width: 360, height: 504 };
            const pdfDoc = await PDFLib.PDFDocument.load(await response.arrayBuffer());
            const page = pdfDoc.getPages()[INVITE_CONFIG.pageIndex] || pdfDoc.getPages()[0];
            return { width: page.getWidth(), height: page.getHeight() };
        } catch {
            return { width: 360, height: 504 };
        }
    }

    /** PDF = página com a imagem rasterizada do preview (réplica visual). */
    async function generateInvitePdf(name) {
        if (!window.PDFLib) throw new Error("O pdf-lib não carregou. Confirma a ligação ou recarrega a página.");

        const finalText = displayName(name);
        const canvas = await renderPreviewCanvas(finalText);
        const pngBytes = await canvasToPngBytes(canvas);
        const { PDFDocument } = PDFLib;
        const { width, height } = await getBasePageSize();

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([width, height]);
        const pngImage = await pdfDoc.embedPng(pngBytes);
        page.drawImage(pngImage, { x: 0, y: 0, width, height });

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
            setStatus("A exportar o preview em PDF de alta qualidade...");
            setDownloadEnabled(false);
            localStorage.setItem(STORAGE_KEY, finalName);

            previewName.textContent = displayName(finalName);
            const pdfBytes = await generateInvitePdf(finalName);
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
            currentBlobUrl = URL.createObjectURL(blob);
            download.href = currentBlobUrl;
            download.download = `${INVITE_CONFIG.filePrefix}-${slugify(finalName)}.pdf`;
            setDownloadEnabled(true);
            setStatus(`PDF pronto — cópia fiel do preview para ${finalName}.`);
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
