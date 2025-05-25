// gallery.js
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Inicializar Swipers
    initSwipers();
    
    // Configurar lightbox mejorado
    setupLightbox();
    
    // Configurar navegación de galería
    setupGalleryNavigation();
    
    // Configurar animaciones al hacer scroll
    setupScrollAnimations();
    
    // Configurar efectos hover
    setupHoverEffects();
    
    // Configurar eventos de like
    setupLikeButtons();
    
    // Configurar scroll suave
    setupSmoothScrolling();
    
    // Configurar carga perezosa de imágenes
    setupLazyLoading();
});

// Inicializar todos los carruseles Swiper
function initSwipers() {
    // Carrusel destacado con efecto 3D
    const featuredSwiper = new Swiper('.featured-swiper', {
        loop: true,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        effect: 'creative',
        creativeEffect: {
            prev: {
                shadow: true,
                translate: [0, 0, -400],
            },
            next: {
                translate: ['100%', 0, 0],
            },
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            init: function() {
                // Mostrar overlay en el slide activo
                const activeSlide = this.slides[this.activeIndex];
                animateSlideOverlay(activeSlide, true);
            },
            slideChange: function() {
                // Ocultar overlays
                this.slides.forEach(slide => {
                    animateSlideOverlay(slide, false);
                });
                
                // Mostrar overlay en el nuevo slide activo
                setTimeout(() => {
                    const activeSlide = this.slides[this.activeIndex];
                    animateSlideOverlay(activeSlide, true);
                }, 100);
            }
        }
    });

    // Carrusel de eventos
    const eventsSwiper = new Swiper('.events-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        }
    });
    
    // Función para animar el overlay del slide
    function animateSlideOverlay(slide, show) {
        const overlay = slide.querySelector('.slide-overlay');
        if (!overlay) return;
        
        if (show) {
            overlay.style.opacity = '1';
            overlay.style.transform = 'translateY(0)';
            
            // Animar elementos internos
            const content = overlay.querySelector('.overlay-content');
            if (content) {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }
        } else {
            overlay.style.opacity = '0';
            overlay.style.transform = 'translateY(30px)';
            
            const content = overlay.querySelector('.overlay-content');
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px)';
            }
        }
    }
}

