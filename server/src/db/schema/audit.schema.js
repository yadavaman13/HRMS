import { pgTable, uuid, text, varchar, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { inet } from './custom_types.js';
import { organizations } from './organizations.schema.js';
import { users } from './users.schema.js';

export const auditLogs = pgTable(
    'audit_logs',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        actorUserId: uuid('actor_user_id').references(() => users.id, {
            onDelete: 'set null',
        }),
        action: varchar('action', { length: 100 }).notNull(),
        entityType: varchar('entity_type', { length: 100 }).notNull(),
        entityId: uuid('entity_id').notNull(),
        oldData: jsonb('old_data'),
        newData: jsonb('new_data'),
        ipAddress: inet('ip_address'),
        userAgent: text('user_agent'),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            entityIdx: index('audit_entity_idx').on(table.entityType, table.entityId),
            actorIdx: index('audit_actor_idx').on(table.actorUserId, table.createdAt),
            orgCreatedIdx: index('audit_org_created_idx').on(table.organizationId, table.createdAt),
        };
    },
);
