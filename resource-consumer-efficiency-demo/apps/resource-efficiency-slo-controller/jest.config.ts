module.exports = {
    displayName: 'resource-efficiency-slo-controller',

    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.spec.json',
        },
    },
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../coverage/apps/resource-efficiency-slo-controller',
    preset: '../../jest.preset.ts',
};
