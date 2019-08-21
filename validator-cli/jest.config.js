module.exports = {
    roots: ['<rootDir>'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    collectCoverage: true,
    collectCoverageFrom: ['**/*.ts'],
}
