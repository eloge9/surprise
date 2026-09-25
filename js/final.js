/* ==========================================================================
   FINAL — après le OUI (oui.html)
   Célébration douce, puis les phrases par petits groupes : chaque
   « Continuer » fait place au groupe suivant. Le premier toucher sert
   aussi à lancer la musique si le navigateur l'avait bloquée.
   ========================================================================== */

(async () => {
    const { sequence, attendre, confettis, reduit } = SiteAnimations;
    const groupes = [...document.querySelectorAll("[data-groupe]")];
    const suivant = document.getElementById("suivant");
    let courant = 0;
    let occupe = false;

    async function afficher(i) {
        occupe = true;
        suivant.hidden = true;

        const precedent = groupes[i - 1];
        if (precedent) {
            precedent.classList.add("is-sortie");
            await attendre(800);
            precedent.hidden = true;
        }

        const groupe = groupes[i];
        groupe.hidden = false;
        await sequence(groupe.querySelectorAll(".reveal"));

        occupe = false;
        if (i < groupes.length - 1) {
            await attendre(reduit ? 0 : 600);
            suivant.hidden = false;
            suivant.focus({ preventScroll: true });
        }
    }

    suivant.addEventListener("click", () => {
        if (occupe || courant >= groupes.length - 1) return;
        courant++;
        afficher(courant);
    });

    await attendre(500);
    confettis();
    afficher(0);
})();
