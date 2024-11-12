import React, { useEffect, useRef } from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function ProgressRing({ 
  progress, 
  size = 44, 
  strokeWidth = 3,
  className = ''
}: ProgressRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = offset.toString();
    }
  }, [offset]);

  return (
    <svg className={`transform -rotate-90 ${className}`} width={size} height={size}>
      {/* Background circle */}
      <circle
        className="text-gray-700"
        stroke="currentColor"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress circle */}
      <circle
        ref={circleRef}
        className="text-blue-500 transition-all duration-300"
        stroke="currentColor"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
}