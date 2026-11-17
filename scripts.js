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

function toogleBurger() {
  header.classList.toggle("active");
  nav.classList.toggle("active");
  nav_links.classList.toggle("active");
  logo.classList.toggle("active");
  progressBar.classList.toggle("active");
}
// When the user scrolls the page, execute myFunction
window.onscroll = function () {
  myFunction();
};

function myFunction() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";

  if (scrolled >= 10) {
    logo.classList.add("hide");
  } else {
    logo.classList.remove("hide");
  }
}
