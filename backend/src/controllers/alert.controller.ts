// src/controllers/alert.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AlertService } from '../services/alert.service';
import {
  createAlertSchema,
  alertFilterSchema,
  acknowledgeAlertSchema,
} from '../dtos';

const alertService = new AlertService();

export class AlertController {
  async listAlerts(req: Request, res: Response, next: NextFunction) {
    try {
      const { domeId, resourceId, level, onlyActive, limit } = req.query;

      const filter = alertFilterSchema.parse({
        domeId: domeId ? String(domeId) : undefined,
        resourceId: resourceId ? String(resourceId) : undefined,
        level: level ? String(level) : undefined,
        onlyActive:
          typeof onlyActive === 'string' ? onlyActive === 'true' : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      const alerts = await alertService.listAlerts(filter);
      res.json(alerts);
    } catch (err) {
      next(err);
    }
  }

  async createAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createAlertSchema.parse(req.body);
      const alert = await alertService.createAlert(input);
      res.status(201).json(alert);
    } catch (err) {
      next(err);
    }
  }

  async acknowledge(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const input = acknowledgeAlertSchema.parse({
        alertId: id,
        acknowledgedBy: req.body?.acknowledgedBy,
      });

      const alert = await alertService.acknowledgeAlert(input);
      res.json(alert);
    } catch (err) {
      next(err);
    }
  }
}
