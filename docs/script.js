// Login Form 1 - Glassmorphism Style JavaScript
// This file extends form-utils.js with form-specific functionality

class LoginForm1 {
	constructor(formId, passwordId, passwordToggleId, successMessageId, emailId, emailErrorId, passwordErrorId) {
		this.form = document.getElementById(formId);
		this.submitBtn = this.form.querySelector('.login-btn');
		this.passwordToggle = document.getElementById(passwordToggleId);
		this.passwordInput = document.getElementById(passwordId);
		this.successMessage = this.form.parentElement.querySelector(`#${successMessageId}`) || this.form.querySelector(`#${successMessageId}`);
		this.isSubmitting = false;

		// Use provided IDs for validation
		this.emailId = emailId;
		this.emailErrorId = emailErrorId;
		this.passwordErrorId = passwordErrorId;

		this.validators = {
			email: FormUtils.validateEmail,
			password: FormUtils.validatePassword
		};

		// For signup form, add fullName validator
		if (formId === 'signupForm') {
			this.validators.fullName = (val) => ({ isValid: val.trim().length > 0, message: 'Full name required' });
		}

		this.init();
	}

	init() {
		this.addEventListeners();
		FormUtils.setupFloatingLabels(this.form);
		this.addInputAnimations();
		FormUtils.setupPasswordToggle(this.passwordInput, this.passwordToggle);
		this.setupSocialButtons();
		FormUtils.addSharedAnimations();
	}

	addEventListeners() {
		// Form submission
		this.form.addEventListener('submit', (e) => this.handleSubmit(e));

		// Real-time validation
		// Use correct IDs for each form
		if (this.form.id === 'loginForm') {
			const emailField = document.getElementById(this.emailId);
			if (emailField) {
				emailField.addEventListener('blur', () => this.validateField('email'));
				emailField.addEventListener('input', () => FormUtils.clearError(this.emailId, this.emailErrorId));
			}
			const passwordField = document.getElementById(this.passwordInput.id);
			if (passwordField) {
				passwordField.addEventListener('blur', () => this.validateField('password'));
				passwordField.addEventListener('input', () => FormUtils.clearError(this.passwordInput.id, this.passwordErrorId));
			}
		} else if (this.form.id === 'signupForm') {
			const fullNameField = document.getElementById('fullName');
			if (fullNameField) {
				fullNameField.addEventListener('blur', () => this.validateField('fullName'));
				fullNameField.addEventListener('input', () => FormUtils.clearError('fullName', 'fullNameError'));
			}
			const emailField = document.getElementById(this.emailId);
			if (emailField) {
				emailField.addEventListener('blur', () => this.validateField('email'));
				emailField.addEventListener('input', () => FormUtils.clearError(this.emailId, this.emailErrorId));
			}
			const passwordField = document.getElementById(this.passwordInput.id);
			if (passwordField) {
				passwordField.addEventListener('blur', () => this.validateField('password'));
				passwordField.addEventListener('input', () => FormUtils.clearError(this.passwordInput.id, this.passwordErrorId));
			}
		}

		// Enhanced focus effects
		const inputs = this.form.querySelectorAll('input');
		inputs.forEach(input => {
			input.addEventListener('focus', (e) => this.handleFocus(e));
			input.addEventListener('blur', (e) => this.handleBlur(e));
		});

		// Remember me checkbox animation (only for login)
		if (this.form.id === 'loginForm') {
			const checkbox = document.getElementById('remember');
			if (checkbox) {
				checkbox.addEventListener('change', () => this.animateCheckbox());
			}
		}

		// Forgot password link (only for login)
		if (this.form.id === 'loginForm') {
			const forgotLink = document.querySelector('.forgot-password');
			if (forgotLink) {
				forgotLink.addEventListener('click', (e) => this.handleForgotPassword(e));
			}
		}

		// Sign up/log in link
		const signupLink = this.form.parentElement.querySelector('.signup-link a');
		if (signupLink) {
			signupLink.addEventListener('click', (e) => this.handleSignupLink(e));
		}

		// Keyboard shortcuts
		this.setupKeyboardShortcuts();
	}

	addInputAnimations() {
		const inputs = this.form.querySelectorAll('input');
		inputs.forEach((input, index) => {
			// Stagger animation on page load
			setTimeout(() => {
				input.style.opacity = '1';
				input.style.transform = 'translateY(0)';
			}, index * 150);
		});
	}

	setupSocialButtons() {
		const socialButtons = document.querySelectorAll('.social-btn');
		socialButtons.forEach(btn => {
			btn.addEventListener('click', (e) => this.handleSocialLogin(e));
		});
	}

	handleFocus(e) {
		const wrapper = e.target.closest('.input-wrapper');
		if (wrapper) {
			wrapper.classList.add('focused');
		}
	}

