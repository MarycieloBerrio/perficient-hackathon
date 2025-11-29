import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller';

const router = Router();
const resourceCtrl = new ResourceController();

router.get('/', resourceCtrl.getAllResources.bind(resourceCtrl));
router.get('/:id', resourceCtrl.getResourceById.bind(resourceCtrl));
router.post('/', resourceCtrl.createResource.bind(resourceCtrl));
router.put('/:id', resourceCtrl.updateResource.bind(resourceCtrl));
router.delete('/:id', resourceCtrl.deleteResource.bind(resourceCtrl));

export default router;
