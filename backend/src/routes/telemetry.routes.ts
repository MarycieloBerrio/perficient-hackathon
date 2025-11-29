import { Router } from 'express';
import { TelemetryController } from '../controllers/telemetry.controller';

const router = Router();
const telemetryCtrl = new TelemetryController();

// History for a sensor
router.get('/history/:sensorId', telemetryCtrl.getHistory.bind(telemetryCtrl));

// Latest reading for a sensor
router.get('/latest/:sensorId', telemetryCtrl.getLatest.bind(telemetryCtrl));

// Ingest a new telemetry reading
router.post('/ingest', telemetryCtrl.ingest.bind(telemetryCtrl));

export default router;
