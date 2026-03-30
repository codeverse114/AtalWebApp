const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://atal-web-app.vercel.app',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Database connection state
let dbConnected = false;

// Simple MongoDB Connection
const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`📍 Database: ${conn.connection.name}`);
    dbConnected = true;
    app.locals.dbConnected = true;
    
    // Create default admin user after connection
    await createDefaultAdmin();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    dbConnected = false;
    app.locals.dbConnected = false;
  }
};

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const User = require('./models/User');
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        username: 'admin',
        email: 'admin@abvstvs.edu.in',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Default admin user created');
      console.log('   Username: admin');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

// Database connection middleware
const requireDB = (req, res, next) => {
  if (!dbConnected) {
    return res.status(503).json({
      status: 'error',
      message: 'Database connection not available. Please try again later.'
    });
  }
  next();
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'ABVSTVS Server is running',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const noticeRoutes = require('./routes/notices');
const certificateRoutes = require('./routes/certificates');
const adminRoutes = require('./routes/admin');
const healthRoutes = require('./routes/health');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', requireDB, courseRoutes);
app.use('/api/notices', requireDB, noticeRoutes);
app.use('/api/certificates', requireDB, certificateRoutes);
app.use('/api/admin', requireDB, adminRoutes);
app.use('/api/health', healthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ 
    status: 'error', 
    message: 'Something went wrong!',
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    status: 'error', 
    message: 'Route not found',
    path: req.originalUrl,
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Start server with error handling
const startServer = async () => {
  try {
    app.listen(PORT, async () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Allowed Origins: ${allowedOrigins.join(', ')}`);
      
      // Initialize database connection
      await connectDB();
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});
