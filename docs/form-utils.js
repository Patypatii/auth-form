// Minimal FormUtils for login/signup forms
const FormUtils = {
    validateEmail(value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            isValid: re.test(value),
            message: re.test(value) ? '' : 'Enter a valid email address.'
        };
    },
    validatePassword(value) {
        return {
            isValid: value.length >= 6,
            message: value.length >= 6 ? '' : 'Password must be at least 6 characters.'
        };
    },
    setupFloatingLabels(form) {
        if (!form) return;
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });
    },
    setupPasswordToggle(input, toggleBtn) {
        if (!input || !toggleBtn) return;
        toggleBtn.addEventListener('click', () => {
            input.type = input.type === 'password' ? 'text' : 'password';
            const eyeIcon = toggleBtn.querySelector('.eye-icon');
            if (eyeIcon) eyeIcon.classList.toggle('show-password');
        });
    },
    showError(inputId, message, errorId) {
        const errorElem = errorId ? document.getElementById(errorId) : document.getElementById(inputId + 'Error');
        if (errorElem) {
            errorElem.textContent = message;
            errorElem.style.display = 'block';
        }
        const input = document.getElementById(inputId);
        if (input) input.classList.add('input-error');
    },
    clearError(inputId, errorId) {
        const errorElem = errorId ? document.getElementById(errorId) : document.getElementById(inputId + 'Error');
        if (errorElem) {
            errorElem.textContent = '';
            errorElem.style.display = 'none';
        }
        const input = document.getElementById(inputId);
        if (input) input.classList.remove('input-error');
    },
    showSuccess(inputId) {
        const input = document.getElementById(inputId);
        if (input) input.classList.add('input-success');
    },
    addEntranceAnimation(card) {
        if (card) {
            card.style.opacity = 0;
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s';
                card.style.opacity = 1;
            }, 100);
        }
    },
    addSharedAnimations() { },
    showNotification(message, type, form) {
        let notif = document.createElement('div');
        notif.className = 'form-notification ' + (type || 'info');
        notif.textContent = message;
        notif.style.position = 'absolute';
        notif.style.top = '10px';
        notif.style.left = '50%';
        notif.style.transform = 'translateX(-50%)';
        notif.style.background = '#fff';
        notif.style.padding = '8px 16px';
        notif.style.borderRadius = '6px';
        notif.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        notif.style.zIndex = 1000;
        if (form && form.parentElement) {
            form.parentElement.appendChild(notif);
        } else {
            document.body.appendChild(notif);
        }
        setTimeout(() => {
            notif.remove();
        }, 2000);
    },
    simulateLogin(email, password) {
        // Fake async login
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'test@example.com' && password === 'password123') {
                    resolve();
                } else {
                    reject(new Error('Invalid credentials.'));
                }
            }, 1000);
        });
    }
};
