import { Router } from 'express';
import { SensorController } from '../controllers/sensor.controller';

const router = Router();
const sensorCtrl = new SensorController();

// All sensors
router.get('/', sensorCtrl.getAllSensors.bind(sensorCtrl));

// Create sensor
router.post('/', sensorCtrl.createSensor.bind(sensorCtrl));

// Update sensor
router.put('/:id', sensorCtrl.updateSensor.bind(sensorCtrl));

// Delete sensor
router.delete('/:id', sensorCtrl.deleteSensor.bind(sensorCtrl));

export default router;
