const pageTitle = document.body?.dataset?.pageTitle;

if (pageTitle) {
    document.title = pageTitle.includes("Baile Cósmico") ? pageTitle : `${pageTitle} | Baile Cósmico`;
}
