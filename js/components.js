
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


// --- BOOKMARKS --- //

let bookmarkArray = [];

function bookmarkStorage() {
    let bookmarkBtn = document.querySelector(".bookmark__btn");
    bookmarkBtn.addEventListener("click", bookmarkAddRemove);

    let id = bookmarkBtn.getAttribute("data-id");
    if (readFromLocalStorage("bookmarks") !== null) {
        bookmarkArray = readFromLocalStorage("bookmarks");

        if (bookmarkArray.includes(id)) {
            bookmarkBtn.className = "fa-solid fa-bookmark bookmark__btn";
        }
    } else {
        bookmarkArray = [];
    }
}

function bookmarkAddRemove() {
    let id = this.getAttribute("data-id");


    if (this.classList.contains("fa-solid")) {
        this.classList.add("fa-regular");
        this.classList.remove("fa-solid");

        bookmarkArray.splice(bookmarkArray.indexOf(id), 1);
        deleteFromLocalStorage("bookmarks", bookmarkArray);
    } else {
        this.classList.add("fa-solid");
        this.classList.remove("fa-regular");

        bookmarkArray.push(id);
        saveToLocalStorage("bookmarks", bookmarkArray);
    }
    console.log(bookmarkArray);
};