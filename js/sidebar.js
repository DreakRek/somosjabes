document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const menuBtn = document.querySelector('.menu-btn');
    const closeBtn = document.querySelector('.close-btn');
    
    // Solo agregar event listeners si el botón de menú existe (en móvil)
    if(menuBtn) {
        menuBtn.addEventListener('click', function() {
            sidebar.classList.add('active');
        });
    }
    
    if(closeBtn) {
        closeBtn.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    }
    
    // Cerrar sidebar al hacer clic en un enlace (solo en móvil)
    const navLinks = document.querySelectorAll('.sidebar nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if(window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
});