module.exports = {
    displayName: 'custom-elasticity-strategies',

    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.spec.json',
        },
    },
    transform: {
        '^.+\\.[tj]s$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../coverage/libs/custom-elasticity-strategies',
    preset: '../../jest.preset.ts',
};
