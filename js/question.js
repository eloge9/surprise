/* ==========================================================================
   QUESTION — « Veux-tu être ma copine ? » (question.html)

   Le bouton NON est taquin, difficile… mais JAMAIS bloquant :
   - il réagit seulement quand on le touche/clique (pas de fuite au survol) ;
   - à chaque tentative : nouvelle phrase, il bouge et rapetisse, OUI grossit,
     le petit visage devient de plus en plus triste, l'écran tremble et le
     téléphone vibre (Android) ;
   - de temps en temps, OUI et NON échangent leurs places ;
   - après la dernière phrase, NON revient à sa place ; le clic suivant lance
     une fausse barre « Traitement de ton refus… », puis le NON est accepté.
   NON reste donc une vraie réponse possible.
   ========================================================================== */

(async () => {
    const { sequence, montrer, attendre, reduit } = SiteAnimations;
    const scene = document.querySelector(".question");
    const texte = document.getElementById("texte");
    const humeur = document.getElementById("humeur");
    const reponses = document.getElementById("reponses");
    const oui = document.getElementById("oui");
    const non = document.getElementById("non");
    const annonce = document.getElementById("annonce");
    const respect = document.getElementById("respect");
    const chargement = document.getElementById("chargement");
    const chargementTexte = document.getElementById("chargementTexte");
    const chargementBarre = document.getElementById("chargementBarre");
    const chargementPourcent = document.getElementById("chargementPourcent");
    const changerAvis = document.getElementById("changerAvis");

    const { phrases, final } = CONFIG.boutonNon;
    let tentatives = 0;
    let decide = false;

    /* Visage : du plus heureux au plus triste. Le dernier (💔) est gardé
       pour la barre de chargement. */
    const HUMEURS = ["🥰", "🙂", "😯", "😕", "😟", "🥺", "😢", "😭", "💔"];
    /* Tentatives après lesquelles OUI et NON échangent leurs places. */
    const ECHANGES = [3, 7, 11];

    /* Centre visible voulu (dans la zone #reponses) et taille de chaque bouton.
       On retient le centre, pas la translation : quand le texte de NON
       s'allonge, les boutons changent de ligne et leur place de base bouge. */
    const etat = {
        oui: { cx: 0, cy: 0, s: 1 },
        non: { cx: 0, cy: 0, s: 1 }
    };

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

    /* ---------- boutons : position, taille, échange ---------- */

    /* Centre de la place de base (sans translation) d'un bouton. */
    function centreBase(bouton) {
        return {
            x: bouton.offsetLeft + bouton.offsetWidth / 2,
            y: bouton.offsetTop + bouton.offsetHeight / 2
        };
    }

    /* Traduit le centre voulu en translation depuis la place de base. */
    function appliquer(bouton, e) {
        const base = centreBase(bouton);
        bouton.style.setProperty("--x", (e.cx - base.x).toFixed(0) + "px");
        bouton.style.setProperty("--y", (e.cy - base.y).toFixed(0) + "px");
        bouton.style.setProperty("--s", e.s.toFixed(2));
    }

    function appliquerTout() {
        appliquer(oui, etat.oui);
        appliquer(non, etat.non);
    }

    /* Rectangle visible d'un bouton, dans la zone. */
    function rectangle(bouton, e) {
        const w = bouton.offsetWidth * e.s, h = bouton.offsetHeight * e.s;
        return { x: e.cx - w / 2, y: e.cy - h / 2, w, h };
    }

    function chevauche(a, b, marge = 12) {
        return !(a.x + a.w + marge < b.x || b.x + b.w + marge < a.x ||
                 a.y + a.h + marge < b.y || b.y + b.h + marge < a.y);
    }

    /* Garde un bouton entièrement dans la zone. */
    function recadrer(bouton, e) {
        const r = rectangle(bouton, e);
        const zoneL = reponses.clientWidth, zoneH = reponses.clientHeight;
        e.cx += Math.max(0, -r.x) - Math.max(0, r.x + r.w - zoneL);
        e.cy += Math.max(0, -r.y) - Math.max(0, r.y + r.h - zoneH);
    }

    /* NON part ailleurs dans la zone, loin de OUI. */
    function deplacer() {
        const zoneL = reponses.clientWidth;
        const zoneH = reponses.clientHeight;
        const actuel = rectangle(non, etat.non);
        const rectOui = rectangle(oui, etat.oui);
        const { w, h } = actuel;
        const libre = (c) => !chevauche(c, rectOui);

        let cible = null;
        for (let essai = 0; essai < 40 && !cible; essai++) {
            const c = {
                x: Math.random() * Math.max(0, zoneL - w),
                y: Math.random() * Math.max(0, zoneH - h),
                w, h
            };
            if (libre(c) && Math.hypot(c.x - actuel.x, c.y - actuel.y) > 40) cible = c;
        }
        // Pas de chance au hasard : on balaie la zone.
        for (let y = 0; !cible && y <= zoneH - h; y += 8) {
            for (let x = 0; !cible && x <= zoneL - w; x += 8) {
                const c = { x, y, w, h };
                if (libre(c)) cible = c;
            }
        }
        if (!cible) return;
        etat.non.cx = cible.x + w / 2;
        etat.non.cy = cible.y + h / 2;
    }

    /* OUI prend la place de NON (là où est son doigt) et inversement. */
    function echanger() {
        [etat.oui.cx, etat.non.cx] = [etat.non.cx, etat.oui.cx];
        [etat.oui.cy, etat.non.cy] = [etat.non.cy, etat.oui.cy];
    }

    /* Places de départ, mesurées sans translation. */
    function placesDeBase() {
        for (const [bouton, e] of [[oui, etat.oui], [non, etat.non]]) {
            const base = centreBase(bouton);
            e.cx = base.x;
            e.cy = base.y;
        }
    }

    /* Retour aux places de départ ; OUI reste un peu plus grand. */
    function revenir() {
        etat.oui.s = 1.15;
        etat.non.s = 1;
        placesDeBase();
        recadrer(oui, etat.oui);
        if (chevauche(rectangle(oui, etat.oui), rectangle(non, etat.non), 4)) etat.oui.s = 1;
        appliquerTout();
    }

    /* ---------- émotions : visage, secousse, vibration ---------- */

    function changerHumeur(emoji) {
        if (humeur.textContent === emoji) return;
        humeur.textContent = emoji;
        humeur.classList.remove("is-change");
        void humeur.offsetWidth; // relance l'animation
        humeur.classList.add("is-change");
    }

    function secouer(fort) {
        if (navigator.vibrate) navigator.vibrate(fort ? [90, 60, 90] : 70);
        if (reduit) return;
        scene.classList.remove("is-secoue");
        void scene.offsetWidth;
        scene.classList.add("is-secoue");
    }

    /* ---------- fausse barre « Traitement de ton refus… » ---------- */

    function progression(p) {
        chargementBarre.style.setProperty("--p", p + "%");
        chargementPourcent.textContent = p + " %";
    }

    /* Renvoie true si elle a laissé aller jusqu'au bout, false si elle a
       cliqué « Finalement… OUI ». */
    async function traiterRefus() {
        chargementTexte.textContent = "Traitement de ton refus…";
        chargement.classList.remove("is-erreur");
        progression(0);
        chargement.hidden = false;
        changerAvis.focus();

        const paliers = [7, 12, 31, 38, 52, 64, 71, 83, 90, 96, 99];
        for (const p of paliers) {
            await attendre(350 + Math.random() * 450);
            if (decide) return false;
            progression(p);
        }
        await attendre(1600);
        if (decide) return false;

        chargement.classList.add("is-erreur");
        chargementTexte.textContent = "Erreur : réponse non reconnue 😅";
        secouer(true);
        await attendre(2400);
        if (decide) return false;

        chargement.classList.remove("is-erreur");
        chargementTexte.textContent = "Bon… d'accord. Refus enregistré.";
        progression(100);
        await attendre(1800);
        if (decide) return false;

        chargement.hidden = true;
        return true;
    }

    /* ---------- NON ---------- */

    non.addEventListener("click", async () => {
        if (decide) return;

        if (tentatives < phrases.length) {
            non.textContent = phrases[tentatives];
            annonce.textContent = phrases[tentatives];
            tentatives++;

            const i = Math.floor((tentatives * (HUMEURS.length - 1)) / (phrases.length + 1));
            changerHumeur(HUMEURS[Math.min(i, HUMEURS.length - 2)]);
            secouer(tentatives >= 10);

            // NON rapetisse (jamais sous 60 %), OUI grossit.
            etat.non.s = Math.max(0.6, 1 - tentatives * 0.035);
            etat.oui.s = Math.min(1.6, 1 + tentatives * 0.05);

            const echange = ECHANGES.includes(tentatives);
            if (echange) echanger();
            recadrer(oui, etat.oui);
            recadrer(non, etat.non);
            if (!echange || chevauche(rectangle(non, etat.non), rectangle(oui, etat.oui), 4)) deplacer();
            appliquerTout();
            return;
        }

        if (tentatives === phrases.length) {
            tentatives++;
            non.textContent = final;
            annonce.textContent = final;
            non.classList.add("is-resigne");
            changerHumeur("🥺");
            revenir();
            return;
        }

        // Réponse NON : dernière épreuve, la fausse barre de chargement.
        changerHumeur("💔");
        secouer(true);
        oui.disabled = true;
        non.disabled = true;
        const confirme = await traiterRefus();
        if (!confirme) return;

        decide = true;
        prevenir("messageNon");
        reponses.classList.add("is-sortie");
        texte.classList.add("is-sortie");
        humeur.classList.add("is-sortie");
        await attendre(900);
        reponses.hidden = true;
        texte.hidden = true;
        humeur.hidden = true;
        respect.hidden = false;
        sequence(respect.querySelectorAll(".reveal"));
    });

    /* ---------- OUI ---------- */

    function direOui() {
        if (decide) return;
        decide = true;
        chargement.hidden = true;
        changerHumeur("😍");
        oui.classList.add("is-choisi");
        document.body.classList.add("is-oui");
        oui.disabled = true;
        non.disabled = true;
        prevenir("messageOui");
        setTimeout(() => SiteNavigation.partir("oui.html"), reduit ? 100 : 900);
    }

    oui.addEventListener("click", direOui);
    changerAvis.addEventListener("click", direOui);

    /* ---------- mise en scène ---------- */

    await attendre(600);
    // Chaque écran de texte apparaît ligne par ligne, puis s'efface pour le suivant.
    const groupes = [...texte.querySelectorAll("[data-groupe]")];
    for (const [i, groupe] of groupes.entries()) {
        groupe.hidden = false;
        await sequence(groupe.querySelectorAll(".reveal"));
        if (i === groupes.length - 1) break;
        groupe.classList.add("is-sortie");
        await attendre(900);
        groupe.hidden = true;
    }
    montrer(humeur);
    reponses.hidden = false;
    placesDeBase();
    montrer(reponses);
    // Rotation / redimensionnement : les places de base bougent, on recalcule.
    window.addEventListener("resize", () => {
        recadrer(oui, etat.oui);
        recadrer(non, etat.non);
        appliquerTout();
    });
})();
