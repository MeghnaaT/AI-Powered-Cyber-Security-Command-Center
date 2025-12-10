/******************************
 🔥 GLOBAL THEME TOGGLE
******************************/
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        themeToggle.innerText = "🌙";
    } else {
        themeToggle.innerText = "☀️";
    }
});
/******************************
 👁️ PASSWORD VISIBILITY TOGGLE
******************************/
function togglePasswordVisibility() {
  const passwordInput = document.getElementById("passwordInput");
  const toggleBtn = document.querySelector(".toggle-password-btn");
  
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.textContent = "🙈";  // Changed eye icon
  } else {
    passwordInput.type = "password";
    toggleBtn.textContent = "👁️";  // Back to eye icon
  }
}

/******************************
 📂 FILE SCANNER
******************************/
function scanFile() {
  const fileInput = document.getElementById("fileInput");
  const resultBox = document.getElementById("fileResult");

  if (!fileInput.files.length) {
    resultBox.innerHTML = "❌ Please select a file.";
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  resultBox.innerHTML = "⏳ Scanning file...";

  fetch("/scan-file", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        resultBox.innerHTML = "❌ " + data.error;
        return;
      }

      resultBox.innerHTML = `
📄 File Name: ${data.filename}
📦 Size: ${data.size_bytes} bytes
🧬 Detected Type: ${data.detected_type}
📊 Entropy: ${data.entropy_percentage}
🔢 Magic Number: ${data.magic_number}
✅ Status: OK
      `;
    })
    .catch((err) => {
      console.error(err);
      resultBox.innerHTML = "❌ Error scanning file.";
    });
}

/******************************
 📨 PHISHING MESSAGE ANALYZER
******************************/

function analyzePhishing() {
    const text = document.getElementById("phishText").value.trim();
    if (!text) return;

    fetch("/analyze-phishing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    })
    .then(res => res.json())
    .then(data => {
        // Show the box only when results arrive
        document.getElementById("phishResult").style.display = "block";

        document.getElementById("verdictOutput").textContent = data.verdict;
        document.getElementById("riskScoreOutput").textContent = data.risk_score;

        const box = document.getElementById("reasonsListBox");

        if (!data.reasons || data.reasons.length === 0) {
            box.innerHTML = "No suspicious indicators found.";
        } else {
            box.innerHTML = data.reasons.map(r => "• " + r).join("<br>");
        }
    });
}
document.getElementById("phishText").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        analyzePhishing();
    }
});


/******************************
 🔐 PASSWORD STRENGTH CHECKER
******************************/
function checkPassword() {
  const pwd = document.getElementById("passwordInput").value;
  const resultBox = document.getElementById("passwordResult");

  if (!pwd.trim()) {
    resultBox.innerHTML = "❌ Please enter a password.";
    return;
  }

  resultBox.innerHTML = "⏳ Checking strength...";

  fetch("/check-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: pwd })
  })
  .then(res => res.json())
  .then(data => {

    let suggestionsHTML = "";
    if (data.feedback && data.feedback.length > 0) {
      suggestionsHTML = `
        <div class="suggestions-title">📌 Suggestions:</div>
        <ul class="suggestions-list">
          ${data.feedback.map(item => `<li>${item}</li>`).join("")}
        </ul>
      `;
    }

    resultBox.innerHTML = `
      <div class="result-line"><b>🔐 Strength:</b> ${data.strength}</div>
      <div class="result-line"><b>📊 Score:</b> ${data.score}/100</div>
      ${suggestionsHTML}
    `;
  })
  .catch(() => {
    resultBox.innerHTML = "❌ Error checking password.";
  });
}



/******************************
 🎯 PHISHING SIMULATION
******************************/
/******************************
 🎯 PHISHING SIMULATION - INTERACTIVE QUIZ
******************************/
let quizIndex = 0;
let quizScore = 0;

const phishingQuizzes = [
  {
    message: "🔔 URGENT: Verify your bank account now!\nClick here: secure-banking-dot-tk\n⚠️ Your account will be locked!",
    isPhishing: true,
    explanation: "RED FLAGS: Urgency, unusual domain (.tk), misspelled URL, threats of account lockout"
  },
  {
    message: "Hi! Please review the attached invoice for project X. Let me know if you need any clarifications.",
    isPhishing: false,
    explanation: "✅ LEGITIMATE: Professional tone, specific context, no urgency or threats, no suspicious links"
  },
  {
    message: "🎁 CONGRATS! You won $1,000,000! Claim now: bit.ly/prize2025\nNo verification needed!",
    isPhishing: true,
    explanation: "RED FLAGS: Too good to be true, shortened URL, \"no verification needed\", fake prize"
  }
];

function startSimulation() {
  const resultBox = document.getElementById("simulationResult");
  quizIndex = 0;
  quizScore = 0;
  showQuiz();
}

function showQuiz() {
  const resultBox = document.getElementById("simulationResult");
  
  if (quizIndex >= phishingQuizzes.length) {
    resultBox.innerHTML = `
      <div class="quiz-complete">
        🎉 <b>Quiz Complete!</b><br>
        Your Score: ${quizScore}/${phishingQuizzes.length} ✅<br><br>
        <button onclick="startSimulation()" style="width: 100%; padding: 10px;">🔄 Retry Quiz</button>
      </div>
    `;
    return;
  }

  const quiz = phishingQuizzes[quizIndex];
  resultBox.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-question">
        <b>Question ${quizIndex + 1}/${phishingQuizzes.length}</b><br><br>
        "${quiz.message}"
      </div>
      <div class="quiz-options">
        <button class="quiz-option" onclick="answerQuiz(true)">🚨 PHISHING</button>
        <button class="quiz-option" onclick="answerQuiz(false)">✅ LEGITIMATE</button>
      </div>
    </div>
  `;
}

function answerQuiz(userAnswer) {
  const resultBox = document.getElementById("simulationResult");
  const quiz = phishingQuizzes[quizIndex];
  const isCorrect = userAnswer === quiz.isPhishing;

  if (isCorrect) quizScore++;

  const feedback = isCorrect 
    ? `✅ <b>CORRECT!</b>` 
    : `❌ <b>WRONG!</b> It was actually ${quiz.isPhishing ? "PHISHING" : "LEGITIMATE"}`;

  resultBox.innerHTML = `
    <div class="quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}">
      ${feedback}<br><br>
      <b>Why:</b> ${quiz.explanation}<br><br>
      <button onclick="nextQuestion()" style="width: 100%; padding: 10px;">Next Question →</button>
    </div>
  `;
}

function nextQuestion() {
  quizIndex++;
  showQuiz();
}


/******************************
 🌐 LIVE ATTACK VIEWER
******************************/
function viewAttacks() {
  const resultBox = document.getElementById("attackResult");

  resultBox.innerHTML = "⏳ Fetching attacks...";

  fetch("/view-attacks")
    .then(res => res.json())
    .then(data => {
      const attacksHtml = data.attacks.map(a => `
        🚨 <b>Attack Type:</b> ${a.type}<br>
        🖥 <b>Source IP:</b> ${a.src}<br>
        ⏱ <b>Time:</b> ${a.time}<br><hr>
      `).join("");

      resultBox.innerHTML = attacksHtml;
    })
    .catch(() => {
      resultBox.innerHTML = "❌ Error loading attacks.";
    });
}


/******************************
 ⌨️ ENTER KEY SUPPORT
******************************/
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const active = document.activeElement;

    if (active && active.id === "phishText") {
      analyzePhishing();
    }

    if (active && active.id === "passwordInput") {
      checkPassword();
    }
  }
});
