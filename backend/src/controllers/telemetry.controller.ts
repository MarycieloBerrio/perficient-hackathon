// src/controllers/telemetry.controller.ts
import { Request, Response, NextFunction } from 'express';
import { TelemetryService } from '../services/telemetry.service';
import { ingestTelemetrySchema, telemetryQuerySchema } from '../dtos';

const telemetryService = new TelemetryService();

export class TelemetryController {
  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { sensorId } = req.params;
      const { from, to, limit } = req.query;

      const input = telemetryQuerySchema.parse({
        sensorId,
        from: from ? String(from) : undefined,
        to: to ? String(to) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      const readings = await telemetryService.getHistory(input);
      res.json(readings);
    } catch (err) {
      next(err);
    }
  }

  async getLatest(req: Request, res: Response, next: NextFunction) {
    try {
      const { sensorId } = req.params;
      const reading = await telemetryService.getLatestBySensor(sensorId);
      if (!reading) {
        return res
          .status(404)
          .json({ message: 'No telemetry for this sensor' });
      }
      res.json(reading);
    } catch (err) {
      next(err);
    }
  }

  async ingest(req: Request, res: Response, next: NextFunction) {
    try {
      const input = ingestTelemetrySchema.parse(req.body);
      const reading = await telemetryService.ingestReading(input);
      res.status(201).json(reading);
    } catch (err) {
      next(err);
    }
  }
}
