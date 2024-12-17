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
        const query = new URLSearchParams(window.location.search);
        const page = parseInt(query.get("page")) || 1;
        const itemName = query.get("itemName")?.trim();
        const tagName = query.get("tagName")?.trim();

        if (itemName) {
            await fetchAndRenderResults('/item/name', { name: itemName }, page, 'POST');
        } else if (tagName) {
            await fetchAndRenderResults('/tag/tagName',{tagName: tagName}, page, 'GET');
        } else {
            throw "Invalid query parameters.";
        }
    } catch (error) {
        displayError(error);
    }
});

async function fetchAndRenderResults(url, body, page, method) {
    try {
        // const options = {
        //     method: method,
        //     headers: { 'Content-Type': 'application/json' },
        // };

        // if (method === 'POST') {
        //     options.body = JSON.stringify(body);
        // } else {
        //     url += `?${new URLSearchParams({ ...body, page }).toString()}`;
        // }
        if(method === 'POST'){
            let response;
            response = await fetch(`${url}?page=${page}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                const errorResponse = await response.json().catch(() => ({ error: "Failed to parse error response" }));;
                throw new Error(`Failed to fetch search results: ${JSON.stringify(errorResponse)}`);
            }
            const { items, totalPages, currentPage } = await response.json();
            renderSearchResultsItem(items);
            renderPagination(totalPages, currentPage, body.name || body.tagName, url, method);
        }else if(method === 'GET'){
            let response;
            url += `?tagName=${body.tagName}&page=${page}`;
            response = await fetch(url, {
                method: 'GET',
            });
            if (!response.ok) {
                const errorResponse = await response.json().catch(() => ({ error: "Failed to parse error response" }));;
                throw new Error(`Failed to fetch search results: ${JSON.stringify(errorResponse)}`);
            }
            const { items, totalPages, currentPage } = await response.json();
            renderSearchResultsItem(items);
            renderPagination(totalPages, currentPage, body.name || body.tagName, url, method);
        }

    } catch (error) {
        displayError(error);
    }
}

function renderSearchResultsItem(items) {
const resultsContainer = document.getElementById("text_search_results");
resultsContainer.innerHTML = '';

if (items.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
    return;
}

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


function renderSearchResultsTag(tags) {
    const searchList = document.getElementById("text_search_results");
    searchList.innerHTML = '';

    if (!tags || tags.length === 0) {
        searchList.innerHTML = '<p>No tags found.</p>';
        return;
    }

    tags.forEach(tag => {
        const tagDiv = document.createElement('li');

        const tagName = document.createElement('p');
        tagName.className = "tag_name";
        tagName.textContent = `Tag: ${tag.TagName}`;

        const tagLink = document.createElement('a');
        tagLink.href = `/listing.html?tagName=${tag.TagName}`;
        tagLink.textContent = 'View Items';

        tagDiv.appendChild(tagName);
        tagDiv.appendChild(tagLink);

        searchList.appendChild(tagDiv);
    });
}


function renderPagination(totalPages, currentPage, query, url, method) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = '';

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationContainer.appendChild(pageInfo);

    const queryParam = url.includes('/tag/tagName') ? { tagName: query } : { name: query };

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => fetchAndRenderResults(url, queryParam, currentPage - 1, method);
        paginationContainer.appendChild(prevButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => fetchAndRenderResults(url, queryParam, currentPage + 1, method);
        paginationContainer.appendChild(nextButton);
    }
}

function displayError(error) {
    const errorContainer = document.getElementById("error");
    errorContainer.innerText = error;
    errorContainer.hidden = false;
    document.getElementById("text_search_results").innerHTML = '';
    document.getElementById("pagination").innerHTML = '';
}
