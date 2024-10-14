document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const booksList = document.getElementById('books-list');
    const pagination = document.getElementById('pagination');
    const drawerBtn = document.getElementById('drawer-btn');
    const genreDrawer = document.getElementById('genre-drawer');
    let currentPage = 1;
    let books = [];
    let totalBooks = '';
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const savedSearchQuery = localStorage.getItem('searchQuery') || '';
    const savedGenre = localStorage.getItem('selectedGenre') || '';
    searchBar.value = savedSearchQuery;
    if (savedGenre) {
        drawerBtn.textContent = savedGenre;
    }

    const fetchBooks = async (page) => {
        try {
            document.getElementById('loader').style.display = 'block';
            booksList.innerHTML = '';

            const response = await fetch(`https://gutendex.com/books/?page=${page}`);
            const data = await response.json();
            books = data.results;
            totalBooks = data.count;
            initializeGenres(books);
            if (savedSearchQuery) {
                filterBooksBySearch(savedSearchQuery);
            } else if (savedGenre) {
                filterBooksByGenre(savedGenre);
            } else {
                renderBooks(books);
                renderPagination(data.count, books.length);
            }
        } catch (error) {
            booksList.innerHTML = '<p>Error loading books. Please try again later.</p>';
        } finally {
            document.getElementById('loader').style.display = 'none';
        }
    };

    const initializeGenres = (books) => {
        const genres = new Set();
        books.forEach(book => {
            book.bookshelves.forEach(genre => {
                if (genre.startsWith("Browsing:")) {
                    genre = genre.split("Browsing:")[1];
                }
                genres.add(genre);
            });
        });
        genres.forEach(genre => {
            const genreItem = document.createElement('div');
            genreItem.classList.add('genre-item');
            genreItem.textContent = genre;
            genreItem.addEventListener('click', () => {
                drawerBtn.textContent = genre;
                genreDrawer.classList.add('hidden');
                filterBooksByGenre(genre);

                localStorage.setItem('selectedGenre', genre);
            });
            genreDrawer.appendChild(genreItem);
        });
    };

    document.getElementById('drawer-btn').addEventListener('click', () => {
        genreDrawer.classList.toggle('hidden');
    });

    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            document.getElementById('search-bar').value = '';
            drawerBtn.textContent = 'Select Genre';
            document.getElementById('genre-drawer').innerHTML = '';
            localStorage.removeItem('searchQuery');
            localStorage.removeItem('selectedGenre');
            currentPage = 1;
            fetchBooks(currentPage);
        });
    }

    const toggleWishlist = (book) => {
        const isWishlisted = wishlist.some(item => item.id === book.id);
        if (isWishlisted) {
            wishlist = wishlist.filter(item => item.id !== book.id);
        } else {
            wishlist.push(book);
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        renderBooks(books);
    };
    const renderBooks = (books) => {
        if (books.length === 0) {
            booksList.innerHTML = '<p class="no-books-found">No books found.</p>';
            return;
        }
        booksList.innerHTML = '';

        books.forEach(book => {
            const isWishlisted = wishlist.some(item => item.id === book.id);

            const bookDiv = document.createElement('div');
            bookDiv.className = 'book';

            bookDiv.innerHTML = `
                <img src="${book.formats['image/jpeg']}" alt="${book.title}">
                <h4>${book.title.length > 50 ? book.title.slice(0, 50) + '...' : book.title}</h4> 
                <div class="author-wishlist">
                    <p>by ${book.authors.length > 0 ? book.authors[0].name : 'Unknown Author'}</p>
                    <i class="fas fa-heart wishlist-icon ${isWishlisted ? 'liked' : ''}"></i>
                </div>
            `;
            bookDiv.addEventListener('click', () => {
                window.location.href = `bookDetails.html?id=${book.id}`;
            });

            const wishlistIcon = bookDiv.querySelector('.wishlist-icon');
            wishlistIcon.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleWishlist(book);
            });

            booksList.appendChild(bookDiv);
        });
    };

    const renderPagination = (totalBooks, booksPerPage) => {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(totalBooks / booksPerPage);

        if (totalBooks < 20) {
            pagination.style.display = 'none';
            return;
        } else {
            pagination.style.display = 'block';
        }

        const maxButtons = Math.min(totalPages, 10);
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.innerText = i;
            button.classList.add('pagination-button');
            button.addEventListener('click', () => {
                currentPage = i;
                fetchBooks(currentPage);
            });
            if (i === currentPage) {
                button.classList.add('active');
            }
            pagination.appendChild(button);
        }
    };

    searchBar.addEventListener('input', () => {
        currentPage = 1;
        const searchQuery = searchBar.value.toLowerCase();
        localStorage.setItem('searchQuery', searchQuery);
        filterBooksBySearch(searchQuery);
    });

    const filterBooksBySearch = (searchQuery) => {
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(searchQuery)
        );
        booksList.innerHTML = '';
        renderBooks(filteredBooks);
        renderPagination(filteredBooks.length, books.length);
    };

    const filterBooksByGenre = (genre) => {
        currentPage = 1;
        const filteredBooks = books.filter(book =>
            book.bookshelves && book.bookshelves.some(shelf => shelf.toLowerCase().includes(genre.toLowerCase()))
        );
        booksList.innerHTML = '';
        renderBooks(filteredBooks);
        renderPagination(filteredBooks.length, books.length);
    };

    fetchBooks(currentPage);
});








