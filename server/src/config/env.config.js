function normalizeOrigin(origin = '') {
    return origin.trim().replace(/\/$/, '');
}

const clientOrigins = (process.env.CLIENT_ORIGINS || '')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

if (!isTest) {
    if (!process.env.JWT_SECRET) {
        throw new Error('MISSING ENVIRONMENT VARIABLE: JWT_SECRET');
    }

    if (!process.env.CLIENT_ORIGINS) {
        throw new Error('MISSING ENVIRONMENT VARIABLE: CLIENT_ORIGINS');
    }

    if (!clientOrigins.length) {
        throw new Error('MISSING VALID CLIENT_ORIGINS VALUES');
    }

    if (!process.env.DATABASE_URL) {
        throw new Error('MISSING ENVIRONMENT VARIABLE: DATABASE_URL');
    }

    if (
        !process.env.GOOGLE_CLIENT_ID ||
        !process.env.GOOGLE_CLIENT_SECRET ||
        !process.env.GOOGLE_REFRESH_TOKEN ||
        !process.env.GOOGLE_SENDER_EMAIL
    ) {
        throw new Error('MISSING ENVIRONMENT VARIABLES FOR GOOGLE API');
    }

    if (!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.REDIS_PASSWORD) {
        throw new Error('MISSING ENVIRONMENT VARIABLES FOR REDIS');
    }

    if (!process.env.GEMINI_API_KEY || !process.env.MISTRAL_API_KEY) {
        throw new Error('MISSING ENVIRONMENT VARIABLES FOR AI MODELS');
    }

    if (!process.env.TAVILY_API_KEY || !process.env.LLAMA_CLOUD_API_KEY) {
        throw new Error('MISSING ENVIRONMENT VARIABLES FOR AI TOOLS');
    }

    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) {
        throw new Error('MISSING ENVIRONMENT VARIABLES FOR PINECONE');
    }

    if (!process.env.IMAGEKIT_PRIVATE_KEY) {
        throw new Error('MISSING ENVIRONMENT VARIABLES FOR IMAGEKIT API');
    }
}

const envConfig = {
    //  Server configuration keys
    SERVER_PORT: process.env.SERVER_PORT || 3000,
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:3000',
    CLIENT_ORIGINS: clientOrigins.length ? clientOrigins : ['http://localhost:5173'],
    CLIENT_ORIGIN: clientOrigins[0] || 'http://localhost:5173',
    IS_PRODUCTION: isProduction,
    AUTH_COOKIE_OPTIONS: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
    },

    //  JWT configuration keys
    JWT_SECRET: process.env.JWT_SECRET || 'test-mock-jwt-secret-key-32-chars-long',

    //  Database configuration keys
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://mock:mock@localhost:5432/mock_db',
    PINECONE_API_KEY: process.env.PINECONE_API_KEY || 'mock-pinecone-key',
    PINECONE_INDEX: process.env.PINECONE_INDEX || 'mock-index',

    //  Redis configuration keys
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',

    //  Google Api keys
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'mock-google-id',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'mock-google-secret',
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || 'mock-google-refresh',
    GOOGLE_SENDER_EMAIL: process.env.GOOGLE_SENDER_EMAIL || 'test@example.com',

    //  Ai models keys
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'mock-gemini-key',
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || 'mock-mistral-key',

    //  Ai Tools Keys
    TAVILY_API_KEY: process.env.TAVILY_API_KEY || 'mock-tavily-key',
    LLAMA_CLOUD_API_KEY: process.env.LLAMA_CLOUD_API_KEY || 'mock-llama-key',

    //  ImageKit Keys
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || 'mock-imagekit-key',

    isAllowedClientOrigin(origin) {
        if (!origin) return true;
        return clientOrigins.includes(normalizeOrigin(origin));
    },
};

export default envConfig;
