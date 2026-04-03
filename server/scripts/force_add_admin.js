const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

async function forceAddAdmin() {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    // Delete any existing users with username 'admin' or email 'admin@abvstvs.edu.in'
    const deleted = await User.deleteMany({
      $or: [{ username: 'admin' }, { email: 'admin@abvstvs.edu.in' }]
    });
    console.log(`Deleted ${deleted.deletedCount} existing admin(s) to avoid conflicts.`);

    // Create the fresh admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new User({
      username: 'admin',
      email: 'admin@abvstvs.edu.in',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      profile: {
        firstName: 'System',
        lastName: 'Admin'
      }
    });

    await admin.save();
    console.log('✅ Admin user created successfully.');
    console.log('   Username: admin');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

forceAddAdmin();
