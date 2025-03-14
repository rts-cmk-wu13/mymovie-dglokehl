
const rootElm = document.documentElement;

const switchElm = document.querySelector(".darkmode__switch");
switchElm.addEventListener("change", function () {
    if (switchElm.checked) {
        rootElm.setAttribute("data-dark", switchElm.checked);
    } else {
        rootElm.setAttribute("data-dark", switchElm.checked);
    }
    saveToLocalStorage("isDarkMode", switchElm.checked);
    // console.log(readFromLocalStorage("isDarkMode"));
});


let isDarkMode = JSON.parse(readFromLocalStorage("isDarkMode"));
let browserDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// console.log("matchMedia", browserDark);
// console.log("localStorage", isDarkMode);


let darkState;

if (isDarkMode === null) {
    darkState = browserDark;
} else {
    darkState = isDarkMode;
}

if (darkState) {
    switchElm.checked = true;
    rootElm.setAttribute("data-dark", switchElm.checked);
} else {
    switchElm.checked = false;
    rootElm.setAttribute("data-dark", switchElm.checked);
}