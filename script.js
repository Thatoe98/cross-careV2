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
});

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
