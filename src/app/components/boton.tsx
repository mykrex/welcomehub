// src/components/ui/button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyles = `px-4 py-2 rounded text-white transition focus:outline-none focus:ring-2 focus:ring-offset-1 `;
  let variantStyles = '';

  switch (variant) {
    case 'secondary':
      variantStyles = 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500';
      break;
    case 'danger':
      variantStyles = 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      break;
    default:
      variantStyles = 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400';
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}
