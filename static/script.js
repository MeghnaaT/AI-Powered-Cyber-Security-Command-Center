/******************************
 🔥 GLOBAL THEME TOGGLE
******************************/
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    // Change icon dynamically
    if (document.body.classList.contains("light-mode")) {
        themeToggle.innerText = "🌙";  // Click to go back to dark
    } else {
        themeToggle.innerText = "☀️";  // Click to go light
    }
});


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
      resultBox.innerHTML = `
        ✅ <b>File Name:</b> ${data.filename}<br>
        📦 <b>Size:</b> ${data.size_bytes} bytes<br>
        📄 <b>Type:</b> ${data.detected_type}<br>
        ⚠️ <b>Entropy Score:</b> ${data.byte_diversity}<br>
        🛡 <b>Status:</b> ${data.verdict || "Safe"}
      `;
    })
    .catch(() => {
      resultBox.innerHTML = "❌ Error scanning file.";
    });
}

/******************************
 📨 PHISHING MESSAGE ANALYZER
******************************/
function analyzePhishing() {
  const text = document.getElementById("phishingText").value;
  const resultBox = document.getElementById("phishingResult");

  if (!text.trim()) {
    resultBox.innerHTML = "❌ Please enter a message.";
    return;
  }

  resultBox.innerHTML = "⏳ Analyzing message...";

  fetch("/analyze-phishing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  })
    .then(res => res.json())
    .then(data => {
      resultBox.innerHTML = `
        🔍 <b>Analysis:</b> ${data.message}<br>
        🚨 <b>Threat Level:</b> ${data.verdict}<br>
        ✅ <b>Safe:</b> ${data.is_safe ? "Yes" : "No"}
      `;
    })
    .catch(() => {
      resultBox.innerHTML = "❌ Error analyzing message.";
    });
}

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
      resultBox.innerHTML = `
        🔐 <b>Strength:</b> ${data.strength}<br>
        📊 <b>Score:</b> ${data.score}/100<br>
        📝 <b>Suggestions:</b><br> - ${data.feedback.join("<br> - ")}
      `;
    })
    .catch(() => {
      resultBox.innerHTML = "❌ Error checking password.";
    });
}

/******************************
 🎯 PHISHING SIMULATION
******************************/
function startSimulation() {
  const resultBox = document.getElementById("simulationResult");

  resultBox.innerHTML = "⏳ Running simulation...";

  fetch("/start-simulation")
    .then(res => res.json())
    .then(data => {
      resultBox.innerHTML = `🎯 <b>Status:</b> ${data.message}`;
    })
    .catch(() => {
      resultBox.innerHTML = "❌ Error starting simulation.";
    });
}

/******************************
 🌐 LIVE ATTACK VIEWER
******************************/
function viewAttacks() {
  const resultBox = document.getElementById("attackResult");

  resultBox.innerHTML = "⏳ Fetching attacks...";

  fetch("/live-attacks")
    .then(res => res.json())
    .then(data => {
      const attacksHtml = data.attacks.map(a => `
        🚨 <b>Attack Type:</b> ${a.type}<br>
        🖥 <b>Source IP:</b> ${a.src}<br>
        🎯 <b>Target:</b> ${a.dst}<br>
        ⏱ <b>Time:</b> ${a.time}<br><hr>
      `).join("");

      resultBox.innerHTML = attacksHtml;
    })
    .catch(() => {
      resultBox.innerHTML = "❌ Error loading attacks.";
    });
}
