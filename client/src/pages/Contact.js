import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import api from '../utils/axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Store contact message in localStorage for now (would be sent to backend)
      const contactMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      const newMessage = {
        ...formData,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      contactMessages.push(newMessage);
      localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
      
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      alert('Message sent successfully! We will contact you soon.');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      content: 'Education Complex, Sector 15, New Delhi - 110001',
      color: 'text-red-600'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+91 11 2345 6789',
      color: 'text-green-600'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@abvstvs.edu.in',
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      content: 'Monday - Saturday: 9:00 AM - 5:00 PM',
      color: 'text-purple-600'
    }
  ];

  const departments = [
    {
      name: 'Admissions',
      email: 'admissions@abvstvs.edu.in',
      phone: '+91 11 2345 6789',
      description: 'For all admission related queries'
    },
    {
      name: 'Academic Affairs',
      email: 'academics@abvstvs.edu.in',
      phone: '+91 11 2345 6790',
      description: 'For course and curriculum related queries'
    },
    {
      name: 'Student Support',
      email: 'support@abvstvs.edu.in',
      phone: '+91 11 2345 6791',
      description: 'For student services and support'
    },
    {
      name: 'Administration',
      email: 'admin@abvstvs.edu.in',
      phone: '+91 11 2345 6792',
      description: 'For administrative and general queries'
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Get in touch with us for any queries, admissions, or information about our programs.
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <div key={index} className="card text-center hover:shadow-lg transition-shadow">
              <div className={`flex justify-center mb-4 ${info.color}`}>
                <info.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {info.title}
              </h3>
              <p className="text-secondary-600">
                {info.content}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="card">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-6 w-6 text-primary-600 mr-2" />
                <h2 className="text-2xl font-bold text-secondary-900">
                  Send us a Message
                </h2>
              </div>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-lg text-center">
                  <div className="text-green-600 text-4xl mb-2">✓</div>
                  <h3 className="text-lg font-semibold mb-2">Message Sent Successfully!</h3>
                  <p>Thank you for contacting us. We will get back to you soon.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn btn-primary mt-4"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="label">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="label">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="input"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="label">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="label">
                        Subject *
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="input"
                        placeholder="Admission Query"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="label">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="input"
                      placeholder="Tell us more about your query..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Departments */}
          <div>
            <div className="card">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                Contact Departments
              </h2>
              
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="border-l-4 border-primary-600 pl-4 py-2">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                      {dept.name}
                    </h3>
                    <p className="text-sm text-secondary-600 mb-2">
                      {dept.description}
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-secondary-700">
                        <Mail className="h-4 w-4 mr-2 text-primary-600" />
                        {dept.email}
                      </div>
                      <div className="flex items-center text-secondary-700">
                        <Phone className="h-4 w-4 mr-2 text-primary-600" />
                        {dept.phone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Find Us
              </h3>
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary-600 mx-auto mb-2" />
                  <p className="text-primary-700 font-medium">
                    Interactive Map
                  </p>
                  <p className="text-primary-600 text-sm">
                    Education Complex, Sector 15, New Delhi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <div className="card">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">
                  How do I apply for admission?
                </h3>
                <p className="text-secondary-600 text-sm">
                  You can apply for admission by filling out the online application form or visiting our campus during office hours.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">
                  What are the admission requirements?
                </h3>
                <p className="text-secondary-600 text-sm">
                  Requirements vary by course. Generally, you need to have completed the minimum education level specified for each program.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">
                  Do you provide placement assistance?
                </h3>
                <p className="text-secondary-600 text-sm">
                  Yes, we provide placement assistance and career guidance to all our students through our dedicated placement cell.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">
                  Are scholarships available?
                </h3>
                <p className="text-secondary-600 text-sm">
                  Yes, we offer merit-based scholarships to eligible students. Please contact the admissions office for more details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
