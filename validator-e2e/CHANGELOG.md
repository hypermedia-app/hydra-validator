# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.10.0-alpha.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.9.0...hydra-validator-e2e@0.10.0-alpha.0) (2020-04-10)


### Bug Fixes

* ensure all "common parsers" are st up with alcaeus ([63dae3f](https://github.com/hypermedia-app/hydra-validator/commit/63dae3f027039fe8f165808efd2925d700846aca))
* scenario should fail when link fails to dereference ([9b7442e](https://github.com/hypermedia-app/hydra-validator/commit/9b7442e81003966afaf9c3355b05c8639f6ba27e))





# [0.9.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.8.3...hydra-validator-e2e@0.9.0) (2020-03-17)


### Features

* it was not possible to check only one of multiple values ([6e2d811](https://github.com/hypermedia-app/hydra-validator/commit/6e2d811e948ea0c5f242940da1a1c759b9d8bf94))


### BREAKING CHANGES

* property step now only fails if all objects fail





## [0.8.3](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.8.2...hydra-validator-e2e@0.8.3) (2020-01-23)


### Bug Fixes

* only count top-level steps towards strict run verification ([e20e00a](https://github.com/hypermedia-app/hydra-validator/commit/e20e00a)), closes [#70](https://github.com/hypermedia-app/hydra-validator/issues/70)





## [0.8.2](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.8.1...hydra-validator-e2e@0.8.2) (2019-12-08)

**Note:** Version bump only for package hydra-validator-e2e





## [0.8.1](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.8.0...hydra-validator-e2e@0.8.1) (2019-12-07)

**Note:** Version bump only for package hydra-validator-e2e





# [0.8.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.7.0...hydra-validator-e2e@0.8.0) (2019-12-06)


### Bug Fixes

* make the log on E2eContext optional ([40b72a8](https://github.com/hypermedia-app/hydra-validator/commit/40b72a8))


### Features

* apply default scenario headers when performing requests ([db260d8](https://github.com/hypermedia-app/hydra-validator/commit/db260d8))





# [0.7.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.6.0...hydra-validator-e2e@0.7.0) (2019-12-03)


### Features

* append to entrypoint to base URI ([acb8fe1](https://github.com/hypermedia-app/hydra-validator/commit/acb8fe1))





# [0.6.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.5.1...hydra-validator-e2e@0.6.0) (2019-11-08)


### Features

* add strict option to verify all steps have been visited ([#48](https://github.com/hypermedia-app/hydra-validator/issues/48)) ([34dc650](https://github.com/hypermedia-app/hydra-validator/commit/34dc650))





## [0.5.1](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.5.0...hydra-validator-e2e@0.5.1) (2019-10-31)

**Note:** Version bump only for package hydra-validator-e2e





# [0.5.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.4.2...hydra-validator-e2e@0.5.0) (2019-10-11)


### Bug Fixes

* handling literals for links and broken links ([39a67f7](https://github.com/hypermedia-app/hydra-validator/commit/39a67f7)), closes [#46](https://github.com/hypermedia-app/hydra-validator/issues/46)


### Features

* **e2e:** add support for Expect Id statement ([f310d8c](https://github.com/hypermedia-app/hydra-validator/commit/f310d8c))





## [0.4.2](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.4.1...hydra-validator-e2e@0.4.2) (2019-08-29)


### Bug Fixes

* keep the link from being followed multiple times ([ae2bc37](https://github.com/hypermedia-app/hydra-validator/commit/ae2bc37))





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
