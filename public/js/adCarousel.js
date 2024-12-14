document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.ad-slide');
    const dots = document.querySelectorAll('.ad-dot');
    let currentIndex = 0;
  
    function showSlide(index) {
      const totalSlides = slides.length;
      currentIndex = (index + totalSlides) % totalSlides;

      const offset = -currentIndex * 100;
      document.querySelector('.ad-images').style.transform = `translateX(${offset}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
  
    function nextSlide() {
      showSlide(currentIndex + 1);
    }
  
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => showSlide(i));
    });
  
    setInterval(nextSlide, 3000);
  
    showSlide(currentIndex);
  });
  