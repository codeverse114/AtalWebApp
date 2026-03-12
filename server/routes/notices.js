const express = require('express');
const { body, validationResult } = require('express-validator');
const Notice = require('../models/Notice');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all notices (public)
router.get('/', async (req, res) => {
  try {
    const { category, priority, limit } = req.query;
    
    let filter = { isActive: true };
    if (category) {
      filter.category = category;
    }
    if (priority) {
      filter.priority = priority;
    }

    let query = Notice.find(filter).populate('author', 'username').sort({ date: -1 });
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const notices = await query;
    
    res.json({
      status: 'success',
      data: notices,
      count: notices.length
    });
  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching notices'
    });
  }
});

// Get single notice
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('author', 'username');
    
    if (!notice || !notice.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Notice not found'
      });
    }

    res.json({
      status: 'success',
      data: notice
    });
  } catch (error) {
    console.error('Get notice error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching notice'
    });
  }
});

// Create new notice (admin only)
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').optional().isIn(['admission', 'examination', 'general', 'holiday', 'result', 'scholarship']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const notice = new Notice({
      ...req.body,
      author: req.user._id
    });
    
    await notice.save();
    await notice.populate('author', 'username');

    console.log(`✅ Notice created: ${notice.title} by ${req.user.username}`);

    res.status(201).json({
      status: 'success',
      message: 'Notice created successfully',
      data: notice
    });
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating notice'
    });
  }
});

// Update notice (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username');

    if (!notice) {
      return res.status(404).json({
        status: 'error',
        message: 'Notice not found'
      });
    }

    console.log(`✅ Notice updated: ${notice.title} by ${req.user.username}`);

    res.json({
      status: 'success',
      message: 'Notice updated successfully',
      data: notice
    });
  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating notice'
    });
  }
});

// Delete notice (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({
        status: 'error',
        message: 'Notice not found'
      });
    }

    console.log(`✅ Notice deleted: ${notice.title} by ${req.user.username}`);

    res.json({
      status: 'success',
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting notice'
    });
  }
});

// Get notices by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const notices = await Notice.find({ 
      category, 
      isActive: true 
    }).populate('author', 'username').sort({ date: -1 });

    res.json({
      status: 'success',
      data: notices,
      count: notices.length
    });
  } catch (error) {
    console.error('Get notices by category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching notices by category'
    });
  }
});

// Get notice statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Notice.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          highPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error('Get notice stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching notice statistics'
    });
  }
});

module.exports = router;
