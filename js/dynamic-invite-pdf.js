(function () {
    const STORAGE_KEY = "baile_cosmico_guest_name";
    const DEFAULT_NAME = "Convidado";
    const EXPORT_MAX_EDGE = 2400;

    const INVITE_CONFIG = {
        pageIndex: 0,
        filePrefix: "convite-baile-cosmico"
    };

    const params = new URLSearchParams(window.location.search);
    const form = document.querySelector("[data-pdf-name-form]");
    const input = document.querySelector("#pdf-guest-name");
    const previewShell = document.querySelector("[data-pdf-preview-shell]");
    const previewImage = document.querySelector(".pdf-preview-image");
    const previewMask = document.querySelector(".pdf-preview-agent-mask");
    const previewAgentCode = document.querySelector("[data-pdf-preview-agent-code]");
    const previewName = document.querySelector("[data-pdf-preview-name]");
    const status = document.querySelector("[data-pdf-status]");
    const download = document.querySelector("[data-download-invite]");
    const missionBriefing = document.querySelector("[data-mission-briefing]");
    const missionMessage = document.querySelector("[data-mission-message]");
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

    function resolveMission(name) {
        return window.BaileCosmicoMission?.resolveGuest(name) || null;
    }

    function missionText(name, mission) {
        return window.BaileCosmicoMission?.missionMessage(name, mission) || "";
    }

    function updateMissionBriefing(name, mission) {
        if (!missionBriefing || !missionMessage) return;

        missionBriefing.hidden = false;
        missionMessage.textContent = missionText(name, mission);
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
    function drawTextElement(ctx, element, text, shellRect, sx, sy, scale) {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const fontSize = parseFloat(style.fontSize) * sx;
        const fontWeight = style.fontWeight || "800";
        const fontFamily = style.fontFamily || '"Courier New", Courier, monospace';
        const textColor = style.color || "#e8bd6e";
        const centerX = (rect.left - shellRect.left + rect.width / 2) * sx;
        const centerY = (rect.top - shellRect.top + rect.height / 2) * sy;

        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (style.textShadow && style.textShadow !== "none") {
            ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
            ctx.shadowBlur = 4 * scale;
        }

        const printableText = style.textTransform === "uppercase" ? text.toLocaleUpperCase("pt-PT") : text;
        ctx.fillText(printableText, centerX, centerY);
        ctx.shadowBlur = 0;
    }

    async function renderPreviewCanvas(finalText, mission) {
        previewName.textContent = finalText;
        if (previewAgentCode) previewAgentCode.textContent = mission ? mission.codigoConfidencial : "";
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

        drawTextElement(ctx, previewName, finalText, shellRect, sx, sy, scale);
        if (previewAgentCode && mission) {
            drawTextElement(ctx, previewAgentCode, mission.codigoConfidencial, shellRect, sx, sy, scale);
        }
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

    function getPageSizeFromPreview(canvas) {
        const iw = previewImage.naturalWidth || canvas.width || 914;
        const ih = previewImage.naturalHeight || canvas.height || 1280;
        const width = 595.28; // A4 width in pt (approx). Keeps print-friendly sizing.
        const height = width * (ih / iw);
        return { width, height };
    }

    /** PDF = página com a imagem rasterizada do preview (réplica visual). */
    async function generateInvitePdf(name, mission) {
        if (!window.PDFLib) throw new Error("O pdf-lib não carregou. Confirma a ligação ou recarrega a página.");

        const finalText = displayName(name);
        const canvas = await renderPreviewCanvas(finalText, mission);
        const pngBytes = await canvasToPngBytes(canvas);
        const { PDFDocument } = PDFLib;
        const { width, height } = getPageSizeFromPreview(canvas);

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

            const mission = resolveMission(finalName);
            previewName.textContent = displayName(finalName);
            if (previewAgentCode) previewAgentCode.textContent = mission ? mission.codigoConfidencial : "";
            updateMissionBriefing(finalName, mission);
            const pdfBytes = await generateInvitePdf(finalName, mission);
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
            currentBlobUrl = URL.createObjectURL(blob);
            download.href = currentBlobUrl;
            download.download = `${INVITE_CONFIG.filePrefix}-${slugify(finalName)}.pdf`;
            setDownloadEnabled(true);
            if (mission) {
                setStatus(`PDF pronto — identidade confidencial integrada para ${finalName}.`);
            } else {
                setStatus(`PDF pronto — assinatura confidencial pendente para ${finalName}.`);
            }
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
