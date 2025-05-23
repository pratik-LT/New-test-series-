const questions = [
  {
    question: ["What does HTML stand for?", "HTML का क्या अर्थ है?"],
    options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
    answer: 0
  },
  {
    question: ["Which language is used for styling web pages?", "वेब पेजों को स्टाइल करने के लिए किस भाषा का उपयोग किया जाता है?"],
    options: ["HTML", "JQuery", "CSS"],
    answer: 2
  },
  {
    question: ["Which is not a JavaScript Framework?", "कौन सा जावास्क्रिप्ट फ्रेमवर्क नहीं है?"],
    options: ["Python Script", "JQuery", "NodeJS"],
    answer: 0
  }
];

let totalTime = 120;
let currentQuestion = 0;
let score = 0;
let timerInterval;
const userAnswers = Array(questions.length).fill(null);

const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("last-name");
const mobileInput = document.getElementById("mobile");
const dateInput = document.getElementById("date");

function startTimer() {
  timerInterval = setInterval(() => {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    document.getElementById("time").textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    totalTime--;
    if (totalTime < 0) {
      clearInterval(timerInterval);
      finishTest();
    }
  }, 1000);
}

function showQuestion(index) {
  const q = questions[index];
  document.getElementById("question").innerHTML = `
    <div>${q.question[0]}</div>
    <small style="color: gray;">${q.question[1]}</small>
  `;
  const optionsEl = document.getElementById("options");
  optionsEl.innerHTML = "";
  q.options.forEach((opt, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<label><input type="radio" name="option" value="${i}" ${userAnswers[index] === i ? 'checked' : ''}> ${opt}</label>`;
    optionsEl.appendChild(li);
  });
  document.getElementById("prev-btn").disabled = index === 0;
}

function sendResultToServer(name, lastName, mobile, date, score) {
  fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, lastName, mobile, date, score })
  });
}

function finishTest() {
  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("timer").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");

  score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].answer) score++;
  }

  document.getElementById("score").textContent = `Time's up! You scored ${score} out of ${questions.length}`;
  sendResultToServer(nameInput.value, lastNameInput.value, mobileInput.value, dateInput.value, score);
}

function showFinalResult() {
  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("timer").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");

  score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].answer) score++;
  }

  document.getElementById("score").textContent = `You scored ${score} out of ${questions.length}`;
  sendResultToServer(nameInput.value, lastNameInput.value, mobileInput.value, dateInput.value, score);
}

document.getElementById("next-btn").addEventListener("click", () => {
  const selected = document.querySelector('input[name="option"]:checked');
  if (selected) userAnswers[currentQuestion] = parseInt(selected.value);
  currentQuestion++;
  if (currentQuestion < questions.length) showQuestion(currentQuestion);
  else {
    clearInterval(timerInterval);
    showFinalResult();
  }
});

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion(currentQuestion);
  }
});

document.getElementById("user-form").addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("user-form").classList.add("hidden");
  document.getElementById("start-btn").classList.remove("hidden");
});

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("start-btn").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  document.getElementById("timer").classList.remove("hidden");
  showQuestion(currentQuestion);
  startTimer();
});
