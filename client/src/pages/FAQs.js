import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Info, Award, GraduationCap } from 'lucide-react';

const FAQs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    {
      title: "General Information",
      items: [
        {
          q: "What is the Atal Bihari Vajpayee Centre for Skill Training & Vocational Studies?",
          a: "The Atal Bihari Vajpayee Centre for Skill Training & Vocational Studies (ABVCSTVS) is a multidisciplinary institution established to provide quality vocational education, skill development, professional training, entrepreneurship development, research, and lifelong learning opportunities."
        },
        {
          q: "Under whose management is the Centre established?",
          a: "The Centre is established under the aegis of the Ram Shree Education Research and Social Welfare Foundation, a not-for-profit society registered under the Madhya Pradesh Society Registrikaran Adhiniyam, 1973 and enrolled on the NITI Aayog NGO DARPAN Portal."
        },
        {
          q: "What makes the Centre unique?",
          a: "The Centre integrates vocational education with practical training, digital learning, industry collaboration, innovation, entrepreneurship, and continuous professional development, enabling learners to acquire both technical and transferable skills."
        },
        {
          q: "What programmes does the Centre offer?",
          a: "The Centre proposes to offer Foundation, Certificate, Advanced Certificate, Diploma, Advanced Diploma, Executive Education, Professional Development, and Continuing Skill Development programmes across multiple disciplines."
        },
        {
          q: "Which academic disciplines are available?",
          a: "Programmes may include Artificial Intelligence, Information Technology, Commerce, Finance, Entrepreneurship, Legal Studies, Healthcare, Education, Agriculture, Hospitality, Digital Media, Skilled Trades, Beauty & Wellness, and other emerging sectors."
        },
        {
          q: "Are the programmes practical in nature?",
          a: "Yes. Academic programmes are designed to combine classroom instruction with laboratory work, workshops, internships, live projects, industrial visits, simulations, and hands-on learning."
        },
        {
          q: "Does the Centre encourage entrepreneurship?",
          a: "Yes. Entrepreneurship development is an integral part of the academic framework. Learners are encouraged to develop innovative ideas, business models, and startup initiatives through mentoring and industry interaction."
        }
      ]
    },
    {
      title: "Admissions & Academics",
      items: [
        {
          q: "Who is eligible to apply?",
          a: "Eligibility varies depending on the programme. Specific academic qualifications, age criteria (where applicable), and other requirements shall be notified in the admission guidelines for each programme."
        },
        {
          q: "How can I apply for admission?",
          a: "Applications may be submitted through the Centre's prescribed admission process, either online or offline, along with the required documents and application fee, if applicable."
        },
        {
          q: "Are scholarships or financial assistance available?",
          a: "Yes, merit-cum-means scholarships, fee concessions, and financial assistance may be provided in accordance with institutional policies, government schemes, or funding support available from time to time."
        },
        {
          q: "What teaching methods are adopted?",
          a: "The Centre follows a learner-centred approach using lectures, demonstrations, practical sessions, project-based learning, digital platforms, seminars, workshops, case studies, and industry interaction."
        },
        {
          q: "Will students receive internship opportunities?",
          a: "The Centre will endeavour to facilitate internships, apprenticeships, industrial training, and field exposure through partnerships with industries and organisations, subject to programme requirements and availability."
        },
        {
          q: "Does the Centre provide placement support?",
          a: "A dedicated Career Development and Placement Cell will work towards enhancing employability through career counselling, skill development, employer engagement, placement assistance, and networking opportunities."
        },
        {
          q: "Will digital learning facilities be available?",
          a: "Yes. The Centre intends to integrate digital learning technologies, online learning resources, virtual classrooms, and other technology-enabled educational tools into its academic ecosystem."
        },
        {
          q: "Does the Centre collaborate with industries?",
          a: "Yes. The Centre seeks to establish collaborations with industries, educational institutions, professional bodies, government agencies, and other organisations to strengthen academic quality, practical exposure, and employment opportunities."
        },
        {
          q: "How does the Centre ensure academic quality?",
          a: "Academic quality is promoted through curriculum review, qualified faculty, stakeholder feedback, continuous evaluation, industry participation, faculty development, and internal quality assurance mechanisms."
        }
      ]
    },
    {
      title: "Student Support",
      items: [
        {
          q: "What student support services are available?",
          a: "The Centre intends to provide academic mentoring, career guidance, counselling support, grievance redressal, personality development programmes, and opportunities for extracurricular and community engagement activities."
        },
        {
          q: "How can I obtain further information?",
          a: "For detailed information regarding admissions, programmes, fees, academic regulations, partnerships, and institutional policies, applicants may contact the Centre through its official communication channels or visit the official website."
        }
      ]
    }
  ];

  const toggleAccordion = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  // Filter based on search term
  const getFilteredCategories = () => {
    if (!searchTerm.trim()) return categories;
    
    return categories.map(cat => {
      const items = cat.items.filter(item => 
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...cat, items };
    }).filter(cat => cat.items.length > 0);
  };

  const filteredCategories = getFilteredCategories();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-primary-800 to-blue-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-3xl border border-white/20 flex items-center justify-center shadow-2xl">
                <HelpCircle className="h-9 w-9 text-amber-300 animate-pulse" />
              </div>
              <div className="absolute -inset-2 bg-amber-400/20 rounded-3xl blur-xl" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Find answers to commonly asked questions about admissions, academic programs, and student facilities at our Centre.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search box */}
        <div className="glass-morphism p-5 rounded-[28px] border border-white/10 mb-10 shadow-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5.5 w-5.5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search FAQs by keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 dark:bg-white/5 border border-white/10 h-14 pl-12 pr-4 rounded-2xl text-secondary-900 dark:text-white focus:ring-2 ring-primary-500/50 transition-all outline-none text-base"
            />
          </div>
        </div>

        {/* FAQs list */}
        <div className="space-y-10">
          {filteredCategories.length === 0 ? (
            <div className="py-16 text-center card">
              <HelpCircle className="h-12 w-12 text-secondary-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-secondary-900 dark:text-white">No matches found</h3>
              <p className="text-secondary-500 dark:text-slate-400 text-sm mt-1">Try using different search terms or browse the categories.</p>
            </div>
          ) : (
            filteredCategories.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-4">
                <h2 className="text-lg font-black text-secondary-900 dark:text-white uppercase tracking-widest pl-2 border-l-4 border-amber-500">
                  {cat.title}
                </h2>
                
                <div className="space-y-3">
                  {cat.items.map((item, itemIdx) => {
                    const key = `${catIdx}-${itemIdx}`;
                    const isOpen = openIndex === key;
                    
                    return (
                      <div 
                        key={itemIdx} 
                        className={`card p-0 overflow-hidden transition-all duration-300 border ${
                          isOpen ? 'border-primary-500 shadow-lg' : 'border-secondary-100 dark:border-white/5'
                        }`}
                      >
                        <button
                          onClick={() => toggleAccordion(catIdx, itemIdx)}
                          className="w-full flex justify-between items-center px-6 py-5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                        >
                          <span className="text-sm font-bold text-secondary-800 dark:text-slate-200 leading-snug">
                            {item.q}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-primary-500 flex-shrink-0 ml-4" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-secondary-400 flex-shrink-0 ml-4" />
                          )}
                        </button>
                        
                        <div 
                          className={`transition-all duration-300 overflow-hidden ${
                            isOpen ? 'max-h-[300px] border-t border-secondary-100 dark:border-white/5' : 'max-h-0'
                          }`}
                        >
                          <div className="px-6 py-5 text-xs text-secondary-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-900/30">
                            {item.a}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
