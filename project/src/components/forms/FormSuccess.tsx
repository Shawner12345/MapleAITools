import React from 'react';
import { CheckCircle } from 'lucide-react';

interface FormSuccessProps {
  title: string;
  message: string;
}

export default function FormSuccess({ title, message }: FormSuccessProps) {
  return (
    <div className="text-center py-8 animate-in fade-in duration-500">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-in zoom-in duration-500 delay-150" />
      <h3 className="text-2xl font-bold mb-2 text-gray-900 animate-in slide-in-from-bottom duration-500 delay-300">{title}</h3>
      <p className="text-gray-600 animate-in slide-in-from-bottom duration-500 delay-500">{message}</p>
    </div>
  );
}