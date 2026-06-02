/**
 * TaskFlow Express.js Server
 * Production-ready REST API backend
 * 
 * Usage:
 *   npm install
 *   npm start
 *   Server runs on http://localhost:3000
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// ===== INITIALIZATION =====
const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

// ===== MIDDLEWARE =====
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from project root (HTML, CSS, JS)
app.use(express.static('.'));

// ===== DATABASE UTILITIES =====

/**
 * Load tasks from db.json file
 */
function loadTasks() {
    try {
        if (fs.existsSync(DB_PATH)) {
            const data = fs.readFileSync(DB_PATH, 'utf8');
            const parsed = JSON.parse(data);
            return parsed.tasks || [];
        }
    } catch (error) {
        console.error('Error reading db.json:', error.message);
    }
    return [];
}

/**
 * Save tasks to db.json file
 */
function saveTasks(tasks) {
    try {
        const data = { tasks };
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing db.json:', error.message);
        return false;
    }
}

/**
 * Get next available ID
 */
function getNextId(tasks) {
    if (tasks.length === 0) return 1;
    return Math.max(...tasks.map(t => t.id)) + 1;
}

// ===== LOGGING MIDDLEWARE =====
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// ===== ROUTES - READ =====

/**
 * GET /tasks - Retrieve all tasks
 */
app.get('/tasks', (req, res) => {
    try {
        const tasks = loadTasks();
        res.status(200).json(tasks);
    } catch (error) {
        console.error('GET /tasks error:', error);
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
});

/**
 * GET /tasks/:id - Retrieve a single task by ID
 */
app.get('/tasks/:id', (req, res) => {
    try {
        const tasks = loadTasks();
        const taskId = parseInt(req.params.id);
        const task = tasks.find(t => t.id === taskId);

        if (!task) {
            return res.status(404).json({ error: `Task with ID ${taskId} not found` });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('GET /tasks/:id error:', error);
        res.status(500).json({ error: 'Failed to retrieve task' });
    }
});

// ===== ROUTES - CREATE =====

/**
 * POST /tasks - Create a new task
 */
app.post('/tasks', (req, res) => {
    try {
        const { title, description = '', priority = 'medium', status = 'pending', dueDate = '' } = req.body;

        // Validation
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }

        if (!['low', 'medium', 'high'].includes(priority)) {
            return res.status(400).json({ error: 'Invalid priority value' });
        }

        if (!['pending', 'in-progress', 'done'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Load tasks and create new task
        const tasks = loadTasks();
        const newTask = {
            id: getNextId(tasks),
            title: title.trim(),
            description: description.trim(),
            priority,
            status,
            dueDate: dueDate || ''
        };

        // Save to database
        tasks.push(newTask);
        if (!saveTasks(tasks)) {
            throw new Error('Failed to save to database');
        }

        console.log(`✓ Task created: ID=${newTask.id}, Title="${newTask.title}"`);
        res.status(201).json(newTask);
    } catch (error) {
        console.error('POST /tasks error:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// ===== ROUTES - UPDATE =====

/**
 * PUT /tasks/:id - Update a task
 */
app.put('/tasks/:id', (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const { title, description = '', priority = 'medium', status = 'pending', dueDate = '' } = req.body;

        // Validation
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }

        if (!['low', 'medium', 'high'].includes(priority)) {
            return res.status(400).json({ error: 'Invalid priority value' });
        }

        if (!['pending', 'in-progress', 'done'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Load tasks and find the task
        const tasks = loadTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        if (taskIndex === -1) {
            return res.status(404).json({ error: `Task with ID ${taskId} not found` });
        }

        // Update task
        const updatedTask = {
            id: taskId,
            title: title.trim(),
            description: description.trim(),
            priority,
            status,
            dueDate: dueDate || ''
        };

        tasks[taskIndex] = updatedTask;

        // Save to database
        if (!saveTasks(tasks)) {
            throw new Error('Failed to save to database');
        }

        console.log(`✓ Task updated: ID=${taskId}, Title="${updatedTask.title}"`);
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('PUT /tasks/:id error:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// ===== ROUTES - DELETE =====

/**
 * DELETE /tasks/:id - Delete a task
 */
app.delete('/tasks/:id', (req, res) => {
    try {
        const taskId = parseInt(req.params.id);

        // Load tasks and find the task
        const tasks = loadTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        if (taskIndex === -1) {
            return res.status(404).json({ error: `Task with ID ${taskId} not found` });
        }

        // Remove task
        const deletedTask = tasks.splice(taskIndex, 1)[0];

        // Save to database
        if (!saveTasks(tasks)) {
            throw new Error('Failed to save to database');
        }

        console.log(`✓ Task deleted: ID=${taskId}, Title="${deletedTask.title}"`);
        res.status(204).send();
    } catch (error) {
        console.error('DELETE /tasks/:id error:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// ===== HEALTH CHECK =====

/**
 * GET / - Health check endpoint
 */
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'running',
        service: 'TaskFlow API',
        version: '1.0.0',
        endpoints: {
            GET: ['/tasks', '/tasks/:id'],
            POST: ['/tasks'],
            PUT: ['/tasks/:id'],
            DELETE: ['/tasks/:id']
        }
    });
});

// ===== ERROR HANDLING =====

/**
 * 404 - Not Found
 */
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `The requested route ${req.method} ${req.path} does not exist`
    });
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
    });
});

// ===== SERVER STARTUP =====

app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║          TaskFlow Express.js Server Started            ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ API ready at http://localhost:${PORT}/tasks`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('\n📚 API Endpoints:');
    console.log('  GET    /tasks         - Get all tasks');
    console.log('  GET    /tasks/:id     - Get single task');
    console.log('  POST   /tasks         - Create task');
    console.log('  PUT    /tasks/:id     - Update task');
    console.log('  DELETE /tasks/:id     - Delete task\n');
    console.log('🌐 CORS enabled for all origins (configure in production)\n');
});

module.exports = app;