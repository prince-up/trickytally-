# 🌐 Cloud Database Setup Guide

## Why Use Cloud Database?

- ✅ **Permanent Storage**: Data never gets deleted
- ✅ **Access Anywhere**: Use from any device/location
- ✅ **Automatic Backups**: MongoDB Atlas backs up your data
- ✅ **100% FREE**: 512MB storage is plenty for your app
- ✅ **No Installation**: No need for local MongoDB

---

## Step-by-Step Setup (5 minutes)

### 1. Create Free MongoDB Atlas Account

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with Google/GitHub or email
3. Choose **FREE** tier (M0 Sandbox)
4. Select cloud provider: **AWS** (recommended)
5. Region: Choose closest to your location
6. Cluster Name: Keep default or name it `TrickTally`
7. Click **Create Cluster** (takes 1-3 minutes)

---

### 2. Create Database User

1. Click **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `tricktally_user`
5. Password: **Auto-generate** or create strong password
6. **IMPORTANT**: Copy and save the password!
7. Database User Privileges: **Read and write to any database**
8. Click **Add User**

---

### 3. Allow Network Access

1. Click **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
   - Or add your current IP address for more security
4. Click **Confirm**

---

### 4. Get Connection String

1. Go back to **Database** (left sidebar)
2. Click **Connect** button on your cluster
3. Choose **Connect your application**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string

It will look like this:
```
mongodb+srv://tricktally_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

### 5. Update Your .env File

1. Open `server/.env` file
2. Replace `MONGO_URI` with your connection string
3. Replace `<password>` with the password you saved in Step 2
4. Add database name before the `?`

**Example:**
```env
# OLD (local - gets deleted):
# MONGO_URI=mongodb://localhost:27017/tricktally

# NEW (cloud - permanent):
MONGO_URI=mongodb+srv://tricktally_user:YOUR_PASSWORD_HERE@cluster0.abc123.mongodb.net/tricktally?retryWrites=true&w=majority
```

**Full Example with Real Values:**
```env
MONGO_URI=mongodb+srv://tricktally_user:SuperSecret123@cluster0.mongodb.net/tricktally?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

---

### 6. Restart Your Server

1. Stop your backend server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   cd server
   node server.js
   ```
3. You should see: **"MongoDB connected"**

---

## ✅ Verification

### Check if Connected:
1. In MongoDB Atlas, click **Database** → **Browse Collections**
2. After creating a session in your app, you should see:
   - Database: `tricktally`
   - Collections: `users`, `gamesessions`

### Test Your App:
1. Sign up with a new account
2. Create a game session
3. Restart your computer
4. Login again - **your data should still be there!** ✨

---

## 🔒 Security Best Practices

### Production Setup (When Deploying):

1. **Change JWT Secret**:
   ```env
   JWT_SECRET=generate_random_long_string_here_32_characters_min
   ```

2. **Restrict IP Access**:
   - In MongoDB Atlas → Network Access
   - Remove "0.0.0.0/0" (anywhere)
   - Add only your server's IP address

3. **Use Environment Variables**:
   - Never commit `.env` file to GitHub
   - Already in `.gitignore` ✅

4. **Strong Password**:
   - Use auto-generated password from Atlas
   - Store it securely

---

## 📊 Managing Your Data

### View Data:
1. MongoDB Atlas → Database → Browse Collections
2. See all users, sessions, rounds

### Backup:
- Atlas automatically backs up FREE tier clusters
- Manual export: Collections → Export Collection

### Delete Old Data:
1. Browse Collections
2. Select documents
3. Delete individually or drop entire collection

---

## 🆘 Troubleshooting

### "MongoServerError: bad auth"
- ✅ Password is wrong - re-check `.env` file
- ✅ Make sure password doesn't have special characters like `@` or `:`
  - If it does, URL-encode them (@ becomes %40)

### "Connection timeout"
- ✅ Check Network Access allows your IP
- ✅ Check connection string is correct
- ✅ Cluster is running (green status in Atlas)

### "Database not found"
- ✅ Database name in connection string should be `/tricktally`
- ✅ Collections auto-create when you add first document

### Still using localhost?
- ✅ Make sure you updated `.env` file
- ✅ Restart the server after changing `.env`

---

## 💰 Pricing (Don't Worry, It's FREE!)

**M0 Sandbox (FREE Forever):**
- ✅ 512 MB Storage (enough for 1000s of game sessions!)
- ✅ Shared RAM
- ✅ No credit card required
- ✅ No time limit

**When to Upgrade?**
- If you get millions of users 😄
- For now, FREE tier is perfect!

---

## 🚀 Benefits Summary

| Feature | Local MongoDB | Cloud (Atlas) |
|---------|--------------|---------------|
| **Data Persistence** | ❌ Deleted on restart | ✅ Permanent |
| **Access from anywhere** | ❌ Only localhost | ✅ Yes |
| **Setup** | Install MongoDB | Just sign up |
| **Backups** | Manual | Automatic |
| **Cost** | Free | Free |
| **Multi-device** | ❌ No | ✅ Yes |

---

## 📝 Next Steps

1. ✅ Set up MongoDB Atlas (5 minutes)
2. ✅ Update `.env` file
3. ✅ Restart server
4. ✅ Test by creating session
5. ✅ Restart computer & verify data persists
6. 🎉 Your app now has permanent cloud storage!

---

## 🌟 Pro Tips

1. **Keep .env file secret** - Never share or commit to GitHub
2. **Monitor usage** in Atlas dashboard
3. **Create multiple clusters** for different projects (all free!)
4. **Export data** regularly as JSON backup
5. **Use MongoDB Compass** (free GUI tool) to view data visually

---

**Need Help?** 
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Video Tutorial: https://www.youtube.com/watch?v=rPqRyYJmx2g

**You're all set! Your TrickTally data is now stored permanently in the cloud!** 🎉☁️
