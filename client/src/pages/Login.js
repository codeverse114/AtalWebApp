import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <GraduationCap className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-2xl blur-xl group-hover:from-blue-600/30 group-hover:to-indigo-600/30 transition-all duration-300"></div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gradient mb-2">Welcome Back</h2>
          <p className="text-gray-600 text-lg">Sign in to your admin dashboard</p>
        </div>

        {/* Login Form */}
        <div className="card-glass slide-up">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger slide-down">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="label">
                Username or Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="input"
                placeholder="Enter your username or email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner h-5 w-5 mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 backdrop-blur-sm text-gray-500 font-medium">Demo Credentials</span>
              </div>
            </div>

            <div className="mt-6 bg-blue-50/70 backdrop-blur-sm rounded-xl p-4 border border-blue-100/50">
              <div className="text-center">
                <p className="text-sm font-semibold text-blue-900 mb-2">Default Admin Login</p>
                <p className="text-xs text-blue-700">
                  Username: <span className="font-mono bg-blue-100 px-2 py-1 rounded">admin</span>
                </p>
                <p className="text-xs text-blue-700">
                  Password: <span className="font-mono bg-blue-100 px-2 py-1 rounded">admin123</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
