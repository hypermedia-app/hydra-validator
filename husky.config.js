module.exports = {
    hooks: {
        'pre-commit': 'lerna run --concurrency 1 --stream precommit',
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    },
}
