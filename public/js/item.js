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

        const reviewForm = document.getElementById('reviewForm');
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const review = document.getElementById('review').value;
            const rating = document.getElementById('rating').value;

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

                } else {
                    const error = await response.json();
                    alert(`make review failed: ${error.error}`);
                }
            } catch (error) {
                console.error('There is a error when you make a review:', error);

            }
        });


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

        const itemTagsDiv = document.getElementById('item_tags');
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
            tagLink.href = `/tag/tagName?tagName=${tag}`;
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
            ratingDiv.innerHTML = createStars(review.Rating) + `<span class="rating_value">${review.Rating}</span>`;


            reviewLi.appendChild(userIdDiv);
            reviewLi.appendChild(reviewContentDiv);
            reviewLi.appendChild(ratingDiv);
            reviewsList.appendChild(reviewLi);
        }


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
