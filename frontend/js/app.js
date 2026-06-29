// ============================================================
// app.js — точка входа
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    Chat.init();

    document.getElementById('onboarding').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('userName').textContent = 'Участник Synapse';

    setTimeout(() => {
        Agent.updateMatches();
    }, 1000);

    console.log('🧠 Synapse запущен!');
});