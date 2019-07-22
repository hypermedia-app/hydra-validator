> # hydra-validator-e2e
> End-to-end CLI plugin for testing Hydra APIs

## Installation

```shell
npm i hydra-validator hydra-validator-e2e
```

## Usage

Installing the plugin adds a command to the runner:

```
> hydra-validator e2e --help

Usage: e2e [options] <url>

Options:
  -d, --docs <docsPath>  path to JSON containing test scenarios
  -h, --help             output usage information
```

Example test run

```
hydra-validator e2e -d ./example/hydracg-movies-api.json https://hydra-movies.herokuapp.com/
```
