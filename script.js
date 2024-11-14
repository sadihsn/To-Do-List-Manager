// Get DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const searchBar = document.getElementById('searchBar');
const allTasksBtn = document.getElementById('allTasksBtn');
const completedTasksBtn = document.getElementById('completedTasksBtn');
const pendingTasksBtn = document.getElementById('pendingTasksBtn');
const noTasksMessage = document.getElementById('noTasksMessage');

// Task data
let tasks = [];

// Load tasks from localStorage
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks'));
  if (savedTasks) {
    tasks = savedTasks;
  }
  renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks(filter = 'all') {
  taskList.innerHTML = ''; // Clear existing tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true; // 'all' case
  });

  if (filteredTasks.length === 0) {
    noTasksMessage.style.display = 'block';
  } else {
    noTasksMessage.style.display = 'none';
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.setAttribute('draggable', 'true');
    li.setAttribute('data-id', task.id);
    li.classList.toggle('completed', task.completed);

    const taskText = document.createElement('span');
    taskText.textContent = task.name;
    if (task.completed) taskText.classList.add('completed');
    
    // Edit Button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => editTask(task.id);

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteTask(task.id);

    // Toggle completed
    const toggleCompletedButton = document.createElement('button');
    toggleCompletedButton.textContent = task.completed ? 'Undo' : 'Complete';
    toggleCompletedButton.onclick = () => toggleTaskCompletion(task.id);

    li.appendChild(taskText);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    li.appendChild(toggleCompletedButton);
    taskList.appendChild(li);
  });
}

// Add Task
addTaskButton.addEventListener('click', () => {
  if (taskInput.value.trim() === '') return;
  
  const newTask = {
    id: Date.now(),
    name: taskInput.value.trim(),
    completed: false
  };
  tasks.push(newTask);
  taskInput.value = '';
  saveTasks();
  renderTasks();
});

// Edit Task
function editTask(taskId) {
  const task = tasks.find(task => task.id === taskId);
  const newTaskName = prompt('Edit your task:', task.name);
  if (newTaskName !== null) {
    task.name = newTaskName.trim();
    saveTasks();
    renderTasks();
  }
}

// Delete Task
function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
  renderTasks();
}

// Toggle Task Completion
function toggleTaskCompletion(taskId) {
  const task = tasks.find(task => task.id === taskId);
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

// Filter tasks
allTasksBtn.addEventListener('click', () => renderTasks('all'));
completedTasksBtn.addEventListener('click', () => renderTasks('completed'));
pendingTasksBtn.addEventListener('click', () => renderTasks('pending'));

// Search tasks
searchBar.addEventListener('input', () => {
  const searchQuery = searchBar.value.toLowerCase();
  renderTasks('all');
  const tasksToFilter = [...taskList.children];
  tasksToFilter.forEach(taskItem => {
    const taskText = taskItem.querySelector('span').textContent.toLowerCase();
    if (!taskText.includes(searchQuery)) {
      taskItem.style.display = 'none';
    } else {
      taskItem.style.display = 'flex';
    }
  });
});

// Drag-and-drop functionality
taskList.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'LI') {
    e.dataTransfer.setData('text', e.target.dataset.id);
  }
});

taskList.addEventListener('dragover', (e) => {
  e.preventDefault();
});

taskList.addEventListener('drop', (e) => {
  const draggedTaskId = e.dataTransfer.getData('text');
  const draggedTaskIndex = tasks.findIndex(task => task.id == draggedTaskId);
  const targetTaskId = e.target.dataset.id;

  if (targetTaskId) {
    const targetTaskIndex = tasks.findIndex(task => task.id == targetTaskId);
    const draggedTask = tasks[draggedTaskIndex];
    tasks.splice(draggedTaskIndex, 1);
    tasks.splice(targetTaskIndex, 0, draggedTask);
    saveTasks();
    renderTasks();
  }
});

// Initialize the app
loadTasks();
