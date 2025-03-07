// logic.js

document.addEventListener('DOMContentLoaded', function() {

    // Initialize the slideshow of demo images
    initSlideshow();

    // Theme toggle buttons and icons
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleNav = document.getElementById('theme-toggle-nav');
    const themeIcon = document.getElementById('themeIcon');
    const themeIconNav = document.getElementById('themeIcon-nav');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to toggle between light and dark themes
    function setTheme(isDark) {
        document.body.classList.toggle('dark-theme', isDark);
        themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
        themeIconNav.textContent = isDark ? 'light_mode' : 'dark_mode';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Initialize theme based on saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        setTheme(prefersDarkScheme.matches);
    }

    // Add event listeners to theme toggle buttons
    themeToggle.addEventListener('click', () => {
        setTheme(!document.body.classList.contains('dark-theme'));
    });

    themeToggleNav.addEventListener('click', () => {
        setTheme(!document.body.classList.contains('dark-theme'));
    });

    // Listen for system theme preference changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches);
        }
    });

    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuIcon = mobileMenuBtn.querySelector('.material-icons');

    // Function to toggle mobile menu visibility
    function toggleMobileMenu() {
        const isOpen = mobileMenu.classList.toggle('active');
        menuIcon.textContent = isOpen ? 'close' : 'menu';
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    // Add event listener to mobile menu button
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target) && 
            mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fade-in animations
    const animatedElements = document.querySelectorAll('.feature-item, .step-card, .wrapped-card');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Elements to animate
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        animationObserver.observe(element);
    });

    // Navbar effects
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove shadow based on scroll position
        if (currentScroll <= 0) {
            navbar.style.boxShadow = 'none';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }

        // Hide/show navbar based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 80) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    window.addEventListener('load', () => {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    });

    window.addEventListener('error', function(e) {
        console.error('Error:', e.error);
    });
});

// Slideshow of demo images
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    if (!slides.length) return;
    
    let currentSlide = 0;
    
    function showNextSlide() {
        // Hide current slide
        slides[currentSlide].classList.remove('active');
        
        // Calculate next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Show next slide
        slides[currentSlide].classList.add('active');
    }
    
    // Display first slide
    slides[0].classList.add('active');
    
    // Change slides every 3 seconds
    setInterval(showNextSlide, 3000);
}