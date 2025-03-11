
// --- VARIABLES --- //

const root = document.querySelector("#app");


const fetchOptions = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MGFjZmQ1ZjdkYjE4NTg3ODIwOWIyOWMyNjliZDA5MyIsIm5iZiI6MTc0MDk4Njg5OC44MTksInN1YiI6IjY3YzU1YTEyNDhlZTkwMTVhYjdhNzdjMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vxAco2_Frj2mlMbkhkhRlYw_qBdStlQQocSMFaS9vQI"
    }
};


let imgUrlSmall = "https://image.tmdb.org/t/p/w200";
let imgUrlLarge = "https://image.tmdb.org/t/p/w500";
let imgUrlOriginal = "https://image.tmdb.org/t/p/original";



// --- LAYOUT --- //

function headerContent(headline) {
    return `
        <nav class="header__nav">
            <i class="fa-solid fa-bars-staggered"></i>

            <h1 class="header__headline">${headline}</h1>

            <label class="darkmode">
                <input type="checkbox" class="darkmode__switch">
                <span class="darkmode__slider"></span>
            </label>
        </nav>
    `;
}


function footerContent() {
    return `
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
    `;
}



// --- FORMATTING & CALC --- //

function calcRuntime(num) {
    let hours = Math.floor(num / 60);
    let minutes = num % 60;

    let result = `${hours}h ${minutes}m`;

    return result;
}


function formatLanguage(input) {
    let lang = new Intl.DisplayNames(['en'], { type: 'language' });
    return lang.of(input);
}


function formatDate(input) {
    let dateOptions = {
        weekday: "narrow",
        year: "numeric",
        month: "numeric",
        day: "numeric",
    };

    let date = new Date(input);
    let dateFormatted = new Intl.DateTimeFormat("da-DK", dateOptions).format(date).slice(2);
    let result = dateFormatted.replaceAll(".", "/");

    return result;
}



// --- GENRES --- //

function addGenres() {
    fetch('https://api.themoviedb.org/3/genre/movie/list', fetchOptions)
        .then(res => res.json())
        .then(data => {
            let movieGenreContainers = document.querySelectorAll(".movie__genre__container");
            movieGenreContainers.forEach(container => {
                let movieId = container.getAttribute("data-id");
                let genreList = data.genres;
                let movieGenres = readFromLocalStorage(movieId);

                container.innerHTML = movieGenres.map(genre => {
                    let genreName = genreList.find(genreList => genreList.id === genre).name;
                    return `<span class="movie__genre">${genreName}</span>`;
                }).join("");
            });
        });
}



// --- RATING --- //

let countryChosen = "US";

function getRating(countryChosen, data) {
    let country = data.release_dates.results.find((country) => country.iso_3166_1 === countryChosen);
    let rating = "N/A";

    if (country) {
        country.release_dates.forEach((release) => {
            if (release.certification) {
                rating = release.certification;
            }
        });
    } else {
        rating = rating;
    }

    return rating;
}