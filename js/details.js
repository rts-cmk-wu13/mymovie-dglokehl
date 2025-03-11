
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


fetch(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=account_states%2Ccredits%2Crelease_dates&session_id=${sessionId}&language=en-US`, fetchOptions)
    .then(res => res.json())
    .then(data => {
        console.log(data);

        let movieBackgroundUrl = imgUrlOriginal + data.backdrop_path;

        let movieTitle = data.title;
        let imdbRating = data.vote_average.toFixed(1);

        let movieLength = calcRuntime(data.runtime);
        let movieLanguage = formatLanguage(data.original_language);
        let movieRating = getRating(countryChosen, data);

        let movieDesc = data.overview;

        let movieWatchlist = data.account_states.watchlist;

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

        let genreList = data.genres;
        let genreIds = [];
        genreList.forEach(genre => {
            genreIds.push(genre.id);
        });
        saveToLocalStorage(movieId, genreIds);
        addGenres();


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

                let actorImgUrl = actor.profile_path;
                let actorName = actor.name;


                return `
                    <article class="actor">
                        <img src="${imgUrlSmall + actorImgUrl}" alt="${actorName}" class="actor__img">
                        <h3>${actorName}</h3>
                    </article>
                `;
            }).join("");
        }
        castMap(castListShort);


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


        let bookmarkBtn = document.querySelector(".bookmark__btn");
        bookmarkBtn.addEventListener("click", addToWatchlist);
    })
    .catch(err => console.error(err));