# 🚀 Deployment Guide

## Option 1: Render (Backend) + Vercel (Frontend)

### Backend Deployment (Render)

1. Push your code to GitHub
2. Go to [Render](https://render.com)
3. Create new **Web Service**
4. Connect your repository
5. Configure:
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `node server/server.js`
   - **Environment Variables:**
     ```
     MONGO_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_secret_key
     PORT=5000
     ```
6. Deploy!

### Frontend Deployment (Vercel)

1. Go to [Vercel](https://vercel.com)
2. Import your repository
3. Configure:
   - **Root Directory:** `client/trickytally`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   ```
   VITE_API_URL=your_render_backend_url
   ```
5. Deploy!

**Important:** Update API URLs in frontend files to use environment variable:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

---

## Option 2: Railway (Full Stack)

1. Push code to GitHub
2. Go to [Railway](https://railway.app)
3. Create new project from GitHub repo
4. Railway will auto-detect both services
5. Add environment variables for backend
6. Deploy both services

---

## MongoDB Atlas Setup (Required for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
5. Get connection string
6. Replace in your backend .env:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tricktally?retryWrites=true&w=majority
   ```

---

## Pre-Deployment Checklist

### Backend
- [ ] Add `.env` to `.gitignore`
- [ ] Set up MongoDB Atlas
- [ ] Update CORS to allow your frontend URL
- [ ] Add production error handling
- [ ] Set secure JWT secret

### Frontend
- [ ] Update API URLs to use environment variables
- [ ] Test production build locally: `npm run build && npm run preview`
- [ ] Verify all routes work with production API
- [ ] Add loading states and error handling

---

## Environment Variables Summary

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secure_string
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.com
```

---

## Testing Deployment

1. Test signup/login flow
2. Create sample game session
3. Verify stats are calculating correctly
4. Test all CRUD operations
5. Check mobile responsiveness

---

## Common Issues & Fixes

### CORS Error
Add to backend `server.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend-url.com', 'http://localhost:5173'],
  credentials: true
}));
```

### MongoDB Connection Error
- Check connection string format
- Verify IP whitelist includes `0.0.0.0/0`
- Ensure database user has read/write permissions

### Build Fails
- Check Node version compatibility
- Clear node_modules and reinstall
- Verify all dependencies in package.json

---

## Quick Deploy Commands

```bash
# Backend production start
NODE_ENV=production node server.js

# Frontend production build
npm run build

# Frontend production preview
npm run preview
```

---

## Monitoring & Maintenance

- Set up error logging (consider Sentry)
- Monitor database usage on Atlas
- Check Render/Vercel logs for errors
- Set up uptime monitoring (UptimeRobot)

---

Good luck with deployment! 🚀
