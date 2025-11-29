// src/controllers/resource-log.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ResourceLogService } from '../services/resource-log.service';
import { resourceLogFilterSchema } from '../dtos';

const logService = new ResourceLogService();

export class ResourceLogController {
  async listLogs(req: Request, res: Response, next: NextFunction) {
    try {
      // query params are strings → coerce some manually
      const { domeId, resourceId, logType, from, to, limit } = req.query;

      const filter = resourceLogFilterSchema.parse({
        domeId: domeId ? String(domeId) : undefined,
        resourceId: resourceId ? String(resourceId) : undefined,
        logType: logType ? String(logType) : undefined,
        from: from ? String(from) : undefined,
        to: to ? String(to) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      const logs = await logService.listLogs(filter);
      res.json(logs);
    } catch (err) {
      next(err);
    }
  }
}
