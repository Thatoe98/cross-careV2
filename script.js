document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const langButtons = document.querySelectorAll('.lang-option');
    const currentLangButton = document.getElementById('current-lang-button');
    const langDropdown = document.getElementById('lang-dropdown');

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            const activeTab = document.getElementById(tabId);
            activeTab.classList.add('active');
            button.classList.add('active');
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

    // Add touch event listener for mobile devices
    currentLangButton.addEventListener('touchstart', () => {
        langDropdown.style.display = langDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Close the dropdown if clicked outside
    document.addEventListener('click', function(event) {
        if (!currentLangButton.contains(event.target) && !langDropdown.contains(event.target)) {
            langDropdown.style.display = 'none';
        }
    });

    // Add touch event listener for mobile devices
    document.addEventListener('touchstart', function(event) {
        if (!currentLangButton.contains(event.target) && !langDropdown.contains(event.target)) {
            langDropdown.style.display = 'none';
        }
    });

    // Optionally, set the active language button based on the current page
    const currentLang = document.documentElement.lang;
    const activeLangButton = document.querySelector(`.lang-option[data-lang="${currentLang}"]`);
    if (activeLangButton) {
        currentLangButton.innerHTML = activeLangButton.innerHTML;
    }
});