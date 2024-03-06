import { get_history_by_user, get_star } from '../javascript/db.js';
import { get_current_streak } from '../javascript/db.js';

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
                    margin: 0 5px;
                }
                
                .nav-bar img {
                    height: 30px;
                    width: auto;
                }
                #current-user {
                  margin-left: 10px; 
                }                
            </style>
            <div class="nav-bar">
                <div class="nav-left">
                    <a href="home.html">
                      <img src="../images/home.svg" alt=Home SVG Image">
                    </a>
                    <a id="stars" class="stars count">0</a>
                    <img src="../images/stars.svg" alt="Stars SVG Image">
                    <span id="current-user"></span>
                </div>
                <div class="nav-right">
                    <a id="streaks" class="strikes count">0</a>
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
  }

  get_strikes_element(){
    return this.strikes_count_element; 
  }

  get_stars_element(){
    return this.stars_count_element; 
  }

  set_stars(num){
    this.stars_count_element.innerHTML = parseInt(num);
  }

  set_strikes(num){
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

  isLoginPage() {
    const pathname = window.location.pathname;
    console.log('Current pathname:', pathname)
    // Check if the pathname matches the expected path for the login page
    const loginPath = '/Webpages/html/login.html'; // The path to your login page

    return pathname === loginPath;
  }

  hide_stars() {
    var starsElement = this.shadowRoot.querySelector('#stars');
    if (starsElement) {
      starsElement.style.display = 'none'; // This hides the stars element
    }
  }
  
  hide_streaks() {
    var streaksElement = this.shadowRoot.querySelector('#streaks');
    if (streaksElement) {
      streaksElement.style.display = 'none'; // This hides the streaks element
    }
  }

  show_stars() {
    var starsElement = this.shadowRoot.querySelector('#stars');
    if (starsElement) {
      starsElement.style.display = ''; // Resets the display property
    }
  }
  
  show_streaks() {
    var streaksElement = this.shadowRoot.querySelector('#streaks');
    if (streaksElement) {
      streaksElement.style.display = ''; // Resets the display property
    }
  }

  connectedCallback() {
    // This method is called when the element is inserted into the DOM
    console.log('Element connected to the DOM');

    if (!this.isLoginPage()) {
      var current_user = this.shadowRoot.querySelector("#current-user");
      console.log('Current user:', current_user);
      current_user.innerHTML = localStorage.getItem('uuid');
    }

    // todo connect to database to do proper logic
    (async () => {
      try {
        if (!this.isLoginPage()) { 
          const stars = await get_star();
          console.log('Current stars is:', stars);
          this.set_stars(stars);
        } 
      } catch (error) {
        // console.log('An error occurred:', error);
        this.set_stars(0);
      }
    })();
    (async () => {
      try {
        if (!this.isLoginPage()) { 
          const streak = await get_current_streak();
          console.log('Current streak is:', streak);
          this.set_strikes(streak);
        } 
      } catch (error) {
        // console.error('An error occurred:', error);
        this.set_strikes(0);
      }
    })();
    // this.set_strikes(streak); 

    const historyButton = this.shadowRoot.getElementById('history');

    // Attach an event listener to the history button
        historyButton.addEventListener('click', (event) => {
          event.preventDefault(); // Prevent the default link behavior
          console.log('History button clicked');
          window.location.href = 'history.html';

          
        });
      }

      
    }

    customElements.define("nav-bar", NavBar);
