import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MagneticButtonProps {
  isSubmitting: boolean;
  className?: string;
  onButtonClick?: () => void;
}

export default function MagneticButton({ isSubmitting, className, onButtonClick }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const boundingRef = useRef<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    observer.observe(button);

    const handleMouseMove = (e: MouseEvent) => {
      if (!boundingRef.current) {
        boundingRef.current = button.getBoundingClientRect();
      }

      const x = e.clientX - boundingRef.current.left;
      const y = e.clientY - boundingRef.current.top;
      
      const centerX = boundingRef.current.width / 2;
      const centerY = boundingRef.current.height / 2;
      
      const deltaX = (x - centerX) / 8;
      const deltaY = (y - centerY) / 8;

      button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    const handleMouseLeave = () => {
      button.style.transform = 'translate(0, 0)';
      boundingRef.current = null;
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <button
      ref={buttonRef}
      type="submit"
      disabled={isSubmitting}
      onClick={handleClick}
      className={cn(
        "w-full flex items-center justify-center gap-2 bg-brand-accent text-brand-light px-8 py-4",
        "rounded-lg text-lg font-semibold transition-all duration-300",
        "hover:bg-opacity-90 hover:scale-[1.02]",
        "active:scale-[0.98]",
        "disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed disabled:transform-none",
        isVisible && "cta-pulse",
        className
      )}
    >
      {isSubmitting ? 'Sending...' : 'Get Your Free Consultation'}
      <Send className={`w-5 h-5 transition-transform duration-300 ${isSubmitting ? 'translate-x-1' : ''}`} />
    </button>
  );
}