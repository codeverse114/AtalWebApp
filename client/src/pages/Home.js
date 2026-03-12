import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Award, ArrowRight, Megaphone } from 'lucide-react';
import api from '../utils/axios';

const Home = () => {
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    certificates: 0,
    notices: 0
  });
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, noticesRes] = await Promise.all([
        api.get('/api/courses?limit=3'),
        api.get('/api/notices?limit=3')
      ]);

      setFeaturedCourses(coursesRes.data.data || []);
      setRecentNotices(noticesRes.data.data || []);
      
      // Set mock stats for now
      setStats({
        courses: coursesRes.data.data?.length || 12,
        students: 486,
        certificates: 156,
        notices: noticesRes.data.data?.length || 24
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Quality Education',
      description: 'Comprehensive skill-based training programs designed for modern workforce requirements.'
    },
    {
      icon: Users,
      title: 'Expert Faculty',
      description: 'Learn from industry experts with years of practical experience in their respective fields.'
    },
    {
      icon: Award,
      title: 'Certified Programs',
      description: 'Government-recognized certifications that enhance your career opportunities.'
    },
    {
      icon: GraduationCap,
      title: 'Career Support',
      description: 'Placement assistance and career guidance to help you achieve your professional goals.'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Admission Ticker */}
      <div className="gradient-primary text-white py-4 overflow-hidden shadow-xl">
        <div className="flex animate-scroll">
          <div className="flex whitespace-nowrap space-x-12">
            <span className="inline-flex items-center font-semibold">
              <Megaphone className="h-5 w-5 mr-3 animate-pulse" />
              Admissions Open for 2024-25
            </span>
            <span className="inline-flex items-center font-semibold">
              <Megaphone className="h-5 w-5 mr-3 animate-pulse" />
              Limited Seats Available
            </span>
            <span className="inline-flex items-center font-semibold">
              <Megaphone className="h-5 w-5 mr-3 animate-pulse" />
              Apply Now for Various Vocational Courses
            </span>
            <span className="inline-flex items-center font-semibold">
              <Megaphone className="h-5 w-5 mr-3 animate-pulse" />
              Scholarships Available
            </span>
            <span className="inline-flex items-center font-semibold">
              <Megaphone className="h-5 w-5 mr-3 animate-pulse" />
              Last Date: 31st March 2024
            </span>
          </div>
          <div className="flex whitespace-nowrap space-x-12">
            <span className="inline-flex items-center font-semibold">
              <Megaphone className="h-5 w-5 mr-3 animate-pulse" />
              Admissions Open for 2024-25
            </span>
            <span className="inline-flex items-center font-semibold">
              <Megaphone className="h-5 w-5 mr-3 animate-pulse" />
              Limited Seats Available
            </span>
            <span className="inline-flex items-center">
              <Megaphone className="h-4 w-4 mr-2" />
              Apply Now for Various Vocational Courses
            </span>
            <span className="inline-flex items-center">
              <Megaphone className="h-4 w-4 mr-2" />
              Scholarships Available
            </span>
            <span className="inline-flex items-center">
              <Megaphone className="h-4 w-4 mr-2" />
              Last Date: 31st March 2024
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Atal Bihari Vajpayee Centre for
              <br />
              Skill Training and Vocational Studies
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Empowering Youth Through Quality Skill Education
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="btn bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold"
              >
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stats.courses}+
              </div>
              <div className="text-gray-600">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stats.students}+
              </div>
              <div className="text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stats.certificates}+
              </div>
              <div className="text-gray-600">Certificates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stats.notices}+
              </div>
              <div className="text-gray-600">Notices</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ABVSTVS?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive skill development programs that prepare you for the modern workforce.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Popular Courses
              </h2>
              <p className="text-xl text-gray-600">
                Discover our most sought-after skill development programs
              </p>
            </div>
            <Link
              to="/courses"
              className="btn btn-outline hidden md:flex"
            >
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course._id} className="card hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {course.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-blue-600 font-semibold">
                    ₹{course.fees}
                  </span>
                  <span className="text-sm text-gray-500">
                    {course.duration}
                  </span>
                </div>
                <Link
                  to="/courses"
                  className="btn btn-primary w-full"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/courses"
              className="btn btn-outline"
            >
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Notices */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Latest Notices
              </h2>
              <p className="text-xl text-gray-600">
                Stay updated with important announcements
              </p>
            </div>
            <Link
              to="/notices"
              className="btn btn-outline hidden md:flex"
            >
              View All Notices
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentNotices.map((notice) => (
              <div key={notice._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Megaphone className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-2">
                      {notice.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {notice.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {notice.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(notice.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/notices"
              className="btn btn-outline"
            >
              View All Notices
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
