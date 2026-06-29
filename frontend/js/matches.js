// ============================================================
// matches.js — управление рекомендациями
// ============================================================

const Matches = {
    // Дополнительная логика для рекомендаций
    // (основная логика находится в agent.js)

    acceptMatch(matchId) {
        console.log('[Matches] Принята связь:', matchId);
        alert('✅ Связь принята!');
    },

    declineMatch(matchId) {
        console.log('[Matches] Отклонена связь:', matchId);
        alert('❌ Связь отклонена');
    }
};

window.Matches = Matches;