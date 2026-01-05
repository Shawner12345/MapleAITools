import React from 'react';
import { CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PaymentButtonProps {
  priceId: 'unlimited';
  children: React.ReactNode;
}

// Test payment link
const PAYMENT_LINK = 'https://buy.stripe.com/test_5kA9DgeIl0CP6Oc8ww';

const PaymentButton: React.FC<PaymentButtonProps> = ({ children }) => {
  const { user } = useAuth();

  const handlePayment = () => {
    // Add user ID and success URL as metadata through the session_id parameter
    const successUrl = `${window.location.origin}/success`;
    const paymentUrl = user 
      ? `${PAYMENT_LINK}?prefilled_email=${encodeURIComponent(user.email || '')}&metadata[userId]=${encodeURIComponent(user.uid)}&metadata[successUrl]=${encodeURIComponent(successUrl)}`
      : PAYMENT_LINK;

    // Open in new tab
    window.open(paymentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full py-2 px-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
    >
      <CreditCard className="w-5 h-5" />
      {children}
    </button>
  );
};

export default PaymentButton;