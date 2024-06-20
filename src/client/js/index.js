import { movies } from './data/movies.js';

// Log movies to the console to verify they are loading properly
console.log(movies);

// Function to get pinned movies from local storage
function getPinnedMoviesFromStorage() {
    const pinned = localStorage.getItem('pinnedMovies');
    return pinned ? JSON.parse(pinned) : [];
}

// Function to save pinned movies to local storage
function savePinnedMoviesToStorage(pinnedMovies) {
    localStorage.setItem('pinnedMovies', JSON.stringify(pinnedMovies));
}

// Function to insert movies into a table
function insertMoviesIntoTable(eleTable, movies) {
    // Sort movies by rating, highest to lowest
    movies.sort((a, b) => b.rating - a.rating);

    // Clear existing rows
    eleTable.innerHTML = '';

    // Iterate over movies and create rows
    movies.forEach(movie => {
        // Skip movies with genre 'Drama'
        if (movie.genre === 'Drama') return;

        // Create a row
        const row = eleTable.insertRow();

        // Insert cells for each movie attribute
        const titleCell = row.insertCell();
        titleCell.textContent = movie.title;

        const genreCell = row.insertCell();
        genreCell.textContent = movie.genre;

        const releaseDateCell = row.insertCell();
        releaseDateCell.textContent = new Date(movie.release_date * 1000).toLocaleDateString();

        const directorCell = row.insertCell();
        directorCell.textContent = movie.director;

        const ratingCell = row.insertCell();
        ratingCell.textContent = movie.rating;

        // Create a button element
        const buttonCell = row.insertCell();
        const button = document.createElement('button');
        
        // Check if movie is pinned
        const isPinned = pinnedMovies.some(pinned => pinned.title === movie.title);
        button.className = isPinned ? 'btn btn-danger' : 'btn btn-primary';
        button.innerHTML = isPinned ? '<i class="fas fa-times"></i>' : '<i class="fas fa-pencil-alt"></i>';

        // Add event listener to the button
        button.addEventListener('click', () => {
            if (isPinned) {
                // Remove from pinned
                pinnedMovies = pinnedMovies.filter(pinned => pinned.title !== movie.title);
            } else {
                // Add to pinned
                pinnedMovies.push(movie);
            }
            savePinnedMoviesToStorage(pinnedMovies);
            renderTables();
        });

        buttonCell.appendChild(button);

        // Set row color based on rating
        if (movie.rating <= 2) {
            row.style.backgroundColor = 'red';
        } else if (movie.rating > 2 && movie.rating <= 5) {
            row.style.backgroundColor = 'orange';
        } else if (movie.rating > 5 && movie.rating <= 8) {
            row.style.backgroundColor = 'blue';
        } else if (movie.rating > 8) {
            row.style.backgroundColor = 'green';
        }
    });
}

// Render tables function
function renderTables() {
    const allMoviesTableBody = document.querySelector('#all-movies-container table tbody');
    const favouriteMoviesTableBody = document.querySelector('#pinned-movies-container table tbody');
    const noPinnedMoviesMessage = document.querySelector('#pinned-movies-container .alert');
    
    // Insert all movies into the all movies table
    insertMoviesIntoTable(allMoviesTableBody, movies);

    // Get pinned movies from storage
    pinnedMovies = getPinnedMoviesFromStorage();
    console.log('Pinned Movies:', pinnedMovies);

    // Insert pinned movies into the favourites table or show a message if there are none
    if (pinnedMovies.length === 0) {
        noPinnedMoviesMessage.classList.remove('d-none');
        document.querySelector('#pinned-movies-container table').classList.add('d-none');
    } else {
        noPinnedMoviesMessage.classList.add('d-none');
        document.querySelector('#pinned-movies-container table').classList.remove('d-none');
        insertMoviesIntoTable(favouriteMoviesTableBody, pinnedMovies);
    }
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderTables();
});
