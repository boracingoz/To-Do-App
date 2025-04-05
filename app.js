// app.js - Manages the advanced to-do application for logged in users

// Get the current user
var currentUser = getLoggedInUser();
// Tasks are stored in localStorage under the key 'tasks_' + currentUser
var tasks = JSON.parse(localStorage.getItem("tasks_" + currentUser)) || [];
var currentFilter = "all";

// DOM Elements
var taskInput = document.getElementById("task-input");
var taskDueDateInput = document.getElementById("task-due-date");
var taskPrioritySelect = document.getElementById("task-priority");
var addTaskBtn = document.getElementById("add-task-btn");
var taskList = document.getElementById("task-list");
var filterButtons = document.querySelectorAll(".filter-btn");
var themeToggleBtn = document.getElementById("theme-toggle-btn");

// Save tasks to localStorage for the current user
function saveTasks() {
  localStorage.setItem("tasks_" + currentUser, JSON.stringify(tasks));
}

// Render tasks based on current filter
function renderTasks() {
  taskList.innerHTML = "";
  var filteredTasks = tasks;

  // Filter tasks based on selected filter
  if (currentFilter === "active") {
    filteredTasks = tasks.filter(function (task) {
      return !task.completed;
    });
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(function (task) {
      return task.completed;
    });
  } else if (currentFilter === "overdue") {
    var today = new Date().toISOString().split("T")[0];
    filteredTasks = tasks.filter(function (task) {
      return !task.completed && task.dueDate && task.dueDate < today;
    });
  }

  // Sort tasks by due date if available
  filteredTasks.sort(function (a, b) {
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  // Create DOM elements for each task
  filteredTasks.forEach(function (task) {
    var li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    // Task header contains task text and actions
    var taskHeader = document.createElement("div");
    taskHeader.className = "task-header";

    // Task text element
    var taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;
    taskText.contentEditable = false;
    taskText.addEventListener("click", function () {
      toggleTask(task.id);
    });
    taskHeader.appendChild(taskText);

    // Actions container
    var actionsDiv = document.createElement("div");
    actionsDiv.className = "actions";

    // Edit button
    var editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.title = "Edit Task";
    editBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      enableEditing(task, taskText, dueDateSpan, prioritySpan);
    });
    actionsDiv.appendChild(editBtn);

    // Delete button
    var deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.title = "Delete Task";
    deleteBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      deleteTask(task.id);
    });
    actionsDiv.appendChild(deleteBtn);

    taskHeader.appendChild(actionsDiv);
    li.appendChild(taskHeader);

    // Task details: due date and priority
    var taskDetails = document.createElement("div");
    taskDetails.className = "task-details";

    // Due Date element
    var dueDateSpan = document.createElement("span");
    dueDateSpan.textContent = task.dueDate
      ? "Due: " + task.dueDate
      : "No Due Date";
    taskDetails.appendChild(dueDateSpan);

    // Priority element
    var prioritySpan = document.createElement("span");
    prioritySpan.textContent = "Priority: " + task.priority;
    taskDetails.appendChild(prioritySpan);

    li.appendChild(taskDetails);

    taskList.appendChild(li);
  });
}

// Add a new task
function addTask() {
  var text = taskInput.value.trim();
  if (text === "") return;
  var dueDate = taskDueDateInput.value; // Optional due date
  var priority = taskPrioritySelect.value;
  var newTask = {
    id: Date.now(),
    text: text,
    dueDate: dueDate || null,
    priority: priority,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskDueDateInput.value = "";
  taskPrioritySelect.value = "Medium";
}

// Toggle task completion status
function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      return Object.assign({}, task, { completed: !task.completed });
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

// Enable inline editing for task text, due date, and priority
function enableEditing(task, taskTextElement, dueDateElement, priorityElement) {
  // Create input fields for editing
  var editText = document.createElement("input");
  editText.type = "text";
  editText.value = task.text;
  editText.className = "edit-input";

  var editDueDate = document.createElement("input");
  editDueDate.type = "date";
  editDueDate.value = task.dueDate || "";
  editDueDate.className = "edit-input";

  var editPriority = document.createElement("select");
  var priorities = ["Low", "Medium", "High"];
  priorities.forEach(function (p) {
    var option = document.createElement("option");
    option.value = p;
    option.textContent = p;
    if (p === task.priority) {
      option.selected = true;
    }
    editPriority.appendChild(option);
  });
  editPriority.className = "edit-input";

  // Replace current elements with input fields for editing
  taskTextElement.replaceWith(editText);
  if (dueDateElement) {
    dueDateElement.replaceWith(editDueDate);
  }
  if (priorityElement) {
    priorityElement.replaceWith(editPriority);
  }

  // Focus on the text input field
  editText.focus();

  // Function to save edits when input loses focus or Enter is pressed
  function saveEdit() {
    var newText = editText.value.trim();
    var newDueDate = editDueDate.value;
    var newPriority = editPriority.value;
    updateTask(task.id, newText, newDueDate, newPriority);
  }

  editText.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      saveEdit();
    }
  });
  editText.addEventListener("blur", saveEdit);
  editDueDate.addEventListener("blur", saveEdit);
  editPriority.addEventListener("blur", saveEdit);
}

// Update task details
function updateTask(id, newText, newDueDate, newPriority) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      return Object.assign({}, task, {
        text: newText || task.text,
        dueDate: newDueDate || null,
        priority: newPriority || task.priority,
      });
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
}

// Add event listeners to filter buttons
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");
    currentFilter = button.getAttribute("data-filter");
    renderTasks();
  });
});

// Toggle theme (Light/Dark)
function toggleTheme() {
  document.body.classList.toggle("dark");
  themeToggleBtn.textContent = document.body.classList.contains("dark")
    ? "Light Mode"
    : "Dark Mode";
}

// Event listeners for adding tasks and toggling theme
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});
themeToggleBtn.addEventListener("click", toggleTheme);

// Initial render of tasks
renderTasks();
