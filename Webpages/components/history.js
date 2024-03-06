//Create history containers by passing in 
//List of challenges (date, challenge, stars awarded)
//And this will create each container and add it to challenge-containers

document.addEventListener('DOMContentLoaded', function() {
    //
    console.log("document event listener");
    let challenges = [{date:"7/24/24", challenge:"Do 5 pushups", stars:"7"}, {date:"7/24/24", challenge:"Do 5 pushups", stars:"7"}]
    challenges = [];
    let challenge = {date:"7/24/24", challenge:"Do 5 pushups", stars:"7"};
    for (var i = 0; i < 15; i++){
        challenges.push(challenge);
    }
    create_history(challenges);
})

function create_history(challenges){
    let container = document.getElementById("challenge-containers")
    let renderedChallenges = challenges.map(function(item) {
        return `<div class="challenge-box"><div class="date">${item.date}</div><div class="challenge">${item.challenge}</div><div class="stars">${item.stars} <img src="../images/stars1.svg"</div></div></div>`
    });
    container.innerHTML = renderedChallenges;
}