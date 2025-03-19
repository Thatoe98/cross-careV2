document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const langButtons = document.querySelectorAll('.lang-button');

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

            document.getElementById(tabId).classList.add('active');
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

    // Optionally, set the active language button based on the current page
    const currentLang = document.documentElement.lang;
    const activeLangButton = document.querySelector(`.lang-button[data-lang="${currentLang}"]`);
    if (activeLangButton) {
        activeLangButton.classList.add('active');
    }
});