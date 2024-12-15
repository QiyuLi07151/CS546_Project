document.addEventListener("DOMContentLoaded", () => {
    const adForm = document.getElementById("addAdForm");
    const adContainer = document.getElementById("adContainer");

    const fetchAdvertisements = async () => {
        try {
            const response = await fetch("/advertisement.html");
            const { advertisements } = await response.json();

            adContainer.innerHTML = ""; 
            advertisements.forEach(ad => {
                const adElement = document.createElement("div");
                adElement.classList.add("ad");
                adElement.innerHTML = `
                    <img src="${ad.Image}" alt="${ad.Title}" />
                    <h3>${ad.Title}</h3>
                    <p>${ad.Description}</p>
                    <span><strong>Item Name:</strong> ${ad.ItemName}</span>
                `;
                adContainer.appendChild(adElement);
            });
        } catch (error) {
            console.error("Error fetching advertisements:", error);
        }
    };

    adForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
            Image: document.getElementById("Image").value,
            ItemName: document.getElementById("ItemName").value,
            Title: document.getElementById("Title").value,
            Description: document.getElementById("Description").value,
        };

        try {
            const response = await fetch("/user/addAd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Advertisement added successfully!");
                adForm.reset();
                fetchAdvertisements();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding advertisement:", error);
            alert("Failed to add advertisement.");
        }
    });

    fetchAdvertisements();
});
