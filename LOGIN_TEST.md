# Login Test Instructions

## ✅ Server Status
- Server is running on http://localhost:5000
- Database is connected to MongoDB Atlas
- Admin user has been created

## 🔑 Admin Credentials
- **Username**: admin
- **Password**: admin123

## 🧪 Test Login

### Method 1: Using Browser
1. Open http://localhost:3000 in your browser
2. Click on "Login" button
3. Enter username: `admin`
4. Enter password: `admin123`
5. Click "Sign In"

### Method 2: Using API (for testing)
```bash
# Test the login endpoint directly
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Method 3: Using PowerShell
```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/auth/login `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"username":"admin","password":"admin123"}'
```

## 📊 Expected Response
If login is successful, you should get:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "username": "admin",
      "email": "admin@abvstvs.edu.in",
      "role": "admin"
    }
  }
}
```

## 🐛 Troubleshooting

### If you get "Route not found":
1. Check if server is running: http://localhost:5000/api/health
2. Make sure you're using `/api/auth/login` not `/auth/login`
3. Check server console for any errors

### If you get "Invalid credentials":
1. Verify the admin user exists: `npm run create-admin`
2. Check the exact username and password
3. Make sure there are no extra spaces

### If you get database errors:
1. Check MongoDB connection string in server/.env
2. Make sure MongoDB Atlas is accessible
3. Check server logs for connection status

## 🎯 Success Indicators
- ✅ Server shows "Connected to MongoDB Atlas"
- ✅ Admin user created successfully
- ✅ Login returns "Login successful"
- ✅ Redirected to admin dashboard
- ✅ Token stored in localStorage

## 📱 Frontend Access
- Frontend: http://localhost:3000
- Login Page: http://localhost:3000/login
- Admin Dashboard: http://localhost:3000/admin/dashboard (after login)
