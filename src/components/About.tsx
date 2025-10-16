import { Code2, Sparkles, Target, Rocket } from 'lucide-react';

interface AboutProps {
  isDark: boolean;
}

export function About({ isDark }: AboutProps) {
  const highlights = [
    {
      icon: Code2,
      title: 'Clean Code',
      description: 'Writing maintainable and scalable solutions',
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'Exploring cutting-edge technologies',
    },
    {
      icon: Target,
      title: 'Problem Solving',
      description: 'Tackling complex challenges with elegant solutions',
    },
    {
      icon: Rocket,
      title: 'Performance',
      description: 'Optimizing for speed and efficiency',
    },
  ];

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4">
            <span className={`${isDark ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500' : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600'} bg-clip-text text-transparent`}>
              About Me
            </span>
          </h2>
          <div className={`w-32 h-1 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} mx-auto rounded-full`}></div>
        </div>

        <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-black border-red-900/30' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} border rounded-3xl p-8 md:p-12 mb-12`}>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-6`}>
            I'm a passionate full-stack developer with a love for creating elegant solutions to complex problems.
            My journey in tech is driven by curiosity and a constant desire to learn and grow.
          </p>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-6`}>
            With expertise in modern web technologies and a strong foundation in data structures and algorithms,
            I build applications that are not only functional but also performant and user-friendly.
          </p>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
            When I'm not coding, you'll find me solving algorithmic challenges on competitive programming platforms
            or exploring new frameworks and tools to add to my tech stack.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`group ${isDark ? 'bg-gradient-to-br from-gray-900 to-black border-red-900/30 hover:border-orange-600/50' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-cyan-400'} border rounded-2xl p-8 transition-all duration-300 hover:scale-105`}
              >
                <div className="relative mb-4">
                  <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                  <div className={`relative w-16 h-16 ${isDark ? 'bg-gradient-to-br from-red-600 to-orange-600' : 'bg-gradient-to-br from-blue-600 to-cyan-600'} rounded-2xl flex items-center justify-center`}>
                    <Icon className="text-white" size={32} />
                  </div>
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} bg-clip-text text-transparent`}>
                  {item.title}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg leading-relaxed`}>{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
