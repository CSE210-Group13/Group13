export const LOCAL_STORAGE_USER_KEY = 'uuid';

document.addEventListener("DOMContentLoaded", function() {
    // Get the form element
    var form = document.getElementById("login-form");
    var username = document.getElementById("username");

    // Add submit event listener to the form
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Perform any client-side validation or other operations here
        
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
