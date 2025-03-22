$(document).ready(function() {
    // Smooth scrolling for navigation links
    $('a.tm-nav-link').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top - $('.tm-navbar').outerHeight() // Adjust scroll position to account for fixed navbar
            }, 800, function(){
                window.location.hash = hash;
            });
        }
    });

    // Smooth scrolling for hero section link
    $('a[href="#infinite"]').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $('#infinite').offset().top - $('.tm-navbar').outerHeight() // Adjust scroll position to account for fixed navbar
        }, 800);
    });

    
});

document.addEventListener("DOMContentLoaded", function() {
    const langButton = document.getElementById("current-lang-button");
    if (langButton) {
        langButton.addEventListener("click", function() {
            const currentLang = document.documentElement.lang;
            if (currentLang === "my") {
                window.location.href = "index.html"; // Switch to English version
            } else {
                window.location.href = "index_mm.html"; // Switch to Myanmar version
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const currentLangButton = document.getElementById('current-lang-button');
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            const section = document.getElementById(tabId);
            section.scrollIntoView({ behavior: 'smooth' });
            sidebar.classList.remove('active'); // Close sidebar on tab click
        });
    });

    currentLangButton.addEventListener('click', () => {
        const currentLang = document.documentElement.lang;
        if (currentLang === 'en') {
            window.location.href = 'index_mm.html';
        } else if (currentLang === 'my') {
            window.location.href = 'index.html';
        }
    });

    currentLangButton.addEventListener('touchstart', () => {
        const currentLang = document.documentElement.lang;
        if (currentLang === 'en') {
            window.location.href = 'index_mm.html';
        } else if (currentLang === 'my') {
            window.location.href = 'index.html';
        }
    });

    const currentLang = document.documentElement.lang;
    if (currentLang === 'en') {
        currentLangButton.innerHTML = '<i class="fas fa-flag-uk"></i> English';
    } else if (currentLang === 'my') {
        currentLangButton.innerHTML = '<i class="fas fa-flag-mm"></i> မြန်မာ';
    }

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Carousel functionality
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    let currentIndex = 0;

    function updateCarousel() {
        const offset = -currentIndex * 100;
        carouselInner.style.transform = `translateX(${offset}%)`;
    }

    leftArrow.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
        updateCarousel();
    });

    rightArrow.addEventListener('click', () => {
        currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });

    // Add touch event listeners for mobile swipe functionality
    let startX = 0;
    let endX = 0;

    carouselInner.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX;
    });

    carouselInner.addEventListener('touchmove', (event) => {
        endX = event.touches[0].clientX;
    });

    carouselInner.addEventListener('touchend', () => {
        if (startX > endX) {
            currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
        } else {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
        }
        updateCarousel();
    });

    // Initialize carousel
    updateCarousel();
});
