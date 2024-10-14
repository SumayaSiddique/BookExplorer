document.addEventListener('DOMContentLoaded', () => {
    const loadHTML = (selector, file) => {
        const element = document.querySelector(selector);
        if (element) {
            fetch(file)
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then((data) => {
                    element.innerHTML = data;
                    if (file.includes('navbar.html')) {
                        document.dispatchEvent(new Event('navbarLoaded'));
                    }
                })
                .catch((error) => {
                    console.error('Error loading the file:', error);
                });
        }
    };
    loadHTML('header', '../components/navbar.html');
    loadHTML('footer', '../components/footer.html');
});

