// High-level resource categories used in the colony.
// These pueden mapearse 1:1 con la tabla resource_categories (columna code).
export const RESOURCE_CATEGORIES = [
  'SUPPLIES', // food, water, spare parts
  'CONSTRUCTION', // concrete, metal, regolith bricks
  'ENERGY', // fuel, batteries, hydrogen tanks
  'MEDICAL', // medicines, first-aid supplies
  'LIFE_SUPPORT', // oxygen, CO2 filters, filters
  'MISC', // everything else
] as const;

export type ResourceCategoryCode = (typeof RESOURCE_CATEGORIES)[number];

// Types of movements in the resource ledger (resource_logs.log_type)
export const RESOURCE_LOG_TYPES = [
  'IMPORT_EARTH', // supply ship from Earth
  'EXTRACTION', // mining / local extraction
  'CONSUMPTION', // daily usage
  'TRANSFER_IN', // received from another dome
  'TRANSFER_OUT', // sent to another dome
  'PRODUCTION', // produced internally (e.g. farm harvest)
  'ADJUSTMENT', // manual correction
] as const;

export type ResourceLogType = (typeof RESOURCE_LOG_TYPES)[number];
