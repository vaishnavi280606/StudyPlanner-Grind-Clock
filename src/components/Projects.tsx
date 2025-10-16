import { ExternalLink, Github } from 'lucide-react';

interface ProjectsProps {
  isDark: boolean;
}

export function Projects({ isDark }: ProjectsProps) {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description:
        'Full-stack e-commerce solution with payment integration, real-time inventory management, and advanced analytics dashboard.',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
      github: 'https://github.com/vaishnavijatavath/ecommerce',
      demo: 'https://ecommerce-demo.com',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      title: 'Task Management System',
      description:
        'Collaborative project management tool with real-time updates, team collaboration features, and deadline tracking.',
      tech: ['TypeScript', 'React', 'Firebase', 'Tailwind CSS'],
      github: 'https://github.com/vaishnavijatavath/taskmanager',
      demo: 'https://taskmanager-demo.com',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      title: 'Social Media Dashboard',
      description:
        'Analytics dashboard for tracking social media metrics across multiple platforms with data visualization and reporting.',
      tech: ['Next.js', 'Chart.js', 'MongoDB', 'Express'],
      github: 'https://github.com/vaishnavijatavath/social-dashboard',
      demo: 'https://social-dashboard-demo.com',
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      title: 'Code Snippet Manager',
      description:
        'Developer tool for organizing and sharing code snippets with syntax highlighting, tagging system, and search functionality.',
      tech: ['React', 'Supabase', 'Tailwind CSS', 'Monaco Editor'],
      github: 'https://github.com/vaishnavijatavath/snippet-manager',
      demo: 'https://snippet-manager-demo.com',
      image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ];

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4">
            <span className={`${isDark ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500' : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600'} bg-clip-text text-transparent`}>
              Projects
            </span>
          </h2>
          <div className={`w-32 h-1 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} mx-auto rounded-full`}></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`group ${isDark ? 'bg-gradient-to-br from-gray-900 to-black border-red-900/30 hover:border-orange-600/50' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-cyan-400'} border rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105`}
            >
              <div className="relative h-48 overflow-hidden">
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-black via-transparent to-transparent' : 'bg-gradient-to-t from-white via-transparent to-transparent'} z-10`}></div>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-6">
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} bg-clip-text text-transparent`}>
                  {project.title}
                </h3>
                <p className={`leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className={`px-3 py-1 ${isDark ? 'bg-black/50 border-gray-800' : 'bg-gray-100 border-gray-300'} border rounded-full text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700' : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400'} rounded-lg transition-all text-white`}
                  >
                    <Github size={18} />
                    <span className="font-semibold">Code</span>
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'} rounded-lg transition-all text-white`}
                  >
                    <ExternalLink size={18} />
                    <span className="font-semibold">Demo</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
