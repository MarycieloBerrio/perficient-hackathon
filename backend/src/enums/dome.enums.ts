export const DOME_TYPES = [
  'HABITATION',
  'AGRICULTURE',
  'INDUSTRIAL',
  'COMMAND',
] as const;

export type DomeType = (typeof DOME_TYPES)[number];

export const DOME_STATUSES = ['OPERATIONAL', 'MAINTENANCE', 'OFFLINE'] as const;

export type DomeStatus = (typeof DOME_STATUSES)[number];
