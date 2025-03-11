
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


fetch(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits%2Crelease_dates&language=en-US`, fetchOptions)
    .then(res => res.json())
    .then(data => {
        console.log(data);

        let movieBackgroundUrl = imgUrlOriginal + data.backdrop_path;

        let movieTitle = data.title;
        let imdbRating = data.vote_average.toFixed(1);

        let movieLength = calcRuntime(data.runtime);
        let movieLanguage = formatLanguage(data.original_language);
        let movieReleaseDate = formatDate(data.release_date);
        let movieRating = getRating(countryChosen, data);

        let movieDesc = data.overview;

        let movieObjectId = `OBJ${movieId}`;
        let movieObject = {
            "id": movieId,
            "poster": imgUrlLarge + data.poster_path,
            "title": movieTitle,
            "rating": imdbRating,
            "release_date": movieReleaseDate,
        };

        saveToLocalStorage(movieObjectId, movieObject);



        mainWrapper.innerHTML = `
            <figure class="movie__trailer__wrapper">
                <img src="${movieBackgroundUrl}" alt="${movieTitle}" class="movie__trailer">
            </figure>

            <main>
                <section class="movie__details">
                    <h1 class="movie__headline">${movieTitle}</h1>
                    <i class="fa-regular fa-bookmark bookmark__btn" data-id="${movieId}"></i>

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

        bookmarkStorage();


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
    })
    .catch(err => console.error(err));



// --- BOOKMARKS --- //

let bookmarkArray = [];

function bookmarkStorage() {

    let bookmarkBtn = document.querySelectorAll(".bookmark__btn");
    // console.log(bookmarkBtn);
    bookmarkBtn.forEach(btn => {
        let btnId = btn.getAttribute("data-id");
        let movieObject = readFromLocalStorage("OBJ" + btnId);

        // let movieObjectArray = Object.entries(movieObject);

        if (readFromLocalStorage("bookmarks") !== null) {
            bookmarkArray = readFromLocalStorage("bookmarks");
            console.log("step 1 - bookmarks has content");

            if (bookmarkArray.find(i => i.id === btnId)) {
                console.log("step 2a - id in bookmarks");

                btn.className = "fa-solid fa-bookmark bookmark__btn";
            } else {
                console.log("step 2b - id not in bookmarks");
            }
        } else {
            console.log("step 0 - bookmarks is empty");

            bookmarkArray = [];
        }

        btn.addEventListener("click", function () {
            let index = bookmarkArray.findIndex(i => i.id === btnId);

            if (index !== -1) {
                console.log("removing", btnId);

                this.classList.add("fa-regular");
                this.classList.remove("fa-solid");

                bookmarkArray.splice(index, 1);
                deleteFromLocalStorage("bookmarks", bookmarkArray);
            } else {
                console.log("adding", btnId);

                this.classList.add("fa-solid");
                this.classList.remove("fa-regular");

                bookmarkArray.push(movieObject);
                saveToLocalStorage("bookmarks", bookmarkArray);
            }

            console.log(bookmarkArray);
        });
    });
}


mainElm.innerHTML += bookmarkArray.map(movie => {
    let movieId = movie.id;
    let moviePosterUrl = movie.poster;

    let movieTitle = movie.title;
    let imdbRating = movie.rating;
    let movieReleaseDate = movie.release_date;

    return `
        <article class="bookmark__movie">
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

                <div class="movie__genre__container" data-id="${movieId}"></div>
                        
                <span class="movie__releasedate">
                    <i class="fa-regular fa-calendar"></i> ${movieReleaseDate}
                </span>
            </div>
            <i class="fa-solid fa-xmark bookmark__remove" data-id="${movieId}"></i>
        </article>`;
}).join("");

let removeBtns = document.querySelectorAll(".bookmark__remove");
removeBtns.forEach(btn => {
    btn.addEventListener("click", function () {
        let btnId = btn.getAttribute("data-id");
        let index = bookmarkArray.findIndex(i => i.id === btnId);

        bookmarkArray.splice(index, 1);
        deleteFromLocalStorage("bookmarks", bookmarkArray);
        btn.parentElement.remove();
    });
});