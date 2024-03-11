import { signUp } from "../javascript/authen.js";
const LOCAL_STORAGE_USER_KEY = 'uuid';


document.addEventListener("DOMContentLoaded", function () {
    // Get the form element
    var form = document.querySelector(".signup-form");
    var username = document.getElementById("username");
    var password_1 = document.getElementById("password1");
    var password_2 = document.getElementById("password2");
    var error_message = document.querySelector('.error-message');

    // Add submit event listener to the form
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Perform any client-side validation or other operations here

        let alphanumeric = /^[a-zA-Z0-9]*$/
        if (!alphanumeric.test(password_1.value) || !alphanumeric.test(password_2.value)){
            error_message.innerText = "Could not signup. \nPasswords must be alphanumeric.";
        }
        else if (password_1.value !== password_2.value) {
            error_message.innerText = "Could not signup. \nPasswords must match.";
        } 
        else if (password_1.value.length < 6) {
            error_message.innerText = "Could not signup. \nPasswords must be at least 6 characters";
        }
        else {
            signUp(username.value, password_1.value).then(response => {
                if (!response.localId) {
                    if (response.error.message == "INVALID_EMAIL") {
                        error_message.innerText = "Invalid email. \nPlease input a valid email.";
                    }
                    else if (response.error.message == "EMAIL_EXISTS") {
                        error_message.innerText = "An account with this email already exists. \nPlease login";
                    }
                    else {
                        error_message.innerText = "An error occurred. \nPlease try again";
                    }
                }
                else {
                    localStorage.setItem(LOCAL_STORAGE_USER_KEY, response.localId);
                    window.location = "../html/home.html";
                }
            })
        }
    });
});
