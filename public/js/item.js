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

        const userName = localStorage.getItem("username");


        // get userId
        let userId;
        const responseId = await fetch("/user/getUserIdByName?userName=" + userName, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (responseId.ok) {
            let data = await responseId.json();
            userId = data.userId;
        } else {
            console.error('Failed to fetch user ID:', responseId.statusText);
        }



        // display item info
        const itemImageDiv = document.getElementById('item_image');
        if (item.Image) {
            let itemImage = document.createElement('img');
            itemImage.src = item.Image;
            itemImage.alt = item.Name;
            itemImageDiv.appendChild(itemImage);
        }

        const itemNameDiv = document.getElementById('item_name');
        let itemName = document.createElement('h2');
        itemName.textContent = item.Name;
        itemNameDiv.appendChild(itemName);

        const itemDescDiv = document.getElementById('item_desc');
        let itemDesc = document.createElement('p');
        itemDesc.textContent = item.Description;
        itemDescDiv.appendChild(itemDesc);



        // tag part

        item.Tags.forEach(async tag => {



            let responseTag = await fetch('/tag/tags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tagName: tag }),
            });

            let tagData = await responseTag.json();

            let targetTagName = tagData.find(t => t.TagName === tag);
            let tagId = targetTagName ? targetTagName._id : null;

            let responseUpVote = await fetch('/tag/currentUpvote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, itemId, tagId }),
            });
            let voteData = await responseUpVote.json();
            let upvoteCount = voteData.message.UpvoteCount;
            let hasUpvoted = voteData.hasUpvoted;

            let tagElement = document.createElement('div');
            tagElement.className = 'tag-item';

            let tagLink = document.createElement('a');
            tagLink.textContent = `${tag} (${upvoteCount})`;
            tagLink.href = `/listing.html?tagName=${tag}`;
            tagElement.appendChild(tagLink);

            let voteButton = document.createElement('button');
            updateVoteButton(voteButton, hasUpvoted);

            voteButton.addEventListener('click', async () => {
                let response = await fetch('/tag/upvoteTags', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, itemId, tagId }),
                });
                let newVoteData = await response.json();
                upvoteCount = newVoteData.message.UpvoteCount;
                hasUpvoted = newVoteData.hasUpvoted;

                tagLink.textContent = `${tag} (${upvoteCount})`;
                updateVoteButton(voteButton, hasUpvoted);
            });

            tagElement.appendChild(voteButton);
            itemTagsDiv.appendChild(tagElement);
            // let tagLink = document.createElement('a');
            // tagLink.textContent = tag;
            // tagLink.href = `/tag/tagName?tagName=${tag}`;
            // itemTagsDiv.appendChild(tagLink);
        });


        function updateVoteButton(button, hasUpvoted) {
            button.textContent = hasUpvoted ? 'hasUpvoted' : 'hasNotUpvoted';
            button.className = hasUpvoted ? 'upvoted' : 'not-upvoted';
        }

        // recommendation part
        let itemData = [];
        const itemTagsDiv = document.getElementById('item_tags');

        let responseFavorite = await fetch('/user/currentFavorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, itemId }),
        });
        let favoriteData = await responseFavorite.json();
        let hasFavorited = favoriteData.hasFavorited;

        const itemWishDiv = document.getElementById('item_wish');
        let itemWish = document.createElement('button');
        updateFavoriteItemButton(itemWish, hasFavorited);

        itemWish.addEventListener('click', async () => {
            let response = await fetch('/user/updateFavoriteItem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, itemId }),
            });
            let newFavoriteData = await response.json();
            hasFavorited = newFavoriteData.hasFavorited;

            // tagLink.textContent = `${tag} (${upvoteCount})`;
            updateFavoriteItemButton(itemWish, hasFavorited);
        });
        // itemDesc.textContent = item.Description;
        itemWishDiv.appendChild(itemWish);

        function updateFavoriteItemButton(button, hasFavorited) {
            button.textContent = hasFavorited ? 'hasFavorited' : 'hasNotFavorited';
            button.className = hasFavorited ? 'Favorited' : 'not-Favorited';
        }

        try {
            const response = await fetch('/tag/tagNames', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tagNames: item.Tags })
            });

            if (response.ok) {
                itemData = await response.json();


            }
        } catch (error) {
            console.error('There is a error when you make a review:', error);

        }
        // console.log(itemData);


        const recommendationList = document.getElementById('recommendation_list');


        itemData.forEach((recItem) => {

            let card = document.createElement('div');
            card.classList.add('recommend_card');

            let recImg = document.createElement('img');
            recImg.src = recItem.Image;
            recImg.alt = recItem.Name || 'Recommendation';

            recImg.style.width = "200px";
            recImg.style.height = "auto";


            let recName = document.createElement('div');
            recName.classList.add('recommend_name');
            recName.textContent = recItem.Name;


            card.appendChild(recImg);
            card.appendChild(recName);

            card.addEventListener('mouseover', () => {
                recName.style.display = 'block';
            });

            card.addEventListener('mouseout', () => {
                recName.style.display = 'none';
            });


            card.addEventListener('click', () => {
                window.location.href = `/item.html/?itemId=${recItem._id}`;
            });

            recommendationList.appendChild(card);
        });
        // review list part
        const reviewsList = document.getElementById('reviews_list');
        for (const review of item.Reviews) {
            let reviewLi = document.createElement('li');
            reviewLi.classList.add('review_item');

            let queryUser = `/user/userId?userId=${review.UserId}`;
            const userResponse = await fetch(queryUser, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            let user = await userResponse.json();

            let userIdDiv = document.createElement('div');
            userIdDiv.classList.add('review_user');
            userIdDiv.textContent = `${user.Name || 'Unknown User'}`;

            let reviewContentDiv = document.createElement('div');
            reviewContentDiv.classList.add('review_content');
            reviewContentDiv.textContent = review.Review;

            reviewContentDiv.style.maxHeight = '60px';
            reviewContentDiv.style.overflow = 'hidden';

            requestAnimationFrame(() => {
                if (reviewContentDiv.scrollHeight > reviewContentDiv.clientHeight) {
                    let toggleButton = document.createElement('button');
                    toggleButton.classList.add('toggle_button');
                    toggleButton.textContent = 'Read more';

                    toggleButton.addEventListener('click', () => {
                        if (reviewContentDiv.style.maxHeight === '60px') {
                            reviewContentDiv.style.maxHeight = 'none';
                            toggleButton.textContent = 'Read less';
                        } else {
                            reviewContentDiv.style.maxHeight = '60px';
                            toggleButton.textContent = 'Read more';
                        }
                    });

                    reviewLi.appendChild(toggleButton);
                }
            });

            let ratingDiv = document.createElement('div');
            ratingDiv.classList.add('review_rating');
            ratingDiv.innerHTML = createStars(review.Rating) +
                `<span class="rating_value">${review.Rating}</span>`;

            reviewLi.appendChild(userIdDiv);
            reviewLi.appendChild(reviewContentDiv);
            reviewLi.appendChild(ratingDiv);

            if (review.UserId === userId) {
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.classList.add('edit_button');
                editBtn.addEventListener('click', () => {

                    // editModal.style.display = 'block';
                    editModal.classList.add('show');


                    editTextarea.value = review.Review;
                    editRating.value = review.Rating;


                });

                reviewLi.appendChild(editBtn);
            }

            reviewsList.appendChild(reviewLi);
        }

        // add review part

        let make_review_rating = document.getElementById("make_review_rating");
        make_review_rating.hidden = false;
        if (localStorage.getItem("role") == "Seller") {
            make_review_rating.hidden = true;
        }
        else if (localStorage.getItem("role") == "Buyer") {
            // if buyer already left a review

            const params = new URLSearchParams({ itemId, userName });

            let queryUser = `/user/isMadeReview?${params.toString()}`;
            const userResponse = await fetch(queryUser, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            let res = await userResponse.json();
            // console.log(res);

            if (res.isMadeReview) {
                make_review_rating.hidden = true;
            }
        }

        const reviewForm = document.getElementById('reviewForm');
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!confirm("Are you sure you want to submit this review?")) {
                return; 
            }
            const review = document.getElementById('review').value;
            const rating = document.getElementById('rating').value;

            if (parseFloat(rating) > 5) {
                alert('Rating cannot exceed 5.0');
                return;
            }
            const payload = {
                userId,
                itemId,
                review,
                rating
            };

            try {
                const response = await fetch('/item/addReviewAndRating', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('make a review successfully');
                    location.reload();

                } else {
                    const error = await response.json();
                    alert(`make review failed: ${error.error}`);
                }
            } catch (error) {
                console.error('There is a error when you make a review:', error);

            }
        });




        // edit review modal
        const editModal = document.getElementById('editModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const editReviewForm = document.getElementById('editReviewForm');
        const editTextarea = document.getElementById('editTextarea');
        const editRating = document.getElementById('editRating');
        const submitEditBtn = document.getElementById('submitEditBtn');
        const deleteReviewBtn = document.getElementById('deleteReviewBtn');


        function closeModal() {
            // editModal.style.display = 'none';
            editModal.classList.remove('show');
        }


        closeModalBtn.addEventListener('click', closeModal);


        window.addEventListener('click', (event) => {
            if (event.target === editModal) {
                closeModal();


            }

        });

        let currentReviewPayload = { userId, itemId };

        submitEditBtn.addEventListener('click', async () => {
            if (!confirm("Are you sure you want to submit changes to this review?")) {
                return; 
            }
            const review = editTextarea.value;
            const rating = editRating.value;

            if (parseFloat(rating) > 5) {
                alert('Rating cannot exceed 5.0');
                return;
            }


            const payload = {
                userId: currentReviewPayload.userId,
                itemId: currentReviewPayload.itemId,
                review,
                rating
            };
            // console.log(payload);
            
            try {
                const response = await fetch('/item/modifyReviewAndRating', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert('Edit review successfully');
                    closeModal();
                    location.reload();
                } else {
                    const error = await response.json();
                    alert(`Edit review failed: ${error.error}`);
                }
            } catch (error) {
                console.error('Error editing review:', error);
            }
        });
        deleteReviewBtn.addEventListener('click', async () => {

            if (!confirm("Are you sure you want to delete this review?")) {
                return; 
            }

            const payload = {
                userId: currentReviewPayload.userId,
                itemId: currentReviewPayload.itemId

            };

            try {
                const response = await fetch('/item/deleteReviewAndRating', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert('Delete review successfully');
                    closeModal();
                    location.reload();
                } else {
                    const error = await response.json();
                    alert(`Delete review failed: ${error.error}`);
                }
            } catch (error) {
                console.error('Error deleting review:', error);
            }
        });




        function createStars(rating) {
            let fullStar = '<span class="star filled">★</span>';
            let emptyStar = '<span class="star">☆</span>';
            let starsHTML = '';

            for (let i = 0; i < 5; i++) {
                starsHTML += i < rating ? fullStar : emptyStar;
            }
            return starsHTML;
        }
    } catch (error) {
        console.error('Error fetching item:', error);
    }
});
