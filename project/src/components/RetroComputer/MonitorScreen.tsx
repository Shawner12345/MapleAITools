import React from 'react';
import ScreenEffects from './ScreenEffects';
import ControlPanel from '../ControlPanel';

export default function MonitorScreen() {
  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden">
      <ScreenEffects />
      <div className="relative z-10">
        <ControlPanel isRetroStyle={true} />
      </div>
    </div>
  );
}