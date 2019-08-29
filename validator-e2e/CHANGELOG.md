# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.1](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.4.0...hydra-validator-e2e@0.4.1) (2019-08-29)


### Bug Fixes

* fallback in case of not annotated links ([2068a5b](https://github.com/hypermedia-app/hydra-validator/commit/2068a5b))
* prevent non-string variable from being dereferneced ([ec6b31d](https://github.com/hypermedia-app/hydra-validator/commit/ec6b31d))





# [0.4.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.3.3...hydra-validator-e2e@0.4.0) (2019-08-22)


### Bug Fixes

* don't log duplicate message when processing array of values ([009291b](https://github.com/hypermedia-app/hydra-validator/commit/009291b))


### Features

* add constraints to class, property and link blocks ([94d77ef](https://github.com/hypermedia-app/hydra-validator/commit/94d77ef))





## [0.3.3](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.3.2...hydra-validator-e2e@0.3.3) (2019-08-19)


### Bug Fixes

* invocation step must send all headers to the API ([279596d](https://github.com/hypermedia-app/hydra-validator/commit/279596d))





## [0.3.2](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.3.1...hydra-validator-e2e@0.3.2) (2019-08-05)

**Note:** Version bump only for package hydra-validator-e2e





## [0.3.1](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.3.0...hydra-validator-e2e@0.3.1) (2019-07-31)

**Note:** Version bump only for package hydra-validator-e2e





# [0.3.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.2.0...hydra-validator-e2e@0.3.0) (2019-07-31)


### Bug Fixes

* property comparison with expected falsy values ([59af108](https://github.com/hypermedia-app/hydra-validator/commit/59af108))
* property statement should compare string representation ([64fe437](https://github.com/hypermedia-app/hydra-validator/commit/64fe437))
* silently ignore non-strict operation blocks ([4a03ff3](https://github.com/hypermedia-app/hydra-validator/commit/4a03ff3))


### Features

* **validator-e2e:** warn when representation cannot be figured out ([a8c0ff9](https://github.com/hypermedia-app/hydra-validator/commit/a8c0ff9))
* invocation step to handle headers and bodies ([3c3b878](https://github.com/hypermedia-app/hydra-validator/commit/3c3b878))
* operation step can be not strict ([b2310fe](https://github.com/hypermedia-app/hydra-validator/commit/b2310fe))
* property statement now handles rdf:type assertion ([331eaac](https://github.com/hypermedia-app/hydra-validator/commit/331eaac))
* run child checks on all values of link/property arrays ([a03c8f2](https://github.com/hypermedia-app/hydra-validator/commit/a03c8f2))
* update link step to current DSL state ([9e39a68](https://github.com/hypermedia-app/hydra-validator/commit/9e39a68))





# 0.2.0 (2019-07-23)


### Bug Fixes

* **hydra-validator:** load docs file based on current working dir ([ee400ba](https://github.com/hypermedia-app/hydra-validator/commit/ee400ba))
* **validator-cli:** pass description and default value to commanderjs ([4939e43](https://github.com/hypermedia-app/hydra-validator/commit/4939e43))
* **validator-e2e:** operation id check against types ([5ec7f3a](https://github.com/hypermedia-app/hydra-validator/commit/5ec7f3a))
* **validator-e2e:** run class step ony when RDF type matches ([d273da8](https://github.com/hypermedia-app/hydra-validator/commit/d273da8))


### Features

* **validator-e2e:** first PoC of E2E runner ([ca9f95c](https://github.com/hypermedia-app/hydra-validator/commit/ca9f95c))
* **validator-e2e:** keep track of successfully executed steps ([a0a019e](https://github.com/hypermedia-app/hydra-validator/commit/a0a019e))
* **validator-e2e:** separate operation from invocation ([cb93b34](https://github.com/hypermedia-app/hydra-validator/commit/cb93b34))
* **validator-e2e:** update expectation and property steps ([10e6f82](https://github.com/hypermedia-app/hydra-validator/commit/10e6f82))
