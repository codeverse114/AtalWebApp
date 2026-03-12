const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Comprehensive health check
router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: 'success',
    message: 'Health check completed',
    timestamp: new Date().toISOString(),
    database: {
      state: dbStates[dbState],
      readyState: dbState,
      name: mongoose.connection.name || 'N/A',
      host: mongoose.connection.host || 'N/A',
      port: mongoose.connection.port || 'N/A'
    },
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform
    },
    app: {
      environment: process.env.NODE_ENV || 'development',
      clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
    }
  });
});

// Database specific health check
router.get('/db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    
    if (dbState !== 1) {
      return res.status(503).json({
        status: 'error',
        message: 'Database not connected',
        state: dbState
      });
    }

    // Test database operation
    await mongoose.connection.db.admin().ping();
    
    res.json({
      status: 'success',
      message: 'Database is healthy and responsive',
      database: {
        state: 'connected',
        name: mongoose.connection.name,
        collections: await mongoose.connection.db.listCollections().toArray()
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Database health check failed',
      error: error.message
    });
  }
});

module.exports = router;
