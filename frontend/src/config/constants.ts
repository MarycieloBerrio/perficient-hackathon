// Mars Colony Control application configuration

export const API_BASE_URL = 'http://localhost:3000/api';

export const POLLING_INTERVALS = {
  TELEMETRY: 5000, // 5 seconds
  ALERTS: 5000, // 5 seconds
  SENSORS: 10000, // 10 seconds
  INVENTORY: 15000, // 15 seconds
} as const;

export const LOCAL_STORAGE_KEYS = {
  CONTROL_STATES: 'mars-colony-control-states',
} as const;

