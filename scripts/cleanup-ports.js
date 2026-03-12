const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const cleanupPorts = async () => {
  try {
    console.log('🧹 Cleaning up Node.js processes...');
    
    // Kill all Node.js processes
    if (process.platform === 'win32') {
      await execPromise('taskkill /F /IM node.exe');
    } else {
      await execPromise('pkill -f node');
    }
    
    console.log('✅ Port cleanup completed');
    console.log('💡 You can now restart the server with: npm run dev');
    
  } catch (error) {
    console.log('ℹ️ No Node.js processes found or cleanup completed');
  }
};

cleanupPorts();
