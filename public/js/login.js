document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Tooltip display helper
    const showTooltip = (input, message) => {
        let tooltip = input.parentElement.querySelector('.tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            input.parentElement.appendChild(tooltip);
        }
        tooltip.textContent = message;
    };

    const removeTooltip = (input) => {
        const tooltip = input.parentElement.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    };

    // Event listeners for tooltips
    usernameInput.addEventListener('focus', () => {
        showTooltip(usernameInput, 'Username must be 5-15 alphanumeric characters.');
    });
    usernameInput.addEventListener('blur', () => {
        removeTooltip(usernameInput);
    });

    passwordInput.addEventListener('focus', () => {
        showTooltip(
            passwordInput,
            'Password must be at least 8 characters long, include one uppercase letter, one digit, one special character, and have no spaces.'
        );
    });
    passwordInput.addEventListener('blur', () => {
        removeTooltip(passwordInput);
    });

    // Error display helper
    const displayError = (form, message) => {
        let errorDiv = form.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.classList.add('error-message');
            form.prepend(errorDiv);
        }
        errorDiv.textContent = message;
    };

    const clearError = (form) => {
        const errorDiv = form.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    };

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearError(loginForm);

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // Validate inputs
        if (!/^[a-zA-Z0-9]{5,15}$/.test(username)) {
            displayError(loginForm, 'Username must be 5-15 alphanumeric characters.');
            return;
        }
        if (
            password.length < 8 ||
            !/[A-Z]/.test(password) ||
            !/[0-9]/.test(password) ||
            !/[^a-zA-Z0-9]/.test(password) ||
            /\s/.test(password)
        ) {
            displayError(
                loginForm,
                'Password must be at least 8 characters long, with one uppercase letter, one digit, one special character, and no spaces.'
            );
            return;
        }

        try {
            const response = await fetch('/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Name: username, Password: password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('username', username);
                localStorage.setItem('role', data.role);
                alert(data.message);
                
                window.location.href = '/';
            } else {
                displayError(loginForm, data.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            displayError(loginForm, 'An error occurred. Please try again.');
        }
    });
});
