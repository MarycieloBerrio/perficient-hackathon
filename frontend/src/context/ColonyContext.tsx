// Context to manage global state of the Mars colony
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Dome } from '../types';
import type { ApiInventory, ApiSensor, ApiAlert, ApiTelemetryReading } from '../types/backend';
import * as dataService from '../services/dataService';
import { mapDomeToUI } from '../utils/dataMapper';
import { usePolling } from '../hooks/usePolling';
import { POLLING_INTERVALS, LOCAL_STORAGE_KEYS } from '../config/constants';
import toast from 'react-hot-toast';

interface ColonyContextValue {
  // State
  domes: Dome[];
  inventory: Record<string, ApiInventory[]>;
  sensors: Record<string, ApiSensor[]>;
  telemetry: Record<string, ApiTelemetryReading>;
  alerts: ApiAlert[];
  controlStates: Record<string, any>;
  isLoading: boolean;
  error: string | null;

  // Actions
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
  // Main state
  const [domes, setDomes] = useState<Dome[]>([]);
  const [inventory, setInventory] = useState<Record<string, ApiInventory[]>>({});
  const [sensors, setSensors] = useState<Record<string, ApiSensor[]>>({});
  const [telemetry, setTelemetry] = useState<Record<string, ApiTelemetryReading>>({});
  const [alerts, setAlerts] = useState<ApiAlert[]>([]);
  const [controlStates, setControlStates] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load control states from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CONTROL_STATES);
      if (saved) {
        setControlStates(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error loading control states:', err);
    }
  }, []);

  // Save control states to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CONTROL_STATES, JSON.stringify(controlStates));
    } catch (err) {
      console.error('Error saving control states:', err);
    }
  }, [controlStates]);

  // ========== Refresh functions ==========

  const refreshDomes = useCallback(async () => {
    try {
      setError(null);
      const apiDomes = await dataService.getDomes();
      
      const domesWithData = await Promise.all(
        apiDomes.map(async (apiDome) => {
          try {
            const [domeInventory, domeSensors] = await Promise.all([
              dataService.getDomeInventory(apiDome.id).catch(() => []),
              dataService.getDomeSensors(apiDome.id).catch(() => []),
            ]);

            setInventory(prev => ({ ...prev, [apiDome.id]: domeInventory }));
            setSensors(prev => ({ ...prev, [apiDome.id]: domeSensors }));

            const mappedDome = mapDomeToUI(apiDome, domeInventory, domeSensors, alerts);
            return mappedDome;
          } catch (err) {
            console.error(`Error loading data for dome ${apiDome.id}:`, err);
            return mapDomeToUI(apiDome, [], [], alerts);
          }
        })
      );

      setDomes(domesWithData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading domes:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  }, [alerts]);

  const refreshInventory = useCallback(async (domeId: string) => {
    try {
      const domeInventory = await dataService.getDomeInventory(domeId);
      setInventory(prev => ({ ...prev, [domeId]: domeInventory }));
    } catch (err) {
      console.error(`Error loading inventory for dome ${domeId}:`, err);
    }
  }, []);

  const refreshSensors = useCallback(async (domeId: string) => {
    try {
      const domeSensors = await dataService.getDomeSensors(domeId);
      setSensors(prev => ({ ...prev, [domeId]: domeSensors }));
    } catch (err) {
      console.error(`Error loading sensors for dome ${domeId}:`, err);
    }
  }, []);

  const refreshAlerts = useCallback(async () => {
    try {
      const activeAlerts = await dataService.getAlerts({ onlyActive: true });
      setAlerts(activeAlerts);
    } catch (err) {
      console.error('Error loading alerts:', err);
    }
  }, []);

  const refreshTelemetry = useCallback(async (sensorId: string) => {
    try {
      const latest = await dataService.getLatestTelemetry(sensorId);
      setTelemetry(prev => ({ ...prev, [sensorId]: latest }));
    } catch (err) {
      // Don't show error, as we now always return mock data in case of failure
      console.debug(`Telemetry for sensor ${sensorId} loaded from fallback`);
    }
  }, []);

  const acknowledgeAlert = useCallback(async (alertId: string, operator: string) => {
    const toastId = toast.loading('Acknowledging alert...');
    
    try {
      await dataService.acknowledgeAlert(alertId, operator);
      await refreshAlerts();
      
      toast.success('Alert acknowledged successfully', {
        id: toastId,
        duration: 3000,
        style: {
          background: '#1a2332',
          color: '#fff',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
    } catch (err) {
      console.error(`Error acknowledging alert ${alertId}:`, err);
      toast.error('Failed to acknowledge alert', {
        id: toastId,
        duration: 4000,
        style: {
          background: '#1a2332',
          color: '#fff',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
      throw err;
    }
  }, [refreshAlerts]);

  const updateControlState = useCallback((controlId: string, value: any) => {
    try {
      setControlStates(prev => ({
        ...prev,
        [controlId]: value,
      }));
    } catch (err) {
      console.error(`Error updating control state for ${controlId}:`, err);
      toast.error(`Failed to update control: ${controlId}`, {
        duration: 3000,
        style: {
          background: '#1a2332',
          color: '#fff',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
    }
  }, []);

  // ========== Polling for real-time data ==========

  // Load initial data
  useEffect(() => {
    refreshDomes();
    refreshAlerts();
  }, []);

  // Polling for alerts
  usePolling(refreshAlerts, {
    interval: POLLING_INTERVALS.ALERTS,
    enabled: !isLoading,
  });

  // Polling for telemetry from all known sensors
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

  // Polling to update sensors
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

  // Polling for inventory
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

  // Re-map domes when dependencies change
  // TEMPORARILY DISABLED - may be causing problems with positions
  // useEffect(() => {
  //   if (domes.length > 0) {
  //     domes.forEach(dome => {
  //       const domeInventory = inventory[dome.id] || [];
  //       const domeSensors = sensors[dome.id] || [];
  //       
  //       // Find the original apiDome
  //       dataService.getDome(dome.id).then(apiDome => {
  //         const updated = mapDomeToUI(apiDome, domeInventory, domeSensors, alerts);
  //         setDomes(prev => prev.map(d => d.id === dome.id ? updated : d));
  //       }).catch(console.error);
  //     });
  //   }
  // }, [inventory, sensors, alerts]);

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
    throw new Error('useColony must be used within a ColonyProvider');
  }
  return context;
}

