
// --- LAYOUT --- //

root.innerHTML = `
    <header>
        <nav class="header__nav">
            <a href="index.html" class="backarrow">
                <i class="fa-solid fa-arrow-left-long"></i>
            </a>
            <label class="darkmode">
                <input type="checkbox" class="darkmode__switch">
                <span class="darkmode__slider"></span>
            </label>
        </nav>
    </header>

    <div class="main__wrapper"></div>
`;

let mainWrapper = root.querySelector(".main__wrapper");




// --- MAIN  --- //

let search = window.location.search;
let params = new URLSearchParams(search);
let movieId = params.get("id");



fetch(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits%2Crelease_dates%2Cvideos%2Caccount_states&session_id=${sessionId}&language=en-US`, fetchOptions)
    .then(res => res.json())
    .then(data => {
        // console.log(data);

        let movieUserRating;
        let movieWatchlist;
        if (isLoggedIn) {
            movieUserRating = data.account_states.rated.value;
            movieWatchlist = data.account_states.watchlist;
        } else {
            movieUserRating = 0;
            movieWatchlist = false;
        }


        let movieBackgroundUrl = getImage(data.backdrop_path, imgUrlLarge);

        let movieTitle = data.title;
        document.title = `MyMovies - ${movieTitle}`;

        let imdbRating = data.vote_average.toFixed(1);
        let movieLength = calcRuntime(data.runtime);
        let movieLanguage = formatLanguage(data.original_language);
        let movieRating = getRating(countryChosen, data);

        let movieDesc = data.overview;


        let bookmarkBtnFill;
        if (movieWatchlist) {
            bookmarkBtnFill = "solid";
        } else {
            bookmarkBtnFill = "regular";
        }


        mainWrapper.innerHTML = `
            <figure class="movie__trailer__wrapper">
                <img src="${movieBackgroundUrl}" alt="${movieTitle}" class="movie__trailer">
            </figure>

            <main>
                <section class="movie__details">
                    <h1 class="movie__headline">${movieTitle}</h1>
                    <i class="fa-${bookmarkBtnFill} fa-bookmark bookmark__btn" data-id="${movieId}"></i>

                    <div class="movie__rating">
                        <i class="fa-solid fa-star movie__rating__icon"></i>
                        <span>${imdbRating}/10 IMDb</span>
                    </div>

                    <div class="movie__genre__container" data-id="${movieId}"></div>

                    <div class="movie__info">
                        <div>
                            <p class="movie__info__text">Length</p>
                            <p class="movie__info__text">${movieLength}</p>
                        </div>

                        <div>
                            <p class="movie__info__text">Language</p>
                            <p class="movie__info__text">${movieLanguage}</p>
                        </div>

                        <div>
                            <p class="movie__info__text">Rating</p>
                            <p class="movie__info__text">${movieRating}</p>
                        </div>
                    </div>

                    <div class="movie__userrating" data-id="${movieId}" data-rating="${movieUserRating}"></div>
                </section>

                <section>
                    <h2 class="section__headline">Description</h2>
                    <p class="movie__description">${movieDesc}</p>
                </section>

                <section>
                    <h2 class="section__headline">
                        Cast
                        <span class="seemore__btn cast__seemore">See more</span>
                    </h2>
                    <div class="gallery movie__cast"></div>
                </section>
            </main>
        `;



        // --- WATCHLIST --- //

        let bookmarkBtn = document.querySelector(".bookmark__btn");
        bookmarkBtn.addEventListener("click", watchlistAddRemove);



        // --- GENRES --- //

        let movieGenreContainer = document.querySelector(".movie__genre__container");
        movieGenreContainer.innerHTML = data.genres.map(genre => {
            let genreName = genre.name;
            return `<span class="movie__genre">${genreName}</span>`;
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



        // --- SEE MORE --- //

        let seemoreBtn = document.querySelector(".seemore__btn");
        seemoreBtn.addEventListener("click", function () {
            if (seemoreBtn.classList.contains("active")) {
                castMap(castListShort);
                seemoreBtn.classList.remove("active");
                seemoreBtn.textContent = "See more";
            } else {
                castMap(castList);
                seemoreBtn.classList.add("active");
                seemoreBtn.textContent = "See less";
            }
        });



        // --- CAST --- //

        let movieCastContainer = document.querySelector(".movie__cast");
        let castList = data.credits.cast;
        // console.log(castList);

        let castListShort;
        if (castList.length > 4) {
            castListShort = castList.slice(0, 4);
        } else {
            castListShort = castList;
        }

        function castMap(array) {
            movieCastContainer.innerHTML = array.map(actor => {
                // console.log(actor);

                let actorImgUrl = getImage(actor.profile_path, imgUrlSmall);
                let actorName = actor.name;

                return `
                    <article class="actor">
                        <img loading="lazy" src="${actorImgUrl}" alt="${actorName}" class="actor__img">
                        <h3>${actorName}</h3>
                    </article>
                `;
            }).join("");
        }
        castMap(castListShort);

    })
    .catch(err => console.error(err));