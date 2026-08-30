import { Router } from 'express';
import multer from 'multer';
import * as profileController from '../controllers/profile.controller.js';
import * as privateInfoController from '../controllers/privateInfo.controller.js';
import * as profileMediaController from '../controllers/profileMedia.controller.js';
import * as employeeDocumentController from '../controllers/employeeDocument.controller.js';
import { protect } from '../../auth/middleware/auth.middleware.js';
import {
    updateProfileValidator,
    updatePrivateInfoValidator,
    uploadDocumentValidator,
    documentIdParamValidator,
} from '../validators/employee.validator.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Protect all profile self-service routes
router.use(protect);

// ── My Profile ───────────────────────────────────────────────────────────
router.get('/me', profileController.getMyProfile);
router.patch('/me', updateProfileValidator, profileController.updateMyProfile);

// ── Profile Picture / Avatar ──────────────────────────────────────────────
router.post('/me/avatar', upload.single('avatar'), profileMediaController.uploadAvatar);
router.delete('/me/avatar', profileMediaController.deleteAvatar);

// ── Private Info ─────────────────────────────────────────────────────────
router.get('/me/private-info', privateInfoController.getMyPrivateInfo);
router.patch(
    '/me/private-info',
    updatePrivateInfoValidator,
    privateInfoController.updateMyPrivateInfo,
);

// ── Documents ────────────────────────────────────────────────────────────
router.get('/me/documents', employeeDocumentController.getMyDocuments);
router.post(
    '/me/documents',
    upload.single('file'),
    uploadDocumentValidator,
    employeeDocumentController.uploadMyDocument,
);
router.delete(
    '/me/documents/:docId',
    documentIdParamValidator,
    employeeDocumentController.deleteMyDocument,
);

export default router;
