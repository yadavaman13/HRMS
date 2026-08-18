import { customType } from 'drizzle-orm/pg-core';

export const bytea = customType({
    dataType() {
        return 'bytea';
    },
    toDriver(value) {
        return value;
    },
    fromDriver(value) {
        return value;
    },
});

export const inet = customType({
    dataType() {
        return 'inet';
    },
    toDriver(value) {
        return value;
    },
    fromDriver(value) {
        return value;
    },
});