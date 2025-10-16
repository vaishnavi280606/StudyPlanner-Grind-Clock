import { Briefcase, Calendar } from 'lucide-react';

interface ExperienceProps {
  isDark: boolean;
}

export function Experience({ isDark }: ExperienceProps) {
  const experiences = [
    {
      title: 'Senior Full Stack Developer',
      company: 'Tech Corp',
      period: '2023 - Present',
      description:
        'Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and implementing best practices.',
      achievements: [
        'Architected and deployed microservices infrastructure',
        'Improved application performance by 40%',
        'Led team of 5 developers on major projects',
      ],
    },
    {
      title: 'Full Stack Developer',
      company: 'Innovation Labs',
      period: '2021 - 2023',
      description:
        'Developed full-stack applications with modern frameworks and contributed to open-source projects.',
      achievements: [
        'Built RESTful APIs serving 100K+ daily requests',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Collaborated with cross-functional teams',
      ],
    },
    {
      title: 'Junior Developer',
      company: 'StartUp Inc',
      period: '2020 - 2021',
      description:
        'Started career building responsive web applications and learning industry best practices.',
      achievements: [
        'Developed 10+ responsive web applications',
        'Contributed to code reviews and documentation',
        'Learned modern development workflows',
      ],
    },
  ];

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4">
            <span className={`${isDark ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500' : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600'} bg-clip-text text-transparent`}>
              Experience
            </span>
          </h2>
          <div className={`w-32 h-1 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} mx-auto rounded-full`}></div>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`group ${isDark ? 'bg-gradient-to-br from-gray-900 to-black border-red-900/30 hover:border-orange-600/50' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-cyan-400'} border rounded-2xl p-8 transition-all duration-300`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div className="flex items-start gap-4 mb-4 md:mb-0">
                  <div className="relative">
                    <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                    <div className={`relative w-14 h-14 ${isDark ? 'bg-gradient-to-br from-red-600 to-orange-600' : 'bg-gradient-to-br from-blue-600 to-cyan-600'} rounded-xl flex items-center justify-center`}>
                      <Briefcase className="text-white" size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{exp.title}</h3>
                    <p className={`text-lg font-semibold ${isDark ? 'text-orange-500' : 'text-cyan-600'}`}>{exp.company}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Calendar size={18} />
                  <span className="font-medium">{exp.period}</span>
                </div>
              </div>

              <p className={`text-lg mb-6 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{exp.description}</p>

              <div className="space-y-3">
                {exp.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`w-2 h-2 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} rounded-full mt-2 flex-shrink-0`}></div>
                    <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{achievement}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
