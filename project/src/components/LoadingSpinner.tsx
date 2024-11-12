import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
        <div className="absolute inset-0 rounded-full border-2 border-brand-accent/20"></div>
      </div>
      <p className="text-gray-600">Loading Maple AI Tools...</p>
      <p className="text-sm text-gray-500">This may take a few moments</p>
    </div>
  );
}