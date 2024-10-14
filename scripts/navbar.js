document.addEventListener('navbarLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeIcon = document.getElementById('close-icon');

    if (hamburger && mobileMenu && closeIcon) {
        // Open mobile menu
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('show');
        });

        // Close mobile menu
        closeIcon.addEventListener('click', () => {
            mobileMenu.classList.remove('show');
        });

        // Close mobile menu when clicking outside
        mobileMenu.addEventListener('click', (event) => {
            if (event.target === mobileMenu) {
                mobileMenu.classList.remove('show');
            }
        });

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mobileMenu.classList.remove('show');
            }
        });
    }
});





