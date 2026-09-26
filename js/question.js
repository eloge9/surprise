/* ==========================================================================
   QUESTION — « Veux-tu être ma copine ? » (question.html)

   Le bouton NON est taquin mais JAMAIS bloquant :
   - il ne fuit pas au survol : il réagit seulement quand on le touche/clique ;
   - à chaque tentative il change de texte, se déplace un peu, rapetisse
     légèrement (jamais sous une taille confortable au doigt) ;
   - après la dernière phrase, il revient à sa place et fonctionne
     normalement : NON reste une vraie réponse possible.
   ========================================================================== */

(async () => {
    const { sequence, montrer, attendre } = SiteAnimations;
    const texte = document.getElementById("texte");
    const reponses = document.getElementById("reponses");
    const oui = document.getElementById("oui");
    const non = document.getElementById("non");
    const annonce = document.getElementById("annonce");
    const respect = document.getElementById("respect");

    const { phrases, final } = CONFIG.boutonNon;
    let tentatives = 0;

    /* ---------- notification (CONFIG.notification) ----------
       E-mail via FormSubmit, notification téléphone via ntfy.sh.
       keepalive : l'envoi continue même si la page change juste après. */

    function prevenir(cle) {
        const notif = CONFIG.notification || {};
        const message = notif[cle] || cle;

        const email = String(notif.email || "").trim();
        if (email) {
            const donnees = new FormData();
            donnees.append("_subject", message);
            donnees.append("message", message);
            donnees.append("_template", "box");
            donnees.append("_captcha", "false");
            fetch("https://formsubmit.co/ajax/" + encodeURIComponent(email), {
                method: "POST",
                headers: { Accept: "application/json" },
                body: donnees,
                keepalive: true
            }).catch(() => {});
        }

        const sujet = String(notif.sujet || "").trim();
        if (sujet) {
            fetch("https://ntfy.sh/" + encodeURIComponent(sujet), {
                method: "POST", body: message, keepalive: true
            }).catch(() => {});
        }
    }

    /* ---------- déplacement du bouton NON à l'intérieur de sa zone ---------- */

    function chevauche(a, b, marge = 12) {
        return !(a.x + a.w + marge < b.x || b.x + b.w + marge < a.x ||
                 a.y + a.h + marge < b.y || b.y + b.h + marge < a.y);
    }

    function deplacer(echelle) {
        const zoneL = reponses.clientWidth;
        const zoneH = reponses.clientHeight;
        const base = { x: non.offsetLeft, y: non.offsetTop, w: non.offsetWidth, h: non.offsetHeight };
        const rectOui = { x: oui.offsetLeft, y: oui.offsetTop, w: oui.offsetWidth, h: oui.offsetHeight };

        let cible = null;
        for (let essai = 0; essai < 25; essai++) {
            const c = {
                x: Math.random() * Math.max(0, zoneL - base.w),
                y: Math.random() * Math.max(0, zoneH - base.h),
                w: base.w, h: base.h
            };
            const assezLoin = Math.hypot(c.x - base.x, c.y - base.y) > 40;
            if (!chevauche(c, rectOui) && assezLoin) { cible = c; break; }
        }
        if (!cible) cible = { x: base.x, y: Math.max(0, zoneH - base.h) };

        non.style.setProperty("--x", (cible.x - base.x).toFixed(0) + "px");
        non.style.setProperty("--y", (cible.y - base.y).toFixed(0) + "px");
        non.style.setProperty("--s", echelle.toFixed(2));
    }

    function revenir() {
        non.style.setProperty("--x", "0px");
        non.style.setProperty("--y", "0px");
        non.style.setProperty("--s", "1");
    }

    non.addEventListener("click", async () => {
        if (tentatives < phrases.length) {
            non.textContent = phrases[tentatives];
            annonce.textContent = phrases[tentatives];
            tentatives++;
            // Rapetisse doucement, sans jamais passer sous 85 % (reste facile à toucher).
            deplacer(Math.max(0.85, 1 - tentatives * 0.03));
            return;
        }

        if (tentatives === phrases.length) {
            tentatives++;
            non.textContent = final;
            annonce.textContent = final;
            non.classList.add("is-resigne");
            revenir();
            return;
        }

        // Réponse NON confirmée : on respecte.
        non.disabled = true;
        prevenir("messageNon");
        reponses.classList.add("is-sortie");
        texte.classList.add("is-sortie");
        await attendre(900);
        reponses.hidden = true;
        texte.hidden = true;
        respect.hidden = false;
        sequence(respect.querySelectorAll(".reveal"));
    });

    /* ---------- OUI ---------- */

    oui.addEventListener("click", () => {
        oui.classList.add("is-choisi");
        document.body.classList.add("is-oui");
        oui.disabled = true;
        non.disabled = true;
        prevenir("messageOui");
        setTimeout(() => SiteNavigation.partir("oui.html"), SiteAnimations.reduit ? 100 : 900);
    });

    /* ---------- mise en scène ---------- */

    await attendre(600);
    await sequence(texte.querySelectorAll(".reveal"));
    reponses.hidden = false;
    montrer(reponses);
})();
