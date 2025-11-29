import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';

const router = Router();
const alertCtrl = new AlertController();

// List alerts with filters (?domeId=&resourceId=&level=&onlyActive=&limit=)
router.get('/', alertCtrl.listAlerts.bind(alertCtrl));

// Create new alert
router.post('/', alertCtrl.createAlert.bind(alertCtrl));

// Acknowledge alert
router.post('/:id/ack', alertCtrl.acknowledge.bind(alertCtrl));

export default router;
