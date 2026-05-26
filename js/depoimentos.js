(function () {
    const reveals = document.querySelectorAll(".reveal");
    const parallaxLayers = document.querySelectorAll(".cordel-stanza__bg");

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );

    reveals.forEach((element) => revealObserver.observe(element));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    function updateParallax() {
        const viewport = window.innerHeight;
        parallaxLayers.forEach((layer) => {
            const section = layer.closest(".cordel-stanza");
            if (!section) return;
            const rect = section.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > viewport) return;
            const progress = (rect.top + rect.height * 0.5 - viewport * 0.5) / viewport;
            layer.style.setProperty("--parallax-y", `${progress * -28}px`);
        });
        ticking = false;
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateParallax);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateParallax();
})();
