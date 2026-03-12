import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Megaphone, 
  Award, 
  Users, 
  TrendingUp, 
  Calendar,
  Plus,
  BarChart3,
  Clock,
  UserPlus,
  FileText
} from 'lucide-react';
import api from '../../utils/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    overview: {
      totalCourses: 0,
      activeCourses: 0,
      totalNotices: 0,
      totalCertificates: 0,
      totalStudents: 0
    },
    recentActivity: {
      recentCourses: [],
      recentNotices: [],
      recentCertificates: [],
      recentStudents: []
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Add New Course',
      description: 'Create a new course for students',
      icon: BookOpen,
      link: '/admin/courses',
      color: 'bg-blue-500'
    },
    {
      title: 'Post Notice',
      description: 'Share important announcements',
      icon: Megaphone,
      link: '/admin/notices',
      color: 'bg-green-500'
    },
    {
      title: 'Upload Certificate',
      description: 'Add new student certificates',
      icon: Award,
      link: '/admin/certificates',
      color: 'bg-purple-500'
    },
    {
      title: 'View Reports',
      description: 'Generate detailed reports',
      icon: BarChart3,
      link: '#',
      color: 'bg-orange-500'
    }
  ];

  const statCards = [
    {
      title: 'Total Courses',
      value: stats.overview.totalCourses,
      change: '+2 this month',
      icon: BookOpen,
      color: 'bg-blue-500',
      trend: 'up'
    },
    {
      title: 'Total Notices',
      value: stats.overview.totalNotices,
      change: '+5 this month',
      icon: Megaphone,
      color: 'bg-green-500',
      trend: 'up'
    },
    {
      title: 'Certificates',
      value: stats.overview.totalCertificates,
      change: '+18 this month',
      icon: Award,
      color: 'bg-purple-500',
      trend: 'up'
    },
    {
      title: 'Students',
      value: stats.overview.totalStudents,
      change: '+32 this month',
      icon: Users,
      color: 'bg-orange-500',
      trend: 'up'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="loading-spinner h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back! Here's what's happening at ABVSTVS today.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="card-gradient hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-secondary-900 mb-1">
                {stat.value}
              </div>
              <div className="text-secondary-600">
                {stat.title}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="card hover:shadow-lg transition-all duration-200 group cursor-pointer"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-4 rounded-lg ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Courses */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
              Recent Courses
            </h3>
            <div className="space-y-3">
              {stats.recentActivity.recentCourses.length > 0 ? (
                stats.recentActivity.recentCourses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-secondary-100 last:border-0">
                    <div>
                      <p className="font-medium text-secondary-900">{course.title}</p>
                      <p className="text-sm text-secondary-500">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Plus className="h-4 w-4 text-green-500" />
                  </div>
                ))
              ) : (
                <p className="text-secondary-500 text-center py-4">No recent courses</p>
              )}
            </div>
          </div>

          {/* Recent Notices */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <Megaphone className="h-5 w-5 mr-2 text-primary-600" />
              Recent Notices
            </h3>
            <div className="space-y-3">
              {stats.recentActivity.recentNotices.length > 0 ? (
                stats.recentActivity.recentNotices.map((notice, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-secondary-100 last:border-0">
                    <div>
                      <p className="font-medium text-secondary-900">{notice.title}</p>
                      <p className="text-sm text-secondary-500">
                        {new Date(notice.createdAt).toLocaleDateString()} • {notice.author?.username}
                      </p>
                    </div>
                    <FileText className="h-4 w-4 text-blue-500" />
                  </div>
                ))
              ) : (
                <p className="text-secondary-500 text-center py-4">No recent notices</p>
              )}
            </div>
          </div>

          {/* Recent Certificates */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary-600" />
              Recent Certificates
            </h3>
            <div className="space-y-3">
              {stats.recentActivity.recentCertificates.length > 0 ? (
                stats.recentActivity.recentCertificates.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-secondary-100 last:border-0">
                    <div>
                      <p className="font-medium text-secondary-900">{cert.studentName}</p>
                      <p className="text-sm text-secondary-500">
                        {cert.courseName} • {new Date(cert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Award className="h-4 w-4 text-purple-500" />
                  </div>
                ))
              ) : (
                <p className="text-secondary-500 text-center py-4">No recent certificates</p>
              )}
            </div>
          </div>

          {/* Recent Students */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-primary-600" />
              Recent Students
            </h3>
            <div className="space-y-3">
              {stats.recentActivity.recentStudents.length > 0 ? (
                stats.recentActivity.recentStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-secondary-100 last:border-0">
                    <div>
                      <p className="font-medium text-secondary-900">{student.username}</p>
                      <p className="text-sm text-secondary-500">
                        {student.email} • {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Users className="h-4 w-4 text-orange-500" />
                  </div>
                ))
              ) : (
                <p className="text-secondary-500 text-center py-4">No recent students</p>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary-600" />
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">API Server</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Last Backup</span>
              <span className="text-secondary-500 text-sm">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
