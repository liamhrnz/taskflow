# Express.js Server Documentation

## Overview

This is a production-ready Express.js backend server for TaskFlow. It replaces JSON Server with a proper Node.js API server that:
- ✅ Serves static HTML/CSS/JS files
- ✅ Provides REST API endpoints for CRUD operations
- ✅ Handles data persistence to `db.json`
- ✅ Includes error handling and validation
- ✅ Supports CORS for cross-origin requests
- ✅ Logs all requests
- ✅ Can be deployed to any Node.js hosting platform

---

## Installation

### Prerequisites
- Node.js 18+ installed
- npm 8+

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Verify installation:**
   ```bash
   npm list express cors
   ```

---

## Running the Server

### Development Mode

```bash
npm start
```

Or with auto-restart on file changes (requires nodemon):
```bash
npm install --save-dev nodemon
npx nodemon server.js
```

**Output:**
```
╔════════════════════════════════════════════════════════╗
║          TaskFlow Express.js Server Started            ║
╚════════════════════════════════════════════════════════╝

✓ Server running on http://localhost:3000
✓ API ready at http://localhost:3000/tasks
✓ Environment: development
```

### Production Mode

```bash
NODE_ENV=production npm start
```

---

## API Endpoints

### Health Check

**GET `/`**
```bash
curl http://localhost:3000/
```

**Response:**
```json
{
  "status": "running",
  "service": "TaskFlow API",
  "version": "1.0.0",
  "endpoints": {
    "GET": ["/tasks", "/tasks/:id"],
    "POST": ["/tasks"],
    "PUT": ["/tasks/:id"],
    "DELETE": ["/tasks/:id"]
  }
}
```

---

### Create Task

**POST `/tasks`**

**Request:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Express.js",
    "description": "Build a REST API backend",
    "priority": "high",
    "status": "pending",
    "dueDate": "2026-06-10"
  }'
```

**Response:** 201 Created
```json
{
  "id": 5,
  "title": "Learn Express.js",
  "description": "Build a REST API backend",
  "priority": "high",
  "status": "pending",
  "dueDate": "2026-06-10"
}
```

**Validation:**
- `title` (required) — Must not be empty
- `priority` — One of: `low`, `medium`, `high`
- `status` — One of: `pending`, `in-progress`, `done`

---

### Read All Tasks

**GET `/tasks`**

```bash
curl http://localhost:3000/tasks
```

**Response:** 200 OK
```json
[
  {
    "id": 1,
    "title": "Set up project structure",
    "description": "Create folders for css, js, and assets",
    "priority": "high",
    "status": "done",
    "dueDate": "2026-06-01"
  },
  ...
]
```

---

### Read Single Task

**GET `/tasks/:id`**

```bash
curl http://localhost:3000/tasks/1
```

**Response:** 200 OK
```json
{
  "id": 1,
  "title": "Set up project structure",
  "description": "Create folders for css, js, and assets",
  "priority": "high",
  "status": "done",
  "dueDate": "2026-06-01"
}
```

**Error (404 Not Found):**
```json
{
  "error": "Task with ID 99999 not found"
}
```

---

### Update Task

**PUT `/tasks/:id`**

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "description": "Updated description",
    "priority": "medium",
    "status": "in-progress",
    "dueDate": "2026-06-15"
  }'
```

**Response:** 200 OK
```json
{
  "id": 1,
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "medium",
  "status": "in-progress",
  "dueDate": "2026-06-15"
}
```

---

### Delete Task

**DELETE `/tasks/:id`**

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

**Response:** 204 No Content (empty body)

---

## Error Handling

### 400 Bad Request

**Cause:** Invalid request data

**Response:**
```json
{
  "error": "Title is required"
}
```

### 404 Not Found

**Cause:** Task ID doesn't exist

**Response:**
```json
{
  "error": "Task with ID 99999 not found"
}
```

### 500 Internal Server Error

**Cause:** Server error (database issue, etc.)

**Response:**
```json
{
  "error": "Failed to create task"
}
```

---

## Configuration

### Environment Variables

Create a `.env` file (in production):

```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com
```

### Accessing from .env

In `server.js`:
```javascript
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
```

### Production Setup

1. **Install dotenv:**
   ```bash
   npm install dotenv
   ```

2. **Load in server.js (add to top):**
   ```javascript
   require('dotenv').config();
   ```

3. **Create `.env` file:**
   ```env
   NODE_ENV=production
   PORT=8080
   CORS_ORIGIN=https://taskflow.example.com
   ```

---

## CORS Configuration

### Default (Development)

```javascript
app.use(cors({
    origin: '*',  // Allow all origins
    credentials: true
}));
```

### Production Whitelist

```javascript
app.use(cors({
    origin: ['https://taskflow.example.com', 'https://www.taskflow.example.com'],
    credentials: true
}));
```

---

## Testing with Postman

1. **Import TaskFlow API:**
   - Create new collection: "TaskFlow"
   - Add requests for each endpoint

