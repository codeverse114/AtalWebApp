import React, { useState } from 'react';
import { Search, Award, CheckCircle, AlertCircle, Calendar, User, BookOpen } from 'lucide-react';
import api from '../utils/axios';

const CertificateVerification = () => {
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!certificateId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    setError('');
    setCertificate(null);
    setIsVerified(false);

    try {
      const response = await api.get(`/api/certificates/verify/${certificateId.trim()}`);
      
      if (response.data.status === 'success') {
        setCertificate(response.data.data);
        setIsVerified(true);
        alert('Certificate verified successfully!');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError('Certificate not found or invalid. Please check the certificate ID and try again.');
      } else {
        setError('An error occurred while verifying the certificate. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCertificateId('');
    setCertificate(null);
    setError('');
    setIsVerified(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-600 rounded-full">
              <Award className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Certificate Verification
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Verify the authenticity of certificates issued by ABVSTVS. Enter the certificate ID to check its validity.
          </p>
        </div>

        {/* Verification Form */}
        <div className="card mb-8">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="certificateId" className="label">
                Certificate ID
              </label>
              <div className="relative">
                <input
                  id="certificateId"
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="Enter certificate ID (e.g., CERT-2024-001)"
                  className="input pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
              </div>
              <p className="mt-2 text-sm text-secondary-500">
                The certificate ID is typically printed on the certificate document
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1 py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Verify Certificate
                  </>
                )}
              </button>
              
              {certificate && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline px-6"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Certificate Result */}
        {isVerified && certificate && (
          <div className="card border-green-200 bg-green-50">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-8 w-8" />
                <span className="text-2xl font-bold">Certificate Verified</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Certificate Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-primary-600" />
                      Certificate Details
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-secondary-500">Certificate ID:</span>
                        <p className="font-mono text-secondary-900 bg-secondary-100 px-2 py-1 rounded">
                          {certificate.certificateId}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-secondary-500">Student Name:</span>
                        <p className="text-secondary-900">{certificate.studentName}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-secondary-500">Grade:</span>
                        <p className="text-secondary-900">{certificate.grade}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
                      Course Information
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-secondary-500">Course Name:</span>
                        <p className="text-secondary-900">{certificate.courseName}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-secondary-500">Duration:</span>
                        <p className="text-secondary-900">{certificate.duration}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-secondary-500">Instructor:</span>
                        <p className="text-secondary-900">{certificate.instructor}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-secondary-200">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary-600" />
                  <div>
                    <span className="text-sm font-medium text-secondary-500">Completion Date:</span>
                    <p className="text-secondary-900">
                      {new Date(certificate.completionDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary-600" />
                  <div>
                    <span className="text-sm font-medium text-secondary-500">Issue Date:</span>
                    <p className="text-secondary-900">
                      {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Info */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="bg-secondary-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-secondary-500">Verification Count:</span>
                      <p className="text-secondary-900">{certificate.verificationCount} times verified</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-secondary-500">Status:</span>
                      <p className="text-green-600 font-semibold">✓ Authentic Certificate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">How to Verify a Certificate</h3>
          <ol className="space-y-3 text-secondary-600">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</span>
              <span>Locate the certificate ID on the physical or digital certificate document</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</span>
              <span>Enter the certificate ID in the search field above</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</span>
              <span>Click "Verify Certificate" to check its authenticity</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">4</span>
              <span>Review the verification results and certificate details</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerification;
