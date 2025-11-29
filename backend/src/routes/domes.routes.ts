import { Router } from 'express';
import { DomeController } from '../controllers/dome.controller';
import { InventoryController } from '../controllers/inventory.controller';
import { SensorController } from '../controllers/sensor.controller';

const router = Router();

const domeCtrl = new DomeController();
const inventoryCtrl = new InventoryController();
const sensorCtrl = new SensorController();

// Dome CRUD
router.get('/', domeCtrl.getAllDomes.bind(domeCtrl));
router.get('/:id', domeCtrl.getDomeById.bind(domeCtrl));
router.post('/', domeCtrl.createDome.bind(domeCtrl));
router.put('/:id', domeCtrl.updateDome.bind(domeCtrl));
router.delete('/:id', domeCtrl.deleteDome.bind(domeCtrl));

// Nested: inventory per dome
router.get(
  '/:domeId/inventory',
  inventoryCtrl.getInventoryByDome.bind(inventoryCtrl)
);

// Nested: sensors per dome
router.get('/:domeId/sensors', sensorCtrl.getSensorsByDome.bind(sensorCtrl));

export default router;
