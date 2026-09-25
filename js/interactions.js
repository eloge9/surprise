/* ==========================================================================
   INTERACTIONS — petits moments à toucher dans le récit.
   - « Je te connais » (elle.html)  : cartes révélées une par une
   - « Elle vient ? » (camp.html)   : les « Non. » successifs
   ========================================================================== */

(() => {
    const { montrer, attendre, sequence, reduit } = SiteAnimations;

    const defiler = (el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom > innerHeight - 40) el.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "center" });
    };

    /* ---------- Je te connais ---------- */
    function initConnais() {
        const zone = document.getElementById("connais");
        const fin = document.getElementById("connais-fin");
        if (!zone || !CONFIG.connais) return;

        const cartes = CONFIG.connais.map((item, i) => {
            const carte = document.createElement("article");
            carte.className = "devine reveal";
            carte.dataset.manuel = "";
            if (i > 0) carte.hidden = true;

            const bouton = document.createElement("button");
            bouton.type = "button";
            bouton.className = "devine__bouton";
            bouton.setAttribute("aria-expanded", "false");
            bouton.id = "devine-" + i;
            bouton.innerHTML = '<span class="devine__intro"></span><span class="devine__indice">Toucher pour révéler</span>';
            bouton.querySelector(".devine__intro").textContent = item.intro;

            const reponse = document.createElement("div");
            reponse.className = "devine__reponse";
            reponse.setAttribute("role", "region");
            reponse.setAttribute("aria-labelledby", bouton.id);
            reponse.innerHTML = '<div><p class="devine__valeur"></p></div>';
            reponse.querySelector(".devine__valeur").textContent = item.reponse;
            if (item.note) {
                const note = document.createElement("p");
                note.className = "devine__note";
                note.textContent = item.note;
                reponse.firstElementChild.appendChild(note);
            }

            carte.append(bouton, reponse);
            zone.appendChild(carte);
            return carte;
        });

        // La première carte apparaît au scroll comme le reste.
        if (cartes[0] && "IntersectionObserver" in window) {
            const obs = new IntersectionObserver((e) => {
                if (e[0].isIntersecting) { montrer(cartes[0]); obs.disconnect(); }
            }, { threshold: 0.2 });
            obs.observe(cartes[0]);
        } else if (cartes[0]) {
            montrer(cartes[0]);
        }

        cartes.forEach((carte, i) => {
            const bouton = carte.querySelector("button");
            bouton.addEventListener("click", async () => {
                if (carte.classList.contains("is-revelee")) return;
                carte.classList.add("is-revelee");
                bouton.setAttribute("aria-expanded", "true");
                await attendre(900);

                const suivante = cartes[i + 1];
                if (suivante) {
                    montrer(suivante);
                    await attendre(150);
                    defiler(suivante);
                } else if (fin) {
                    fin.hidden = false;
                    await attendre(600);
                    defiler(fin);
                    sequence(fin.querySelectorAll(".reveal"));
                }
            });
        });
    }

    /* ---------- Elle vient ? ---------- */
    function initCamp() {
        const bouton = document.getElementById("demander");
        const liste = document.getElementById("reponses-camp");
        if (!bouton || !liste) return;

        const reponses = CONFIG.campReponses || ["Non."];
        let n = 0;

        bouton.addEventListener("click", async () => {
            if (n >= reponses.length) return;
            const li = document.createElement("li");
            li.className = "reveal";
            li.textContent = reponses[n];
            liste.appendChild(li);
            montrer(li);
            n++;

            if (n >= reponses.length) {
                bouton.disabled = true;
                await attendre(1000);
                bouton.closest(".demande").classList.add("is-terminee");
                const apres = document.querySelectorAll("[data-apres-camp]");
                apres.forEach((el) => { el.hidden = false; });
                await attendre(300);
                const premier = apres[0];
                if (premier) {
                    premier.querySelectorAll(".reveal").forEach(montrer);
                    defiler(premier);
                }
            }
        });
    }

    initConnais();
    initCamp();
})();
