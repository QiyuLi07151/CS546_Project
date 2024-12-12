

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
        item.Tags.forEach(tag => {
            let tagLink = document.createElement('a');
            tagLink.textContent = tag;
            tagLink.href = `/tag/tagName?tagName=${tag}`;
            itemTagsDiv.appendChild(tagLink);
        });

    
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

          
            if (review.Review.length > 50) {
                reviewContentDiv.style.maxHeight = '60px'; 
                reviewContentDiv.style.overflow = 'hidden';
                reviewContentDiv.style.transition = 'max-height 0.3s ease';

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

            
            let ratingDiv = document.createElement('div');
            ratingDiv.classList.add('review_rating');
            ratingDiv.innerHTML = createStars(review.Rating);

            reviewLi.appendChild(userIdDiv);
            reviewLi.appendChild(reviewContentDiv);
            reviewLi.appendChild(ratingDiv);
            reviewsList.appendChild(reviewLi);
        }

        // 生成星星评分的函数
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
