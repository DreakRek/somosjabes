document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Cambiar slide cada 5 segundos
    setInterval(nextSlide, 4000);
    
    // Iniciar con el primer slide activo
    slides[0].classList.add('active');
});