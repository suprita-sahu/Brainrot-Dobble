// Brainrot Dobble — plain JavaScript, no libraries required.
"use strict";

const memes = [
  ["🦈", "Tralalero"], ["🪵", "Tung Tung"], ["🐊", "Bombardiro"],
  ["☕", "Cappuccina"], ["🌳", "Patapim"], ["🐒", "Chimpanzini"],
  ["🐘", "Lirili Larila"], ["🐱", "Ballerino"], ["🦶", "Boneca"],
  ["🐊", "Crocodilo"], ["🍌", "Banana Cat"], ["🐸", "Sigma Frog"],
  ["🗿", "Mewing"], ["💀", "Skibidi"], ["🧢", "Fanum Tax"],
  ["🍕", "Pizza Tower"], ["🧌", "Goblin Mode"], ["🐔", "Chicken Jockey"],
  ["🧀", "Cheese Touch"], ["🐺", "Alpha Wolf"], ["🧠", "Brainrot"],
  ["🧍", "NPC"], ["🐟", "Tung Fish"], ["🍉", "Watermelon"],
  ["🐍", "Sahur Snake"], ["🛸", "Alienini"], ["🍄", "Mushroom"],
  ["🐧", "Penguinz"], ["🚽", "Skibidi Toilet"], ["🦆", "Duckini"],
  ["🐼", "Panda"], ["👹", "Cappuccino"], ["🍟", "French Fry"],
  ["🦖", "Dino"], ["🕺", "Aura +1000"], ["🥶", "Ice Cold"]
];

const $ = (id) => document.getElementById(id);
const positions = [[50, 20], [77, 39], [72, 72], [29, 76], [23, 39]];
let score = 0;
let streak = 0;
let round = 1;
let timeLeft = 45;
let active = false;
let timerId = null;
let matchingMeme = null;
let hintUsed = false;
let usedMemeIndexes = new Set();

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function chooseRound() {
  let available = shuffle(memes.filter((meme, index) => !usedMemeIndexes.has(index)));
  if (available.length < 9) {
    usedMemeIndexes.clear();
    available = shuffle(memes);
  }

  matchingMeme = available[0];
  usedMemeIndexes.add(memes.indexOf(matchingMeme));

  // Each card has five symbols; exactly one symbol is shared.
  const leftCard = shuffle([matchingMeme, ...available.slice(1, 5)]);
  const rightCard = shuffle([matchingMeme, ...available.slice(5, 9)]);
  renderCard("card-a", leftCard);
  renderCard("card-b", rightCard);
  $("hint-text").textContent = "";
  hintUsed = false;
}

function renderCard(elementId, cardMemes) {
  const card = $(elementId);
  card.replaceChildren();

  cardMemes.forEach((meme, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "meme";
    button.style.left = positions[index][0] + "%";
    button.style.top = positions[index][1] + "%";
    button.setAttribute("aria-label", meme[1]);
    button.innerHTML = `<span class="emoji" aria-hidden="true">${meme[0]}</span><span class="meme-name">${meme[1]}</span>`;
    button.addEventListener("click", () => handleGuess(meme, button));
    card.appendChild(button);
  });
}

function handleGuess(meme, button) {
  if (!active) return;

  if (meme === matchingMeme) {
    const points = hintUsed ? 5 : 10;
    score += points;
    streak += 1;
    active = false;
    clearInterval(timerId);

    $("score").textContent = score;
    $("streak").textContent = streak;
    $("feedback").textContent = [
      `🗿 ABSOLUTE CINEMA! +${points}`,
      `🔥 YOU HAVE TOO MUCH AURA! +${points}`,
      `💀 BRAINROT CERTIFIED! +${points}`,
      `🧠 ONE BRAIN CELL, PERFECTLY USED! +${points}`
    ][Math.floor(Math.random() * 4)];

    document.querySelectorAll(".meme").forEach((item) => {
      if (item.getAttribute("aria-label") === matchingMeme[1]) {
        item.classList.add("correct");
      }
    });

    $("start-btn").textContent = "NEXT ROUND ➜";
    window.setTimeout(() => {
      if (timeLeft <= 0) return;
      round += 1;
      $("round").textContent = round;
      chooseRound();
      active = true;
      $("start-btn").textContent = "GAME ON ✓";
      $("feedback").textContent = "👀 Find the next matching meme!";
      timerId = window.setInterval(tick, 1000);
    }, 700);
  } else {
    streak = 0;
    $("streak").textContent = streak;
    $("feedback").textContent = "❌ NOT THAT ONE. LOOK AGAIN, BESTIE.";
    button.classList.add("wrong");
    window.setTimeout(() => button.classList.remove("wrong"), 300);
  }
}

function tick() {
  if (!active) return;
  timeLeft -= 1;
  $("time").textContent = timeLeft;
  $("time-bar").style.width = `${(timeLeft / 45) * 100}%`;
  if (timeLeft <= 10) $("time-bar").style.background = "#ff5353";

  if (timeLeft <= 0) {
    active = false;
    clearInterval(timerId);
    $("feedback").textContent =
      `⏰ GAME OVER! FINAL SCORE: ${score} — ` +
      (score >= 100 ? "BRAINROT LEGEND 👑" :
       score >= 50 ? "CERTIFIED MEMER 🔥" : "GO TOUCH GRASS 🌱");
    $("start-btn").textContent = "PLAY AGAIN 🚀";
    $("hint-btn").disabled = true;
  }
}

function startGame() {
  clearInterval(timerId);
  score = 0;
  streak = 0;
  round = 1;
  timeLeft = 45;
  active = true;
  usedMemeIndexes.clear();

  $("score").textContent = "0";
  $("streak").textContent = "0";
  $("round").textContent = "1";
  $("time").textContent = "45";
  $("time-bar").style.width = "100%";
  $("time-bar").style.background = "#fa5796";
  $("start-btn").textContent = "GAME ON ✓";
  $("hint-btn").disabled = false;
  $("feedback").textContent = "🔥 GO GO GO! FIND THE MATCH!";
  chooseRound();
  timerId = window.setInterval(tick, 1000);
}

$("start-btn").addEventListener("click", () => {
  if (!active) startGame();
});
$("restart-btn").addEventListener("click", startGame);
$("hint-btn").addEventListener("click", () => {
  if (!active || !matchingMeme) return;
  $("hint-text").textContent = `💡 HINT: LOOK FOR ${matchingMeme[0]} ${matchingMeme[1].toUpperCase()}`;
  hintUsed = true;
});

// Display a preview board before the first game begins.
chooseRound();
