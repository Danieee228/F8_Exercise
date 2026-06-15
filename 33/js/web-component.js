import "./components/app-modal.js";

const openModal = document.querySelector("#open-modal");
const appModal = document.querySelector("app-modal");

openModal.addEventListener("click", (event) => {
  appModal.open();
});

appModal.addEventListener("open", () => {
  console.log("Hệ thống ghi nhận: Modal đã được chèn vào DOM và mở lên!");
});

appModal.addEventListener("close", () => {
  console.log("Hệ thống ghi nhận: Modal đang được gỡ khỏi DOM và đóng lại!");
});
