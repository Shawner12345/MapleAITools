import React, { useState } from 'react';
import { Gift, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { waitlistService } from '../lib/waitlistService';

const WaitlistPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Show success immediately
    setSuccess(true);
    setError('');

    // Handle backend operations asynchronously
    waitlistService.addToWaitlist(email).catch(err => {
      console.error('Background waitlist error:', err);
      // Errors are logged but not shown to user since they already got success message
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 md:p-12">
        <div className="flex items-center justify-center mb-8">
          <Gift className="w-12 h-12 text-red-600" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
          Join the Waitlist
        </h1>
        
        <p className="text-center text-gray-600 mb-8 max-w-lg mx-auto">
          Be the first to know when we launch new features and get exclusive early access to our AI-powered Christmas planning tools.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              You're on the list!
            </h2>
            <p className="text-gray-600">
              Thank you for joining our waitlist. We'll notify you as soon as we have updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              Join Waitlist
            </button>
          </form>
        )}

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Early Access</h3>
              <p className="text-sm text-gray-600">Be among the first to try new features</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Exclusive Updates</h3>
              <p className="text-sm text-gray-600">Get development updates and sneak peeks</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Special Offers</h3>
              <p className="text-sm text-gray-600">Access to launch day discounts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;