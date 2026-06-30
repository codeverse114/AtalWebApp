const express = require('express');
const { body, validationResult } = require('express-validator');
const Scholarship = require('../models/Scholarship');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply for scholarship (public/student)
router.post('/', [
  body('candidateId').trim().notEmpty().withMessage('Candidate ID is required'),
  body('studentName').trim().notEmpty().withMessage('Student name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('courseName').trim().notEmpty().withMessage('Course name is required'),
  body('annualIncome').isNumeric().withMessage('Valid annual income is required'),
  body('gpaOrMarks').trim().notEmpty().withMessage('GPA or marks detail is required'),
  body('reason').trim().notEmpty().withMessage('Reason for scholarship is required')
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

    // Verify candidate ID exists in user database as a student
    const student = await User.findOne({ username: req.body.candidateId, role: 'student' });
    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Invalid Candidate ID. Please register or verify your student login credentials first.'
      });
    }

    const application = new Scholarship(req.body);
    await application.save();

    console.log(`✅ Scholarship application submitted for candidate ID: ${application.candidateId}`);

    res.status(201).json({
      status: 'success',
      message: 'Scholarship application submitted successfully!',
      data: application
    });
  } catch (error) {
    console.error('Apply scholarship error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while submitting application'
    });
  }
});

// Get all scholarship applications (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const applications = await Scholarship.find().sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: applications
    });
  } catch (error) {
    console.error('Get scholarships error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching applications'
    });
  }
});

// Update scholarship status (admin only)
router.put('/:id/status', auth, [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected')
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

    const application = await Scholarship.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    console.log(`✅ Scholarship application updated: ${application._id} - ${application.status}`);

    res.json({
      status: 'success',
      message: `Scholarship application ${application.status} successfully`,
      data: application
    });
  } catch (error) {
    console.error('Update scholarship status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating application status'
    });
  }
});

module.exports = router;
