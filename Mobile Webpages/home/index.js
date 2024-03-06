var challenges = [
  ["Drink 8 cups of water throughout the day", "Food"],
  ["Stretch for 10 minutes", "Zen"],
  ["Do 10 pushups", "Workout"],
  ["Get happy time with friend", "Emotion"],
];

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("refresh")
    .addEventListener("click", selectRandomChallenge);
});

function selectRandomChallenge() {
  var randomIndex = Math.floor(Math.random() * challenges.length);
  var [challengeDetail, category] = challenges[randomIndex];

  updateChallengeCard(challengeDetail, category);
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
      challengeIcon.src = "dumbbell.svg";
      challengeTitle.style.top = "20px";
      challengeTitle.style.left = "20px";
      challengeDetailElement.style.top = "50%";
      challengeDetailElement.style.left = "20px";
      challengeDetailElement.style.right = "auto";
      challengeDetailElement.style.textAlign = "left";
      challengeIcon.style.bottom = "20px";
      challengeIcon.style.left = "20px";
      challengeIcon.style.right = "auto";
      challengeIcon.style.top = "auto";
      break;
    case "Food":
      document.documentElement.style.setProperty(
        "--main-bg-color",
        "rgba(212, 224, 155, 1)"
      );
      challengeIcon.src = "food.svg";
      challengeTitle.style.top = "20px";
      challengeTitle.style.right = "20px";
      challengeTitle.style.left = "auto";
      challengeDetailElement.style.top = "50%";
      challengeDetailElement.style.right = "20px";
      challengeDetailElement.style.left = "auto";
      challengeDetailElement.style.textAlign = "right";
      challengeIcon.style.bottom = "20px";
      challengeIcon.style.right = "20px";
      challengeIcon.style.left = "auto";
      challengeIcon.style.top = "auto";
      break;
    case "Emotion":
      document.documentElement.style.setProperty(
        "--main-bg-color",
        "rgba(203, 223, 189, 1)"
      );
      challengeIcon.src = "emotion.svg";
      challengeTitle.style.bottom = "20px";
      challengeTitle.style.left = "20px";
      challengeTitle.style.top = "auto";
      challengeDetailElement.style.top = "50%";
      challengeDetailElement.style.left = "20px";
      challengeDetailElement.style.right = "auto";
      challengeDetailElement.style.textAlign = "left";
      challengeIcon.style.top = "20px";
      challengeIcon.style.left = "20px";
      challengeIcon.style.bottom = "auto";
      break;
    case "Zen":
      document.documentElement.style.setProperty(
        "--main-bg-color",
        "rgba(246, 224, 210, 1)"
      );
      challengeIcon.src = "zen.svg";
      challengeTitle.style.bottom = "20px";
      challengeTitle.style.right = "20px";
      challengeTitle.style.top = "auto";
      challengeTitle.style.left = "auto";
      challengeDetailElement.style.top = "50%";
      challengeDetailElement.style.right = "20px";
      challengeDetailElement.style.left = "auto";
      challengeDetailElement.style.textAlign = "right";
      challengeIcon.style.top = "20px";
      challengeIcon.style.right = "20px";
      challengeIcon.style.bottom = "auto";
      challengeIcon.style.left = "auto";
      break;
    default:
      break;
  }
}
