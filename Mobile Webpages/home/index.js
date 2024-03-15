var challenges = [
  ["Drink 8 cups of water throughout the day", "Food"],
  ["Stretch for 10 minutes", "Zen"],
  ["Do 10 pushups", "Workout"],
  ["Get happy time with friend", "Emotion"],
];

let buttonClicked = false;

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("refresh")
    .addEventListener("click", selectRandomChallenge);
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("bonus")
    .addEventListener("click", selectRandomChallenge);
});

document.addEventListener("DOMContentLoaded", function () {
  // Get the "Complete" element
  const completeElement = document.getElementById("Complete");

  // Get the "bonus" element
  const bonusElement = document.getElementById("bonus");

  // Get the "refresh" element
  const refreshElement = document.getElementById("refresh");

  // Add a click event listener to the "Complete" element
  completeElement.addEventListener("click", function () {
    // Get the image element inside the "Complete" element
    const imgElement = completeElement.querySelector("img");

    // Change the source of the image to "checkmark.svg"
    imgElement.src = "checkmark.svg";

    // Get the elements with class "Complete-text"
    const completeTextElements =
      completeElement.querySelectorAll(".Complete-text");

    // Change the text content of the first "Complete-text" element to "Completed!"
    completeTextElements[0].textContent = "Completed!";

    // Change the text content of the second "Complete-text" element to "Let's Share!"
    completeTextElements[1].textContent = "Let's Share!";

    // Remove the "disabled" class from the "bonus" element
    bonusElement.classList.remove("disabled");

    // Check if the challenge is marked as completed
    if (completeTextElements[0].textContent === "Completed!") {
      openCameraModal();
    }
  });

  bonusElement.addEventListener("click", resetCompleteElement);

  // Add a click event listener to the "refresh" element
  refreshElement.addEventListener("click", resetCompleteElement);

  function resetCompleteElement() {
    // Get the image element inside the "Complete" element
    const imgElement = completeElement.querySelector("img");

    // Change the source of the image back to "capture.svg"
    imgElement.src = "capture.svg";

    // Get the elements with class "Complete-text"
    const completeTextElements =
      completeElement.querySelectorAll(".Complete-text");

    // Change the text content of the first "Complete-text" element back to "Complete"
    completeTextElements[0].textContent = "Complete";

    // Change the text content of the second "Complete-text" element back to "& Share"
    completeTextElements[1].textContent = "& Share";

    // Add the "disabled" class to the "bonus" element
    bonusElement.classList.add("disabled");
  }

  completeElement.addEventListener("click", function () {
    const completeTextElement = this.querySelector(".Complete-text");
    if (completeTextElement.textContent === "Completed!") {
      openCameraModal();
    }
  });

  // Function to open the camera modal
  function openCameraModal() {
    cameraModal.style.display = "block";
    startCamera();
  }

  // Function to start the camera stream
  function startCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        cameraVideo.srcObject = stream;
        captureBtn.addEventListener("click", capturePhoto);
        buttonClicked = true;
      })
      .catch(function (error) {
        console.log("Error accessing the camera:", error);
      });
  }

  // Function to capture the photo
  function getImageSrcByBgColor() {
    // Get the current background color
    const bgColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--main-bg-color")
      .trim();

    // Mapping of background colors to image sources
    const colorToImageSrcMap = {
      "rgba(241, 156, 121, 0.5)": "dumbbell.svg", // Example for Workout
      "rgba(212, 224, 155, 1)": "food.svg", // Example for Food
      "rgba(203, 223, 189, 1)": "emotion.svg", // Example for Emotion
      "rgba(246, 224, 210, 1)": "zen.svg", // Example for Zen
      // Add more mappings as needed
    };

    // Return the image source based on the background color
    return colorToImageSrcMap[bgColor] || "default_image.svg"; // Provide a default image if no match is found
  }

  function capturePhoto() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = cameraVideo.videoWidth;
    canvas.height = cameraVideo.videoHeight;
    context.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);

    // Create a new canvas to combine the photo with challenge details and workout image
    const combinedCanvas = document.createElement("canvas");
    const combinedContext = combinedCanvas.getContext("2d");
    combinedCanvas.width = canvas.width + 40; // Increase width for frame
    combinedCanvas.height = canvas.height + 100; // Increase height for frame and text

    // Draw the frame
    combinedContext.fillStyle = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--main-bg-color");
    combinedContext.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

    // Draw the captured photo on the combined canvas
    combinedContext.drawImage(
      canvas,
      20, // Left margin for frame
      20, // Top margin for frame
      canvas.width,
      canvas.height
    );

    // Get the challenge details and workout image elements
    const challengeDetailElement = document.querySelector(".challenge-detail");
    const workoutImageElement = document.querySelector(".challenge-card img");

    // Draw the challenge details and workout image on the combined canvas
    combinedContext.fillStyle = "black";
    combinedContext.font = "24px Arial";
    combinedContext.fillText(
      "Daily Challenge Completed!",
      20,
      canvas.height + 50
    );
    combinedContext.fillText(
      challengeDetailElement.textContent,
      20,
      canvas.height + 80
    );
    combinedContext.fillText(
      challengeDetailElement.textContent,
      20,
      canvas.height + 80
    );

    // Check if the workoutImageElement exists before setting its src property
    workoutImageElement.src = getImageSrcByBgColor();

    workoutImageElement.onload = function () {
      combinedContext.drawImage(
        workoutImageElement,
        combinedCanvas.width - 68,
        canvas.height + 40,
        48,
        48
      );

      // Convert the combined canvas to a data URL
      const dataURL = combinedCanvas.toDataURL();

      // Close the camera view popup window
      closeCameraModalImage();

      // Display the captured image in the image block
      const capturedImage = document.getElementById("capturedImage");
      capturedImage.src = dataURL;
      const imageBlock = document.getElementById("imageBlock");

      if (imageBlock && buttonClicked) {
        imageBlock.style.display = "block"; // Make it visible
        buttonClicked = false;
      }
    };
    workoutImageElement.src = workoutImageElement.src;
  }

  // Function to close the image block
  function closeImageBlock() {
    const imageBlock = document.getElementById("imageBlock");
    if (imageBlock) {
      // Hide the imageBlock instead of removing it
      imageBlock.style.display = "none";
    }
  }

  // Event listener for the close button
  document
    .getElementById("closeImageBtn")
    .addEventListener("click", closeImageBlock);

  // Function to close the camera modal
  function closeCameraModal() {
    cameraModal.style.display = "none";
    const stream = cameraVideo.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
    }
    cameraVideo.srcObject = null;
    captureBtn.removeEventListener("click", capturePhoto);
    buttonClicked = false;
  }
  function closeCameraModalImage() {
    cameraModal.style.display = "none";
    const stream = cameraVideo.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
    }
    cameraVideo.srcObject = null;
    captureBtn.removeEventListener("click", capturePhoto);
    //buttonClicked = false;
  }

  // Event listener for the close button
  closeBtn.addEventListener("click", closeCameraModal);

  // Function to close the image block

  captureBtn.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent the event from propagating to other elements
    capturePhoto();
  });
});

