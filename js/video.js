/* ==========================================================================
   VIDÉO PRINCIPALE — toi_et_moi (video.html)
   - Aucune musique du site : la vidéo garde son propre son.
   - Le fichier est cherché avec chaque extension de CONFIG.videoPrincipale.
   - À la fin : le bouton « Continuer » apparaît en douceur.
   ========================================================================== */

(async () => {
    const { sequence, montrer, attendre } = SiteAnimations;
    const video = document.getElementById("toi-et-moi");
    const ecran = document.getElementById("ecran");
    const intro = document.getElementById("intro");
    const apres = document.getElementById("apres");
    const passer = document.getElementById("passer");
    const sansVideo = document.getElementById("sans-video");
    const boutonPleinEcran = document.getElementById("plein-ecran");

    SiteAudio.arreter();

    /* Essaie chaque extension jusqu'à trouver un fichier lisible. */
    function trouverSource() {
        const { dossier, nom, extensions } = CONFIG.videoPrincipale;
        const candidats = extensions.map((ext) => dossier + nom + "." + ext);
        return new Promise((resoudre) => {
            let i = 0;
            const essayer = () => {
                if (i >= candidats.length) { resoudre(false); return; }
                video.src = candidats[i++];
                video.load();
            };
            video.addEventListener("loadedmetadata", function ok() {
                video.removeEventListener("loadedmetadata", ok);
                video.removeEventListener("error", essayer);
                resoudre(true);
            });
            video.addEventListener("error", essayer);
            essayer();
        });
    }

    function montrerSuite() {
        apres.hidden = false;
        montrer(apres);
        passer.hidden = true;
    }

    /* Plein écran : API standard, ou lecteur natif iOS. */
    const peutPleinEcran = video.requestFullscreen || video.webkitRequestFullscreen || video.webkitEnterFullscreen;
    if (peutPleinEcran) {
        boutonPleinEcran.hidden = false;
        boutonPleinEcran.addEventListener("click", () => {
            try {
                if (video.requestFullscreen) video.requestFullscreen().catch(() => {});
                else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
                else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
            } catch (e) { /* pas de plein écran : tant pis */ }
            if (video.paused) video.play().catch(() => {});
        });
    }

    video.addEventListener("play", () => SiteAudio.arreter());

    video.addEventListener("ended", async () => {
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else if (video.webkitDisplayingFullscreen && video.webkitExitFullscreen) video.webkitExitFullscreen();
        } catch (e) { /* ignore */ }
        await attendre(600);
        document.body.classList.add("is-fin");
        montrerSuite();
        await attendre(400);
        apres.scrollIntoView({ behavior: SiteAnimations.reduit ? "auto" : "smooth", block: "center" });
        const lien = apres.querySelector("a");
        if (lien) lien.focus({ preventScroll: true });
    });

    const trouvee = trouverSource();
    await sequence(intro.querySelectorAll(".reveal"));

    if (await trouvee) {
        ecran.hidden = false;
        montrer(ecran);
        await attendre(300);
        ecran.scrollIntoView({ behavior: SiteAnimations.reduit ? "auto" : "smooth", block: "center" });
        // Un lien discret pour ne jamais rester bloquée (vidéo qui ne se lance pas, etc.)
        await attendre(8000);
        if (apres.hidden) { passer.hidden = false; }
    } else {
        video.removeAttribute("src");
        sansVideo.hidden = false;
        montrer(sansVideo);
        await attendre(1500);
        montrerSuite();
    }
})();
