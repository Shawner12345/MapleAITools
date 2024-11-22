import React from 'react';
import { Gift } from 'lucide-react';

interface HeroProps {
  setActiveComponent: (component: string | null) => void;
}

const Hero: React.FC<HeroProps> = ({ setActiveComponent }) => {
  const ornaments = [
    { color: '#ff4444', left: '10%', top: '20%' },
    { color: '#4CAF50', right: '15%', top: '15%' },
    { color: '#FFD700', left: '20%', bottom: '30%' },
    { color: '#E91E63', right: '25%', bottom: '25%' },
    { color: '#2196F3', left: '85%', top: '40%' },
    { color: '#9C27B0', left: '35%', top: '10%' },
    { color: '#FF9800', right: '40%', top: '35%' },
    { color: '#00BCD4', left: '75%', bottom: '40%' },
  ];

  return (
    <div className="relative overflow-hidden min-h-[60vh] bg-gradient-to-br from-red-900 via-red-800 to-green-900 rounded-[3rem] shadow-2xl">
      {/* Animated snow effect */}
      <div className="absolute inset-0 animate-snow">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1536' preserveAspectRatio='xMidYMax slice'%3E%3Cg fill='%23FFF' fill-opacity='0.1'%3E%3Cpath d='M55 42c-.8.8-1.3 1.7-1.3 2.8 0 1.1.5 2.1 1.3 2.8.8.8 1.7 1.3 2.8 1.3 1.1 0 2.1-.5 2.8-1.3.8-.8 1.3-1.7 1.3-2.8 0-1.1-.5-2.1-1.3-2.8-.8-.8-1.7-1.3-2.8-1.3-1.1 0-2 .5-2.8 1.3z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100% 100%'
        }} />
      </div>

      {/* Decorative light overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]" />
      
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M30 30l-4-4 4-4 4 4z'/%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.3
      }} />

      {/* Floating Ornaments */}
      {ornaments.map((ornament, index) => (
        <div
          key={index}
          className="ornament"
          style={{
            backgroundColor: ornament.color,
            left: ornament.left,
            right: ornament.right,
            top: ornament.top,
            bottom: ornament.bottom,
            boxShadow: `0 0 10px ${ornament.color}80`,
          }}
        />
      ))}

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-4xl">
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-gold-400 to-green-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <h1 className="relative text-4xl sm:text-6xl font-bold text-white mb-6 font-serif">
              Make This Christmas
              <span className="block text-gold-200 mt-4">Effortlessly Magical</span>
            </h1>
          </div>
          
          <p className="text-lg sm:text-xl text-gold-100 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Stress-free holiday planning with AI-powered personalized gifts, meals, and decoration ideas—all in one place
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setActiveComponent('GiftIdeas')}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_25px_rgba(22,163,74,0.5)] flex items-center justify-center gap-3 text-lg"
            >
              <Gift className="w-6 h-6" />
              <span>Try It Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;