const addBtn = document.querySelector(".add-btn");
const addTaskModal = document.querySelector("#addTaskModal");
const closeBtn = addTaskModal.querySelector(".js-close-btn");
const cancelBtn = addTaskModal.querySelector(".js-cancel-modal");
const taskTitleInput = document.querySelector("#taskTitle");
const modalBox = addTaskModal.querySelector(".modal");
const todoForm = document.querySelector(".todo-app-form");
const taskGrid = document.querySelector(".task-grid");
const tabList = document.querySelector(".tab-list");
const tabButtons = tabList.querySelectorAll(".tab-button");
const searchInput = document.querySelector(".search-input");
let searchQuery = "";
let todoTasks = [];
let currentTab = "active";
let editIndex = null;

function openModal() {
  addTaskModal.classList.add("show");
  modalBox.scrollTop = 0;
  setTimeout(function () {
    taskTitleInput.focus();
  }, 300);
}

function closeModal() {
  addTaskModal.classList.remove("show");
}

addBtn.addEventListener("click", function () {
  editIndex = null;
  todoForm.reset();
  openModal();
});

closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

addTaskModal.addEventListener("click", function (event) {
  if (event.target === addTaskModal) {
    closeModal();
  }
});

// Handle form submission
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(todoForm);
  const newTask = Object.fromEntries(formData);
  if (editIndex === null) {
    // New task
    newTask.isCompleted = false;
    todoTasks.unshift(newTask);
  } else {
    // Edit existing task
    newTask.isCompleted = todoTasks[editIndex].isCompleted;
    todoTasks[editIndex] = newTask;
    editIndex = null;
  }
  todoForm.reset();
  closeModal();
  renderTasks();
});

// Handle complete and delete actions
taskGrid.addEventListener("click", function (event) {
  const completeBtn = event.target.closest(".js-dropdown-complete");
  const deleteBtn = event.target.closest(".js-dropdown-delete");
  const editBtn = event.target.closest(".js-dropdown-edit");
  // Toggle complete status
  if (completeBtn) {
    const taskIndex = completeBtn.dataset.index;
    todoTasks[taskIndex].isCompleted = !todoTasks[taskIndex].isCompleted;
    renderTasks();
  }
  // Delete task
  else if (deleteBtn) {
    const taskIndex = deleteBtn.dataset.index;
    todoTasks.splice(taskIndex, 1);
    renderTasks();
  }
  // Edit task
  else if (editBtn) {
    editIndex = editBtn.dataset.index;
    const task = todoTasks[editIndex];
    for (let key in task) {
      const input = todoForm.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = task[key];
      }
    }
    openModal();
  }
});

// Handle tab switching
tabList.addEventListener("click", function (event) {
  const tabBtn = event.target.closest(".tab-button");
  if (tabBtn) {
    const selectedTab = tabBtn.dataset.tab;
    if (selectedTab !== currentTab) {
      currentTab = selectedTab;
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabBtn.classList.add("active");
      renderTasks();
    }
  }
});

// Handle search input
searchInput.addEventListener("input", function (event) {
  searchQuery = event.target.value.toLowerCase();
  renderTasks();
});

// Render tasks
function renderTasks() {
  const filteredTasks = todoTasks.filter(function (task) {
    let isMatchTab = false;
    if (currentTab === "active") {
      isMatchTab = true;
    } else if (currentTab === "completed") {
      isMatchTab = task.isCompleted === true;
    }
    const isMatchSearch = task.title.toLowerCase().includes(searchQuery);
    return isMatchTab && isMatchSearch;
  });
  const htmlString = filteredTasks
    .map((task) => {
      const originalIndex = todoTasks.indexOf(task);
      return `
  <div class="task-card ${task.cardColor} ${task.isCompleted ? "completed" : ""}">
          <div class="task-header">
            <h3 class="task-title">${task.title}</h3>
            <button class="task-menu">
              <i class="fa-solid fa-ellipsis fa-icon"></i>
              <div class="dropdown-menu">
                <div class="dropdown-item js-dropdown-edit" data-index="${originalIndex}">
                  <i class="fa-solid fa-pen-to-square fa-icon"></i>
                  Edit
                </div>
                <div class="dropdown-item complete js-dropdown-complete" data-index="${originalIndex}">
                  <i class="fa-solid fa-check fa-icon"></i>
                  ${task.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                </div>
                <div class="dropdown-item delete js-dropdown-delete" data-index="${originalIndex}">
                  <i class="fa-solid fa-trash fa-icon"></i>
                  Delete
                </div>
              </div>
            </button>
          </div>
          <p class="task-description">
            ${task.description}
          </p>
          <div class="task-time">${task.startTime} - ${task.endTime}</div>
        </div>
  `;
    })
    .join("");
  taskGrid.innerHTML = htmlString;
}