function selectRandomChallenge() {
  var randomIndex = Math.floor(Math.random() * challenges.length);
  var [challengeDetail, category] = challenges[randomIndex];
  imageBlock.style.display = "none";
  updateChallengeCard(challengeDetail, category);
  imageBlock.style.display = "none";
}
function updateChallengeCard(challengeDetail, category) {
  const challengeTitle = document.querySelector(".challenge-title");
  const challengeDetailElement = document.querySelector(".challenge-detail");
  const challengeIcon = document.querySelector(".challenge-card img");

  challengeDetailElement.textContent = challengeDetail;

  switch (category) {
    case "Workout":
      document.documentElement.style.setProperty(
        "--main-bg-color",
        "rgba(241, 156, 121, 0.5)"
      );
      if (challengeIcon) {
        challengeIcon.src = "dumbbell.svg";
        challengeIcon.style.bottom = "20px";
        challengeIcon.style.left = "20px";
        challengeIcon.style.right = "auto";
        challengeIcon.style.top = "auto";
      }
      challengeTitle.style.top = "20px";
      challengeTitle.style.left = "20px";
      challengeDetailElement.style.top = "50%";
      challengeDetailElement.style.left = "20px";
      challengeDetailElement.style.right = "auto";
      challengeDetailElement.style.textAlign = "left";
      break;
    case "Food":
      document.documentElement.style.setProperty(
        "--main-bg-color",
        "rgba(212, 224, 155, 1)"
      );
      if (challengeIcon) {
        challengeIcon.src = "food.svg";
        challengeIcon.style.bottom = "20px";
        challengeIcon.style.right = "20px";
        challengeIcon.style.left = "auto";
        challengeIcon.style.top = "auto";
      }
      challengeTitle.style.top = "20px";
      challengeTitle.style.right = "20px";
      challengeTitle.style.left = "auto";
      challengeDetailElement.style.top = "50%";
      challengeDetailElement.style.right = "20px";
      challengeDetailElement.style.left = "auto";
      challengeDetailElement.style.textAlign = "right";
      break;
    case "Emotion":
      document.documentElement.style.setProperty(
        "--main-bg-color",
        "rgba(203, 223, 189, 1)"
      );
      if (challengeIcon) {
        challengeIcon.src = "emotion.svg";
        challengeIcon.style.top = "20px";
        challengeIcon.style.left = "20px";
        challengeIcon.style.bottom = "auto";
      }
      challengeTitle.style.bottom = "20px";
      challengeTitle.style.left = "20px";
      challengeTitle.style.top = "auto";
      challengeDetailElement.style.top = "50%";
      challengeDetailElement.style.left = "20px";
      challengeDetailElement.style.right = "auto";
      challengeDetailElement.style.textAlign = "left";
      break;
    case "Zen":
      document.documentElement.style.setProperty(
        "--main-bg-color",
        "rgba(246, 224, 210, 1)"
      );
      if (challengeIcon) {
        challengeIcon.src = "zen.svg";
        challengeIcon.style.top = "20px";
        challengeIcon.style.right = "20px";
        challengeIcon.style.bottom = "auto";
        challengeIcon.style.left = "auto";
      }
      challengeTitle.style.bottom = "20px";
      challengeTitle.style.right = "20px";
      challengeTitle.style.top = "auto";
      challengeTitle.style.left = "auto";
      challengeDetailElement.style.top = "50%";
      challengeDetailElement.style.right = "20px";
      challengeDetailElement.style.left = "auto";
      challengeDetailElement.style.textAlign = "right";
      break;
    default:
      break;
  }
}
