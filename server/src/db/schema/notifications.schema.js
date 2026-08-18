import {
    pgTable,
    uuid,
    text,
    varchar,
    boolean,
    timestamp,
    index,
} from 'drizzle-orm/pg-core';
import { notificationTypeEnum } from './enums.js';
import { users } from './users.schema.js';

export const notifications = pgTable(
    'notifications',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: notificationTypeEnum('type').notNull(),
        title: varchar('title', { length: 255 }).notNull(),
        message: text('message'),
        referenceType: varchar('reference_type', { length: 50 }),
        referenceId: uuid('reference_id'),
        isRead: boolean('is_read').notNull().default(false),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        readAt: timestamp('read_at', { withTimezone: true }),
    },
    (table) => {
        return {
            userUnreadIdx: index('notifications_user_unread_idx')
                .on(table.userId, table.isRead)
                .where(table.isRead.eq(false)),
            userCreatedIdx: index('notifications_user_created_idx').on(
                table.userId,
                table.createdAt,
            ),
        };
    },
);