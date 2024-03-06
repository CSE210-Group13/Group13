import { get_history_by_user } from '../javascript/db.js';
import { logOut } from '../javascript/authen.js';

class NavBar extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = `
            <style>
                /* Your CSS styles here */
                .nav-bar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 1000;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: lightblue;
                    padding: 0;
                    margin: 0;
                    height: 50px;
                    width: 100%;
                    font-family: Arial, sans-serif;
                }
                
                .nav-left {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                }
                
                .nav-right {
                    display: flex;
                    align-items: center;
                    margin-left: auto;
                    justify-content: flex-end;
                }
                
                .nav-bar a {
                    text-decoration: none;
                    color: black;
                    margin: 0 10px;
                }
                
                .nav-bar .count {
                    margin: 0 4px;
                }
                
                .nav-bar img {
                    height: 30px;
                    width: auto;
                }
            </style>
            <div class="nav-bar">
                <div class="nav-left">
                    <a href="home.html">Home</a>
                    <a class="stars count">5</a>
                    <img src="../images/stars.svg" alt="Stars SVG Image">
                </div>
                <div class="nav-right">
                    <a class="strikes count">4</a>
                    <img src="../images/flame-icon.svg" alt="Flame Icon SVG Image">
                    <a id="history" href="history.html">History</a>
                    <a class="login-signup" href="login.html">Login/Signup</a>
                </div>
            </div>
        `;
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.strikes_count_element = this.shadowRoot.querySelector(
      ".nav-bar .nav-right .strikes"
    );
    this.stars_count_element = this.shadowRoot.querySelector(
      ".nav-bar .nav-left .stars"
    );

    this.login_signup = this.shadowRoot.querySelector(".nav-right .login-signup");
  }

  get_strikes_element() {
    return this.strikes_count_element;
  }

  get_stars_element() {
    return this.stars_count_element;
  }

  set_stars(num) {
    this.stars_count_element.innerHTML = parseInt(num);
  }

  set_strikes(num) {
    this.strikes_count_element.innerHTML = parseInt(num);
  }

  increment_strikes() {
    this.strikes_count_element.innerHTML = parseInt(this.strikes_count_element.innerHTML) + 1;
  }

  increment_stars() {
    this.stars_count_element.innerHTML = parseInt(this.stars_count_element.innerHTML) + 1;
  }

  test(num) {
    console.log("test function from nav-bar");
  }

  change_login_logout() {
    console.log(this.login_signup);
    if (localStorage.getItem("uuid") !== null) {
      this.login_signup.innerText = "Sign Out";
    }
    else {
      console.log("navbar :: signout_versoin :: else ");
      this.login_signup.innerText = "Login/Signup";
      this.login_signup.href = "login.html";
    }
  }
  connectedCallback() {
    // This method is called when the element is inserted into the DOM
    console.log('Element connected to the DOM');

    // todo connect to database to do proper logic
    this.set_stars(7);
    this.set_strikes(8);

    const historyButton = this.shadowRoot.getElementById('history');

    // Attach an event listener to the history button
    historyButton.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent the default link behavior
      console.log('History button clicked');
      window.location.href = 'history.html';
    });

    this.change_login_logout();
    this.login_signup.addEventListener('click', (e) => {
      if (localStorage.getItem("uuid") !== null) {
        e.preventDefault();
        logOut();
        this.change_login_logout();
      }
    })
  }
}

customElements.define("nav-bar", NavBar);
