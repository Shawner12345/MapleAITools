import React, { useEffect, useRef } from 'react';
import { GraduationCap, Workflow, Lightbulb, Users } from 'lucide-react';

const services = [
  {
    icon: GraduationCap,
    title: "AI Training Workshops",
    description: "Transform your team with hands-on AI training sessions tailored to your industry needs.",
    color: "from-orange-500/20 to-orange-500/10",
    borderColor: "border-orange-500/20",
    iconColor: "text-orange-500"
  },
  {
    icon: Workflow,
    title: "Process Optimization",
    description: "Streamline your workflows with AI-powered solutions that drive efficiency and growth.",
    color: "from-blue-500/20 to-blue-500/10",
    borderColor: "border-blue-500/20",
    iconColor: "text-blue-500"
  },
  {
    icon: Lightbulb,
    title: "Strategic AI Planning",
    description: "Develop a comprehensive roadmap for integrating AI into your business operations.",
    color: "from-green-500/20 to-green-500/10",
    borderColor: "border-green-500/20",
    iconColor: "text-green-500"
  },
  {
    icon: Users,
    title: "Team Coaching",
    description: "Ongoing support and mentoring to ensure successful AI adoption across your organization.",
    color: "from-purple-500/20 to-purple-500/10",
    borderColor: "border-purple-500/20",
    iconColor: "text-purple-500"
  }
];

export default function StackingCards() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardsRef.current.filter((card): card is HTMLDivElement => card !== null);
    let frameId: number;
    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - previousScrollY;
      previousScrollY = scrollY;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const centerY = window.innerHeight / 2;
        const cardCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(centerY - cardCenterY);
        const maxDistance = window.innerHeight / 2;
        const progress = 1 - Math.min(distance / maxDistance, 1);

        // Parallax effect
        const parallaxOffset = delta * 0.1 * (index + 1);
        const scale = 0.95 + (0.05 * progress);
        const translateY = 100 * (1 - progress);

        card.style.transform = `
          perspective(1000px)
          translateY(${translateY}px)
          scale(${scale})
          rotateX(${(1 - progress) * 10}deg)
        `;
        card.style.opacity = (0.4 + (0.6 * progress)).toString();
      });

      frameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-32 text-brand-dark">
          Our Services
        </h2>
        
        <div className="relative min-h-[200vh]">
          <div className="sticky top-32 space-y-8">
            {services.map((service, index) => (
              <div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className={`
                  p-8 rounded-2xl backdrop-blur-xl
                  border bg-gradient-to-br
                  ${service.color} ${service.borderColor}
                  transition-all duration-300 ease-out
                `}
              >
                <service.icon className={`w-12 h-12 mb-6 ${service.iconColor}`} />
                <h3 className="text-2xl font-bold mb-4 text-brand-dark">
                  {service.title}
                </h3>
                <p className="text-lg text-brand-dark/60">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}