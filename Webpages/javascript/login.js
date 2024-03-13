import { login } from "../javascript/authen.js"
const LOCAL_STORAGE_USER_KEY = 'uuid';

document.addEventListener("DOMContentLoaded", function () {
    // Get the form element
    var login_form = document.getElementById("login-form");
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    let error_msg = document.querySelector('.error-message');
    // Add submit event listener to the form
    login_form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent default form submission

        // Perform any client-side validation or other operations here

        login(username.value, password.value).then(response => { 
            if (!response.localId) {
                error_msg.innerText = "Login incorrect";
            }
            else {
                localStorage.setItem(LOCAL_STORAGE_USER_KEY, response.localId);
                window.location.href = "../html/home.html";
            }
        });
    });
});
