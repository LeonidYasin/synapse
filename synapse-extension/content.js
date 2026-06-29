// content.js — внедрение Sidebar в страницы LLM

let sidebar = null;
let userId = null;

function detectLLM() {
  const url = window.location.href;
  if (url.includes('chat.deepseek.com')) return 'deepseek';
  if (url.includes('chat.openai.com') || url.includes('chatgpt.com')) return 'chatgpt';
  if (url.includes('claude.ai')) return 'claude';
  return 'unknown';
}

function readConversation() {
  const llm = detectLLM();
  let messages = [];
  
  switch (llm) {
    case 'deepseek':
      const deepseekMessages = document.querySelectorAll('.chat-message, .message-item, [class*="message"]');
      messages = Array.from(deepseekMessages).map(el => {
        const isUser = el.closest('[class*="user"]') || el.querySelector('[class*="user"]');
        return {
          role: isUser ? 'user' : 'assistant',
          text: el.textContent.trim()
        };
      });
      break;
      
    case 'chatgpt':
      const chatgptMessages = document.querySelectorAll('[data-message-author-role]');
      messages = Array.from(chatgptMessages).map(el => ({
        role: el.getAttribute('data-message-author-role'),
        text: el.textContent.trim()
      }));
      break;
      
    case 'claude':
      const claudeMessages = document.querySelectorAll('.message, [class*="message"]');
      messages = Array.from(claudeMessages).map(el => {
        const isUser = el.classList.contains('user') || el.closest('[class*="user"]');
        return {
          role: isUser ? 'user' : 'assistant',
          text: el.textContent.trim()
        };
      });
      break;
      
    default:
      const fallbackMessages = document.querySelectorAll('[class*="message"], [class*="chat"], [class*="conversation"]');
      messages = Array.from(fallbackMessages).map(el => ({
        role: el.classList.contains('user') ? 'user' : 'assistant',
        text: el.textContent.trim()
      }));
  }
  
  return messages.filter(m => m.text && m.text.length > 0);
}

function createSidebar() {
  if (sidebar) return;
  
  userId = localStorage.getItem('synapse_user_id');
  if (!userId) {
    userId = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
    localStorage.setItem('synapse_user_id', userId);
  }
  
  const userName = localStorage.getItem('synapse_user_name') || 'Участник';
  
  sidebar = document.createElement('div');
  sidebar.id = 'synapse-sidebar';
  sidebar.innerHTML = `
    <div class="synapse-header">
      <span class="synapse-logo">🧠 Synapse</span>
      <button class="synapse-close" id="synapse-close">✕</button>
    </div>
    
    <div class="synapse-profile">
      <div class="synapse-avatar">👤</div>
      <div class="synapse-name" id="synapse-username">${userName}</div>
      <button class="synapse-edit-name" id="synapse-edit-name">✎</button>
    </div>
    
    <div class="synapse-stats">
      <span>📊 <span id="idea-count">0</span> идей</span>
      <span>🔗 <span id="match-count">0</span> связей</span>
    </div>
    
    <div class="synapse-matches">
      <h4>🔗 Рекомендации</h4>
      <div id="matches-list">
        <div class="match-placeholder">Агент анализирует диалоги...</div>
      </div>
    </div>
    
    <div class="synapse-actions">
      <button id="analyze-btn" class="synapse-btn synapse-btn-primary">📊 Анализировать диалог</button>
      <button id="sync-btn" class="synapse-btn synapse-btn-secondary">🔄 Обновить</button>
    </div>
    
    <div class="synapse-footer">
      <span class="synapse-status" id="synapse-status">● Готов</span>
      <span class="synapse-llm">${detectLLM()}</span>
    </div>
  `;
  
  document.body.appendChild(sidebar);
  
  const trigger = document.createElement('button');
  trigger.id = 'synapse-trigger';
  trigger.innerHTML = '🧠';
  trigger.title = 'Открыть Synapse';
  document.body.appendChild(trigger);
  
  document.getElementById('synapse-close').addEventListener('click', toggleSidebar);
  trigger.addEventListener('click', toggleSidebar);
  
  document.getElementById('analyze-btn').addEventListener('click', handleAnalyze);
  document.getElementById('sync-btn').addEventListener('click', handleSync);
  document.getElementById('synapse-edit-name').addEventListener('click', handleEditName);
  
  loadMatches();
  
  console.log('[Synapse] Sidebar создан, userId:', userId);
}

