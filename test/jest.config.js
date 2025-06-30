module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/?(*.)+(spec|test).ts'],
    testTimeout: 10000,
    verbose: true
}