
document.addEventListener('DOMContentLoaded', function () {
    let currentUser = document.getElementById("current_user");
    let logout_button = document.getElementById("logout_button");
    let login_button = document.getElementById("login_button");
    let signup_button = document.getElementById("signup_button");

    if(localStorage.getItem("username") != "null"){
        currentUser.hidden = false;
        currentUser.innerHTML = localStorage.getItem("username");
        logout_button.hidden = false;
        login_button.hidden = true;
        signup_button.hidden = true;
    }
    document.getElementById("logout_button").addEventListener('click', async (e) => {
        e.preventDefault();

        //this part does not delete session, needs a look
        const response = await fetch('/user/login', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        window.location.href = '/';
        localStorage.setItem("username", null);
        currentUser.hidden = true;
        logout_button.hidden = true;
        login_button.hidden = false;
        signup_button.hidden = false;
    });
});
