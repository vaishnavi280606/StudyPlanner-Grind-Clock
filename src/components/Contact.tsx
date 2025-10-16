import { Mail, Phone, MapPin, Send, Github, Linkedin } from 'lucide-react';
import { useState } from 'react';

interface ContactProps {
  isDark: boolean;
}

export function Contact({ isDark }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message sent! (Demo - no actual email sent)');
    setFormData({ name: '', email: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'your.email@example.com',
      href: 'mailto:your.email@example.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (234) 567-8900',
      href: 'tel:+1234567890',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Your City, Country',
      href: '#',
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/vaishnavijatavath',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/vaishnavijatavath',
    },
  ];

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4">
            <span className={`${isDark ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500' : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600'} bg-clip-text text-transparent`}>
              Get In Touch
            </span>
          </h2>
          <div className={`w-32 h-1 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} mx-auto rounded-full`}></div>
          <p className={`mt-6 text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Have a project in mind? Let's work together to create something amazing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-black border-red-900/30' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} border rounded-2xl p-8`}>
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} bg-clip-text text-transparent`}>
                Contact Information
              </h3>
              <div className="space-y-6">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="group flex items-start gap-4 hover:translate-x-2 transition-transform"
                    >
                      <div className="relative">
                        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                        <div className={`relative w-12 h-12 ${isDark ? 'bg-gradient-to-br from-red-600 to-orange-600' : 'bg-gradient-to-br from-blue-600 to-cyan-600'} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className="text-white" size={20} />
                        </div>
                      </div>
                      <div>
                        <p className={`text-sm mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{item.label}</p>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-black border-red-900/30' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} border rounded-2xl p-8`}>
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} bg-clip-text text-transparent`}>
                Follow Me
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                    >
                      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                      <div className={`relative w-14 h-14 ${isDark ? 'bg-gradient-to-br from-red-600 to-orange-600' : 'bg-gradient-to-br from-blue-600 to-cyan-600'} rounded-xl flex items-center justify-center hover:scale-110 transition-transform`}>
                        <Icon className="text-white" size={24} />
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-black border-red-900/30' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} border rounded-2xl p-8`}>
            <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} bg-clip-text text-transparent`}>
              Send Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className={`w-full px-4 py-3 ${isDark ? 'bg-black/50 border-gray-800 focus:border-orange-600 focus:ring-orange-600/20 text-white' : 'bg-white border-gray-300 focus:border-cyan-600 focus:ring-cyan-600/20 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 transition-all`}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className={`w-full px-4 py-3 ${isDark ? 'bg-black/50 border-gray-800 focus:border-orange-600 focus:ring-orange-600/20 text-white' : 'bg-white border-gray-300 focus:border-cyan-600 focus:ring-cyan-600/20 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 transition-all`}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className={`w-full px-4 py-3 ${isDark ? 'bg-black/50 border-gray-800 focus:border-orange-600 focus:ring-orange-600/20 text-white' : 'bg-white border-gray-300 focus:border-cyan-600 focus:ring-cyan-600/20 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none`}
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                className={`group w-full relative inline-flex items-center justify-center gap-3 px-6 py-4 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} rounded-lg font-bold text-lg overflow-hidden text-white`}
              >
                <span className="relative z-10">Send Message</span>
                <Send className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-orange-600 to-red-600' : 'bg-gradient-to-r from-cyan-600 to-blue-600'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
