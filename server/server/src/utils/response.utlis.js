import jwt from 'jsonwebtoken';
import envConfig from '../config/env.config.js';

/**
 * Centralised response structure
 */
export async function sendResponse({
    res,
    statusCode,
    message,
    success,
    error = null,
    ...additionalData
}) {
    return res.status(statusCode).json({
        message,
        success,
        error,
        ...additionalData,
    });
}

/**
 * Set the JWT token cookie on response
 */
export function setTokenCookie(res, token, rememberMe = false) {
    const cookieOptions = {
        ...envConfig.AUTH_COOKIE_OPTIONS,
        maxAge: rememberMe ? 15 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 15 days vs 1 day
    };
    res.cookie('token', token, cookieOptions);
}

/**
 * Sign user token, set cookie, and send user response
 */
export async function sendTokenResponse(res, statusCode, message, user, rememberMe = false) {
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        envConfig.JWT_SECRET,
        { expiresIn: rememberMe ? '15d' : '1d' },
    );

    setTokenCookie(res, token, rememberMe);

    return sendResponse({
        res,
        statusCode,
        message,
        success: true,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
    });
}
