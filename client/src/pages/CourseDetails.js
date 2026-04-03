import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Clock, Users, IndianRupee, ClipboardCheck, 
  Target, Award, Shield, CheckCircle, ArrowRight,
  ChevronRight, FileText, Activity, Heart, Info,
  ExternalLink, Calendar
} from 'lucide-react';
import api from '../utils/axios';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCourse();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/courses/${id}`);
      setCourse(res.data.data);
    } catch (e) {
      console.error('Error fetching course:', e);
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="h-16 w-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  const handleEnroll = () => {
    window.open(
      `https://wa.me/8295886832?text=Hi! I'm interested in enrolling for the course: ${course.title}. Please provide more details.`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary-600/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-sm font-bold mb-8">
                <Award className="h-4 w-4" /> Professional Certification
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-secondary-900 dark:text-white leading-[1.1] mb-6">
                {course.title}
              </h1>
              <p className="text-xl text-secondary-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-8 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest">Duration</p>
                    <p className="text-lg font-black text-secondary-900 dark:text-white">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest">Structure</p>
                    <p className="text-lg font-black text-secondary-900 dark:text-white">{course.examinationScheme?.evaluationType || 'Semester-based'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    <Users className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest">Capacity</p>
                    <p className="text-lg font-black text-secondary-900 dark:text-white">{course.maxStudents} Students</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleEnroll}
                  className="btn btn-primary h-16 px-10 rounded-2xl text-lg font-black shadow-xl shadow-primary-600/30 hover:scale-[1.02] transition-all"
                >
                  ENROLL NOW <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <div className="flex flex-col justify-center">
                  <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest px-2">Total Fee</p>
                  <p className="text-2xl font-black text-secondary-900 dark:text-white px-2">₹{course.fees?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            <div className="reveal-right relative">
              <div className="aspect-[4/3] rounded-[48px] bg-gradient-to-br from-primary-600 to-indigo-700 p-1 shadow-2xl shadow-primary-500/20">
                <div className="w-full h-full rounded-[47px] bg-slate-900 overflow-hidden relative flex items-center justify-center">
                  <BookOpen className="h-32 w-32 text-white/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                          {course.instructor?.charAt(0)}
                        </div>
                        <span className="text-white font-bold text-lg">{course.instructor}</span>
                      </div>
                      <p className="text-slate-300 font-medium">Leading academic expert in {course.category}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-6 glass-morphism p-6 rounded-[32px] border border-white/10 shadow-2xl reveal-scale delay-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-secondary-900 dark:text-white">Verified</p>
                    <p className="text-xs font-bold text-secondary-500 uppercase">ISO Certified Academy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Secondary Nav */}
        <div className="sticky top-20 z-40 mb-16 glass-morphism p-2 rounded-[24px] border border-white/10 shadow-lg hidden md:block">
          <div className="flex gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'syllabus', label: 'Syllabus', icon: FileText },
              { id: 'objectives', label: 'Objectives & Outcomes', icon: Target },
              { id: 'fees', label: 'Fee Structure', icon: IndianRupee },
              { id: 'admission', label: 'Admission Info', icon: ClipboardCheck }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                  ? 'bg-secondary-900 dark:bg-white text-white dark:text-black shadow-lg' 
                  : 'text-secondary-500 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <tab.icon className="h-4 w-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            
            {/* Overview Section */}
            {(activeTab === 'overview' || !window.matchMedia("(min-width: 768px)").matches) && (
              <section id="overview" className="reveal space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg">
                    <Info className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-black text-secondary-900 dark:text-white tracking-tight">About The Course</h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-lg text-secondary-600 dark:text-slate-400 leading-relaxed font-medium italic mb-6">
                    "{course.aboutCourse || course.description}"
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    {course.whyChoose?.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 shadow-sm">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-bold text-secondary-700 dark:text-slate-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Syllabus Section */}
            {(activeTab === 'syllabus' || !window.matchMedia("(min-width: 768px)").matches) && (
              <section id="syllabus" className="reveal space-y-8">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-black text-secondary-900 dark:text-white tracking-tight">Academic Syllabus</h2>
                  </div>
                  <p className="text-sm font-bold text-secondary-400 uppercase tracking-widest">{course.papers?.length || 0} Papers</p>
                </div>

                <div className="space-y-6">
                  {course.papers?.map((paper, pIdx) => (
                    <div key={pIdx} className="glass-morphism rounded-[32px] border border-white/10 overflow-hidden shadow-sm">
                      <div className="p-8 bg-white/5 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-black text-secondary-900 dark:text-white mb-1">{paper.title}</h3>
                          <p className="text-xs font-bold text-primary-500 uppercase tracking-widest">Total Coursework: {paper.totalHours} Hours</p>
                        </div>
                      </div>
                      <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paper.modules?.map((module, mIdx) => (
                          <div key={mIdx} className="p-6 rounded-[24px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-bold text-secondary-900 dark:text-white group-hover:text-primary-500 transition-colors">{module.title}</h4>
                              <span className="text-[10px] font-black px-2 py-1 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg uppercase">{module.hours}h</span>
                            </div>
                            <ul className="space-y-2">
                              {module.topics?.map((topic, tIdx) => (
                                <li key={tIdx} className="flex gap-2 text-sm text-secondary-600 dark:text-slate-400 font-medium">
                                  <ChevronRight className="h-4 w-4 text-primary-500 flex-shrink-0" /> {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Practical Components */}
                {course.practicals?.length > 0 && (
                  <div className="mt-12 space-y-6">
                    <h3 className="text-2xl font-black text-secondary-900 dark:text-white tracking-tight flex items-center gap-3">
                      <Activity className="h-6 w-6 text-rose-500" /> Practical Training
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {course.practicals[0]?.components?.map((comp, idx) => (
                        <div key={idx} className="p-6 rounded-3xl bg-secondary-900 text-white shadow-xl flex flex-col items-center text-center">
                          <p className="text-3xl font-black text-primary-400 mb-1">{comp.hours}</p>
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Hours</p>
                          <p className="text-sm font-bold leading-snug">{comp.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Objectives Section */}
            {(activeTab === 'objectives' || !window.matchMedia("(min-width: 768px)").matches) && (
              <section id="objectives" className="reveal space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg">
                        <Target className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-black text-secondary-900 dark:text-white tracking-tight underline decoration-primary-500 decoration-4 underline-offset-8">Program Objectives</h2>
                    </div>
                    <ul className="space-y-4">
                      {course.programObjectives?.map((obj, i) => (
                        <li key={i} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary-500/50 transition-all">
                          <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 text-xs font-black">{i+1}</div>
                          <p className="text-sm font-bold text-secondary-700 dark:text-slate-300 leading-relaxed">{obj}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                        <Award className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-black text-secondary-900 dark:text-white tracking-tight underline decoration-emerald-500 decoration-4 underline-offset-8">Career Outcomes</h2>
                    </div>
                    <ul className="space-y-4">
                      {course.programOutcomes?.map((po, i) => (
                        <li key={i} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-emerald-500/50 transition-all">
                          <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <p className="text-sm font-bold text-secondary-700 dark:text-slate-300 leading-relaxed">{po}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* Fees Section */}
            {(activeTab === 'fees' || !window.matchMedia("(min-width: 768px)").matches) && (
              <section id="fees" className="reveal space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg">
                    <IndianRupee className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-black text-secondary-900 dark:text-white tracking-tight">Fee Breakdown</h2>
                </div>

                <div className="glass-morphism rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">
                  <div className="p-8 bg-gradient-to-br from-amber-500/10 to-transparent">
                    <table className="w-full text-left">
                      <thead className="text-xs font-black text-secondary-400 uppercase tracking-widest italic border-b border-white/10">
                        <tr>
                          <th className="pb-4">Feature Segment</th>
                          <th className="pb-4 text-right">Investment (INR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {[
                          { label: 'Registration / Admission Fee', value: course.detailedFees?.registration },
                          { label: 'Academic & Tuition Fee', value: course.detailedFees?.tuition },
                          { label: 'Study Material & Digital Resources', value: course.detailedFees?.studyMaterial },
                          { label: 'Practical & Activity Fee', value: course.detailedFees?.practical },
                          { label: 'Examination & Certification', value: course.detailedFees?.examination },
                          { label: 'Internship & ID Records', value: course.detailedFees?.internship },
                        ].filter(f => f.value > 0).map((fee, idx) => (
                          <tr key={idx} className="group hover:bg-white/5 transition-all">
                            <td className="py-5 font-bold text-secondary-800 dark:text-slate-300 italic">{fee.label}</td>
                            <td className="py-5 text-right font-black text-secondary-900 dark:text-white">₹{fee.value?.toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td className="pt-10 pb-4 text-xl font-black text-secondary-900 dark:text-white">Total Program Investment</td>
                          <td className="pt-10 pb-4 text-right text-3xl font-black text-primary-600 dark:text-primary-400">₹{course.fees?.toLocaleString('en-IN')}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="p-6 bg-amber-500/20 border-t border-amber-500/20 flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4 text-amber-600" />
                    <p className="text-xs font-black text-amber-700 uppercase tracking-widest">Scholarships & Installment schemes available via inquiry</p>
                  </div>
                </div>
              </section>
            )}

            {/* Admission Section */}
            {(activeTab === 'admission' || !window.matchMedia("(min-width: 768px)").matches) && (
              <section id="admission" className="reveal space-y-12">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-8 p-10 rounded-[48px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                          <Target className="h-32 w-32" />
                        </div>
                        <h3 className="text-2xl font-black relative z-10">Minimum Qualification</h3>
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-16 h-16 rounded-3xl bg-primary-600 flex items-center justify-center text-2xl font-black">12</div>
                          <p className="text-xl font-medium text-slate-300 leading-tight">Must have passed 10+2 (Higher Secondary) or equivalent.</p>
                        </div>
                        <div className="pt-4 relative z-10">
                           <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Verification Steps</p>
                           <div className="space-y-2">
                              {['Original Marksheet', 'Aadhar Card', 'Recent Photos', 'Transfer Certificate'].map((doc, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-slate-400 font-bold">
                                  <div className="w-1 h-1 rounded-full bg-primary-500" /> {doc}
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>

                      <div className="space-y-8 p-10 rounded-[48px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl relative group">
                         <h3 className="text-2xl font-black text-secondary-900 dark:text-white underline decoration-rose-500 decoration-4 underline-offset-8 mb-8">Examination Scheme</h3>
                         <div className="space-y-6">
                            <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 group-hover:border-rose-500/50 transition-all">
                               <span className="font-bold text-secondary-600 dark:text-slate-400 uppercase text-xs tracking-widest">Internal Assessment</span>
                               <span className="text-xl font-black text-secondary-900 dark:text-white">{course.examinationScheme?.theoryInternal}%</span>
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 group-hover:border-rose-500/50 transition-all">
                               <span className="font-bold text-secondary-600 dark:text-slate-400 uppercase text-xs tracking-widest">Final Examination</span>
                               <span className="text-xl font-black text-secondary-900 dark:text-white">{course.examinationScheme?.theoryFinal}%</span>
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 group-hover:border-rose-500/50 transition-all">
                               <span className="font-bold text-secondary-600 dark:text-slate-400 uppercase text-xs tracking-widest">Passing Marks</span>
                               <span className="text-xl font-black text-rose-500">{course.examinationScheme?.minPassing}%</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 italic text-sm text-rose-600 dark:text-rose-400 font-medium">
                               Practical include: {course.examinationScheme?.practical}
                            </div>
                         </div>
                      </div>
                   </div>
              </section>
            )}

          </div>

          {/* Sidebar / CTA */}
          <div className="space-y-8">
            <div className="sticky top-40 space-y-8">
                {/* Enrollment Card */}
                <div className="glass-morphism p-10 rounded-[48px] border border-white/20 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="relative z-10 text-center space-y-8">
                    <div>
                      <p className="text-xs font-black text-secondary-500 uppercase tracking-[0.3em] mb-2">Enrollment Open</p>
                      <h3 className="text-4xl font-black text-secondary-900 dark:text-white mb-2">₹{course.fees?.toLocaleString('en-IN')}</h3>
                      <p className="text-sm font-bold text-primary-500 italic">Global Certification Standard</p>
                    </div>

                    <div className="space-y-4 py-6 border-y border-white/5">
                      {[
                        { label: 'Government Recognized', icon: Shield },
                        { label: 'Lifetime Support', icon: Heart },
                        { label: 'Job-Linked Internship', icon: ArrowRight },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-secondary-700 dark:text-slate-300">
                          <item.icon className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={handleEnroll}
                      className="w-full h-20 bg-secondary-900 dark:bg-white text-white dark:text-black rounded-[24px] font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] shadow-2xl active:scale-[0.98] transition-all"
                    >
                      ENROLL NOW <ExternalLink className="h-6 w-6" />
                    </button>
                    
                    <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest leading-loose">
                      By clicking enroll you will be redirected to our official admission desk on WhatsApp for documentation verification.
                    </p>
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-8 rounded-[40px] bg-primary-600 text-white shadow-xl">
                    <h4 className="text-xl font-black mb-4">Need Help?</h4>
                    <p className="text-slate-100 font-medium text-sm mb-6 leading-relaxed">Our academic counselors are available to answer any questions about the syllabus, career scope, and admission process.</p>
                    <a href="tel:8295886832" className="flex items-center gap-3 text-white font-black hover:translate-x-2 transition-transform">
                       +91 82958-86832 <ArrowRight className="h-5 w-5" />
                    </a>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
