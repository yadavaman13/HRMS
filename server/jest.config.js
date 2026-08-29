export default {
    testEnvironment: 'node',
    transform: {},
    setupFiles: ['dotenv/config'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
    testSequencer: '<rootDir>/src/tests/testSequencer.js',
    testTimeout: 60000,
    testMatch: ['<rootDir>/src/tests/modules/**/*.test.js'],
    verbose: true,
    forceExit: true,
};

