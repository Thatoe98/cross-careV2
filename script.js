document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

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

    const langButtons = document.querySelectorAll('.lang-button');
    const langContents = document.querySelectorAll('.lang');

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');

            langButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            langContents.forEach(content => {
                if (content.classList.contains(lang)) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    });

    // Set default language to English
    document.querySelector('.lang-button[data-lang="en"]').click();
});