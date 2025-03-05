
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

fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, fetchOptions)
    .then(res => res.json())
    .then(data => {
        console.log(data);

        let movieBackgroundUrl = imgUrlOriginal + data.backdrop_path;
        // mainWrapper.style.backgroundImage = `url(${movieBackgroundUrl})`

        let movieTitle = data.title;
        let imdbRating = data.vote_average.toFixed(1);

        let movieLength = calcRuntime(data.runtime);
        let movieLanguage = formatLanguage(data.original_language);
        let movieReleaseDate = formatDate(data.release_date);

        let movieDesc = data.overview;


        mainWrapper.innerHTML = `
            <figure class="movie__trailer__wrapper">
                <img src="${movieBackgroundUrl}" alt="${movieTitle}" class="movie__trailer">
            </figure>

            <main>
                <section class="movie__details">
                    <h1 class="movie__headline">${movieTitle}</h1>
                    <i class="fa-regular fa-bookmark movie__bookmark"></i>

                    <div class="movie__rating">
                        <i class="fa-solid fa-star movie__rating__icon"></i>
                        <span>${imdbRating}/10 IMDb</span>
                    </div>

                    <div class="movie__genre__container"></div>

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
                            <p class="movie__info__text">Release Date</p>
                            <p class="movie__info__text">${movieReleaseDate}</p>
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

        fetch('https://api.themoviedb.org/3/genre/movie/list', fetchOptions)
            .then(res => res.json())
            .then(data => {
                let genreList = data.genres;
                // console.log(genreList);

                let movieGenreContainer = document.querySelector(".movie__genre__container");
                let genreIds = readFromLocalStorage(movieId);

                movieGenreContainer.innerHTML += genreIds.map(genre => {
                    let genreName = findGenreName(genreList, genre);
                    return `<span class="movie__genre">${genreName}</span>`;
                }).join("");
            });

        let movieCastContainer = document.querySelector(".movie__cast");

        fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, fetchOptions)
            .then(res => res.json())
            .then(data => {
                // console.log(data.cast);

                let cast;
                if (data.cast.length > 4) {
                    cast = data.cast.slice(0, 4);
                } else {
                    cast = data.cast;
                }

                movieCastContainer.innerHTML += cast.map(actor => {
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
            });
    })
    .catch(err => console.error(err));