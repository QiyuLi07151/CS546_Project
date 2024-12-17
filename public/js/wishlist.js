document.addEventListener("DOMContentLoaded", async function () {
    let currentUser = document.getElementById("current_user");
    let logout_button = document.getElementById("logout_button");
    let login_button = document.getElementById("login_button");
    let signup_button = document.getElementById("signup_button");

    // Handle user login state
    if (localStorage.getItem("username") !== "null") {
        currentUser.hidden = false;
        currentUser.innerHTML = "Welcome, " + localStorage.getItem("username");
        logout_button.hidden = false;
        login_button.hidden = true;
        signup_button.hidden = true;
    }

    // Logout functionality
    logout_button.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/logout", {
                method: "GET",
                credentials: "include", // Include cookies
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                localStorage.setItem("username", null);
                window.location.href = "/";
            } else {
                alert("Failed to log out.");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    });

    // Fetch wishlist items
    const wishlistContainer = document.getElementById("wishlist-container");
    const wishlistMessage = document.getElementById("wishlist-message");
    const wishlistItems = document.getElementById("wishlist-items");

    try {
        const response = await fetch("/user/wishlist", {
            method: "GET",
            credentials: "include", // Include cookies
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch wishlist. Please log in.");
        }

        const data = await response.json();

        if (data.length === 0) {
            wishlistMessage.textContent = "Your wishlist is empty.";
            return;
        }
        // console.log(data);
        
        wishlistMessage.style.display = "none";

        data.forEach((item) => {
            const listItem = document.createElement("li");
            listItem.className = "wishlist-item";

            listItem.innerHTML = `
                <div class="item">
                    <img src="${item.ImageUrl}" alt="${item.Name}" class="item-image">
                    <div class="item-details">
                        <a href="/item?itemId=${item._id.toString()}">${item.Name}</a>
                        <p>${item.Description}</p>
                        <p><strong>Price:</strong> $${item.Price}</p>
                    </div>
                </div>
            `;

            wishlistItems.appendChild(listItem);
        });
    } catch (error) {
        wishlistMessage.textContent = error.message;
    }
});
