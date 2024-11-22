import React from 'react';
import { Check, Star } from 'lucide-react';
import PaymentButton from './PaymentButton';

interface PricingProps {
  setActiveComponent: (component: string | null) => void;
}

const Pricing: React.FC<PricingProps> = ({ setActiveComponent }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Simple, Transparent Pricing</h2>
        <p className="text-gray-600">Choose the perfect plan for your Christmas planning needs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Free Plan */}
        <div className="border border-gray-200 rounded-xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Free</h3>
            <p className="text-gray-600">Essential Christmas planning tools</p>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-800">$0</span>
            <span className="text-gray-600">/forever</span>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              AI Gift Ideas Generator
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              Movie Night Planner
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              Date Night Ideas
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              Unlimited generations
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              Basic support
            </li>
          </ul>

          <button 
            onClick={() => setActiveComponent('GiftIdeas')}
            className="w-full py-2 px-4 border-2 border-red-600 text-red-600 rounded-full hover:bg-red-50 transition-colors font-semibold"
          >
            Get Started Free
          </button>
        </div>

        {/* Unlimited Plan */}
        <div className="border-2 border-red-600 rounded-xl p-8 bg-white shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <Star className="w-6 h-6 text-red-600 fill-current" />
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Unlimited</h3>
            <p className="text-gray-600">Complete Christmas planning suite</p>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-800">$10</span>
            <span className="text-gray-600">/one-time</span>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              Everything in Free plan
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              Christmas Meal Planner
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              Elf on the Shelf Ideas
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              Christmas Poem Writer
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              Budget Planner
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              Kids Activities
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              Decorating Ideas
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-green-500" />
              Priority support
            </li>
          </ul>

          <PaymentButton priceId="unlimited">
            Get Unlimited Access
          </PaymentButton>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-600">
        <p className="mb-4">All plans include:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <Check className="w-5 h-5 text-green-500 mx-auto mb-2" />
            No Monthly Fees
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Check className="w-5 h-5 text-green-500 mx-auto mb-2" />
            One-Time Payment
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Check className="w-5 h-5 text-green-500 mx-auto mb-2" />
            Basic Support
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;