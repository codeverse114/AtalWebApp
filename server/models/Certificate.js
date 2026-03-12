const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  completionDate: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  pdfUrl: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCount: {
    type: Number,
    default: 0
  },
  studentEmail: {
    type: String,
    required: true
  },
  studentPhone: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Certificate', certificateSchema);
