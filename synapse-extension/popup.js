// popup.js — логика всплывающего окна

document.addEventListener('DOMContentLoaded', async () => {
  const storage = await chrome.storage.local.get(['ideas', 'matches']);
  document.getElementById('popup-ideas').textContent = storage.ideas || 0;
  document.getElementById('popup-matches').textContent = storage.matches || 0;
  
  document.getElementById('popup-analyze').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'analyze' });
    });
    window.close();
  });
  
  document.getElementById('popup-sync').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'sync' });
    });
    window.close();
  });
  
  document.getElementById('popup-open').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'toggle_sidebar' });
    });
    window.close();
  });
});