// src/components/LandingChoice.tsx

import { Car, BookOpen, Sparkles, Layers } from 'lucide-react'; // <-- 1. Import a new icon
import { useState } from 'react';

interface LandingChoiceProps {
  // 2. Add 'scroll' to the onChoose type
  onChoose: (mode: 'standard' | '3d' | 'scroll') => void;
}

export default function LandingChoice({ onChoose }: LandingChoiceProps) {
  // 3. Add 'scroll' to the hover type
  const [hoveredCard, setHoveredCard] = useState<'standard' | '3d' | 'scroll' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* ... (your background elements) ... */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ... (your header) ... */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-cyan-400 mr-3" />
            <h1 className="text-5xl md:text-7xl font-bold text-white">
              Sean Ogta Goh
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-slate-300 mb-2">
            Engineer • Musician • Advisor
          </p>
          <p className="text-lg text-slate-400">
            Choose Your Experience
          </p>
        </div>

        {/* 4. Change grid-cols-2 to grid-cols-3 */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          
          {/* Button 1: Standard (No change) */}
          <button
            onClick={() => onChoose('standard')}
            onMouseEnter={() => setHoveredCard('standard')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 border border-slate-700 hover:border-cyan-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors duration-300">
                <BookOpen className={`w-10 h-10 text-cyan-400 transition-transform duration-500 ${hoveredCard === 'standard' ? 'rotate-12 scale-110' : ''}`} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                Guided Tour
              </h2>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Experience a traditional portfolio journey with detailed sections,
                smooth navigation, and comprehensive insights.
              </p>
              <div className="flex items-center text-cyan-400 font-semibold">
                <span className="mr-2">Explore the classic way</span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-2">→</span>
              </div>
            </div>
          </button>

          {/* Button 2: 3D (No change) */}
          <button
            onClick={() => onChoose('3d')}
            onMouseEnter={() => setHoveredCard('3d')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 border border-slate-700 hover:border-emerald-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors duration-300">
                <Car className={`w-10 h-10 text-emerald-400 transition-transform duration-500 ${hoveredCard === '3d' ? 'rotate-12 scale-110' : ''}`} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">
                3D Playground
              </h2>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Drive through an interactive 3D open-world experience.
                Discover my portfolio in an immersive, game-like environment.
              </p>
              <div className="flex items-center text-emerald-400 font-semibold">
                <span className="mr-2">Take the wheel</span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-2">→</span>
              </div>
            </div>
          </button>

          {/* 5. ADD THIS NEW BUTTON */}
          <button
            onClick={() => onChoose('scroll')}
            onMouseEnter={() => setHoveredCard('scroll')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 border border-slate-700 hover:border-purple-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors duration-300">
                <Layers className={`w-10 h-10 text-purple-400 transition-transform duration-500 ${hoveredCard === 'scroll' ? 'rotate-12 scale-110' : ''}`} />
              </div>

              <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                Scroll Experience
              </h2>

              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                An animated "scrollytelling" journey that blends
                a 3D background with a guided HTML-based story.
              </p>

              <div className="flex items-center text-purple-400 font-semibold">
                <span className="mr-2">Start scrolling</span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-2">→</span>
              </div>
            </div>
          </button>

        </div>
        
        <div className="text-center mt-12 text-slate-400 text-sm">
          <p>All experiences showcase the same core content, just in different ways</p>
        </div>
      </div>
    </div>
  );
}
