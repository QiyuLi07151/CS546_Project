document.addEventListener('DOMContentLoaded', async(e) => {
    e.preventDefault();
    try{
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
            for(let n = 0; n < allTags.length; n++){
                const tagli = document.createElement('li');
                const tagButton = document.createElement('a');
                tagButton.textContent = allTags[n].TagName;
                tagButton.href = "/tag/tagName?tagName=" + allTags[n].TagName;
                tagli.appendChild(tagButton);
                tags_list.appendChild(tagli);
            }
        } else {
            let errorDiv = document.getElementById('no_tags');
            errorDiv.hidden = false;
        }
    }catch(e){
        let errorDiv = document.getElementById('no_tags');
        errorDiv.hidden = false;
    }

});