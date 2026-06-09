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
const modalTitle = addTaskModal.querySelector(".modal-title");
const submitBtn = todoForm.querySelector('button[type="submit"]');
let searchQuery = "";
let todoTasks = [];
let currentTab = "active";
let editId = null;

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
  editId = null;
  todoForm.reset();
  modalTitle.textContent = "Add New Task";
  submitBtn.textContent = "Create Task";
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
todoForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const formData = new FormData(todoForm);
  const newTask = Object.fromEntries(formData);
  if (editId === null) {
    try {
      // New task
      newTask.isCompleted = false;
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }
      todoForm.reset();
      closeModal();
      getTasks();
    } catch (error) {
      console.log("Không tạo được");
    }
  } else {
    // Edit existing task
    try {
      const currentTask = todoTasks.find((task) => task.id == editId);
      if (currentTask) {
        newTask.isCompleted = currentTask.isCompleted;
      }
      const response = await fetch(`http://localhost:3000/tasks/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }
      todoForm.reset();
      closeModal();
      editId = null;
      getTasks();
    } catch (error) {
      console.log("Không thể cập nhật nội dung");
    }
  }
});

// Handle complete and delete actions
taskGrid.addEventListener("click", async function (event) {
  const completeBtn = event.target.closest(".js-dropdown-complete");
  const deleteBtn = event.target.closest(".js-dropdown-delete");
  const editBtn = event.target.closest(".js-dropdown-edit");
  // Toggle complete status
  if (completeBtn) {
    const taskId = completeBtn.dataset.id;
    const currentTask = todoTasks.find((task) => task.id == taskId);
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isCompleted: !currentTask.isCompleted }),
      });
      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }
      getTasks();
    } catch (error) {
      console.log("Không thể đổi");
    }
  }
  // Delete task
  else if (deleteBtn) {
    const taskId = deleteBtn.dataset.id;
    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }
      getTasks();
    } catch (error) {
      console.log("Không thể xóa");
    }
  }
  // Edit task
  else if (editBtn) {
    editId = editBtn.dataset.id;
    const currentTask = todoTasks.find((task) => task.id == editId);
    if (currentTask) {
      for (let key in currentTask) {
        const input = todoForm.querySelector(`[name="${key}"]`);
        if (input) input.value = currentTask[key];
      }
      modalTitle.textContent = "Update Task";
      submitBtn.textContent = "Update Task";
      openModal();
    }
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

async function getTasks(url) {
  try {
    const response = await fetch("http://localhost:3000/tasks");
    if (!response.ok) {
      throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
    }
    const tasks = await response.json();
    todoTasks = tasks;
    renderTasks();
  } catch (error) {
    console.log("Không lấy được");
  }
}

// Render tasks
function renderTasks() {
  const filteredTasks = todoTasks.filter(function (task) {
    let isMatchTab = false;
    if (currentTab === "active") {
      isMatchTab = task.isCompleted === false;
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
                <div class="dropdown-item js-dropdown-edit" data-id="${task.id}">
                  <i class="fa-solid fa-pen-to-square fa-icon"></i>
                  Edit
                </div>
                <div class="dropdown-item complete js-dropdown-complete" data-id="${task.id}">
                  <i class="fa-solid fa-check fa-icon"></i>
                  ${task.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                </div>
                <div class="dropdown-item delete js-dropdown-delete" data-id="${task.id}">
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

getTasks();
