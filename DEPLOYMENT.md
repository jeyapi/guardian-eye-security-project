# GuardianEye - Deployment Guide

## 🚀 Free Deployment Options

### Option 1: Render.com (Recommended) ⭐

Render.com offers **free hosting** for web services with the following limits:
- ✅ Free tier available
- ✅ Automatic SSL/HTTPS
- ✅ Auto-deploy from GitHub
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ 750 hours/month free

#### Steps to Deploy on Render.com:

1. **Push to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create Render Account**:
   - Go to https://render.com
   - Sign up with GitHub

3. **Deploy Backend**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `guardian-eye-backend`
     - **Environment**: `Node`
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`
     - **Plan**: `Free`
   - Click "Create Web Service"
   - Copy the backend URL (e.g., `https://guardian-eye-backend.onrender.com`)

4. **Update Frontend API URL**:
   - Edit `src/config/api.ts` or create it:
   ```typescript
   export const API_URL = import.meta.env.PROD 
     ? 'https://guardian-eye-backend.onrender.com'
     : 'http://localhost:3001';
   ```

5. **Deploy Frontend**:
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `guardian-eye-frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
     - **Plan**: `Free`
   - Click "Create Static Site"

6. **Access Your Site**:
   - Frontend: `https://guardian-eye-frontend.onrender.com`
   - Backend: `https://guardian-eye-backend.onrender.com`

---

### Option 2: Vercel (Frontend) + Render (Backend)

#### Frontend on Vercel:
1. Go to https://vercel.com
2. Import GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL

#### Backend on Render:
- Follow steps from Option 1

---

### Option 3: Railway.app

Railway offers **$5 free credit/month**:
1. Go to https://railway.app
2. Connect GitHub
3. Deploy both services
4. Free tier includes 500 hours/month

---

### Option 4: Fly.io

Fly.io free tier includes:
1. Go to https://fly.io
2. Install flyctl CLI
3. Deploy with:
   ```bash
   flyctl launch
   ```

---

## 📝 Important Notes

### Backend Limitations:
- **SQLite Database**: On free tiers, the database will reset when the service restarts
- **Solution**: Consider upgrading to a paid plan or using a free PostgreSQL database (e.g., Supabase)

### Frontend Configuration:
Make sure to update the API URL in your frontend code to point to the deployed backend.

---

## 🔧 Environment Variables

### Backend (.env):
```
NODE_ENV=production
PORT=3001
```

### Frontend:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## ✅ Pre-Deployment Checklist

- [ ] Remove all unused files (Docker, tests, etc.)
- [ ] Update API URLs in frontend
- [ ] Test build locally: `npm run build`
- [ ] Push code to GitHub
- [ ] Configure CORS in backend for your frontend domain
- [ ] Test all features after deployment

---

## 🎯 Recommended: Render.com

For this project, I recommend **Render.com** because:
- ✅ Easiest setup
- ✅ Both frontend and backend on same platform
- ✅ Automatic HTTPS
- ✅ GitHub auto-deploy
- ✅ Free tier sufficient for demo/testing

**Total Cost**: **FREE** 🎉
