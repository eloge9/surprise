/* ==========================================================================
   AUDIO — une seule musique à la fois, sur tout le site.

   - La page choisit sa musique avec <body data-music="cle">.
   - Une section peut la remplacer pendant qu'elle est à l'écran :
     <section data-music="cle">.
   - data-music="" (ou absent) = silence (pages vidéo et question).
   - Un seul élément <audio> est utilisé : deux morceaux ne peuvent donc
     jamais jouer en même temps.
   - Si le navigateur bloque la lecture automatique, la musique démarre au
     premier toucher / clic / touche clavier.
   - Si un fichier manque, la musique est simplement indisponible, sans
     aucun message pour la visiteuse.
   ========================================================================== */

const SiteAudio = (() => {
    const CLE_POSITIONS = "notre-histoire.positions";
    const CLE_MUET = "notre-histoire.muet";

    const stockage = {
        lire(cle) { try { return sessionStorage.getItem(cle); } catch (e) { return null; } },
        ecrire(cle, val) { try { sessionStorage.setItem(cle, val); } catch (e) { /* stockage indisponible : tant pis */ } }
    };

    let el = null;
    let piste = null;              // clé de la musique chargée
    let muet = stockage.lire(CLE_MUET) === "1";
    let bloque = false;            // lecture refusée par le navigateur (autoplay)
    let suspendu = false;          // mis en pause par une vidéo avec son
    let bouton = null;
    let fonduEnCours = null;
    let dejaAnnonce = new Set();
    const indisponibles = new Set();
    let positions = lirePositions();

    /* ---------- utilitaires ---------- */

    function lirePositions() {
        try { return JSON.parse(stockage.lire(CLE_POSITIONS)) || {}; } catch (e) { return {}; }
    }

    function sauverPosition() {
        if (el && piste && !isNaN(el.currentTime)) positions[piste] = el.currentTime;
        stockage.ecrire(CLE_POSITIONS, JSON.stringify(positions));
    }

    /* Volume de la piste (CONFIG.musiques[cle].volume), sinon CONFIG.volume. */
    function volumeCible() {
        if (typeof CONFIG === "undefined") return 0.6;
        const morceau = piste && CONFIG.musiques && CONFIG.musiques[piste];
        if (morceau && typeof morceau.volume === "number") return morceau.volume;
        return CONFIG.volume || 0.6;
    }

    /* Fondu de volume (sans effet sur iOS où le volume est fixe : pas grave). */
    function fondu(vers, duree, ensuite) {
        if (fonduEnCours) cancelAnimationFrame(fonduEnCours);
        const depart = el.volume;
        const debut = performance.now();
        const etape = (t) => {
            const k = Math.min(1, (t - debut) / duree);
            try { el.volume = depart + (vers - depart) * k; } catch (e) { /* ignore */ }
            if (k < 1) fonduEnCours = requestAnimationFrame(etape);
            else { fonduEnCours = null; if (ensuite) ensuite(); }
        };
        fonduEnCours = requestAnimationFrame(etape);
    }

    /* ---------- lecture ---------- */

    function lancer() {
        if (!piste || muet || suspendu) return;
        try { el.volume = 0; } catch (e) { /* ignore */ }
        let promesse;
        try { promesse = el.play(); } catch (e) { return; }
        if (!promesse) return;
        promesse.then(() => {
            bloque = false;
            fondu(volumeCible(), 1400);
            annoncer();
            majBouton();
        }).catch((err) => {
            if (err && err.name === "NotAllowedError") {
                bloque = true;
                attendreInteraction();
            }
            majBouton();
        });
    }

    function charger(cle) {
        piste = cle;
        el.src = CONFIG.musiques[cle].src;
        const pos = positions[cle];
        if (pos) {
            el.addEventListener("loadedmetadata", () => {
                try { if (pos < el.duration - 2) el.currentTime = pos; } catch (e) { /* ignore */ }
            }, { once: true });
        }
        lancer();
        majBouton();
    }

    /* Choisit la musique à jouer (ou le silence si cle est vide). */
    function jouer(cle) {
        const existe = cle && typeof CONFIG !== "undefined" && CONFIG.musiques && CONFIG.musiques[cle];
        if (!existe || indisponibles.has(cle)) { arreter(); return; }

        if (cle === piste) {
            if (el.paused && !muet && !suspendu) lancer();
            return;
        }

        if (piste && !el.paused) {
            sauverPosition();
            fondu(0, 700, () => { el.pause(); charger(cle); });
        } else {
            if (piste) sauverPosition();
            charger(cle);
        }
    }

    /* Silence, avec un fondu de `duree` ms (ex. 2500 avant la question). */
    function arreter(duree = 600) {
        if (!el) return;
        if (piste) sauverPosition();
        const fin = () => { el.pause(); piste = null; majBouton(); };
        if (!el.paused) fondu(0, duree, fin); else fin();
    }

    /* Pause temporaire (ex. une vidéo avec son). */
    function suspendre() {
        suspendu = true;
        if (el && !el.paused) fondu(0, 400, () => el.pause());
    }
    function reprendre() {
        suspendu = false;
        lancer();
    }

    /* Fondu de sortie avant de quitter la page. */
    function sortir() {
        sauverPosition();
        if (el && !el.paused) fondu(0, 550);
    }

    /* ---------- autoplay bloqué : on attend un geste ---------- */

    const evenementsGeste = ["pointerup", "touchend", "click", "keydown"];
    let enAttente = false;

    function surGeste() {
        evenementsGeste.forEach((e) => document.removeEventListener(e, surGeste, true));
        enAttente = false;
        // play() doit être appelé directement dans le geste (exigence iOS).
        if (bloque && piste && !muet && !suspendu) lancer();
    }

    function attendreInteraction() {
        if (enAttente) return;
        enAttente = true;
        evenementsGeste.forEach((e) => document.addEventListener(e, surGeste, true));
    }

    /* ---------- bouton son ---------- */

    function creerBouton(conteneur) {
        bouton = document.createElement("button");
        bouton.type = "button";
        bouton.className = "barre__bouton son-toggle";
        bouton.hidden = true;
        bouton.innerHTML =
            '<svg class="icone-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>' +
            '<svg class="icone-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
        bouton.addEventListener("click", (e) => {
            e.stopPropagation();
            basculerMuet();
        });
        conteneur.appendChild(bouton);
    }

    function basculerMuet() {
        muet = !muet;
        stockage.ecrire(CLE_MUET, muet ? "1" : "0");
        if (muet) {
            if (!el.paused) fondu(0, 400, () => el.pause());
        } else {
            lancer();
        }
        majBouton();
    }

    function majBouton() {
        if (!bouton) return;
        const disponible = !!piste && !indisponibles.has(piste);
        bouton.hidden = !disponible;
        bouton.classList.toggle("is-muet", muet);
        bouton.classList.toggle("is-attente", disponible && !muet && bloque);
        const label = muet
            ? "Activer la musique"
            : (bloque ? "Lancer la musique" : "Couper la musique");
        bouton.setAttribute("aria-label", label);
        bouton.setAttribute("aria-pressed", muet ? "true" : "false");
        bouton.title = label;
    }

    /* Petit bandeau « ♪ Titre » la première fois qu'un morceau démarre. */
    function annoncer() {
        if (!piste || dejaAnnonce.has(piste)) return;
        dejaAnnonce.add(piste);
        const titre = CONFIG.musiques[piste] && CONFIG.musiques[piste].titre;
        if (!titre) return;
        let bandeau = document.querySelector(".en-ce-moment");
        if (!bandeau) {
            bandeau = document.createElement("div");
            bandeau.className = "en-ce-moment";
            bandeau.setAttribute("aria-hidden", "true");
            document.body.appendChild(bandeau);
        }
        bandeau.textContent = "♪  " + titre;
        requestAnimationFrame(() => bandeau.classList.add("is-visible"));
        setTimeout(() => bandeau.classList.remove("is-visible"), 4200);
    }

    /* ---------- musique par section ---------- */

    function observerSections(musiquePage) {
        const sections = document.querySelectorAll("section[data-music], div[data-music]");
        if (!sections.length || !("IntersectionObserver" in window)) return;

        const actives = new Set();
        let minuteur = null;

        const choisir = () => {
            // La dernière section active dans l'ordre du document l'emporte.
            let cle = musiquePage;
            sections.forEach((s) => { if (actives.has(s)) cle = s.dataset.music; });
            clearTimeout(minuteur);
            minuteur = setTimeout(() => jouer(cle), 350);
        };

        // Une ligne horizontale au milieu de l'écran sert de « tête de lecture ».
        const obs = new IntersectionObserver((entrees) => {
            entrees.forEach((e) => (e.isIntersecting ? actives.add(e.target) : actives.delete(e.target)));
            choisir();
        }, { rootMargin: "-50% 0px -50% 0px" });

        sections.forEach((s) => obs.observe(s));
    }

    /* ---------- initialisation ---------- */

    function init(conteneurBouton) {
        el = new Audio();
        el.loop = true;
        el.preload = "auto";
        el.setAttribute("playsinline", "");

        // Fichier manquant ou illisible : la musique devient indisponible, en silence.
        el.addEventListener("error", () => {
            if (piste) indisponibles.add(piste);
            piste = null;
            majBouton();
        });

        if (conteneurBouton) creerBouton(conteneurBouton);

        const musiquePage = document.body.dataset.music || "";
        jouer(musiquePage);
        observerSections(musiquePage);

        window.addEventListener("pagehide", sauverPosition);
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) sauverPosition();
        });
    }

    return { init, jouer, arreter, suspendre, reprendre, sortir, sauverPosition };
})();
