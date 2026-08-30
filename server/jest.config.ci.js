export default {
    testEnvironment: 'node',
    transform: {},
    setupFiles: ['dotenv/config'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
    testMatch: ['<rootDir>/src/tests/unit/**/*.test.js'],
    verbose: true,
    forceExit: true,
    testTimeout: 10000,
};
