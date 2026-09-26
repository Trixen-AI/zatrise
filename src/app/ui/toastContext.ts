import { createContext, useContext } from 'react';

export type ToastTone = 'success' | 'error' | 'info';
export type ToastApi = { push: (tone: ToastTone, title: string, body?: string) => void };

export const ToastContext = createContext<ToastApi | null>(null);

export function useToast() {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast must be used inside ToastProvider');
  return api;
}
