const homeUrl = window.location.origin;
document.addEventListener('DOMContentLoaded', async () => {
    try {
        let query = new URLSearchParams(window.location.search);
        if(query.has("itemName")){
            let itemName = query.get("itemName");
            let nameQuery = "/item/name?name=" + itemName;
            const response = await fetch(nameQuery, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            let items = await response.json();
            let searchList = document.getElementById("search_results");
            for(let n = 0; n < items.length; n++){
                let itemDiv = document.createElement('li');
                let itemName = document.createElement('a');
                itemName.className = "listing_item_name";
                itemName.href = homeUrl + "/item.html?itemId=" + items[n]._id.toString();
                itemName.textContent = items[n].name;
                itemDiv.appendChild(itemName);
                if(items[n].Image){
                    let itemImage = document.createElement("img");
                    itemImage.src = items[n].Image;
                    itemImage.alt = items[n].Name;
                    itemDiv.appendChild(itemImage);
                }
                let itemTagsDiv = document.createElement('ul');
                items[n].Tags.forEach(tag => {
                    let tagLink = document.createElement('a');
                    tagLink.textContent = tag;
                    tagLink.href = `/tag/tagName?tagName=${tag}`;
                    itemTagsDiv.appendChild(tagLink);
                });
                itemDiv.appendChild(itemTagsDiv);
                let itemDesc = document.createElement("h4");
                itemDesc.textContent = items[n].Description;
                itemDiv.appendChild(itemDesc);
                searchList.appendChild(itemDiv);
            }
        }else if(query.has("tagName")){
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
            for(let n = 0; n < items.length; n++){
                let itemDiv = document.createElement('li');
                let itemName = document.createElement('a');
                itemName.className = "listing_item_name";
                itemName.href = homeUrl + "/item.html?itemId=" + items[n]._id.toString();
                itemName.textContent = items[n].name;
                itemDiv.appendChild(itemName);
                if(items[n].Image){
                    let itemImage = document.createElement("img");
                    itemImage.src = items[n].Image;
                    itemImage.alt = items[n].Name;
                    itemDiv.appendChild(itemImage);
                }
                let itemTagsDiv = document.createElement('ul');
                items[n].Tags.forEach(tag => {
                    let tagLink = document.createElement('a');
                    tagLink.textContent = tag;
                    tagLink.href = `/tag/tagName?tagName=${tag}`;
                    itemTagsDiv.appendChild(tagLink);
                });
                itemDiv.appendChild(itemTagsDiv);
                let itemDesc = document.createElement("h4");
                itemDesc.textContent = items[n].Description;
                itemDiv.appendChild(itemDesc);
                searchList.appendChild(itemDiv);
            }
        }else{
            console.log('Wrong parameter passed');
        }

    } catch (error) {
        console.error('Error fetching item:', error);
    }
});