export const LOCAL_STORAGE_USER_KEY = 'uuid';
const nav_bar_element = document.querySelector("nav-bar");

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


export async function get_history_by_user(username) {
    var url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '/challenges.json'
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
  