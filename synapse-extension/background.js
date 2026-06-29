// background.js — сервис-воркер расширения

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'analyze_dialog') {
    analyzeDialog(request.dialog, request.userId)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (request.type === 'get_matches') {
    getMatches(request.userId)
      .then(matches => sendResponse({ success: true, matches }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function analyzeDialog(dialog, userId) {
  const workerUrl = 'https://your-worker.workers.dev/analyze';
  
  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dialog, userId })
  });
  
  if (!response.ok) {
    throw new Error(`Worker error: ${response.status}`);
  }
  
  return await response.json();
}

async function getMatches(userId) {
  const workerUrl = 'https://your-worker.workers.dev/matches';
  
  const response = await fetch(`${workerUrl}?userId=${userId}`);
  
  if (!response.ok) {
    throw new Error(`Worker error: ${response.status}`);
  }
  
  return await response.json();
}