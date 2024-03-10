import { signUp } from "../javascript/authen.js"
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
        console.log(password_1);
        console.log(alphanumeric.test(password_1));
        if (!alphanumeric.test(password_1.value) || !alphanumeric.test(password_2.value)){
            error_message.innerText = "Could not signup. Passwords must be alphanumeric.";
        }
        else if (password_1.value !== password_2.value) {
            error_message.innerText = "Could not signup. Passwords must match.";
        } else {
            signUp(username.value, password_1.value).then(response => {
                if (response.localId) {
                    window.location = "../html/home.html";
                }
                else if (response.error.code === 400) {
                    console.log("code 400");
                    error_message.innerText = response.error.message;
                }

            })
        }
    });
});
