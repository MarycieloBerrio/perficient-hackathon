import { Router } from 'express';
import { ResourceCategoryController } from '../controllers/resource-category.controller';

const router = Router();
const categoryCtrl = new ResourceCategoryController();

router.get('/', categoryCtrl.getAllCategories.bind(categoryCtrl));
router.post('/', categoryCtrl.createCategory.bind(categoryCtrl));
router.put('/:id', categoryCtrl.updateCategory.bind(categoryCtrl));
router.delete('/:id', categoryCtrl.deleteCategory.bind(categoryCtrl));

export default router;
