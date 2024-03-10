import "./js-confetti.browser.js"
import { LOCAL_STORAGE_USER_KEY, finish, get_current_challenge, get_last_refresh, update_current_challenge_refresh } from "./db.js";

const confetti = new JSConfetti();
const refresh_button = document.querySelector("#refresh");

const finish_button = document.querySelector("#finish");

const challenge = document.querySelector(".challenge");

const nav_bar_element = document.querySelector("nav-bar");
// console.log(nav_bar_element);
// nav_bar_element.increment_streaks();
// console.log(nav_bar_element.get_stars_element());

// nav_bar_element.set_stars('100');
// nav_bar_element.increment_stars();

// this boolena is used to first populate a random challange,
// when home page is loaded for the first time, we should populate a random challange
// when home page is refreshed, we should not populate another challange.

// nav_bar_element.signout_version(); 

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


function get_random_challenge() {
  const random_index = Math.floor(Math.random() * challenges_arr.length);
  const random_challenge = challenges_arr[random_index];
  return { index: random_index, challenge: random_challenge };
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

/*
 * Called when page loads
 * Gets current_challenge and last_refresh and checks if last_refresh is outdated
 * last_refresh is outdated if before 2am on current day, as that is when
 * all challenges should refresh
 * if not outdated, simply set challenge text to current_challenge
 * if outdated, get new challenge and update database to reflect
 */
async function populate_challenge() {
  let username = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  username = 'han';
  let last_refresh = await get_last_refresh(username);
  let current_challenge = await get_current_challenge(username);
  console.log(last_refresh);
  console.log(current_challenge);
  let today_refresh_time = new Date();
  today_refresh_time.setHours(2,0,0,0);
  today_refresh_time = today_refresh_time.getTime();
  console.log("today_refresh_time: " + today_refresh_time);
  let challenge_text = document.getElementById('challenge_text');

  if (last_refresh > today_refresh_time){
    challenge_text.innerText = current_challenge;
  }
  else {
    challenge_text.innerText = get_different_challenge();
    await update_current_challenge_refresh(username, challenge_text.innerText);
  }
}



refresh_button.addEventListener("click", async () => {
  const refreshed_challenge = get_different_challenge();
  challenge.innerHTML = refreshed_challenge;
  let username = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  username = 'han';
  await update_current_challenge_refresh(username, challenge.innerHTML)
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

/* When the user logs in, we check last_refresh and current_challenge
If last refresh was before our daily refresh,
we can choose a new random current_challenge
Otherwise, the user has already asked for a new challenge
and we should keep displaying the current_challenge
*/
window.onload = populate_challenge;
// test on the go:
// const randomChallenge = get_random_challenge();
// console.log("Random challenge:", randomChallenge);
