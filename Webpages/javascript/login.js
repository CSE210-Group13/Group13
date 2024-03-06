import {login} from "../javascript/authen.js"
const LOCAL_STORAGE_USER_KEY = 'uuid';

document.addEventListener("DOMContentLoaded", function() {
    // Get the form element
    var button = document.querySelector(".login-btn");
    var username = document.getElementById("username");
    var password = document.getElementById("password"); 
    // Add submit event listener to the form
    button.addEventListener("click", function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Perform any client-side validation or other operations here
        console.log(username.value); 
        console.log(password.value); 
        // Submit the form
        submitForm();
    });

    // Function to submit the form
    function submitForm() {
        // Optionally, perform additional tasks before submitting the form
        console.log("submitting login")
        
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, username.value);
        // Submit the form
        form.submit();
    }
});
