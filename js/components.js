
// --- VARIABLES --- //

const root = document.querySelector("#app");


const fetchOptions = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MGFjZmQ1ZjdkYjE4NTg3ODIwOWIyOWMyNjliZDA5MyIsIm5iZiI6MTc0MDk4Njg5OC44MTksInN1YiI6IjY3YzU1YTEyNDhlZTkwMTVhYjdhNzdjMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vxAco2_Frj2mlMbkhkhRlYw_qBdStlQQocSMFaS9vQI"
    }
};



// --- LAYOUT --- //

function headerContent(headline) {
    return `
        <nav class="header__nav">
            <a href="login.html" class="login__link">
                <i class="fa-solid fa-user"></i>
            </a>

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
                    <i class="fa-solid fa-house footer__icon home"></i>
                    </a>
                </li>
                <li class="menu__item">
                    <a href="userlist.html?list=ratings" class="menu__link">
                        <i class="fa-solid fa-star footer__icon ratings"></i>
                    </a>
                </li>
                <li class="menu__item">
                    <a href="userlist.html?list=watchlist" class="menu__link">
                        <i class="fa-solid fa-bookmark footer__icon watchlist"></i>
                    </a>
                </li>
            </menu>
        </nav>
    `;
}

function footerActivePage(page) {
    let footerIcons = root.querySelectorAll(".footer__icon");
    footerIcons.forEach(icon => {
        if (icon.classList.contains(page)) {
            icon.classList.add("footer__icon--active");
        }
    });
}



// --- IMAGES --- //

let imgUrlSmall = "https://image.tmdb.org/t/p/w185";
let imgUrlMedium = "https://image.tmdb.org/t/p/w342";
let imgUrlLarge = "https://image.tmdb.org/t/p/w780";


function getImage(path, size) {
    if (!path) {
        return "/svg/placeholder.svg";
    } else {
        return size + path;
    }
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



// --- GENRES --- //

let genreList = [];

fetch('https://api.themoviedb.org/3/genre/movie/list', fetchOptions)
    .then(res => res.json())
    .then(data => {
        data.genres.forEach(genre => {
            genreList.push(genre);
        });
    });


function addGenres(genreIds) {
    return genreIds.map(id => {
        let genreName = genreList.find(genre => genre.id === id).name;
        return `<span class="movie__genre">${genreName}</span>`;
    }).join("");
}


// let genreList = [
//     {
//         "id": 28,
//         "name": "Action"
//     },
//     {
//         "id": 12,
//         "name": "Adventure"
//     },
//     {
//         "id": 16,
//         "name": "Animation"
//     },
//     {
//         "id": 35,
//         "name": "Comedy"
//     },
//     {
//         "id": 80,
//         "name": "Crime"
//     },
//     {
//         "id": 99,
//         "name": "Documentary"
//     },
//     {
//         "id": 18,
//         "name": "Drama"
//     },
//     {
//         "id": 10751,
//         "name": "Family"
//     },
//     {
//         "id": 14,
//         "name": "Fantasy"
//     },
//     {
//         "id": 36,
//         "name": "History"
//     },
//     {
//         "id": 27,
//         "name": "Horror"
//     },
//     {
//         "id": 10402,
//         "name": "Music"
//     },
//     {
//         "id": 9648,
//         "name": "Mystery"
//     },
//     {
//         "id": 10749,
//         "name": "Romance"
//     },
//     {
//         "id": 878,
//         "name": "Science Fiction"
//     },
//     {
//         "id": 10770,
//         "name": "TV Movie"
//     },
//     {
//         "id": 53,
//         "name": "Thriller"
//     },
//     {
//         "id": 10752,
//         "name": "War"
//     },
//     {
//         "id": 37,
//         "name": "Western"
//     }
// ];



// let movieTrailerUrl = data.videos.results.find((video) => video.type === "Trailer").key
// function addBackdrop(trailerUrl, imageUrl) {
//     if (trailerUrl) {
//         return `
//             <iframe src="https://www.youtube.com/embed/${trailerUrl}?si=muxwYGF8RtimRUnb" title="YouTube video player" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
//         `;
//     } else {
//         return `
//             <img src="${imageUrl}" alt="" class="movie__trailer">
//         `;
//     }
// }