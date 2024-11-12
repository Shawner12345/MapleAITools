import React from 'react';
import { Check } from 'lucide-react';

export function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Create SOPs and Mind Maps',
        'Basic Markdown conversion',
        'Export to PDF',
        'Save up to 3 processes',
      ],
      buttonText: 'Get Started',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      features: [
        'Everything in Free',
        'Unlimited processes',
        'Training manual generation',
        'FAQ generation',
        'Root cause analysis',
        'Priority support',
        'Team collaboration',
      ],
      buttonText: 'Start Free Trial',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'per organization',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Advanced security',
        'Dedicated support',
        'SLA guarantees',
        'On-premise deployment',
      ],
      buttonText: 'Contact Sales',
      highlight: false,
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600">Choose the plan that's right for you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl ${
                plan.highlight
                  ? 'bg-maple-orange/5 border-2 border-maple-orange shadow-lg'
                  : 'bg-white border border-gray-200'
              } p-8`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-maple-orange text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-maple-orange flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg transition-colors ${
                  plan.highlight
                    ? 'bg-maple-orange hover:bg-maple-orange-dark text-white'
                    : 'bg-maple-blue hover:bg-maple-blue-dark text-white'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}