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
                    background-color: #F0E4F2;
                    padding: 0;
                    margin: 0;
                    height: 50px;
                    width: 100%;
                    font-family: Arial, sans-serif;
                    border-bottom: solid thin grey;
                }

                .nav-bar div {
                  margin: 0 10px;
                  display: flex;
                  gap: 10px;
                  align-items: center;
                }

                .nav-bar div div {
                  gap: 5px;
                }

                a {
                  text-decoration: none;
                  color: black;
                }

                img {
                  height: 30px;
                }

                .login-signup {
                  width: 75px;
                  text-align: center;
                }
            </style>
            <div class="nav-bar">
                <div>
                    <a href="home.html">
                      <img src="../images/home.svg" alt=Home SVG Image">
                    </a>
                    <div>
                      <a class="stars-count">1</a>
                      <img src="../images/stars.svg" alt="Stars SVG Image">
                    </div>
                </div>
                <div>
                    <div>
                      <a class="streak-count">1</a>
                      <img src="../images/flame-icon.svg" alt="Flame Icon SVG Image">
                    </div>
                    <a id="history" href="history.html">History</a>
                    <a class="login-signup" href="login.html">Login/Signup</a>
                </div>
            </div>
        `;
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.streaks_count_element = this.shadowRoot.querySelector(
      ".streak-count"
    );
    this.stars_count_element = this.shadowRoot.querySelector(
      ".stars-count"
    );

    this.login_signup = this.shadowRoot.querySelector(".login-signup");
  }

  get_streaks_element() {
    return this.streaks_count_element;
  }

  get_stars_element() {
    return this.stars_count_element;
  }

  set_stars(num) {
    this.stars_count_element.innerHTML = parseInt(num);
  }

  set_streaks(num) {
    this.streaks_count_element.innerHTML = parseInt(num);
  }

  increment_streaks() {
    this.streaks_count_element.innerHTML = parseInt(this.streaks_count_element.innerHTML) + 1;
  }

  increment_stars() {
    this.stars_count_element.innerHTML = parseInt(this.stars_count_element.innerHTML) + 1;
  }

  change_login_logout() {
    if (localStorage.getItem("uuid") !== null) {
      this.login_signup.innerText = "Sign Out";
    }
    else {
      if (window.location.href.endsWith('login.html')) {
        this.login_signup.innerText = "Signup";
        this.login_signup.href = "signup.html";
      }
      else {
        this.login_signup.innerText = "Login";
        this.login_signup.href = "login.html";
      }
    }
  }
  connectedCallback() {
    // This method is called when the element is inserted into the DOM

    // todo connect to database to do proper logic
    this.set_stars(7);
    this.set_streaks(8);

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
