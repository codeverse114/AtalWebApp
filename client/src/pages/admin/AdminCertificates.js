import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Trash2, Search, Download, Upload, Users, Calendar, CheckCircle } from 'lucide-react';
import api from '../../utils/axios';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    certificateId: '',
    studentName: '',
    courseName: '',
    grade: '',
    issueDate: '',
    completionDate: '',
    duration: '',
    instructor: '',
    studentEmail: '',
    studentPhone: ''
  });

  useEffect(() => {
    fetchCertificates();
  }, [currentPage, searchTerm]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/certificates', {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm
        }
      });
      setCertificates(response.data.data || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateCertificateId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CERT-${year}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCertificate) {
        await api.put(`/api/certificates/${editingCertificate._id}`, formData);
        alert('Certificate updated successfully!');
      } else {
        const certificateData = {
          ...formData,
          certificateId: formData.certificateId || generateCertificateId()
        };
        await api.post('/api/certificates', certificateData);
        alert('Certificate created successfully!');
      }
      
      fetchCertificates();
      resetForm();
    } catch (error) {
      console.error('Error saving certificate:', error);
      alert('Error saving certificate. Please try again.');
    }
  };

  const handleEdit = (certificate) => {
    setEditingCertificate(certificate);
    setFormData({
      certificateId: certificate.certificateId,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      grade: certificate.grade,
      issueDate: new Date(certificate.issueDate).toISOString().split('T')[0],
      completionDate: new Date(certificate.completionDate).toISOString().split('T')[0],
      duration: certificate.duration,
      instructor: certificate.instructor,
      studentEmail: certificate.studentEmail,
      studentPhone: certificate.studentPhone || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (certificateId) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await api.delete(`/api/certificates/${certificateId}`);
        alert('Certificate deleted successfully!');
        fetchCertificates();
      } catch (error) {
        console.error('Error deleting certificate:', error);
        alert('Error deleting certificate. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      certificateId: '',
      studentName: '',
      courseName: '',
      grade: '',
      issueDate: '',
      completionDate: '',
      duration: '',
      instructor: '',
      studentEmail: '',
      studentPhone: ''
    });
    setEditingCertificate(null);
    setShowAddForm(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
              Certificate Management
            </h1>
            <p className="text-gray-600">
              Issue and manage student certificates
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Upload Certificate
          </button>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by certificate ID, student name, or course..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="input pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
              </div>
            </div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {certificates.length}
            </div>
            <div className="text-secondary-600">Total Certificates</div>
          </div>
        </div>

        {/* Add/Edit Certificate Form */}
        {showAddForm && (
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                {editingCertificate ? 'Edit Certificate' : 'Upload New Certificate'}
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
                  <label className="label">Certificate ID</label>
                  <input
                    type="text"
                    name="certificateId"
                    value={formData.certificateId}
                    onChange={handleChange}
                    placeholder={editingCertificate ? '' : 'Auto-generated if empty'}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Student Name *</label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Course Name *</label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Grade *</label>
                  <input
                    type="text"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    placeholder="e.g., A, B+, Distinction"
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Completion Date *</label>
                  <input
                    type="date"
                    name="completionDate"
                    value={formData.completionDate}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Issue Date *</label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 3 months, 6 weeks"
                    className="input"
                    required
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Student Email *</label>
                  <input
                    type="email"
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label">Student Phone</label>
                  <input
                    type="tel"
                    name="studentPhone"
                    value={formData.studentPhone}
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
                  {editingCertificate ? 'Update Certificate' : 'Upload Certificate'}
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

        {/* Certificates Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Certificate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {certificates.map((certificate) => (
                  <tr key={certificate._id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-primary-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-secondary-900">
                            {certificate.certificateId}
                          </div>
                          <div className="text-sm text-secondary-500">
                            {certificate.verificationCount} verifications
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-secondary-900">
                          {certificate.studentName}
                        </div>
                        <div className="text-sm text-secondary-500">
                          {certificate.studentEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">
                        {certificate.courseName}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {certificate.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {certificate.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-secondary-400" />
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {certificate.isVerified ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">Yes</span>
                        </div>
                      ) : (
                        <span className="text-sm text-secondary-500">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(certificate)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(certificate._id)}
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

          {certificates.length === 0 && (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                No certificates found
              </h3>
              <p className="text-secondary-500">
                Get started by uploading your first certificate.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-outline btn-sm disabled:opacity-50"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`btn btn-sm ${
                    currentPage === index + 1
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-outline btn-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCertificates;
