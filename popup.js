// Popup script

const postmanUI = document.getElementById('postmanUI');
const sendBtn = document.getElementById('sendBtn');
const methodSelect = document.getElementById('methodSelect');
const urlInput = document.getElementById('urlInput');
const headersInput = document.getElementById('headersInput');
const bodyInput = document.getElementById('bodyInput');
const responseSection = document.getElementById('responseSection');
const responseBody = document.getElementById('responseBody');
const responseHeaders = document.getElementById('responseHeaders');
const statusCode = document.getElementById('statusCode');
const responseTime = document.getElementById('responseTime');

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(tabName).classList.add('active');
  });
});

// Send API request
sendBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  const method = methodSelect.value;
  const headersText = headersInput.value.trim();
  const bodyText = bodyInput.value.trim();

  if (!url) {
    alert('Please enter a URL');
    return;
  }

  // Parse headers
  let headers = {};
  if (headersText) {
    try {
      headers = JSON.parse(headersText);
    } catch (e) {
      alert('Invalid JSON in headers');
      return;
    }
  }

  // Parse body
  let body = null;
  if (bodyText && method !== 'GET' && method !== 'HEAD') {
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      alert('Invalid JSON in body');
      return;
    }
  }

  // Disable send button and show loading
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';
  const startTime = Date.now();

  try {
    const options = {
      method: method,
      headers: headers
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Parse response
    const contentType = response.headers.get('content-type');
    let responseBodyText = '';

    if (contentType && contentType.includes('application/json')) {
      try {
        const jsonData = await response.json();
        responseBodyText = JSON.stringify(jsonData, null, 2);
      } catch (e) {
        responseBodyText = await response.text();
      }
    } else {
      responseBodyText = await response.text();
    }

    // Get response headers
    let headersText = '';
    response.headers.forEach((value, key) => {
      headersText += `${key}: ${value}\n`;
    });

    // Display response
    responseSection.style.display = 'block';
    responseBody.textContent = responseBodyText || '(empty response)';
    responseHeaders.textContent = headersText || '(no headers)';

    // Status code badge
    const statusBadge = statusCode;
    statusBadge.textContent = `${response.status} ${response.statusText}`;
    statusBadge.classList.remove('success', 'error');
    if (response.ok) {
      statusBadge.classList.add('success');
    } else {
      statusBadge.classList.add('error');
    }

    responseTime.textContent = `${duration}ms`;
  } catch (error) {
    responseSection.style.display = 'block';
    responseBody.textContent = `Error: ${error.message}`;
    statusCode.textContent = 'Error';
    statusCode.classList.add('error');
    responseTime.textContent = '';
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send Request';
  }
});

// Allow Enter key to send request
urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    sendBtn.click();
  }
});
