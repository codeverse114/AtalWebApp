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
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
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
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
      console.log(`📍 API URL: http://localhost:${PORT}/api`);
      
      // Initialize database connection
      await connectDB();
    });
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Trying alternative port...`);
      // Try alternative port
      const altPort = PORT + 1;
      app.listen(altPort, async () => {
        console.log(`🚀 Server running on alternative port ${altPort}`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
        console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
        console.log(`📍 API URL: http://localhost:${altPort}/api`);
        
        // Update client env file with new port
        const fs = require('fs');
        const clientEnvPath = '../client/.env';
        if (fs.existsSync(clientEnvPath)) {
          fs.writeFileSync(clientEnvPath, `REACT_APP_API_URL=http://localhost:${altPort}\n`);
          console.log(`📝 Updated client API URL to http://localhost:${altPort}`);
        }
        
        // Initialize database connection
        await connectDB();
      });
    } else {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});
