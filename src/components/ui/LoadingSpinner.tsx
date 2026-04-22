import React from 'react';
import { ChefHat, UtensilsCrossed } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChefLoaderProps {
  size?: number;
  className?: string;
  variant?: 'sizzle' | 'flit';
}

export const ChefLoader: React.FC<ChefLoaderProps> = ({ 
  size = 24, 
  className,
  variant = 'sizzle'
}) => {
  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      <div className={cn(
        variant === 'sizzle' ? "animate-sizzle" : "animate-flit",
        "text-brand"
      )}>
        <ChefHat size={size} strokeWidth={2.5} />
      </div>
    </div>
  );
};

export const DishLoader: React.FC<ChefLoaderProps> = ({ 
  size = 24, 
  className 
}) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className="absolute inset-0 animate-spin-slow opacity-20">
        <div className="w-full h-full border-4 border-brand border-t-transparent rounded-full" style={{ width: size + 8, height: size + 8 }}></div>
      </div>
      <div className="animate-bounce-slow">
        <UtensilsCrossed size={size} className="text-brand" />
      </div>
    </div>
  );
};
