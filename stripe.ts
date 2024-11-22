import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface CreateCheckoutSessionParams {
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export const createCheckoutSession = async ({
  priceId,
  successUrl = `${window.location.origin}/success`,
  cancelUrl = `${window.location.origin}/pricing`,
  customerEmail,
  metadata = {}
}: CreateCheckoutSessionParams) => {
  try {
    // Create checkout session
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        successUrl,
        cancelUrl,
        customerEmail,
        metadata: {
          ...metadata,
          userId: customerEmail
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create checkout session');
    }

    // Get Stripe instance
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    // Redirect to checkout
    const { error } = await stripe.redirectToCheckout({ 
      sessionId: data.sessionId 
    });
    
    if (error) {
      throw error;
    }
  } catch (err) {
    console.error('Payment error:', err);
    throw err;
  }
};