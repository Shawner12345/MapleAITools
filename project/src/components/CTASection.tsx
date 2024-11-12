import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const benefits = [
  "Free initial consultation",
  "Customized training plan",
  "Practical implementation strategies",
  "Ongoing support and guidance"
];

export default function CTASection() {
  return (
    <section className="py-24 bg-brand-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-radial from-brand-accent to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-brand-light mb-6">
              Start Your AI Journey Today
            </h2>
            <p className="text-xl text-brand-secondary mb-8">
              Book your free strategy session and discover how AI can transform your business operations.
            </p>
            
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-brand-secondary">
                  <CheckCircle className="w-6 h-6 text-brand-accent flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
            
            <a 
              href="#contact"
              className="inline-flex items-center gap-2 bg-brand-accent text-brand-light px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition-all duration-300 group cta-pulse"
            >
              Book Your Free Session
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978" 
              alt="Team Collaboration" 
              className="rounded-xl shadow-2xl"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-brand-primary/40 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}