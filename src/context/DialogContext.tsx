import React, { createContext, useContext, useState, ReactNode } from 'react';

type DialogType = 'alert' | 'confirm' | 'prompt';

interface DialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  defaultValue?: string;
  variant?: 'info' | 'danger';
  inputType?: 'text' | 'number' | 'password';
}

interface DialogState extends DialogOptions {
  isOpen: boolean;
  type: DialogType;
  resolve: (value: any) => void;
}

interface DialogContextType {
  alert: (options: DialogOptions | string) => Promise<void>;
  confirm: (options: DialogOptions | string) => Promise<boolean>;
  prompt: (options: DialogOptions | string) => Promise<string | null>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const showDialog = (type: DialogType, options: DialogOptions | string) => {
    return new Promise((resolve) => {
      const baseOptions: DialogOptions = typeof options === 'string'
        ? { title: type.toUpperCase(), message: options }
        : options;

      setDialog({
        ...baseOptions,
        isOpen: true,
        type,
        resolve,
      });
    });
  };

  const alert = (options: DialogOptions | string) => showDialog('alert', options) as Promise<void>;
  const confirm = (options: DialogOptions | string) => showDialog('confirm', options) as Promise<boolean>;
  const prompt = (options: DialogOptions | string) => showDialog('prompt', options) as Promise<string | null>;

  const handleClose = (value: any) => {
    if (dialog) {
      dialog.resolve(value);
      setDialog(null);
    }
  };

  return (
    <DialogContext.Provider value={{ alert, confirm, prompt }}>
      {children}
      {dialog && (
        <GlobalDialog
          {...dialog}
          onClose={() => handleClose(dialog.type === 'confirm' ? false : null)}
          onConfirm={(value) => handleClose(value ?? true)}
        />
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

// Forward declaration of GlobalDialog to be implemented next
import { GlobalDialog } from '../components/ui/GlobalDialog';
