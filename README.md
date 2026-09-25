# Notre histoire

Un site romantique et narratif, en HTML, CSS et JavaScript vanilla : pas de framework ni de backend.
Il raconte l'histoire chapitre par chapitre et se termine par une question : **« Veux-tu être ma copine ? ❤️ »**

---

## Installation

Aucune installation n'est nécessaire.

- **Pour tester sur l'ordinateur** : double-clique sur `index.html`. Tout fonctionne, y compris la musique et les vidéos.
- **Pour lui envoyer** : héberge le dossier entier sur un hébergeur statique gratuit, puis envoie-lui le lien. Quelques options :
  - **Netlify Drop** (https://app.netlify.com/drop) : glisse le dossier dans la page ;
  - **GitHub Pages** ;
  - **Vercel**.

  Ces hébergeurs gèrent correctement la lecture des vidéos (avance rapide comprise).
- **Pour tester sur ton téléphone avant de l'envoyer** : dans le dossier, lance `python -m http.server 8000`, puis ouvre `http://IP-de-ton-PC:8000` sur le téléphone, connecté au même Wi-Fi.
  *(Ce petit serveur ne permet pas d'avancer rapidement dans les vidéos. Ce n'est pas le cas chez un vrai hébergeur.)*

> ⚠️ Le dossier pèse environ 85 Mo, surtout à cause des vidéos. Si l'hébergeur refuse, retire quelques clips de `assets/videos/` que tu n'utilises pas (voir la liste dans `js/config.js`).

---

## Parcours

```
index.html        Accueil : « Il y a une histoire que j'aimerais te raconter. »
histoire.html     Ch. I–III : C.V-A.V, « Dadju malhonnête », « Et puis il y a eu toi », les excuses, ta petite sœur
elle.html         Ch. IV : Ce que j'ai trouvé en toi, Cupidon, « Je te connais », la bande-son
camp.html         Ch. V : les camps, « Elle vient ? Non. », Cupidon frappe : « Tu étais là. »
bal.html          Ch. VI : le bal, la cavalière, le 14 septembre, le DJ
declaration.html  Ch. VII–XII : le 20 juillet, le mardi, les conseils, le numéro, la confiance, pourquoi je continue
fragments.html    Ch. XIII : Quelques fragments de nous (galerie)
video.html        La vidéo toi_et_moi (aucune musique par-dessus)
question.html     « Veux-tu être ma copine ? ❤️ » : OUI / NON
oui.html          ELLE A DIT OUI, la blague du 14 septembre, « Chapitre suivant : nous. »
```

J'ai ajouté `camp.html` à la structure prévue. Il sert à suivre l'arc émotionnel demandé, avec la galerie **après** la déclaration et **juste avant** `toi_et_moi`.

---

## Structure

```
css/style.css        palette, typographie, boutons, barre du haut, apparitions
css/animations.css   keyframes (toutes coupées en mode « mouvement réduit »)
css/<page>.css       style propre à chaque page

js/config.js         ⭐ LA configuration : médias, musiques, légendes, petites phrases
js/main.js           initialisation commune (barre, textes de config, images manquantes)
js/navigation.js     transitions entre les pages
js/audio.js          musique : une seule à la fois, reprise après un toucher
js/animations.js     apparitions au scroll, séquences de texte, particules, confettis
js/interactions.js   cartes « Je te connais » et « Elle vient ? »
js/fragments.js      galerie (lazy loading, une seule vidéo à la fois)
js/video.js          vidéo toi_et_moi
js/question.js       boutons OUI / NON
js/final.js          page OUI
js/accueil.js        bouton « Je suis prête »

assets/images/  assets/videos/  assets/audio/  assets/fonts/
```

---

## Médias

Les fichiers d'origine ont été rangés et renommés sans espaces, pour que les liens fonctionnent partout :

| Avant | Maintenant |
|---|---|
| `toi & moi.mp4` | `assets/videos/toi_et_moi.mp4` |
| `galerie/WhatsApp Video …` (15) | `assets/videos/clip-01.mp4` … `clip-15.mp4` (dans l'ordre des noms d'origine) |
| `galerie/WhatsApp Image …` | `assets/images/moi-cvav-2024.jpeg`, `moi-rochers.jpeg`, etc. |
| `son/*.mp3` | `assets/audio/anonyme.mp3`, `reine.mp3`, etc. |

- **Photos** → `assets/images/`
- **Vidéos** → `assets/videos/`
- **Musiques** → `assets/audio/`
- **Polices locales** (facultatif) → `assets/fonts/`. Par défaut, le site utilise Google Fonts (Cormorant Garamond et Manrope). Sans connexion, il se rabat sur Georgia et la police système.

Si un fichier manque, **rien ne s'affiche à la visiteuse** : l'image disparaît, la vidéo est retirée de la galerie, la musique reste silencieuse et le bouton son se cache.

---

## Modifier les textes

- **Les textes du récit** sont directement dans les pages HTML, dans l'ordre de l'histoire. Chaque chapitre est marqué par un commentaire, par exemple `<!-- ============ CHAPITRE VI — LE BAL ============ -->`.
- **Les petits textes et les listes** sont dans `js/config.js` :
  - `prenom` : prénom affiché sur l'accueil (« Pour … »). Vide = « Pour toi. »
  - `connais` : les cartes « Je te connais »
  - `campReponses` : les « Non. » du camp
  - `boutonNon` : les phrases du bouton NON
  - `fragments` : les médias et les légendes de la galerie

### Placeholders à compléter (invisibles tant qu'ils sont vides)

Dans `js/config.js`, section `textes` :

| Clé | Où | Quoi |
|---|---|---|
| `balPhrase` | bal.html | **[INSÉRER ICI LA PHRASE / LE MOT QU'ELLE A DIT]**, que tu refuses d'accepter dans ton récit. Écris la phrase sans guillemets. |
| `jeanne` | declaration.html | une anecdote précise sur Jeanne (facultatif) |
| `numero` | declaration.html | une précision sur l'histoire du numéro (facultatif) |

Tant qu'une clé est vide (`""`), le paragraphe correspondant n'apparaît pas du tout.

---

## Modifier les couleurs

Tout est dans `css/style.css`, en haut du fichier (`:root`) :

```css
--nuit: #0F0F18;       /* fond */
--rose: #FF4F81;       /* boutons principaux */
--rose-doux: #FFB6C9;
--or: #F5D58A;         /* libellés de chapitre, Cupidon */
--bleu: #1E3A5F;       /* sa couleur préférée : lueurs, calendrier, cartes */
--bleu-clair: #9CC3EE; /* bleu lisible pour du texte */
```

---

## Ajouter une vidéo (ou une photo) à la galerie

1. Copie le fichier dans `assets/videos/` (ou `assets/images/`). Évite les espaces dans le nom.
2. Dans `js/config.js`, ajoute une ligne dans `fragments`, à l'endroit voulu :

```js
{ type: "video", src: "assets/videos/mon-clip.mp4", qui: "elle", caption: "Toi." },
{ type: "image", src: "assets/images/ma-photo.jpg", qui: "moi", caption: "", alt: "Description de la photo" },
```

- `qui` : `"elle"`, `"moi"` ou `"nous"`. Ce champ change seulement le style (halo bleu pour elle, cadre plus discret pour toi). Il n'est jamais affiché.
- `caption` : la phrase sous le média. `""` = aucune phrase.

> ⚠️ **À vérifier** : j'ai classé les clips en regardant une image de chacun. Ceux marqués `"elle"` montrent une fille : vérifie que c'est bien elle. `clip-05` (montage « trend »), `clip-14` (une fille qui danse, un garçon derrière) et `clip-09` (non utilisé) sont les plus incertains. Les clips où tu apparais sont listés en commentaire à la fin de `fragments`.

---

## Ajouter ou changer une musique

1. Copie le `.mp3` dans `assets/audio/`.
2. Dans `js/config.js`, section `musiques`, ajoute ou modifie une entrée :

```js
maCle: { src: "assets/audio/mon-fichier.mp3", titre: "Artiste — Titre" },
```

3. Choisis où elle joue :
   - pour toute une page : `<body data-music="maCle">` ;
   - pour une seule section : `<section data-music="maCle">`. Elle remplace la musique de la page tant que la section est au milieu de l'écran.
   - pour le silence : `data-music=""`.

Musiques en place (tes fichiers) :

| Moment | Clé | Fichier |
|---|---|---|
| Accueil, histoire | `anonyme` | Dadju — Anonyme |
| Interlude « Dadju malhonnête » | `malhonnete` | Dadju — Le mâle honnête |
| Ce que j'ai trouvé en toi, « Je suis amoureux de toi » | `reine` | Dadju — Reine |
| Camps, galerie | `soleil` | Dadju & Anitta — Mon Soleil |
| Bal | `bal` | Fanny J — Ancrée à ton port |
| Complications (20 juillet → numéro → confiance) | `complique` | Dadju — Compliqué |
| Vidéo, question | *(silence)* | la vidéo garde son propre son |
| Après le OUI | `oui` | Dadju & Tayc — Épouse-moi |

> Remarque : le fichier fourni pour le bal est **« Ancrée à ton port » de Fanny J**, et celui d'après le OUI est **« Épouse-moi » de Dadju & Tayc**. Le petit bandeau « ♪ … » affiche ces titres. Change `titre` si tu préfères un autre libellé. (Clin d'œil : Tayc est un de ses artistes préférés, d'où l'allusion dans elle.html.)

Une seule musique joue à la fois : le site n'utilise qu'un seul lecteur audio. Quand on change de page, elle reprend là où elle s'était arrêtée.

---

## Vidéo principale : toi_et_moi

- Place-la ici : `assets/videos/toi_et_moi.mp4` (déjà fait).
- Pour changer de nom ou d'extension, modifie `videoPrincipale` dans `js/config.js`. Le site essaie les extensions de la liste dans l'ordre (`mp4`, `webm`, `mov`, `m4v`).
- Sur cette page, **aucune musique** : toute musique du site est coupée.
- Elle dispose des contrôles natifs et d'un bouton « Plein écran » (lecteur natif sur iPhone).
- À la fin de la vidéo, « Continuer » apparaît en douceur. Au bout de 8 secondes, un lien discret « Continuer sans attendre la fin » s'affiche aussi, pour qu'elle ne reste jamais bloquée.
- Si la vidéo est introuvable, une phrase s'affiche (« Certaines choses se disent mieux en vrai. »), puis le bouton pour continuer.

---

## Compatibilité mobile et autoplay

- **Musique** : les téléphones (et souvent les ordinateurs) interdisent de lancer du son sans geste de l'utilisateur. Le site essaie quand même. S'il est bloqué, le bouton son en haut à droite brille doucement, et la musique démarre **au premier toucher, n'importe où**. Sur l'accueil, le bouton « Je suis prête » sert de premier toucher.
- **Galerie** : les vidéos démarrent automatiquement **en muet** quand elles sont bien visibles, c'est la seule lecture automatique autorisée sur mobile. Une seule vidéo joue à la fois, les autres se mettent en pause. « 🔊 Activer le son » coupe la musique du site pendant l'écoute. Les vidéos ne se chargent qu'à l'approche de l'écran.
- **Mouvement réduit** (réglage d'accessibilité du téléphone) : les animations sont coupées, les confettis désactivés et les vidéos de la galerie ne démarrent plus seules (on touche ▶). La navigation reste identique.
- **Bouton NON** : il ne fuit jamais au survol. À chaque toucher, il change de phrase, se déplace un peu et rapetisse légèrement (jamais sous 85 %). Après « Bon… je respecte ton choix. ❤️ », il revient à sa place et **fonctionne vraiment** : un message respectueux s'affiche. Il reste accessible au clavier (Tab) et aux lecteurs d'écran.
- Testé sans débordement horizontal à 320, 360, 375, 390, 414, 768 et 1280 px.
