const questions = [
  {
    question: [
      "What does HTML stand for?", "HTML का क्या अर्थ है?"
    ],
    options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
    answer: 0
  },
  {
    question: [
      "Which language is used for styling web pages?",
      "वेब पेजों को स्टाइल करने के लिए किस भाषा का उपयोग किया जाता है?"
    ],
    options: ["HTML", "JQuery", "CSS"],
    answer: 2
  },
  {
    question: [
      "Which is not a JavaScript Framework?", "कौन सा जावास्क्रिप्ट फ्रेमवर्क नहीं है?"
    ],
    options: ["Python Script", "JQuery", "NodeJS"],
    answer: 0
  }
];

let totalTime = 120;
let currentQuestion = 0;
let score = 0;
let timerInterval;

const userAnswers = Array(questions.length).fill(null);

const startBtn = document.getElementById("start-btn");
const timeEl = document.getElementById("time");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const resultEl = document.getElementById("result");
const quizContainer = document.getElementById("quiz-container");
const timer = document.getElementById("timer");
const userForm = document.getElementById("user-form");

const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("last-name");
const mobileInput = document.getElementById("mobile");
const dateInput = document.getElementById("date");

function startTimer() {
  timerInterval = setInterval(() => {
    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;
    timeEl.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    totalTime--;

    if (totalTime < 0) {
      clearInterval(timerInterval);
      finishTest();
    }
  }, 1000);
}

function showQuestion(index) {
  const q = questions[index];
  questionEl.innerHTML = `
    <ul style="list-style: none; padding-left: 0;">
      <li style="margin-bottom: 5px;">${q.question[0]}</li>
      <li style="color: gray;">${q.question[1]}</li>
    </ul>
  `;
  optionsEl.innerHTML = "";

  q.options.forEach((option, i) => {
    const li = document.createElement("li");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "option";
    input.value = i;

    if (userAnswers[index] === i) {
      input.checked = true;
    }

    li.appendChild(input);
    li.appendChild(document.createTextNode(" " + option));
    optionsEl.appendChild(li);
  });

  prevBtn.disabled = index === 0;
}

function finishTest() {
  quizContainer.classList.add("hidden");
  timer.classList.add("hidden");
  resultEl.classList.remove("hidden");

  score = 0;
  for(let i = 0; i < questions.length; i++) {
    if(userAnswers[i] === questions[i].answer) score++;
  }

  document.getElementById("score").textContent = `Time's up! You scored ${score} out of ${questions.length}`;
  sendResultEmail();
}

function showFinalResult() {
  quizContainer.classList.add("hidden");
  timer.classList.add("hidden");
  resultEl.classList.remove("hidden");

  score = 0;
  for(let i = 0; i < questions.length; i++) {
    if(userAnswers[i] === questions[i].answer) score++;
  }

  document.getElementById("score").textContent = `You scored ${score} out of ${questions.length}`;
  sendResultEmail();
}

nextBtn.addEventListener("click", () => {
  const selected = document.querySelector('input[name="option"]:checked');

  if (selected) {
    userAnswers[currentQuestion] = parseInt(selected.value);
  } else {
    userAnswers[currentQuestion] = null;
  }

  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion(currentQuestion);
  } else {
    clearInterval(timerInterval);
    showFinalResult();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion(currentQuestion);
  }
});

userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const mobile = mobileInput.value.trim();
  const date = dateInput.value;

  const mobileRegex = /^[0-9]{10}$/;

  if (!name || !lastName || !mobile || !date) {
    alert("Please fill all the details.");
    return;
  }

  if (!mobileRegex.test(mobile)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  userForm.classList.add("hidden");
  startBtn.classList.remove("hidden");
});

startBtn.addEventListener("click", () => {
  startBtn.classList.add("hidden");
  timer.classList.remove("hidden");
  quizContainer.classList.remove("hidden");

  showQuestion(currentQuestion);
  startTimer();
});

// Function to send email by calling backend API
async function sendResultEmail() {
  const data = {
    name: nameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    mobile: mobileInput.value.trim(),
    date: dateInput.value,
    score
  };

  try {
    const response = await fetch("http://localhost:3000/send-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error sending email:", errorData.error);
    } else {
      console.log("Result sent successfully!");
    }
  } catch (error) {
    console.error("Failed to send result:", error);
  }
}