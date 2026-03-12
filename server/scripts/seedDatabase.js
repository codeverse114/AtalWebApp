const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const Notice = require('../models/Notice');
const Certificate = require('../models/Certificate');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB Atlas');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Notice.deleteMany({});
    await Certificate.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      username: 'admin',
      email: 'admin@abvstvs.edu.in',
      password: hashedPassword,
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      }
    });
    await adminUser.save();
    console.log('✅ Admin user created');

    // Create sample courses
    const courses = [
      {
        title: 'Web Development Fundamentals',
        description: 'Learn the basics of HTML, CSS, JavaScript and modern web development practices',
        category: 'Computer Applications',
        duration: '3 months',
        fees: 15000,
        instructor: 'John Smith',
        schedule: 'Mon-Wed 9AM-12PM',
        maxStudents: 30,
        currentStudents: 12,
        prerequisites: ['Basic computer skills'],
        learningOutcomes: ['HTML/CSS proficiency', 'JavaScript basics', 'Responsive design'],
        status: 'active'
      },
      {
        title: 'Digital Marketing Mastery',
        description: 'Master SEO, social media marketing, content creation and analytics',
        category: 'Digital Marketing',
        duration: '2 months',
        fees: 12000,
        instructor: 'Sarah Johnson',
        schedule: 'Tue-Thu 2PM-5PM',
        maxStudents: 25,
        currentStudents: 18,
        prerequisites: ['Basic internet knowledge'],
        learningOutcomes: ['SEO techniques', 'Social media strategy', 'Content creation'],
        status: 'active'
      },
      {
        title: 'Electrical Wiring Basics',
        description: 'Hands-on training in electrical installation, maintenance and safety protocols',
        category: 'Technical Trades',
        duration: '4 months',
        fees: 18000,
        instructor: 'Mike Wilson',
        schedule: 'Mon-Fri 8AM-12PM',
        maxStudents: 20,
        currentStudents: 15,
        prerequisites: ['High school education'],
        learningOutcomes: ['Wiring skills', 'Safety protocols', 'Code compliance'],
        status: 'active'
      },
      {
        title: 'Business Management Essentials',
        description: 'Learn fundamental business concepts, leadership skills and entrepreneurial mindset',
        category: 'Business Management',
        duration: '6 months',
        fees: 20000,
        instructor: 'Emily Brown',
        schedule: 'Sat 10AM-2PM',
        maxStudents: 35,
        currentStudents: 22,
        prerequisites: ['Basic education'],
        learningOutcomes: ['Management skills', 'Business planning', 'Leadership'],
        status: 'active'
      }
    ];

    const createdCourses = await Course.insertMany(courses);
    console.log(`✅ Created ${createdCourses.length} sample courses`);

    // Create sample notices
    const notices = [
      {
        title: 'Admission Schedule for 2024-25',
        content: 'The admission schedule for all courses for the academic year 2024-25 has been released. Applications are now open for all programs. Last date for submission is 31st March 2024.',
        category: 'admission',
        priority: 'high',
        date: new Date('2024-01-15'),
        expiryDate: new Date('2024-03-31')
      },
      {
        title: 'Scholarship Application Open',
        content: 'Merit-based scholarships are now available for deserving students. Applications must be submitted by 28th February 2024 with all required documents.',
        category: 'scholarship',
        priority: 'high',
        date: new Date('2024-01-10'),
        expiryDate: new Date('2024-02-28')
      },
      {
        title: 'New Course Launch: E-commerce Specialist',
        content: 'We are excited to announce the launch of our new E-commerce Specialist program starting March 2024. This course covers online store management, digital marketing, and customer service.',
        category: 'general',
        priority: 'medium',
        date: new Date('2024-01-05')
      },
      {
        title: 'Holiday Schedule Update',
        content: 'The institute will be closed from 25th December 2024 to 5th January 2025 for winter holidays. Regular classes will resume from 6th January 2025.',
        category: 'holiday',
        priority: 'medium',
        date: new Date('2024-01-20'),
        expiryDate: new Date('2025-01-05')
      },
      {
        title: 'Final Examination Results',
        content: 'Final examination results for the October-December 2023 batch have been published. Students can check their results on the student portal.',
        category: 'result',
        priority: 'high',
        date: new Date('2024-01-08')
      }
    ];

    const createdNotices = await Notice.insertMany(notices.map(notice => ({
      ...notice,
      author: adminUser._id
    })));
    console.log(`✅ Created ${createdNotices.length} sample notices`);

    // Create sample certificates
    const certificates = [
      {
        certificateId: 'CERT-2024-001',
        studentName: 'Rahul Kumar',
        courseName: 'Web Development Fundamentals',
        grade: 'A',
        issueDate: new Date('2024-01-20'),
        completionDate: new Date('2023-12-15'),
        duration: '3 months',
        instructor: 'John Smith',
        studentEmail: 'rahul.kumar@email.com',
        studentPhone: '+91 98765 43210',
        isVerified: true,
        verificationCount: 3
      },
      {
        certificateId: 'CERT-2024-002',
        studentName: 'Priya Sharma',
        courseName: 'Digital Marketing Mastery',
        grade: 'A+',
        issueDate: new Date('2024-01-18'),
        completionDate: new Date('2023-11-30'),
        duration: '2 months',
        instructor: 'Sarah Johnson',
        studentEmail: 'priya.sharma@email.com',
        studentPhone: '+91 87654 32109',
        isVerified: true,
        verificationCount: 5
      },
      {
        certificateId: 'CERT-2024-003',
        studentName: 'Amit Patel',
        courseName: 'Electrical Wiring Basics',
        grade: 'B+',
        issueDate: new Date('2024-01-22'),
        completionDate: new Date('2023-12-20'),
        duration: '4 months',
        instructor: 'Mike Wilson',
        studentEmail: 'amit.patel@email.com',
        studentPhone: '+91 76543 21098',
        isVerified: false,
        verificationCount: 0
      },
      {
        certificateId: 'CERT-2024-004',
        studentName: 'Neha Gupta',
        courseName: 'Business Management Essentials',
        grade: 'A',
        issueDate: new Date('2024-01-25'),
        completionDate: new Date('2023-12-10'),
        duration: '6 months',
        instructor: 'Emily Brown',
        studentEmail: 'neha.gupta@email.com',
        studentPhone: '+91 98765 43210',
        isVerified: true,
        verificationCount: 2
      }
    ];

    const createdCertificates = await Certificate.insertMany(certificates);
    console.log(`✅ Created ${createdCertificates.length} sample certificates`);

    // Create sample students
    const students = [
      {
        username: 'rahul_student',
        email: 'rahul.student@email.com',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        profile: {
          firstName: 'Rahul',
          lastName: 'Kumar',
          phone: '+91 98765 43210',
          address: '123 Main St, New Delhi'
        }
      },
      {
        username: 'priya_student',
        email: 'priya.student@email.com',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        profile: {
          firstName: 'Priya',
          lastName: 'Sharma',
          phone: '+91 87654 32109',
          address: '456 Park Ave, Mumbai'
        }
      },
      {
        username: 'amit_student',
        email: 'amit.student@email.com',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        profile: {
          firstName: 'Amit',
          lastName: 'Patel',
          phone: '+91 76543 21098',
          address: '789 Industrial Area, Ahmedabad'
        }
      },
      {
        username: 'neha_student',
        email: 'neha.student@email.com',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        profile: {
          firstName: 'Neha',
          lastName: 'Gupta',
          phone: '+91 98765 43210',
          address: '321 Business Park, Bangalore'
        }
      }
    ];

    const createdStudents = await User.insertMany(students);
    console.log(`✅ Created ${createdStudents.length} sample students`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Admin User: admin / admin123`);
    console.log(`- Courses: ${createdCourses.length}`);
    console.log(`- Notices: ${createdNotices.length}`);
    console.log(`- Certificates: ${createdCertificates.length}`);
    console.log(`- Students: ${createdStudents.length}`);
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin / admin123');
    console.log('Students: rahul_student / student123, priya_student / student123, etc.');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
