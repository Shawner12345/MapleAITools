import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { caseStudies } from '../data/caseStudies';

export default function CaseStudies() {
  const featuredCaseStudies = caseStudies.slice(0, 3);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cards = container.getElementsByClassName('case-study-card');
      const containerRect = container.getBoundingClientRect();
      
      Array.from(cards).forEach((card) => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        const deltaX = (e.clientX - cardCenterX) / 30;
        const deltaY = (e.clientY - cardCenterY) / 30;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - cardCenterX, 2) + 
          Math.pow(e.clientY - cardCenterY, 2)
        );
        
        const maxDistance = Math.sqrt(
          Math.pow(containerRect.width, 2) + 
          Math.pow(containerRect.height, 2)
        );
        
        const intensity = 1 - (distance / maxDistance);
        
        cardElement.style.transform = `
          perspective(1000px)
          rotateX(${deltaY * intensity}deg)
          rotateY(${-deltaX * intensity}deg)
          translateZ(10px)
        `;
      });
    };

    const handleMouseLeave = () => {
      const cards = container.getElementsByClassName('case-study-card');
      Array.from(cards).forEach((card) => {
        const cardElement = card as HTMLElement;
        cardElement.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section id="case-studies" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          Client Success Stories
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCaseStudies.map((study, index) => (
            <Link
              key={study.id}
              to={`/case-studies/${study.id}`}
              className="case-study-card group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
              style={{ 
                transformStyle: 'preserve-3d',
                transitionDelay: `${index * 100}ms`
              }}
            >
              <div className="aspect-[4/3] relative">
                <img 
                  src={study.image} 
                  alt={study.company}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform duration-500">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      {study.company}
                    </h3>
                    <p className="text-brand-accent font-semibold mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {study.metrics.improvement}
                    </p>
                    <p className="text-gray-300 mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      {study.challenge}
                    </p>
                    <div className="inline-flex items-center text-brand-accent group/link">
                      Read full case study 
                      <ArrowRight className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover/link:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated border */}
              <div className="absolute inset-0 border-2 border-brand-accent/0 group-hover:border-brand-accent/50 rounded-2xl transition-colors duration-500" />
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16">
                <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-brand-accent/0 to-brand-accent/50 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 delay-100" />
                <div className="absolute top-0 left-0 h-px w-8 bg-gradient-to-r from-brand-accent/0 to-brand-accent/50 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700 delay-100" />
              </div>
              
              <div className="absolute bottom-0 right-0 w-16 h-16">
                <div className="absolute bottom-0 right-0 w-px h-8 bg-gradient-to-t from-brand-accent/0 to-brand-accent/50 transform translate-x-full group-hover:translate-x-0 transition-transform duration-700 delay-100" />
                <div className="absolute bottom-0 right-0 h-px w-8 bg-gradient-to-l from-brand-accent/0 to-brand-accent/50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 delay-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}