/* Accueil : « Je suis prête » laisse place aux premières phrases. */
(() => {
    const bouton = document.getElementById("ouvrir");
    const seuil = document.getElementById("seuil");
    const recit = document.getElementById("recit");
    if (!bouton || !recit) return;

    bouton.addEventListener("click", async () => {
        // Ce clic compte comme interaction : audio.js en profite pour lancer la musique.
        seuil.classList.add("is-sortie");
        await SiteAnimations.attendre(900);
        seuil.hidden = true;
        recit.hidden = false;
        await SiteAnimations.sequence(recit.querySelectorAll(".reveal"));
        const lien = recit.querySelector("a");
        if (lien) lien.focus({ preventScroll: true });
    });
})();
