import { Router } from 'express';
import * as auditController from '../controllers/audit.controller.js';
import { protect, restrictTo } from '../../auth/middleware/auth.middleware.js';
import { auditQueryValidator, entityHistoryValidator } from '../validators/audit.validator.js';

const router = Router();
router.use(protect);
router.use(restrictTo('admin', 'hr'));

router.get('/', auditQueryValidator, auditController.getLogs);
router.get('/stats', auditController.getStats);
router.get(
    '/entity/:entityType/:entityId',
    entityHistoryValidator,
    auditController.getEntityHistory,
);
router.get('/:id', auditController.getLogById);

export default router;
