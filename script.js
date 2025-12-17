// ===========================
// Navbar Functionality
// ===========================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 200;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ===========================
// Smooth Scrolling
// ===========================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Animated Counter
// ===========================

const statNumbers = document.querySelectorAll('.stat-number');
let counterAnimated = false;

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

function checkCounterVisibility() {
    if (counterAnimated) return;

    const statsSection = document.querySelector('.stats');
    const rect = statsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isVisible) {
        counterAnimated = true;
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            animateCounter(stat, target);
        });
    }
}

window.addEventListener('scroll', checkCounterVisibility);
window.addEventListener('load', checkCounterVisibility);

// ===========================
// Scroll Reveal Animation
// ===========================

const revealElements = document.querySelectorAll('.reveal-on-scroll');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// ===========================
// Carousel Functionality
// ===========================

const carouselTrack = document.getElementById('carouselTrack');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselDots = document.getElementById('carouselDots');
const slides = document.querySelectorAll('.carousel-slide');

let currentSlide = 0;
const totalSlides = slides.length;
let autoplayInterval;

// Create dots
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    carouselDots.appendChild(dot);
});

const dots = document.querySelectorAll('.carousel-dot');

function updateCarousel() {
    const offset = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${offset}%)`;

    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
    resetAutoplay();
}

// Event listeners
carouselNext.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
});

carouselPrev.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoplay();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoplay();
    }
});

// Touch/Swipe support
let touchStartX = 0;
let touchEndX = 0;

carouselTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

carouselTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
        resetAutoplay();
    }
}

// Autoplay
function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
}

function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
}

// Start autoplay on load
startAutoplay();

// Pause autoplay when user hovers over carousel
carouselTrack.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
});

carouselTrack.addEventListener('mouseleave', () => {
    startAutoplay();
});

// ===========================
// Parallax Effect for Hero
// ===========================

const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;

    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// ===========================
// Service Cards Tilt Effect
// ===========================

const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===========================
// Loading Animation
// ===========================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    revealElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            element.classList.add('revealed');
        }
    });
});

// ===========================
// Stats Animation Enhancement
// ===========================

const statItems = document.querySelectorAll('.stat-item');

statItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});

// ===========================
// Scroll to Top Button
// ===========================

let scrollTopBtn = null;

function createScrollTopButton() {
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #d4a574 0%, #b8935f 100%);
        border: none;
        border-radius: 50%;
        color: #1a2332;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    `;

    document.body.appendChild(scrollTopBtn);

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

window.addEventListener('scroll', () => {
    if (!scrollTopBtn) createScrollTopButton();

    if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

// ===========================
// Image Lazy Loading Enhancement
// ===========================

// Disabled to prevent carousel images from disappearing
/*
const images = document.querySelectorAll('img[src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';

            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });

            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

images.forEach(img => {
    if (!img.complete) {
        imageObserver.observe(img);
    }
});
*/

// ===========================
// Add hover effects styles dynamically
// ===========================

const style = document.createElement('style');
style.textContent = `
    .scroll-to-top:hover {
        transform: translateY(-5px) scale(1.1);
        box-shadow: 0 10px 30px rgba(212, 165, 116, 0.5);
    }
`;
document.head.appendChild(style);

// ===========================
// Performance Optimization
// ===========================

function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedActivateNavLink = debounce(activateNavLink, 10);
const debouncedCheckCounter = debounce(checkCounterVisibility, 10);

window.removeEventListener('scroll', activateNavLink);
window.removeEventListener('scroll', checkCounterVisibility);
window.addEventListener('scroll', debouncedActivateNavLink);
window.addEventListener('scroll', debouncedCheckCounter);

// ===========================
// Console Welcome Message
// ===========================

console.log(
    '%c🏗️ Omega Magnum Construction',
    'font-size: 20px; font-weight: bold; color: #d4a574;'
);
console.log(
    '%cWebsite built with passion and precision',
    'font-size: 12px; color: #8a9299;'
);

// ===========================
// Video Reels Carousel
// ===========================

const reelsTrack = document.getElementById('reelsTrack');
const reelsPrev = document.getElementById('reelsPrev');
const reelsNext = document.getElementById('reelsNext');

if (reelsTrack && reelsPrev && reelsNext) {
    let currentReelIndex = 0;
    const reelItems = document.querySelectorAll('.reel-item');
    let videosPerView = window.innerWidth <= 768 ? 1 : 3;

    function updateVideosPerView() {
        videosPerView = window.innerWidth <= 768 ? 1 : 3;
        showReels(currentReelIndex);
    }

    function showReels(index) {
        const maxIndex = Math.max(0, reelItems.length - videosPerView);
        currentReelIndex = Math.max(0, Math.min(index, maxIndex));

        // Ocultar todos los videos
        reelItems.forEach(item => {
            item.style.display = 'none';
        });

        // Mostrar solo los videos del índice actual
        for (let i = 0; i < videosPerView; i++) {
            const itemIndex = currentReelIndex + i;
            if (itemIndex < reelItems.length) {
                reelItems[itemIndex].style.display = 'block';
            }
        }

        // Pausar todos los videos
        document.querySelectorAll('.reel-item video').forEach(video => {
            video.pause();
        });

        // Actualizar botones
        reelsPrev.style.opacity = currentReelIndex === 0 ? '0.5' : '1';
        reelsNext.style.opacity = currentReelIndex >= maxIndex ? '0.5' : '1';
        reelsPrev.style.cursor = currentReelIndex === 0 ? 'not-allowed' : 'pointer';
        reelsNext.style.cursor = currentReelIndex >= maxIndex ? 'not-allowed' : 'pointer';
    }

    reelsPrev.addEventListener('click', () => {
        if (currentReelIndex > 0) {
            showReels(currentReelIndex - videosPerView);
        }
    });

    reelsNext.addEventListener('click', () => {
        const maxIndex = Math.max(0, reelItems.length - videosPerView);
        if (currentReelIndex < maxIndex) {
            showReels(currentReelIndex + videosPerView);
        }
    });

    window.addEventListener('resize', updateVideosPerView);
    showReels(0);
}

// ===========================
// Initialize Everything
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    checkCounterVisibility();
    activateNavLink();
});
