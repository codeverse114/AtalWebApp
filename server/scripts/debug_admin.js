const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

async function debugAdmin() {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    const admin = await User.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user NOT FOUND in database!');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('   Username:', admin.username);
    console.log('   Email:', admin.email);
    console.log('   Role:', admin.role);
    console.log('   Is Active:', admin.isActive);
    
    const isMatch = await bcrypt.compare('admin123', admin.password);
    console.log('   Password "admin123" matches:', isMatch ? 'YES' : 'NO');

    if (!isMatch || !admin.isActive || admin.role !== 'admin') {
      console.log('\n🔧 Fixing admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin.password = hashedPassword;
      admin.isActive = true;
      admin.role = 'admin';
      await admin.save();
      console.log('✅ Admin user fixed and updated.');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

debugAdmin();
