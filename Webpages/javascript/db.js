export const LOCAL_STORAGE_USER_KEY = 'uuid';
const nav_bar_element = document.querySelector("nav-bar");



/*
 * Create new entry in user/challenges database with name of challenge and timestamp of completion
 */
export async function finish(challenge_name) {
    // localStorage.setItem(LOCAL_STORAGE_USER_KEY, "han");
    var username = localStorage.getItem(LOCAL_STORAGE_USER_KEY)
    var url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '/challenges.json'
    // var url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/han/challenges.json'
    await fetch(url, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: challenge_name,
        timestamp: new Date().getTime(),
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

      try {
        let {streak, stars} = await get_current_streak_stars();
        console.log('Current streak is:', streak);
        console.log('Current stars is ', stars);
        nav_bar_element.set_streak(streak);
        nav_bar_element.set_stars(stars);
      } catch (error) {
        // console.error('An error occurred:', error);
        nav_bar_element.set_streak(0);
        nav_bar_element.set_stars(0);
      }
  }

/*
 * return key, value pairs of (key, challenge objects)
 * corresponding to user username
 */
export async function get_history_by_user(username) {
    var url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '/challenges.json';
    return fetch(url)
      .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        return data;  
      })
      .catch((error) => {
        console.error('Error:', error);
        return [];  // Return null to indicate an error or an empty state
      });
}


/*
 * GET the user/current_challenge
 * returns a string containing the current challenge
 * upon failure, returns default string challenge "Take a 10 minute walk"
 */
export async function get_current_challenge(username) {
  let url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '/current_challenge.json';
  return fetch(url)
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data;  
    })
    .catch((error) => {
      console.error('Error:', error);
      return "Take a 10 minute walk";  // Return null to indicate an error or an empty state
    });
}


/*
 * GET the user/last_refresh
 * where last_refresh is the timestamp of last update to displayed challenge
 * returns an int
 * upon failure, returns 0 to make this last_refresh lowest priority
 */
export async function get_last_refresh(username) {
  let url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '/last_refresh.json';
  return fetch(url)
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(timestamp => {
      return timestamp;  
    })
    .catch((error) => {
      console.error('Error:', error);
      return 0;  // Return null to indicate an error or an empty state
    });
}


/*
 * PATCH user/current_challenge and user/timestamp
 * Doesn't return anything
 * updates the current_challenge to the supplied challenge and timestamp to current time
 */
export async function update_current_challenge_refresh(username, challenge_text) {
  let url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '.json';
  fetch(url, {
    method: 'PATCH', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      current_challenge: challenge_text,
      last_refresh: Date.now(),
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
export async function get_current_streak_stars() {
    var username = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    var challengeData = await get_history_by_user(username);
    var challenges = Object.values(challengeData).sort((a, b) => b.timestamp - a.timestamp);
  
    let currentStreak = 0;
    let currentDate = new Date();
    let mostRecentChallenge = new Date(challenges[0].timestamp);
    let challengeDoneToday = currentDate.getMonth() === mostRecentChallenge.getMonth() &&
    currentDate.getDate() === mostRecentChallenge.getDate() &&
    currentDate.getFullYear() === mostRecentChallenge.getFullYear();
    currentDate.setDate(currentDate.getDate() - 1);
    for (let i = 0; i < challenges.length; i++){
      let challengeDate = new Date(challenges[i].timestamp);
      if (currentDate.getMonth() === challengeDate.getMonth() &&
      currentDate.getDate() === challengeDate.getDate() &&
      currentDate.getFullYear() === challengeDate.getFullYear()) {
        currentDate.setDate(currentDate.getDate() - 1);
        currentStreak++;
      }
    }
    if (challengeDoneToday) {
      currentStreak++;
    }

  
    return {
      streak: currentStreak,
      stars: challenges.length,
    }
  }
  
