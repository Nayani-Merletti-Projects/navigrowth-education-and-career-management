/*document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.js-menu-button')
  .addEventListener('click', () => {

    setTimeout(toggleNavBar, 120);

  });
})*/

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".js-menu-button");
  const navbar = document.querySelector(".js-navbar");

  if (!localStorage.getItem("navbar")) {
    localStorage.setItem("navbar", navBarHTML());
  }

  navbar.innerHTML = "";
  //localStorage.setItem('navbarOpen', 'false');

  if (menuButton && navbar) {
    menuButton.addEventListener("click", () => {
      setTimeout(toggleNavBar, 120);
    });
  }
});

function toggleNavBar() {
  const navbar = document.querySelector(".js-navbar");
  const navBarhtml = localStorage.getItem("navbar") || navBarHTML();

  if (navbar.innerHTML === "") {
    navbar.innerHTML = navBarhtml;
    //localStorage.setItem('navbarOpen', 'true');
  } else {
    navbar.innerHTML = "";
    //localStorage.setItem('navbarOpen', 'false');
  }
}

function navBarHTML() {
  return `

      <nav class="navbar">

        <div class="nav-overlay"></div>

        <a href="Home_Page.html">
          <div class="navbar-links-containers">
            <img class="navbar-icons" src="public/Icons/home-icon.png">
            <span> Home </span>
          </div>
        </a> 
            
        <a href="Skills.html">
          <div class="navbar-links-containers">
            <img class="navbar-icons" src="public/Icons/Strengths-icon.png">
            <span> Skills/Strengths </span>
          </div>
        </a> 
          
        <a href="Goals.html">
          <div class="navbar-links-containers">
            <img class="navbar-icons" src="public/Icons/Goals-icon.png">
            <span> Goals </span>
          </div>
        </a> 

        <a href="Paths.html">
          <div class="navbar-links-containers">
            <img class="navbar-icons" src="public/Icons/Paths-icon.png">
            <span> Paths/Opportunities </span>
          </div>
        </a> 

        <a href="Chat.html">
          <div class="navbar-links-containers">
            <img class="navbar-icons" src="public/Icons/Chat-icon.png">
            <span> Chat </span>
          </div>
        </a> 

        <a href="Account.html">
          <div class="navbar-links-containers">
            <img class="navbar-icons" src="public/Icons/Account-icon.png">
            <span> Account </span>
          </div>
        </a> 
      </nav>`;
}
