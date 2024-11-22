import React from 'react';
import { Lock, Star } from 'lucide-react';
import PaymentButton from './PaymentButton';

interface UpgradePromptProps {
  onClose?: () => void;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-6 md:p-8">
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Unlock All Features
          </h2>
          <p className="text-gray-600">
            This feature is available with our Premium plan. Upgrade now to access all tools and features.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Premium Features Include
          </h3>
          <ul className="text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Christmas Meal Planner
            </li>
            <li className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Elf on the Shelf Ideas
            </li>
            <li className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Christmas Poem Writer
            </li>
            <li className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Budget Planner
            </li>
            <li className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Kids Activities
            </li>
            <li className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Decorating Ideas
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <PaymentButton priceId="unlimited">
            Upgrade to Premium
          </PaymentButton>
          
          {onClose && (
            <button
              onClick={onClose}
              className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              Maybe Later
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;