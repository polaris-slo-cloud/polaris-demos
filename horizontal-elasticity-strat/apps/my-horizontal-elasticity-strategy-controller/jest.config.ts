/* eslint-disable */
export default {
  displayName: 'my-horizontal-elasticity-strategy-controller',

  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../coverage/apps/my-horizontal-elasticity-strategy-controller',
  preset: '../../jest.preset.js',
};
