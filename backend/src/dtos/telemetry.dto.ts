// src/dtos/telemetry.dto.ts
import { z } from 'zod';

/**
 * Ingest a new telemetry reading (simulator → backend)
 */
export const ingestTelemetrySchema = z.object({
  sensorId: z.uuid(),
  value: z.number(),
  createdAt: z.string().datetime().optional(), // if omitted, service puede usar now()
});

export type IngestTelemetryDTO = z.infer<typeof ingestTelemetrySchema>;

/**
 * Query telemetry history by sensor
 */
export const telemetryQuerySchema = z.object({
  sensorId: z.uuid(),
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
  limit: z.number().int().positive().max(2000).default(500),
});

export type TelemetryQueryDTO = z.infer<typeof telemetryQuerySchema>;
