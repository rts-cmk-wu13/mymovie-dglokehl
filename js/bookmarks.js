
// --- LAYOUT --- //

root.innerHTML = `
    <header>
        <nav class="header__nav">
            <i class="fa-solid fa-bars"></i>

            <h1 class="header__headline">Bookmarks</h1>

            <label class="darkmode">
                <input type="checkbox" class="darkmode__switch">
                <span class="darkmode__slider"></span>
            </label>
        </nav>
    </header>

    <main>
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

let mainElm = root.querySelector("main");



// --- MAIN  --- //


if (readFromLocalStorage("bookmarks").length > 0) {
    bookmarkArray = readFromLocalStorage("bookmarks");    
} else {
    bookmarkArray = [];
    
    mainElm.innerHTML = `
        <p class="error">You have no bookmarks</p>
    `
}
console.log(bookmarkArray);

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