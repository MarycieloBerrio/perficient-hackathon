export const ALERT_LEVELS = ['INFO', 'WARNING', 'CRITICAL'] as const;

export type AlertLevel = (typeof ALERT_LEVELS)[number];
