
// --- VARIABLES --- //

const root = document.querySelector("#app");

let guestId = "d5fddaa6e04f2ef80eb730decde771bb";

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
    
    let bookmarkBtn = document.querySelectorAll(".bookmark__btn");
    console.log(bookmarkBtn);
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
            let index = bookmarkArray.findIndex(i => i.id === btnId)

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