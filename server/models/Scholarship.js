const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  candidateId: {
    type: String,
    required: true,
    trim: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  annualIncome: {
    type: Number,
    required: true
  },
  gpaOrMarks: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
