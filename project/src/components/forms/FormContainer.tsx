import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import ProgressRing from './ProgressRing';

interface FormContainerProps {
  children: React.ReactNode;
  isSubmitting: boolean;
  progress?: number;
  className?: string;
  isGlowing?: boolean;
}

export default function FormContainer({ 
  children, 
  isSubmitting, 
  progress = 0,
  className,
  isGlowing = false
}: FormContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createRipple = (e: MouseEvent) => {
      const ripple = document.createElement('span');
      const rect = container.getBoundingClientRect();
      
      const size = Math.max(container.offsetWidth, container.offsetHeight);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.className = 'ripple';
      
      container.appendChild(ripple);
      
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    };

    container.addEventListener('click', createRipple);
    
    return () => {
      container.removeEventListener('click', createRipple);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "form-container bg-white rounded-2xl p-8 shadow-lg border border-gray-200 transition-all duration-300 relative",
        isGlowing && "animate-form-glow",
        className
      )}
    >
      <div className="absolute top-4 right-4">
        <ProgressRing progress={progress} />
      </div>
      {children}
    </div>
  );
}