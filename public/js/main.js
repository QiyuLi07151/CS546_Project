document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Signup form submitted');
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const passwordCheck = document.getElementById('passwordCheck').value;

        if (password !== passwordCheck) {
            alert('Passwords do not match. Please try again.');
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
                alert(data.message || 'Signup successful!');
                window.location.href = '/';
            } else {
                alert(data.error || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

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
                alert(data.message);
                window.location.href = '/';
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});
