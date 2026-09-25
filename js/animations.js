/* ==========================================================================
   ANIMATIONS — apparitions au scroll, textes progressifs, particules,
   confettis. Tout respecte prefers-reduced-motion.
   ========================================================================== */

const SiteAnimations = (() => {
    const reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const attendre = (ms) => new Promise((r) => setTimeout(r, reduit ? Math.min(ms, 200) : ms));

    /* ---------- Apparition au scroll ----------
       .reveal            → apparaît quand l'élément entre à l'écran
       [data-cascade]     → ses enfants .reveal apparaissent en cascade
       .cupidon           → la flèche part quand elle devient visible      */
    let observateur = null;

    function initReveal() {
        document.querySelectorAll("[data-cascade]").forEach((groupe) => {
            const pas = parseFloat(groupe.dataset.cascade) || 0.35;
            groupe.querySelectorAll(":scope > .reveal").forEach((enfant, i) => {
                enfant.style.setProperty("--d", (reduit ? 0 : i * pas) + "s");
            });
        });

        const cibles = document.querySelectorAll(".reveal:not([data-manuel]), .cupidon:not([data-manuel])");
        if (!("IntersectionObserver" in window)) {
            cibles.forEach(montrer);
            return;
        }
        observateur = new IntersectionObserver((entrees) => {
            entrees.forEach((e) => {
                if (e.isIntersecting) {
                    montrer(e.target);
                    observateur.unobserve(e.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
        cibles.forEach((c) => observateur.observe(c));
    }

    function montrer(el) {
        if (!el) return;
        el.hidden = false;
        // Double rAF : laisse le navigateur appliquer l'état caché avant la transition.
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-visible")));
        el.querySelectorAll(".cupidon").forEach((c) => c.classList.add("is-visible"));
    }

    function cacher(el) {
        if (el) el.classList.remove("is-visible");
    }

    /* Affiche une liste d'éléments l'un après l'autre.
       Chaque élément peut préciser sa pause avant le suivant : data-pause="1800". */
    async function sequence(elements, pauseParDefaut = 1500) {
        for (const el of elements) {
            montrer(el);
            await attendre(parseInt(el.dataset.pause, 10) || pauseParDefaut);
        }
    }

    /* ---------- Particules de lumière (très légères, CSS) ---------- */
    function particules(conteneur, nombre = 14) {
        if (reduit || !conteneur) return;
        const couleurs = ["var(--or)", "var(--rose-doux)", "var(--bleu-clair)"];
        const couche = document.createElement("div");
        couche.className = "particules";
        couche.setAttribute("aria-hidden", "true");
        for (let i = 0; i < nombre; i++) {
            const p = document.createElement("span");
            p.className = "particule";
            p.style.left = Math.random() * 100 + "%";
            p.style.top = 20 + Math.random() * 75 + "%";
            p.style.setProperty("--t", (1.5 + Math.random() * 2.5).toFixed(1) + "px");
            p.style.setProperty("--c", couleurs[i % couleurs.length]);
            p.style.setProperty("--o", (0.3 + Math.random() * 0.5).toFixed(2));
            p.style.setProperty("--dx", (Math.random() * 40 - 20).toFixed(0) + "px");
            p.style.setProperty("--duree", (7 + Math.random() * 8).toFixed(1) + "s");
            p.style.setProperty("--delai", (-Math.random() * 12).toFixed(1) + "s");
            couche.appendChild(p);
        }
        conteneur.prepend(couche);
    }

    /* ---------- Confettis (canvas, quelques secondes seulement) ---------- */
    function confettis(duree = 4200) {
        if (reduit) return;
        const canvas = document.createElement("canvas");
        canvas.className = "confettis";
        canvas.setAttribute("aria-hidden", "true");
        Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "60" });
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const redimensionner = () => {
            canvas.width = innerWidth * ratio;
            canvas.height = innerHeight * ratio;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        };
        redimensionner();
        addEventListener("resize", redimensionner);

        const couleurs = ["#FF4F81", "#FFB6C9", "#F5D58A", "#9CC3EE", "#FFFFFF"];
        const nombre = innerWidth < 500 ? 90 : 150;
        const morceaux = Array.from({ length: nombre }, () => ({
            x: innerWidth / 2 + (Math.random() - 0.5) * innerWidth * 0.3,
            y: innerHeight * 0.45,
            vx: (Math.random() - 0.5) * 9,
            vy: -Math.random() * 11 - 4,
            taille: 4 + Math.random() * 5,
            angle: Math.random() * Math.PI,
            vitesseAngle: (Math.random() - 0.5) * 0.25,
            couleur: couleurs[Math.floor(Math.random() * couleurs.length)],
            coeur: Math.random() < 0.18
        }));

        const debut = performance.now();
        const dessinerCoeur = (s) => {
            ctx.beginPath();
            ctx.moveTo(0, s * 0.3);
            ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.4, -s, 0, -s * 0.35);
            ctx.bezierCurveTo(s * 0.4, -s, s, -s * 0.4, 0, s * 0.3);
            ctx.fill();
        };

        const image = (t) => {
            const ecoule = t - debut;
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            ctx.globalAlpha = ecoule > duree - 1000 ? Math.max(0, (duree - ecoule) / 1000) : 1;
            morceaux.forEach((m) => {
                m.vy += 0.22;
                m.vx *= 0.99;
                m.x += m.vx;
                m.y += m.vy;
                m.angle += m.vitesseAngle;
                ctx.save();
                ctx.translate(m.x, m.y);
                ctx.rotate(m.angle);
                ctx.fillStyle = m.couleur;
                if (m.coeur) dessinerCoeur(m.taille * 1.3);
                else ctx.fillRect(-m.taille / 2, -m.taille / 4, m.taille, m.taille / 2);
                ctx.restore();
            });
            if (ecoule < duree) requestAnimationFrame(image);
            else { removeEventListener("resize", redimensionner); canvas.remove(); }
        };
        requestAnimationFrame(image);
    }

    return { reduit, attendre, initReveal, montrer, cacher, sequence, particules, confettis };
})();
