import React, { useState } from 'react';
import { GraduationCap, Award, CheckCircle, AlertCircle, Send, Shield, Info, ArrowRight } from 'lucide-react';
import api from '../utils/axios';

const Scholarship = () => {
  const [formData, setFormData] = useState({
    candidateId: '',
    studentName: '',
    email: '',
    phone: '',
    courseName: '',
    annualIncome: '',
    gpaOrMarks: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/api/scholarships', {
        ...formData,
        annualIncome: Number(formData.annualIncome)
      });
      if (res.data.status === 'success') {
        setSubmitted(true);
        setFormData({
          candidateId: '',
          studentName: '',
          email: '',
          phone: '',
          courseName: '',
          annualIncome: '',
          gpaOrMarks: '',
          reason: ''
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit application. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-primary-800 to-blue-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-3xl border border-white/20 flex items-center justify-center shadow-2xl">
                <GraduationCap className="h-9 w-9 text-amber-300" />
              </div>
              <div className="absolute -inset-2 bg-amber-400/20 rounded-3xl blur-xl" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">Scholarship Application</h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            ABVSTVS offers merit-cum-means scholarships for deserving candidates. Apply using your registered Candidate ID.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Note */}
        <div className="alert alert-info flex gap-3 items-start mb-8 border border-primary-200">
          <Info className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-primary-800">Eligibility Note:</p>
            <p className="text-primary-700">
              Only students with a valid, registered student profile (Candidate ID) can apply. Merit-based verification will be performed automatically using your academic record.
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="card">
          {submitted ? (
            <div className="py-16 text-center animate-fadeInUp">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-secondary-900 dark:text-white mb-2">Application Submitted!</h3>
              <p className="text-secondary-500 dark:text-slate-400 mb-8 max-w-sm mx-auto text-sm">
                Your application has been received and is pending review by the Scholarship Committee. You will receive updates via email.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn btn-primary px-8 py-3 font-bold"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white pb-3 border-b border-secondary-100 dark:border-white/5">
                Apply for Scholarship Scheme
              </h2>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 rounded-xl animate-slideDown">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="candidateId" className="label">Candidate ID (Student Username)</label>
                  <input
                    id="candidateId"
                    type="text"
                    name="candidateId"
                    value={formData.candidateId}
                    onChange={handleChange}
                    placeholder="e.g., rahul_student"
                    className="input font-mono"
                    required
                  />
                  <p className="mt-1 text-[10px] text-secondary-400">Your unique registered student login username</p>
                </div>

                <div>
                  <label htmlFor="studentName" className="label">Full Name</label>
                  <input
                    id="studentName"
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="Rahul Kumar"
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="label">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="label">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="courseName" className="label">Course / Program Enrolled</label>
                  <input
                    id="courseName"
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    placeholder="e.g., Web Development Fundamentals"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="gpaOrMarks" className="label">Previous Academic Performance (GPA / %)</label>
                  <input
                    id="gpaOrMarks"
                    type="text"
                    name="gpaOrMarks"
                    value={formData.gpaOrMarks}
                    onChange={handleChange}
                    placeholder="e.g., 85% or 9.0 CGPA"
                    className="input font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="annualIncome" className="label">Family Annual Income (INR)</label>
                <input
                  id="annualIncome"
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  placeholder="e.g., 250000"
                  className="input"
                  required
                />
                <p className="mt-1 text-[10px] text-secondary-400">Total yearly income of your parents/guardian from all sources</p>
              </div>

              <div>
                <label htmlFor="reason" className="label">Why do you deserve this scholarship?</label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Explain your financial constraints and academic achievements..."
                  className="input resize-none py-3"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3.5 text-base font-bold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
                ) : (
                  <><Send className="h-4.5 w-4.5" />Submit Application</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scholarship;
