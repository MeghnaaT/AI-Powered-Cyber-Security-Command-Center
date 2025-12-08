// Basic client-side handlers for Cyber File Analyzer

function showText(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = typeof text === 'string' ? text : JSON.stringify(text, null, 2);
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

async function scanFile() {
    const input = document.getElementById('fileInput');
    const file = input && input.files && input.files[0];
    if (!file) {
        showText('fileResult', 'Please choose a file first');
        return;
    }
    showText('fileResult', 'Scanning...');
    const fd = new FormData();
    fd.append('file', file);
    try {
        const resp = await fetch('/scan-file', { method: 'POST', body: fd });
        if (!resp.ok) {
            let errText = '';
            try {
                const errJson = await resp.json();
                errText = JSON.stringify(errJson, null, 2);
            } catch (e) {
                try {
                    errText = await resp.text();
                } catch (e2) {
                    errText = 'Invalid response body';
                }
            }
            showText('fileResult', `Error: ${resp.status} ${resp.statusText}\n${errText}`);
            return;
        }
        const data = await resp.json();
        showText('fileResult', data);
    } catch (e) {
        console.error('scanFile error', e);
        showText('fileResult', 'Connection lost or server unreachable');
    }
}

async function analyzePhishing() {
    const text = document.getElementById('phishText').value;
    if (!text || text.trim() === '') {
        showText('phishResult', 'Please paste some text to analyze');
        return;
    }
    showText('phishResult', 'Analyzing...');
    try {
        const resp = await fetch('/analyze-phishing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        if (!resp.ok) {
            let errText = '';
            try {
                const errJson = await resp.json();
                errText = JSON.stringify(errJson, null, 2);
            } catch (e) {
                try { errText = await resp.text(); } catch (e2) { errText = 'Invalid response body'; }
            }
            showText('phishResult', `Error: ${resp.status} ${resp.statusText}\n${errText}`);
            return;
        }
        const data = await resp.json();
        showText('phishResult', data);
    } catch (e) {
        console.error('analyzePhishing error', e);
        showText('phishResult', 'Connection lost or server unreachable');
    }
}

async function checkPassword() {
    const pw = document.getElementById('passwordInput').value;
    if (!pw || pw.trim() === '') {
        showText('passwordResult', 'Please enter a password');
        return;
    }
    showText('passwordResult', 'Checking...');
    try {
        const resp = await fetch('/check-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pw })
        });
        if (!resp.ok) {
            let errText = '';
            try {
                const errJson = await resp.json();
                errText = JSON.stringify(errJson, null, 2);
            } catch (e) {
                try { errText = await resp.text(); } catch (e2) { errText = 'Invalid response body'; }
            }
            showText('passwordResult', `Error: ${resp.status} ${resp.statusText}\n${errText}`);
            return;
        }
        const data = await resp.json();
        showText('passwordResult', data);
    } catch (e) {
        console.error('checkPassword error', e);
        showText('passwordResult', 'Connection lost or server unreachable');
    }
}

async function startSimulation() {
    showText('simulationResult', 'Starting simulation...');
    try {
        const resp = await fetch('/start-simulation');
        if (!resp.ok) {
            let errText = '';
            try {
                const errJson = await resp.json();
                errText = JSON.stringify(errJson, null, 2);
            } catch (e) {
                try { errText = await resp.text(); } catch (e2) { errText = 'Invalid response body'; }
            }
            showText('simulationResult', `Error: ${resp.status} ${resp.statusText}\n${errText}`);
            return;
        }
        const data = await resp.json();
        showText('simulationResult', data);
    } catch (e) {
        console.error('startSimulation error', e);
        showText('simulationResult', 'Connection lost or server unreachable');
    }
}

async function viewAttacks() {
    showText('attackResult', 'Fetching...');
    try {
        const resp = await fetch('/view-attacks');
        if (!resp.ok) {
            let errText = '';
            try {
                const errJson = await resp.json();
                errText = JSON.stringify(errJson, null, 2);
            } catch (e) {
                try { errText = await resp.text(); } catch (e2) { errText = 'Invalid response body'; }
            }
            showText('attackResult', `Error: ${resp.status} ${resp.statusText}\n${errText}`);
            return;
        }
        const data = await resp.json();
        showText('attackResult', data);
    } catch (e) {
        console.error('viewAttacks error', e);
        showText('attackResult', 'Connection lost or server unreachable');
    }
}
