import "./components/app-heading.js";
import "./components/app-modal.js";

const openModal = document.querySelector("#open-modal");
const appModal = document.querySelector("app-modal");

openModal.addEventListener("click", (event) => {
  appModal.open();
});
