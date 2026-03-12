const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Computer Applications', 'Technical Trades', 'Business Management', 'Digital Marketing', 'E-commerce', 'Other']
  },
  duration: {
    type: String,
    required: true
  },
  fees: {
    type: Number,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  schedule: {
    type: String,
    required: true
  },
  maxStudents: {
    type: Number,
    default: 30
  },
  currentStudents: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  prerequisites: [String],
  learningOutcomes: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
