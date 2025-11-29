// src/controllers/telemetry.controller.ts
import { Request, Response, NextFunction } from 'express';
import { TelemetryService } from '../services/telemetry.service';
import { ingestTelemetrySchema, telemetryQuerySchema } from '../dtos';

const telemetryService = new TelemetryService();

export class TelemetryController {
  /**
   * @swagger
   * /api/telemetry/history/{sensorId}:
   *   get:
   *     summary: Get sensor telemetry history
   *     description: Retrieve historical telemetry readings for a specific sensor with optional date range filtering
   *     tags: [Telemetry]
   *     parameters:
   *       - in: path
   *         name: sensorId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Sensor ID to get telemetry from
   *         example: 770e8400-e29b-41d4-a716-446655440010
   *       - in: query
   *         name: from
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Start date/time for filtering (ISO 8601 format)
   *         example: 2024-11-01T00:00:00Z
   *       - in: query
   *         name: to
   *         schema:
   *           type: string
   *           format: date-time
   *         description: End date/time for filtering (ISO 8601 format)
   *         example: 2024-11-30T23:59:59Z
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 500
   *           maximum: 2000
   *           minimum: 1
   *         description: Maximum number of readings to return
   *         example: 100
   *     responses:
   *       200:
   *         description: Telemetry history retrieved successfully
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
   *                     description: Reading ID
   *                   sensor_id:
   *                     type: string
   *                     format: uuid
   *                     description: Sensor ID
   *                   value:
   *                     type: number
   *                     description: Sensor reading value
   *                   created_at:
   *                     type: string
   *                     format: date-time
   *                     description: Timestamp of the reading
   *             example:
   *               - id: 880e8400-e29b-41d4-a716-446655440020
   *                 sensor_id: 770e8400-e29b-41d4-a716-446655440010
   *                 value: 21.5
   *                 created_at: 2024-11-29T10:30:00Z
   *               - id: 880e8400-e29b-41d4-a716-446655440021
   *                 sensor_id: 770e8400-e29b-41d4-a716-446655440010
   *                 value: 21.3
   *                 created_at: 2024-11-29T10:25:00Z
   *       400:
   *         description: Invalid query parameters
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Sensor not found
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/telemetry/latest/{sensorId}:
   *   get:
   *     summary: Get latest sensor reading
   *     description: Retrieve the most recent telemetry reading for a specific sensor
   *     tags: [Telemetry]
   *     parameters:
   *       - in: path
   *         name: sensorId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Sensor ID to get latest reading from
   *         example: 770e8400-e29b-41d4-a716-446655440010
   *     responses:
   *       200:
   *         description: Latest telemetry reading retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   format: uuid
   *                   description: Reading ID
   *                 sensor_id:
   *                   type: string
   *                   format: uuid
   *                   description: Sensor ID
   *                 value:
   *                   type: number
   *                   description: Sensor reading value
   *                 created_at:
   *                   type: string
   *                   format: date-time
   *                   description: Timestamp of the reading
   *             example:
   *               id: 880e8400-e29b-41d4-a716-446655440020
   *               sensor_id: 770e8400-e29b-41d4-a716-446655440010
   *               value: 21.5
   *               created_at: 2024-11-29T10:30:00Z
   *       404:
   *         description: No telemetry data found for this sensor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: No telemetry for this sensor
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/telemetry/ingest:
   *   post:
   *     summary: Ingest telemetry reading
   *     description: Record a new telemetry reading from a sensor (used by IoT devices and simulators)
   *     tags: [Telemetry]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - sensorId
   *               - value
   *             properties:
   *               sensorId:
   *                 type: string
   *                 format: uuid
   *                 description: Sensor ID that generated the reading
   *                 example: 770e8400-e29b-41d4-a716-446655440010
   *               value:
   *                 type: number
   *                 description: Sensor reading value
   *                 example: 21.5
   *               createdAt:
   *                 type: string
   *                 format: date-time
   *                 description: Timestamp of the reading (optional, defaults to current time)
   *                 example: 2024-11-29T10:30:00Z
   *     responses:
   *       201:
   *         description: Telemetry reading ingested successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   format: uuid
   *                   description: Reading ID
   *                 sensor_id:
   *                   type: string
   *                   format: uuid
   *                   description: Sensor ID
   *                 value:
   *                   type: number
   *                   description: Sensor reading value
   *                 created_at:
   *                   type: string
   *                   format: date-time
   *                   description: Timestamp of the reading
   *             example:
   *               id: 880e8400-e29b-41d4-a716-446655440020
   *               sensor_id: 770e8400-e29b-41d4-a716-446655440010
   *               value: 21.5
   *               created_at: 2024-11-29T10:30:00Z
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Sensor not found
   *       500:
   *         description: Internal server error
   */
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