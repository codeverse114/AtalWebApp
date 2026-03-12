# ABVSTVS - Atal Bihari Vajpayee Centre for Skill Training and Vocational Studies

A modern web application for managing educational courses, notices, and certificates for ABVSTVS institute.

## 🚀 Features

### Public Features
- **Home Page**: Institute overview, featured courses, latest notices
- **Courses**: Browse and filter available courses with enrollment information
- **Notices**: View categorized notices with priority levels
- **Certificate Verification**: Public certificate authenticity verification system
- **Contact**: Contact form and department information

### Admin Features
- **Dashboard**: Overview statistics and recent activity
- **Course Management**: Create, edit, and manage courses
- **Notice Management**: Post and manage notices with categories and priorities
- **Certificate Management**: Issue and manage student certificates
- **Authentication**: Secure admin login system

## 🛠 Technology Stack

### Frontend
- **React 18**: Modern UI framework
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB Atlas**: Cloud database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd suryansh-project
```

### 2. Install Dependencies
```bash
npm run install-deps
```

### 3. Create Admin User
```bash
npm run create-admin
```
This will create a default admin user with:
- **Username**: admin
- **Password**: admin123

### 4. Environment Configuration

#### Backend Environment (server/.env)
```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://codeverse114:CodeVerse114@ataldatabase-1.fxb7yyi.mongodb.net/?appName=ATALDATABASE-1

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

#### Frontend Environment (client/.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

### 5. Start the Application

#### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

#### Individual Services
```bash
# Start Backend Server
npm run server

# Start Frontend (in another terminal)
npm run client
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

### 7. Admin Login

1. Navigate to http://localhost:3000/login
2. Use the default admin credentials:
   - **Username**: admin
   - **Password**: admin123
3. You will be redirected to the admin dashboard

## 🔐 Default Admin Credentials

For testing purposes, the default admin credentials are:
- **Username**: admin
- **Password**: admin123
- **Role**: admin

You can create additional admin users through the API or by running the `npm run create-admin` script again.

## 📁 Project Structure

```
suryansh-project/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin pages
│   │   │   └── ...         # Public pages
│   │   ├── utils/          # Utility functions
│   │   ├── App.js          # Main App component
│   │   └── index.js        # App entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── middleware/         # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── .env               # Environment variables
│   ├── index.js           # Server entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md             # This file
```

## 📊 Database Schema

### Users Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (admin/student),
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    address: String
  },
  isActive: Boolean
}
```

### Courses Collection
```javascript
{
  title: String,
  description: String,
  category: String,
  duration: String,
  fees: Number,
  instructor: String,
  schedule: String,
  maxStudents: Number,
  currentStudents: Number,
  status: String (active/inactive/completed)
}
```

### Notices Collection
```javascript
{
  title: String,
  content: String,
  category: String,
  priority: String (low/medium/high),
  date: Date,
  expiryDate: Date,
  author: ObjectId (ref: User)
}
```

### Certificates Collection
```javascript
{
  certificateId: String (unique),
  studentName: String,
  courseName: String,
  grade: String,
  issueDate: Date,
  completionDate: Date,
  duration: String,
  instructor: String,
  studentEmail: String,
  isVerified: Boolean,
  verificationCount: Number
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)

### Notices
- `GET /api/notices` - Get all notices
- `GET /api/notices/:id` - Get single notice
- `POST /api/notices` - Create notice (admin only)
- `PUT /api/notices/:id` - Update notice (admin only)
- `DELETE /api/notices/:id` - Delete notice (admin only)

### Certificates
- `GET /api/certificates` - Get all certificates (admin only)
- `GET /api/certificates/verify/:certificateId` - Verify certificate (public)
- `POST /api/certificates` - Create certificate (admin only)
- `PUT /api/certificates/:id` - Update certificate (admin only)
- `DELETE /api/certificates/:id` - Delete certificate (admin only)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/students` - Get all students (admin only)

## 🎨 UI Components

The application uses Tailwind CSS for styling with custom components:
- **Buttons**: Primary, secondary, outline, ghost variants
- **Cards**: Consistent card layouts
- **Forms**: Styled input fields and validation
- **Navigation**: Responsive navbar with mobile menu
- **Modals**: Reusable modal components

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- CORS configuration
- Input validation and sanitization
- Protected API routes

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the application: `npm run build`
2. Deploy the `client/build` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy the `server` folder
3. Configure MongoDB Atlas connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For any queries or support, please contact:
- Email: info@abvstvs.edu.in
- Phone: +91 11 2345 6789

---

**ABVSTVS** - Empowering Youth Through Quality Skill Education
