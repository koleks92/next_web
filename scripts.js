// Burger menu for mobile
const header = document.querySelector("header");
const nav = document.querySelector("nav");
const nav_links = document.querySelector("#nav_links");
const logo = document.querySelector("header img");
const progressBar = document.querySelector("#progress-container");
const button = document.querySelector("#burger_button");

const links = document.querySelectorAll("#nav_links a");

links.forEach((l) => {
  l.addEventListener("click", () => {
    toogleBurger();
  });
});

button.addEventListener("click", (event) => {
  toogleBurger();
});

// Toggle burger menu
function toogleBurger() {
  header.classList.toggle("active");
  nav.classList.toggle("active");
  nav_links.classList.toggle("active");
  logo.classList.toggle("active");
  progressBar.classList.toggle("active");
}

// When the user scrolls the page, execute hideLogo
window.onscroll = function () {
  hideLogo();
};

// Hide logo, change colors
function hideLogo() {
  const burgerButton = button.querySelector("svg");
  const ansøgButton = document.querySelector("#signup_div");
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
  console.log(burgerButton);

  // Hide logo, change burger color
  if (scrolled >= 10) {
    logo.classList.add("hide");
    burgerButton.classList.add("darkButton");
  } else {
    logo.classList.remove("hide");
    burgerButton.classList.remove("darkButton");
  }

  // Change ansøg button color
  if (scrolled >= 2) {
    ansøgButton.classList.add("darkButton");
  } else {
    ansøgButton.classList.remove("darkButton");
  }
} 


