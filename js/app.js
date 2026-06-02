// ===== TASKFLOW APP - ACT 1 + ACT 2: DOM + REST API INTEGRATION =====
// Act 1: DOM manipulation and form handling
// Act 2: Full CRUD operations via REST API using fetch()

// ===== API CONFIGURATION =====
const API_BASE_URL = 'http://localhost:3000';
const API_TASKS_ENDPOINT = `${API_BASE_URL}/tasks`;

// ===== STATE MANAGEMENT =====
let tasks = [];
let editingTaskId = null;

// ===== DOM ELEMENTS =====
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const priorityInput = document.getElementById('priority');
const statusInput = document.getElementById('status');
const dueDateInput = document.getElementById('dueDate');
const submitButton = taskForm.querySelector('button[type="submit"]');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    attachEventListeners();
    loadTasksFromAPI();
});

// ===== API CALLS - READ =====

/**
 * Load all tasks from the REST API
 */
async function loadTasksFromAPI() {
    try {
        console.log('Fetching tasks from API...');
        const response = await fetch(API_TASKS_ENDPOINT);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        tasks = await response.json();
        console.log(`Loaded ${tasks.length} tasks from API`);
        renderTasks();
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('Failed to load tasks from server. Please check if the API is running.');
    }
}

// ===== API CALLS - CREATE =====

/**
 * Add a new task via REST API (POST)
 */
async function addTaskViaAPI() {
    const newTask = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        priority: priorityInput.value,
        status: statusInput.value,
        dueDate: dueDateInput.value
    };
    
    if (!newTask.title) {
        alert('Please enter a task title');
        return;
    }
    
    try {
        console.log('Creating task via API:', newTask);
        
        const response = await fetch(API_TASKS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const createdTask = await response.json();
        tasks.push(createdTask);
        renderTasks();
        console.log('Task created successfully:', createdTask);
    } catch (error) {
        console.error('Error creating task:', error);
        showError('Failed to create task. Please try again.');
    }
}

// ===== API CALLS - UPDATE =====

/**
 * Update an existing task via REST API (PUT)
 */
async function updateTaskViaAPI(id) {
    const updatedTask = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        priority: priorityInput.value,
        status: statusInput.value,
        dueDate: dueDateInput.value
    };
    
    try {
        console.log(`Updating task ${id} via API:`, updatedTask);
        
        const response = await fetch(`${API_TASKS_ENDPOINT}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        // Update local state
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = responseData;
        }
        
        editingTaskId = null;
        renderTasks();
        console.log('Task updated successfully:', responseData);
    } catch (error) {
        console.error('Error updating task:', error);
        showError('Failed to update task. Please try again.');
    }
}

/**
 * Toggle task status via REST API (PUT)
 */
async function toggleTaskStatusViaAPI(id) {
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
        console.error('Task not found:', id);
        return;
    }
    
    const statusCycle = ['pending', 'in-progress', 'done'];
    const currentIndex = statusCycle.indexOf(task.status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    
    try {
        console.log(`Toggling task ${id} status to ${nextStatus}`);
        
        const response = await fetch(`${API_TASKS_ENDPOINT}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...task,
                status: nextStatus
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const updatedTask = await response.json();
        
        // Update local state
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex] = updatedTask;
        }
        
        renderTasks();
        console.log('Task status toggled:', id, '→', nextStatus);
    } catch (error) {
        console.error('Error toggling task status:', error);
        showError('Failed to update task status. Please try again.');
    }
}

// ===== API CALLS - DELETE =====

/**
 * Delete a task via REST API (DELETE)
 */
