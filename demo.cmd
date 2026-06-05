@echo off
setlocal enabledelayedexpansion

echo.
echo ===============================================
echo  TASKFLOW CRUD DEMONSTRATION
echo ===============================================

REM READ: Get all tasks
echo.
echo 1. READ: Fetching all tasks...
curl -s http://localhost:3000/tasks
echo.

REM CREATE: Add new task
echo.
echo 2. CREATE: Adding "Deploy to production" task...
curl -s -X POST http://localhost:3000/tasks ^
  -H "Content-Type: application/json" ^
  -d "{""title"":""Deploy to production"",""description"":""Push to GitHub and deploy live"",""priority"":""high"",""status"":""pending"",""dueDate"":""2026-06-10""}"
echo.

REM READ AGAIN: Verify creation
echo.
echo 3. READ: Fetching all tasks (after creation)...
curl -s http://localhost:3000/tasks
echo.

REM UPDATE: Update task ID 5 (the newly created one)
echo.
echo 4. UPDATE: Updating task status to "in-progress"...
curl -s -X PUT http://localhost:3000/tasks/5 ^
  -H "Content-Type: application/json" ^
  -d "{""title"":""Deploy to production"",""description"":""Push to GitHub and deploy live - IN PROGRESS"",""priority"":""high"",""status"":""in-progress"",""dueDate"":""2026-06-10""}"
echo.

REM READ: Verify update
echo.
echo 5. READ: Fetching task ID 5 (after update)...
curl -s http://localhost:3000/tasks/5
echo.

REM DELETE: Delete task ID 5
echo.
echo 6. DELETE: Removing task ID 5...
curl -s -X DELETE http://localhost:3000/tasks/5
echo.

REM READ FINAL: Verify deletion
echo.
echo 7. READ: Final task list (after deletion)...
curl -s http://localhost:3000/tasks
echo.

echo ===============================================
echo  DEMONSTRATION COMPLETE
echo ===============================================
echo.
