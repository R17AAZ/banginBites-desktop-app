import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-neutral-700 font-heading">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[120px] w-full bg-white px-3 py-2 text-sm text-neutral-900 border border-brand/30 rounded-xl outline-none transition-all placeholder:text-neutral-400 focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-50 font-sans resize-none",
            error && "border-red-500 bg-white focus:ring-red-100",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium text-red-500 font-sans ml-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
