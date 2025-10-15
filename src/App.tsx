import { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Briefcase, GraduationCap, Award, Code } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('about');

  const navigation = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
  ];

  const skills = {
    'Programming Languages': ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++'],
    'Web Technologies': ['React', 'Node.js', 'HTML5', 'CSS3', 'Tailwind CSS'],
    'Data & AI': ['Machine Learning', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn'],
    'Tools & Platforms': ['Git', 'Docker', 'AWS', 'Firebase', 'Supabase'],
  };

  const experiences = [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Company',
      period: '2022 - Present',
      description: 'Leading development of scalable web applications and mentoring junior developers.',
      achievements: [
        'Improved application performance by 40%',
        'Led team of 5 developers on critical projects',
        'Implemented CI/CD pipeline reducing deployment time by 60%',
      ],
    },
    {
      title: 'Full Stack Developer',
      company: 'Digital Agency',
      period: '2020 - 2022',
      description: 'Developed custom web solutions for diverse clients across industries.',
      achievements: [
        'Built 15+ production-ready web applications',
        'Increased client satisfaction scores by 35%',
        'Reduced bug reports by implementing comprehensive testing',
      ],
    },
  ];

  const education = [
    {
      degree: 'Master of Computer Science',
      institution: 'University Name',
      period: '2018 - 2020',
      gpa: '3.9/4.0',
    },
    {
      degree: 'Bachelor of Computer Science',
      institution: 'University Name',
      period: '2014 - 2018',
      gpa: '3.8/4.0',
    },
  ];

  const projects = [
    {
      title: 'AI Study Planner',
      description: 'Intelligent app that creates personalized study schedules using machine learning to analyze productivity patterns.',
      tech: ['Python', 'TensorFlow', 'React', 'Flask'],
      link: '#',
    },
    {
      title: 'E-Commerce Platform',
      description: 'Full-featured online store with payment integration, inventory management, and analytics dashboard.',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      link: '#',
    },
    {
      title: 'Real-Time Chat Application',
      description: 'Scalable messaging platform with end-to-end encryption and video calling capabilities.',
      tech: ['TypeScript', 'WebRTC', 'Socket.io', 'MongoDB'],
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Your Name
            </h1>
            <div className="hidden md:flex gap-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'text-slate-900 border-b-2 border-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <section className="mb-20 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-slate-200">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-slate-900 to-slate-600 flex items-center justify-center text-white text-6xl font-bold shadow-xl">
                    YN
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-5xl font-bold text-slate-900 mb-4">Your Name</h2>
                  <p className="text-2xl text-slate-600 mb-6">Full Stack Developer & AI Enthusiast</p>
                  <p className="text-slate-700 mb-8 leading-relaxed text-lg">
                    Passionate software engineer with expertise in building scalable web applications
                    and implementing AI-driven solutions. Committed to writing clean, efficient code
                    and creating exceptional user experiences.
                  </p>
                  <div className="flex flex-wrap gap-4 text-slate-600">
                    <a href="mailto:your.email@example.com" className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                      <Mail size={20} />
                      <span>your.email@example.com</span>
                    </a>
                    <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                      <Phone size={20} />
                      <span>+1 (234) 567-890</span>
                    </a>
                    <div className="flex items-center gap-2">
                      <MapPin size={20} />
                      <span>San Francisco, CA</span>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-all hover:scale-110"
                    >
                      <Github size={24} />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-all hover:scale-110"
                    >
                      <Linkedin size={24} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {activeSection === 'experience' && (
            <section className="mb-20 animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <Briefcase className="text-slate-900" size={32} />
                <h3 className="text-4xl font-bold text-slate-900">Experience</h3>
              </div>
              <div className="space-y-6">
                {experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-md p-8 border border-slate-200 hover:shadow-xl transition-all duration-300 hover:border-slate-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h4 className="text-2xl font-bold text-slate-900">{exp.title}</h4>
                        <p className="text-lg text-slate-600">{exp.company}</p>
                      </div>
                      <span className="text-slate-500 font-medium">{exp.period}</span>
                    </div>
                    <p className="text-slate-700 mb-4">{exp.description}</p>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600">
                          <span className="text-slate-900 mt-1">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'education' && (
            <section className="mb-20 animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="text-slate-900" size={32} />
                <h3 className="text-4xl font-bold text-slate-900">Education</h3>
              </div>
              <div className="space-y-6">
                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-md p-8 border border-slate-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h4 className="text-2xl font-bold text-slate-900">{edu.degree}</h4>
                      <span className="text-slate-500 font-medium">{edu.period}</span>
                    </div>
                    <p className="text-lg text-slate-600 mb-2">{edu.institution}</p>
                    <p className="text-slate-700">GPA: {edu.gpa}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'skills' && (
            <section className="mb-20 animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <Code className="text-slate-900" size={32} />
                <h3 className="text-4xl font-bold text-slate-900">Skills</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(skills).map(([category, items]) => (
                  <div
                    key={category}
                    className="bg-white rounded-xl shadow-md p-8 border border-slate-200 hover:shadow-xl transition-all duration-300"
                  >
                    <h4 className="text-xl font-bold text-slate-900 mb-4">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-900 hover:text-white transition-all duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'projects' && (
            <section className="mb-20 animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <Award className="text-slate-900" size={32} />
                <h3 className="text-4xl font-bold text-slate-900">Projects</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-md p-8 border border-slate-200 hover:shadow-xl transition-all duration-300 hover:border-slate-300 flex flex-col"
                  >
                    <h4 className="text-xl font-bold text-slate-900 mb-3">{project.title}</h4>
                    <p className="text-slate-600 mb-4 flex-grow">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a
                      href={project.link}
                      className="text-slate-900 font-medium hover:underline inline-flex items-center gap-1"
                    >
                      View Project →
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-600">
          <p>© 2025 Your Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
