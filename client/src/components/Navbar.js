import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/notices', label: 'Notices' },
    { path: '/certificate', label: 'Certificate' },
    { path: '/contact', label: 'Contact' }
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/courses', label: 'Manage Courses' },
    { path: '/admin/notices', label: 'Manage Notices' },
    { path: '/admin/certificates', label: 'Manage Certificates' }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <GraduationCap className="h-10 w-10 text-blue-600 transform group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -inset-1 bg-blue-600/20 rounded-full blur-lg group-hover:bg-blue-600/30 transition-all duration-300"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">ABVSTVS</h1>
                <p className="text-xs text-gray-600 hidden sm:block font-medium">
                  Skill Training & Vocational Studies
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActiveLink(link.path) ? 'nav-link-active' : ''} transform hover:scale-105 transition-all duration-200`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && user?.role === 'admin' && (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50/70 transform hover:scale-105 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </button>
                
                {/* Admin Dropdown */}
                <div className="dropdown">
                  {adminLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="dropdown-item"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger text-sm px-4 py-2"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActiveLink(link.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Admin Panel
                    </p>
                    {adminLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user?.username}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
