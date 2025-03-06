
// --- LAYOUT --- //

root.innerHTML = `
    <header>
        <nav class="header__nav">
            <i class="fa-solid fa-bars"></i>

            <h1 class="header__headline">MyMovies</h1>

            <label class="darkmode">
                <input type="checkbox" class="darkmode__switch">
                <span class="darkmode__slider"></span>
            </label>
        </nav>
    </header>

    <main>
        <section class="nowshowing">
            <h2 class="section__headline">
                Now Showing
                <span class="seemore__btn seemore__nowshowing">See more</span>
            </h2>

            <div class="gallery nowshowing__gallery"></div>
        </section>

        <section class="popular">
            <h2 class="section__headline">
                Popular
                <span class="seemore__btn seemore__popular">See more</span>
            </h2>

            <div class="gallery popular__gallery"></div>
        </section>
    </main>

    <footer>
        <nav class="footer__nav">
            <menu class="footer__menu">
                <li class="menu__item">
                    <a href="index.html" class="menu__link">
                        <i class="fa-solid fa-film footer__icon footer__icon--active"></i>
                    </a>
                </li>
                <li class="menu__item">
                    <a href="" class="menu__link">
                        <i class="fa-solid fa-ticket footer__icon"></i>
                    </a>
                </li>
                <li class="menu__item">
                    <a href="bookmarks.html" class="menu__link">
                        <i class="fa-regular fa-bookmark footer__icon"></i>
                    </a>
                </li>
            </menu>
        </nav>
    </footer>
`;

let nowshowingGallery = root.querySelector(".nowshowing__gallery");
let popularGallery = root.querySelector(".popular__gallery");



// --- PAGINATION --- //

let pageNowShowing = 1;
let pagePopular = 1;
let maxPages = 20;

let seemoreBtns = document.querySelectorAll(".seemore__btn");
seemoreBtns.forEach(btn => {
    btn.addEventListener("click", function () {
        if (btn.classList.contains("seemore__nowshowing")) {
            if (pageNowShowing < maxPages) {
                pageNowShowing++;
                fetchNowShowing();
            }
        }

        if (btn.classList.contains("seemore__popular")) {
            if (pagePopular < maxPages) {
                pagePopular++;
                fetchPopular();
            }
        }
    });
});



// --- NOW SHOWING --- //

function fetchNowShowing() {
    let urlNowShowing = `https://api.themoviedb.org/3/movie/now_playing?page=${pageNowShowing}`;

    fetch(urlNowShowing, fetchOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            nowshowingGallery.innerHTML += data.results.map(movie => {
                // console.log(movie);

                let movieId = movie.id;
                let moviePosterUrl = imgUrlLarge + movie.poster_path;

                let movieTitle = movie.title;
                let imdbRating = movie.vote_average.toFixed(1);


                return `
            <article class="nowshowing__movie">
                <a href="details.html?id=${movieId}">
                    <img loading="lazy" src="${moviePosterUrl}" alt="${movieTitle}" class="movie__poster">
                </a>
                <div class="movie__text">
                    <a href="details.html?id=${movieId}">
                        <h3 class="movie__title nowshowing__movie__title">
                            ${movieTitle}
                        </h3>
                    </a>

                    <span class="movie__rating">
                        <i class="fa-solid fa-star movie__rating__icon"></i> ${imdbRating}/10 IMDb
                    </span>
                </div>
            </article>
            `;
            }).join("");

        })
        .catch(err => console.error(err));
}
fetchNowShowing();



// --- POPULAR --- //

function fetchPopular() {
    let urlPopular = `https://api.themoviedb.org/3/movie/now_playing?page=${pagePopular}`;

    fetch(urlPopular, fetchOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            popularGallery.innerHTML += data.results.map(movie => {
                // console.log(movie);

                let movieId = movie.id;
                let moviePosterUrl = imgUrlSmall + movie.poster_path;

                let movieTitle = movie.title;
                let imdbRating = movie.vote_average.toFixed(1);
                let movieReleaseDate = formatDate(movie.release_date);

                saveToLocalStorage(movieId, movie.genre_ids);

                return `
            <article class="popular__movie">
                <a href="details.html?id=${movieId}">
                    <img loading="lazy" src="${moviePosterUrl}" alt="${movieTitle}" class="movie__poster">
                </a>

                <div class="movie__text">
                    <a href="details.html?id=${movieId}">
                        <h3 class="movie__title popular__movie__title">
                            ${movieTitle}
                        </h3>
                    </a>

                    <span class="movie__rating">
                        <i class="fa-solid fa-star movie__rating__icon"></i> ${imdbRating}/10 IMDb
                    </span>

                    <div class="movie__genre__container" data-id="${movieId}"></div>
                        
                    <span class="movie__releasedate">
                        <i class="fa-regular fa-calendar"></i> ${movieReleaseDate}
                    </span>
                </div>
            </article>
            `;
            }).join("");

            fetch('https://api.themoviedb.org/3/genre/movie/list', fetchOptions)
                .then(res => res.json())
                .then(data => {
                    let genreList = data.genres;
                    // console.log(genreList);

                    let movieGenreContainers = document.querySelectorAll(".movie__genre__container");
                    movieGenreContainers.forEach(container => {
                        let movieId = container.getAttribute("data-id");
                        let genreIds = readFromLocalStorage(movieId);

                        container.innerHTML = genreIds.map(genre => {
                            let genreName = findGenreName(genreList, genre);
                            return `<span class="movie__genre">${genreName}</span>`;
                        }).join("");
                    });
                });
        })
        .catch(err => console.error(err));
}
fetchPopular();