import "./js-confetti.browser.js"
import { finish } from "./db.js";
import { get_current_streak_stars } from "./db.js";

const confetti = new JSConfetti();
const refresh_button = document.querySelector("#refresh");
console.log(refresh_button);

const finish_button = document.querySelector("#finish");
console.log(finish_button);

const challenge = document.querySelector(".challenge");
console.log(challenge);
console.log(challenge.innerHTML);

const nav_bar_element = document.querySelector("nav-bar");
// console.log(nav_bar_element);
// nav_bar_element.increment_streaks();
// console.log(nav_bar_element.get_stars_element());

// nav_bar_element.set_stars('100');
// nav_bar_element.increment_stars();

// this boolena is used to first populate a random challenge,
// when home page is loaded for the first time, we should populate a random challenge
// when home page is refreshed, we should not populate another challenge.
localStorage.setItem("get_random_boolean", true);

const challenges_arr = [
  "Drink 8 cups of water throughout the day",
  "Take a 10 minute walk",
  "Eat at least 1 cup of fruits or vegetables",
  "Stretch for 10 minutes",
  "Do 10 pushups",
  "Do 15 squats",
  "Do a 30 second plank",
  "Only drink water for one day",
  "Stay outside for 15 minutes",
  "Do 20 lunges",
];

console.log(challenges_arr);

function get_random_challenge() {
  const random_index = Math.floor(Math.random() * challenges_arr.length);
  const random_challenge = challenges_arr[random_index];
  return { index: random_index, challenge: random_challenge };
}

function populate_random_challenge() {
  if (localStorage.getItem("get_random_boolean") === true) {
    const random_challenge = get_random_challenge();
    challenge.innerHTML = random_challenge.challenge;
  }
  localStorage.setItem("get_random_boolean", false);
}

function get_different_challenge() {
  let cur_challenge = challenge.innerHTML;
  let index = challenges_arr.indexOf(cur_challenge);
  let random_challenge = get_random_challenge();

  while (index == random_challenge.index) {
    random_challenge = get_random_challenge();
  }

  return random_challenge.challenge;
}

window.onload = populate_random_challenge;

refresh_button.addEventListener("click", () => {
  const refreshed_challenge = get_different_challenge();
  challenge.innerHTML = refreshed_challenge;
});

finish_button.addEventListener("click", async () => {
  if (finish_button.classList.contains("finish")) {
    var challenge_name = challenge.innerHTML;
    challenge.innerHTML = "Congrats, you have finished the challenge";
    nav_bar_element.increment_stars();
    // nav_bar_element.increment_streaks();

    finish_button.classList.remove("finish");
    
    finish(challenge_name);

    finish_button.classList.add("more");
    finish_button.innerHTML = "More";
    console.log(finish_button.classList);
    confetti.addConfetti(); 
    
  } else if (finish_button.classList.contains("more")) {
    const random_challenge = get_random_challenge();
    challenge.innerHTML = random_challenge.challenge;

    finish_button.classList.remove("more");
    finish_button.classList.add("finish");
    finish_button.innerHTML = "Finish";
    console.log(finish_button.classList);
  }
});

// test on the go:
// const randomChallenge = get_random_challenge();
// console.log("Random challenge:", randomChallenge);
