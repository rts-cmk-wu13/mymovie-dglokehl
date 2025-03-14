
// --- ACCOUNT --- //

let accountId = "dglokehl";

// let requestToken = "87f22b230f6c82600045ecd7a728c414caca0312"
let sessionId = "0332fe98bdca3666ae453bdf67a616d1415d5c13";



// --- REQUEST TOKEN --- //

function fetchRequestToken() {
    fetch('https://api.themoviedb.org/3/authentication/token/new', fetchOptions)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            requestToken = data.request_token;
            saveToLocalStorage("requestToken", data.request_token);
        })
        .catch(err => console.error(err));
}
// fetchRequestToken();



// --- SESSION ID --- //

function fetchCreateSession() {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MGFjZmQ1ZjdkYjE4NTg3ODIwOWIyOWMyNjliZDA5MyIsIm5iZiI6MTc0MDk4Njg5OC44MTksInN1YiI6IjY3YzU1YTEyNDhlZTkwMTVhYjdhNzdjMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vxAco2_Frj2mlMbkhkhRlYw_qBdStlQQocSMFaS9vQI'
        },
        body: JSON.stringify({ request_token: requestToken })
    };

    fetch('https://api.themoviedb.org/3/authentication/session/new', options)
        .then(res => {
            console.log("createSession - res", res);
            return res.json();
        })
        .then(data => {
            console.log("createSession - data", data);
            saveToLocalStorage("sessionId", data.session_id);
        })
        .catch(err => console.error(err));
}
// fetchCreateSession();