document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const passwordCheckInput = document.getElementById('passwordCheck');

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

    passwordCheckInput.addEventListener('focus', () => {
        showTooltip(passwordCheckInput, 'Please re-enter your password for confirmation.');
    });
    passwordCheckInput.addEventListener('blur', () => {
        removeTooltip(passwordCheckInput);
    });

    // Display error helper
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
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearError(signupForm);

        const username = usernameInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        const passwordCheck = passwordCheckInput.value;

        // Validate inputs
        if (!/^[a-zA-Z0-9]{5,15}$/.test(username)) {
            displayError(signupForm, 'Username must be 5-15 alphanumeric characters.');
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
                signupForm,
                'Password must be at least 8 characters long, with one uppercase letter, one digit, one special character, and no spaces.'
            );
            return;
        }
        if (password !== passwordCheck) {
            displayError(signupForm, 'Passwords do not match. Please try again.');
            return;
        }

        try {
            const response = await fetch('/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Name: username, Password: password, IsOwner: false }),
            });

            const data = await response.json();

            if (response.ok) {
                clearError(signupForm);
                const successDiv = document.createElement('div');
                successDiv.classList.add('success-message');
                successDiv.textContent = data.message || 'Signup successful!';
                signupForm.appendChild(successDiv);
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                displayError(signupForm, data.error || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            displayError(signupForm, 'An error occurred. Please try again.');
        }
    });
});
