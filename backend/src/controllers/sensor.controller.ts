// src/controllers/sensor.controller.ts
import { Request, Response, NextFunction } from 'express';
import { SensorService } from '../services/sensor.service';
import { createSensorSchema, updateSensorSchema } from '../dtos';

const sensorService = new SensorService();

export class SensorController {
  /**
   * @swagger
   * /api/sensors:
   *   get:
   *     summary: Get all sensors
   *     description: Retrieve a list of all sensors across the Mars colony
   *     tags: [Sensors]
   *     responses:
   *       200:
   *         description: List of sensors retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Sensor'
   *             example:
   *               - id: 770e8400-e29b-41d4-a716-446655440010
   *                 code: TEMP-DOME-A-01
   *                 name: Temperature Sensor Dome A Section 1
   *                 category: ENVIRONMENT
   *                 unit: °C
   *                 dome_id: 550e8400-e29b-41d4-a716-446655440000
   *                 is_critical: true
   *                 metadata: null
   *                 created_at: 2024-11-29T10:00:00Z
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getAllSensors(req: Request, res: Response, next: NextFunction) {
    try {
      const sensors = await sensorService.getAllSensors();
      res.json(sensors);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /api/domes/{domeId}/sensors:
   *   get:
   *     summary: Get sensors by dome
   *     description: Retrieve all sensors installed in a specific dome
   *     tags: [Sensors]
   *     parameters:
   *       - in: path
   *         name: domeId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Dome ID to get sensors from
   *         example: 550e8400-e29b-41d4-a716-446655440000
   *     responses:
   *       200:
   *         description: Sensors retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Sensor'
   *       404:
   *         description: Dome not found
   *       500:
   *         description: Internal server error
   */
  async getSensorsByDome(req: Request, res: Response, next: NextFunction) {
    try {
      const { domeId } = req.params;
      const sensors = await sensorService.getSensorsByDome(domeId);
      res.json(sensors);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /api/sensors:
   *   post:
   *     summary: Create a new sensor
   *     description: Register a new sensor in the Mars colony monitoring system
   *     tags: [Sensors]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - code
   *               - name
   *               - category
   *               - unit
   *             properties:
   *               code:
   *                 type: string
   *                 description: Unique sensor code identifier
   *                 example: O2-SENSOR-DOME-A-01
   *               name:
   *                 type: string
   *                 description: Human-readable sensor name
   *                 example: Oxygen Sensor Dome A Section 1
   *               category:
   *                 type: string
   *                 enum: [LIFE_SUPPORT, POWER, ENVIRONMENT, STRUCTURE]
   *                 description: Sensor category
   *                 example: LIFE_SUPPORT
   *               unit:
   *                 type: string
   *                 description: Unit of measurement
   *                 example: "%"
   *               domeId:
   *                 type: string
   *                 format: uuid
   *                 nullable: true
   *                 description: Dome where sensor is installed (optional for global sensors)
   *                 example: 550e8400-e29b-41d4-a716-446655440000
   *               isCritical:
   *                 type: boolean
   *                 description: Whether sensor monitors critical systems
   *                 default: false
   *                 example: true
   *               metadata:
   *                 type: object
   *                 nullable: true
   *                 description: Additional sensor metadata (JSON object)
   *                 example:
   *                   manufacturer: Mars Tech Inc
   *                   model: OXY-3000
   *                   calibration_date: 2024-11-01
   *     responses:
   *       201:
   *         description: Sensor created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Sensor'
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
  async createSensor(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createSensorSchema.parse(req.body);
      const sensor = await sensorService.createSensor(input);
      res.status(201).json(sensor);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /api/sensors/{id}:
   *   put:
   *     summary: Update a sensor
   *     description: Update the details of an existing sensor
   *     tags: [Sensors]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Sensor ID to update
   *         example: 770e8400-e29b-41d4-a716-446655440010
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               code:
   *                 type: string
   *                 description: Unique sensor code identifier
   *                 example: O2-SENSOR-DOME-A-01-V2
   *               name:
   *                 type: string
   *                 description: Human-readable sensor name
   *                 example: Oxygen Sensor Dome A Section 1 (Upgraded)
   *               category:
   *                 type: string
   *                 enum: [LIFE_SUPPORT, POWER, ENVIRONMENT, STRUCTURE]
   *                 description: Sensor category
   *                 example: LIFE_SUPPORT
   *               unit:
   *                 type: string
   *                 description: Unit of measurement
   *                 example: "%"
   *               domeId:
   *                 type: string
   *                 format: uuid
   *                 nullable: true
   *                 description: Dome where sensor is installed
   *                 example: 550e8400-e29b-41d4-a716-446655440000
   *               isCritical:
   *                 type: boolean
   *                 description: Whether sensor monitors critical systems
   *                 example: true
   *               metadata:
   *                 type: object
   *                 nullable: true
   *                 description: Additional sensor metadata
   *     responses:
   *       200:
   *         description: Sensor updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Sensor'
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
  async updateSensor(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const input = updateSensorSchema.parse(req.body);
      const sensor = await sensorService.updateSensor(id, input);
      res.json(sensor);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /api/sensors/{id}:
   *   delete:
   *     summary: Delete a sensor
   *     description: Remove a sensor from the Mars colony monitoring system
   *     tags: [Sensors]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Sensor ID to delete
   *         example: 770e8400-e29b-41d4-a716-446655440010
   *     responses:
   *       204:
   *         description: Sensor deleted successfully (no content)
   *       404:
   *         description: Sensor not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
  async deleteSensor(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await sensorService.deleteSensor(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}