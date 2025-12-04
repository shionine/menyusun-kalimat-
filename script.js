const questions = [
  "黑 猩 猩 具 有 人 类 的 某 些 特 点",
  "黑 猩 猩 能 毫 无 困 难 地 使 用 工 具",
  "科 学 家 们 专 门 设 计 了 一 个 有 趣 的 实 验",
  "陈 嘉 庚 先 生 是 中 国 近 代 史 上 的 一 位 伟 人",
  "聪 明 的 黑 猩 猩 是 世 界 上 的 珍 稀 动 物 之 一",
  "为 振 兴 侨 居 地 的 教 育 做 出 了 积 极 的 贡 献"
];

let currentIndex = 0;
let shuffleHistory = [];
let score = 0;

function shuffle(array) {
  let shuffled = [...array];
  do {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (shuffleHistory.includes(shuffled.join("|")));

  shuffleHistory.push(shuffled.join("|"));
  return shuffled;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const node = document.getElementById(data);
  ev.target.appendChild(node);
}

function renderQuestion() {
  shuffleHistory = [];
  document.getElementById("result").textContent = "";
  const words = questions[currentIndex].trim().split(" ");
  const scrambled = shuffle(words);

  const scrambledContainer = document.getElementById("scrambled-words");
  const dropZone = document.getElementById("drop-zone");

  scrambledContainer.innerHTML = "";
  dropZone.innerHTML = "";

  scrambled.forEach((word, index) => {
    const span = document.createElement("span");
    span.textContent = word;
    span.className = "word";
    span.id = `word-${index}`;
    span.draggable = true;
    span.ondragstart = drag;
    scrambledContainer.appendChild(span);
  });

  updateScore();
}

function shuffleCurrent() {
  const words = questions[currentIndex].trim().split(" ");
  const scrambled = shuffle(words);
  const scrambledContainer = document.getElementById("scrambled-words");
  scrambledContainer.innerHTML = "";

  scrambled.forEach((word, index) => {
    const span = document.createElement("span");
    span.textContent = word;
    span.className = "word";
    span.id = `word-${index}`;
    span.draggable = true;
    span.ondragstart = drag;
    scrambledContainer.appendChild(span);
  });

  document.getElementById("drop-zone").innerHTML = "";
  document.getElementById("result").textContent = "";
}

function checkAnswer() {
  const userWords = Array.from(document.getElementById("drop-zone").children).map(e => e.textContent);
  const correctWords = questions[currentIndex].trim().split(" ");
  const result = document.getElementById("result");

  if (userWords.length !== correctWords.length) {
    result.textContent = "❗ Susunan belum lengkap.";
    result.style.color = "orange";
    return;
  }

  const isCorrect = userWords.every((word, idx) => word === correctWords[idx]);

  if (isCorrect) {
    result.textContent = "✅ Benar!";
    result.style.color = "green";
    score++;
    updateScore();
  } else {
    result.textContent = "❌ Salah. Coba lagi!";
    result.style.color = "red";
    setTimeout(shuffleCurrent, 1000);
  }
}

function updateScore() {
  document.getElementById("score-value").textContent = score;
}

function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}

window.onload = renderQuestion;
