/**
 * Clínica Médica - Script principal
 * Maneja la navegación móvil, sliders y otras interacciones
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const navToggle = document.querySelector('.nav-toggle');
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    
    // Variables para crear elementos dinámicamente
    let mobileNav, overlay;
    
    // Detectar scroll para añadir sombra al header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Crear y gestionar la navegación móvil
    function setupMobileNav() {
        // Crear el overlay
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
        
        // Crear el menú móvil
        mobileNav = document.createElement('div');
        mobileNav.className = 'nav-mobile';
        
        // Clonar el contenido de navegación
        const navContent = nav.querySelector('.nav__list').cloneNode(true);
        navContent.className = 'nav-mobile__list';
        
        // Actualizar las clases de los elementos clonados
        navContent.querySelectorAll('.nav__item').forEach(item => {
            item.className = 'nav-mobile__item';
        });
        
        navContent.querySelectorAll('.nav__link').forEach(link => {
            if (link.classList.contains('nav__link--active')) {
                link.className = 'nav-mobile__link nav-mobile__link--active';
            } else {
                link.className = 'nav-mobile__link';
            }
        });
        
        // Botón de cierre
        const closeBtn = document.createElement('button');
        closeBtn.className = 'nav-mobile__close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.setAttribute('aria-label', 'Cerrar menú');
        
        // Agregar elementos al menú móvil
        mobileNav.appendChild(closeBtn);
        mobileNav.appendChild(navContent);
        
        // Agregar el menú al body
        document.body.appendChild(mobileNav);
        
        // Event listeners
        navToggle.addEventListener('click', openMobileNav);
        closeBtn.addEventListener('click', closeMobileNav);
        overlay.addEventListener('click', closeMobileNav);
        
        // Cerrar al cambiar tamaño de ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992) { // 992px es el breakpoint lg
                closeMobileNav();
            }
        });
    }
    
    function openMobileNav() {
        mobileNav.classList.add('is-active');
        overlay.classList.add('is-active');
        document.body.style.overflow = 'hidden'; // Evitar scroll
    }
    
    function closeMobileNav() {
        mobileNav.classList.remove('is-active');
        overlay.classList.remove('is-active');
        document.body.style.overflow = ''; // Restaurar scroll
    }
    
    // Inicializar navegación móvil
    if (navToggle) {
        setupMobileNav();
    }
    
    // Inicializar carrusel hero
    initHeroCarousel();
    
    // Inicializar sliders/carousels si existen
    initializeSliders();
    
    // Inicializar formularios
    initializeForms();
});

/**
 * Inicializa el carrusel de la sección hero
 */
function initHeroCarousel() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.hero-carousel__slide');
    const dots = carousel.querySelectorAll('.hero-carousel__dot');
    let currentSlide = 0;
    let interval;
    let isAnimating = false;
    
    // Añadir efecto de zoom a las diapositivas
    slides.forEach(slide => {
        slide.classList.add('hero-carousel__slide--zoom');
    });
    
    // Función para mostrar un slide específico con animación
    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Ocultar todos los slides
        slides.forEach(slide => {
            slide.classList.remove('hero-carousel__slide--active');
            slide.classList.remove('hero-carousel__slide--previous');
        });
        
        // Marcar el slide actual como el anterior para la animación
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('hero-carousel__slide--previous');
        }
        
        // Desactivar todos los dots
        dots.forEach(dot => {
            dot.classList.remove('hero-carousel__dot--active');
        });
        
        // Activar el slide actual
        slides[index].classList.add('hero-carousel__slide--active');
        dots[index].classList.add('hero-carousel__dot--active');
        
        // Actualizar índice actual
        currentSlide = index;
        
        // Permitir nueva animación después de completar la transición
        setTimeout(() => {
            isAnimating = false;
        }, 1500); // Un poco más que la duración de la transición
    }
    
    // Función para avanzar al siguiente slide
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) {
            next = 0;
        }
        showSlide(next);
    }
    
    // Función para ir al slide anterior
    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) {
            prev = slides.length - 1;
        }
        showSlide(prev);
    }
    
    // Iniciar carrusel automático
    function startCarousel() {
        interval = setInterval(nextSlide, 6000); // Cambiar cada 6 segundos
    }
    
    // Detener carrusel automático
    function stopCarousel() {
        clearInterval(interval);
    }
    
    // Crear botones de navegación anterior/siguiente
    const prevButton = document.createElement('button');
    prevButton.className = 'hero-carousel__nav hero-carousel__nav--prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.setAttribute('aria-label', 'Imagen anterior');
    
    const nextButton = document.createElement('button');
    nextButton.className = 'hero-carousel__nav hero-carousel__nav--next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.setAttribute('aria-label', 'Imagen siguiente');
    
    carousel.appendChild(prevButton);
    carousel.appendChild(nextButton);
    
    // Agregar event listeners a los botones de navegación
    prevButton.addEventListener('click', () => {
        stopCarousel();
        prevSlide();
        startCarousel();
    });
    
    nextButton.addEventListener('click', () => {
        stopCarousel();
        nextSlide();
        startCarousel();
    });
    
    // Agregar event listeners a los dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (currentSlide !== index) {
                stopCarousel();
                showSlide(index);
                startCarousel();
            }
        });
    });
    
    // Agregar event listeners para pausar al hacer hover
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
    
    // Iniciar carrusel
    startCarousel();
}

/**
 * Inicializa los sliders/carousels del sitio
 */
