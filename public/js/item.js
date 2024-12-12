document.addEventListener('DOMContentLoaded', async(e) => {
    e.preventDefault();
    try{
        let query = new URLSearchParams(window.location.search);
        let itemId = query.get("itemId");
        let queryString = "/item/itemId?itemId=" + itemId;
        const response = await fetch(queryString, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        let item = await response.json();

        const itemNameDiv = document.getElementById('item_name');
        let itemName = document.createElement('h2');
        itemName.textContent = item.Name;
        itemNameDiv.appendChild(itemName);

        const itemDescDiv = document.getElementById('item_desc');
        let itemDesc = document.createElement('p');
        itemDesc.textContent = item.Description;
        itemDescDiv.appendChild(itemDesc);

        const itemTagsDiv = document.getElementById('item_tags');
        for(let n = 0; n < item.Tags.length; n++){
            let itemTagsLi = document.createElement('li');
            let itemTag = document.createElement('a');
            itemTagsLi.className = 'tag_li';
            itemTag.className = 'tag_name';
            itemTag.textContent = item.Tags[n];
            itemTag.href = "/tag/tagName?tagName=" + item.Tags[n];
            itemTagsLi.appendChild(itemTag);
            itemTagsDiv.appendChild(itemTagsLi);
        }
    }catch(e){
        console.log('you done fucked up')
    }

});