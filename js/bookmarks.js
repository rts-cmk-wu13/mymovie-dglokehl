
// --- LAYOUT --- //

root.innerHTML = `
    <header>
        ${headerContent("Bookmarks")}
    </header>

    <main>
    </main>

    <footer>
        ${footerContent()}
    </footer>
`;

let mainElm = root.querySelector("main");



// --- MAIN  --- //

function fetchWatchlist() {
    fetch(`https://api.themoviedb.org/3/account/${accountId}/watchlist/movies`, fetchOptions)
        .then(res => res.json())
        .then(data => {
            // console.log(data);

            let movieList = data.results;
            console.log(movieList);

            mainElm.innerHTML += movieList.map(movie => {
                // console.log(movie);

                let movieId = movie.id;
                let moviePosterUrl = imgUrlSmall + movie.poster_path;

                let movieTitle = movie.title;

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
                        </div>

                        <i class="fa-solid fa-xmark bookmark__remove" data-id="${movieId}"></i>
                    </article>
                `;
            }).join("");
            let removeBtns = document.querySelectorAll(".bookmark__remove");
            removeBtns.forEach(btn => {
                btn.addEventListener("click", removeFromWatchlist);
            });

        });
}
fetchWatchlist();