import React from 'react';
import { CheckCircle2, Clock, ChefHat, Truck, PackageCheck, AlertCircle } from 'lucide-react';
import { OrderStatus } from '../../types/api';
import { cn } from '../../lib/utils';

interface OrderProgressTrackerProps {
  status: OrderStatus;
  className?: string;
}

const steps = [
  { id: 'PENDING', label: 'Order Placed', icon: Clock },
  { id: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
  { id: 'PREPARING', label: 'Preparing', icon: ChefHat },
  { id: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: Truck },
  { id: 'DELIVERED', label: 'Delivered', icon: PackageCheck },
];

export const OrderProgressTracker: React.FC<OrderProgressTrackerProps> = ({ status, className }) => {
  if (status === 'CANCELLED') {
    return (
      <div className={cn("flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100", className)}>
        <AlertCircle size={20} />
        <span className="font-bold text-sm uppercase tracking-wider">This order has been cancelled</span>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex((step) => step.id === status);
  // Default to first step if not found, or last if already delivered (unlikely but safe)
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;
  const currentLabel = steps[activeIndex]?.label || status;

  return (
    <div className={cn("w-full py-2", className)}>
      {/* Unified Status Header */}
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
            <PackageCheck size={16} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest leading-none mb-1">Status</p>
            <p className="text-sm font-black text-neutral-900 leading-none">{currentLabel}</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-brand/5 text-brand text-[10px] font-black uppercase tracking-widest rounded-lg border border-brand/10">
          Step {activeIndex + 1} of 5
        </div>
      </div>

      <div className="relative flex justify-between items-center px-1">
        {/* Background Line */}
        <div className="absolute top-[16px] left-0 w-full h-[3px] bg-neutral-100 rounded-full z-0" />

        {/* Progress Line */}
        <div
          className="absolute top-[16px] left-0 h-[3px] bg-brand z-0 transition-all duration-1000 ease-in-out rounded-full shadow-[0_0_8px_rgba(var(--brand-rgb),0.3)]"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-[2px] relative",
                  isCompleted ? "bg-brand border-brand text-white shadow-lg shadow-brand/20" :
                    isActive ? "bg-white border-brand text-brand scale-125 shadow-xl ring-4 ring-brand/5" :
                      "bg-white border-neutral-500 text-neutral-500"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <StepIcon size={14} className={cn(isActive && "animate-pulse")} />
                )}

                {isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand rounded-full border-2 border-white animate-bounce" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
