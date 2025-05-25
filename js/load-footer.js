// /js/load-footer.js
function loadFooter() {
    fetch('partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
            
            // Actualizar el año automáticamente
            const yearElement = document.getElementById('current-year');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        })
        .catch(error => {
            console.error('Error al cargar el footer:', error);
            // Footer de respaldo
            document.body.insertAdjacentHTML('beforeend', `
                <footer class="global-footer">
                    <div class="container">
                        <p>&copy; ${new Date().getFullYear()} Iglesia Jabes. Todos los derechos reservados.</p>
                    </div>
                </footer>
            `);
        });
}

// Esperar a que el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}