const express = require('express');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all courses (public)
router.get('/', async (req, res) => {
  try {
    const { category, status = 'active' } = req.query;
    
    let filter = { isActive: true };
    if (category) {
      filter.category = category;
    }
    if (status !== 'all') {
      filter.status = status;
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    
    res.json({
      status: 'success',
      data: courses,
      count: courses.length
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching courses'
    });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course || !course.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    res.json({
      status: 'success',
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching course'
    });
  }
});

// Create new course (admin only)
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('fees').isNumeric().withMessage('Fees must be a number'),
  body('instructor').trim().notEmpty().withMessage('Instructor is required'),
  body('schedule').trim().notEmpty().withMessage('Schedule is required')
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

    const courseData = req.body;
    
    // Ensure nested objects are handled if they come as strings (unlikely with axios but safe)
    const course = new Course(courseData);
    await course.save();

    console.log(`✅ Course created: ${course.title} by ${req.user.username}`);

    res.status(201).json({
      status: 'success',
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating course'
    });
  }
});

// Update course (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    console.log(`✅ Course updated: ${course.title} by ${req.user.username}`);

    res.json({
      status: 'success',
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating course'
    });
  }
});

// Delete course (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    console.log(`✅ Course deleted: ${course.title} by ${req.user.username}`);

    res.json({
      status: 'success',
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting course'
    });
  }
});

// Update course enrollment
router.patch('/:id/enroll', async (req, res) => {
  try {
    const { action } = req.body; // 'enroll' or 'unenroll'
    
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    if (action === 'enroll') {
      if (course.currentStudents >= course.maxStudents) {
        return res.status(400).json({
          status: 'error',
          message: 'Course is full'
        });
      }
      course.currentStudents += 1;
    } else if (action === 'unenroll') {
      course.currentStudents = Math.max(0, course.currentStudents - 1);
    }

    await course.save();

    res.json({
      status: 'success',
      message: `Course ${action}ment updated successfully`,
      data: course
    });
  } catch (error) {
    console.error('Update enrollment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating enrollment'
    });
  }
});

// Get course statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStudents: { $sum: '$currentStudents' },
          avgFees: { $avg: '$fees' }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching course statistics'
    });
  }
});

module.exports = router;
