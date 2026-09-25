/* ==========================================================================
   NAVIGATION — transitions douces entre les chapitres.
   Tout lien interne fait un fondu au noir (et un fondu de la musique)
   avant de changer de page.
   ========================================================================== */

const SiteNavigation = (() => {
    let enCours = false;

    function partir(href) {
        if (enCours) return;
        enCours = true;
        document.body.classList.add("is-leaving");
        if (typeof SiteAudio !== "undefined") SiteAudio.sortir();
        setTimeout(() => { window.location.href = href; }, SiteAnimations.reduit ? 50 : 700);
    }

    function estInterne(lien, e) {
        if (!lien || lien.target === "_blank" || lien.hasAttribute("download")) return false;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return false;
        const href = lien.getAttribute("href") || "";
        if (!href || href.startsWith("#") || /^(mailto|tel|https?):/i.test(href)) return false;
        return true;
    }

    function init() {
        document.addEventListener("click", (e) => {
            const lien = e.target.closest("a[href]");
            if (!estInterne(lien, e)) return;
            e.preventDefault();
            partir(lien.href);
        });

        // Retour arrière (cache du navigateur) : on retire le voile noir.
        window.addEventListener("pageshow", (e) => {
            if (e.persisted) {
                enCours = false;
                document.body.classList.remove("is-leaving");
            }
        });
    }

    /* Adresse de la page précédente / suivante dans le parcours. */
    function voisine(decalage) {
        const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
        const i = CONFIG.parcours.indexOf(page === "" ? "index.html" : page);
        if (i < 0) return { index: -1, href: null };
        return { index: i, href: CONFIG.parcours[i + decalage] || null };
    }

    return { init, partir, voisine };
})();