function initializeSliders() {
    // Slider de testimonios
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (testimonialsSlider) {
        // Aquí implementarías el slider con una librería como Swiper o Slick
        // o con una implementación personalizada
        
        // Ejemplo con navegación manual simple (solo como referencia)
        const testimonials = testimonialsSlider.querySelectorAll('.testimonial');
        if (testimonials.length > 1) {
            let currentSlide = 0;
            
            // Crear controles de navegación
            const controls = document.createElement('div');
            controls.className = 'testimonials-controls';
            
            // Botón anterior
            const prevBtn = document.createElement('button');
            prevBtn.className = 'testimonials-control testimonials-control--prev';
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevBtn.setAttribute('aria-label', 'Testimonio anterior');
            
            // Botón siguiente
            const nextBtn = document.createElement('button');
            nextBtn.className = 'testimonials-control testimonials-control--next';
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.setAttribute('aria-label', 'Testimonio siguiente');
            
            // Agregar controles al slider
            controls.appendChild(prevBtn);
            controls.appendChild(nextBtn);
            testimonialsSlider.appendChild(controls);
            
            // Mostrar solo el primer testimonio inicialmente
            testimonials.forEach((testimonio, index) => {
                if (index !== 0) {
                    testimonio.style.display = 'none';
                }
            });
            
            // Función para cambiar entre testimonios
            function showTestimonial(index) {
                // Ocultar testimonio actual
                testimonials[currentSlide].style.display = 'none';
                
                // Actualizar índice
                currentSlide = index;
                
                // Asegurarse de que el índice esté dentro del rango
                if (currentSlide < 0) {
                    currentSlide = testimonials.length - 1;
                } else if (currentSlide >= testimonials.length) {
                    currentSlide = 0;
                }
                
                // Mostrar nuevo testimonio
                testimonials[currentSlide].style.display = 'block';
            }
            
            // Event listeners para los botones
            prevBtn.addEventListener('click', () => {
                showTestimonial(currentSlide - 1);
            });
            
            nextBtn.addEventListener('click', () => {
                showTestimonial(currentSlide + 1);
            });
        }
    }
}

/**
 * Inicializa y valida formularios
 */
function initializeForms() {
    // Obtener todos los formularios
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Event listener para validación al enviar
        form.addEventListener('submit', function(event) {
            let isValid = true;
            
            // Validar campos requeridos
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                // Eliminar mensaje de error previo
                const errorElement = field.parentNode.querySelector('.form__error');
                if (errorElement) {
                    errorElement.remove();
                }
                
                // Quitar clase de error previo
                field.classList.remove('is-invalid');
                
                // Validar campo vacío
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    
                    // Crear mensaje de error
                    const errorMessage = document.createElement('span');
                    errorMessage.className = 'form__error';
                    errorMessage.textContent = 'Este campo es obligatorio';
                    field.parentNode.appendChild(errorMessage);
                } 
                // Validar email
                else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    
                    // Crear mensaje de error
                    const errorMessage = document.createElement('span');
                    errorMessage.className = 'form__error';
                    errorMessage.textContent = 'Por favor ingresa un email válido';
                    field.parentNode.appendChild(errorMessage);
                }
                // Validar teléfono (simplificado)
                else if (field.type === 'tel' && !/^\+?[\d\s()-]{7,15}$/.test(field.value)) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    
                    // Crear mensaje de error
                    const errorMessage = document.createElement('span');
                    errorMessage.className = 'form__error';
                    errorMessage.textContent = 'Por favor ingresa un número de teléfono válido';
                    field.parentNode.appendChild(errorMessage);
                }
            });
            
            // Si no es válido, prevenir envío
            if (!isValid) {
                event.preventDefault();
            }
        });
        
        // Validación en tiempo real para mejorar UX
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.addEventListener('blur', function() {
                // Solo validar si el campo ya fue tocado
                if (field.value.trim() !== '' || field.classList.contains('is-invalid')) {
                    // Eliminar mensaje de error previo
                    const errorElement = field.parentNode.querySelector('.form__error');
                    if (errorElement) {
                        errorElement.remove();
                    }
                    
                    // Quitar clase de error previo
                    field.classList.remove('is-invalid');
                    
                    // Validar campo según su tipo
                    if (field.hasAttribute('required') && !field.value.trim()) {
                        field.classList.add('is-invalid');
                        
                        // Crear mensaje de error
                        const errorMessage = document.createElement('span');
                        errorMessage.className = 'form__error';
                        errorMessage.textContent = 'Este campo es obligatorio';
                        field.parentNode.appendChild(errorMessage);
                    } 
                    else if (field.type === 'email' && field.value.trim() !== '' && 
                             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                        field.classList.add('is-invalid');
                        
                        // Crear mensaje de error
                        const errorMessage = document.createElement('span');
                        errorMessage.className = 'form__error';
                        errorMessage.textContent = 'Por favor ingresa un email válido';
                        field.parentNode.appendChild(errorMessage);
                    }
                    else if (field.type === 'tel' && field.value.trim() !== '' && 
                             !/^\+?[\d\s()-]{7,15}$/.test(field.value)) {
                        field.classList.add('is-invalid');
                        
                        // Crear mensaje de error
                        const errorMessage = document.createElement('span');
                        errorMessage.className = 'form__error';
                        errorMessage.textContent = 'Por favor ingresa un número de teléfono válido';
                        field.parentNode.appendChild(errorMessage);
                    }
                }
            });
        });
    });
}