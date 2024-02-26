document.addEventListener("DOMContentLoaded", function() {
    // Get the form element
    var form = document.getElementById("signup-form");

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
        console.log("submitting signup")
        
        // Submit the form
        form.submit();
    }
});
