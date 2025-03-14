
// --- LAYOUT --- //

let headerText = "Login";

root.innerHTML = `
    <header>
        ${headerContent(headerText)}
    </header>

    <main>
    </main>

    <footer>
        ${footerContent()}
    </footer>
`;

let mainElm = root.querySelector("main");



let search = window.location.search;
let params = new URLSearchParams(search);
let login = params.get("login");

if (login === "session") {
    loginSession();
} else {
    loginRequest();
}



// --- REQUEST --- //

function loginRequest() {
    fetch('https://api.themoviedb.org/3/authentication/token/new', fetchOptions)
        .then(res => res.json())
        .then(data => {
            // console.log(data);

            mainElm.innerHTML = `
            <div class="centered">
                <a href="https://www.themoviedb.org/authenticate/${data.request_token}?redirect_to=${websiteUrl}login.html?login=session" class="request__link">
                    Authenticate your<br>
                    TheMovieDB account
                </a>
                </div>
            `;
        })
        .catch(err => console.error(err));
}



// --- LOGIN --- //

function loginSession() {
    mainElm.innerHTML = `
    <div class="centered">
        <form action="" class="login">
            <div class="login__field">
                <label for="username">Username:</label>
                <input type="text" name="username" id="username">
            </div>

            <input type="submit" value="Login" class="login__submit">
        </form>
        </div>
    `;

    let loginForm = document.querySelector(".login");
    loginForm.addEventListener("submit", loginValidate);
}


function loginValidate(e) {
    e.preventDefault();

    let usernameInput = document.querySelector("#username").value;

    let requestToken = params.get("request_token");


    let sessionOptions = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MGFjZmQ1ZjdkYjE4NTg3ODIwOWIyOWMyNjliZDA5MyIsIm5iZiI6MTc0MDk4Njg5OC44MTksInN1YiI6IjY3YzU1YTEyNDhlZTkwMTVhYjdhNzdjMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vxAco2_Frj2mlMbkhkhRlYw_qBdStlQQocSMFaS9vQI'
        },
        body: JSON.stringify({ request_token: requestToken })
    };

    fetch('https://api.themoviedb.org/3/authentication/session/new', sessionOptions)
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            let loginAlert = document.createElement("div");
            loginAlert.className = "login__alert";
            loginAlert.innerHTML = `
                    <p>You have been logged in</p>
                    <a href="index.html">Return to front page</a>
                `;

            if (data.success) {
                saveToLocalStorage("sessionId", data.session_id);
                saveToLocalStorage("accountId", usernameInput);

                saveToLocalStorage("isLoggedIn", true);

                alert("You have been logged in, returning to front page");
                window.location.href = `${websiteUrl}index.html`;
            } else {
                alert(data.status_message);
            }
        })
        .catch(err => console.error(err));

}