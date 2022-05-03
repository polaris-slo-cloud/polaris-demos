module.exports = {
    displayName: 'resource-efficiency-metric-controller',

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
    coverageDirectory:
        '../../coverage/apps/resource-efficiency-metric-controller',
    preset: '../../jest.preset.ts',
};
