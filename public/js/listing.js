const homeUrl = window.location.origin;
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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        let query = new URLSearchParams(window.location.search);
        if (query.has("itemName")) {
            let itemName = query.get("itemName");
            let responseItems = await fetch('/item/name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: itemName }),
            });
            let items = await responseItems.json();
            let searchList = document.getElementById("search_results");
            for (let n = 0; n < items.length; n++) {
                let itemDiv = document.createElement('li');
                let itemName = document.createElement('a');
                itemName.className = "listing_item_name";
                itemName.href = `/item.html?itemId=${items[n]._id.toString()}`;
                itemName.textContent = items[n].Name;
                itemDiv.appendChild(itemName);
                if (items[n].Image) {
                    let itemImage = document.createElement("img");
                    itemImage.src = items[n].Image;
                    // itemImage.alt = items[n].Name;
                    itemDiv.appendChild(itemImage);
                }
                let itemTagsDiv = document.createElement('ul');
                items[n].Tags.forEach(tag => {
                    let tagLink = document.createElement('a');
                    tagLink.textContent = tag;
                    tagLink.href = `/listing.html?tagName=${tag}`;
                    itemTagsDiv.appendChild(tagLink);
                });
                itemDiv.appendChild(itemTagsDiv);
                let itemDesc = document.createElement("h4");
                itemDesc.textContent = items[n].Description;
                let itemRating = document.createElement("h4");
                itemRating.textContent = items[n].Avg_rating;
                itemDiv.appendChild(itemDesc);
                itemDiv.appendChild(itemRating);
                searchList.appendChild(itemDiv);
            }
        } else if (query.has("tagName")) {
            let tagName = query.get("tagName");
            let tagQuery = "/tag/tagName?tagName=" + tagName;
            const response = await fetch(tagQuery, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            let items = await response.json();
            let searchList = document.getElementById("search_results");
            for (let n = 0; n < items.length; n++) {
                let itemDiv = document.createElement('li');
                let itemName = document.createElement('a');
                itemName.className = "listing_item_name";
                // itemName.href = homeUrl + "/item.html?itemId=" + items[n]._id.toString();
                // console.log("items[n]._id.toString():" + items[n]._id.toString());
                itemName.href = `/item.html?itemId=${items[n]._id.toString()}`;
                // console.log("itemName.href:" + itemName.href);
                itemName.textContent = items[n].Name;
                itemDiv.appendChild(itemName);
                if (items[n].Image) {
                    let itemImage = document.createElement("img");
                    itemImage.src = items[n].Image;
                    // itemImage.alt = items[n].Name;
                    itemDiv.appendChild(itemImage);
                }
                let itemTagsDiv = document.createElement('ul');
                items[n].Tags.forEach(tag => {
                    let tagLink = document.createElement('a');
                    tagLink.textContent = tag;
                    tagLink.href = `/listing.html?tagName=${tag}`;
                    itemTagsDiv.appendChild(tagLink);
                });
                itemDiv.appendChild(itemTagsDiv);
                let itemDesc = document.createElement("h4");
                itemDesc.textContent = items[n].Description;
                let itemRating = document.createElement("h4");
                itemRating.textContent = items[n].Avg_rating;
                itemDiv.appendChild(itemDesc);
                itemDiv.appendChild(itemRating);
                searchList.appendChild(itemDiv);
            }
        } else {
            console.log('Wrong parameter passed');
        }

    } catch (error) {
        console.error('Error fetching item:', error);
    }
});
