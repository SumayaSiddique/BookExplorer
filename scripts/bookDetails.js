document.addEventListener('DOMContentLoaded', () => {
    const bookId = new URLSearchParams(window.location.search).get('id');
    const loader = document.getElementById('loader');
    const bookDetailsSection = document.querySelector('.book-details');

    bookDetailsSection.style.display = 'none';

    const fetchBookDetails = async (id) => {
        try {
            loader.style.display = 'block';

            const response = await fetch(`https://gutendex.com/books/?ids=${id}`);
            const data = await response.json();
            const book = data.results[0];
            loader.style.display = 'none';

            if (book) {
                populateBookDetails(book);
                bookDetailsSection.style.display = 'block';
            } else {
                document.querySelector('main').innerHTML = '<p>Book not found.</p>';
            }
        } catch (error) {
            console.error('Error fetching book details:', error);
            loader.style.display = 'none';
            document.querySelector('main').innerHTML = '<p>Error loading book details. Please try again later.</p>';
        }
    };

    const populateBookDetails = (book) => {
        document.querySelector('.book-cover').src = book.formats['image/jpeg'] || '';
        document.querySelector('.book-title').textContent = book.title;
        document.getElementById('authors-list').innerHTML = book.authors.map(author => `<p>${author.name} (${author.birth_year} - ${author.death_year})</p>`).join('');
        document.getElementById('download-epub').href = book.formats['application/epub+zip'];
        document.getElementById('download-mobi').href = book.formats['application/x-mobipocket-ebook'];
        document.getElementById('download-txt').href = book.formats['text/plain; charset=utf-8'];
        document.getElementById('download-count').textContent = book.download_count;
    };

    if (bookId) {
        fetchBookDetails(bookId);
    } else {
        document.querySelector('main').innerHTML = '<p>No book selected.</p>';
    }
});



