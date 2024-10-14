document.addEventListener('DOMContentLoaded', () => {
    const wishlistContainer = document.getElementById('wishlist');
    const paginationContainer = document.getElementById('pagination');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const booksPerPage = 10;
    let currentPage = 1;

    const renderWishlist = () => {
        wishlistContainer.innerHTML = '';
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        const paginatedWishlist = wishlist.slice(startIndex, endIndex);

        if (paginatedWishlist.length === 0) {
            wishlistContainer.innerHTML = '<p class="empty-wishlist">Your wishlist is empty.</p>';
            paginationContainer.style.display = 'none';
            return;
        }

        paginatedWishlist.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.className = 'book';
            bookDiv.innerHTML = `
                <img src="${book.formats['image/jpeg']}" alt="${book.title}">
                <h4>${book.title.length > 50 ? book.title.slice(0, 50) + '...' : book.title}</h4>
                <div class="author-wishlist">
                <p>by ${book.authors.length > 0 ? book.authors[0].name : 'Unknown Author'}</p>
                <i class="fas fa-heart wishlist-icon liked" data-id="${book.id}"></i>
                </div>
            `;
            wishlistContainer.appendChild(bookDiv);
        });

        renderPagination();
    };

    const renderPagination = () => {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(wishlist.length / booksPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.innerText = i;
            button.className = 'pagination-button';
            button.addEventListener('click', () => {
                currentPage = i;
                renderWishlist();
            });
            if (i === currentPage) {
                button.classList.add('active');
            }
            paginationContainer.appendChild(button);
        }
    };

    wishlistContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('wishlist-icon')) {
            const bookId = parseInt(event.target.dataset.id, 10);
            wishlist = wishlist.filter(item => item.id !== bookId);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            renderWishlist();
        }
    });

    renderWishlist();
});







