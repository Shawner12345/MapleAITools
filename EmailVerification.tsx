import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { resendVerificationEmail } from '../lib/firebase';
import { AlertCircle, Mail, Loader2 } from 'lucide-react';

interface EmailVerificationProps {
  user: User;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await resendVerificationEmail(user);
      if (error) throw error;
      setSuccess('Verification email sent! Please check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  if (user.emailVerified) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mb-6 bg-yellow-50 rounded-lg border border-yellow-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-800 mb-1">Verify Your Email</h3>
          <p className="text-sm text-yellow-700 mb-3">
            Please verify your email address ({user.email}) to access all features.
            Check your inbox for the verification link.
          </p>

          {error && (
            <div className="mb-3 p-2 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-3 p-2 bg-green-50 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Resend Verification Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;