document.addEventListener('DOMContentLoaded', async () => {
    try {
        const query = new URLSearchParams(window.location.search);
        const page = parseInt(query.get("page")) || 1;
        const itemName = query.get("itemName")?.trim();
        const tagName = query.get("tagName")?.trim();

        if (itemName) {
            await fetchAndRenderResults('/item/name', { name: itemName }, page);
        } else if (tagName) {
            await fetchAndRenderResults('/tag/tagName', { tagName: tagName }, page);
        } else {
            throw "Invalid query parameters.";
        }
    } catch (error) {
        displayError(error);
    }
});

async function fetchAndRenderResults(url, body, page) {
    try {
        const response = await fetch(`${url}?page=${page}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) throw "Failed to fetch search results.";

        const { items, totalPages, currentPage } = await response.json();
        renderSearchResults(items);
        renderPagination(totalPages, currentPage, body.name || body.tagName, url);
    } catch (error) {
        displayError(error);
    }
}

function renderSearchResults(items) {
    const resultsContainer = document.getElementById("text_search_results");
    resultsContainer.innerHTML = '';

    items.forEach(item => {
        const itemDiv = document.createElement('li');

        const itemName = document.createElement('a');
        itemName.className = "listing_item_name";
        itemName.href = `/item.html?itemId=${item._id}`;
        itemName.textContent = item.Name;
        itemDiv.appendChild(itemName);

        if (item.Image) {
            const itemImage = document.createElement("img");
            itemImage.src = item.Image;
            itemImage.style.width = "50px";
            itemDiv.appendChild(itemImage);
        }

        const itemDesc = document.createElement("p");
        itemDesc.textContent = `Description: ${item.Description || 'N/A'}`;
        const itemRating = document.createElement("p");
        itemRating.textContent = `Rating: ${item.Avg_rating || 0}`;

        itemDiv.appendChild(itemDesc);
        itemDiv.appendChild(itemRating);

        resultsContainer.appendChild(itemDiv);
    });
}

function renderPagination(totalPages, currentPage, query, url) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = '';

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationContainer.appendChild(pageInfo);

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => fetchAndRenderResults(url, { name: query }, currentPage - 1);
        paginationContainer.appendChild(prevButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => fetchAndRenderResults(url, { name: query }, currentPage + 1);
        paginationContainer.appendChild(nextButton);
    }
}

function displayError(error) {
    const errorContainer = document.getElementById("error");
    errorContainer.innerText = error;
    errorContainer.hidden = false;
}
