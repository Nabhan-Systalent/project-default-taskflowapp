/** @type {import('jest').Config} */
const swcOptions = {
  jsc: {
    parser: { syntax: 'typescript', decorators: true },
    transform: { legacyDecorator: true, decoratorMetadata: true },
    target: 'es2021',
    keepClassNames: true,
  },
  module: { type: 'commonjs' },
};

module.exports = {
  testEnvironment: 'node',
  // Generated source under src/ is a compilable target — run the dedicated
  // tests/ tree AND any *.(test|spec).ts colocated with the generated modules.
  testMatch: ['**/tests/**/*.test.{js,ts}', '**/src/**/*.(test|spec).ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', swcOptions],
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.(test|spec).ts'],
  passWithNoTests: true,
};
