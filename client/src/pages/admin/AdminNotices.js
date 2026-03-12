import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Edit2, Trash2, Search, Filter, Calendar, AlertCircle } from 'lucide-react';
import api from '../../utils/axios';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    expiryDate: ''
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'admission', label: 'Admission' },
    { value: 'examination', label: 'Examination' },
    { value: 'general', label: 'General' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'result', label: 'Result' },
    { value: 'scholarship', label: 'Scholarship' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  const categoryColors = {
    admission: 'bg-blue-100 text-blue-800',
    examination: 'bg-purple-100 text-purple-800',
    general: 'bg-gray-100 text-gray-800',
    holiday: 'bg-green-100 text-green-800',
    result: 'bg-orange-100 text-orange-800',
    scholarship: 'bg-pink-100 text-pink-800'
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    filterNotices();
  }, [notices, selectedCategory, selectedPriority, searchTerm]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/notices');
      setNotices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotices = () => {
    let filtered = notices;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(notice => notice.category === selectedCategory);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(notice => notice.priority === selectedPriority);
    }

    if (searchTerm) {
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchTerm.toLowerCase())
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
      if (editingNotice) {
        await api.put(`/api/notices/${editingNotice._id}`, formData);
        alert('Notice updated successfully!');
      } else {
        await api.post('/api/notices', formData);
        alert('Notice created successfully!');
      }
      
      fetchNotices();
      resetForm();
    } catch (error) {
      console.error('Error saving notice:', error);
      alert('Error saving notice. Please try again.');
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      priority: notice.priority,
      expiryDate: notice.expiryDate ? new Date(notice.expiryDate).toISOString().split('T')[0] : ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (noticeId) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await api.delete(`/api/notices/${noticeId}`);
        alert('Notice deleted successfully!');
        fetchNotices();
      } catch (error) {
        console.error('Error deleting notice:', error);
        alert('Error deleting notice. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'general',
      priority: 'medium',
      expiryDate: ''
    });
    setEditingNotice(null);
    setShowAddForm(false);
  };

  const filteredNotices = filterNotices();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              Notice Management
            </h1>
            <p className="text-secondary-600">
              Create and manage notices and announcements
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Post New Notice
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
              </div>
            </div>
            <div className="lg:w-48">
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
            <div className="lg:w-48">
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="input"
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add/Edit Notice Form */}
        {showAddForm && (
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                {editingNotice ? 'Edit Notice' : 'Post New Notice'}
              </h2>
              <button
                onClick={resetForm}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label">Notice Title *</label>
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
                <label className="label">Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className="input"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="admission">Admission</option>
                    <option value="examination">Examination</option>
                    <option value="general">General</option>
                    <option value="holiday">Holiday</option>
                    <option value="result">Result</option>
                    <option value="scholarship">Scholarship</option>
                  </select>
                </div>
                <div>
                  <label className="label">Priority *</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="label">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingNotice ? 'Update Notice' : 'Post Notice'}
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

        {/* Notices List */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div key={notice._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-4">
                {/* Priority Indicator */}
                <div className="flex-shrink-0 mb-4 lg:mb-0">
                  <div className={`p-3 rounded-lg border ${priorityColors[notice.priority]}`}>
                    <AlertCircle className="h-6 w-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[notice.category]}`}>
                          {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${priorityColors[notice.priority]}`}>
                          {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)} Priority
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-secondary-900 mb-2">
                        {notice.title}
                      </h3>
                    </div>
                    
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => handleEdit(notice)}
                        className="btn btn-ghost btn-sm"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="btn btn-ghost btn-sm text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-secondary-600 mb-4 leading-relaxed">
                    {notice.content}
                  </div>

                  <div className="flex items-center justify-between text-sm text-secondary-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Posted: {new Date(notice.date).toLocaleDateString()}
                      </div>
                      {notice.expiryDate && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Expires: {new Date(notice.expiryDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredNotices.length === 0 && (
            <div className="card text-center py-12">
              <Megaphone className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No notices found
              </h3>
              <p className="text-secondary-600">
                Get started by posting your first notice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotices;
