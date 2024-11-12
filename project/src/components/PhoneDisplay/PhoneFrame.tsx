import React from 'react';
import ServicesFeed from './ServicesFeed';

export default function PhoneFrame() {
  return (
    <div className="max-w-[562px] mx-auto my-24">
      {/* Phone Frame */}
      <div className="relative">
        {/* Phone Bezel */}
        <div className="bg-gray-900 rounded-[4.5rem] p-6 shadow-2xl border-[6px] border-gray-800">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-9 w-48 bg-black rounded-b-3xl flex items-center justify-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gray-800" />
            <div className="w-6 h-6 rounded-full bg-gray-800" />
          </div>

          {/* Screen */}
          <div className="bg-black rounded-[3.75rem] overflow-hidden">
            <div className="relative pt-16">
              {/* Status Bar */}
              <div className="absolute top-0 left-0 right-0 h-9 px-8 flex justify-between items-center text-white text-sm">
                <span>9:41</span>
                <div className="flex items-center gap-2">
                  <span className="i-lucide-signal h-4 w-4" />
                  <span className="i-lucide-wifi h-4 w-4" />
                  <span className="i-lucide-battery-full h-4 w-4" />
                </div>
              </div>

              {/* Content */}
              <ServicesFeed />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="absolute right-0 top-36 h-30 w-1.5 bg-gray-800 rounded-l-lg" />
        <div className="absolute left-0 top-30 h-18 w-1.5 bg-gray-800 rounded-r-lg" />
        <div className="absolute left-0 top-54 h-18 w-1.5 bg-gray-800 rounded-r-lg" />
      </div>
    </div>
  );
}