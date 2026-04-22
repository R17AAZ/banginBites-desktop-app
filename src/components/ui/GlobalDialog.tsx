import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { AlertCircle, Info, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface GlobalDialogProps {
  isOpen: boolean;
  type: 'alert' | 'confirm' | 'prompt';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  defaultValue?: string;
  variant?: 'info' | 'danger';
  inputType?: 'text' | 'number' | 'password';
  onClose: () => void;
  onConfirm: (value?: any) => void;
}

export const GlobalDialog: React.FC<GlobalDialogProps> = ({
  isOpen,
  type,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  defaultValue = '',
  variant = 'info',
  inputType = 'text',
  onClose,
  onConfirm,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  const handleConfirm = () => {
    if (type === 'prompt') {
      onConfirm(inputValue);
    } else {
      onConfirm(true);
    }
  };

  const Icon = type === 'alert' ? AlertCircle : type === 'confirm' ? HelpCircle : Info;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxW="max-w-md"
      className="p-0"
    >
      <div className="p-8 text-center">
        {/* Icon based on type/variant */}
        <div className={cn(
          "mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6",
          variant === 'danger' ? "bg-red-50 text-red-500" : "bg-brand/10 text-brand"
        )}>
          <Icon size={32} />
        </div>

        <h3 className="text-2xl font-black font-heading text-neutral-900 font-semibold mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-neutral-500 text-sm font-sans leading-relaxed mb-6">
          {message}
        </p>

        {type === 'prompt' && (
          <div className="mb-8 p-6 rounded-2xl bg-brand/5 border border-brand/10 text-center">
            <p className="text-[10px] font-black font-heading text-brand uppercase tracking-[0.2em] mb-4">
              {inputType === 'number' ? 'Enter Verification Code' : 'Input Required'}
            </p>
            <Input
              type={inputType}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputType === 'number' ? "• • • • • •" : "Enter value..."}
              autoFocus
              className="text-center font-bold text-2xl h-14 bg-white/50 border-neutral-200 focus:bg-white tracking-[0.5em] transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirm();
              }}
            />
          </div>
        )}

        <div className="flex gap-3">
          {(type === 'confirm' || type === 'prompt') && (
            <Button
              variant="ghost"
              className="flex-1 rounded-xl h-12 font-bold"
              onClick={onClose}
            >
              {cancelText}
            </Button>
          )}
          <Button
            variant="primary"
            className={cn(
              "flex-1 rounded-xl h-12 font-black uppercase tracking-widest text-[10px]",
              variant === 'danger' ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200" : "bg-neutral-900 hover:bg-neutral-800 shadow-lg shadow-neutral-200"
            )}
            onClick={handleConfirm}
          >
            {type === 'alert' ? 'Got it' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
