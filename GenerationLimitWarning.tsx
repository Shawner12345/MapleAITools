import React from 'react';
import { AlertCircle, WifiOff } from 'lucide-react';
import { usePlan } from '../contexts/PlanContext';

interface GenerationLimitWarningProps {
  setActiveComponent: (component: string | null) => void;
}

const GenerationLimitWarning: React.FC<GenerationLimitWarningProps> = ({ setActiveComponent }) => {
  const { plan, isOffline } = usePlan();

  if (isOffline) {
    return (
      <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md">
        <div className="flex items-start gap-2">
          <WifiOff className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">You're currently offline</p>
            <p className="text-sm mt-1">
              Generation features are not available while offline. Please check your internet connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!plan || plan.generationsLeft > 2) return null;

  return (
    <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div>
          {plan.generationsLeft === 0 ? (
            <>
              <p className="font-medium">You've used all your generations</p>
              <p className="text-sm mt-1">
                <button
                  onClick={() => setActiveComponent('Pricing')}
                  className="text-red-600 hover:text-red-700 underline"
                >
                  Upgrade your plan
                </button>
                {' '}to continue using our AI tools.
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">
                {plan.generationsLeft} generation{plan.generationsLeft === 1 ? '' : 's'} remaining
              </p>
              <p className="text-sm mt-1">
                <button
                  onClick={() => setActiveComponent('Pricing')}
                  className="text-red-600 hover:text-red-700 underline"
                >
                  Upgrade your plan
                </button>
                {' '}for more generations.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerationLimitWarning;