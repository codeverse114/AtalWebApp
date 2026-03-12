import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Users, IndianRupee, Filter } from 'lucide-react';
import api from '../utils/axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'all', label: 'All Courses' },
    { value: 'Computer Applications', label: 'Computer Applications' },
    { value: 'Technical Trades', label: 'Technical Trades' },
    { value: 'Business Management', label: 'Business Management' },
    { value: 'Digital Marketing', label: 'Digital Marketing' },
    { value: 'E-commerce', label: 'E-commerce' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, selectedCategory, searchTerm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/courses');
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  const handleEnroll = async (courseId) => {
    try {
      await api.patch(`/api/courses/${courseId}/enroll`, { action: 'enroll' });
      // Update the course in local state
      setCourses(prev => prev.map(course => 
        course._id === courseId 
          ? { ...course, currentStudents: course.currentStudents + 1 }
          : course
      ));
      alert('Enrollment successful! We will contact you soon.');
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Enrollment failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive range of skill development programs designed to enhance your career prospects.
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {filteredCourses.length}
            </div>
            <div className="text-secondary-600">Available Courses</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {categories.length - 1}
            </div>
            <div className="text-secondary-600">Categories</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {courses.reduce((sum, course) => sum + course.currentStudents, 0)}
            </div>
            <div className="text-secondary-600">Enrolled Students</div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              No courses found
            </h3>
            <p className="text-secondary-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div key={course._id} className="card hover:shadow-xl transition-all duration-300 group">
                {/* Course Image */}
                <div className="relative mb-6 overflow-hidden rounded-lg">
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <BookOpen className="h-20 w-20 text-primary-600" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-secondary-600 line-clamp-3">
                      {course.description}
                    </p>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-secondary-600">
                      <Users className="h-4 w-4 mr-2 text-primary-500" />
                      <span>Instructor: {course.instructor}</span>
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <Clock className="h-4 w-4 mr-2 text-primary-500" />
                      <span>Duration: {course.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <IndianRupee className="h-4 w-4 mr-2 text-primary-500" />
                      <span className="font-semibold text-primary-600">
                        {course.fees.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Enrollment Status */}
                  <div className="pt-4 border-t border-secondary-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-secondary-600">
                        Enrollment
                      </span>
                      <span className="text-sm font-medium text-secondary-900">
                        {course.currentStudents}/{course.maxStudents}
                      </span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((course.currentStudents / course.maxStudents) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => window.open(`https://wa.me/8295886832?text=Hi! I'm interested in enrolling for the course: ${course.title}`, '_blank')}
                    className="btn btn-primary w-full hover-lift"
                    disabled={course.currentStudents >= course.maxStudents}
                  >
                    {course.currentStudents >= course.maxStudents ? 'Course Full' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
