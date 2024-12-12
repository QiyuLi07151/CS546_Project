document.addEventListener('DOMContentLoaded', async () => {
    try {
        let query = new URLSearchParams(window.location.search);
        let itemId = query.get("itemId");
        let queryString = "/item/itemId?itemId=" + itemId;
        const response = await fetch(queryString, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        let item = await response.json();

        // Add item image
        const itemImageDiv = document.getElementById('item_image');
        if (item.ImageUrl) {
            let itemImage = document.createElement('img');
            itemImage.src = item.ImageUrl;
            itemImage.alt = item.Name;
            itemImageDiv.appendChild(itemImage);
        }

        // Add item name
        const itemNameDiv = document.getElementById('item_name');
        let itemName = document.createElement('h2');
        itemName.textContent = item.Name;
        itemNameDiv.appendChild(itemName);

        // Add item description
        const itemDescDiv = document.getElementById('item_desc');
        let itemDesc = document.createElement('p');
        itemDesc.textContent = item.Description;
        itemDescDiv.appendChild(itemDesc);

        // Add tags
        const itemTagsDiv = document.getElementById('item_tags');
        item.Tags.forEach(tag => {
            let tagLink = document.createElement('a');
            tagLink.textContent = tag;
            tagLink.href = `/tag/tagName?tagName=${tag}`;
            itemTagsDiv.appendChild(tagLink);
        });

        // Add reviews (mockup for demo)
        const reviewsList = document.getElementById('reviews_list');
        item.Reviews.forEach(review => {
            let reviewLi = document.createElement('li');
            reviewLi.textContent = review;
            reviewsList.appendChild(reviewLi);
        });
    } catch (error) {
        console.error('Error fetching item:', error);
    }
});
