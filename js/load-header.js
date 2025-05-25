// /js/load-header.js
document.addEventListener('DOMContentLoaded', function() {
    // Cargar el header
    fetch('partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            
            // Inicializar funcionalidad del sidebar
            const sidebar = document.querySelector('.sidebar');
            const menuBtn = document.querySelector('.menu-btn');
            const closeBtn = document.querySelector('.close-btn');
            
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
        })
        .catch(error => {
            console.error('Error al cargar el header:', error);
            // Header de respaldo
            document.body.insertAdjacentHTML('afterbegin', `
                <header class="global-header">
                    <h1>Iglesia Jabes</h1>
                    <nav>
                        <a href="index.html">Inicio</a>
                        <a href="galeria.html">Galería</a>
                        <a href="directivos.html">Directivos</a>
                    </nav>
                </header>
            `);
        });
});