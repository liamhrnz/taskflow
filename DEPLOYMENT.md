# TaskFlow Deployment Guide

## Overview

This guide covers deploying TaskFlow to a **live, publicly accessible host** (Exam requirement). TaskFlow consists of:
- **Frontend:** Static HTML/CSS/JavaScript
- **Backend API:** JSON Server (can be replaced with Express.js + SQLite or cloud database)
- **Database:** JSON file (can be upgraded to PostgreSQL, MongoDB, or SQLite)

---

## Deployment Options

### Option 1: Vercel (Recommended for Beginners) ⭐

**Best for:** Quick deployment with minimal configuration. Free tier includes 10 projects.

#### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)

#### Steps

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "TaskFlow: Ready for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Configure Environment (if using Express backend):**
   - In Vercel dashboard: Settings → Environment Variables
   - Add required variables (e.g., `DATABASE_URL`)

4. **Result:**
   - Your app is live at: `https://taskflow-[random].vercel.app`
   - Auto-deploys on every push to `main` branch

**Limitations:** Vercel is primarily for static sites. For JSON Server, you need to either:
- Use a separate backend service (see Option 2)
- Replace JSON Server with Express.js backend deployed to a service like Render or Railway

---

### Option 2: Heroku (Full-Stack Deployment) ⭐⭐

**Best for:** Full-stack apps with backend API and database. Free tier available.

#### Prerequisites
- Heroku account (https://www.heroku.com)
- Heroku CLI installed
- GitHub account
- Express.js backend (replaces JSON Server)

#### Steps

1. **Replace JSON Server with Express.js:**

Create `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

let tasks = [];
const dbPath = path.join(__dirname, 'db.json');

// Load tasks from file
function loadTasks() {
    if (fs.existsSync(dbPath)) {
        tasks = JSON.parse(fs.readFileSync(dbPath, 'utf8')).tasks || [];
    }
}

// Save tasks to file
function saveTasks() {
    fs.writeFileSync(dbPath, JSON.stringify({ tasks }, null, 2));
}

loadTasks();

// GET all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// GET single task
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    res.json(task || {});
});

// POST create task
app.post('/tasks', (req, res) => {
    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        ...req.body
    };
    tasks.push(newTask);
    saveTasks();
    res.status(201).json(newTask);
});

// PUT update task
app.put('/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index > -1) {
        tasks[index] = { id: parseInt(req.params.id), ...req.body };
        saveTasks();
        res.json(tasks[index]);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// DELETE task
app.delete('/tasks/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index > -1) {
        tasks.splice(index, 1);
        saveTasks();
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`TaskFlow API running on port ${PORT}`);
});
```

2. **Update `package.json`:**
```json
{
  "name": "taskflow",
  "version": "1.0.0",
  "description": "TaskFlow - Transactional task manager",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Deploy to Heroku:**
   ```bash
   # Install Heroku CLI first
   heroku login
   heroku create taskflow-yourname
   git push heroku main
   ```

5. **Result:**
   - Your app is live at: `https://taskflow-yourname.herokuapp.com`
   - Runs on Heroku's free tier (with limitations)

---

### Option 3: Railway (Modern Alternative)

**Best for:** Simple, modern deployment. Free tier with credits ($5/month).

#### Steps

1. **Update `package.json` with `start` script** (already done above)

2. **Push to GitHub**

3. **Deploy on Railway:**
   - Go to https://railway.app
   - Connect your GitHub account
   - Import repository
   - Click "Deploy"

4. **Result:**
   - Live URL provided instantly
   - Environment variables easily configurable

---

### Option 4: Netlify (Frontend Only)

**Best for:** Frontend hosting only. Free tier with unlimited sites.

#### Steps

1. **Build step (optional):**
   ```bash
   npm run build  # If you add a build process
   ```

2. **Deploy on Netlify:**
   - Connect your GitHub repository
   - Build command: (leave blank for static site)
   - Publish directory: `.` (project root)
   - Click "Deploy"

3. **Connect to External API:**
   - Update `app.js` to point to your backend API:
   ```javascript
   const API_BASE_URL = 'https://taskflow-api.herokuapp.com';
   ```

---

## Environment Configuration

### For Production

Create a `.env` file (do NOT commit):
```env
API_BASE_URL=https://your-api-domain.com
NODE_ENV=production
DATABASE_URL=your_database_connection_string
```

Update `app.js` to use environment variables:
```javascript
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
```

---

## Database Upgrades (Optional)

### From JSON to SQLite (Lightweight)

```javascript
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('tasks.db');

// Create table
db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT,
    status TEXT,
    dueDate TEXT
)`);
```

### From JSON to PostgreSQL (Scalable)

```javascript
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.get('/tasks', async (req, res) => {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
});
```

---

## Pre-Deployment Checklist

- [ ] All CRUD operations tested locally
- [ ] `.env` file created and added to `.gitignore`
- [ ] `package.json` includes `"start"` script
- [ ] README updated with live URL
- [ ] Git repository initialized and pushed to GitHub
- [ ] Environment variables configured on hosting platform
- [ ] API endpoint updated for production domain
- [ ] Database backup created
- [ ] Error handling tested in browser console
- [ ] Responsive design tested on mobile
- [ ] All buttons and forms working end-to-end

---

## Testing in Production

### Test Each Endpoint

```bash
# GET all tasks
curl https://your-domain.com/tasks

