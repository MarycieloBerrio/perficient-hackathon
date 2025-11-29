// src/controllers/dome.controller.ts
import { Request, Response, NextFunction } from 'express';
import { DomeService } from '../services/dome.service';
import { createDomeSchema, updateDomeSchema } from '../dtos';

const domeService = new DomeService();

export class DomeController {
  /**
   * @swagger
   * /api/domes:
   *   get:
   *     summary: Get all domes
   *     description: Retrieve a list of all domes in the Mars colony
   *     tags: [Domes]
   *     responses:
   *       200:
   *         description: List of domes successfully retrieved
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Dome'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getAllDomes(req: Request, res: Response, next: NextFunction) {
    try {
      const domes = await domeService.getAllDomes();
      res.json(domes);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /api/domes/{id}:
   *   get:
   *     summary: Get dome by ID
   *     description: Retrieve detailed information about a specific dome
   *     tags: [Domes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Unique dome identifier
   *     responses:
   *       200:
   *         description: Dome found successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Dome'
   *       404:
   *         description: Dome not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Dome not found
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/domes:
   *   post:
   *     summary: Create a new dome
   *     description: Add a new dome to the Mars colony infrastructure
   *     tags: [Domes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - code
   *               - name
   *               - domeType
   *             properties:
   *               code:
   *                 type: string
   *                 description: Unique dome code identifier
   *                 example: DOME-01
   *               name:
   *                 type: string
   *                 description: Dome name
   *                 example: Main Habitation Dome
   *               domeType:
   *                 type: string
   *                 description: Type of dome facility
   *                 example: HABITATION
   *                 enum: [HABITATION, AGRICULTURE, INDUSTRIAL, COMMAND]
   *               status:
   *                 type: string
   *                 description: Operational status
   *                 default: OPERATIONAL
   *                 example: OPERATIONAL
   *                 enum: [OPERATIONAL, MAINTENANCE, OFFLINE]
   *               alertLevel:
   *                 type: integer
   *                 description: Current alert level (0 = no alerts)
   *                 default: 0
   *                 minimum: 0
   *                 example: 0
   *     responses:
   *       201:
   *         description: Dome created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Dome'
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
  async createDome(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createDomeSchema.parse(req.body);
      const dome = await domeService.createDome(input);
      res.status(201).json(dome);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /api/domes/{id}:
   *   put:
   *     summary: Update a dome
   *     description: Update the details of an existing dome
   *     tags: [Domes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Dome ID to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               code:
   *                 type: string
   *                 description: Unique dome code identifier
   *                 example: DOME-01
   *               name:
   *                 type: string
   *                 description: Dome name
   *                 example: Main Habitation Dome
   *               domeType:
   *                 type: string
   *                 description: Type of dome facility
   *                 example: HABITATION
   *               status:
   *                 type: string
   *                 description: Operational status
   *                 example: MAINTENANCE
   *               alertLevel:
   *                 type: integer
   *                 description: Current alert level
   *                 example: 2
   *     responses:
   *       200:
   *         description: Dome updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Dome'
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Dome not found
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/domes/{id}:
   *   delete:
   *     summary: Delete a dome
   *     description: Remove a dome from the Mars colony infrastructure
   *     tags: [Domes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Dome ID to delete
   *     responses:
   *       204:
   *         description: Dome deleted successfully (no content)
   *       404:
   *         description: Dome not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
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