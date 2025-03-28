// logic.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize slideshow
    initSlideshow();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize video player
    initVideoPlayer();
    
    // Initialize scroll indicator visibility
    initScrollIndicator();
});

// Initialize slideshow
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

// Initialize theme toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to set theme
    function setTheme(isLight) {
        document.body.classList.toggle('light-theme', isLight);
        
        // Update theme toggle icon
        const icon = themeToggle.querySelector('.material-icons');
        if (icon) {
            icon.textContent = isLight ? 'dark_mode' : 'light_mode';
        }
        
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }
    
    // Initialize theme based on saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme === 'light');
    } else {
        // Default is dark theme
    }
    
    // Add event listener to theme toggle button
    themeToggle.addEventListener('click', () => {
        setTheme(!document.body.classList.contains('light-theme'));
    });
}

// Initialize mobile menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    
    function openSidebar() {
        sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeSidebarMenu() {
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Toggle sidebar on menu button click
    menuToggle.addEventListener('click', openSidebar);
    
    // Close sidebar on close button click
    closeSidebar.addEventListener('click', closeSidebarMenu);
    
    // Close sidebar when clicking a link (on mobile)
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebarMenu();
            }
        });
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeSidebarMenu();
        }
    });
    
    // Update active link based on scroll position
    window.addEventListener('scroll', updateActiveLink);
}

// Initialize smooth scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top functionality
    const backToTopButtons = document.querySelectorAll('.back-to-top');
    
    backToTopButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}

// Update active link based on scroll position
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}` || 
            link.getAttribute('href') === `index.html#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .workflow-step, .wrapped-feature, .support-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        animatedElements.forEach(element => {
            element.classList.add('fade-in');
        });
    }
    
    // Fade-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .feature-card, .workflow-step, .wrapped-feature, .support-card {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
    
    const header = document.querySelector('.main-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Initialize scroll indicator visibility
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;
    
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '-100px 0px 0px 0px'
    });
    
    observer.observe(heroSection);
}

// Initialize video player
function initVideoPlayer() {
    const videoContainer = document.querySelector('.video-container');
    const video = videoContainer?.querySelector('video');
    const playButton = videoContainer?.querySelector('.play-button');
    const videoOverlay = videoContainer?.querySelector('.video-overlay');
    
    if (!video || !playButton || !videoOverlay) return;
    
    playButton.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            videoOverlay.style.opacity = '0';
        } else {
            video.pause();
            videoOverlay.style.opacity = '1';
        }
    });
    
    video.addEventListener('play', function() {
        videoOverlay.style.opacity = '0';
    });
    
    video.addEventListener('pause', function() {
        videoOverlay.style.opacity = '1';
    });
    
    // Hide overlay when video is playing
    video.addEventListener('playing', function() {
        videoOverlay.style.opacity = '0';
    });
    
    // Show overlay when video ends
    video.addEventListener('ended', function() {
        videoOverlay.style.opacity = '1';
        video.currentTime = 0;
    });
    
    // Handle click on video
    video.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            videoOverlay.style.opacity = '0';
        } else {
            video.pause();
            videoOverlay.style.opacity = '1';
        }
    });
}
