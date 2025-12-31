/******************************
 🔥 GLOBAL THEME TOGGLE
******************************/
const themeToggle = document.getElementById("themeToggle"); //Find the button with ID themeToggle
 //Toggle light/dark mode, when clicked,  it adds/removes the light-mode class on <body> (used by CSS to switch themes)
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        themeToggle.innerText = "🌙";
    } else {
        themeToggle.innerText = "☀️";
    } //Change button icon based on current theme
});
/******************************
 👁️ PASSWORD VISIBILITY TOGGLE
******************************/
function togglePasswordVisibility() {
  const passwordInput = document.getElementById("passwordInput");
  const toggleBtn = document.querySelector(".toggle-password-btn");
  
  // Toggle the input type between password and text i,e., switches between hiding(password) and showing (text) the password
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
  const resultBox = document.getElementById("fileResult"); //Finds the file input and result display box
 
  if (!fileInput.files.length) {
    resultBox.innerHTML = "❌ Please select a file.";
    return; //If no file is selected, show error and exit
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]); //creates a form and attaches the selected file

  resultBox.innerHTML = "⏳ Scanning file..."; //shows a loading message

  fetch("/scan-file", { //Sends the file to the flask backend at /scan-file.
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        resultBox.innerHTML = "❌ " + data.error;
        return; //if the server returns an error, show it
      }

      resultBox.innerHTML = `
📄 File Name: ${data.filename}
📦 Size: ${data.size_bytes} bytes
🧬 Detected Type: ${data.detected_type}
📊 Entropy: ${data.entropy_percentage}
🔢 Magic Number: ${data.magic_number}
✅ Status: OK
      `; //if successful, show the file analysis
    }) // if something breaks during fetch or processing, catch the error and show a message
    .catch((err) => {
      console.error(err);
      resultBox.innerHTML = "❌ Error scanning file.";
    });
}

/******************************
 📨 PHISHING MESSAGE ANALYZER
******************************/

function analyzePhishing() {
    const text = document.getElementById("phishText").value.trim(); //Get the text input and trim whitespace
    if (!text) return;

    fetch("/analyze-phishing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }) //Send the message to the flask backend for analysis
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
  .then(res => res.json()) //Parse the JSON response
  .then(data => {

    let suggestionsHTML = "";
    if (data.feedback && data.feedback.length > 0) {
      suggestionsHTML = `
        <div class="suggestions-title">📌 Suggestions:</div>
        <ul class="suggestions-list">
          ${data.feedback.map(item => `<li>${item}</li>`).join("")}
        </ul>
      `; //Format suggestions as a list
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
 🎯 PHISHING SIMULATION - INTERACTIVE QUIZ
******************************/
// Tracks current quiz question and score
let quizIndex = 0;
let quizScore = 0;

const phishingQuizzes = [ //Array of quiz questions with messages, correct answers, and explanations
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

function startSimulation() { //Resets quiz state and starts the quiz
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

function toggleAI() {
  const chat = document.getElementById("ai-chat");
  chat.style.display = chat.style.display === "flex" ? "none" : "flex";
}

async function askAI() {
  const input = document.getElementById("ai-question");
  const msgBox = document.getElementById("ai-messages");
  const question = input.value.trim();

  if (!question) return;

  msgBox.innerHTML += `<div><b>You:</b> ${question}</div>`;
  input.value = "";

  try {
    const res = await fetch("/ask-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    msgBox.innerHTML += `<div><b>AI:</b> ${data.answer}</div>`;
    msgBox.scrollTop = msgBox.scrollHeight;
  } catch {
    msgBox.innerHTML += `<div style="color:red">AI service error</div>`;
  }
}
function toggleChat() {
  const chat = document.getElementById("chat-widget");
  const isOpen = chat.style.display === "flex";
  chat.style.display = isOpen ? "none" : "flex";
  if (!isOpen) {
    // give browser a moment to render then focus the input so user can type immediately
    setTimeout(() => {
      const input = document.getElementById("chat-text");
      if (input) input.focus();
    }, 60);
  }
}

function sendChat() {
  const input = document.getElementById("chat-text");
  const msgBox = document.getElementById("chat-messages");
  if (!input || !msgBox) return;

  const text = input.value.trim();
  if (!text) return;
  // append user's message locally (safe)
  createMessage(msgBox, 'user', text);
  msgBox.scrollTop = msgBox.scrollHeight;
  input.value = "";

  // send to backend if available
  fetch("/ask-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: text })
  })
  .then(res => res.json())
  .then(data => {
    const answer = data.answer || '[no response]';
    createMessage(msgBox, 'ai', answer);
    msgBox.scrollTop = msgBox.scrollHeight;
  })
  .catch(err => {
    console.error(err);
    createMessage(msgBox, 'ai', 'AI service error');
    msgBox.scrollTop = msgBox.scrollHeight;
  });
}

// create a safe formatted message element
function createMessage(container, role, text) {
  const wrapper = document.createElement('div');
  wrapper.className = 'message ' + (role === 'user' ? 'user' : 'ai');

  const body = document.createElement('div');
  body.className = 'body';

  // Escape HTML then preserve line breaks
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const parts = escaped.split('\n');
  parts.forEach((part, idx) => {
    const span = document.createElement('span');
    span.textContent = part;
    body.appendChild(span);
    if (idx !== parts.length - 1) body.appendChild(document.createElement('br'));
  });

  wrapper.appendChild(body);
  
  // For AI messages, collapse long responses and add an expand button
  if (role === 'ai') {
    // after rendering, check height
    setTimeout(() => {
      if (body.scrollHeight > 160) {
        body.classList.add('collapsed');

        const btn = document.createElement('button');
        btn.className = 'expand-btn';
        btn.textContent = 'Expand';
        btn.onclick = () => {
          const expanded = body.classList.toggle('collapsed');
          if (body.classList.contains('collapsed')) {
            btn.textContent = 'Expand';
          } else {
            btn.textContent = 'Collapse';
          }
          // scroll the container to show the toggled content
          container.scrollTop = container.scrollHeight;
        };

        const ctrl = document.createElement('div');
        ctrl.style.marginTop = '6px';
        ctrl.appendChild(btn);
        wrapper.appendChild(ctrl);
      }
    }, 30);
  }
  container.appendChild(wrapper);
}

/******************************
 ⌨️ ENTER KEY SUPPORT
******************************/
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") { //When Enter key is pressed
    const active = document.activeElement;

    if (active && active.id === "phishText") {
      analyzePhishing();
    }

    if (active && active.id === "passwordInput") {
      checkPassword();
    }
    if (active && active.id === "chat-text") {
      // prevent form submission-like behavior
      e.preventDefault();
      sendChat();
    }
  }
});
