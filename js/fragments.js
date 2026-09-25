/* ==========================================================================
   FRAGMENTS — galerie verticale de souvenirs (fragments.html).

   - Les médias viennent de CONFIG.fragments.
   - Les vidéos ne se chargent qu'à l'approche de l'écran (lazy).
   - Une seule vidéo joue à la fois : celle qui est la plus visible.
   - Lecture automatique en MUET (seule autorisée sur mobile).
   - « Activer le son » coupe la musique du site pendant l'écoute.
   - Un média manquant disparaît sans laisser de trace.
   ========================================================================== */

(() => {
    const pellicule = document.getElementById("pellicule");
    if (!pellicule || !Array.isArray(CONFIG.fragments)) return;

    const { reduit, montrer } = SiteAnimations;
    const videos = [];
    let active = null;
    let sonActif = false;

    const ICONE_LECTURE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';

    /* ---------- construction ---------- */

    function creerFragment(f, i) {
        const figure = document.createElement("figure");
        figure.className = "fragment reveal";
        figure.dataset.manuel = "";
        if (f.qui) figure.dataset.qui = f.qui;

        const cadre = document.createElement("div");
        cadre.className = "fragment__cadre";

        if (f.type === "video") {
            const v = document.createElement("video");
            v.className = "fragment__media";
            v.muted = true;
            v.defaultMuted = true;
            v.loop = true;
            v.playsInline = true;
            v.setAttribute("muted", "");
            v.setAttribute("playsinline", "");
            v.setAttribute("webkit-playsinline", "");
            v.preload = "none";
            v.dataset.src = f.src;
            v.setAttribute("aria-label", f.caption || "Un souvenir en vidéo");
            v.addEventListener("error", () => retirer(figure, v));
            v.addEventListener("loadedmetadata", () => {
                if (v.videoWidth && v.videoHeight) {
                    cadre.style.setProperty("--ratio", v.videoWidth + " / " + v.videoHeight);
                    cadre.classList.toggle("is-paysage", v.videoWidth > v.videoHeight);
                }
            });
            v.addEventListener("play", () => cadre.classList.add("is-lecture"));
            v.addEventListener("pause", () => cadre.classList.remove("is-lecture"));

            // Tout le cadre sert de bouton lecture / pause (tactile + clavier).
            const lecture = document.createElement("button");
            lecture.type = "button";
            lecture.className = "fragment__lecture";
            lecture.setAttribute("aria-label", "Lire ou mettre en pause la vidéo " + (i + 1));
            lecture.innerHTML = '<span class="fragment__icone">' + ICONE_LECTURE + "</span>";
            lecture.addEventListener("click", () => basculerLecture(v));

            const son = document.createElement("button");
            son.type = "button";
            son.className = "fragment__son";
            son.setAttribute("aria-pressed", "false");
            son.textContent = "🔊 Activer le son";
            son.addEventListener("click", (e) => {
                e.stopPropagation();
                basculerSon(v);
            });

            cadre.append(v, lecture, son);
            videos.push({ v, son, figure });
        } else {
            const img = document.createElement("img");
            img.className = "fragment__media";
            img.src = f.src;
            img.alt = f.alt || f.caption || "Un souvenir";
            img.loading = "lazy";
            img.decoding = "async";
            img.addEventListener("error", () => figure.remove());
            img.addEventListener("load", () => {
                cadre.style.setProperty("--ratio", img.naturalWidth + " / " + img.naturalHeight);
            });
            cadre.appendChild(img);
        }

        figure.appendChild(cadre);

        if (f.caption) {
            const legende = document.createElement("figcaption");
            legende.className = "fragment__legende";
            legende.textContent = f.caption;
            figure.appendChild(legende);
        }
        return figure;
    }

    function retirer(figure, v) {
        const i = videos.findIndex((x) => x.v === v);
        if (i >= 0) videos.splice(i, 1);
        if (active === v) active = null;
        figure.remove();
    }

    /* ---------- lecture ---------- */

    function charger(v) {
        if (!v.dataset.src) return;
        v.src = v.dataset.src;
        v.preload = "metadata";
        delete v.dataset.src;
    }

    function jouer(v) {
        charger(v);
        videos.forEach(({ v: autre }) => { if (autre !== v && !autre.paused) autre.pause(); });
        active = v;
        v.muted = !sonActif;
        const p = v.play();
        if (p && p.catch) {
            p.catch(() => {
                // Son refusé par le navigateur : on retente en muet, sans rien afficher.
                if (!v.muted) {
                    sonActif = false;
                    majBoutonsSon();
                    SiteAudio.reprendre();
                    v.muted = true;
                    v.play().catch(() => { /* autoplay totalement bloqué : l'icône ▶ reste visible */ });
                }
            });
        }
    }

    function basculerLecture(v) {
        if (v.paused || v.ended) jouer(v);
        else v.pause();
    }

    function basculerSon(v) {
        sonActif = !sonActif;
        if (sonActif) {
            SiteAudio.suspendre();
            jouer(v);             // appelé dans le geste : le son est autorisé
        } else {
            videos.forEach(({ v: x }) => { x.muted = true; });
            SiteAudio.reprendre();
        }
        majBoutonsSon();
    }

    function majBoutonsSon() {
        videos.forEach(({ son }) => {
            son.textContent = sonActif ? "🔇 Couper le son" : "🔊 Activer le son";
            son.setAttribute("aria-pressed", sonActif ? "true" : "false");
        });
    }

    /* ---------- observation ---------- */

    function observer() {
        const figures = [...pellicule.children];

        if (!("IntersectionObserver" in window)) {
            figures.forEach(montrer);
            videos.forEach(({ v }) => charger(v));
            return;
        }

        // 1. Apparition douce de chaque fragment
        const obsReveal = new IntersectionObserver((entrees) => {
            entrees.forEach((e) => {
                if (e.isIntersecting) { montrer(e.target); obsReveal.unobserve(e.target); }
            });
        }, { threshold: 0.1 });
        figures.forEach((f) => obsReveal.observe(f));

        // 2. Chargement anticipé quand la vidéo approche (≈ un écran avant)
        const obsCharge = new IntersectionObserver((entrees) => {
            entrees.forEach((e) => {
                if (e.isIntersecting) { charger(e.target); obsCharge.unobserve(e.target); }
            });
        }, { rootMargin: "100% 0px 100% 0px" });

        // 3. Lecture de la vidéo la plus visible, pause des autres
        const visibilite = new Map();
        const obsLecture = new IntersectionObserver((entrees) => {
            entrees.forEach((e) => visibilite.set(e.target, e.intersectionRatio));

            let meilleure = null, ratio = 0;
            visibilite.forEach((r, v) => { if (r > ratio) { ratio = r; meilleure = v; } });

            if (active && (visibilite.get(active) || 0) < 0.35) {
                active.pause();
                active = null;
            }
            // Mouvement réduit : pas de lecture automatique, la visiteuse touche ▶.
            if (!reduit && meilleure && ratio >= 0.6 && meilleure !== active) jouer(meilleure);
        }, { threshold: [0, 0.35, 0.6, 0.85] });

        videos.forEach(({ v }) => { obsCharge.observe(v); obsLecture.observe(v); });
    }

    /* ---------- départ ---------- */

    CONFIG.fragments.forEach((f, i) => pellicule.appendChild(creerFragment(f, i)));
    observer();

    // Page cachée (appel, verrouillage) : on met la vidéo en pause.
    document.addEventListener("visibilitychange", () => {
        if (document.hidden && active) active.pause();
    });
})();
