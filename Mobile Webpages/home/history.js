// Wait for the DOM content to be loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
  // Array of challenges
  const challenges = [
    ["Drink 8 cups of water throughout the day", "Food"],
    ["Stretch for 10 minutes", "Zen"],
    ["Do 10 pushups", "Workout"],
    ["Get happy time with friend", "Emotion"],
  ];

  // Function to generate challenge cards
  function generateChallengCards() {
    const challengeContainer = document.querySelector(".challenge-container");

    challenges.forEach((challenge) => {
      const [challengeDetail, category] = challenge;

      const challengeCard = document.createElement("div");
      challengeCard.classList.add("challenge-card");

      const img = document.createElement("img");
      img.classList.add("hide-on-small-only");
      img.setAttribute("height", "48px");
      img.setAttribute("width", "48px");
      img.setAttribute("alt", category.toLowerCase());

      const challengeDetailElement = document.createElement("div");
      challengeDetailElement.classList.add("challenge-detail");
      challengeDetailElement.textContent = challengeDetail;

      challengeCard.appendChild(img);
      challengeCard.appendChild(challengeDetailElement);

      // Set background color and image based on category
      switch (category) {
        case "Workout":
          challengeCard.style.backgroundColor = "rgba(241, 156, 121, 0.5)";
          img.setAttribute("src", "dumbbell.svg");
          break;
        case "Food":
          challengeCard.style.backgroundColor = "rgba(212, 224, 155, 1)";
          img.setAttribute("src", "food.svg");
          break;
        case "Emotion":
          challengeCard.style.backgroundColor = "rgba(203, 223, 189, 1)";
          img.setAttribute("src", "emotion.svg");
          break;
        case "Zen":
          challengeCard.style.backgroundColor = "rgba(246, 224, 210, 1)";
          img.setAttribute("src", "zen.svg");
          break;
      }

      challengeContainer.appendChild(challengeCard);
    });
  }

  // Call the function to generate challenge cards
  generateChallengCards();
});
