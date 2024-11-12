import React from 'react';
import { GraduationCap, Lightbulb, Users, Workflow, ArrowRight } from 'lucide-react';
import { useServiceContext } from '../context/ServiceContext';

export const services = [
  {
    id: 'training',
    icon: GraduationCap,
    title: "AI Training Programs",
    description: "Comprehensive training sessions tailored for both businesses and individuals, from beginner to advanced levels.",
    benefits: [
      "Personalized learning paths",
      "Hands-on practice sessions",
      "Real-world applications"
    ]
  },
  {
    id: 'workflow',
    icon: Workflow,
    title: "Workflow Optimization",
    description: "Expert analysis and optimization of your processes using AI-powered solutions.",
    benefits: [
      "Process efficiency analysis",
      "AI integration planning",
      "ROI-focused improvements"
    ]
  },
  {
    id: 'strategy',
    icon: Lightbulb,
    title: "Strategic AI Planning",
    description: "Develop a comprehensive roadmap for integrating AI into your work or business operations.",
    benefits: [
      "Custom AI roadmap",
      "Risk assessment",
      "Implementation timeline"
    ]
  },
  {
    id: 'coaching',
    icon: Users,
    title: "Personal & Team Coaching",
    description: "One-on-one mentoring and team coaching to ensure successful AI adoption and skill development.",
    benefits: [
      "Individual attention",
      "Progress tracking",
      "Ongoing support"
    ]
  }
];

export default function Services() {
  const { selectedServices, toggleService } = useServiceContext();

  return (
    <section id="services" className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-brand-dark">AI Training & Consulting for Everyone</h2>
          <p className="text-lg text-brand-dark/60 mt-2">Select a service below to learn more about how we can help transform your business with AI</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className={`group relative p-8 rounded-xl bg-white border transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer
                ${selectedServices.includes(service.id) 
                  ? 'border-brand-accent ring-2 ring-brand-accent/20' 
                  : 'border-brand-primary/10 hover:border-brand-accent/40'}`}
              onClick={() => toggleService(service.id)}
            >
              <div className="absolute top-4 right-4">
                <div className={`w-6 h-6 rounded border-2 transition-all duration-300 flex items-center justify-center
                  ${selectedServices.includes(service.id)
                    ? 'border-brand-accent bg-brand-accent/10'
                    : 'border-gray-300'}`}
                >
                  {selectedServices.includes(service.id) && (
                    <svg className="w-4 h-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-brand-accent/10 text-brand-accent">
                  <service.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-brand-dark group-hover:text-brand-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-brand-dark/60 mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-brand-dark/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <a 
                href="#contact" 
                className="mt-6 inline-flex items-center gap-2 text-brand-accent hover:text-brand-accent/80 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Learn more
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}