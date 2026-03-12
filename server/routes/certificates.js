const express = require('express');
const { body, validationResult } = require('express-validator');
const Certificate = require('../models/Certificate');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all certificates (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = { isActive: true };
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { certificateId: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } }
      ];
    }

    const certificates = await Certificate.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Certificate.countDocuments(filter);

    res.json({
      status: 'success',
      data: certificates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching certificates'
    });
  }
});

// Verify certificate (public)
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId,
      isActive: true
    });

    if (!certificate) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found or invalid'
      });
    }

    // Increment verification count
    certificate.verificationCount += 1;
    await certificate.save();

    console.log(`✅ Certificate verified: ${certificate.certificateId}`);

    res.json({
      status: 'success',
      message: 'Certificate verified successfully',
      data: certificate
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while verifying certificate'
    });
  }
});

// Create new certificate (admin only)
router.post('/', auth, [
  body('certificateId').trim().notEmpty().withMessage('Certificate ID is required'),
  body('studentName').trim().notEmpty().withMessage('Student name is required'),
  body('courseName').trim().notEmpty().withMessage('Course name is required'),
  body('grade').trim().notEmpty().withMessage('Grade is required'),
  body('issueDate').isISO8601().withMessage('Valid issue date is required'),
  body('completionDate').isISO8601().withMessage('Valid completion date is required'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('instructor').trim().notEmpty().withMessage('Instructor is required'),
  body('studentEmail').isEmail().withMessage('Valid student email is required')
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

    // Check if certificate ID already exists
    const existingCertificate = await Certificate.findOne({
      certificateId: req.body.certificateId
    });

    if (existingCertificate) {
      return res.status(400).json({
        status: 'error',
        message: 'Certificate ID already exists'
      });
    }

    const certificate = new Certificate(req.body);
    await certificate.save();

    console.log(`✅ Certificate created: ${certificate.certificateId} for ${certificate.studentName}`);

    res.status(201).json({
      status: 'success',
      message: 'Certificate created successfully',
      data: certificate
    });
  } catch (error) {
    console.error('Create certificate error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating certificate'
    });
  }
});

// Update certificate (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!certificate) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found'
      });
    }

    console.log(`✅ Certificate updated: ${certificate.certificateId}`);

    res.json({
      status: 'success',
      message: 'Certificate updated successfully',
      data: certificate
    });
  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating certificate'
    });
  }
});

// Delete certificate (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!certificate) {
      return res.status(404).json({
        status: 'error',
        message: 'Certificate not found'
      });
    }

    console.log(`✅ Certificate deleted: ${certificate.certificateId}`);

    res.json({
      status: 'success',
      message: 'Certificate deleted successfully'
    });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting certificate'
    });
  }
});

// Get certificates by course
router.get('/course/:courseName', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const { courseName } = req.params;
    const certificates = await Certificate.find({ 
      courseName, 
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: certificates,
      count: certificates.length
    });
  } catch (error) {
    console.error('Get certificates by course error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching certificates by course'
    });
  }
});

// Get certificate statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const stats = await Certificate.aggregate([
      {
        $group: {
          _id: '$courseName',
          count: { $sum: 1 },
          avgVerificationCount: { $avg: '$verificationCount' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalCertificates = await Certificate.countDocuments({ isActive: true });
    const totalVerifications = await Certificate.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$verificationCount' } } }
    ]);

    res.json({
      status: 'success',
      data: {
        totalCertificates,
        totalVerifications: totalVerifications[0]?.total || 0,
        byCourse: stats
      }
    });
  } catch (error) {
    console.error('Get certificate stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching certificate statistics'
    });
  }
});

// Batch upload certificates (admin only)
router.post('/batch', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const { certificates } = req.body;
    const results = [];
    const errors = [];

    for (const certData of certificates) {
      try {
        // Check if certificate ID already exists
        const existingCertificate = await Certificate.findOne({
          certificateId: certData.certificateId
        });

        if (existingCertificate) {
          errors.push({ certificateId: certData.certificateId, error: 'Certificate ID already exists' });
          continue;
        }

        const certificate = new Certificate(certData);
        await certificate.save();
        results.push(certificate);
      } catch (error) {
        errors.push({ certificateId: certData.certificateId, error: error.message });
      }
    }

    console.log(`✅ Batch upload: ${results.length} certificates created, ${errors.length} errors`);

    res.json({
      status: 'success',
      message: `Batch upload completed: ${results.length} certificates created`,
      data: {
        created: results,
        errors: errors
      }
    });
  } catch (error) {
    console.error('Batch upload certificates error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during batch upload'
    });
  }
});

module.exports = router;
