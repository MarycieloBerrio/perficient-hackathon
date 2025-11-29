// Context para manejar el estado global de la colonia Mars
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Dome } from '../types';
import type { ApiInventory, ApiSensor, ApiAlert, ApiTelemetryReading } from '../types/backend';
import * as api from '../services/api';
import { mapDomeToUI } from '../utils/dataMapper';
import { usePolling } from '../hooks/usePolling';
import { POLLING_INTERVALS, LOCAL_STORAGE_KEYS } from '../config/constants';

interface ColonyContextValue {
  // Estado
  domes: Dome[];
  inventory: Record<string, ApiInventory[]>;
  sensors: Record<string, ApiSensor[]>;
  telemetry: Record<string, ApiTelemetryReading>;
  alerts: ApiAlert[];
  controlStates: Record<string, any>;
  isLoading: boolean;
  error: string | null;

  // Acciones
  refreshDomes: () => Promise<void>;
  refreshInventory: (domeId: string) => Promise<void>;
  refreshSensors: (domeId: string) => Promise<void>;
  refreshAlerts: () => Promise<void>;
  refreshTelemetry: (sensorId: string) => Promise<void>;
  acknowledgeAlert: (alertId: string, operator: string) => Promise<void>;
  updateControlState: (controlId: string, value: any) => void;
}

const ColonyContext = createContext<ColonyContextValue | undefined>(undefined);

interface ColonyProviderProps {
  children: React.ReactNode;
}

