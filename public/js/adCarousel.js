document.addEventListener('DOMContentLoaded', async () => {
    const adImagesContainer = document.getElementById('adImages');
    const adDotsContainer = document.getElementById('adDots');

    try {
        const response = await fetch('/user/advertisements', { method: 'GET' });
        const { advertisements } = await response.json();

        if (advertisements && advertisements.length > 0) {
            advertisements.forEach((ad, index) => {
                createAdSlide(ad, index);
                createAdDot(index);
            });

            startAdCarousel();
        } else {
            showError('No advertisements found.');
        }
    } catch (error) {
        console.error('Failed to load advertisements:', error);
        showError('Failed to load advertisements. Please try again later.');
    }

    function createAdSlide(ad, index) {
        const adSlide = document.createElement('div');
        adSlide.classList.add('ad-slide');
        if (index === 0) adSlide.classList.add('active');

        adSlide.innerHTML = `
            <img src="${ad.Image}" alt="${ad.Title}" />
            <div class="ad-content">
                <h3>${ad.Title}</h3>
                <p>${ad.Description}</p>
                <span><strong>Item Name:</strong> ${ad.ItemName}</span>
            </div>
        `;

        adImagesContainer.appendChild(adSlide);
    }

    function createAdDot(index) {
        const dotElement = document.createElement('span');
        dotElement.classList.add('ad-dot');
        if (index === 0) dotElement.classList.add('active');
        dotElement.dataset.index = index;
        dotElement.addEventListener('click', () => setActiveSlide(index));
        adDotsContainer.appendChild(dotElement);
    }

    function setActiveSlide(index) {
        const slides = document.querySelectorAll('.ad-slide');
        const dots = document.querySelectorAll('.ad-dot');

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function startAdCarousel() {
        const slides = document.querySelectorAll('.ad-slide');
        const dots = document.querySelectorAll('.ad-dot');
        let currentIndex = 0;

        setInterval(() => {
            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');

            currentIndex = (currentIndex + 1) % slides.length;

            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }, 5000); // Switch every 5 seconds
    }

    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-message');
        errorElement.textContent = message;
        adImagesContainer.appendChild(errorElement);
    }
});
