
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



// --- FUNCTIONS --- //

function saveToLocalStorage(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
};

function deleteFromLocalStorage(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
};

function readFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
};

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

function findGenreName(list, genreId) {
    return list.find(list => list.id === genreId).name;
}


// function seeMoreLess() {
//     let container = this.parentElement.parentElement;

//     let exitBtn = document.createElement("i");
//     exitBtn.className = "fa-solid fa-xmark gallery__exit";

//     if (!container.classList.contains("expanded")) {
//         container.classList.add("expanded");
//         container.prepend(exitBtn);
//     }

//     exitBtn.addEventListener("click", function() {
//         if (container.classList.contains("expanded")) {
//             container.classList.remove("expanded")
//             exitBtn.remove()
//         }
//     })
// }