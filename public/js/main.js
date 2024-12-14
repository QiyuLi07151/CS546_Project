
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


document.addEventListener("DOMContentLoaded", () => {
    const tagInput = document.getElementById("tagInput");
    const tagSuggestions = document.getElementById("tagSuggestions");

    // Function to fetch tags from the server
    const fetchTags = async (query) => {
        try {
            const response = await fetch("/tag/tags", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tagName: query }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch tags.");
            }

            return await response.json(); // Parse JSON response
        } catch (error) {
            console.error("Error fetching tags:", error.message);
            return [];
        }
    };

    // Function to update the suggestions list
    const updateSuggestions = (tags) => {
        tagSuggestions.innerHTML = ""; // Clear previous suggestions

        if (tags.length === 0) {
            const noResultItem = document.createElement("li");
            noResultItem.textContent = "No tags found.";

            tagSuggestions.appendChild(noResultItem);
            return;
        }

        tags.forEach((tag) => {
            const listItem = document.createElement("li");
            listItem.textContent = tag.TagName; // Display TagName from the fetched data
            tagSuggestions.appendChild(listItem);

            // Add click event for selecting a tag
            listItem.addEventListener("click", () => {
                tagInput.value = tag.TagName;
                tagSuggestions.innerHTML = ""; // Clear suggestions after selection
            });
        });
    };

    // Event listener for input changes
    tagInput.addEventListener("input", async (event) => {
        const query = event.target.value.trim();

        if (query.length > 0) {
            const tags = await fetchTags(query); // Fetch matching tags
            updateSuggestions(tags); // Update suggestions
        } else {
            tagSuggestions.innerHTML = ""; // Clear suggestions if input is empty
        }
    });
});
