import { signUp } from "../javascript/authen.js"
document.addEventListener("DOMContentLoaded", function () {
    // Get the form element
    var form = document.querySelector(".signup-form");
    var username = document.getElementById("username");
    var password_1 = document.getElementById("password1");
    var password_2 = document.getElementById("password2");
    var error_messege = document.querySelector('.signup-form .error-messege');

    // Add submit event listener to the form
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Perform any client-side validation or other operations here

        if (password_1.value !== password_2.value) {
            error_messege.innerText = "two passwords do not match";
        } else {
            signUp(username.value, password_1.value).then(response => {
                if (response.localId) {
                    window.location = "../html/home.html";
                }
                else if (response.error.code === 400) {
                    console.log("code 400");
                    error_messege.innerText = response.error.message;
                }

            })
        }
    });
});
