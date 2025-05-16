// src/components/ui/dialog.tsx
import React, { ReactNode, useEffect } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Dialog({ isOpen, onClose, children }: DialogProps) {
    const titleId = 'dialog-title';

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', onKeyDown);
    }
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId} 
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-6
                   transform transition-all scale-95 opacity-0 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>



  );
}


// src/components/ui/dialog.tsx
interface DialogSubcomponentProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogContent({ children, className = '' }: DialogSubcomponentProps) {
  return <div className={`text-gray-300 ${className}`}>{children}</div>;
}

export function DialogHeader({ children, className = '' }: DialogSubcomponentProps) {
  return <div className={`mb-4 border-b border-gray-700 pb-2 text-lg font-semibold text-white ${className}`}>{children}</div>;
}

export function DialogTitle({ children, className = '' }: DialogSubcomponentProps) {
  return <h2 className={className}>{children}</h2>;
}

export function DialogFooter({ children, className = '' }: DialogSubcomponentProps) {
  return <div className={`mt-6 flex justify-end gap-3 ${className}`}>{children}</div>;
}

