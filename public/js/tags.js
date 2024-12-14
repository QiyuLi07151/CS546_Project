document.addEventListener('DOMContentLoaded', async function () {
    let currentUser = document.getElementById("current_user");
    let logout_button = document.getElementById("logout_button");
    let login_button = document.getElementById("login_button");
    let signup_button = document.getElementById("signup_button");
    let add_item = document.getElementById("add_item");

    if (localStorage.getItem("username") != "null") {
        currentUser.hidden = false;
        currentUser.innerHTML = "Welcome, " + localStorage.getItem("username");
        logout_button.hidden = false;
        login_button.hidden = true;
        signup_button.hidden = true;
    }
    let isOwner = false;
    try {
        const response = await fetch('/user/currentUserIsOwner');
        const data = await response.json();
        isOwner = data.isOwner;
    } catch (error) {
        alert('Failed to get user ID, please make sure you are logged in.');
        return;
    }
    if (isOwner) {
        add_item.hidden = false;
    }

    document.getElementById("logout_button").addEventListener('click', async (e) => {
        e.preventDefault();

        const response = await fetch('/logout', {
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
        add_item.hidden = true;
    });
});

document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();
    try {
        let response = await fetch('/tag/allTags', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        let allTags = await response.json();
        if (allTags.length > 0) {
            let errorDiv = document.getElementById('no_tags');
            errorDiv.hidden = true;
            const tags_list = document.getElementById('tags_list');

            for (let n = 0; n < allTags.length; n++) {
                const tagCard = document.createElement('li');
                const tagName = document.createElement('a');
                tagCard.className = 'tag_card';
                tagName.className = 'tag_name';
                tagName.textContent = allTags[n].TagName;
                tagName.href = "/listing.html?tagName=" + allTags[n].TagName;
                tagCard.appendChild(tagName);
                tags_list.appendChild(tagCard);
            }
        } else {
            let errorDiv = document.getElementById('no_tags');
            errorDiv.hidden = false;
        }
    } catch (e) {
        let errorDiv = document.getElementById('no_tags');
        errorDiv.hidden = false;
        console.error('Error fetching tags:', e);
    }
});