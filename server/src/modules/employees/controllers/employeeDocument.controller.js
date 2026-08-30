import * as employeeDao from '../../../dao/employee.dao.js';
import { uploadImageOnImageKit } from '../../../services/image.service.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * Upload a document for the authenticated employee (Self-Service)
 */
export async function uploadMyDocument(req, res, next) {
    try {
        const employee = await employeeDao.getEmployeeByUserId(req.user.id);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'No employee record linked to this user account',
                success: false,
            });
        }

        if (!req.file) {
            return sendResponse({
                res,
                statusCode: 400,
                message:
                    'No document file provided. Send file under the "file" or "document" field.',
                success: false,
            });
        }

        const { documentType, fileName } = req.body;

        const uploadedFile = await uploadImageOnImageKit({ image: req.file });
        const documentRecord = await employeeDao.createEmployeeDocument({
            employeeId: employee.id,
            documentType,
            fileName: fileName || req.file.originalname,
            fileUrl: uploadedFile.url,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
            uploadedBy: req.user.id,
        });

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Document uploaded successfully',
            success: true,
            data: { document: documentRecord },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get all documents for the authenticated employee (Self-Service)
 */
export async function getMyDocuments(req, res, next) {
    try {
        const employee = await employeeDao.getEmployeeByUserId(req.user.id);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'No employee record linked to this user account',
                success: false,
            });
        }

        const docs = await employeeDao.getEmployeeDocuments(employee.id);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee documents retrieved successfully',
            success: true,
            data: { documents: docs },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete a document uploaded by the authenticated employee (Self-Service)
 */
export async function deleteMyDocument(req, res, next) {
    try {
        const { docId } = req.params;
        const employee = await employeeDao.getEmployeeByUserId(req.user.id);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'No employee record linked to this user account',
                success: false,
            });
        }

        const doc = await employeeDao.getEmployeeDocumentById(docId);
        if (!doc || doc.employeeId !== employee.id) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Document not found or does not belong to your account',
                success: false,
            });
        }

        await employeeDao.deleteEmployeeDocument(docId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Document deleted successfully',
            success: true,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get all documents of an employee (Admin / HR)
 */
export async function getEmployeeDocuments(req, res, next) {
    try {
        const { employeeId } = req.params;
        const employee = await employeeDao.getEmployeeById(employeeId);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee not found',
                success: false,
            });
        }

        const docs = await employeeDao.getEmployeeDocuments(employeeId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee documents retrieved successfully',
            success: true,
            data: { documents: docs },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Upload a document to an employee profile (Admin / HR)
 */
export async function uploadEmployeeDocument(req, res, next) {
    try {
        const { employeeId } = req.params;
        const employee = await employeeDao.getEmployeeById(employeeId);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee not found',
                success: false,
            });
        }

        if (!req.file) {
            return sendResponse({
                res,
                statusCode: 400,
                message:
                    'No document file provided. Send file under the "file" or "document" field.',
                success: false,
            });
        }

        const { documentType, fileName } = req.body;

        const uploadedFile = await uploadImageOnImageKit({ image: req.file });
        const documentRecord = await employeeDao.createEmployeeDocument({
            employeeId,
            documentType,
            fileName: fileName || req.file.originalname,
            fileUrl: uploadedFile.url,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
            uploadedBy: req.user.id,
        });

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Employee document uploaded successfully',
            success: true,
            data: { document: documentRecord },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete an employee document (Admin / HR)
 */
export async function deleteEmployeeDocument(req, res, next) {
    try {
        const { employeeId, docId } = req.params;
        const doc = await employeeDao.getEmployeeDocumentById(docId);
        if (!doc || (employeeId && doc.employeeId !== employeeId)) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Document not found for this employee',
                success: false,
            });
        }

        await employeeDao.deleteEmployeeDocument(docId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee document deleted successfully',
            success: true,
        });
    } catch (error) {
        next(error);
    }
}
