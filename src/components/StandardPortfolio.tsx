import { useState, useEffect } from 'react';
import {
  Menu, X, Briefcase, GraduationCap, Music, Target,
  Heart, Mail, Github, Linkedin, ChevronDown, Award, Zap
} from 'lucide-react';

interface StandardPortfolioProps {
  onBack: () => void;
}

export default function StandardPortfolio({ onBack }: StandardPortfolioProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['home', 'about', 'education', 'experience', 'skills', 'interests', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={onBack} className="text-slate-700 hover:text-cyan-600 transition-colors font-semibold">
              ← Back to Choice
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-slate-700 hover:text-cyan-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Education', 'Experience', 'Skills', 'Interests', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`transition-colors ${
                    activeSection === item.toLowerCase()
                      ? 'text-cyan-600 font-semibold'
                      : 'text-slate-700 hover:text-cyan-600'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-4 py-4 space-y-3">
              {['Home', 'About', 'Education', 'Experience', 'Skills', 'Interests', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(56,189,248,0.1),transparent_50%)]"></div>
        <div className="text-center z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Sean Ogta Goh
          </h1>
          <p className="text-2xl md:text-3xl text-cyan-400 mb-4">
            Sustainable Infrastructure Engineer
          </p>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Specializing in Railway Engineering | Musician | Psychology Enthusiast
          </p>
          <button
            onClick={() => scrollToSection('about')}
            className="animate-bounce mt-8 text-white hover:text-cyan-400 transition-colors"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">About Me</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-2xl">
              <Zap className="w-12 h-12 text-cyan-600 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Engineering Excellence</h3>
              <p className="text-slate-700 leading-relaxed">
                With a diploma in Electrical Engineering (Power Engineering) and a degree in
                Sustainable Infrastructure Engineering (Land), I specialize in railway systems
                and sustainable infrastructure solutions. My technical expertise spans power
                systems, railway engineering, and sustainable development.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl">
              <Music className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Creative Expression</h3>
              <p className="text-slate-700 leading-relaxed">
                Beyond engineering, I'm a trained violinist with vocal and voice-over capabilities.
                Music provides a creative balance to my technical work, allowing me to approach
                problems from multiple perspectives and maintain a well-rounded skill set.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="education" className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Education</h2>
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-cyan-600">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Bachelor's Degree in Sustainable Infrastructure Engineering (Land)
                  </h3>
                  <p className="text-cyan-600 font-semibold">Railway Engineering Specialization</p>
                </div>
                <GraduationCap className="w-12 h-12 text-cyan-600 flex-shrink-0" />
              </div>
              <p className="text-slate-700 leading-relaxed">
                Advanced studies in sustainable infrastructure with a focus on railway systems,
                including track design, signaling, railway operations, and sustainable transport solutions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-emerald-600">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Diploma in Electrical Engineering
                  </h3>
                  <p className="text-emerald-600 font-semibold">Power Engineering Specialization</p>
                </div>
                <Award className="w-12 h-12 text-emerald-600 flex-shrink-0" />
              </div>
              <p className="text-slate-700 leading-relaxed">
                Comprehensive training in electrical systems, power generation, distribution,
                and control systems. Strong foundation in electrical principles and power engineering.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Professional Focus</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-6 rounded-2xl text-white">
              <Briefcase className="w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold mb-3">Railway Engineering</h3>
              <p className="text-cyan-100">
                Sustainable infrastructure design, railway systems, track engineering, and modern transport solutions.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-6 rounded-2xl text-white">
              <Zap className="w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold mb-3">Power Engineering</h3>
              <p className="text-emerald-100">
                Electrical systems design, power distribution, and control systems for infrastructure applications.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-2xl text-white">
              <Music className="w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold mb-3">Music & Media</h3>
              <p className="text-purple-100">
                Violin performance, vocal work, and voice-over services for various media projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Skills & Expertise</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Technical Skills</h3>
              <div className="space-y-4">
                {[
                  'Railway Systems & Infrastructure',
                  'Power Systems Design',
                  'Sustainable Engineering',
                  'Electrical Control Systems',
                  'Track & Signaling Design',
                  'Project Management'
                ].map((skill) => (
                  <div key={skill} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                    <p className="text-slate-700 font-semibold">{skill}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Creative & Personal Skills</h3>
              <div className="space-y-4">
                {[
                  'Violin Performance',
                  'Vocal & Voice-over Work',
                  'Psychology & Counseling',
                  'Communication & Advisory',
                  'Problem Solving',
                  'Interdisciplinary Thinking'
                ].map((skill) => (
                  <div key={skill} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                    <p className="text-slate-700 font-semibold">{skill}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="interests" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Interests & Passions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-6 rounded-2xl text-white text-center">
              <Target className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Motorsports</h3>
              <p className="text-sm text-red-100">Speed, precision, and engineering excellence</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-yellow-500 p-6 rounded-2xl text-white text-center">
              <Target className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Archery</h3>
              <p className="text-sm text-amber-100">Focus, discipline, and accuracy</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl text-white text-center">
              <Music className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Music</h3>
              <p className="text-sm text-purple-100">Violin, vocals, and creative expression</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl text-white text-center">
              <Heart className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Psychology</h3>
              <p className="text-sm text-blue-100">Supporting and advising others</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Let's Connect</h2>
          <p className="text-xl text-slate-300 mb-12">
            I'm always open to discussing new projects, opportunities, or just having a chat about
            engineering, music, or motorsports.
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://www.linkedin.com/in/sean-ogta-goh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a
              href="mailto:your.email@example.com"
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 py-8 text-center text-slate-400">
        <p>&copy; 2025 Sean Ogta Goh. All rights reserved.</p>
      </footer>
    </div>
  );
}
