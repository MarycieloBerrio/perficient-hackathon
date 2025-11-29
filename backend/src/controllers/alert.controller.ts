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
  /**
   * @swagger
   * /api/alerts:
   *   get:
   *     summary: List alerts with optional filters
   *     description: Retrieve a filtered list of alerts from the Mars colony system
   *     tags: [Alerts]
   *     parameters:
   *       - in: query
   *         name: domeId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Filter alerts by dome ID
   *       - in: query
   *         name: resourceId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Filter alerts by resource ID
   *       - in: query
   *         name: level
   *         schema:
   *           type: string
   *           enum: [INFO, WARNING, CRITICAL]
   *         description: Filter alerts by severity level
   *       - in: query
   *         name: onlyActive
   *         schema:
   *           type: boolean
   *           default: true
   *         description: Show only active alerts
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 50
   *           maximum: 200
   *         description: Maximum number of alerts to return
   *     responses:
   *       200:
   *         description: List of alerts successfully retrieved
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Alert'
   *       400:
   *         description: Invalid filter parameters
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/alerts:
   *   post:
   *     summary: Create a new alert
   *     description: Generate a new alert for the Mars colony monitoring system
   *     tags: [Alerts]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - code
   *               - level
   *               - message
   *             properties:
   *               code:
   *                 type: string
   *                 description: Alert code identifier
   *                 example: LOW_OXYGEN
   *               level:
   *                 type: string
   *                 enum: [INFO, WARNING, CRITICAL]
   *                 description: Severity level of the alert
   *                 example: CRITICAL
   *               message:
   *                 type: string
   *                 description: Detailed alert message
   *                 example: Oxygen level below critical threshold in Dome A
   *               domeId:
   *                 type: string
   *                 format: uuid
   *                 description: Associated dome ID (optional)
   *               resourceId:
   *                 type: string
   *                 format: uuid
   *                 description: Associated resource ID (optional)
   *               sensorId:
   *                 type: string
   *                 format: uuid
   *                 description: Associated sensor ID (optional)
   *     responses:
   *       201:
   *         description: Alert created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Alert'
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
  async createAlert(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createAlertSchema.parse(req.body);
      const alert = await alertService.createAlert(input);
      res.status(201).json(alert);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /api/alerts/{id}/ack:
   *   post:
   *     summary: Acknowledge an alert
   *     description: Mark an alert as acknowledged and deactivate it
   *     tags: [Alerts]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Alert ID to acknowledge
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               acknowledgedBy:
   *                 type: string
   *                 description: ID or name of the operator acknowledging the alert
   *                 example: operator-john-doe
   *     responses:
   *       200:
   *         description: Alert acknowledged successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Alert'
   *       400:
   *         description: Invalid alert ID or input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Alert not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
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