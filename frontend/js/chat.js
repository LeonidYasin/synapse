// ============================================================
// chat.js — управление чатом
// ============================================================

const Chat = {
    messages: [],
    isProcessing: false,

    init() {
        this.el = {
            messages: document.getElementById('chatMessages'),
            input: document.getElementById('chatInput'),
            sendBtn: document.getElementById('sendBtn'),
            modelSelect: document.getElementById('modelSelect'),
            privacyToggle: document.getElementById('privacyToggle'),
        };

        this.el.sendBtn.addEventListener('click', () => this.send());
        this.el.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.send();
            }
        });
    },

    async send() {
        const text = this.el.input.value.trim();
        if (!text || this.isProcessing) return;

        this.addMessage('user', text);
        this.el.input.value = '';
        this.isProcessing = true;

        const response = await this.getAssistantResponse(text);
        this.addMessage('assistant', response);

        if (this.el.privacyToggle.checked) {
            Agent.analyze(text, response);
        }

        this.isProcessing = false;
    },

    addMessage(role, text) {
        const message = { role, text, timestamp: new Date() };
        this.messages.push(message);

        const div = document.createElement('div');
        div.className = `message message--${role}`;
        div.innerHTML = `
            <div class="message__text">${text}</div>
            <div class="message__meta">${message.timestamp.toLocaleTimeString()}</div>
        `;
        this.el.messages.appendChild(div);
        this.el.messages.scrollTop = this.el.messages.scrollHeight;
    },

    async getAssistantResponse(text) {
        const responses = [
            "Интересная мысль! Расскажите подробнее — я помогу найти людей, которым это тоже важно.",
            "Я вижу, вы размышляете над этой темой. В сообществе есть люди со схожими интересами — агент уже ищет связи.",
            "Отличная идея! Я передал её агенту для анализа. Возможно, это заинтересует других участников.",
            "Понимаю, о чём вы говорите. Если разрешите, агент поищет людей, которые могут быть вам полезны.",
            "Спасибо, что поделились. Ваши мысли записаны — агент найдёт связи с теми, кому это может быть интересно."
        ];
        const randomIndex = Math.floor(Math.random() * responses.length);

        await new Promise(r => setTimeout(r, 500 + Math.random() * 1000));
        return responses[randomIndex];
    }
};

window.Chat = Chat;