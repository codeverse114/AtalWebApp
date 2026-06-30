import React, { useState, useEffect } from 'react';
import { BookOpen, Star, Target, Shield, Heart, Award, ArrowRight, AwardIcon, Landmark, User, MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const About = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('institute');

  useEffect(() => {
    // Handle hash links directly
    if (location.hash) {
      const elementId = location.hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(elementId);
      }
    }
  }, [location]);

  const sections = [
    { id: 'institute', label: 'About the Institute', icon: Landmark },
    { id: 'founder', label: 'Message from Chairperson', icon: User },
    { id: 'director', label: 'Message from Director', icon: MessageCircle },
    { id: 'vision-mission', label: 'Vision & Mission', icon: Target },
    { id: 'objectives', label: 'Institutional Objectives', icon: BookOpen }
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-primary-800 to-blue-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase italic leading-tight">
            Who <span className="text-amber-300">We Are</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto font-medium">
            Learn more about the Atal Bihari Vajpayee Centre for Skill Training & Vocational Studies, our leadership, and our core academic objectives.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sticky Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="glass-morphism rounded-3xl border border-white/10 p-4 sticky top-24 space-y-1.5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400 dark:text-slate-500 px-3 mb-2">Navigate Info</p>
              {sections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleNavClick(sec.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                      activeSection === sec.id
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                        : 'text-secondary-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Info Display */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Section 1: About the Institute */}
            <section id="institute" className="card p-8 md:p-10 scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-secondary-100 dark:border-white/5">
                <div className="p-2.5 bg-primary-500/10 text-primary-600 rounded-xl">
                  <Landmark className="h-6 w-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-secondary-900 dark:text-white uppercase tracking-tight">
                  About the Institute
                </h2>
              </div>
              <p className="text-secondary-700 dark:text-slate-300 leading-relaxed text-sm">
                The <strong className="text-secondary-900 dark:text-white font-bold">Atal Bihari Vajpayee Centre for Skill Training & Vocational Studies (ABVCSTVS)</strong> is a multidisciplinary institution dedicated to advancing vocational education, skill development, professional training, research, innovation, entrepreneurship, and lifelong learning. Established under the aegis of the Ram Shree Education Research and Social Welfare Foundation, a not-for-profit society registered under the Madhya Pradesh Society Registrikaran Adhiniyam, 1973, and enrolled on the NITI Aayog NGO DARPAN Portal, the Centre has been established with the vision of creating an inclusive, future-ready, and globally competitive ecosystem for vocational education, workforce development, and capacity building.
              </p>
              <p className="text-secondary-700 dark:text-slate-300 leading-relaxed text-sm">
                Named in honour of Bharat Ratna Shri Atal Bihari Vajpayee, one of India's most distinguished statesmen, visionary leaders, and advocates of education and national development, the Centre draws inspiration from his ideals of inclusive growth, democratic values, knowledge-based progress, and human dignity. The institution is committed to translating these ideals into meaningful educational initiatives by providing quality vocational education, practical skill development, entrepreneurial orientation, and professional excellence that empower individuals to contribute effectively to society and the nation's economic development.
              </p>
              <p className="text-secondary-700 dark:text-slate-300 leading-relaxed text-sm">
                The Centre functions as a not-for-profit institution dedicated to providing accessible, affordable, inclusive, and high-quality vocational education and professional training across diverse sectors of the economy. It offers competency-based Certificate, Diploma, Advanced Diploma, Professional Development, Executive Education, and Continuing Skill Development programmes designed to meet the evolving requirements of industry, government, academia, entrepreneurs, and society. The academic framework integrates classroom learning with practical training, industry exposure, digital competency, innovation, entrepreneurship, and lifelong learning to prepare learners for meaningful employment and self-employment.
              </p>
              <p className="text-secondary-700 dark:text-slate-300 leading-relaxed text-sm">
                The academic philosophy of the Centre is guided by the principles of the National Education Policy (NEP) 2020, the National Credit Framework (NCrF), the National Skills Qualifications Framework (NSQF), and other applicable national policies relating to vocational education, quality assurance, and skill development. The Centre is committed to progressively aligning its academic programmes, institutional processes, and quality assurance mechanisms with the standards prescribed by the National Council for Vocational Education and Training (NCVET) and other competent statutory and regulatory authorities.
              </p>
            </section>

            {/* Section 2: Chairperson Message */}
            <section id="founder" className="card p-8 md:p-10 scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-secondary-100 dark:border-white/5">
                <div className="p-2.5 bg-primary-500/10 text-primary-600 rounded-xl">
                  <User className="h-6 w-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-secondary-900 dark:text-white uppercase tracking-tight">
                  Message from the Founder & Chairperson
                </h2>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border-l-4 border-amber-500 text-sm italic text-secondary-800 dark:text-slate-300 space-y-4">
                <p>
                  "It is with immense pride, profound responsibility, and an unwavering commitment to nation-building that I present the Atal Bihari Vajpayee Centre for Skill Training & Vocational Studies, an institution envisioned to empower individuals through quality vocational education, skill development, innovation, and lifelong learning."
                </p>
              </div>
              <div className="space-y-4 text-secondary-700 dark:text-slate-300 text-sm leading-relaxed">
                <p>
                  The twenty-first century demands a workforce that is not only academically qualified but also professionally competent, technologically proficient, ethically grounded, and socially responsible. Rapid technological advancements, evolving industrial ecosystems, and changing employment patterns require educational institutions to move beyond conventional teaching and adopt competency-based, industry-driven, and future-oriented learning models. It is with this conviction that this Centre has been established to bridge the gap between education, skills, innovation, and employment.
                </p>
                <p>
                  The Centre has been named in honour of Bharat Ratna Shri Atal Bihari Vajpayee, whose visionary leadership, unwavering commitment to democratic values, belief in education, and dedication to inclusive national development continue to inspire generations. His vision of a strong, self-reliant, and progressive India serves as the guiding philosophy of this institution. We seek to carry forward his ideals by creating an educational ecosystem that nurtures excellence, integrity, innovation, entrepreneurship, and service to society. The Foundation has consistently worked towards educational advancement, research, and social development, and this institution represents a significant milestone in its commitment to building a skilled and empowered society.
                </p>
                <p>
                  Our vision extends beyond the award of certificates and diplomas. We seek to cultivate responsible citizens, ethical professionals, innovative entrepreneurs, and lifelong learners capable of contributing meaningfully to economic development, social transformation, and public welfare. Every programme offered by the Centre shall be guided by principles of quality, accountability, inclusiveness, practical learning, and continuous improvement.
                </p>
              </div>
              <div className="pt-4 border-t border-secondary-100 dark:border-white/5">
                <p className="font-black text-secondary-900 dark:text-white text-base">Yash Pratap Singh Narwaria</p>
                <p className="text-xs text-secondary-500 font-semibold">Founder & Chairperson</p>
                <p className="text-[10px] text-secondary-400">Atal Bihari Vajpayee Centre for Skill Training & Vocational Studies</p>
                <p className="text-[10px] text-secondary-400">Ram Shree Education Research and Social Welfare Foundation</p>
              </div>
            </section>

            {/* Section 3: Director Message */}
            <section id="director" className="card p-8 md:p-10 scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-secondary-100 dark:border-white/5">
                <div className="p-2.5 bg-primary-500/10 text-primary-600 rounded-xl">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-secondary-900 dark:text-white uppercase tracking-tight">
                  Message from the Director
                </h2>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border-l-4 border-primary-500 text-sm italic text-secondary-800 dark:text-slate-300">
                <p>
                  "Education is the most powerful catalyst for individual transformation and national progress. In an era defined by rapid technological advancement, global interconnectedness, and evolving workforce demands, vocational education has assumed a pivotal role in preparing individuals to meet the challenges and opportunities of the future."
                </p>
              </div>
              <p className="text-secondary-700 dark:text-slate-300 text-sm leading-relaxed">
                The Atal Bihari Vajpayee Centre for Skill Training & Vocational Studies has been established with the vision of creating a dynamic learning environment where knowledge is complemented by practical skills, innovation, creativity, and ethical values. Our endeavour is to nurture competent professionals, responsible citizens, and lifelong learners who possess the confidence and capability to contribute meaningfully to society and the nation's development.
              </p>
              <p className="text-secondary-700 dark:text-slate-300 text-sm leading-relaxed">
                At the Centre, we believe that education extends beyond the classroom. It is a continuous journey of learning, innovation, critical thinking, and character building. Through learner-centric education, experiential learning, industry collaboration, research, and community engagement, we strive to cultivate an academic environment that encourages excellence, professionalism, and responsible leadership.
              </p>
              <div className="pt-4 border-t border-secondary-100 dark:border-white/5">
                <p className="font-black text-secondary-900 dark:text-white text-base">Office of the Director</p>
                <p className="text-xs text-secondary-500 font-semibold">ABVCSTVS Administration</p>
              </div>
            </section>

            {/* Section 4: Vision & Mission */}
            <section id="vision-mission" className="card p-8 md:p-10 scroll-mt-24 space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-secondary-100 dark:border-white/5">
                <div className="p-2.5 bg-primary-500/10 text-primary-600 rounded-xl">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-secondary-900 dark:text-white uppercase tracking-tight">
                  Vision & Mission
                </h2>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-amber-600 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Vision
                </h3>
                <p className="text-secondary-800 dark:text-slate-300 font-medium text-sm leading-relaxed bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
                  To emerge as a nationally recognised centre of excellence in vocational education, skill development, research, innovation, entrepreneurship, and lifelong learning by empowering individuals with knowledge, competencies, ethical values, and leadership qualities that contribute to sustainable development and nation-building.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary-600 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-500" /> Mission
                </h3>
                <p className="text-secondary-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  The Atal Bihari Vajpayee Centre for Skill Training & Vocational Studies is committed to:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Deliver quality vocational education and competency-based training that meets national and global standards.",
                    "Foster innovation, entrepreneurship, research, and lifelong learning to enhance employability and self-reliance.",
                    "Integrate academic knowledge with practical skills through industry collaboration, experiential learning, internships, and technology-enabled education.",
                    "Promote inclusive, accessible, and equitable learning opportunities for individuals from diverse social, economic, and geographical backgrounds.",
                    "Develop socially responsible, ethically grounded, and professionally competent individuals capable of contributing to economic growth, community development, and national progress.",
                    "Establish strategic partnerships with industries, academic institutions, government agencies, professional bodies, and organisations for collaborative learning.",
                    "Continuously strengthen institutional governance, academic quality, and organisational excellence through transparency and accountability."
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 bg-secondary-100/50 dark:bg-white/5 p-4 rounded-xl text-xs font-medium text-secondary-800 dark:text-slate-300">
                      <div className="h-5 w-5 rounded-full bg-primary-600/10 text-primary-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p>{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 5: Institutional Objectives */}
            <section id="objectives" className="card p-8 md:p-10 scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-secondary-100 dark:border-white/5">
                <div className="p-2.5 bg-primary-500/10 text-primary-600 rounded-xl">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-secondary-900 dark:text-white uppercase tracking-tight">
                  Institutional Objectives
                </h2>
              </div>
              <p className="text-xs text-secondary-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                The key educational and operational objectives of the Centre include:
              </p>
              <div className="space-y-3">
                {[
                  "Establish a multidisciplinary institution dedicated to vocational education, skill development, research, innovation, entrepreneurship, and capacity building.",
                  "Design, develop, and deliver competency-based educational programmes aligned with national education and skill development frameworks.",
                  "Enhance the employability, productivity, and entrepreneurial capabilities of learners through industry-oriented education and practical training.",
                  "Promote research, innovation, consultancy, and knowledge creation in vocational education, emerging technologies, and workforce development.",
                  "Facilitate industry collaboration through internships, apprenticeships, live projects, faculty-industry interaction, and strategic partnerships.",
                  "Develop Centres of Excellence in emerging disciplines and sectors of national importance.",
                  "Strengthen digital education by integrating modern technologies, artificial intelligence, blended learning, and digital learning platforms into academic delivery.",
                  "Promote lifelong learning through flexible learning pathways, continuing professional development, reskilling, and upskilling programmes.",
                  "Encourage innovation, startup development, and entrepreneurship through incubation, mentoring, and institutional support.",
                  "Promote constitutional values, ethical conduct, leadership, environmental responsibility, gender equality, and social inclusion among learners.",
                  "Establish robust systems of academic governance, quality assurance, institutional planning, and continuous improvement consistent with national and international best practices.",
                  "Collaborate with educational institutions, industries, government agencies, Sector Skill Councils, professional organisations, and international partners for academic and institutional development.",
                  "Contribute to the advancement of vocational education and skill ecosystems through community engagement, outreach programmes, policy advocacy, and social development initiatives.",
                  "Create a learner-centric academic environment that nurtures creativity, critical thinking, innovation, professional excellence, and responsible citizenship.",
                  "Evolve as a nationally respected institution that contributes to the realization of a Viksit Bharat by developing a skilled, innovative, ethical, and globally competent workforce."
                ].map((obj, i) => (
                  <div key={i} className="flex gap-3 items-start text-xs font-semibold text-secondary-700 dark:text-slate-300">
                    <ArrowRight className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p>{obj}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
