'use client';
import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

export default function Toast({ message, visible, onDismiss }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onDismiss, 300);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  if (!visible && !show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm transition-all duration-300 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {message}
      </div>
    </div>
  );
}