	handleBlur(e) {
		const wrapper = e.target.closest('.input-wrapper');
		if (wrapper) {
			wrapper.classList.remove('focused');
		}
	}

	animateCheckbox() {
		const checkmark = document.querySelector('.checkmark');
		if (checkmark) {
			checkmark.style.transform = 'scale(0.8)';
			setTimeout(() => {
				checkmark.style.transform = 'scale(1)';
			}, 150);
		}
	}

	handleForgotPassword(e) {
		e.preventDefault();
		// Add subtle animation
		const link = e.target;
		link.style.transform = 'scale(0.95)';
		setTimeout(() => {
			link.style.transform = 'scale(1)';
		}, 150);

		FormUtils.showNotification('Password reset link would be sent to your email', 'info', this.form);
	}

	handleSignupLink(e) {
		e.preventDefault();
		// Add subtle animation
		const link = e.target;
		link.style.transform = 'scale(0.95)';
		setTimeout(() => {
			link.style.transform = 'scale(1)';
		}, 150);

		FormUtils.showNotification('Redirecting to sign up page...', 'info', this.form);
	}

	handleSocialLogin(e) {
		const btn = e.currentTarget;
		const provider = btn.classList.contains('google-btn') ? 'Google' : 'GitHub';

		// Add loading state
		btn.style.transform = 'scale(0.95)';
		btn.style.opacity = '0.8';

		setTimeout(() => {
			btn.style.transform = 'scale(1)';
			btn.style.opacity = '1';
		}, 200);

		FormUtils.showNotification(`Connecting to ${provider}...`, 'info', this.form);
	}

	async handleSubmit(e) {
		e.preventDefault();

		if (this.isSubmitting) return;

		const isValid = this.validateForm();

		if (isValid) {
			await this.submitForm();
		} else {
			this.shakeForm();
		}
	}

	validateForm() {
		let isValid = true;

		Object.keys(this.validators).forEach(fieldName => {
			if (!this.validateField(fieldName)) {
				isValid = false;
			}
		});

		return isValid;
	}

	validateField(fieldName) {
		let field, errorId;
		if (this.form.id === 'loginForm') {
			if (fieldName === 'email') {
				field = document.getElementById(this.emailId);
				errorId = this.emailErrorId;
			} else if (fieldName === 'password') {
				field = document.getElementById(this.passwordInput.id);
				errorId = this.passwordErrorId;
			}
		} else if (this.form.id === 'signupForm') {
			if (fieldName === 'fullName') {
				field = document.getElementById('fullName');
				errorId = 'fullNameError';
			} else if (fieldName === 'email') {
				field = document.getElementById(this.emailId);
				errorId = this.emailErrorId;
			} else if (fieldName === 'password') {
				field = document.getElementById(this.passwordInput.id);
				errorId = this.passwordErrorId;
			}
		}
		const validator = this.validators[fieldName];
		if (!field || !validator) return true;
		const result = validator(field.value.trim(), field);
		if (result.isValid) {
			FormUtils.clearError(field.id, errorId);
			FormUtils.showSuccess(field.id);
		} else {
			FormUtils.showError(field.id, result.message, errorId);
		}
		return result.isValid;
	}

	shakeForm() {
		this.form.style.animation = 'shake 0.5s ease-in-out';
		setTimeout(() => {
			this.form.style.animation = '';
		}, 500);
	}

	async submitForm() {
		this.isSubmitting = true;
		this.submitBtn.classList.add('loading');

		try {
			let url, payload;
			if (this.form.id === 'loginForm') {
				url = 'http://localhost:4000/api/login';
				payload = {
					email: document.getElementById(this.emailId).value,
					password: document.getElementById(this.passwordInput.id).value
				};
			} else if (this.form.id === 'signupForm') {
				url = 'http://localhost:4000/api/signup';
				payload = {
					name: document.getElementById('fullName').value,
					email: document.getElementById(this.emailId).value,
					password: document.getElementById(this.passwordInput.id).value
				};
			}
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const data = await res.json();
			if (res.ok && data.token) {
				// Store token and redirect
				localStorage.setItem('token', data.token);
				this.showSuccessMessage();
				setTimeout(() => {
					window.location = 'dashboard.html';
				}, 1800);
			} else {
				throw new Error(data.error || 'Authentication failed.');
			}
		} catch (error) {
			this.showLoginError(error.message);
		} finally {
			this.isSubmitting = false;
			this.submitBtn.classList.remove('loading');
		}
	}

	showSuccessMessage() {
		// Hide form with smooth animation
		this.form.style.opacity = '0';
		this.form.style.transform = 'translateY(-20px)';

		// Hide social login and other elements
		const elementsToHide = ['.divider', '.social-login', '.signup-link'];
		elementsToHide.forEach(selector => {
			const element = document.querySelector(selector);
			if (element) {
				element.style.opacity = '0';
				element.style.transform = 'translateY(-20px)';
			}
		});

		setTimeout(() => {
			this.form.style.display = 'none';
			elementsToHide.forEach(selector => {
				const element = document.querySelector(selector);
				if (element) element.style.display = 'none';
			});

			this.successMessage.classList.add('show');

			// Simulate redirect after success
			setTimeout(() => {
				this.simulateRedirect();
			}, 3000);
		}, 300);
	}

