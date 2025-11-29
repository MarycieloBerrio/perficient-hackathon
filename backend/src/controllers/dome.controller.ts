// src/controllers/dome.controller.ts
import { Request, Response, NextFunction } from 'express';
import { DomeService } from '../services/dome.service';
import { createDomeSchema, updateDomeSchema } from '../dtos';

const domeService = new DomeService();

export class DomeController {
  async getAllDomes(req: Request, res: Response, next: NextFunction) {
    try {
      const domes = await domeService.getAllDomes();
      res.json(domes);
    } catch (err) {
      next(err);
    }
  }

  async getDomeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dome = await domeService.getDomeById(id);

      if (!dome) {
        return res.status(404).json({ message: 'Dome not found' });
      }

      res.json(dome);
    } catch (err) {
      next(err);
    }
  }

  async createDome(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createDomeSchema.parse(req.body);
      const dome = await domeService.createDome(input);
      res.status(201).json(dome);
    } catch (err) {
      next(err);
    }
  }

  async updateDome(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const input = updateDomeSchema.parse(req.body);
      const dome = await domeService.updateDome(id, input);
      res.json(dome);
    } catch (err) {
      next(err);
    }
  }

  async deleteDome(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await domeService.deleteDome(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
