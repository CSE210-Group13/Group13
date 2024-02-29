//Create history containers by passing in 
//List of challenges (date, challenge, stars awarded)
//And this will create each container and add it to challenge-containers

function create_history(challenges){
    let container = document.getElementById("challenge-containers")
    let renderedChallenges = challenges.map(function(item) {
        return `<div class="challenge-box"><div class="date">${item.date}</div><div class="challenge">${item.challenge}</div><div class="stars">${item.stars} <img src="../images/stars1.svg"</div></div></div>`
    })
    container.innerHTML = renderedChallenges
}