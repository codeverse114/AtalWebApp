const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists');
      console.log('Username: admin');
      console.log('Password: admin123');
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        username: 'admin',
        email: 'admin@abvstvs.edu.in',
        password: hashedPassword,
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('Email: admin@abvstvs.edu.in');
    }

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

// Run the script
createAdmin();
