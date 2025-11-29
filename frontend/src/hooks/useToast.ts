// Hook personalizado para manejar notificaciones toast
import toast from 'react-hot-toast';

export interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export function useToast() {
  const success = (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      duration: options?.duration || 3000,
      position: options?.position || 'bottom-right',
      style: {
        background: '#1a2332',
        color: '#fff',
        border: '1px solid #10b981',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#1a2332',
      },
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'bottom-right',
      style: {
        background: '#1a2332',
        color: '#fff',
        border: '1px solid #ef4444',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#1a2332',
      },
    });
  };

  const warning = (message: string, options?: ToastOptions) => {
    return toast(message, {
      duration: options?.duration || 3500,
      position: options?.position || 'bottom-right',
      icon: '⚠️',
      style: {
        background: '#1a2332',
        color: '#fff',
        border: '1px solid #f59e0b',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  };

  const info = (message: string, options?: ToastOptions) => {
    return toast(message, {
      duration: options?.duration || 3000,
      position: options?.position || 'bottom-right',
      icon: 'ℹ️',
      style: {
        background: '#1a2332',
        color: '#fff',
        border: '1px solid #3b82f6',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  };

  const loading = (message: string) => {
    return toast.loading(message, {
      style: {
        background: '#1a2332',
        color: '#fff',
        border: '1px solid #636e7b',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  const promise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        style: {
          background: '#1a2332',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 16px',
        },
        success: {
          style: {
            border: '1px solid #10b981',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#1a2332',
          },
        },
        error: {
          style: {
            border: '1px solid #ef4444',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#1a2332',
          },
        },
      }
    );
  };

  return {
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    promise,
  };
}

