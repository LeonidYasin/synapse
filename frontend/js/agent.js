// ============================================================
// agent.js — ИИ-агент для анализа диалогов и поиска связей
// ============================================================

const Agent = {
    userProfile: {
        interests: [],
        needs: [],
        ideas: [],
        expertise: [],
    },

    analyze(userMessage, assistantResponse) {
        console.log('[Agent] Анализ диалога:', userMessage);

        const interests = this.extractInterests(userMessage);
        if (interests.length > 0) {
            this.userProfile.interests.push(...interests);
            this.updateProfile();
        }

        const ideas = this.extractIdeas(userMessage);
        if (ideas.length > 0) {
            this.userProfile.ideas.push(...ideas);
            this.updateIdeas(ideas);
        }

        const needs = this.extractNeeds(userMessage);
        if (needs.length > 0) {
            this.userProfile.needs.push(...needs);
            this.updateMatches();
        }
    },

    extractInterests(text) {
        const keywords = ['децентрализация', 'блокчейн', 'крипто', 'AI', 'ИИ', 'стартап', 'разработка', 'инвестиции'];
        return keywords.filter(k => text.toLowerCase().includes(k.toLowerCase()));
    },

    extractIdeas(text) {
        const patterns = [
            { match: 'децентрализован', idea: 'Децентрализованный протокол' },
            { match: 'арбитраж', idea: 'Децентрализованный арбитраж' },
            { match: 'маркетплейс', idea: 'Децентрализованный маркетплейс' },
            { match: 'ИИ', idea: 'ИИ-агент для поиска связей' },
        ];
        return patterns
            .filter(p => text.toLowerCase().includes(p.match.toLowerCase()))
            .map(p => p.idea);
    },

    extractNeeds(text) {
        const needs = [];
        if (text.toLowerCase().includes('ищу')) needs.push('Поиск партнёров');
        if (text.toLowerCase().includes('инвестиции') || text.toLowerCase().includes('инвестор')) {
            needs.push('Поиск инвестиций');
        }
        if (text.toLowerCase().includes('помощь') || text.toLowerCase().includes('помогите')) {
            needs.push('Поиск экспертов');
        }
        return needs;
    },

    updateProfile() {
        const tagsEl = document.getElementById('userTags');
        const interests = this.userProfile.interests;
        if (interests.length > 0) {
            tagsEl.innerHTML = interests.map(i => `<span class="tag">${i}</span>`).join('');
        }
    },

    updateIdeas(ideas) {
        const list = document.getElementById('ideasList');
        const existing = list.querySelectorAll('.idea-item');
        const existingTexts = Array.from(existing).map(el => el.querySelector('.idea-item__title')?.textContent || '');
        ideas.forEach(idea => {
            if (!existingTexts.includes(idea)) {
                const div = document.createElement('div');
                div.className = 'idea-item';
                div.innerHTML = `
                    <span class="idea-item__title">${idea}</span>
                    <span class="idea-item__author">Вы</span>
                    <span class="idea-item__score">💡 Новая</span>
                `;
                list.appendChild(div);
            }
        });
    },

    updateMatches() {
        const list = document.getElementById('matchesList');
        const recommendations = [
            { name: 'Александр', reason: 'Интересуется децентрализацией', action: 'Связаться' },
            { name: 'Мария', reason: 'Ищет CTO для DeFi-стартапа', action: 'Связаться' },
            { name: 'Дмитрий', reason: 'Инвестор в Web3', action: 'Связаться' },
        ];

        list.innerHTML = recommendations.map(m => `
            <div class="match-item">
                <span class="match-item__name">${m.name}</span>
                <span class="match-item__reason">${m.reason}</span>
                <button class="btn btn--small btn--primary match-item__btn">Связаться</button>
            </div>
        `).join('') + `
            <p class="matches-list__note">💡 Агент анализирует диалоги и предлагает связи</p>
        `;
    }
};

window.Agent = Agent;