// Configurar el lightbox mejorado
function setupLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxDate = document.getElementById('lightbox-date');
    const lightboxViews = document.getElementById('lightbox-views');
    const likeCount = document.getElementById('like-count');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const imageCounter = document.getElementById('image-counter');
    const likeBtn = document.querySelector('.like-btn');
    const downloadBtn = document.querySelector('.download-btn');
    const loader = document.querySelector('.lightbox-loader');
    
    let currentImageIndex = 0;
    let images = [];
    let likedImages = JSON.parse(localStorage.getItem('likedImages')) || {};
    
    // Obtener todas las imágenes de la galería
    document.querySelectorAll('.masonry-item, .event-card').forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.querySelector('h3') ? item.querySelector('h3').textContent : '';
        const desc = item.querySelector('p') ? item.querySelector('p').textContent : '';
        const date = item.querySelector('.date') ? item.querySelector('.date').textContent : '';
        const views = item.querySelector('.likes') ? item.querySelector('.likes').textContent : '';
        
        if (img) {
            images.push({
                src: img.src,
                title: title,
                desc: desc,
                date: date,
                views: views,
                id: `img-${index}`
            });
            
            // Agregar evento de clic a cada imagen
            item.addEventListener('click', function(e) {
                // Evitar abrir lightbox si se hace clic en un enlace o botón
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
                    e.target.classList.contains('social-share') || 
                    e.target.classList.contains('fa-expand')) {
                    return;
                }
                
                currentImageIndex = index;
                openLightbox(currentImageIndex);
            });
            
            // Configurar botón de expandir
            const expandBtn = item.querySelector('.fa-expand');
            if (expandBtn) {
                expandBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    currentImageIndex = index;
                    openLightbox(currentImageIndex);
                });
            }
        }
    });
    
    // Función para abrir el lightbox
    function openLightbox(index) {
        if (images.length === 0) return;
        
        if (index >= images.length) {
            currentImageIndex = 0;
        } else if (index < 0) {
            currentImageIndex = images.length - 1;
        } else {
            currentImageIndex = index;
        }
        
        const image = images[currentImageIndex];
        
        // Mostrar loader
        lightboxImg.classList.remove('loaded');
        loader.classList.remove('hidden');
        
        // Cargar imagen
        lightboxImg.onload = function() {
            lightboxImg.classList.add('loaded');
            loader.classList.add('hidden');
        };
        
        lightboxImg.src = image.src;
        lightboxTitle.textContent = image.title;
        lightboxDesc.textContent = image.desc;
        lightboxDate.textContent = image.date;
        lightboxViews.textContent = image.views;
        imageCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
        
        // Configurar likes
        const likeStatus = likedImages[image.id] || false;
        likeBtn.classList.toggle('active', likeStatus);
        likeCount.textContent = likeStatus ? parseInt(image.views.match(/\d+/)[0]) : parseInt(image.views.match(/\d+/)[0]) - 1;
        
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Enfocar el lightbox para navegación con teclado
        lightbox.focus();
    }
    
    // Función para cerrar el lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    
    prevBtn.addEventListener('click', function() {
        openLightbox(currentImageIndex - 1);
    });
    
    nextBtn.addEventListener('click', function() {
        openLightbox(currentImageIndex + 1);
    });
    
    likeBtn.addEventListener('click', function() {
        const image = images[currentImageIndex];
        likedImages[image.id] = !likedImages[image.id];
        
        this.classList.toggle('active');
        likeCount.textContent = this.classList.contains('active') ? 
            parseInt(likeCount.textContent) + 1 : 
            parseInt(likeCount.textContent) - 1;
        
        localStorage.setItem('likedImages', JSON.stringify(likedImages));
    });
    
    downloadBtn.addEventListener('click', function() {
        const image = images[currentImageIndex];
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `iglesia-jabes-${currentImageIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    // Cerrar al hacer clic fuera de la imagen
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    openLightbox(currentImageIndex - 1);
                    break;
                case 'ArrowRight':
                    openLightbox(currentImageIndex + 1);
                    break;
            }
        }
    });
}

// Configurar navegación entre secciones de la galería
function setupGalleryNavigation() {
    const navLinks = document.querySelectorAll('.gallery-nav a');
    const navContainer = document.querySelector('.nav-container');
    
    // Efecto de desplazamiento suave
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Agregar clase active al link clickeado
            this.classList.add('active');
            
            // Obtener el target de la sección
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Desplazamiento suave
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - navContainer.offsetHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Actualizar navegación al hacer scroll
    let lastScrollPosition = 0;
    window.addEventListener('scroll', function() {
        const currentScrollPosition = window.scrollY;
        const scrollDirection = currentScrollPosition > lastScrollPosition ? 'down' : 'up';
        lastScrollPosition = currentScrollPosition;
        
        const navContainerHeight = document.querySelector('.nav-container').offsetHeight;
        const scrollPosition = currentScrollPosition + navContainerHeight + 100;
        
        document.querySelectorAll('.gallery-section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = '#' + section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === sectionId) {
                        link.classList.add('active');
                        
                        // Asegurarse de que el enlace activo sea visible
                        if (scrollDirection === 'down') {
                            link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        }
                    }
                });
            }
        });
    });
}

// Configurar animaciones al hacer scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                entry.target.classList.remove('out-of-view');
            } else {
                entry.target.classList.remove('in-view');
                entry.target.classList.add('out-of-view');
            }
        });
    }, observerOptions);
    
    // Observar todos los elementos con data-scroll
    document.querySelectorAll('[data-scroll]').forEach(el => {
        observer.observe(el);
    });
}

// Configurar efectos hover
function setupHoverEffects() {
    // Efecto para botones "Ver más"
    document.querySelectorAll('.view-more, .btn-view-all, .event-link').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Efecto para compartir en redes sociales
    document.querySelectorAll('.social-share i').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) translateY(-3px)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
        
        // Funcionalidad de compartir
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const parentItem = this.closest('.masonry-item, .event-card');
            const imageUrl = parentItem.querySelector('img').src;
            const title = parentItem.querySelector('h3').textContent;
            
            if (this.classList.contains('fa-facebook')) {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}&quote=${encodeURIComponent(title)}`, '_blank');
            } else if (this.classList.contains('fa-whatsapp')) {
                window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + imageUrl)}`, '_blank');
            } else if (this.classList.contains('fa-share-alt')) {
                if (navigator.share) {
                    navigator.share({
                        title: title,
                        text: 'Mira esta foto de Iglesia Jabes',
                        url: imageUrl
                    }).catch(err => {
                        console.log('Error al compartir:', err);
                    });
                } else {
                    prompt('Copie este enlace para compartir:', imageUrl);
                }
            }
        });
    });
    
    // Efecto para tarjetas
    document.querySelectorAll('.masonry-item, .event-card, .video-item, .instagram-item').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.03)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// Configurar botones de like
function setupLikeButtons() {
    const likedImages = JSON.parse(localStorage.getItem('likedImages')) || {};
    
    document.querySelectorAll('.likes').forEach(likeElement => {
        const parentItem = likeElement.closest('.masonry-item, .event-card');
        if (!parentItem) return;
        
        const itemId = `img-${Array.from(document.querySelectorAll('.masonry-item, .event-card')).indexOf(parentItem)}`;
        const likeCount = likeElement.querySelector('i');
        
        if (likeCount && likedImages[itemId]) {
            likeCount.classList.replace('far', 'fas');
            likeCount.style.color = '#ff4757';
        }
        
        likeElement.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.replace('far', 'fas');
                icon.style.color = '#ff4757';
                likedImages[itemId] = true;
                
                // Animación de like
                icon.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 300);
            } else {
                icon.classList.replace('fas', 'far');
                icon.style.color = '';
                delete likedImages[itemId];
            }
            
            localStorage.setItem('likedImages', JSON.stringify(likedImages));
            
            // Actualizar contador
            const countSpan = this.querySelector('span');
            if (countSpan) {
                const currentCount = parseInt(countSpan.textContent);
                countSpan.textContent = icon.classList.contains('fas') ? currentCount + 1 : currentCount - 1;
            }
        });
    });
}

// Configurar scroll suave
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
// En tu gallery.js
function adjustMasonryItems() {
    document.querySelectorAll('.masonry-item').forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            // Espera a que la imagen cargue
            img.onload = function() {
                const aspectRatio = img.naturalHeight / img.naturalWidth;
                const rowHeight = 10; // Debe coincidir con grid-auto-rows
                const rowSpan = Math.ceil((item.clientWidth * aspectRatio) / rowHeight);
                item.style.gridRowEnd = `span ${rowSpan}`;
            };
            
            // Si la imagen ya está cargada
            if (img.complete) img.onload();
        }
    });
}

// Ejecutar al cargar y al redimensionar
window.addEventListener('load', adjustMasonryItems);
window.addEventListener('resize', adjustMasonryItems);
// Configurar carga perezosa de imágenes
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px 0px'
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}
function playVideo() {
    const video = document.getElementById("myVideo");
    const button = document.querySelector(".play-button");
    video.play();
    button.style.display = "none";
}
// Control de videos
document.addEventListener('DOMContentLoaded', function() {
    // Configurar portadas de video
    document.querySelectorAll('.video-wrapper').forEach(wrapper => {
        const video = wrapper.querySelector('video');
        const poster = wrapper.querySelector('.video-poster');
        const playButton = wrapper.querySelector('.play-button');
        
        // Extraer primer frame como portada
        video.addEventListener('loadedmetadata', function() {
            // Crear canvas para capturar primer frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            video.currentTime = 0.1; // Avanzar un poco para asegurar frame
            
            video.addEventListener('seeked', function() {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                poster.style.backgroundImage = `url(${canvas.toDataURL()})`;
            }, {once: true});
        });
        
        // Control de reproducción
        playButton.addEventListener('click', function() {
            wrapper.classList.add('playing');
            video.play();
        });
        
        // Pausar video al hacer clic en él
        video.addEventListener('click', function() {
            if (!video.paused) {
                video.pause();
                wrapper.classList.remove('playing');
            }
        });
        
        // Mostrar botón de play cuando el video termine
        video.addEventListener('ended', function() {
            wrapper.classList.remove('playing');
            video.currentTime = 0;
        });
    });
    
    // Pausar otros videos cuando uno comienza a reproducirse
    document.querySelectorAll('.html5-video').forEach(video => {
        video.addEventListener('play', function() {
            document.querySelectorAll('.html5-video').forEach(otherVideo => {
                if (otherVideo !== video && !otherVideo.paused) {
                    otherVideo.pause();
                    otherVideo.parentElement.classList.remove('playing');
                }
            });
        });
    });
});

document.querySelectorAll('.video-wrapper').forEach(wrapper => {
    const video = wrapper.querySelector('video');
    const poster = wrapper.querySelector('.video-poster');

    if (poster) {
        poster.addEventListener('click', () => {
            poster.style.display = 'none';
            video.style.display = 'block';
            video.volume = 0.2; // volumen al 20%
            video.play();
        });
    }
});