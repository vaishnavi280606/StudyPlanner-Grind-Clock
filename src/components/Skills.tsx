import { Code2, Database, Layout, Wrench, Cloud, TrendingUp } from 'lucide-react';

interface SkillsProps {
  isDark: boolean;
}

export function Skills({ isDark }: SkillsProps) {
  const skillCategories = [
    {
      icon: Code2,
      category: 'Frontend',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'Vue.js'],
    },
    {
      icon: Database,
      category: 'Backend',
      skills: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'MongoDB', 'REST APIs'],
    },
    {
      icon: Cloud,
      category: 'DevOps & Cloud',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Vercel'],
    },
    {
      icon: Layout,
      category: 'UI/UX',
      skills: ['Responsive Design', 'Figma', 'Animation', 'Accessibility', 'Design Systems'],
    },
    {
      icon: Wrench,
      category: 'Tools',
      skills: ['Git', 'VS Code', 'Postman', 'Jest', 'Webpack', 'Vite'],
    },
    {
      icon: TrendingUp,
      category: 'Soft Skills',
      skills: ['Problem Solving', 'Team Leadership', 'Communication', 'Agile', 'Mentoring'],
    },
  ];

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4">
            <span className={`${isDark ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500' : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600'} bg-clip-text text-transparent`}>
              Skills
            </span>
          </h2>
          <div className={`w-32 h-1 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} mx-auto rounded-full`}></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.category}
                className={`group ${isDark ? 'bg-gradient-to-br from-gray-900 to-black border-red-900/30 hover:border-orange-600/50' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-cyan-400'} border rounded-2xl p-8 transition-all duration-300 hover:scale-105`}
              >
                <div className="relative mb-6">
                  <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                  <div className={`relative w-16 h-16 ${isDark ? 'bg-gradient-to-br from-red-600 to-orange-600' : 'bg-gradient-to-br from-blue-600 to-cyan-600'} rounded-2xl flex items-center justify-center`}>
                    <Icon className="text-white" size={32} />
                  </div>
                </div>

                <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} bg-clip-text text-transparent`}>
                  {category.category}
                </h3>

                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <div
                      key={skill}
                      className={`flex items-center gap-3 p-3 ${isDark ? 'bg-black/50 border-gray-800 hover:border-red-900/50' : 'bg-white border-gray-200 hover:border-blue-300'} border rounded-lg transition-all`}
                    >
                      <div className={`w-2 h-2 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} rounded-full`}></div>
                      <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
