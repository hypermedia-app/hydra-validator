> # hydra-validator-analyse
> CLI plugin which performs static tests of a Hydra API

## Installation

```shell
npm i hydra-validator hydra-validator-analyse
```

## Usage

Installing the plugin adds a command to the runner:

```
> hydra-validator analyse --help

Usage: analyse [options] <url>

Options:
  -h, --help  output usage information
```

Example test run

```
hydra-validator analyse https://hydra-movies.herokuapp.com/
```
