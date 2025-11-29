import { Router } from 'express';
import { ResourceLogController } from '../controllers/resource-log.controller';

const router = Router();
const logCtrl = new ResourceLogController();

router.get('/', logCtrl.listLogs.bind(logCtrl));

export default router;
