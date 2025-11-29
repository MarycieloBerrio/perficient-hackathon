// src/controllers/inventory.controller.ts
import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import {
  upsertInventorySchema,
  inventoryInboundSchema,
  inventoryTransferSchema,
} from '../dtos';

const inventoryService = new InventoryService();

export class InventoryController {
  /**
   * @swagger
   * /api/domes/{domeId}/inventory:
   *   get:
   *     summary: Get inventory by dome
   *     description: Retrieve all inventory items for a specific dome
   *     tags: [Inventory]
   *     parameters:
   *       - in: path
   *         name: domeId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Dome ID to get inventory from
   *     responses:
   *       200:
   *         description: Inventory retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   dome_id:
   *                     type: string
   *                     format: uuid
   *                   resource_id:
   *                     type: string
   *                     format: uuid
   *                   quantity:
   *                     type: number
   *                   reserved:
   *                     type: number
   *                   min_threshold:
   *                     type: number
   *                     nullable: true
   *                   max_threshold:
   *                     type: number
   *                     nullable: true
   *                   updated_at:
   *                     type: string
   *                     format: date-time
   *       404:
   *         description: Dome not found
   *       500:
   *         description: Internal server error
   */
  async getInventoryByDome(req: Request, res: Response, next: NextFunction) {
    try {
      const { domeId } = req.params;
      const inventory = await inventoryService.getInventoryByDome(domeId);
      res.json(inventory);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /api/inventory/upsert:
   *   put:
   *     summary: Upsert inventory
   *     description: Create or update inventory for a dome-resource pair
   *     tags: [Inventory]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - domeId
   *               - resourceId
   *             properties:
   *               domeId:
   *                 type: string
   *                 format: uuid
   *                 description: Target dome ID
   *                 example: 550e8400-e29b-41d4-a716-446655440000
   *               resourceId:
   *                 type: string
   *                 format: uuid
   *                 description: Resource ID
   *                 example: 660e8400-e29b-41d4-a716-446655440001
   *               quantity:
   *                 type: number
   *                 minimum: 0
   *                 default: 0
   *                 description: Available quantity
   *                 example: 1000
   *               reserved:
   *                 type: number
   *                 minimum: 0
   *                 default: 0
   *                 description: Reserved quantity
   *                 example: 50
   *               minThreshold:
   *                 type: number
   *                 nullable: true
   *                 description: Minimum threshold for alerts
   *                 example: 100
   *               maxThreshold:
   *                 type: number
   *                 nullable: true
   *                 description: Maximum threshold for alerts
   *                 example: 5000
   *     responses:
   *       200:
   *         description: Inventory upserted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 dome_id:
   *                   type: string
   *                   format: uuid
   *                 resource_id:
   *                   type: string
   *                   format: uuid
   *                 quantity:
   *                   type: number
   *                 reserved:
   *                   type: number
   *                 min_threshold:
   *                   type: number
   *                   nullable: true
   *                 max_threshold:
   *                   type: number
   *                   nullable: true
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
  async upsertInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const input = upsertInventorySchema.parse(req.body);
      const result = await inventoryService.upsertInventory(input);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /api/inventory/inbound:
   *   post:
   *     summary: Receive inbound supply
   *     description: Process incoming resources from Earth or external sources
   *     tags: [Inventory]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - domeId
   *               - items
   *             properties:
   *               domeId:
   *                 type: string
   *                 format: uuid
   *                 description: Destination dome ID
   *                 example: 550e8400-e29b-41d4-a716-446655440000
   *               missionName:
   *                 type: string
   *                 description: Supply mission identifier
   *                 example: SUPPLY-MISSION-042
   *               operatorId:
   *                 type: string
   *                 format: uuid
   *                 description: Operator processing the inbound
   *                 example: 770e8400-e29b-41d4-a716-446655440002
   *               items:
   *                 type: array
   *                 minItems: 1
   *                 description: List of resources being received
   *                 items:
   *                   type: object
   *                   required:
   *                     - resourceId
   *                     - amount
   *                   properties:
   *                     resourceId:
   *                       type: string
   *                       format: uuid
   *                       description: Resource ID
   *                       example: 660e8400-e29b-41d4-a716-446655440001
   *                     amount:
   *                       type: number
   *                       minimum: 0.01
   *                       description: Quantity received
   *                       example: 500
   *     responses:
   *       201:
   *         description: Inbound supply processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 domeId:
   *                   type: string
   *                   format: uuid
   *                 missionName:
   *                   type: string
   *                   nullable: true
   *                 items:
   *                   type: array
   *                   items:
   *                     type: object
   *                 inventory:
   *                   type: array
   *                   description: Updated inventory for the dome
   *       400:
   *         description: Invalid input data
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
  async inbound(req: Request, res: Response, next: NextFunction) {
    try {
      const input = inventoryInboundSchema.parse(req.body);
      const result = await inventoryService.receiveInbound(input);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * @swagger
   * /api/inventory/transfer:
   *   post:
   *     summary: Transfer resources between domes
   *     description: Move resources from one dome to another within the colony
   *     tags: [Inventory]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fromDomeId
   *               - toDomeId
   *               - resourceId
   *               - amount
   *             properties:
   *               fromDomeId:
   *                 type: string
   *                 format: uuid
   *                 description: Source dome ID
   *                 example: 550e8400-e29b-41d4-a716-446655440000
   *               toDomeId:
   *                 type: string
   *                 format: uuid
   *                 description: Destination dome ID
   *                 example: 550e8400-e29b-41d4-a716-446655440003
   *               resourceId:
   *                 type: string
   *                 format: uuid
   *                 description: Resource to transfer
   *                 example: 660e8400-e29b-41d4-a716-446655440001
   *               amount:
   *                 type: number
   *                 minimum: 0.01
   *                 description: Quantity to transfer
   *                 example: 250
   *               operatorId:
   *                 type: string
   *                 format: uuid
   *                 description: Operator authorizing the transfer
   *                 example: 770e8400-e29b-41d4-a716-446655440002
   *     responses:
   *       200:
   *         description: Transfer completed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 transferGroup:
   *                   type: string
   *                   format: uuid
   *                   description: Transfer transaction ID
   *                 fromDomeId:
   *                   type: string
   *                   format: uuid
   *                 toDomeId:
   *                   type: string
   *                   format: uuid
   *                 resourceId:
   *                   type: string
   *                   format: uuid
   *                 amount:
   *                   type: number
   *                 sourceInventory:
   *                   type: array
   *                   description: Updated source dome inventory
   *                 targetInventory:
   *                   type: array
   *                   description: Updated target dome inventory
   *       400:
   *         description: Invalid input data or insufficient quantity
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   */
  async transfer(req: Request, res: Response, next: NextFunction) {
    try {
      const input = inventoryTransferSchema.parse(req.body);
      const result = await inventoryService.transferResources(input);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}