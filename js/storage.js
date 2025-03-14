
// --- LOCALSTORAGE --- //

function saveToLocalStorage(key, value) {
    return localStorage.setItem(key, value);
};

function deleteFromLocalStorage(key, value) {
    return localStorage.setItem(key, value);
};

function readFromLocalStorage(key) {
    return localStorage.getItem(key);
};



// --- WATCHLIST --- //

let loginErrorMessage = "Please log into your TheMovieDb account to use this feature";

function watchlistAddRemove() {
    if (isLoggedIn) {
        let movieId = this.getAttribute("data-id");


        let watchlistBoolean;
        if (this.classList.contains("bookmark__remove")) {
            watchlistBoolean = false;
            this.parentElement.remove();

        } else if (this.classList.contains("fa-solid")) {
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
    } else {
        alert(loginErrorMessage);
    }
}



// --- USER RATING --- //

function addUserRating(star, movie) {
    if (isLoggedIn) {
        let starNum = star.getAttribute("data-star");

        let starContainer = star.parentElement;


        let userRatingStars = Array.from(starContainer.querySelectorAll(".movie__userrating__icon"));
        // console.log(userRatingStars);

        let prevStars = userRatingStars.filter(elm => elm.getAttribute("data-star") < starNum);
        let nextStars = userRatingStars.filter(elm => elm.getAttribute("data-star") > starNum);


        let ratingOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MGFjZmQ1ZjdkYjE4NTg3ODIwOWIyOWMyNjliZDA5MyIsIm5iZiI6MTc0MDk4Njg5OC44MTksInN1YiI6IjY3YzU1YTEyNDhlZTkwMTVhYjdhNzdjMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vxAco2_Frj2mlMbkhkhRlYw_qBdStlQQocSMFaS9vQI'
            },
            body: JSON.stringify({ value: starNum })
        };

        fetch(`https://api.themoviedb.org/3/movie/${movie}/rating`, ratingOptions)
            .then(res => res.json())
            .then(data => {
                // console.log(data);

                if (star.classList.contains("fa-solid")) {
                    if (nextStars.some(elm => elm.classList.contains("fa-solid"))) {
                        nextStars.forEach(star => {
                            star.classList.add("fa-regular");
                            star.classList.remove("fa-solid");
                        });
                    } else if (starNum == 1) {
                        removeUserRating(movie);
                        if (document.URL.includes("ratings")) {
                            starContainer.parentElement.remove();
                        } else {
                            star.classList.add("fa-regular");
                            star.classList.remove("fa-solid");
                        }
                    }
                } else {
                    star.classList.add("fa-solid");
                    star.classList.remove("fa-regular");

                    prevStars.forEach(star => {
                        star.classList.add("fa-solid");
                        star.classList.remove("fa-regular");
                    });
                }
            })
            .catch(err => console.error(err));
    } else {
        alert(loginErrorMessage);
    }
}

function removeUserRating(movieId) {
    if (isLoggedIn) {
        const deleteOptions = {
            method: 'DELETE',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MGFjZmQ1ZjdkYjE4NTg3ODIwOWIyOWMyNjliZDA5MyIsIm5iZiI6MTc0MDk4Njg5OC44MTksInN1YiI6IjY3YzU1YTEyNDhlZTkwMTVhYjdhNzdjMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vxAco2_Frj2mlMbkhkhRlYw_qBdStlQQocSMFaS9vQI'
            }
        };

        fetch(`https://api.themoviedb.org/3/movie/${movieId}/rating`, deleteOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => console.error(err));
    } else {
        alert(loginErrorMessage);
    }
}