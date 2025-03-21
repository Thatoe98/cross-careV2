$(document).ready(function() {
    // Smooth scrolling for navigation links
    $('a.tm-nav-link').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){
                window.location.hash = hash;
            });
        }
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
