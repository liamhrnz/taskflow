# TaskFlow Quick Start Guide

**Get TaskFlow running in 5 minutes!**

---

## Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org)
- **npm 8+** — (included with Node.js)

---

## 📥 Step 1: Get the Code

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

---

## 📦 Step 2: Install Dependencies

```bash
npm install
```

---

## 🚀 Step 3: Start the Server

```bash
npm start
```

You should see:
```
✓ Server running on http://localhost:3000
✓ API ready at http://localhost:3000/tasks
```

---

## 🌐 Step 4: Open in Browser

Visit: **http://localhost:3000**

---

## ✅ Step 5: Test It Works

1. Type a task title: `"Buy groceries"`
2. Click **Add Task**
3. ✅ Task appears in the list
4. Refresh page (Ctrl+R) → Task is still there!

---

## 📝 Common Commands

| Command | What it does |
|---------|----------|
| `npm start` | Start Express.js server |
| `npm install` | Install dependencies |
| `npm run server:json` | Start JSON Server (alternative) |

---

## 🆘 Troubleshooting

### "Port 3000 already in use"
```bash
PORT=4000 npm start
```

### "Cannot find module 'express'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tasks not persisting?
- Ensure `db.json` exists
- Check server is running
- Look for errors in terminal

---

## 🚀 Next Steps

1. **Read the docs:**
   - README.md — Full project overview
   - DEPLOYMENT.md — Deploy online
   - EXPRESS_SERVER_GUIDE.md — API details

2. **Deploy to production:**
   - See REPLIT_DEPLOYMENT.md for easiest option
   - See DEPLOYMENT.md for other platforms

---

## 🎉 You're All Set!

Your TaskFlow app is now running locally. Time to explore and deploy! 🚀
