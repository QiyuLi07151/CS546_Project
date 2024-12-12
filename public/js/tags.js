document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();
    try {
        let response = await fetch('/tag/allTags', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        let allTags = await response.json();
        if (allTags.length > 0) {
            let errorDiv = document.getElementById('no_tags');
            errorDiv.hidden = true;
            const tags_list = document.getElementById('tags_list');

            for (let n = 0; n < allTags.length; n++) {
                const tagCard = document.createElement('li');
                const tagName = document.createElement('a');
                tagCard.className = 'tag_card';
                tagName.className = 'tag_name';
                tagName.textContent = allTags[n].TagName;
                tagName.href = "/tag/tagName?tagName=" + allTags[n].TagName;
                tagCard.appendChild(tagName);
                tags_list.appendChild(tagCard);
            }
        } else {
            let errorDiv = document.getElementById('no_tags');
            errorDiv.hidden = false;
        }
    } catch (e) {
        let errorDiv = document.getElementById('no_tags');
        errorDiv.hidden = false;
        console.error('Error fetching tags:', e);
    }
});