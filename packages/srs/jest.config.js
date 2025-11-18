/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'], // srcディレクトリ内の.test.tsファイルのみを対象
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  rootDir: '.',
};