export function ColonyProvider({ children }: ColonyProviderProps) {
  // Estado principal
  const [domes, setDomes] = useState<Dome[]>([]);
  const [inventory, setInventory] = useState<Record<string, ApiInventory[]>>({});
  const [sensors, setSensors] = useState<Record<string, ApiSensor[]>>({});
  const [telemetry, setTelemetry] = useState<Record<string, ApiTelemetryReading>>({});
  const [alerts, setAlerts] = useState<ApiAlert[]>([]);
  const [controlStates, setControlStates] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar estados de controles desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CONTROL_STATES);
      if (saved) {
        setControlStates(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error cargando estados de controles:', err);
    }
  }, []);

  // Guardar estados de controles en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CONTROL_STATES, JSON.stringify(controlStates));
    } catch (err) {
      console.error('Error guardando estados de controles:', err);
    }
  }, [controlStates]);

  // ========== Funciones de refresh ==========

  const refreshDomes = useCallback(async () => {
    try {
      setError(null);
      const apiDomes = await api.getDomes();
      
      // Cargar inventario y sensores para cada domo
      const domesWithData = await Promise.all(
        apiDomes.map(async (apiDome) => {
          try {
            const [domeInventory, domeSensors] = await Promise.all([
              api.getDomeInventory(apiDome.id).catch(() => []),
              api.getDomeSensors(apiDome.id).catch(() => []),
            ]);

            // Actualizar el estado de inventario y sensores
            setInventory(prev => ({ ...prev, [apiDome.id]: domeInventory }));
            setSensors(prev => ({ ...prev, [apiDome.id]: domeSensors }));

            return mapDomeToUI(apiDome, domeInventory, domeSensors, alerts);
          } catch (err) {
            console.error(`Error cargando datos para domo ${apiDome.id}:`, err);
            return mapDomeToUI(apiDome, [], [], alerts);
          }
        })
      );

      setDomes(domesWithData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error cargando domos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setIsLoading(false);
    }
  }, [alerts]);

  const refreshInventory = useCallback(async (domeId: string) => {
    try {
      const domeInventory = await api.getDomeInventory(domeId);
      setInventory(prev => ({ ...prev, [domeId]: domeInventory }));
    } catch (err) {
      console.error(`Error cargando inventario para domo ${domeId}:`, err);
    }
  }, []);

  const refreshSensors = useCallback(async (domeId: string) => {
    try {
      const domeSensors = await api.getDomeSensors(domeId);
      setSensors(prev => ({ ...prev, [domeId]: domeSensors }));
    } catch (err) {
      console.error(`Error cargando sensores para domo ${domeId}:`, err);
    }
  }, []);

  const refreshAlerts = useCallback(async () => {
    try {
      const activeAlerts = await api.getAlerts({ onlyActive: true });
      setAlerts(activeAlerts);
    } catch (err) {
      console.error('Error cargando alertas:', err);
    }
  }, []);

  const refreshTelemetry = useCallback(async (sensorId: string) => {
    try {
      const latest = await api.getLatestTelemetry(sensorId);
      setTelemetry(prev => ({ ...prev, [sensorId]: latest }));
    } catch (err) {
      console.error(`Error cargando telemetría para sensor ${sensorId}:`, err);
    }
  }, []);

  const acknowledgeAlert = useCallback(async (alertId: string, operator: string) => {
    try {
      await api.acknowledgeAlert(alertId, { acknowledgedBy: operator });
      await refreshAlerts();
    } catch (err) {
      console.error(`Error al acknowledging alerta ${alertId}:`, err);
      throw err;
    }
  }, [refreshAlerts]);

  const updateControlState = useCallback((controlId: string, value: any) => {
    setControlStates(prev => ({
      ...prev,
      [controlId]: value,
    }));
  }, []);

  // ========== Polling para datos en tiempo real ==========

  // Cargar datos iniciales
  useEffect(() => {
    refreshDomes();
    refreshAlerts();
  }, []);

  // Polling para alertas
  usePolling(refreshAlerts, {
    interval: POLLING_INTERVALS.ALERTS,
    enabled: !isLoading,
  });

  // Polling para telemetría de todos los sensores conocidos
  usePolling(
    async () => {
      const allSensors = Object.values(sensors).flat();
      await Promise.all(
        allSensors.map(sensor => refreshTelemetry(sensor.id))
      );
    },
    {
      interval: POLLING_INTERVALS.TELEMETRY,
      enabled: !isLoading && Object.keys(sensors).length > 0,
    }
  );

  // Polling para actualizar sensores
  usePolling(
    async () => {
      await Promise.all(
        domes.map(dome => refreshSensors(dome.id))
      );
    },
    {
      interval: POLLING_INTERVALS.SENSORS,
      enabled: !isLoading && domes.length > 0,
    }
  );

  // Polling para inventario
  usePolling(
    async () => {
      await Promise.all(
        domes.map(dome => refreshInventory(dome.id))
      );
    },
    {
      interval: POLLING_INTERVALS.INVENTORY,
      enabled: !isLoading && domes.length > 0,
    }
  );

  // Re-mapear domos cuando cambien las dependencias
  useEffect(() => {
    if (domes.length > 0) {
      const remappedDomes = domes.map(dome => {
        const domeInventory = inventory[dome.id] || [];
        const domeSensors = sensors[dome.id] || [];
        
        // Buscar el apiDome original
        api.getDome(dome.id).then(apiDome => {
          const updated = mapDomeToUI(apiDome, domeInventory, domeSensors, alerts);
          setDomes(prev => prev.map(d => d.id === dome.id ? updated : d));
        }).catch(console.error);
      });
    }
  }, [inventory, sensors, alerts]);

  const value: ColonyContextValue = {
    domes,
    inventory,
    sensors,
    telemetry,
    alerts,
    controlStates,
    isLoading,
    error,
    refreshDomes,
    refreshInventory,
    refreshSensors,
    refreshAlerts,
    refreshTelemetry,
    acknowledgeAlert,
    updateControlState,
  };

  return (
    <ColonyContext.Provider value={value}>
      {children}
    </ColonyContext.Provider>
  );
}

export function useColony() {
  const context = useContext(ColonyContext);
  if (context === undefined) {
    throw new Error('useColony debe usarse dentro de un ColonyProvider');
  }
  return context;
}

