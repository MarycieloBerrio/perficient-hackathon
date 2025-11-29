// src/controllers/resource-log.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ResourceLogService } from '../services/resource-log.service';
import { resourceLogFilterSchema } from '../dtos';

const logService = new ResourceLogService();

export class ResourceLogController {
  /**
   * @swagger
   * /api/resource-logs:
   *   get:
   *     summary: List resource logs
   *     description: Retrieve a filtered list of resource movement logs (ledger) for auditing and tracking
   *     tags: [Resource Logs]
   *     parameters:
   *       - in: query
   *         name: domeId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Filter logs by dome ID
   *         example: 550e8400-e29b-41d4-a716-446655440000
   *       - in: query
   *         name: resourceId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Filter logs by resource ID
   *         example: 660e8400-e29b-41d4-a716-446655440001
   *       - in: query
   *         name: logType
   *         schema:
   *           type: string
   *           enum: [IMPORT_EARTH, EXTRACTION, PRODUCTION, CONSUMPTION, TRANSFER_IN, TRANSFER_OUT, LOSS, ADJUSTMENT]
   *         description: Filter logs by movement type
   *         example: IMPORT_EARTH
   *       - in: query
   *         name: from
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Filter logs from this date/time (ISO 8601 format)
   *         example: 2024-01-01T00:00:00Z
   *       - in: query
   *         name: to
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Filter logs until this date/time (ISO 8601 format)
   *         example: 2024-12-31T23:59:59Z
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *           maximum: 500
   *           minimum: 1
   *         description: Maximum number of logs to return
   *         example: 100
   *     responses:
   *       200:
   *         description: Resource logs retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     format: uuid
   *                     description: Log entry ID
   *                   resource_id:
   *                     type: string
   *                     format: uuid
   *                     description: Resource affected
   *                   dome_id:
   *                     type: string
   *                     format: uuid
   *                     description: Dome where the movement occurred
   *                   log_type:
   *                     type: string
   *                     enum: [IMPORT_EARTH, EXTRACTION, PRODUCTION, CONSUMPTION, TRANSFER_IN, TRANSFER_OUT, LOSS, ADJUSTMENT]
   *                     description: Type of resource movement
   *                   amount:
   *                     type: number
   *                     description: Quantity moved (negative for outbound, positive for inbound)
   *                   mission_name:
   *                     type: string
   *                     nullable: true
   *                     description: Mission or supply run identifier
   *                   transfer_group:
   *                     type: string
   *                     format: uuid
   *                     nullable: true
   *                     description: Transfer transaction ID (links TRANSFER_IN and TRANSFER_OUT)
   *                   operator_id:
   *                     type: string
   *                     format: uuid
   *                     nullable: true
   *                     description: Operator who authorized the movement
   *                   metadata:
   *                     type: object
   *                     nullable: true
   *                     description: Additional metadata
   *                   notes:
   *                     type: string
   *                     nullable: true
   *                     description: Notes about the movement
   *                   created_at:
   *                     type: string
   *                     format: date-time
   *                     description: When the log was created
   *             example:
   *               - id: 770e8400-e29b-41d4-a716-446655440010
   *                 resource_id: 660e8400-e29b-41d4-a716-446655440001
   *                 dome_id: 550e8400-e29b-41d4-a716-446655440000
   *                 log_type: IMPORT_EARTH
   *                 amount: 1000
   *                 mission_name: SUPPLY-MISSION-042
   *                 transfer_group: null
   *                 operator_id: 880e8400-e29b-41d4-a716-446655440020
   *                 metadata: null
   *                 notes: Monthly water supply delivery
   *                 created_at: 2024-11-29T10:30:00Z
   *       400:
   *         description: Invalid query parameters
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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