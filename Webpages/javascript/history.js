import { get_history_by_user } from './db.js';
export const LOCAL_STORAGE_USER_KEY = 'uuid';

async function populateHistory(username) {
    var username = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    const data = await get_history_by_user(username);
    
    // Assuming data is an object or array you want to display
    // Find the container in your HTML where you want to display the data
    const container = document.getElementById('challenge-containers');
    container.innerHTML = ''; // Clear existing contents
    if (!data) {
        container.innerHTML = 
        `<style>
        .no-history-title {
            font-size: 24px;
            font-weight: 900;
            text-align: center;
        }

        .no-history-text {
            text-align: center;
        }

        </style>
        <div class="no-history-title">
            History Unavailable
        </div>
        <div class="no-history-text">
            You haven't completed any challenges yet!
        </div>`
        return;
    }

    let renderedChallenges = ''

    Object.keys(data).forEach(key => {
        let item = data[key]
        let renderedChallenge =`<div class="challenge-box"><div class="date">${convertDate(item.timestamp)}</div><div class="challenge">${item.name}</div><div class="stars">${1/*item.stars*/} <img src="../images/stars1.svg"</div></div></div>`; 
        renderedChallenges = renderedChallenge.concat(renderedChallenges);
    })
    container.innerHTML = renderedChallenges;
}

function convertDate(timestamp){ 
    let date = new Date(timestamp);
    return `${date.getMonth()+1}` + '/' + date.getDate() + '/' + date.getFullYear();

}

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem(LOCAL_STORAGE_USER_KEY);

    const usernameDisplay = document.getElementById('username-display');

    // if (username) {
    //     usernameDisplay.textContent = username;
    // } else {
    //     usernameDisplay.textContent = 'User'; // Default text if no username is found
    // }
    populateHistory(username); 
});