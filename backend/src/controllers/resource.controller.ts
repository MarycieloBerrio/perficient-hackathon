// src/controllers/resource.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ResourceService } from '../services/resource.service';
import { createResourceSchema, updateResourceSchema } from '../dtos';

const resourceService = new ResourceService();

export class ResourceController {
  async getAllResources(req: Request, res: Response, next: NextFunction) {
    try {
      const resources = await resourceService.getAllResources();
      res.json(resources);
    } catch (err) {
      next(err);
    }
  }

  async getResourceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resource = await resourceService.getResourceById(id);

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      res.json(resource);
    } catch (err) {
      next(err);
    }
  }

  async createResource(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createResourceSchema.parse(req.body);
      const resource = await resourceService.createResource(input);
      res.status(201).json(resource);
    } catch (err) {
      next(err);
    }
  }

  async updateResource(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const input = updateResourceSchema.parse(req.body);
      const resource = await resourceService.updateResource(id, input);
      res.json(resource);
    } catch (err) {
      next(err);
    }
  }

  async deleteResource(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await resourceService.deleteResource(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
