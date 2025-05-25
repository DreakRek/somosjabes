class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    // Configuración del observer
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: this.calculateThreshold()
    };

    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), options);
    this.observeElements();
    this.setupResizeListener();
  }

  calculateThreshold() {
    // Ajusta el threshold según el tamaño de la pantalla
    return window.innerWidth < 768 ? 0.1 : 0.2;
  }

  handleIntersect(entries) {
    entries.forEach(entry => {
      const element = entry.target;
      
      if (entry.isIntersecting) {
        element.classList.add('in-view');
        element.classList.remove('out-of-view');
      } else {
        // Solo aplica el efecto de salida si ya estaba visible
        if (element.classList.contains('in-view')) {
          element.classList.add('out-of-view');
        }
      }
    });
  }

  observeElements() {
    document.querySelectorAll('[data-scroll]').forEach(el => {
      this.observer.observe(el);
    });
  }

  setupResizeListener() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.observer.disconnect();
        this.init();
      }, 250);
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new ScrollAnimations();
  
  // Animación inicial para el hero
  const heroContent = document.querySelector('.slide-content');
  if (heroContent) {
    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 300);
  }
});