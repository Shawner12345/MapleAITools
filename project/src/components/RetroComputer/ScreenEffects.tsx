import React from 'react';

export default function ScreenEffects() {
  return (
    <>
      {/* Screen Glare Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent transform rotate-45" />
      
      {/* Scanlines Effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent bg-repeat-y" 
        style={{ backgroundSize: '100% 4px' }} 
      />
    </>
  );
}