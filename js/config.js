/* ==========================================================================
   CONFIGURATION DU SITE
   --------------------------------------------------------------------------
   C'est LE fichier à modifier en priorité : médias, musiques, légendes,
   petites phrases, placeholders.

   Les longs textes du récit, eux, sont directement dans les pages HTML
   (histoire.html, elle.html, camp.html, …) pour pouvoir les lire et les
   modifier dans l'ordre de l'histoire.

   RÈGLE : un texte laissé vide ("") n'est JAMAIS affiché à la visiteuse.
   Le paragraphe qui l'entoure disparaît simplement.
   ========================================================================== */

const CONFIG = {

    /* Prénom affiché sur l'accueil (« Pour … »).
       [À COMPLÉTER] — laissé vide, l'accueil dit simplement « Pour toi. » */
    prenom: "",

    /* ----------------------------------------------------------------------
       RECEVOIR SA RÉPONSE — WhatsApp
       Ton numéro au format international, SANS « + » ni espaces.
       Ex. pour +228 90 12 34 56 → "22890123456"
       [À COMPLÉTER] — laissé vide, les boutons « Envoyer ma réponse »
       n'apparaissent pas.
       ---------------------------------------------------------------------- */
    whatsapp: {
        numero: "22891271004",
        messageOui: "OUI ❤️ J'ai vu ton site… et ma réponse est oui.",
        messageNon: "J'ai vu ton site. Merci pour tout ce que tu as écrit ❤️ Ma réponse, c'est non."
    },

    /* ----------------------------------------------------------------------
       RECEVOIR SA RÉPONSE — notification automatique (service ntfy.sh)
       Dès qu'elle clique OUI (ou confirme NON), tu reçois un e-mail.
       En plus (facultatif) : installe l'appli « ntfy » et abonne-toi au
       même `sujet` pour recevoir aussi une notification sur ton téléphone.
       `sujet` vide = rien n'est envoyé.
       ---------------------------------------------------------------------- */
    notification: {
        sujet: "surprise-eloge-338642178c",
        email: "gominaeloge@gmail.com",
        messageOui: "❤️ ELLE A DIT OUI ❤️",
        messageNon: "Elle a répondu non (après 15 essais 😅)."
    },

    /* Ordre du parcours : sert à la barre de progression et au bouton retour. */
    parcours: [
        "index.html",
        "histoire.html",
        "elle.html",
        "camp.html",
        "bal.html",
        "declaration.html",
        "fragments.html",
        "video.html",
        "question.html",
        "oui.html"
    ],

    /* ----------------------------------------------------------------------
       VIDÉO PRINCIPALE — toi_et_moi
       Le site essaie chaque extension dans l'ordre jusqu'à trouver le fichier.
       Pour changer de fichier : modifie `nom` ou ajoute une extension.
       ---------------------------------------------------------------------- */
    videoPrincipale: {
        dossier: "assets/videos/",
        nom: "toi_et_moi",
        extensions: ["mp4", "webm", "mov", "m4v"]
    },

    /* ----------------------------------------------------------------------
       MUSIQUES
       Chaque page (ou section) choisit une musique avec l'attribut
       data-music="cle". Si un fichier manque, le site continue en silence.
       ---------------------------------------------------------------------- */
    volume: 0.6,
    musiques: {
        anonyme:    { src: "assets/audio/anonyme.mp3",       titre: "Dadju — Anonyme" },
        malhonnete: { src: "assets/audio/malhonnete.mp3",    titre: "Dadju — Le mâle honnête" },
        reine:      { src: "assets/audio/reine.mp3",         titre: "Dadju — Reine" },
        soleil:     { src: "assets/audio/mon-soleil.mp3",    titre: "Dadju & Anitta — Mon Soleil" },
        bal:        { src: "assets/audio/dans-ton-port.mp3", titre: "Fanny J — Ancrée à ton port" },
        complique:  { src: "assets/audio/complique.mp3",     titre: "Dadju — Compliqué" },
        oui:        { src: "assets/audio/epouse-moi.mp3",    titre: "Dadju & Tayc — Épouse-moi" }
    },

    /* ----------------------------------------------------------------------
       PETITS TEXTES À COMPLÉTER (vides = invisibles pour elle)
       ---------------------------------------------------------------------- */
    textes: {
        /* bal.html — [INSÉRER ICI LA PHRASE / LE MOT QU'ELLE A DIT]
           Écris uniquement la phrase, sans guillemets. Ex : balPhrase: "…" */
        balPhrase: "",

        /* declaration.html — [À COMPLÉTER] une anecdote précise avec Jeanne. */
        jeanne: "",

        /* declaration.html — [À COMPLÉTER] précision facultative sur l'histoire
           du numéro qui n'était pas enregistré comme prévu. */
        numero: ""
    },

    /* ----------------------------------------------------------------------
       « JE TE CONNAIS » (elle.html) — cartes à révéler une par une.
       ---------------------------------------------------------------------- */
    connais: [
        { intro: "Je pourrais te dire que je connais ta couleur préférée…",
          reponse: "Bleu 💙",
          note: "Tu l'as peut-être remarqué : il se cache un peu partout ici." },
        { intro: "Je pourrais aussi deviner ce qui pourrait te faire plaisir dans une assiette…",
          reponse: "Spaghetti + koliko + œuf + viande 🍝" },
        { intro: "Et pour accompagner tout ça…",
          reponse: "Un whisky crème 🥃" },
        { intro: "Côté fruit, je ne prends aucun risque…",
          reponse: "La banane 🍌" },
        { intro: "Je sais ce qui te fait bouger…",
          reponse: "Tyla & Tayc 🎵" },
        { intro: "Je sais ce qui compte pour toi, au-delà de tout ça…",
          reponse: "Ta foi ✝️" },
        { intro: "Et je sais même où tes rêves aimeraient t'emmener…",
          reponse: "L'Espagne 🇪🇸" }
    ],

    /* camp.html — les réponses à « Elle vient ? » (une par toucher). */
    campReponses: ["Non.", "Non.", "Toujours non.", "Non. — même la veille."],

    /* question.html — le bouton NON. Une phrase par tentative, puis `final`.
       Après `final`, le bouton NON fonctionne normalement. */
    boutonNon: {
        phrases: [
            "Tu es sûre ? 👀",
            "Réfléchis encore 😂",
            "Vraiment ?",
            "Même après tout ça ? 😭",
            "Je commence à être inquiet là…",
            "Tu as appuyé à côté, non ? 🤔",
            "Regarde le bouton rose, il est plus joli 😌",
            "Mon cœur fait des bruits bizarres là 💔",
            "Encore une fois et je pleure 😢",
            "Bon, là je pleure 😭",
            "Tu es vraiment têtue hein 😂",
            "Je vais le dire à ta maman 😤",
            "Dernière chance 😭"
        ],
        final: "Bon… je respecte ton choix. ❤️"
    },

    /* ----------------------------------------------------------------------
       GALERIE — « Quelques fragments de nous » (fragments.html)
       type    : "video" ou "image"
       qui     : "elle" | "moi" | "nous" | "" (sert au style, jamais affiché)
       caption : la petite phrase sous le média ("" = pas de phrase)
       alt     : description pour l'accessibilité (images)

       Ordre : elle → moi → elle → … (elle majoritaire), comme demandé.

       ⚠️ À VÉRIFIER : le classement elle / moi a été fait en regardant une
       image de chaque vidéo. Les vidéos marquées « elle » montrent une fille
       — je suppose que c'est elle, mais vérifie chacune. Corrige `qui` et
       `caption`, ou supprime la ligne si ce n'est pas la bonne personne.
       ---------------------------------------------------------------------- */
    fragments: [
        /* clip-06 : lunettes, cheveux roux — même look que dans toi_et_moi */
        { type: "video", src: "assets/videos/clip-06.mp4", qui: "elle", caption: "Toi." },
        { type: "video", src: "assets/videos/clip-01.mp4", qui: "elle", caption: "Un petit bout de toi." },
        { type: "image", src: "assets/images/moi-cvav-2024.jpeg", qui: "moi", caption: "Et moi, quelque part dans l'histoire.",
          alt: "Moi au concours Talents d'Enfants du C.V-A.V, 2024" },
        { type: "video", src: "assets/videos/clip-04.mp4", qui: "elle", caption: "Je ne savais pas encore où tout cela allait nous mener." },
        { type: "video", src: "assets/videos/clip-07.mp4", qui: "elle", caption: "Et pourtant…" },
        { type: "video", src: "assets/videos/clip-11.mp4", qui: "moi", caption: "" },
        { type: "image", src: "assets/images/moi-rochers.jpeg", qui: "moi", caption: "Quelques souvenirs.",
          alt: "Moi assis sur des rochers" },
        /* clip-14 : une fille qui danse, un garçon derrière — « nous » ? À VÉRIFIER */
        { type: "video", src: "assets/videos/clip-14.mp4", qui: "", caption: "" },
        { type: "video", src: "assets/videos/clip-13.mp4", qui: "moi", caption: "" },
        { type: "video", src: "assets/videos/clip-10.mp4", qui: "moi", caption: "" },
        { type: "video", src: "assets/videos/clip-02.mp4", qui: "elle", caption: "Quelques fragments de toi, avec tes amis." }

        /* Médias disponibles mais non utilisés (ajoute-les si tu veux) :
           Vidéos de toi : clip-03 (à table, tenue blanche), clip-08 (selfie),
                           clip-12 (allongé), clip-15 (bureau)
           Vidéo À VÉRIFIER : clip-09 (une fille qui danse, lumière violette)
           Photos : moi-nuit-camp.jpeg, moi-table.jpeg, moi-rochers-violet.jpeg,
                    selfie-bleu.jpeg (probablement toi), selfie-nuit.jpeg (inconnu),
                    eglise-groupe.jpeg (groupe dans une église),
                    moi-table-doublon.jpeg (doublon exact de moi-table.jpeg)
           Pour un média commun, utilise qui: "nous". */
    ]
};
