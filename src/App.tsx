import { useState, useEffect } from 'react';
import { Github, Linkedin, Phone, Mail, Code2, Menu, X, Sun, Moon } from 'lucide-react';
import { Home } from './components/Home';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';

type Section = 'home' | 'about' | 'experience' | 'projects' | 'skills' | 'contact';

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navItems: { id: Section; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (section: Section) => {
    setCurrentSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} overflow-hidden transition-colors duration-300`}>
      <div className={`fixed inset-0 ${isDark ? 'bg-gradient-to-br from-black via-gray-900 to-black opacity-90' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} -z-10`}></div>

      {isDark && (
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-900/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-900/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
      )}

      <nav className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'bg-black/80 border-red-900/20' : 'bg-white/80 border-gray-200'} backdrop-blur-md border-b transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
              <div className="relative">
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} blur-lg opacity-50`}></div>
                <div className={`relative ${isDark ? 'bg-gradient-to-br from-red-600 to-orange-600' : 'bg-gradient-to-br from-blue-600 to-cyan-600'} p-2 rounded-lg`}>
                  <Code2 className="text-white" size={24} />
                </div>
              </div>
              <span className={`text-2xl font-black tracking-wider ${isDark ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500' : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600'} bg-clip-text text-transparent`}>
                VJ
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-5 py-2 rounded-lg font-semibold tracking-wide transition-all duration-300 ${
                    currentSection === item.id
                      ? isDark
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-900/50'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                      : isDark
                        ? 'text-gray-300 hover:text-white hover:bg-white/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => setIsDark(!isDark)}
                className={`ml-4 p-2 rounded-lg transition-all duration-300 ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-yellow-400'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-yellow-400'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                className={isDark ? 'text-white p-2' : 'text-gray-900 p-2'}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-5 py-3 rounded-lg font-semibold tracking-wide transition-all duration-300 text-left ${
                    currentSection === item.id
                      ? isDark
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-900/50'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                      : isDark
                        ? 'text-gray-300 hover:text-white hover:bg-white/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <main className="pt-20">
        {currentSection === 'home' && <Home onNavigate={setCurrentSection} isDark={isDark} />}
        {currentSection === 'about' && <About isDark={isDark} />}
        {currentSection === 'experience' && <Experience isDark={isDark} />}
        {currentSection === 'projects' && <Projects isDark={isDark} />}
        {currentSection === 'skills' && <Skills isDark={isDark} />}
        {currentSection === 'contact' && <Contact isDark={isDark} />}
      </main>
    </div>
  );
}

export default App;
