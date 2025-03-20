document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const langButtons = document.querySelectorAll('.lang-option');
    const currentLangButton = document.getElementById('current-lang-button');
    const langDropdown = document.getElementById('lang-dropdown');

    // Initialize AOS
    AOS.init({
        duration: 800, // Set animation duration
    });

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            tabContents.forEach(content => {
                content.classList.remove('active');
                content.removeAttribute('data-aos'); // Remove AOS animation
            });

            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            const activeTab = document.getElementById(tabId);
            activeTab.classList.add('active');
            button.classList.add('active');

            // Trigger AOS animation
            setTimeout(() => {
                activeTab.setAttribute('data-aos', 'fade-up');
                AOS.refresh(); // Refresh AOS to apply animations
            }, 10); // Small delay to ensure the class is added before animation
        });
    });

    // Set the first tab to active upon page load
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }

    // Language switching functionality
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            if (lang === 'en') {
                window.location.href = 'index.html';
            } else if (lang === 'my') {
                window.location.href = 'index_mm.html';
            }
        });
    });

    // Toggle dropdown visibility
    currentLangButton.addEventListener('click', () => {
        langDropdown.style.display = langDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Optionally, set the active language button based on the current page
    const currentLang = document.documentElement.lang;
    const activeLangButton = document.querySelector(`.lang-option[data-lang="${currentLang}"]`);
    if (activeLangButton) {
        currentLangButton.innerHTML = activeLangButton.innerHTML;
    }
});