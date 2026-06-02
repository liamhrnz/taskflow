# TaskFlow Deployment Guide

## Overview

This guide covers deploying TaskFlow to a **live, publicly accessible host** (Exam requirement).

### Deployment Options

| Platform | Setup Time | Cost | Best For |
|----------|-----------|------|----------|
| **Replit** | 3 min | Free | Learning (easiest) |
| **Vercel** | 5 min | Free | Static frontend |
| **Heroku** | 15 min | Free tier | Full-stack apps |
| **Railway** | 10 min | Free credits | Full-stack apps |
| **Netlify** | 5 min | Free | Static frontend |

### See Dedicated Guides:

- **[REPLIT_DEPLOYMENT.md](REPLIT_DEPLOYMENT.md)** — Deploy in 3 minutes (RECOMMENDED FOR BEGINNERS)
- **[PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)** — Step-by-step for all platforms
- **[EXPRESS_SERVER_GUIDE.md](EXPRESS_SERVER_GUIDE.md)** — Backend API documentation

---

## Quick Deploy to Replit (Easiest)

1. Go to https://replit.com
2. Click "Create" → "Import from GitHub"
3. Paste: `https://github.com/YOUR_USERNAME/taskflow`
4. Click "Run"
5. Share the live URL!

**See [REPLIT_DEPLOYMENT.md](REPLIT_DEPLOYMENT.md) for full guide**

---

## Pre-Deployment Checklist

- [ ] All CRUD operations tested locally
- [ ] `package.json` includes `"start"` script
- [ ] README updated with live URL
- [ ] Git repository pushed to GitHub
- [ ] Responsive design tested on mobile
- [ ] All buttons and forms working end-to-end

---

## Environment Variables (Production)

Create a `.env` file (do NOT commit):
```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## Monitoring & Logs

### Replit
- Console tab shows live logs

### Heroku
```bash
heroku logs --tail
```

### Vercel
- Dashboard → Deployments → Logs tab

---

## Exam Submission Requirements

For the exam, you need to provide:
1. **Live URL** — fully functional public link
2. **GitHub Repository** — source code with clean git history
3. **README.md** — setup instructions and feature overview
4. **API Documentation** — endpoint descriptions
5. **Deployment Notes** — platform used and configuration

**All requirements are in place!** 🚀
