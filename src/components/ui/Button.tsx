import React from "react";
import { cn } from "../../lib/utils";
import { ChefLoader } from "./LoadingSpinner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-brand text-white active:scale-95',
      secondary: 'bg-neutral-100 text-neutral-900 active:scale-95',
      // Legacy variants mapped to secondary for consistency
      ghost: 'bg-neutral-50 text-neutral-500 active:scale-95',
      danger: 'bg-red-50 text-red-600 active:scale-95',
      outline: 'bg-transparent border border-neutral-200 text-neutral-900 active:scale-95',
    };

    const sizes = {
      sm: 'h-8 px-4 text-xs font-bold uppercase tracking-wider',
      md: 'h-11 px-6 text-sm font-bold uppercase tracking-wider',
      lg: 'h-14 px-10 text-base font-bold uppercase tracking-wider',
      icon: 'h-12 w-12 p-0 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        className={cn(
          "btn-flat rounded-md inline-flex items-center justify-center gap-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
          variants[variant],
          sizes[size],
          isLoading && "cursor-not-allowed opacity-70",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <ChefLoader size={size === 'sm' ? 16 : 20} className="text-current" />
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
