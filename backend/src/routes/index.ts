import { Router } from 'express';
import domesRouter from './domes.routes';
import resourceCategoriesRouter from './resource-categories.routes';
import resourcesRouter from './resources.routes';
import inventoryRouter from './inventory.routes';
import resourceLogsRouter from './resource-logs.routes';
import telemetryRouter from './telemetry.routes';
import alertsRouter from './alerts.routes';
import sensorsRouter from './sensors.routes';

const router = Router();

// Domes + nested inventory & sensors
router.use('/domes', domesRouter);

// Resource categories
router.use('/resource-categories', resourceCategoriesRouter);

// Resources
router.use('/resources', resourcesRouter);

// Inventory operations (upsert/inbound/transfer)
router.use('/inventory', inventoryRouter);

// Resource logs (ledger)
router.use('/resource-logs', resourceLogsRouter);

// Telemetry (history/latest/ingest)
router.use('/telemetry', telemetryRouter);

// Alerts (list/create/ack)
router.use('/alerts', alertsRouter);

// Sensors (global CRUD)
router.use('/sensors', sensorsRouter);

export default router;
