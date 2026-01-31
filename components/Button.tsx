import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  // Base: Sharp corners, thick border, hard shadow transition
  const baseStyles = "inline-flex items-center justify-center font-bold border-2 border-black transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0";
  
  // Variants: High contrast monochrome
  const variants = {
    primary: "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:bg-zinc-800",
    secondary: "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-50",
    outline: "bg-transparent text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white",
    danger: "bg-red-600 text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700",
    ghost: "border-transparent shadow-none hover:bg-zinc-200 active:translate-x-0 active:translate-y-0"
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-6 py-3 text-sm tracking-wide",
    lg: "px-8 py-4 text-base tracking-wide"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;