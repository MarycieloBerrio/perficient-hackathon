// src/controllers/resource.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ResourceService } from '../services/resource.service';
import { createResourceSchema, updateResourceSchema } from '../dtos';

const resourceService = new ResourceService();

export class ResourceController {
  /**
   * @swagger
   * /api/resources:
   *   get:
   *     summary: Get all resources
   *     description: Retrieve a list of all resources available in the Mars colony
   *     tags: [Resources]
   *     responses:
   *       200:
   *         description: List of resources retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Resource'
   *             example:
   *               - id: 660e8400-e29b-41d4-a716-446655440001
   *                 code: WATER
   *                 name: Water
   *                 category_id: 1
   *                 unit: L
   *                 is_vital: true
   *                 subcategory: Potable
   *                 metadata: null
   *                 created_at: 2024-11-29T10:00:00Z
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getAllResources(req: Request, res: Response, next: NextFunction) {
    try {
      const resources = await resourceService.getAllResources();
      res.json(resources);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /api/resources/{id}:
   *   get:
   *     summary: Get resource by ID
   *     description: Retrieve detailed information about a specific resource
   *     tags: [Resources]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Resource ID
   *         example: 660e8400-e29b-41d4-a716-446655440001
   *     responses:
   *       200:
   *         description: Resource found successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Resource'
   *       404:
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Resource not found
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/resources:
   *   post:
   *     summary: Create a new resource
   *     description: Add a new resource type to the Mars colony inventory system
   *     tags: [Resources]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - code
   *               - name
   *               - categoryId
   *               - unit
   *             properties:
   *               code:
   *                 type: string
   *                 description: Unique resource code identifier (uppercase)
   *                 example: OXYGEN
   *               name:
   *                 type: string
   *                 description: Human-readable resource name
   *                 example: Oxygen
   *               categoryId:
   *                 type: integer
   *                 description: Resource category ID
   *                 example: 5
   *               unit:
   *                 type: string
   *                 description: Unit of measurement
   *                 example: kg
   *               isVital:
   *                 type: boolean
   *                 description: Whether this resource is critical for survival
   *                 default: false
   *                 example: true
   *               subcategory:
   *                 type: string
   *                 nullable: true
   *                 description: Optional subcategory for resource classification
   *                 example: Compressed
   *               metadata:
   *                 type: object
   *                 nullable: true
   *                 description: Additional metadata (JSON object)
   *                 example:
   *                   storage_temperature: -183
   *                   density: 1.429
   *     responses:
   *       201:
   *         description: Resource created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Resource'
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
  async createResource(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createResourceSchema.parse(req.body);
      const resource = await resourceService.createResource(input);
      res.status(201).json(resource);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /api/resources/{id}:
   *   put:
   *     summary: Update a resource
   *     description: Update the details of an existing resource
   *     tags: [Resources]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Resource ID to update
   *         example: 660e8400-e29b-41d4-a716-446655440001
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               code:
   *                 type: string
   *                 description: Unique resource code identifier
   *                 example: OXYGEN
   *               name:
   *                 type: string
   *                 description: Human-readable resource name
   *                 example: Oxygen Gas
   *               categoryId:
   *                 type: integer
   *                 description: Resource category ID
   *                 example: 5
   *               unit:
   *                 type: string
   *                 description: Unit of measurement
   *                 example: kg
   *               isVital:
   *                 type: boolean
   *                 description: Whether this resource is critical for survival
   *                 example: true
   *               subcategory:
   *                 type: string
   *                 nullable: true
   *                 description: Optional subcategory
   *                 example: Compressed
   *               metadata:
   *                 type: object
   *                 nullable: true
   *                 description: Additional metadata
   *     responses:
   *       200:
   *         description: Resource updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Resource'
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Resource not found
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/resources/{id}:
   *   delete:
   *     summary: Delete a resource
   *     description: Remove a resource from the Mars colony system
   *     tags: [Resources]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Resource ID to delete
   *         example: 660e8400-e29b-41d4-a716-446655440001
   *     responses:
   *       204:
   *         description: Resource deleted successfully (no content)
   *       404:
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
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