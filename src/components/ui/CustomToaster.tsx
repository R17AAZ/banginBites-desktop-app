import React from 'react';
import { Toaster, toast, ResolveValue, Toast } from 'react-hot-toast';
import { CheckCircle2, AlertCircle, Info, Loader2, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          color: 'inherit',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    >
      {(t) => (
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3 min-w-[300px] bg-white rounded-xl shadow-xl border border-neutral-100 transition-all duration-300",
            t.visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          {/* Icon Section */}
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            t.type === 'success' && "bg-green-50 text-green-500",
            t.type === 'error' && "bg-red-50 text-red-500",
            t.type === 'loading' && "bg-brand/10 text-brand",
            (t.type === 'blank' || !t.type) && "bg-neutral-50 text-neutral-500"
          )}>
            {t.type === 'success' && <CheckCircle2 size={20} />}
            {t.type === 'error' && <AlertCircle size={20} />}
            {t.type === 'loading' && <Loader2 size={20} className="animate-spin" />}
            {(t.type === 'blank' || !t.type) && <Info size={20} />}
          </div>

          {/* Message Section */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-900 leading-tight">
              {t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : t.type === 'loading' ? 'Loading' : 'Message'}
            </p>
            <div className="text-xs text-neutral-500 font-sans mt-0.5 truncate">
              {typeof t.message === 'function' ? t.message(t) : t.message}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-neutral-50 text-neutral-300 hover:text-neutral-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </Toaster>
  );
};
