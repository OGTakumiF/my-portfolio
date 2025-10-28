import { useState, useEffect, useRef } from 'react';
import { Car, Info, Trophy, Music, Zap, Target, Heart, X } from 'lucide-react';

interface Playground3DProps {
  onBack: () => void;
}

interface CarPosition {
  x: number;
  y: number;
  rotation: number;
}

interface InfoPoint {
  id: string;
  x: number;
  y: number;
  title: string;
  icon: any;
  color: string;
  content: string;
  category: string;
}

export default function Playground3D({ onBack }: Playground3DProps) {
  const [carPosition, setCarPosition] = useState<CarPosition>({ x: 50, y: 50, rotation: 0 });
  const [speed, setSpeed] = useState(0);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [selectedInfo, setSelectedInfo] = useState<InfoPoint | null>(null);
  const [discoveredPoints, setDiscoveredPoints] = useState<Set<string>>(new Set());
  const [showControls, setShowControls] = useState(true);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());

  const infoPoints: InfoPoint[] = [
    {
      id: '1',
      x: 20,
      y: 20,
      title: 'Railway Engineering',
      icon: Zap,
      color: 'from-cyan-500 to-blue-500',
      content: 'Specializing in Sustainable Infrastructure Engineering (Land) with expertise in railway systems, track design, signaling, and modern transport solutions.',
      category: 'Engineering'
    },
    {
      id: '2',
      x: 80,
      y: 20,
      title: 'Power Systems',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      content: 'Diploma in Electrical Engineering with Power Engineering specialization. Expert in electrical systems design, power distribution, and control systems.',
      category: 'Engineering'
    },
    {
      id: '3',
      x: 20,
      y: 80,
      title: 'Music & Performance',
      icon: Music,
      color: 'from-purple-500 to-pink-500',
      content: 'Trained violinist with vocal capabilities and voice-over experience. Music provides creative balance and interdisciplinary perspective to technical work.',
      category: 'Creative'
    },
    {
      id: '4',
      x: 80,
      y: 80,
      title: 'Psychology & Advisory',
      icon: Heart,
      color: 'from-rose-500 to-red-500',
      content: 'Passionate about psychology and helping others. Regularly advise friends, family, and anyone seeking guidance on personal and professional matters.',
      category: 'Personal'
    },
    {
      id: '5',
      x: 50,
      y: 35,
      title: 'Motorsports Enthusiast',
      icon: Car,
      color: 'from-red-600 to-orange-600',
      content: 'Deep interest in motorsports, combining technical engineering knowledge with high-performance vehicle dynamics and racing strategy.',
      category: 'Interests'
    },
    {
      id: '6',
      x: 35,
      y: 50,
      title: 'Archery',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      content: 'Practice archery for focus, discipline, and precision. The mental discipline translates well into engineering problem-solving.',
      category: 'Interests'
    },
    {
      id: '7',
      x: 65,
      y: 50,
      title: 'Achievements',
      icon: Trophy,
      color: 'from-amber-500 to-yellow-500',
      content: 'Multi-disciplinary engineer with dual qualifications in Electrical and Sustainable Infrastructure Engineering. Active musician and community advisor.',
      category: 'About'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTimeRef.current) / 16;
      lastTimeRef.current = now;

      setCarPosition(prev => {
        let newSpeed = speed;
        let newRotation = prev.rotation;
        let newX = prev.x;
        let newY = prev.y;

        if (keys.has('arrowup') || keys.has('w')) {
          newSpeed = Math.min(speed + 0.2 * delta, 5);
        } else if (keys.has('arrowdown') || keys.has('s')) {
          newSpeed = Math.max(speed - 0.2 * delta, -3);
        } else {
          newSpeed = speed * 0.95;
        }

        if (Math.abs(newSpeed) > 0.1) {
          if (keys.has('arrowleft') || keys.has('a')) {
            newRotation -= 3 * delta * (newSpeed > 0 ? 1 : -1);
          }
          if (keys.has('arrowright') || keys.has('d')) {
            newRotation += 3 * delta * (newSpeed > 0 ? 1 : -1);
          }
        }

        const radians = (newRotation * Math.PI) / 180;
        newX += Math.sin(radians) * newSpeed * 0.5 * delta;
        newY -= Math.cos(radians) * newSpeed * 0.5 * delta;

        newX = Math.max(5, Math.min(95, newX));
        newY = Math.max(5, Math.min(95, newY));

        setSpeed(newSpeed);

        infoPoints.forEach(point => {
          const distance = Math.sqrt(
            Math.pow(newX - point.x, 2) + Math.pow(newY - point.y, 2)
          );
          if (distance < 8 && !discoveredPoints.has(point.id)) {
            setDiscoveredPoints(prev => new Set(prev).add(point.id));
            setSelectedInfo(point);
          }
        });

        return { x: newX, y: newY, rotation: newRotation };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [keys, speed, discoveredPoints]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-white hover:text-cyan-400 transition-colors font-semibold"
          >
            ← Back to Choice
          </button>
          <div className="flex items-center space-x-6">
            <div className="text-white text-sm">
              <span className="text-cyan-400 font-semibold">{discoveredPoints.size}</span>
              <span className="text-slate-400"> / {infoPoints.length} Discovered</span>
            </div>
            <button
              onClick={() => setShowControls(!showControls)}
              className="text-white hover:text-cyan-400 transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {showControls && (
        <div className="fixed top-20 left-4 z-30 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4 text-white max-w-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Controls</h3>
            <button onClick={() => setShowControls(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm text-slate-300">
            <p><strong>W / ↑</strong> - Accelerate</p>
            <p><strong>S / ↓</strong> - Brake / Reverse</p>
            <p><strong>A / ←</strong> - Turn Left</p>
            <p><strong>D / →</strong> - Turn Right</p>
            <p className="text-cyan-400 text-xs mt-3">Drive near markers to discover information!</p>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-30 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg px-4 py-2">
        <div className="text-white text-sm">
          <span className="text-slate-400">Speed: </span>
          <span className={`font-bold ${speed > 3 ? 'text-red-400' : speed > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
            {Math.abs(speed).toFixed(1)} {speed < -0.1 ? '(Reverse)' : ''}
          </span>
        </div>
      </div>

      <div className="relative w-full h-screen pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.05),transparent_70%)]"></div>

        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(100,100,100,0.2) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

        {infoPoints.map(point => (
          <div
            key={point.id}
            className="absolute transition-all duration-300"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className={`relative ${discoveredPoints.has(point.id) ? 'scale-110' : ''}`}>
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${point.color} ${discoveredPoints.has(point.id) ? 'animate-pulse' : ''} flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform`}
                onClick={() => setSelectedInfo(point)}
              >
                <point.icon className="w-8 h-8 text-white" />
              </div>
              {!discoveredPoints.has(point.id) && (
                <div className="absolute inset-0 rounded-full bg-slate-700/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse"></div>
                </div>
              )}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-white text-xs font-semibold bg-slate-800/80 px-2 py-1 rounded">
                  {point.title}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div
          className="absolute transition-all duration-100"
          style={{
            left: `${carPosition.x}%`,
            top: `${carPosition.y}%`,
            transform: `translate(-50%, -50%) rotate(${carPosition.rotation}deg)`,
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-xl animate-pulse"></div>
            <Car className="w-12 h-12 text-cyan-400 relative z-10 drop-shadow-lg" />
          </div>
        </div>
      </div>

      {selectedInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedInfo(null)}>
          <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full border border-slate-700 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedInfo.color} flex items-center justify-center`}>
                  <selectedInfo.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{selectedInfo.title}</h2>
                  <span className="text-sm text-cyan-400">{selectedInfo.category}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedInfo(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed">
              {selectedInfo.content}
            </p>
            {discoveredPoints.has(selectedInfo.id) && (
              <div className="mt-6 flex items-center text-emerald-400 text-sm">
                <Trophy className="w-4 h-4 mr-2" />
                <span>Discovered!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
