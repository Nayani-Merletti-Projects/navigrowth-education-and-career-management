

const navbar = document.querySelector('.js-navbar');

document.querySelector('.js-menu-button')
  .addEventListener('click', () => {

    setTimeout(toggleNavBar, 100);

  });


function toggleNavBar() {
    
    
    const menuButtonElem = document.querySelector('.js-menu-button');

    if (navbar.innerHTML === '') {
      navbar.innerHTML = navBarHTML();
    } else {
      navbar.innerHTML = '';
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


