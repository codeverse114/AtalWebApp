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
  
  // NEW DETAILED FIELDS
  programObjectives: [String],
  programOutcomes: [String], // Detailed POs
  aboutCourse: String,
  minQualification: String,
  
  detailedFees: {
    registration: { type: Number, default: 0 },
    tuition: { type: Number, default: 0 },
    studyMaterial: { type: Number, default: 0 },
    practical: { type: Number, default: 0 },
    examination: { type: Number, default: 0 },
    internship: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  
  whyChoose: [String],
  
  papers: [{
    title: String,
    totalHours: Number,
    modules: [{
      title: String,
      hours: Number,
      topics: [String]
    }]
  }],
  
  examinationScheme: {
    theoryInternal: { type: Number, default: 0 },
    theoryFinal: { type: Number, default: 0 },
    practical: String,
    minPassing: { type: Number, default: 40 },
    evaluationType: { type: String, default: 'Semester-based' }
  },
  
  practicals: [{
    title: String,
    totalHours: Number,
    components: [{
      name: String,
      hours: Number
    }]
  }],
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
