import { send_friend_request, get_email, LOCAL_STORAGE_USER_KEY, get_friend_requests,
delete_requests_from_user, add_friend_to_user, get_user_from_email, get_friends_list, get_friends_histories } from "./db.js";

let friend_form = document.getElementById("friend_request_form");

let friend_email = document.getElementById("friend_email");


friend_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let our_email = await get_email();
    let our_friends = await get_friends_list();
    if (!our_friends.includes(friend_email.value)){
        await send_friend_request(our_email, friend_email.value).then((response) => {
            if(response){
                friend_email.value = '';
            }
            else {
                console.log(response);
            }
        });
    }
    else {
        friend_email.value = '';
    }
})



/**
 * Friends.onload = create friend requests
 * Each should have a submit accept button
 * create friends list
 * create friends history
 * 
 * 
 */
window.onload = dom_function();

async function dom_function() {
    const username = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    // let our_friend_requests = get_friend_requests();
    // get_friends_histories()
    // get_friends();
    let {challenges, users, email_to_stars_map } = await get_friends_histories();
    let our_friend_requests = await get_friend_requests();
    if (our_friend_requests){
        our_friend_requests =  (Object.values(our_friend_requests).map(function(obj) {
            return obj.email;
        }));
        our_friend_requests = Array.from(new Set(our_friend_requests))
    }
    else {
        our_friend_requests = [];
    }
    let our_friends = await get_friends_list();

    // Fill activity container
    // First, sort both challenges and users
    let indices = Array.from(challenges.keys());
    indices.sort((a,b) => challenges[b].timestamp - challenges[a].timestamp);
    challenges = indices.map(index => challenges[index]);
    users = indices.map(index => users[index]);
    //Then, remove all elements from before current day
    let filtered_challenges = [];
    let filtered_users = [];
    let current_day_timestamp = new Date()
    current_day_timestamp.setHours(0,0,0,0);
    for(let i = 0; i < challenges.length; i++){
        if (challenges[i].timestamp < current_day_timestamp) {
            break;
        }
        filtered_challenges.push(challenges[i]);
        filtered_users.push(users[i]);
    }
    challenges = filtered_challenges;
    users = filtered_users;
    //then add components to container
    let activity_container = document.getElementById('activity_container');
    activity_container.innerHTML = '';
    if (challenges.length == 0) {
        activity_container.innerHTML = 
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
            Friend Activity Unavailable
        </div>
        <div class="no-history-text">
            Your friends haven't completed any challenges today!
        </div>`;
    }
    else {
        let rendered_challenges =  '';
        for (let i = 0; i < challenges.length; i++){
            let date = new Date(challenges[i].timestamp);
            let hr_min = `${date.getHours()}:${date.getMinutes()}`;
            let rendered_challenge = `<div class="name">${users[i]}</div>
            <div class="challenge-box">
                <div class="date">${hr_min}</div>
                    <div class="challenge">${challenges[i].name}</div>
                    <div class="stars">1<img src="../images/stars1.svg">
                </div>
            </div>`;
            rendered_challenges = rendered_challenges.concat(rendered_challenge);
        }
        activity_container.innerHTML = rendered_challenges;
    }

    //Next, friend requests
    let requests_container = document.getElementById('requests_box');
    requests_container.innerHTML = '';
    let rendered_requests = '';
    for (let i = 0; i < our_friend_requests.length; i++){
        let rendered_request = `<div class="request">
        <div class="request_left">
            <img src="../images/person.svg">${our_friend_requests[i]}
        </div>
        <div class="request_right">
            <button type="submit" class="accept_request_button">Accept</button>
            <button type="submit" class="reject_request_button" >Reject</button>
        </div>
        </div>`
        rendered_requests = rendered_requests.concat(rendered_request);
    }
    requests_container.innerHTML = rendered_requests;

    // Lastly, friends list
    let friends_container = document.getElementById('friends_box_container');
    friends_container.innerHTML = '';
    let rendered_friends = '';
    for (let i = 0; i < our_friends.length; i++){
        let rendered_friend = ` <div class="friend_box" id="friend_box"><div class="person">
        <img src="../images/person.svg">
        ${our_friends[i]}
    </div>
    <div class="star_count">
        ${email_to_stars_map[our_friends[i]]}
        <img src="../images/stars1.svg">
    </div></div>`;
        rendered_friends = rendered_friends.concat(rendered_friend);
    }
    friends_container.innerHTML = rendered_friends;


        /**
     * on submit of accept button, 
     * find user associataed with email request ya
     * add user to friends list ya
     * add current user to users friend list ya
     * remove friend request
     * reload page
     */

    let accept_request_buttons = document.querySelectorAll('.accept_request_button');

    accept_request_buttons.forEach(function (button) {
        button.addEventListener('click', async function (event) {
            let friend_email = this.parentElement.parentElement.querySelector('.request_left').innerText;
            console.log(friend_email);
            let our_email = await get_email();
            console.log(our_email);
            // Add friend to current user
            await add_friend_to_user(localStorage.getItem(LOCAL_STORAGE_USER_KEY), friend_email);
            let friend_user = await get_user_from_email(friend_email);
            // Add current user as friend to friend
            await add_friend_to_user(friend_user, our_email);
            // Remove friend request
            let our_friend_requests = await get_friend_requests();
            let requests_to_remove = [];
            for (let key in our_friend_requests) {
                if (our_friend_requests[key].email == friend_email) {
                    requests_to_remove.push(key);
                }
            }
            await delete_requests_from_user(localStorage.getItem(LOCAL_STORAGE_USER_KEY), requests_to_remove);
            //Reload page
            location.reload();
        });
    });


    /**
     * On reject, remove friend request from
     * current user, and reload page
     */
    let reject_request_buttons = document.querySelectorAll('.reject_request_button');

    reject_request_buttons.forEach(function (button) {
        button.addEventListener('click', async function (event) {
            let friend_email = this.parentElement.parentElement.querySelector('.request_left').innerText;
            console.log(friend_email);
            let our_friend_requests = await get_friend_requests();
            let requests_to_remove = [];
            for (let key in our_friend_requests) {
                if (our_friend_requests[key].email == friend_email) {
                    requests_to_remove.push(key);
                }
            }
            await delete_requests_from_user(localStorage.getItem(LOCAL_STORAGE_USER_KEY), requests_to_remove);
            //Reload page
            location.reload();
        });    
    });
};
