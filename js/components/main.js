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
    
    // Inicializar sliders/carousels si existen
    initializeSliders();
    
    // Inicializar formularios
    initializeForms();
});

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