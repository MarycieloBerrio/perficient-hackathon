// src/controllers/resource-category.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ResourceCategoryService } from '../services/resource-category.service';
import {
  createResourceCategorySchema,
  updateResourceCategorySchema,
} from '../dtos';

const categoryService = new ResourceCategoryService();

export class ResourceCategoryController {
  /**
   * @swagger
   * /api/resource-categories:
   *   get:
   *     summary: Get all resource categories
   *     description: Retrieve a list of all resource categories in the Mars colony
   *     tags: [Resource Categories]
   *     responses:
   *       200:
   *         description: List of resource categories retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     example: 1
   *                   key:
   *                     type: string
   *                     example: SUPPLIES
   *                   name:
   *                     type: string
   *                     example: Supplies
   *                   description:
   *                     type: string
   *                     nullable: true
   *                     example: Food, water, and general supplies
   *                   created_at:
   *                     type: string
   *                     format: date-time
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAllCategories();
      res.json(categories);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /api/resource-categories:
   *   post:
   *     summary: Create a new resource category
   *     description: Add a new category for organizing resources in the colony
   *     tags: [Resource Categories]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - key
   *               - name
   *             properties:
   *               key:
   *                 type: string
   *                 description: Unique category key identifier (uppercase, no spaces)
   *                 example: LIFE_SUPPORT
   *               name:
   *                 type: string
   *                 description: Human-readable category name
   *                 example: Life Support
   *               description:
   *                 type: string
   *                 nullable: true
   *                 description: Detailed description of the category
   *                 example: Oxygen, CO2 filters, and life support systems
   *     responses:
   *       201:
   *         description: Category created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 key:
   *                   type: string
   *                 name:
   *                   type: string
   *                 description:
   *                   type: string
   *                   nullable: true
   *                 created_at:
   *                   type: string
   *                   format: date-time
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createResourceCategorySchema.parse(req.body);
      const category = await categoryService.createCategory(input);
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /api/resource-categories/{id}:
   *   put:
   *     summary: Update a resource category
   *     description: Update the details of an existing resource category
   *     tags: [Resource Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Category ID to update
   *         example: 1
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               key:
   *                 type: string
   *                 description: Unique category key identifier
   *                 example: LIFE_SUPPORT
   *               name:
   *                 type: string
   *                 description: Human-readable category name
   *                 example: Life Support Systems
   *               description:
   *                 type: string
   *                 nullable: true
   *                 description: Detailed description of the category
   *                 example: Updated description for life support category
   *     responses:
   *       200:
   *         description: Category updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 key:
   *                   type: string
   *                 name:
   *                   type: string
   *                 description:
   *                   type: string
   *                   nullable: true
   *                 created_at:
   *                   type: string
   *                   format: date-time
   *       400:
   *         description: Invalid category ID or input data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Invalid category id
   *       404:
   *         description: Category not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/resource-categories/{id}:
   *   delete:
   *     summary: Delete a resource category
   *     description: Remove a resource category from the system
   *     tags: [Resource Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Category ID to delete
   *         example: 1
   *     responses:
   *       204:
   *         description: Category deleted successfully (no content)
   *       400:
   *         description: Invalid category ID
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Invalid category id
   *       404:
   *         description: Category not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
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