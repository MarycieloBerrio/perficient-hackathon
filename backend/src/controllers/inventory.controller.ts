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
  async getInventoryByDome(req: Request, res: Response, next: NextFunction) {
    try {
      const { domeId } = req.params;
      const inventory = await inventoryService.getInventoryByDome(domeId);
      res.json(inventory);
    } catch (err) {
      next(err);
    }
  }

  async upsertInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const input = upsertInventorySchema.parse(req.body);
      const result = await inventoryService.upsertInventory(input);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async inbound(req: Request, res: Response, next: NextFunction) {
    try {
      const input = inventoryInboundSchema.parse(req.body);
      const result = await inventoryService.receiveInbound(input);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

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
