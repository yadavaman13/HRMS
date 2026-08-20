import { pgTable, uuid, text, boolean, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { roleEnum } from './enums.js';
import { organizations } from './organizations.schema.js';

export const users = pgTable(
    'users',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        firstName: text('first_name').notNull(),
        lastName: text('last_name').notNull(),
        email: text('email').unique().notNull(),
        password: text('password').notNull(),
        profileImage: text('profile_image').default(
            'https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg',
        ),
        role: roleEnum('role').default('employee').notNull(),
        emailVerified: boolean('email_verified').default(false).notNull(),
        isActive: boolean('is_active').default(true).notNull(),
        isDeleted: boolean('is_deleted').default(false).notNull(),
        deletedAt: timestamp('deleted_at', { withTimezone: true }),
        lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
        mustChangePassword: boolean('must_change_password').default(false).notNull(),
        failedLoginAttempts: integer('failed_login_attempts').default(0).notNull(),
        lockedUntil: timestamp('locked_until', { withTimezone: true }),
        recoveryExpiresAt: timestamp('recovery_expires_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            emailIdx: index('users_email_idx').on(table.email),
            orgIdx: index('users_org_idx').on(table.organizationId),
            roleIdx: index('users_role_idx').on(table.role),
            isDeletedIdx: index('users_is_deleted_idx').on(table.isDeleted),
            deletedAtIdx: index('users_deleted_at_idx').on(table.deletedAt),
            recoveryExpiresAtIdx: index('users_recovery_expires_at_idx').on(
                table.recoveryExpiresAt,
            ),
            orgActiveIdx: index('users_org_active_idx')
                .on(table.organizationId, table.isActive)
                .where(table.isDeleted.eq(false)),
        };
    },
);

// export const refreshTokens = pgTable(
//     'refresh_tokens',
//     {
//         id: uuid('id').defaultRandom().primaryKey(),
//         userId: uuid('user_id')
//             .notNull()
//             .references(() => users.id, { onDelete: 'cascade' }),
//         tokenHash: text('token_hash').notNull(),
//         expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
//         revokedAt: timestamp('revoked_at', { withTimezone: true }),
//         createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
//     },
//     (table) => {
//         return {
//             userIdIdx: index('refresh_tokens_user_idx').on(table.userId),
//             tokenHashIdx: index('refresh_tokens_hash_idx').on(table.tokenHash),
//             expiresIdx: index('refresh_tokens_expires_idx').on(table.userId, table.expiresAt),
//         };
//     },
// );
