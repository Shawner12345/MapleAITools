import React from 'react';
import MonitorScreen from './MonitorScreen';
import ComputerDetails from './ComputerDetails';

export default function ComputerFrame() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="relative">
        {/* Computer Case */}
        <div className="bg-gray-700 p-8 rounded-3xl shadow-2xl">
          {/* Monitor Bezel */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-inner">
            <MonitorScreen />
          </div>
          <ComputerDetails />
        </div>
        {/* Computer Base */}
        <div className="bg-gray-800 h-8 mx-12 -mt-2 rounded-b-3xl shadow-2xl" />
      </div>
    </div>
  );
}