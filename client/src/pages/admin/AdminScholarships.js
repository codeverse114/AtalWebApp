import React, { useState, useEffect, useCallback } from 'react';
import { GraduationCap, Search, CheckCircle, XCircle, Clock, Trash2, Calendar, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../../utils/axios';
import { Toast, ConfirmModal } from '../../components/AdminToast';

const AdminScholarships = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusConfirm, setStatusConfirm] = useState(null);

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/scholarships');
      setApplications(res.data.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      showToast('Error loading applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (app, status) => {
    setStatusConfirm({ app, status });
  };

  const confirmStatusChange = async () => {
    if (!statusConfirm) return;
    const { app, status } = statusConfirm;
    try {
      const res = await api.put(`/api/scholarships/${app._id}/status`, { status });
      showToast(`Application successfully ${status === 'approved' ? 'Approved' : 'Rejected'}!`);
      
      // Update local state
      setApplications(prev => prev.map(a => a._id === app._id ? { ...a, status } : a));
      if (selectedApp && selectedApp._id === app._id) {
        setSelectedApp({ ...selectedApp, status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status. Please try again.', 'error');
    } finally {
      setStatusConfirm(null);
    }
  };

  const filteredApps = applications.filter(app => 
    app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-black uppercase border border-emerald-500/20">Approved</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-black uppercase border border-red-500/20">Rejected</span>;
      default:
        return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-black uppercase border border-amber-500/20">Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {statusConfirm && (
        <ConfirmModal
          title={statusConfirm.status === 'approved' ? 'Approve Scholarship' : 'Reject Scholarship'}
          message={`Are you sure you want to change @${statusConfirm.app.candidateId}'s scholarship status to ${statusConfirm.status}?`}
          confirmText={statusConfirm.status === 'approved' ? 'Approve' : 'Reject'}
          confirmVariant={statusConfirm.status === 'approved' ? 'success' : 'danger'}
          onConfirm={confirmStatusChange}
          onCancel={() => setStatusConfirm(null)}
        />
      )}

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-primary-900/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-indigo-900/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h1 className="text-3xl font-black text-secondary-900 dark:text-white tracking-tight mb-2 uppercase italic">
                Scholarship <span className="text-primary-600">Applications</span>
              </h1>
              <p className="text-secondary-500 dark:text-slate-400 font-medium">
                Review and manage student merit-cum-means scholarship requests.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* List side */}
            <div className={`${selectedApp ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'} space-y-6`}>
              {/* Search Bar */}
              <div className="glass-morphism p-4 rounded-[24px] border border-white/10 shadow-sm">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Search by student name, candidate ID, or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-12 pl-12 pr-4 rounded-xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Table Container */}
              <div className="glass-morphism rounded-[32px] border border-white/10 overflow-hidden shadow-xl">
                {loading ? (
                  <div className="py-24 text-center">
                    <div className="h-10 w-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-secondary-400 text-sm">Loading applications...</p>
                  </div>
                ) : filteredApps.length === 0 ? (
                  <div className="py-16 text-center">
                    <GraduationCap className="h-14 w-14 text-secondary-300 dark:text-slate-700 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-secondary-900 dark:text-white">No applications found</h3>
                    <p className="text-secondary-500 dark:text-slate-400 text-sm">There are no scholarship requests matching your filter.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="px-6 py-4 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest">Candidate</th>
                          <th className="px-6 py-4 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest">Performance / Income</th>
                          <th className="px-6 py-4 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest">Enrolled Program</th>
                          <th className="px-6 py-4 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-4 text-xs font-black text-secondary-400 dark:text-slate-500 uppercase tracking-widest text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredApps.map((app) => (
                          <tr 
                            key={app._id} 
                            onClick={() => setSelectedApp(app)}
                            className={`group hover:bg-white/5 transition-all duration-200 cursor-pointer ${selectedApp?._id === app._id ? 'bg-primary-500/10' : ''}`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-secondary-900 dark:text-slate-200">{app.studentName}</span>
                                <span className="text-xs text-secondary-500 font-mono">@{app.candidateId}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-emerald-600">₹{app.annualIncome?.toLocaleString('en-IN')} / Yr</span>
                                <span className="text-xs text-secondary-500">Marks: {app.gpaOrMarks}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-semibold text-secondary-700 dark:text-slate-300 block max-w-[200px] truncate">{app.courseName}</span>
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(app.status)}
                            </td>
                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-end gap-1.5">
                                {app.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(app, 'approved')}
                                      className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm text-xs font-bold"
                                      title="Approve"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(app, 'rejected')}
                                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-50 hover:text-white transition-all shadow-sm text-xs font-bold"
                                      title="Reject"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Details panel (Drawer look) */}
            {selectedApp && (
              <div className="lg:col-span-5 xl:col-span-4 reveal-right">
                <div className="card sticky top-24 p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-black text-secondary-900 dark:text-white">Application Detail</h2>
                      <p className="text-xs font-mono text-secondary-500">@{selectedApp.candidateId}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedApp(null)}
                      className="p-1.5 bg-secondary-100 hover:bg-secondary-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-secondary-500 rounded-lg"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-xs text-secondary-400 font-semibold uppercase">Applicant</p>
                      <p className="font-bold text-secondary-900 dark:text-white text-base">{selectedApp.studentName}</p>
                      <p className="text-xs text-secondary-500">{selectedApp.email} | {selectedApp.phone}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-secondary-100 dark:border-white/5">
                      <div>
                        <p className="text-xs text-secondary-400 font-semibold uppercase">Annual Income</p>
                        <p className="font-extrabold text-emerald-600">₹{selectedApp.annualIncome?.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-400 font-semibold uppercase">Academic Score</p>
                        <p className="font-extrabold text-primary-600">{selectedApp.gpaOrMarks}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-secondary-100 dark:border-white/5">
                      <p className="text-xs text-secondary-400 font-semibold uppercase">Enrolled Course</p>
                      <p className="font-bold text-secondary-800 dark:text-slate-300">{selectedApp.courseName}</p>
                    </div>

                    <div className="pt-3 border-t border-secondary-100 dark:border-white/5">
                      <p className="text-xs text-secondary-400 font-semibold uppercase">Submission Reason</p>
                      <p className="text-xs text-secondary-600 dark:text-slate-400 italic bg-secondary-50 dark:bg-slate-900/60 p-3 rounded-lg leading-relaxed">
                        "{selectedApp.reason}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-secondary-100 dark:border-white/5">
                      <p className="text-xs text-secondary-400 font-semibold uppercase mb-2">Application Status</p>
                      <div className="flex justify-between items-center">
                        {getStatusBadge(selectedApp.status)}
                        {selectedApp.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(selectedApp, 'approved')}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-bold text-xs shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(selectedApp, 'rejected')}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-bold text-xs shadow-sm"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScholarships;
