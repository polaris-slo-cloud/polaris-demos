module.exports = {
  displayName: 'my-horizontal-elasticity-strategy-controller',

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
    '../../coverage/apps/my-horizontal-elasticity-strategy-controller',
  preset: '../../jest.preset.ts',
};
