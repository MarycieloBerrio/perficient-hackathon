// Hook para polling automático de datos en tiempo real
import { useEffect, useRef } from 'react';

interface UsePollingOptions {
  enabled?: boolean;
  interval: number;
  onError?: (error: Error) => void;
}

/**
 * Hook personalizado para ejecutar una función de forma periódica (polling)
 * @param callback - Función a ejecutar periódicamente
 * @param options - Opciones de configuración del polling
 */
export function usePolling(
  callback: () => Promise<void> | void,
  options: UsePollingOptions
) {
  const { enabled = true, interval, onError } = options;
  const savedCallback = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Actualizar el callback guardado cuando cambie
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    // Si el polling está deshabilitado, no hacer nada
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Ejecutar inmediatamente la primera vez
    const executeCallback = async () => {
      try {
        await savedCallback.current();
      } catch (error) {
        console.error('Error en polling:', error);
        if (onError && error instanceof Error) {
          onError(error);
        }
      }
    };

    // Ejecutar callback inmediatamente
    executeCallback();

    // Configurar interval para ejecuciones periódicas
    intervalRef.current = setInterval(executeCallback, interval);

    // Cleanup: limpiar el interval cuando el componente se desmonte o cambien las dependencias
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, onError]);
}

