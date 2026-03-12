import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Filter, Search } from 'lucide-react';
import api from '../utils/axios';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

    setFilteredNotices(filtered);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
            Notices & Announcements
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, announcements, and important information from ABVSTVS.
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
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

        {/* Notice Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {filteredNotices.length}
            </div>
            <div className="text-secondary-600">Total Notices</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {filteredNotices.filter(n => n.priority === 'high').length}
            </div>
            <div className="text-secondary-600">High Priority</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {filteredNotices.filter(n => n.priority === 'medium').length}
            </div>
            <div className="text-secondary-600">Medium Priority</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {filteredNotices.filter(n => n.priority === 'low').length}
            </div>
            <div className="text-secondary-600">Low Priority</div>
          </div>
        </div>

        {/* Notices List */}
        {filteredNotices.length === 0 ? (
          <div className="card text-center py-12">
            <Megaphone className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              No notices found
            </h3>
            <p className="text-secondary-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNotices.map((notice) => (
              <div key={notice._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-4">
                  {/* Date Column */}
                  <div className="flex-shrink-0 mb-4 lg:mb-0">
                    <div className="bg-primary-600 text-white rounded-lg p-4 text-center min-w-[100px]">
                      <div className="text-2xl font-bold">
                        {new Date(notice.date).getDate()}
                      </div>
                      <div className="text-sm">
                        {new Date(notice.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-xs">
                        {new Date(notice.date).getFullYear()}
                      </div>
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
                    </div>
                    
                    <div className="text-secondary-600 mb-4 leading-relaxed">
                      {notice.content}
                    </div>

                    <div className="flex items-center justify-between text-sm text-secondary-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(notice.date)}
                        </div>
                        {notice.author && (
                          <div>
                            Posted by: {notice.author.username}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
