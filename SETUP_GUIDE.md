# TaskFlow - Setup & Access Guide

## ✅ Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

## 🚀 Installation

```bash
npm install
```

## 📡 Running the Server

```bash
npm start
```

The server will start on **http://localhost:3000**

### Server Output:
```
✓ Server running on http://localhost:3000
✓ API ready at http://localhost:3000/tasks
```

## 🌐 Accessing the Application

### ✅ CORRECT Way (via HTTP Server):
```
http://localhost:3000
```

### ❌ WRONG Way (file protocol causes CORS errors):
```
file:///c:/Users/Administrator/Downloads/JP COMS/taskflow/index.html
```

---

## 📊 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **GET** | `/tasks` | Fetch all tasks |
| **GET** | `/tasks/:id` | Fetch single task |
| **POST** | `/tasks` | Create new task |
| **PUT** | `/tasks/:id` | Update task |
| **DELETE** | `/tasks/:id` | Delete task |

### Example API Calls:

**Create a task:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Task",
    "description": "Task description",
    "priority": "high",
    "status": "pending",
    "dueDate": "2026-06-10"
  }'
```

**Get all tasks:**
```bash
curl http://localhost:3000/tasks
```

**Update a task:**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "description": "Updated description",
    "priority": "medium",
    "status": "in-progress",
    "dueDate": "2026-06-15"
  }'
```

**Delete a task:**
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

---

## 🐛 Troubleshooting

### Issue: "Failed to load tasks from server"

**Solution:**
1. Ensure the server is running: `npm start`
2. Access via HTTP: `http://localhost:3000` (NOT `file://`)
3. Check server console for any errors
4. Click "🔄 Retry Connection" button in the UI

### Issue: Port 3000 already in use

**Solution:**
```bash
# Change the port
PORT=3001 npm start
# Then access at http://localhost:3001
```

### Issue: CORS errors

**Solution:**
- The app is configured to accept requests from all origins (`*`)
- Ensure you're accessing via `http://localhost:3000`, not `file://`

---

## 📁 Project Structure

```
taskflow/
├── index.html          # HTML structure
├── css/
│   └── styles.css      # Responsive styles + design tokens
├── js/
│   └── app.js          # CRUD logic + API integration
├── db.json             # Mock data (tasks database)
├── server.js           # Express.js REST API backend
├── package.json        # Dependencies
└── SETUP_GUIDE.md      # This file
```

---

## ✨ Features

- ✅ **Full CRUD Operations** - Create, Read, Update, Delete tasks
- ✅ **Responsive Design** - Mobile (320px), Tablet (640px), Desktop (1024px)
- ✅ **Semantic HTML5** - Valid structure with landmarks
- ✅ **Modern CSS** - Flexbox/Grid layout with design tokens
- ✅ **Error Handling** - Try-catch blocks & user feedback
- ✅ **REST API** - Fully documented endpoints
- ✅ **CORS Enabled** - Safe cross-origin requests

---

## 🎯 CRUD Demonstration

Once the server is running, open **http://localhost:3000** and:

1. **READ** - All tasks load on page load
2. **CREATE** - Fill form and click "Add Task"
3. **UPDATE** - Click "Edit" on any task to modify it
4. **DELETE** - Click "Delete" and confirm removal

---

Generated for: 3TSY2526.IT0063.TW291-1 (Midterm Exam)
