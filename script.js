const questions = [
  "毛 利 人 创 造 了 多 么 光 辉 灿 烂 的 文 化",
  "你 到 清 真 寺 或 其 他 名 胜 古 迹 去 游 玩",
  "你 可 以 看 见 几 只 孔 雀 在 花 丛 里 跳 舞",
  "胆 大 的 竟 敢 一 只 手 抓 着 你 的 胳 膊"
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
