const express = require('express');
const Course = require('../models/Course');
const Notice = require('../models/Notice');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const [
      totalCourses,
      activeCourses,
      totalNotices,
      totalCertificates,
      totalStudents,
      recentActivity
    ] = await Promise.all([
      Course.countDocuments({ isActive: true }),
      Course.countDocuments({ isActive: true, status: 'active' }),
      Notice.countDocuments({ isActive: true }),
      Certificate.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'student', isActive: true }),
      getRecentActivity()
    ]);

    res.json({
      status: 'success',
      data: {
        overview: {
          totalCourses,
          activeCourses,
          totalNotices,
          totalCertificates,
          totalStudents
        },
        recentActivity
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching admin statistics'
    });
  }
});

// Get recent activity
async function getRecentActivity() {
  const recentCourses = await Course.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(3)
    .select('title createdAt');

  const recentNotices = await Notice.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('author', 'username')
    .select('title createdAt author');

  const recentCertificates = await Certificate.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(3)
    .select('studentName courseName createdAt');

  const recentStudents = await User.find({ role: 'student', isActive: true })
    .sort({ createdAt: -1 })
    .limit(3)
    .select('username email createdAt');

  return {
    recentCourses,
    recentNotices,
    recentCertificates,
    recentStudents
  };
}

// Get all students (admin only)
router.get('/students', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = { role: 'student', isActive: true };
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      status: 'success',
      data: students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching students'
    });
  }
});

// Toggle user status (admin only)
router.patch('/users/:id/toggle', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    console.log(`✅ User ${user.isActive ? 'activated' : 'deactivated'}: ${user.username} by ${req.user.username}`);

    res.json({
      'status': 'success',
      'message': `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while toggling user status'
    });
  }
});

// Get system health and statistics
router.get('/system-health', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const [
      courseStats,
      noticeStats,
      certStats,
      userStats
    ] = await Promise.all([
      Course.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Notice.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Certificate.aggregate([
        { $group: { _id: '$courseName', count: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ])
    ]);

    const dbStats = {
      courses: courseStats,
      notices: noticeStats,
      certificates: certStats,
      users: userStats
    };

    res.json({
      status: 'success',
      data: {
        database: 'connected',
        stats: dbStats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching system health'
    });
  }
});

// Get activity logs
router.get('/activity-logs', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const { limit = 50, type } = req.query;
    
    let activities = [];
    
    if (type === 'courses' || !type) {
      const courses = await Course.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .select('title createdAt');
      
      activities = activities.concat(
        courses.map(course => ({
          type: 'course',
          action: 'created',
          title: course.title,
          timestamp: course.createdAt
        }))
      );
    }

    if (type === 'notices' || !type) {
      const notices = await Notice.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .populate('author', 'username')
        .select('title createdAt author');
      
      activities = activities.concat(
        notices.map(notice => ({
          type: 'notice',
          action: 'created',
          title: notice.title,
          timestamp: notice.createdAt,
          author: notice.author?.username
        }))
      );
    }

    if (type === 'certificates' || !type) {
      const certificates = await Certificate.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .select('studentName courseName createdAt');
      
      activities = activities.concat(
        certificates.map(cert => ({
          type: 'certificate',
          action: 'created',
          title: `${cert.studentName} - ${cert.courseName}`,
          timestamp: cert.createdAt
        }))
      );
    }

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      status: 'success',
      data: activities.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching activity logs'
    });
  }
});

// Get enrollment statistics
router.get('/enrollment-stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const enrollmentStats = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          totalCourses: { $sum: 1 },
          totalCapacity: { $sum: '$maxStudents' },
          totalEnrolled: { $sum: '$currentStudents' },
          avgFees: { $avg: '$fees' }
        }
      },
      {
        $addFields: {
          enrollmentRate: { $multiply: [{ $divide: ['$totalEnrolled', '$totalCapacity'] }, 100] }
        }
      },
      {
        $sort: { totalEnrolled: -1 }
      }
    ]);

    res.json({
      status: 'success',
      data: enrollmentStats
    });
  } catch (error) {
    console.error('Get enrollment stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching enrollment statistics'
    });
  }
});

// Get performance metrics
router.get('/performance-metrics', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Admin access required'
      });
    }

    const metrics = {
      totalUsers: await User.countDocuments({ isActive: true }),
      totalCourses: await Course.countDocuments({ isActive: true }),
      totalNotices: await Notice.countDocuments({ isActive: true }),
      totalCertificates: await Certificate.countDocuments({ isActive: true }),
      recentLogins: 0, // This would be tracked in a separate login logs collection
      activeCourses: await Course.countDocuments({ isActive: true, status: 'active' }),
      highPriorityNotices: await Notice.countDocuments({ isActive: true, priority: 'high' }),
      verifiedCertificates: await Certificate.countDocuments({ isActive: true, isVerified: true })
    };

    res.json({
      status: 'success',
      data: metrics
    });
  } catch (error) {
    console.error('Get performance metrics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching performance metrics'
    });
  }
});

module.exports = router;
