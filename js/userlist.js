

let search = window.location.search;
let params = new URLSearchParams(search);
let listType = params.get("list");


// --- LAYOUT --- //

root.innerHTML = `
    <header>
        ${headerContent(listType)}
    </header>

    <main>
    </main>

    <footer>
        ${footerContent(listType)}
    </footer>
`;

let mainElm = root.querySelector("main");


footerActivePage(listType);


if (listType === "ratings") {
    fetchRatings();
    document.title = "MyMovies - My Ratings";
}
if (listType === "watchlist") {
    fetchWatchlist();
    document.title = "MyMovies - My Watchlist";
}



// --- RATINGS  --- //

function fetchRatings() {
    fetch(`https://api.themoviedb.org/3/account/${accountId}/rated/movies`, fetchOptions)
        .then(res => res.json())
        .then(data => {
            // console.log(data);

            if (data.results.length < 1) {
                mainElm.innerHTML = `
                    <p class="error">You haven't rated any movies yet</p>
                `;
            } else {
                mainElm.innerHTML += data.results.map(movie => {
                    console.log(movie);

                    let movieId = movie.id;
                    let moviePosterUrl = getImage(movie.poster_path, imgUrlSmall);

                    let movieTitle = movie.title;
                    let movieUserRating = movie.rating;

                    let imdbRating = movie.vote_average.toFixed(1);
                    let movieReleaseDate = formatDate(movie.release_date);

                    return `
                    <article class="userlist__movie">
                        <a href="details.html?id=${movieId}">
                            <img loading="lazy" src="${moviePosterUrl}" alt="${movieTitle}" class="movie__poster">
                        </a>

                        <div class="movie__text">
                            <a href="details.html?id=${movieId}">
                                <h3 class="movie__title">
                                    ${movieTitle}
                                </h3>
                            </a>

                            <span class="movie__rating">
                                <i class="fa-solid fa-star movie__rating__icon"></i> ${imdbRating}/10 IMDb
                            </span>

                            <div class="movie__userrating" data-id="${movieId}" data-rating="${movieUserRating}"></div>

                            <span class="movie__releasedate">
                                <i class="fa-regular fa-calendar movie__releasedate__icon"></i> ${movieReleaseDate}
                            </span>
                        </div>
                    </article>
                `;
                }).join("");



                // --- USER RATING --- //

                let userRatingContainer = Array.from(document.querySelectorAll(".movie__userrating"));
                userRatingContainer.forEach(container => {
                    let userRating = container.getAttribute("data-rating");
                    let movieId = container.getAttribute("data-id");

                    for (let i = 0; i < 5; i++) {
                        let num = i + 1;
                        if (num <= userRating) {
                            container.innerHTML += `
                            <i class="fa-solid fa-star movie__userrating__icon" data-star="${num}"></i>
                        `;
                        } else {
                            container.innerHTML += `
                            <i class="fa-regular fa-star movie__userrating__icon" data-star="${num}"></i>
                        `;
                        }
                    }

                    let userRatingStars = Array.from(container.querySelectorAll(".movie__userrating__icon"));

                    userRatingStars.forEach(currentStar => {
                        currentStar.addEventListener("click", function () {
                            addUserRating(currentStar, movieId);
                        });
                    });

                });
            }

        });
}



// --- WATCHLIST  --- //

function fetchWatchlist() {
    fetch(`https://api.themoviedb.org/3/account/${accountId}/watchlist/movies`, fetchOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.results.length < 1) {
                mainElm.innerHTML = `
                    <p class="error">Your watchlist is empty</p>
                `;
            } else {
                mainElm.innerHTML += data.results.map(movie => {
                    // console.log(movie);

                    let movieId = movie.id;
                    let moviePosterUrl = getImage(movie.poster_path, imgUrlSmall);

                    let movieTitle = movie.title;

                    let imdbRating = movie.vote_average.toFixed(1);
                    let movieReleaseDate = formatDate(movie.release_date);

                    let movieGenreIds = movie.genre_ids;

                    return `
                        <article class="userlist__movie">
                            <a href="details.html?id=${movieId}">
                                <img loading="lazy" src="${moviePosterUrl}" alt="${movieTitle}" class="movie__poster">
                            </a>

                            <div class="movie__text">
                                <a href="details.html?id=${movieId}">
                                    <h3 class="movie__title">
                                        ${movieTitle}
                                    </h3>
                                </a>

                                <span class="movie__rating">
                                    <i class="fa-solid fa-star movie__rating__icon"></i> ${imdbRating}/10 IMDb
                                </span>

                                <div class="movie__genre__container">
                                    ${addGenres(movieGenreIds)}
                                </div>

                                <span class="movie__releasedate">
                                    <i class="fa-regular fa-calendar movie__releasedate__icon"></i> ${movieReleaseDate}
                                </span>
                            </div>

                            <i class="fa-solid fa-xmark bookmark__remove" data-id="${movieId}"></i>
                        </article>
                `;
                }).join("");


                let removeBtns = document.querySelectorAll(".bookmark__remove");
                removeBtns.forEach(btn => {
                    btn.addEventListener("click", watchlistAddRemove);
                });
            }

        });
}