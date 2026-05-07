// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (mobileNav.classList.contains('active')) {
            spans[0].style.transform = 'translateY(8px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            
            // Close other open items
            const activeItem = document.querySelector('.accordion-item.active');
            if (activeItem && activeItem !== item) {
                activeItem.classList.remove('active');
            }

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Header Scroll Effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Services Infinite Carousel Logic
    const servTrack = document.getElementById('servTrack');
    const servPrev = document.getElementById('servPrev');
    const servNext = document.getElementById('servNext');
    const servWrapper = document.querySelector('.services-carousel-wrapper');
    
    if (servTrack && servPrev && servNext) {
        let isTransitioning = false;
        let autoPlayInterval;

        const getSlideWidth = () => {
            const slide = servTrack.querySelector('.carousel-slide');
            return slide ? slide.offsetWidth : 0;
        };

        const moveNext = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            const slideWidth = getSlideWidth();
            servTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            servTrack.style.transform = `translateX(-${slideWidth}px)`;

            servTrack.addEventListener('transitionend', function onEnd() {
                servTrack.removeEventListener('transitionend', onEnd);
                servTrack.style.transition = 'none';
                servTrack.appendChild(servTrack.firstElementChild);
                servTrack.style.transform = 'translateX(0)';
                // Force reflow
                void servTrack.offsetWidth;
                isTransitioning = false;
            });
        };

        const movePrev = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            const slideWidth = getSlideWidth();
            servTrack.style.transition = 'none';
            servTrack.prepend(servTrack.lastElementChild);
            servTrack.style.transform = `translateX(-${slideWidth}px)`;
            
            // Force reflow
            void servTrack.offsetWidth;
            
            servTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            servTrack.style.transform = 'translateX(0)';
            
            servTrack.addEventListener('transitionend', function onEnd() {
                servTrack.removeEventListener('transitionend', onEnd);
                isTransitioning = false;
            });
        };

        // Event Listeners
        servNext.addEventListener('click', () => {
            moveNext();
            resetAutoPlay();
        });

        servPrev.addEventListener('click', () => {
            movePrev();
            resetAutoPlay();
        });

        // AutoPlay Logic
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(moveNext, 3500);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        const resetAutoPlay = () => {
            stopAutoPlay();
            startAutoPlay();
        };

        // Pause on Hover
        if (servWrapper) {
            servWrapper.addEventListener('mouseenter', stopAutoPlay);
            servWrapper.addEventListener('mouseleave', startAutoPlay);
            
            // Mobile touch pause
            servWrapper.addEventListener('touchstart', stopAutoPlay, {passive: true});
            servWrapper.addEventListener('touchend', startAutoPlay, {passive: true});
        }

        // Swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        servTrack.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        servTrack.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});

        const handleSwipe = () => {
            const threshold = 50;
            if (touchEndX < touchStartX - threshold) {
                moveNext();
                resetAutoPlay();
            }
            if (touchEndX > touchStartX + threshold) {
                movePrev();
                resetAutoPlay();
            }
        };

        // Start initial autoplay
        startAutoPlay();
    }
});
