module.exports = {
  roots: ['<rootDir>'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  collectCoverage: true,
  collectCoverageFrom: ['**/*.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(hydra-validator-core)/)',
  ],
  moduleNameMapper: {
    '@rdf-esm/(.*)': '@rdfjs/$1',
  },
}
