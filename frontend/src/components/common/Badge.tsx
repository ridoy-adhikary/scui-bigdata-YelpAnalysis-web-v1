import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-700',
    secondary: 'bg-teal-50 text-teal-700',
    accent: 'bg-orange-50 text-orange-700',
    gray: 'bg-gray-100 text-gray-600',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span className={`inline-flex items-center justify-center font-display font-semibold rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