2. **GET /tasks**
   - Method: GET
   - URL: `http://localhost:3000/tasks`
   - Click Send

3. **POST /tasks**
   - Method: POST
   - URL: `http://localhost:3000/tasks`
   - Headers: `Content-Type: application/json`
   - Body (JSON):
     ```json
     {
       "title": "Test task",
       "priority": "high",
       "status": "pending"
     }
     ```
   - Click Send

4. **PUT /tasks/1**
   - Method: PUT
   - URL: `http://localhost:3000/tasks/1`
   - Headers: `Content-Type: application/json`
   - Body: Update any fields
   - Click Send

5. **DELETE /tasks/1**
   - Method: DELETE
   - URL: `http://localhost:3000/tasks/1`
   - Click Send

---

## Logging

### Request Logging

The server logs all requests with timestamp:
```
[2026-06-02T18:07:20.831Z] GET /tasks
[2026-06-02T18:07:21.045Z] POST /tasks
[2026-06-02T18:07:22.123Z] PUT /tasks/5
```

### Task Operations

```
✓ Task created: ID=5, Title="Buy groceries"
✓ Task updated: ID=5, Title="Buy groceries - updated"
✓ Task deleted: ID=5, Title="Buy groceries - updated"
```

### Error Logging

```
Error reading db.json: ENOENT: no such file or directory
Error writing db.json: Permission denied
```

---

## Database

### Storage

Tasks are persisted to `db.json`:
```json
{
  "tasks": [
    { "id": 1, "title": "...", ... },
    { "id": 2, "title": "...", ... }
  ]
}
```

### Backup

Before deploying to production, backup your database:
```bash
cp db.json db.json.backup
```

### Resetting

To reset to sample data:
```bash
# Delete db.json (recreates on next write)
rm db.json
```

---

## Deployment

### Deploy to Heroku

1. **Create `Procfile` (if not present):**
   ```
   web: npm start
   ```

2. **Push to Heroku:**
   ```bash
   heroku create taskflow-api
   git push heroku main
   ```

3. **View logs:**
   ```bash
   heroku logs --tail
   ```

### Deploy to Railway

1. Go to https://railway.app
2. Connect GitHub repository
3. Set environment: `NODE_ENV=production`
4. Click Deploy

### Deploy to Render

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub
4. Build command: `npm install`
5. Start command: `npm start`

---

## Comparison: JSON Server vs Express.js

| Feature | JSON Server | Express.js |
|---------|------------|-----------|
| Setup time | < 1 minute | 5 minutes |
| Suitable for | Development only | Production ready |
| Error handling | Basic | Advanced |
| Input validation | None | Custom |
| CORS | Built-in | Configurable |
| Logging | Built-in | Custom |
| Deployment | Limited | Full support |
| Customization | Limited | Unlimited |
| Performance | Good for small data | Excellent |
| Production | Not recommended | Recommended |

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=4000 npm start
```

### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** Check CORS origin in server.js:
```javascript
origin: process.env.CORS_ORIGIN || '*'
```

### Cannot Read db.json

**Error:** `Error reading db.json: ENOENT: no such file or directory`

**Solution:** Ensure `db.json` exists in project root:
```bash
cat > db.json << 'EOF'
{
  "tasks": []
}
EOF
```

### Database Lock Errors

**Error:** `Error writing db.json: EACCES: permission denied`

**Solution:** Check file permissions:
```bash
chmod 644 db.json
```

---

## Performance Tips

1. **Use gzip compression:**
   ```bash
   npm install compression
   ```
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add caching headers:**
   ```javascript
   app.use(express.static('.', {
       maxAge: '1d',
       etag: false
   }));
   ```

3. **Use connection pooling** for database (future upgrade)

4. **Monitor with New Relic or DataDog** (production)

---

## Security

### Input Validation ✅
- Title is required and trimmed
- Priority and status values are validated
- Length limits enforced

### CORS Protection ✅
- Whitelist origins in production
- Credentials controlled

### Error Messages ✅
- Generic errors in production
- Detailed logs on server

### Secrets Management ✅
- Use `.env` file for sensitive data
- `.env` added to `.gitignore`

### Future: Add Authentication
```javascript
// Implement JWT tokens
const jwt = require('jsonwebtoken');

app.post('/tasks', authenticate, (req, res) => {
    // Only authenticated users can create
});
```

---

## Next Steps

1. ✅ Replace JSON Server with this Express server
2. ✅ Test all endpoints with cURL or Postman
3. ✅ Deploy to production platform
4. ✅ Monitor logs for errors
5. ✅ Scale database to PostgreSQL (if needed)

---

## Support

- **Express.js docs:** https://expressjs.com
- **CORS docs:** https://github.com/expressjs/cors
- **Node.js docs:** https://nodejs.org/docs

---

**Status:** ✅ Production Ready

This server is ready for deployment to Heroku, Railway, Render, or any Node.js hosting platform.
