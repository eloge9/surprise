const openBtn = document.getElementById("openBtn");
const introScreen = document.getElementById("introScreen");
const mainContent = document.getElementById("mainContent");

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

const typedText = document.getElementById("typedText");

/* =========================
OPEN EXPERIENCE
========================= */

openBtn.addEventListener("click", () => {
  introScreen.style.opacity = "0";
  introScreen.style.transition = "2s";

  setTimeout(() => {
    introScreen.style.display = "none";
    mainContent.classList.remove("hidden");
  }, 2000);

  createConfetti();
  typeWriter();
});

/* =========================
TYPEWRITER
========================= */

const message = `
Vanessa,

En cette nuit si spéciale, je voulais simplement être la première personne à illuminer ton téléphone avec un sourire.

Aujourd’hui n’est pas juste une date…
c’est le jour où une personne magnifique est née.

Tu es une présence rare.
Une personne qui possède quelque chose de doux, d’élégant et de sincère.

Je voulais prendre un moment pour te rappeler à quel point tu es précieuse.

J’espère que cette nouvelle année de ta vie sera remplie de bonheur,
de paix,
de réussite,
et surtout de moments qui feront battre ton cœur de joie.

Merci d’être cette personne exceptionnelle.
Merci pour ton sourire.
Merci pour ton énergie.
Merci d’exister.

Et même si les mots ne seront jamais assez forts pour tout exprimer…
j’espère qu’au moins ce petit univers créé pour toi te fera ressentir à quel point tu comptes.

Joyeux anniversaire Vanessa ❤️
`;

let index = 0;

function typeWriter() {
  if (index < message.length) {
    typedText.innerHTML += message.charAt(index);
    index++;

    setTimeout(typeWriter, 35);
  }
}

/* =========================
MUSIC
========================= */

let playing = false;

musicBtn.addEventListener("click", () => {
  if (!playing) {
    music.play();
    musicBtn.innerHTML = "❚❚";
    playing = true;
  } else {
    music.pause();
    musicBtn.innerHTML = "▶";
    playing = false;
  }
});

/* =========================
FLOATING HEARTS
========================= */

function createHeart(x, y) {
  const heart = document.createElement("div");

  heart.classList.add("heart");

  heart.innerHTML = "❤";

  heart.style.left = x + "px";
  heart.style.top = y + "px";

  heart.style.fontSize = Math.random() * 20 + 10 + "px";

  heart.style.animationDuration = Math.random() * 3 + 2 + "s";

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 5000);
}

/* Mouse effect */

document.addEventListener("mousemove", (e) => {
  if (Math.random() > 0.8) {
    createHeart(e.clientX, e.clientY);
  }
});

/* Click effect */

document.addEventListener("click", (e) => {
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      createHeart(
        e.clientX + (Math.random() * 100 - 50),
        e.clientY + (Math.random() * 100 - 50),
      );
    }, i * 100);
  }
});

/* =========================
AUTO HEART RAIN
========================= */

setInterval(() => {
  createHeart(Math.random() * window.innerWidth, window.innerHeight);
}, 400);

/* =========================
CONFETTI
========================= */

function createConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];

  for (let i = 0; i < 200; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 5,
      speed: Math.random() * 3 + 2,
    });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach((p) => {
      ctx.fillStyle = `hsl(${Math.random() * 360},100%,70%)`;

      ctx.fillRect(p.x, p.y, p.size, p.size);

      p.y += p.speed;

      if (p.y > canvas.height) {
        p.y = -20;
      }
    });

    requestAnimationFrame(update);
  }

  update();
}
