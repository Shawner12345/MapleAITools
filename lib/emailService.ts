import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = 'template_waitlist';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const emailService = {
  async sendWaitlistConfirmation(email: string): Promise<void> {
    return emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: email,
        signup_date: new Date().toLocaleDateString(),
      },
      PUBLIC_KEY
    );
  }
};