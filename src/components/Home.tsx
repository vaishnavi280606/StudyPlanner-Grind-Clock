import { Github, Linkedin, Phone, Mail, ExternalLink } from 'lucide-react';

interface HomeProps {
  onNavigate: (section: 'home' | 'about' | 'experience' | 'projects' | 'skills' | 'contact') => void;
  isDark: boolean;
}

export function Home({ onNavigate, isDark }: HomeProps) {
  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/vaishnavijatavath',
      color: isDark ? 'from-gray-600 to-gray-800' : 'from-gray-700 to-gray-900',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/in/vaishnavijatavath',
      color: 'from-blue-600 to-blue-800',
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:your.email@example.com',
      color: isDark ? 'from-red-600 to-orange-600' : 'from-red-500 to-orange-500',
    },
    {
      name: 'Phone',
      icon: Phone,
      url: 'tel:+1234567890',
      color: 'from-green-600 to-emerald-600',
    },
  ];

  const codingProfiles = [
    {
      name: 'LeetCode',
      url: 'https://leetcode.com/vaishnavijatavath',
      stats: 'Problems Solved',
    },
    {
      name: 'CodeChef',
      url: 'https://codechef.com/users/vaishnavijatavath',
      stats: 'Star Rating',
    },
    {
      name: 'Codeforces',
      url: 'https://codeforces.com/profile/vaishnavijatavath',
      stats: 'Max Rating',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} tracking-widest uppercase animate-fade-in`}>
                Hello, I'm
              </h2>
              <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-tight animate-fade-in">
                <span className={`${isDark ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500' : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600'} bg-clip-text text-transparent`}>
                  Vaishnavi
                </span>
                <br />
                <span className={`${isDark ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500' : 'bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600'} bg-clip-text text-transparent`}>
                  Jatavath
                </span>
              </h1>
              <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} font-light animate-fade-in`}>
                Full Stack Developer & Problem Solver
              </p>
            </div>

            <div className="flex flex-wrap gap-4 animate-fade-in">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${link.color} blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                    <div className={`relative bg-gradient-to-r ${link.color} p-4 rounded-xl hover:scale-110 transition-transform duration-300`}>
                      <Icon className="text-white" size={24} />
                    </div>
                  </a>
                );
              })}
            </div>

            <button
              onClick={() => onNavigate('contact')}
              className={`group relative inline-flex items-center gap-3 px-8 py-4 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} rounded-full font-bold text-lg overflow-hidden animate-fade-in text-white`}
            >
              <span className="relative z-10">Get In Touch</span>
              <ExternalLink className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
              <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-orange-600 to-red-600' : 'bg-gradient-to-r from-cyan-600 to-blue-600'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </button>
          </div>

          <div className="space-y-8">
            <div className="relative group">
              <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
              <div className={`relative ${isDark ? 'bg-gradient-to-br from-gray-900 to-black border-2 border-red-900/30' : 'bg-gradient-to-br from-gray-100 to-white border-2 border-blue-200'} rounded-2xl p-2 overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-full h-1 ${isDark ? 'bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500' : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600'}`}></div>
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Vaishnavi Jatavath"
                  className="w-full h-96 object-cover rounded-xl"
                />
              </div>
            </div>

            <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-black border-red-900/30' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} border rounded-2xl p-6 backdrop-blur-sm`}>
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} bg-clip-text text-transparent`}>
                Coding Profiles
              </h3>
              <div className="space-y-4">
                {codingProfiles.map((profile) => (
                  <a
                    key={profile.name}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center justify-between p-4 ${isDark ? 'bg-black/50 border-gray-800 hover:border-red-900/50' : 'bg-white border-gray-200 hover:border-blue-300'} border rounded-xl transition-all duration-300 hover:translate-x-2`}
                  >
                    <div>
                      <h4 className={`text-lg font-bold ${isDark ? 'text-white group-hover:text-orange-500' : 'text-gray-900 group-hover:text-cyan-600'} transition-colors`}>
                        {profile.name}
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{profile.stats}</p>
                    </div>
                    <ExternalLink
                      className={`${isDark ? 'text-gray-600 group-hover:text-orange-500' : 'text-gray-400 group-hover:text-cyan-600'} transition-colors`}
                      size={20}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
