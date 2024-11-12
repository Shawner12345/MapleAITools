import React from 'react';
import { services } from '../Services';
import { useServiceContext } from '../../context/ServiceContext';

interface FormTextareaProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
}

export default function FormTextarea({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  rows = 4
}: FormTextareaProps) {
  const { selectedServices } = useServiceContext();
  
  const selectedServiceTitles = selectedServices
    .map(id => services.find(s => s.id === id)?.title)
    .filter(Boolean)
    .join(', ');

  const placeholder = selectedServices.length > 0
    ? `I'm interested in learning more about ${selectedServiceTitles}. Specifically, I'd like to know...`
    : "Tell us about your goals and how AI can help...";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-300"
      />
    </div>
  );
}