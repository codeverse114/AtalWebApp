import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Search, Filter, Users, Clock, IndianRupee } from 'lucide-react';
import api from '../../utils/axios';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Computer Applications',
    duration: '',
    fees: '',
    instructor: '',
    schedule: '',
    maxStudents: 30,
    prerequisites: [],
    learningOutcomes: []
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
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

    return filtered;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCourse) {
        await api.put(`/api/courses/${editingCourse._id}`, formData);
        alert('Course updated successfully!');
      } else {
        await api.post('/api/courses', formData);
        alert('Course created successfully!');
      }
      
      fetchCourses();
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course. Please try again.');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      duration: course.duration,
      fees: course.fees,
      instructor: course.instructor,
      schedule: course.schedule,
      maxStudents: course.maxStudents,
      prerequisites: course.prerequisites || [],
      learningOutcomes: course.learningOutcomes || []
    });
    setShowAddForm(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/api/courses/${courseId}`);
        alert('Course deleted successfully!');
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Computer Applications',
      duration: '',
      fees: '',
      instructor: '',
      schedule: '',
      maxStudents: 30,
      prerequisites: [],
      learningOutcomes: []
    });
    setEditingCourse(null);
    setShowAddForm(false);
  };

  const filteredCourses = filterCourses();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Course Management
            </h1>
            <p className="text-gray-600">
              Manage courses, schedules, and enrollment
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Course
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-6">
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
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
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

        {/* Add/Edit Course Form */}
        {showAddForm && (
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              <button
                onClick={resetForm}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Course Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="Computer Applications">Computer Applications</option>
                    <option value="Technical Trades">Technical Trades</option>
                    <option value="Business Management">Business Management</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 3 months"
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Fees (₹) *</label>
                  <input
                    type="number"
                    name="fees"
                    value={formData.fees}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Instructor *</label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Schedule *</label>
                  <input
                    type="text"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleChange}
                    placeholder="e.g., Mon-Fri 9AM-12PM"
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Maximum Students</label>
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  min="1"
                  className="input"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courses Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Fees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-secondary-900">
                          {course.title}
                        </div>
                        <div className="text-sm text-secondary-500 line-clamp-2 max-w-xs">
                          {course.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {course.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-secondary-400" />
                        {course.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      <div className="flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1 text-secondary-400" />
                        {course.fees.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-secondary-900">
                        <Users className="h-4 w-4 mr-1 text-secondary-400" />
                        {course.currentStudents || 0}/{course.maxStudents}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                No courses found
              </h3>
              <p className="text-secondary-500">
                Get started by creating your first course.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
