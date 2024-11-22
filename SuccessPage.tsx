import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserPlan } from '../contexts/UserPlanContext';

const SuccessPage: React.FC = () => {
  const { user } = useAuth();
  const { refreshPlan } = useUserPlan();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get session ID from URL
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');

        if (!sessionId) {
          throw new Error('No session ID found');
        }

        // Verify payment status
        const response = await fetch('/.netlify/functions/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!data.verified) {
          throw new Error('Payment verification failed');
        }

        // Refresh user plan to get updated status
        await refreshPlan();

        // Redirect to home after 3 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } catch (err) {
        console.error('Payment verification error:', err);
        setError('Unable to verify payment. Please contact support if this persists.');
      } finally {
        setVerifying(false);
      }
    };

    if (user) {
      verifyPayment();
    }
  }, [user]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Verification Failed
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          {verifying ? (
            'Verifying your payment...'
          ) : (
            'Thank you for your purchase! You now have access to all premium features.'
          )}
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Redirecting to homepage...
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;