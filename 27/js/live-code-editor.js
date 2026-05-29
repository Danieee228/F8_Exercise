const codeInput = document.querySelector(".js-code-input");
const previewFrame = document.querySelector(".js-preview-frame");
const contextMenu = document.querySelector(".js-context-menu");
const menuClear = document.querySelector(".js-menu-clear");

// Live preview update
codeInput.addEventListener("input", (event) => {
  previewFrame.srcdoc = codeInput.value;
});

// Warn user about unsaved changes
window.addEventListener("beforeunload", (event) => {
  if (codeInput.value.trim() !== "") {
    event.preventDefault();
    event.returnValue = "";
  }
});

// Context menu
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  openContextMenu(mouseX, mouseY);
});

// Close context menu on click outside or window blur
document.addEventListener("click", (event) => {
  closeContextMenu();
});

// Clear code and preview
menuClear.addEventListener("click", (event) => {
  previewFrame.srcdoc = "";
  codeInput.value = "";
});

// Close context menu on window blur
window.addEventListener("blur", (event) => {
  closeContextMenu();
});

// Close context menu function
function closeContextMenu() {
  contextMenu.classList.remove("active");
}

// Open context menu
function openContextMenu(mouseX, mouseY) {
  contextMenu.classList.add("active");

  if (mouseX + contextMenu.offsetWidth >= window.innerWidth) {
    contextMenu.style.left = mouseX - contextMenu.offsetWidth + "px";
  } else {
    contextMenu.style.left = mouseX + "px";
  }

  if (mouseY + contextMenu.offsetHeight >= window.innerHeight) {
    contextMenu.style.top = mouseY - contextMenu.offsetHeight + "px";
  } else {
    contextMenu.style.top = mouseY + "px";
  }
}
