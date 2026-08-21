import { uploadImageOnImageKit } from '../../../services/image.service.js';
import { updateUser } from '../../../dao/user.dao.js';
import { sendResponse } from '../../../utils/response.utlis.js';
import redis from '../../../config/cache.config.js';

const DEFAULT_PROFILE_IMAGE = 'https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg';

/**
 * Upload profile avatar and update user's profileImage URL (Self)
 */
export async function uploadAvatar(req, res, next) {
    try {
        if (!req.file) {
            return sendResponse({
                res,
                statusCode: 400,
                success: false,
                message: 'No avatar image received. Send image file under the "avatar" field.',
            });
        }

        const uploadedFile = await uploadImageOnImageKit({ image: req.file });
        const imageUrl = uploadedFile.url;

        // Update the database profileImage for the user
        const updatedUser = await updateUser(req.user.id, {
            profileImage: imageUrl,
        });

        // Invalidate Redis user cache
        if (redis) {
            const cacheKey = `user:${req.user.id}`;
            try {
                await redis.del(cacheKey);
            } catch (cacheError) {
                console.error('Redis cache delete error in uploadAvatar:', cacheError);
            }
        }

        return sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Avatar uploaded and profile updated successfully',
            data: {
                imageUrl,
                user: {
                    id: updatedUser.id,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    profileImage: updatedUser.profileImage,
                    isActive: updatedUser.isActive,
                },
            },
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Delete profile avatar and reset to default image (Self)
 */
export async function deleteAvatar(req, res, next) {
    try {
        // Update user profile image to default
        const updatedUser = await updateUser(req.user.id, {
            profileImage: DEFAULT_PROFILE_IMAGE,
        });

        // Invalidate Redis user cache
        if (redis) {
            const cacheKey = `user:${req.user.id}`;
            try {
                await redis.del(cacheKey);
            } catch (cacheError) {
                console.error('Redis cache delete error in deleteAvatar:', cacheError);
            }
        }

        return sendResponse({
            res,
            statusCode: 200,
            success: true,
            message: 'Avatar deleted and reset to default successfully',
            data: {
                imageUrl: DEFAULT_PROFILE_IMAGE,
                user: {
                    id: updatedUser.id,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    profileImage: updatedUser.profileImage,
                    isActive: updatedUser.isActive,
                },
            },
        });
    } catch (err) {
        next(err);
    }
}
