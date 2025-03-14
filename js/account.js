
// --- ACCOUNT --- //

let isLoggedIn;
if (readFromLocalStorage("isLoggedIn")) {
    isLoggedIn = true;
} else {
    isLoggedIn = false;
}
// console.log("Logged in:", isLoggedIn);


let accountId = readFromLocalStorage("accountId");
let sessionId = readFromLocalStorage("sessionId");


let websiteUrl = "https://mymovies-loke.netlify.app/";