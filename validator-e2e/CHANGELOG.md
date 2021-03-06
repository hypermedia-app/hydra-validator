# Change Log

## 0.12.1

### Patch Changes

- 807feca: Update builds to output proper import paths
- Updated dependencies [807feca]
  - hydra-validator-core@0.5.1

## 0.12.0

### Minor Changes

- 43da1a5: Publish as modules

## 0.11.2

### Patch Changes

- 5ef2133: Set package type as ES Modules

## 0.11.1

### Patch Changes

- 45aa529: Fix packaging (no JS)

## 0.11.0

### Minor Changes

- 4f9a1d4: Updated alcaeus

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.10.7](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.10.6...hydra-validator-e2e@0.10.7) (2020-09-22)

**Note:** Version bump only for package hydra-validator-e2e

## [0.10.6](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.10.5...hydra-validator-e2e@0.10.6) (2020-09-22)

### Bug Fixes

- headers and update alcaeus ([e5d44b2](https://github.com/hypermedia-app/hydra-validator/commit/e5d44b2a4d6d190f4fb5c078c9dae6be7afd6a34))

## [0.10.5](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.10.4...hydra-validator-e2e@0.10.5) (2020-05-04)

**Note:** Version bump only for package hydra-validator-e2e

## [0.10.4](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.10.3...hydra-validator-e2e@0.10.4) (2020-05-02)

### Bug Fixes

- **e2e:** latest alcaeus fixes managing resource state ([cb07289](https://github.com/hypermedia-app/hydra-validator/commit/cb07289d78df1080b2fad7457f4a856be3a666f6))
- **e2e:** literal was not logged properly on check fail ([03a9789](https://github.com/hypermedia-app/hydra-validator/commit/03a9789988481d6d095f4e8ad5b66d24d1961873))

## [0.10.3](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.10.2...hydra-validator-e2e@0.10.3) (2020-04-25)

**Note:** Version bump only for package hydra-validator-e2e

## [0.10.2](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.10.1...hydra-validator-e2e@0.10.2) (2020-04-24)

**Note:** Version bump only for package hydra-validator-e2e

## [0.10.1](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.10.0...hydra-validator-e2e@0.10.1) (2020-04-20)

**Note:** Version bump only for package hydra-validator-e2e

# [0.10.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.10.0-alpha.1...hydra-validator-e2e@0.10.0) (2020-04-15)

### Bug Fixes

- **e2e:** link should not fail fast when there is a status check ([29fc39c](https://github.com/hypermedia-app/hydra-validator/commit/29fc39c0923109b62ee2d2b07d5b15379b85ee41))
- **e2e:** minor fixes to debug messages ([2df03d4](https://github.com/hypermedia-app/hydra-validator/commit/2df03d4b99187e3e345098ae8b927837b27459e1))

# [0.10.0-alpha.1](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.10.0-alpha.0...hydra-validator-e2e@0.10.0-alpha.1) (2020-04-15)

### Bug Fixes

- **e2e:** did not work with absolute paths ([81fecb9](https://github.com/hypermedia-app/hydra-validator/commit/81fecb93cd73b383a084f8bf018c5ddd76a13245))
- **e2e:** only fail links when they have child steps ([f97c08b](https://github.com/hypermedia-app/hydra-validator/commit/f97c08b4731f47eb67a86b02fe3c0ee6ca24cfbb))
- **e2e:** single object of property was treated like an array ([373e8fb](https://github.com/hypermedia-app/hydra-validator/commit/373e8fba2968d699ff175a8963309cc0d2bc4f5b))

### Features

- templated links ([61755d6](https://github.com/hypermedia-app/hydra-validator/commit/61755d62c7d69270c1194b8440732194c6e3e11e))

# [0.10.0-alpha.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.9.0...hydra-validator-e2e@0.10.0-alpha.0) (2020-04-10)

### Bug Fixes

- ensure all "common parsers" are st up with alcaeus ([63dae3f](https://github.com/hypermedia-app/hydra-validator/commit/63dae3f027039fe8f165808efd2925d700846aca))
- scenario should fail when link fails to dereference ([9b7442e](https://github.com/hypermedia-app/hydra-validator/commit/9b7442e81003966afaf9c3355b05c8639f6ba27e))

# [0.9.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.8.3...hydra-validator-e2e@0.9.0) (2020-03-17)

### Features

- it was not possible to check only one of multiple values ([6e2d811](https://github.com/hypermedia-app/hydra-validator/commit/6e2d811e948ea0c5f242940da1a1c759b9d8bf94))

### BREAKING CHANGES

- property step now only fails if all objects fail

## [0.8.3](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.8.2...hydra-validator-e2e@0.8.3) (2020-01-23)

### Bug Fixes

- only count top-level steps towards strict run verification ([e20e00a](https://github.com/hypermedia-app/hydra-validator/commit/e20e00a)), closes [#70](https://github.com/hypermedia-app/hydra-validator/issues/70)

## [0.8.2](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.8.1...hydra-validator-e2e@0.8.2) (2019-12-08)

**Note:** Version bump only for package hydra-validator-e2e

## [0.8.1](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.8.0...hydra-validator-e2e@0.8.1) (2019-12-07)

**Note:** Version bump only for package hydra-validator-e2e

# [0.8.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.7.0...hydra-validator-e2e@0.8.0) (2019-12-06)

### Bug Fixes

- make the log on E2eContext optional ([40b72a8](https://github.com/hypermedia-app/hydra-validator/commit/40b72a8))

### Features

- apply default scenario headers when performing requests ([db260d8](https://github.com/hypermedia-app/hydra-validator/commit/db260d8))

# [0.7.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.6.0...hydra-validator-e2e@0.7.0) (2019-12-03)

### Features

- append to entrypoint to base URI ([acb8fe1](https://github.com/hypermedia-app/hydra-validator/commit/acb8fe1))

# [0.6.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.5.1...hydra-validator-e2e@0.6.0) (2019-11-08)

### Features

- add strict option to verify all steps have been visited ([#48](https://github.com/hypermedia-app/hydra-validator/issues/48)) ([34dc650](https://github.com/hypermedia-app/hydra-validator/commit/34dc650))

## [0.5.1](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.5.0...hydra-validator-e2e@0.5.1) (2019-10-31)

**Note:** Version bump only for package hydra-validator-e2e

# [0.5.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.4.2...hydra-validator-e2e@0.5.0) (2019-10-11)

### Bug Fixes

- handling literals for links and broken links ([39a67f7](https://github.com/hypermedia-app/hydra-validator/commit/39a67f7)), closes [#46](https://github.com/hypermedia-app/hydra-validator/issues/46)

### Features

- **e2e:** add support for Expect Id statement ([f310d8c](https://github.com/hypermedia-app/hydra-validator/commit/f310d8c))

## [0.4.2](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.4.1...hydra-validator-e2e@0.4.2) (2019-08-29)

### Bug Fixes

- keep the link from being followed multiple times ([ae2bc37](https://github.com/hypermedia-app/hydra-validator/commit/ae2bc37))

## [0.4.1](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.4.0...hydra-validator-e2e@0.4.1) (2019-08-29)

### Bug Fixes

- fallback in case of not annotated links ([2068a5b](https://github.com/hypermedia-app/hydra-validator/commit/2068a5b))
- prevent non-string variable from being dereferneced ([ec6b31d](https://github.com/hypermedia-app/hydra-validator/commit/ec6b31d))

# [0.4.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.3.3...hydra-validator-e2e@0.4.0) (2019-08-22)

### Bug Fixes

- don't log duplicate message when processing array of values ([009291b](https://github.com/hypermedia-app/hydra-validator/commit/009291b))

### Features

- add constraints to class, property and link blocks ([94d77ef](https://github.com/hypermedia-app/hydra-validator/commit/94d77ef))

## [0.3.3](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.3.2...hydra-validator-e2e@0.3.3) (2019-08-19)

### Bug Fixes

- invocation step must send all headers to the API ([279596d](https://github.com/hypermedia-app/hydra-validator/commit/279596d))

## [0.3.2](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.3.1...hydra-validator-e2e@0.3.2) (2019-08-05)

**Note:** Version bump only for package hydra-validator-e2e

## [0.3.1](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.3.0...hydra-validator-e2e@0.3.1) (2019-07-31)

**Note:** Version bump only for package hydra-validator-e2e

# [0.3.0](https://github.com/hypermedia-app/hydra-validator/compare/hydra-validator-e2e@0.2.0...hydra-validator-e2e@0.3.0) (2019-07-31)

### Bug Fixes

- property comparison with expected falsy values ([59af108](https://github.com/hypermedia-app/hydra-validator/commit/59af108))
- property statement should compare string representation ([64fe437](https://github.com/hypermedia-app/hydra-validator/commit/64fe437))
- silently ignore non-strict operation blocks ([4a03ff3](https://github.com/hypermedia-app/hydra-validator/commit/4a03ff3))

### Features

- **validator-e2e:** warn when representation cannot be figured out ([a8c0ff9](https://github.com/hypermedia-app/hydra-validator/commit/a8c0ff9))
- invocation step to handle headers and bodies ([3c3b878](https://github.com/hypermedia-app/hydra-validator/commit/3c3b878))
- operation step can be not strict ([b2310fe](https://github.com/hypermedia-app/hydra-validator/commit/b2310fe))
- property statement now handles rdf:type assertion ([331eaac](https://github.com/hypermedia-app/hydra-validator/commit/331eaac))
- run child checks on all values of link/property arrays ([a03c8f2](https://github.com/hypermedia-app/hydra-validator/commit/a03c8f2))
- update link step to current DSL state ([9e39a68](https://github.com/hypermedia-app/hydra-validator/commit/9e39a68))

# 0.2.0 (2019-07-23)

### Bug Fixes

- **hydra-validator:** load docs file based on current working dir ([ee400ba](https://github.com/hypermedia-app/hydra-validator/commit/ee400ba))
- **validator-cli:** pass description and default value to commanderjs ([4939e43](https://github.com/hypermedia-app/hydra-validator/commit/4939e43))
- **validator-e2e:** operation id check against types ([5ec7f3a](https://github.com/hypermedia-app/hydra-validator/commit/5ec7f3a))
- **validator-e2e:** run class step ony when RDF type matches ([d273da8](https://github.com/hypermedia-app/hydra-validator/commit/d273da8))

### Features

- **validator-e2e:** first PoC of E2E runner ([ca9f95c](https://github.com/hypermedia-app/hydra-validator/commit/ca9f95c))
- **validator-e2e:** keep track of successfully executed steps ([a0a019e](https://github.com/hypermedia-app/hydra-validator/commit/a0a019e))
- **validator-e2e:** separate operation from invocation ([cb93b34](https://github.com/hypermedia-app/hydra-validator/commit/cb93b34))
- **validator-e2e:** update expectation and property steps ([10e6f82](https://github.com/hypermedia-app/hydra-validator/commit/10e6f82))