	simulateRedirect() {
		// For demo, reset the form after 2 seconds
		setTimeout(() => {
			this.resetForm();
		}, 2000);
	}

	showLoginError(message) {
		FormUtils.showNotification(message || 'Login failed. Please try again.', 'error', this.form);

		// Shake the entire card
		const card = document.querySelector('.login-card');
		card.style.animation = 'shake 0.5s ease-in-out';
		setTimeout(() => {
			card.style.animation = '';
		}, 500);
	}

	resetForm() {
		this.successMessage.classList.remove('show');

		setTimeout(() => {
			// Show form elements again
			const elementsToShow = ['.divider', '.social-login', '.signup-link'];
			this.form.style.display = 'block';
			elementsToShow.forEach(selector => {
				const element = document.querySelector(selector);
				if (element) {
					element.style.display = 'block';
				}
			});

			this.form.reset();

			// Clear all validation states
			Object.keys(this.validators).forEach(fieldName => {
				FormUtils.clearError(fieldName);
			});

			// Reset form appearance
			this.form.style.opacity = '1';
			this.form.style.transform = 'translateY(0)';

			// Reset other elements
			elementsToShow.forEach(selector => {
				const element = document.querySelector(selector);
				if (element) {
					element.style.opacity = '1';
					element.style.transform = 'translateY(0)';
				}
			});

			// Reset floating labels
			const inputs = this.form.querySelectorAll('input');
			inputs.forEach(input => {
				input.classList.remove('has-value');
			});

			// Reset password visibility
			if (this.passwordInput) {
				this.passwordInput.type = 'password';
				const eyeIcon = this.passwordToggle?.querySelector('.eye-icon');
				if (eyeIcon) {
					eyeIcon.classList.remove('show-password');
				}
			}
		}, 300);
	}

	setupKeyboardShortcuts() {
		document.addEventListener('keydown', (e) => {
			// Enter key submits form if focus is on form elements
			if (e.key === 'Enter' && e.target.closest('#loginForm')) {
				e.preventDefault();
				this.handleSubmit(e);
			}

			// Escape key clears errors
			if (e.key === 'Escape') {
				Object.keys(this.validators).forEach(fieldName => {
					FormUtils.clearError(fieldName);
				});
			}
		});
	}

	// Public methods
	validate() {
		return this.validateForm();
	}

	getFormData() {
		const formData = new FormData(this.form);
		const data = {};

		for (let [key, value] of formData.entries()) {
			data[key] = value;
		}

		return data;
	}
}

// Initialize when DOM is loaded

document.addEventListener('DOMContentLoaded', () => {
	// Add entrance animation to login card
	document.querySelectorAll('.login-card').forEach(card => FormUtils.addEntranceAnimation(card));

	// Initialize both forms with unique IDs
	const loginForm = new LoginForm1('loginForm', 'password', 'passwordToggle', 'successMessage', 'email', 'emailError', 'passwordError');
	const signupForm = new LoginForm1('signupForm', 'signupPassword', 'signupPasswordToggle', 'successMessage', 'signupEmail', 'signupEmailError', 'signupPasswordError');

	// Auth toggle logic
	const loginContainer = document.querySelector('.login-container');
	const signupContainer = document.querySelector('.signup-container');
	const showLoginBtn = document.getElementById('showLogin');
	const showSignupBtn = document.getElementById('showSignup');

	function showLogin() {
		loginContainer.style.display = '';
		signupContainer.style.display = 'none';
		showLoginBtn.classList.add('active');
		showSignupBtn.classList.remove('active');
	}

	function showSignup() {
		loginContainer.style.display = 'none';
		signupContainer.style.display = '';
		showLoginBtn.classList.remove('active');
		showSignupBtn.classList.add('active');
	}

	showLoginBtn.addEventListener('click', showLogin);
	showSignupBtn.addEventListener('click', showSignup);

	// Also handle in-form links
	document.querySelectorAll('.signup-link a').forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			if (link.textContent.toLowerCase().includes('sign up')) {
				showSignup();
			} else {
				showLogin();
			}
		});
	});
});

// Handle page visibility changes for better UX
document.addEventListener('visibilitychange', () => {
	if (document.visibilityState === 'visible') {
		// Re-focus on email field if user returns to page
		const activeElement = document.activeElement;
		if (activeElement && activeElement.tagName !== 'INPUT') {
			const emailInput = document.querySelector('#email');
			if (emailInput && !emailInput.value) {
				setTimeout(() => emailInput.focus(), 100);
			}
		}
	}
});