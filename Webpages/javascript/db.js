export const LOCAL_STORAGE_USER_KEY = 'uuid';

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

