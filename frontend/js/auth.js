// ============================================================
// auth.js — простая авторизация (имитация)
// ============================================================

const Auth = {
    isAuthenticated: false,
    username: null,

    init() {
        const saved = localStorage.getItem('synapse_user');
        if (saved) {
            this.username = saved;
            this.isAuthenticated = true;
            this.updateUI();
            document.getElementById('userName').textContent = saved;
        }

        document.getElementById('authBtn').addEventListener('click', () => {
            if (this.isAuthenticated) {
                this.logout();
            } else {
                this.login();
            }
        });
    },

    login() {
        const name = prompt('Введите ваше имя:');
        if (name) {
            this.username = name;
            this.isAuthenticated = true;
            localStorage.setItem('synapse_user', name);
            this.updateUI();
            document.getElementById('userName').textContent = name;
        }
    },

    logout() {
        localStorage.removeItem('synapse_user');
        this.isAuthenticated = false;
        this.username = null;
        this.updateUI();
        document.getElementById('userName').textContent = 'Участник';
    },

    updateUI() {
        const btn = document.getElementById('authBtn');
        const status = document.getElementById('userStatus');
        if (this.isAuthenticated) {
            btn.textContent = 'Выйти';
            status.textContent = this.username;
        } else {
            btn.textContent = 'Войти';
            status.textContent = 'Гость';
        }
    }
};

window.Auth = Auth;

document.addEventListener('DOMContentLoaded', () => Auth.init());