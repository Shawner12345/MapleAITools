import React from 'react';
import { ArrowRight } from 'lucide-react';
import TypewriterText from './TypewriterText';

export default function Hero() {
  const aiTerms = [
    "Training",
    "Strategy",
    "Growth",
    "Success",
    "Excellence"
  ];

  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655" 
          alt="Team Workshop" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/95 via-brand-primary/85 to-brand-primary/50"></div>
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-brand-light mb-6">
            Empower Your Future with AI{' '}
            <span className="inline-block">
              <TypewriterText words={aiTerms} />
            </span>
          </h1>
          <p className="text-xl text-brand-secondary mb-8">
            Whether you're a business looking to transform your team or an individual seeking to master AI tools, 
            we provide hands-on training and strategic consulting to help you thrive in the AI era.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#contact" 
              className="inline-flex items-center justify-center gap-2 bg-brand-accent text-brand-light px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-300 group cta-pulse"
            >
              Book a Strategy Session
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#case-studies" 
              className="inline-flex items-center justify-center gap-2 bg-brand-light/10 text-brand-light px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-light/20 transition-all duration-300 border-2 border-brand-light/20"
            >
              View Success Stories
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}