export default {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testMatch: ['**/tests/unit/*.test.ts'],
    preset: "ts-jest",
    testEnvironment: "node",
     setupFiles: ["<rootDir>/.jest/env-setup.ts"],
};
