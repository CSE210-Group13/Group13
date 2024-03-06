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
            </style>
            <div class="nav-bar">
                <div class="nav-left">
                    <a href="home.html">
                      <img src="../images/home.svg" alt=Home SVG Image">
                    </a>
                    <a class="stars count">1</a>
                    <img src="../images/stars.svg" alt="Stars SVG Image">
                </div>
                <div class="nav-right">
                    <a class="strikes count">1</a>
                    <img src="../images/flame-icon.svg" alt="Flame Icon SVG Image">
                    <a href="history.html">History</a>
                    <a class="login-signup" href="login.html">Logout</a>
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

  connectedCallback() {
    // This method is called when the element is inserted into the DOM
    console.log('Element connected to the DOM');

    // todo connect to database to do proper logic
    this.set_stars(7); 
    this.set_strikes(8); 
  }
}

customElements.define("nav-bar", NavBar);
