// Configuración de la aplicación Mars Colony Control

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const POLLING_INTERVALS = {
  TELEMETRY: 5000, // 5 segundos
  ALERTS: 5000, // 5 segundos
  SENSORS: 10000, // 10 segundos
  INVENTORY: 15000, // 15 segundos
} as const;

export const LOCAL_STORAGE_KEYS = {
  CONTROL_STATES: 'mars-colony-control-states',
} as const;
