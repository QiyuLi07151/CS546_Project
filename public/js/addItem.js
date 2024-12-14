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

document.addEventListener('DOMContentLoaded', () => {
    const addItemForm = document.getElementById('addItemForm');

    addItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let id;
        try {
            const response = await fetch('/user/currentUserId');
            const data = await response.json();
            id = data.userId;
        } catch (error) {
            alert('Failed to get user ID, please make sure you are logged in.');
            return;
        }

        const formData = new FormData(addItemForm);

        const itemData = {
            ownerId: id,
            itemName: formData.get('itemName'),
            itemDesc: formData.get('itemDesc'),
            itemTags: formData.get('itemTags').split(',').map(tag => tag.trim()),
            itemPrice: parseFloat(formData.get('itemPrice')),
            itemImg: formData.get('itemImg'),
            itemStatus: formData.get('itemStatus') === 'true'
        };
        console.log("itemStatus1:" + itemData.itemStatus);
        // console.log("itemStatus2:" + itemData.itemStatus);
        try {
            const response = await fetch('/item/addItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            alert('Item added successfully');
            addItemForm.reset();
        } catch (error) {
            alert(`Item added failed:${error.message}`);
        }
    });
});
