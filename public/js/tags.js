document.addEventListener('DOMContentLoaded', () => {
    fetch('/tags')
        .then(allTags => {
            const tags_list = document.getElementById('tags_list');
            allTags.forEach(tag=>{
                const tagli = document.createElement('li');
                const tagButton = document.createElement('a');
                tagButton.textContent = tag.TagName;
                tagButton.href = "/tagName/${tag.TagName}";
                tagli.appendChild(tagButton);
                tags_list.appendChild(tagli);
            });
        })
        .catch(e => {
            let errorDiv = document.getElementById('no_tags');
            no_tags.hidden = false;
        });
});