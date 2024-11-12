import React from 'react';

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function FormInput({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  required = false
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-300"
      />
    </div>
  );
}