# POST create task
curl -X POST https://your-domain.com/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task", "priority": "high", "status": "pending"}'

# PUT update task
curl -X PUT https://your-domain.com/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated", "status": "done"}'

# DELETE task
curl -X DELETE https://your-domain.com/tasks/1
```

### Browser Testing

1. Open the live URL in your browser
2. Add a task → verify it persists after refresh
3. Edit a task → verify changes are saved
4. Toggle status → verify color badges update
5. Delete a task → verify removal from database
6. Check browser console for errors

---

## Troubleshooting

### Issue: CORS Errors

**Solution:** Enable CORS in backend:
```javascript
const cors = require('cors');
app.use(cors({
    origin: 'https://your-frontend-domain.com',
    credentials: true
}));
```

### Issue: 404 Not Found on Refresh

**Solution:** Add fallback route for SPA:
```javascript
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
```

### Issue: Database Not Persisting

**Solution:** Use persistent storage (not ephemeral):
- ❌ In-memory database (lost on restart)
- ✅ File-based: SQLite
- ✅ Cloud database: PostgreSQL, MongoDB

### Issue: Slow API Response

**Solution:** 
- Add caching headers
- Optimize database queries
- Use CDN for static assets

---

## Performance Optimization

### 1. Minify CSS and JavaScript
```bash
npm install --save-dev cssnano terser
```

### 2. Enable Gzip Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Add Caching Headers
```javascript
app.use(express.static('.', {
    maxAge: '1d',
    etag: false
}));
```

### 4. Lazy Load Images (if added)
```html
<img src="task.png" loading="lazy" alt="Task">
```

---

## Security Best Practices

- ✅ Use HTTPS (all hosting platforms provide free SSL)
- ✅ Validate/sanitize all user inputs
- ✅ Never commit `.env` files with secrets
- ✅ Use environment variables for sensitive data
- ✅ Implement rate limiting on API endpoints
- ✅ Add authentication (JWT, OAuth) for multi-user apps
- ✅ Use CORS whitelist instead of `*`
- ✅ Keep dependencies updated (`npm audit fix`)

---

## Monitoring & Logging

### Heroku Logs
```bash
heroku logs --tail
```

### Vercel Logs
- Dashboard → Deployments → Logs tab

### Add Error Tracking
```bash
npm install sentry
```

---

## Continuous Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Heroku

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: taskflow-yourname
          heroku_email: your-email@example.com
```

---

## Summary

| Platform | Setup Time | Cost | Best For |
|----------|-----------|------|----------|
| **Vercel** | 5 min | Free | Static frontend |
| **Netlify** | 5 min | Free | Static frontend |
| **Heroku** | 15 min | Free tier | Full-stack apps |
| **Railway** | 10 min | Free credits | Full-stack apps |
| **AWS** | 30 min | Varies | Enterprise scale |

---

## Live URL Template

Once deployed, your app will be accessible at:
- **Frontend:** `https://taskflow-[name].vercel.app`
- **API:** `https://taskflow-api-[name].herokuapp.com`
- **Live App:** `https://taskflow-[name].netlify.app`

Update `js/app.js` with your production domain:
```javascript
const API_BASE_URL = 'https://your-live-api-domain.com';
```

---

## Exam Submission

For the exam, you need to provide:
1. **Live URL** — fully functional public link
2. **GitHub Repository** — source code with clean git history
3. **README.md** — setup instructions and feature overview
4. **API Documentation** — endpoint descriptions
5. **Deployment Notes** — platform used and any custom configuration

All requirements are now in place! 🚀