function toggleSidebar() {
  if (!sidebar) return;
  const isVisible = sidebar.style.display !== 'none';
  sidebar.style.display = isVisible ? 'none' : 'block';
  document.getElementById('synapse-trigger').style.display = isVisible ? 'flex' : 'none';
}

async function handleAnalyze() {
  const status = document.getElementById('synapse-status');
  status.textContent = '● Анализ...';
  status.style.color = '#f6b83d';
  
  try {
    const dialog = readConversation();
    
    if (dialog.length === 0) {
      status.textContent = '● Нет сообщений для анализа';
      status.style.color = '#e74c3c';
      return;
    }
    
    const response = await chrome.runtime.sendMessage({
      type: 'analyze_dialog',
      dialog: dialog,
      userId: userId
    });
    
    if (response.success) {
      status.textContent = '● Анализ завершён';
      status.style.color = '#2ecc71';
      
      document.getElementById('idea-count').textContent = response.data.ideas?.length || 0;
      displayMatches(response.data.matches || []);
    } else {
      status.textContent = '● Ошибка: ' + response.error;
      status.style.color = '#e74c3c';
    }
  } catch (error) {
    status.textContent = '● Ошибка: ' + error.message;
    status.style.color = '#e74c3c';
  }
}

async function handleSync() {
  const status = document.getElementById('synapse-status');
  status.textContent = '● Синхронизация...';
  status.style.color = '#f6b83d';
  
  try {
    await loadMatches();
    status.textContent = '● Синхронизировано';
    status.style.color = '#2ecc71';
  } catch (error) {
    status.textContent = '● Ошибка: ' + error.message;
    status.style.color = '#e74c3c';
  }
}

async function loadMatches() {
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'get_matches',
      userId: userId
    });
    
    if (response.success) {
      displayMatches(response.matches || []);
    }
  } catch (error) {
    console.error('[Synapse] Ошибка загрузки рекомендаций:', error);
  }
}

function displayMatches(matches) {
  const list = document.getElementById('matches-list');
  
  if (!matches || matches.length === 0) {
    list.innerHTML = `
      <div class="match-placeholder">
        💡 Пока нет рекомендаций. Общайтесь с ИИ — агент найдёт связи.
      </div>
    `;
    return;
  }
  
  document.getElementById('match-count').textContent = matches.length;
  
  list.innerHTML = matches.map(m => `
    <div class="match-item">
      <div class="match-item-header">
        <span class="match-item-name">${m.name || 'Аноним'}</span>
        <span class="match-item-score">${Math.round((m.score || 0) * 100)}%</span>
      </div>
      <div class="match-item-reason">${m.reason || 'Общие интересы'}</div>
      <button class="match-item-btn" data-user="${m.userId}">Связаться</button>
    </div>
  `).join('');
  
  list.querySelectorAll('.match-item-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetUser = this.dataset.user;
      alert(`🔗 Запрос на связь с пользователем ${targetUser} отправлен!`);
    });
  });
}

function handleEditName() {
  const currentName = localStorage.getItem('synapse_user_name') || 'Участник';
  const newName = prompt('Введите ваше имя:', currentName);
  if (newName && newName.trim().length > 0) {
    localStorage.setItem('synapse_user_name', newName.trim());
    document.getElementById('synapse-username').textContent = newName.trim();
  }
}

function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSidebar);
  } else {
    createSidebar();
  }
}

init();