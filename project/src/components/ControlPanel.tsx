import React, { useState } from 'react';
import { GraduationCap, Lightbulb, Users, Workflow, ArrowRight } from 'lucide-react';

interface ControlPanelProps {
  isRetroStyle?: boolean;
}

export default function ControlPanel({ isRetroStyle = false }: ControlPanelProps) {
  const [activeService, setActiveService] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const services = [
    { 
      id: 1, 
      title: "AI Training", 
      description: "Comprehensive workshops and hands-on training sessions to empower your team with practical AI skills.",
      cta: "Book Training",
      ctaLink: "#contact",
      icon: GraduationCap,
      color: "orange",
      hint: "Click to explore our training programs" 
    },
    { 
      id: 2, 
      title: "Process Optimization", 
      description: "Expert analysis of your workflows to identify and implement AI-driven efficiency improvements.",
      cta: "Get Assessment",
      ctaLink: "#contact",
      icon: Workflow,
      color: "green",
      hint: "Click to learn about optimization" 
    },
    { 
      id: 3, 
      title: "Strategic Consulting", 
      description: "Develop a roadmap for AI integration that aligns with your business goals and capabilities.",
      cta: "Book Consultation",
      ctaLink: "#contact",
      icon: Lightbulb,
      color: "blue",
      hint: "Click for strategic planning" 
    },
    { 
      id: 4, 
      title: "Team Coaching", 
      description: "Ongoing mentorship and support to ensure successful AI adoption across your organization.",
      cta: "Start Coaching",
      ctaLink: "#contact",
      icon: Users,
      color: "purple",
      hint: "Click to explore coaching" 
    }
  ];

  const toggleButton = (id: number) => {
    setActiveService(activeService === id ? null : id);
    setHasInteracted(true);
  };

  const activeServiceData = services.find(service => service.id === activeService);

  const getButtonStyles = (service: any, isActive: boolean) => {
    if (isRetroStyle) {
      return isActive
        ? 'bg-gray-800 border-green-400'
        : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800/80';
    }
    return isActive
      ? `${service.color === 'orange' ? 'bg-orange-500 border-orange-400' : 
          service.color === 'green' ? 'bg-green-500 border-green-400' :
          service.color === 'blue' ? 'bg-blue-500 border-blue-400' :
          'bg-purple-500 border-purple-400'}`
      : 'border-gray-600 bg-gray-800 hover:bg-gray-700';
  };

  const getIconStyles = (isActive: boolean) => {
    return isActive 
      ? isRetroStyle ? 'text-green-400' : 'text-white'
      : 'text-gray-400';
  };

  const getTextStyles = (isActive: boolean) => {
    return isActive 
      ? isRetroStyle ? 'text-green-400' : 'text-white'
      : 'text-gray-400';
  };

  return (
    <section className={isRetroStyle ? '' : 'py-24 bg-black'}>
      <div className={`${isRetroStyle ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
        {!isRetroStyle && (
          <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
            Our Services
          </h2>
        )}
        
        <div className={`${isRetroStyle ? '' : 'bg-gray-900 p-8 rounded-lg shadow-xl max-w-4xl mx-auto'}`}>
          {/* Welcome Message */}
          {!hasInteracted && (
            <div className={`text-center mb-8 ${isRetroStyle ? 'p-6 bg-gray-800/50' : 'bg-gray-800 p-6'} rounded-lg border border-gray-700`}>
              <h3 className={`text-2xl font-bold mb-3 ${isRetroStyle ? 'text-green-400 font-mono' : 'text-white'}`}>
                {isRetroStyle && <span className="text-green-400">&gt; </span>}
                {isRetroStyle ? 'System Interface Ready' : 'Explore Our AI Services'}
              </h3>
              <p className={isRetroStyle ? 'text-green-400 font-mono' : 'text-gray-300'}>
                {isRetroStyle ? 'SELECT SERVICE TO INITIALIZE...' : 'Discover how we can help transform your business through AI training and consulting'}
              </p>
              <div className={`mt-4 animate-bounce ${isRetroStyle ? 'text-green-400' : 'text-gray-400'}`}>
                <ArrowRight className="w-6 h-6 mx-auto transform rotate-90" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Control Panel */}
            <div className={`${isRetroStyle ? '' : 'bg-black'} p-6 rounded-lg relative`}>
              {/* Service Buttons */}
              <div className="grid grid-cols-2 gap-6 mb-12">
                {services.map((service) => (
                  <div key={service.id} className="relative group">
                    <button
                      onClick={() => toggleButton(service.id)}
                      className={`relative w-full h-24 rounded-lg border-2 ${getButtonStyles(service, activeService === service.id)} transition-all duration-300`}
                    >
                      <service.icon 
                        className={`w-8 h-8 mx-auto mb-2 ${getIconStyles(activeService === service.id)}`}
                      />
                      <div className={`text-sm ${getTextStyles(activeService === service.id)}`}>
                        {service.title}
                      </div>
                    </button>
                    
                    {/* Hover Hint */}
                    {activeService !== service.id && (
                      <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 ${
                        isRetroStyle 
                          ? 'bg-black/90 text-green-400 border border-green-400/30' 
                          : 'bg-gray-800 text-white'
                        } text-sm py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10`}>
                        {isRetroStyle ? `> ${service.hint}` : service.hint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Information Display */}
            <div className={`${isRetroStyle ? 'bg-black/50 backdrop-blur-sm border border-gray-800' : 'bg-gray-800'} p-6 rounded-lg`}>
              <div className="h-full flex items-center justify-center">
                {activeServiceData ? (
                  <div className={`${
                    isRetroStyle 
                      ? 'p-4 rounded-lg border border-green-400/30' 
                      : 'bg-gray-900 p-6 rounded-lg border-l-4 border-r-4'
                    } hover:shadow-lg transition-shadow duration-300 w-full`}
                    style={!isRetroStyle ? {
                      borderLeftColor: activeServiceData.color === 'orange' ? '#f97316' : 
                                     activeServiceData.color === 'green' ? '#22c55e' :
                                     activeServiceData.color === 'blue' ? '#3b82f6' : 
                                     '#a855f7',
                      borderRightColor: activeServiceData.color === 'orange' ? '#f97316' : 
                                      activeServiceData.color === 'green' ? '#22c55e' :
                                      activeServiceData.color === 'blue' ? '#3b82f6' : 
                                      '#a855f7'
                    } : {}}>
                    <div className="flex items-center gap-3 mb-4">
                      <activeServiceData.icon className={
                        isRetroStyle ? 'w-6 h-6 text-green-400' :
                        `w-6 h-6 ${
                          activeServiceData.color === 'orange' ? 'text-orange-500' :
                          activeServiceData.color === 'green' ? 'text-green-500' :
                          activeServiceData.color === 'blue' ? 'text-blue-500' :
                          'text-purple-500'
                        }`
                      } />
                      <h3 className={`text-xl font-bold ${isRetroStyle ? 'text-green-400 font-mono' : 'text-white'}`}>
                        {isRetroStyle && '> '}{activeServiceData.title}
                      </h3>
                    </div>
                    <p className={`mb-6 ${isRetroStyle ? 'text-green-400/80 font-mono' : 'text-gray-300'}`}>
                      {activeServiceData.description}
                    </p>
                    
                    <a
                      href={activeServiceData.ctaLink}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-transform duration-300 transform hover:scale-105 ${
                        isRetroStyle 
                          ? 'text-black bg-green-400 hover:bg-green-500 font-mono' 
                          : `text-white ${
                              activeServiceData.color === 'orange' ? 'bg-orange-500 hover:bg-orange-600' :
                              activeServiceData.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                              activeServiceData.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                              'bg-purple-500 hover:bg-purple-600'
                            }`
                      }`}
                    >
                      {isRetroStyle && '> '}{activeServiceData.cta}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <div className={isRetroStyle ? 'text-green-400 font-mono' : 'text-gray-400'}>
                    <p>{isRetroStyle ? '> SELECT SERVICE TO CONTINUE...' : 'Select a service to learn more'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}