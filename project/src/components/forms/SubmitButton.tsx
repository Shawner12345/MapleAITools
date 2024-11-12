import React from 'react';
import { Send } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  text: string;
  loadingText?: string;
}

export default function SubmitButton({
  isSubmitting,
  text,
  loadingText = 'Sending...'
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 
                rounded-lg text-lg font-semibold transition-all duration-300 
                hover:bg-blue-700 hover:scale-[1.02] 
                active:scale-[0.98]
                disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
    >
      {isSubmitting ? loadingText : text}
      <Send className={`w-5 h-5 transition-transform duration-300 ${isSubmitting ? 'translate-x-1' : ''}`} />
    </button>
  );
}