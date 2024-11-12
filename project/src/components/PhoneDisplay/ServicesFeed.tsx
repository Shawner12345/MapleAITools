import React, { useRef, useEffect } from 'react';
import { GraduationCap, Lightbulb, Users, Workflow, Heart, MessageCircle, Repeat } from 'lucide-react';

const services = [
  {
    icon: GraduationCap,
    title: "AI Training Workshops",
    description: "Hands-on training sessions that teach your team how to effectively use AI tools in their daily work.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655"
  },
  {
    icon: Workflow,
    title: "Workflow Optimization",
    description: "Expert analysis and optimization of your business processes using AI-powered solutions.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978"
  },
  {
    icon: Lightbulb,
    title: "Strategic AI Planning",
    description: "Develop a comprehensive roadmap for integrating AI into your business operations.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978"
  },
  {
    icon: Users,
    title: "Team Coaching",
    description: "Ongoing support and mentoring to ensure your team successfully adopts AI tools and practices.",
    image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd"
  }
];

export default function ServicesFeed() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card) => observerRef.current?.observe(card));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="h-[900px] overflow-y-auto scrollbar-hide">
      {services.map((service, index) => (
        <div
          key={index}
          className="service-card opacity-0 translate-y-8 transition-all duration-700 ease-out p-6 border-b border-gray-800"
        >
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            {/* Service Image */}
            <div className="relative h-72">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <service.icon className="absolute bottom-6 left-6 w-12 h-12 text-white" />
            </div>

            {/* Service Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 text-base">{service.description}</p>
              
              {/* Engagement Metrics */}
              <div className="mt-6 flex items-center gap-6 text-gray-500 text-base">
                <span className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  {Math.floor(Math.random() * 1000)}
                </span>
                <span className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {Math.floor(Math.random() * 100)}
                </span>
                <span className="flex items-center gap-2">
                  <Repeat className="h-5 w-5" />
                  {Math.floor(Math.random() * 500)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}