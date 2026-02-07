# Deployment Guide

## **Recommended: Backend on Render + Frontend on Vercel**

### **Why This Combination?**

- **Vercel**: Optimized for React/frontend - faster builds, better CDN, automatic optimizations
- **Render**: Excellent for Node.js backends - simple setup, good free tier
- **Industry Standard**: Many companies use this combo for MERN apps

---

## **Option 1: Backend (Render) + Frontend (Vercel) - RECOMMENDED**

### **Step 1: Deploy Backend on Render**

#### **A. Prepare Your Repository**

1. Ensure your `.env` file is NOT committed (already in .gitignore)
2. Add a `render.yaml` file or configure in Render dashboard

#### **B. Create Render Web Service**

1. Go to: https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `smart-task-manager-api`
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: `Free` (or $7/month for better performance)

#### **C. Environment Variables**

Add these in Render dashboard:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
PORT=10000
NODE_ENV=production
```

#### **D. Get Backend URL**

After deployment, note your backend URL:

```
https://smart-task-manager-api.onrender.com
```

---

### **Step 2: Deploy Frontend on Vercel**

#### **A. Update Client Configuration**

Edit `client/src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: "https://smart-task-manager-api.onrender.com", // Your Render URL
  headers: {
    "Content-Type": "application/json",
  },
});
```

#### **B. Commit and Push**

```bash
git add client/src/services/api.js
git commit -m "Update API URL for production"
git push
```

#### **C. Deploy on Vercel**

1. Go to: https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Vite` (or React)
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### **D. Environment Variables**

Add in Vercel dashboard:

```
Not required for frontend
```

#### **E. Update CORS on Backend**

In `server/index.js`, add your Vercel URL:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://your-app.vercel.app", // Your Vercel URL
    ],
    credentials: true,
  }),
);
```

---

## **Option 2: Both on Render (Simpler)**

### **Deploy Backend on Render**

Same as Step 1 above.

### **Deploy Frontend on Render**

1. In Render dashboard, click "New +" → "Web Service"
2. Connect same repository
3. Configure:
   - **Name**: `smart-task-manager-client`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Start Command**: `npx serve dist -s`
   - **Instance Type**: `Free`

### **Update Client API**

```javascript
const api = axios.create({
  baseURL: "https://smart-task-manager-api.onrender.com",
});
```

---

## **MongoDB Atlas Setup (Already Done)**

Your MongoDB Atlas is already configured:

```
MONGO_URI=mongodb+srv://task_user:XlKC9WJ5jRB64g9a@task-cluster.kr72ovk.mongodb.net/
```

**Important**: Add your deployment URLs to Atlas IP whitelist:

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Add: `0.0.0.0/0` (allows all IPs) or specific render/vercel IPs

---

## **Quick Checklist**

### **Backend (Render)**

- [ ] Create web service
- [ ] Set root directory to `server`
- [ ] Add environment variables (MONGO_URI, JWT_SECRET)
- [ ] Note backend URL
- [ ] Add frontend URL to CORS
- [ ] Test: `https://your-api.onrender.com/test`

### **Frontend (Vercel)**

- [ ] Update `client/src/services/api.js` with backend URL
- [ ] Deploy from `client` directory
- [ ] Note frontend URL
- [ ] Test registration at: `https://your-app.vercel.app/register`

### **MongoDB Atlas**

- [ ] Add deployment IPs to whitelist
- [ ] Verify connection string works

---

## **Final URLs (Example)**

```
Backend:  https://smart-task-manager-api.onrender.com
Frontend: https://smart-task-manager-mern.vercel.app
MongoDB:  mongodb+srv://task_user:...@task-cluster.kr72ovk.mongodb.net/
```

---

## **Commands for Future Updates**

```bash
# Make changes
git add .
git commit -m "Your update message"
git push

# Both services auto-deploy from GitHub
# Render: Automatic on push to main
# Vercel: Automatic on push to main
```

---

## **Troubleshooting**

### **CORS Errors**

- Ensure frontend URL is in CORS origin list on backend
- Check browser console for specific CORS messages

### **MongoDB Connection**

- Verify IP whitelist in MongoDB Atlas
- Check MONGO_URI is correct
- Test connection from Render logs

### **Https/SSL**

- Both Render and Vercel provide free SSL automatically
- No extra configuration needed

---

## **Cost Estimation**

### **Free Tier**

- **Render**: Web service (free) + PostgreSQL (free)
- **Vercel**: Personal accounts have generous free tier
- **MongoDB Atlas**: Free tier available

### **Production (Optional)**

- Render Web Service: $7/month
- Vercel Pro: $20/month
- MongoDB Atlas M10: $9/month

**For learning/personal use**: Free tier is sufficient!
