export const TELEMETRY_METRICS = [
  'oxygen',
  'water',
  'power',
  'temperature',
  'pressure',
  'co2',
  'food',
  'other',
] as const;

export type TelemetryMetric = (typeof TELEMETRY_METRICS)[number];
