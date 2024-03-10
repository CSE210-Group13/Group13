import { login } from "../javascript/authen.js"
const LOCAL_STORAGE_USER_KEY = 'uuid';

document.addEventListener("DOMContentLoaded", function () {
    // Get the form element
    var login_form = document.getElementById("login-form");
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    // Add submit event listener to the form
    login_form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent default form submission

        // Perform any client-side validation or other operations here

        login(username.value, password.value).then(response => { 
            if (response.localId){
                window.location.href = "../html/home.html";
            }
        });
    });
});
