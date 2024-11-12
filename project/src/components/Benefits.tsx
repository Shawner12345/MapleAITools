import React from 'react';
import { GraduationCap, Lightbulb, TrendingUp, Users } from 'lucide-react';

const benefits = [
  {
    icon: GraduationCap,
    title: "Expert Training",
    description: "Hands-on workshops and training sessions that empower your team to leverage AI tools effectively."
  },
  {
    icon: Lightbulb,
    title: "Strategic Consulting",
    description: "Identify high-impact opportunities for AI integration and develop actionable implementation plans."
  },
  {
    icon: TrendingUp,
    title: "Quick Wins",
    description: "Focus on immediate, practical improvements while building towards long-term AI transformation."
  },
  {
    icon: Users,
    title: "Team Enablement",
    description: "Build internal AI capabilities through mentoring and ongoing support for sustainable growth."
  }
];

export default function Benefits() {
  return (
    <section id="benefits" className="relative py-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa"
          alt="Technology Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/95 via-brand-primary/90 to-brand-primary/95" />
      </div>

      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-brand-accent/20 to-transparent rounded-full blur-3xl animate-slow-spin" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-brand-accent/10 to-transparent rounded-full blur-3xl animate-slow-spin-reverse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 text-white">
          Why Choose Our AI Consulting?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group relative p-8 rounded-2xl bg-white/10 backdrop-blur-lg hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-accent/20 to-brand-accent/30 flex items-center justify-center mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[360deg]">
                  <benefit.icon className="w-7 h-7 text-brand-accent transform transition-transform duration-500" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-brand-accent transition-colors duration-300">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  {benefit.description}
                </p>
              </div>

              {/* Animated Border Glow */}
              <div className="absolute inset-px rounded-2xl bg-gradient-to-r from-brand-accent/0 via-brand-accent/0 to-brand-accent/0 group-hover:via-brand-accent/20 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}