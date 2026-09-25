/* ==========================================================================
   MAIN — initialisation commune à toutes les pages.
   Ordre de chargement (defer) : config → animations → audio → navigation
   → main → script propre à la page.
   ========================================================================== */

(() => {
    const ICONE_RETOUR =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';

    /* Barre du haut : retour discret, fine progression, bouton son. */
    function construireBarre() {
        const barre = document.createElement("header");
        barre.className = "barre";

        const { index, href } = SiteNavigation.voisine(-1);
        const total = CONFIG.parcours.length - 1;

        const progression = document.createElement("div");
        progression.className = "barre__progression";
        progression.setAttribute("aria-hidden", "true");
        progression.innerHTML = "<span></span>";
        progression.style.setProperty("--p", index > 0 ? (index / total).toFixed(3) : 0);
        barre.appendChild(progression);

        if (href && !document.body.hasAttribute("data-sans-retour")) {
            const retour = document.createElement("a");
            retour.className = "barre__bouton";
            retour.href = href;
            retour.setAttribute("aria-label", "Revenir au chapitre précédent");
            retour.innerHTML = ICONE_RETOUR;
            barre.appendChild(retour);
        } else {
            const vide = document.createElement("span");
            vide.className = "barre__espace";
            barre.appendChild(vide);
        }

        document.body.prepend(barre);
        return barre;
    }

    /* Textes courts venant de CONFIG.textes : data-texte="cle".
       Si le texte est vide, le bloc [data-si-texte] qui l'entoure est retiré. */
    function remplirTextes() {
        document.querySelectorAll("[data-texte]").forEach((el) => {
            const valeur = (CONFIG.textes && CONFIG.textes[el.dataset.texte] || "").trim();
            if (valeur) {
                el.textContent = valeur;
            } else {
                (el.closest("[data-si-texte]") || el).remove();
            }
        });

        const prenom = (CONFIG.prenom || "").trim();
        document.querySelectorAll("[data-prenom]").forEach((el) => {
            if (prenom) el.textContent = prenom;
        });
    }

    /* Image manquante : on retire discrètement la figure qui la contient. */
    function protegerImages() {
        document.querySelectorAll("img").forEach((img) => {
            const retirer = () => (img.closest("figure") || img).remove();
            if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) retirer();
            else img.addEventListener("error", retirer, { once: true });
        });
    }

    const barre = construireBarre();
    remplirTextes();
    protegerImages();
    SiteNavigation.init();
    SiteAudio.init(barre);
    SiteAnimations.initReveal();

    document.querySelectorAll("[data-particules]").forEach((el) => {
        SiteAnimations.particules(el, parseInt(el.dataset.particules, 10) || 14);
    });
})();
