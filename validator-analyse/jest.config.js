module.exports = {
    roots: ['<rootDir>'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    collectCoverage: true,
    collectCoverageFrom: ['**/*.ts'],
    transformIgnorePatterns: [
        'node_modules/(?!(alcaeus|hydra-validator-core)/)',
    ],
}
