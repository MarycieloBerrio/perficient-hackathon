import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';

const router = Router();
const inventoryCtrl = new InventoryController();

// Upsert inventory for a dome/resource pair
router.put('/upsert', inventoryCtrl.upsertInventory.bind(inventoryCtrl));

// Inbound supply (IMPORT_EARTH logs)
router.post('/inbound', inventoryCtrl.inbound.bind(inventoryCtrl));

// Transfer between domes
router.post('/transfer', inventoryCtrl.transfer.bind(inventoryCtrl));

export default router;