async function deleteTaskViaAPI(id) {
    try {
        console.log(`Deleting task ${id} via API`);
        
        const response = await fetch(`${API_TASKS_ENDPOINT}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok && response.status !== 204) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        // Remove from local state
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
        }
        
        renderTasks();
        console.log('Task deleted successfully:', id);
    } catch (error) {
        console.error('Error deleting task:', error);
        showError('Failed to delete task. Please try again.');
    }
}

// ===== EVENT LISTENERS =====
function attachEventListeners() {
    taskForm.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    try {
        if (editingTaskId !== null) {
            await updateTaskViaAPI(editingTaskId);
        } else {
            await addTaskViaAPI();
        }
        
        resetForm();
    } catch (error) {
        console.error('Form submission error:', error);
        alert('Error saving task. Please try again.');
    }
}

// ===== UI INTERACTIONS =====

/**
 * Load a task into the form for editing
 */
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
        console.error('Task not found:', id);
        return;
    }
    
    titleInput.value = task.title;
    descriptionInput.value = task.description;
    priorityInput.value = task.priority;
    statusInput.value = task.status;
    dueDateInput.value = task.dueDate;
    
    editingTaskId = id;
    submitButton.textContent = 'Update Task';
    titleInput.focus();
    
    // Scroll to form
    taskForm.scrollIntoView({ behavior: 'smooth' });
    console.log('Editing task:', id);
}

// ===== RENDERING =====

/**
 * Render all tasks to the DOM
 */
function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<li style="text-align: center; color: var(--color-neutral-400); padding: var(--space-lg);">No tasks yet. Add one to get started!</li>';
        return;
    }
    
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

/**
 * Create a task element (list item with all controls)
 */
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item status-${task.status}`;
    li.setAttribute('data-task-id', task.id);
    
    // Task Header
    const header = document.createElement('div');
    header.className = 'task-header';
    
    const title = document.createElement('h3');
    title.className = 'task-title';
    title.textContent = task.title;
    
    // Task Meta (badges)
    const meta = document.createElement('div');
    meta.className = 'task-meta';
    
    // Priority Badge
    const priorityBadge = document.createElement('span');
    priorityBadge.className = `badge badge-priority priority-${task.priority}`;
    priorityBadge.textContent = capitalizeFirst(task.priority);
    
    // Status Badge
    const statusBadge = document.createElement('span');
    statusBadge.className = `badge badge-status status-${task.status}`;
    statusBadge.textContent = formatStatus(task.status);
    
    meta.appendChild(priorityBadge);
    meta.appendChild(statusBadge);
    
    // Due Date
    if (task.dueDate) {
        const dueDate = document.createElement('span');
        dueDate.className = 'due-date';
        dueDate.textContent = `Due: ${formatDate(task.dueDate)}`;
        meta.appendChild(dueDate);
    }
    
    header.appendChild(title);
    header.appendChild(meta);
    
    // Task Description
    if (task.description) {
        const description = document.createElement('p');
        description.className = 'task-description';
        description.textContent = task.description;
        li.appendChild(description);
    }
    
    // Task Actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn-edit';
    toggleBtn.type = 'button';
    const statusLabel = task.status === 'done' ? 'Reopen' : 'Complete';
    toggleBtn.textContent = statusLabel;
    toggleBtn.addEventListener('click', () => toggleTaskStatusViaAPI(task.id));
    
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTask(task.id));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTaskViaAPI(task.id);
        }
    });
    
    actions.appendChild(toggleBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    
    li.appendChild(header);
    li.appendChild(meta);
    if (task.description) li.insertBefore(
        document.querySelector(`.task-item[data-task-id="${task.id}"] .task-description`),
        li.querySelector('.task-actions')
    );
    li.appendChild(actions);
    
    return li;
}

// ===== UTILITIES =====

/**
 * Reset form to initial state
 */
function resetForm() {
    taskForm.reset();
    editingTaskId = null;
    submitButton.textContent = 'Add Task';
}

/**
 * Format status for display (in-progress → In Progress)
 */
function formatStatus(status) {
    return status
        .split('-')
        .map(word => capitalizeFirst(word))
        .join(' ');
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format ISO date to readable format (2026-06-02 → Jun 02, 2026)
 */
function formatDate(isoDate) {
    if (!isoDate) return '';
    
    const date = new Date(isoDate + 'T00:00:00');
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Show error message to user
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--color-danger);
        color: white;
        padding: var(--space-lg);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        font-weight: 500;
        max-width: 300px;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// ===== EXPORTS (for future testing/integration) =====
window.TaskFlowApp = {
    tasks,
    loadTasksFromAPI,
    addTaskViaAPI,
    updateTaskViaAPI,
    deleteTaskViaAPI,
    toggleTaskStatusViaAPI,
    editTask,
    renderTasks,
    resetForm,
    API_BASE_URL,
    API_TASKS_ENDPOINT
};