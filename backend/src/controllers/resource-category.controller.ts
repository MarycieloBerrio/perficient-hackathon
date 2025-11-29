// src/controllers/resource-category.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ResourceCategoryService } from '../services/resource-category.service';
import {
  createResourceCategorySchema,
  updateResourceCategorySchema,
} from '../dtos';

const categoryService = new ResourceCategoryService();

export class ResourceCategoryController {
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAllCategories();
      res.json(categories);
    } catch (err) {
      next(err);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createResourceCategorySchema.parse(req.body);
      const category = await categoryService.createCategory(input);
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const numericId = Number(id);
      if (Number.isNaN(numericId)) {
        return res.status(400).json({ message: 'Invalid category id' });
      }

      const input = updateResourceCategorySchema.parse(req.body);
      const category = await categoryService.updateCategory(numericId, input);
      res.json(category);
    } catch (err) {
      next(err);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const numericId = Number(id);
      if (Number.isNaN(numericId)) {
        return res.status(400).json({ message: 'Invalid category id' });
      }

      await categoryService.deleteCategory(numericId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
