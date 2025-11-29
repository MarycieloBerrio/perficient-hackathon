// src/controllers/sensor.controller.ts
import { Request, Response, NextFunction } from 'express';
import { SensorService } from '../services/sensor.service';
import { createSensorSchema, updateSensorSchema } from '../dtos';

const sensorService = new SensorService();

export class SensorController {
  async getAllSensors(req: Request, res: Response, next: NextFunction) {
    try {
      const sensors = await sensorService.getAllSensors();
      res.json(sensors);
    } catch (err) {
      next(err);
    }
  }

  async getSensorsByDome(req: Request, res: Response, next: NextFunction) {
    try {
      const { domeId } = req.params;
      const sensors = await sensorService.getSensorsByDome(domeId);
      res.json(sensors);
    } catch (err) {
      next(err);
    }
  }

  async createSensor(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createSensorSchema.parse(req.body);
      const sensor = await sensorService.createSensor(input);
      res.status(201).json(sensor);
    } catch (err) {
      next(err);
    }
  }

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
