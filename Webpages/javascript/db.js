export const LOCAL_STORAGE_USER_KEY = 'uuid';
const nav_bar_element = document.querySelector("nav-bar");



/*
 * Create new entry in user/challenges database with name of 
 * challenge and timestamp of completion and set the 
 * corresponding stars and streak

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
        //console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

      try {
        let {streak, stars} = await get_current_streak_stars();
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
  let refresh_time = Date.now();
  fetch(url, {
    method: 'PATCH', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      current_challenge: challenge_text,
      last_refresh: refresh_time,
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


/**
 * 
 * Gets user's stars and current streak
 * Streak is extended every discrete day there is at least one challenge done
 * Stars is currently 1 per challenge, so the sum is the total number of challenges
 */
export async function get_current_streak_stars() {
    var username = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    var challengeData = await get_history_by_user(username);
    var challenges = Object.values(challengeData).sort((a, b) => b.timestamp - a.timestamp);

    if (challenges.length == 0) {
      return {
        streak: 0,
        stars: 0,
      };
    }
  
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
    };
  }
  

/*
  * After signing up, link user localid to email by adding email to user in db
*/
export async function create_user_email(email) {
  // localStorage.setItem(LOCAL_STORAGE_USER_KEY, "han");
  var username = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  var url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '.json';
  await fetch(url, {
    method: 'PATCH', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
    }),
  })
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
 * Returns email of current user
 */

export async function get_email(){
  let username = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  var url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '/email.json';
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
      return '';  // Return null to indicate an error or an empty state
    });
}

/*
 * Add request to user who should receive friend request
 */

export async function send_friend_request(our_email, requested_email){
  let url = 'https://cse210-group13-default-rtdb.firebaseio.com/users.json';
  let users = await fetch(url)
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
  for (let key in users) {
    if (users[key].email == requested_email && key != localStorage.LOCAL_STORAGE_USER_KEY) {
      let username = key;
      let url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '/friend_requests.json';
      return await fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: our_email,
        }),
      })
        .then(response => response.json())
        .then(data => {
          return data;
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }
}

/*
 * Gets all the friend requests for current user
 */
export async function get_friend_requests(){
  let username = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  var url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '/friend_requests.json';
  return fetch(url)
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // data =  (Object.values(data).map(function(obj) {
      //   return obj.email;
      // }));
      // data = Array.from(new Set(data));
      return data;
    })
    .catch((error) => {
      console.error('Error:', error);
      return [];  // Return null to indicate an error or an empty state
    });
}


/**
 * Gets user UUID associated with email
 */
export async function get_user_from_email(email){
  let url = 'https://cse210-group13-default-rtdb.firebaseio.com/users.json';
  let users = await fetch(url)
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
  for (let key in users) {
    if (users[key].email == email && key != localStorage.LOCAL_STORAGE_USER_KEY) {
      return key;
    }
  }
}


/**
 * Posts new friend to current user
 * user/friends/key/email
 */

export async function add_friend_to_user(username, email){
  let url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '/friends.json';
  await fetch(url, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email, 
    }),
  })
    .then(response => response.json())
    .then(data => {
      //console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/**
 * Deletes selected friend requests from user by iterating
 * through array and deleting all keys 
 * from user/friend_requests
 */
export async function delete_requests_from_user(username, requests){
  for (let i = 0; i < requests.length; i++){
    let url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '/friend_requests/' + requests[0] + ".json";
    console.log(url);
    await fetch(url, {
      method: 'DELETE',
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error('Error: ', error);
    });
  };
}



/**
 * Gets friends list associated with current user
 * format is array of strings (emails)
 */
export async function get_friends_list(){
  let username = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  let url = 'https://cse210-group13-default-rtdb.firebaseio.com/users/' + username + '/friends.json';
  return await fetch(url)
      .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        data =  (Object.values(data).map(function(obj) {
          return obj.email;
        }));
        data = Array.from(new Set(data));
        return data;
      })
      .catch((error) => {
        return [];  // Return null to indicate an error or an empty state
      });
}

/**
 * returns list of challenges and list of user emails corresponding to the challenges
 * and a mapping from user email to user history (to be used for summing stars)
 */
export async function get_friends_histories(){
  let url = 'https://cse210-group13-default-rtdb.firebaseio.com/users.json';
  let challenges_user = [];
  let challenges = [];
  let email_to_stars_map = {};
  let friends_list = await get_friends_list();
  let users = await fetch(url)
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
  for (let key in users) {
    if (friends_list.includes(users[key].email)) {
      let user_hist = []
      if (!users[key].challenges) {
        user_hist = [];
      }
      else{
        user_hist = Object.values(users[key].challenges);
      }
      if (!user_hist) {
        user_hist = [];
      }
      challenges = challenges.concat(user_hist);
      for (let i = 0; i < user_hist.length; i++){
        challenges_user.push(users[key].email);
      }
      email_to_stars_map[users[key].email] = user_hist.length;
    }
  }
  return {
    challenges: challenges,
    users: challenges_user,
    email_to_stars_map: email_to_stars_map,
  }
}
