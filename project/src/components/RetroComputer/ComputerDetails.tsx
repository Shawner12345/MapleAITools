import React from 'react';

export default function ComputerDetails() {
  return (
    <div className="mt-4 flex justify-between items-center px-4">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-green-400/50" />
        <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
        <div className="w-3 h-3 rounded-full bg-red-400/50" />
      </div>
      <div className="text-gray-500 text-sm font-mono">Model T-2024</div>
    </div>
  );
}