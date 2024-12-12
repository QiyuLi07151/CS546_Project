let searchForm = document.getElementById('search_form');
let searchText = document.getElementById("text_search");
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try{
        let nameSearch = searchText.value;
        let homeUrl = window.location.origin;
        let searchUrl = homeUrl + "/listing.html?itemName=" + nameSearch;
        window.location = searchUrl;
    }catch (e){
        console.error('Error:', e);
    }
});