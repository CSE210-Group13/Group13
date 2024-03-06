export const LOCAL_STORAGE_USER_KEY = 'uuid';
const nav_bar_element = document.querySelector("nav-bar");

export async function finish(challange_name) {
    console.log("challenge_name: ", challange_name);
    console.log("username: ", localStorage.getItem(LOCAL_STORAGE_USER_KEY));
    // localStorage.setItem(LOCAL_STORAGE_USER_KEY, "han");
    var username = localStorage.getItem(LOCAL_STORAGE_USER_KEY)
    var url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '/challenges.json'
    // var url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/han/challenges.json'
    fetch(url, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: challange_name,
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
        const streak = await get_current_streak();
        console.log('Current streak is:', streak);
        nav_bar_element.set_strikes(streak);
      } catch (error) {
        // console.error('An error occurred:', error);
        nav_bar_element.set_strikes(0);
      }
  }


export async function get_history_by_user(username) {
    console.log("username: ", username);
    var url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '/challenges.json'
    return fetch(url)
      .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        return data;  
      })
      .catch((error) => {
        console.error('Error:', error);
        return null;  // Return null to indicate an error or an empty state
      });
}

export async function get_current_streak() {
    var username = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    var challengeData = await get_history_by_user(username);
    var challenges = Object.values(challengeData).sort((a, b) => b.timestamp - a.timestamp);
    console.log(challenges);
  
    let currentStreak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); 
  
    let uniqueDates = new Set(); 
  
    let expectedDateString = currentDate.toDateString();
  
    for (let i = 0; i < challenges.length; i++) {
      const challengeTimestamp = challenges[i].timestamp;
      const challengeDate = new Date(challengeTimestamp);
      challengeDate.setHours(0, 0, 0, 0); 
      const challengeDateString = challengeDate.toDateString();
  
      if (!uniqueDates.has(challengeDateString)) {
        uniqueDates.add(challengeDateString);
        if (challengeDateString === expectedDateString) {
          currentStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
          expectedDateString = currentDate.toDateString();
        } else {
          break;
        }
      }
    }
  
    console.log(currentStreak);
    return currentStreak;
  }
  
