
// --- LOCALSTORAGE --- //

function saveToLocalStorage(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
};

function deleteFromLocalStorage(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
};

function readFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
};



// --- WATCHLIST --- //

function addToWatchlist() {
    let movieId = this.getAttribute("data-id");


    let watchlistBoolean;
    if (this.classList.contains("fa-solid")) {
        watchlistBoolean = false;

        this.classList.add("fa-regular");
        this.classList.remove("fa-solid");
    } else {
        watchlistBoolean = true;

        this.classList.add("fa-solid");
        this.classList.remove("fa-regular");
    }


    let watchlistOptions = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MGFjZmQ1ZjdkYjE4NTg3ODIwOWIyOWMyNjliZDA5MyIsIm5iZiI6MTc0MDk4Njg5OC44MTksInN1YiI6IjY3YzU1YTEyNDhlZTkwMTVhYjdhNzdjMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vxAco2_Frj2mlMbkhkhRlYw_qBdStlQQocSMFaS9vQI'
        },
        body: JSON.stringify({ media_type: 'movie', media_id: movieId, watchlist: watchlistBoolean })
    };


    fetch(`https://api.themoviedb.org/3/account/${accountId}/watchlist`, watchlistOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => console.error(err));
}



function removeFromWatchlist() {
    let movieId = this.getAttribute("data-id");
    let movieElm = this.parentElement;


    const watchlistOptions = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MGFjZmQ1ZjdkYjE4NTg3ODIwOWIyOWMyNjliZDA5MyIsIm5iZiI6MTc0MDk4Njg5OC44MTksInN1YiI6IjY3YzU1YTEyNDhlZTkwMTVhYjdhNzdjMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vxAco2_Frj2mlMbkhkhRlYw_qBdStlQQocSMFaS9vQI'
        },
        body: JSON.stringify({ media_type: 'movie', media_id: movieId, watchlist: false })
    };


    fetch(`https://api.themoviedb.org/3/account/${accountId}/watchlist`, watchlistOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            movieElm.remove();
        })
        .catch(err => console.error(err));
}