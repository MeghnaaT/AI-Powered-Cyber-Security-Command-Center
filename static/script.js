// static/script.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files || fileInput.files.length === 0) {
      alert('Please select a file to analyze.');
      return;
    }
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    resultDiv.style.display = 'block';
    resultDiv.textContent = '🔍 Scanning file...';

    try {
      const resp = await fetch('/analyze', {
        method: 'POST',
        body: formData
      });

      if (!resp.ok) {
        const err = await resp.json();
        resultDiv.innerHTML = `<strong style="color: #ffd1d1">Error:</strong> ${err.error || resp.statusText}`;
        return;
      }

      const data = await resp.json();
      resultDiv.innerHTML = prettyPrintAnalysis(data);
    } catch (err) {
      resultDiv.innerHTML = `<strong style="color: #ffd1d1">Network Error:</strong> ${err.message}`;
    }
  });

  function prettyPrintAnalysis(d) {
    let html = `<h3>Analysis Report</h3>`;
    html += `<p><strong>Filename:</strong> ${escape(d.file.filename)} (${d.file.file_size} bytes)</p>`;
    html += `<p><strong>Declared extension:</strong> ${escape(d.file.ext || '—')}</p>`;
    html += `<p><strong>SHA-256:</strong> <code>${escape(d.file.sha256)}</code></p>`;
    html += `<p><strong>MIME type detected:</strong> ${escape(d.mime_type)}</p>`;
    html += `<p><strong>Magic header (hex):</strong> ${escape(d.magic_header)}</p>`;
    html += `<p><strong>Detected type (by header):</strong> ${escape(d.detected_type || 'Unknown')}</p>`;
    html += `<p><strong>Entropy:</strong> ${d.entropy} (0 - 8)</p>`;
    html += `<p><strong>Risk score:</strong> ${d.risk_score}/100</p>`;

    if (d.risk_reasons && d.risk_reasons.length) {
      html += `<p><strong>Risk reasons:</strong></p><ul>`;
      d.risk_reasons.forEach(r => { html += `<li>${escape(r)}</li>`; });
      html += `</ul>`;
    }

    if (d.image_info) {
      html += `<hr><p><strong>Image info:</strong></p>`;
      html += `<pre>${escape(JSON.stringify(d.image_info, null, 2))}</pre>`;
    }

    if (d.pdf_info) {
      html += `<hr><p><strong>PDF info:</strong></p>`;
      html += `<pre>${escape(JSON.stringify(d.pdf_info, null, 2))}</pre>`;
    }

    if (d.ai_analysis) {
  html += `<hr><h3>AI Threat Analysis</h3>`;
  html += `<p><strong>Threat Level:</strong> ${escape(d.ai_analysis.ai_threat_level || 'Unknown')}</p>`;
  html += `<p><strong>AI Confidence:</strong> ${d.ai_analysis.ai_confidence || 0}%</p>`;

  if (Array.isArray(d.ai_analysis.ai_behavior_summary)) {
    if (d.ai_analysis.ai_behavior_summary.length > 0) {
      html += `<p><strong>Behavior Detected:</strong></p><ul>`;
      d.ai_analysis.ai_behavior_summary.forEach(b => {
        html += `<li>${escape(b)}</li>`;
      });
      html += `</ul>`;
    }
  }

  if (Array.isArray(d.ai_analysis.ai_attack_techniques)) {
    if (d.ai_analysis.ai_attack_techniques.length > 0) {
      html += `<p><strong>Attack Techniques:</strong></p><ul>`;
      d.ai_analysis.ai_attack_techniques.forEach(t => {
        html += `<li>${escape(t)}</li>`;
      });
      html += `</ul>`;
    }
  }
}
html += `
  <hr>
  <button onclick="downloadReport()">Download Scan Report</button>
`;


    return html;
  }

  // simple escape to avoid gadget injection in UI
  function escape(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"'`]/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;', '`':'&#96;'})[m]);
  }
});

function downloadReport(){
  const content = document.getElementById

}