> ## Hydra Analyser Web UI [![Built with open-wc recommendations](https://img.shields.io/badge/built%20with-open--wc-blue.svg)](https://github.com/open-wc)
> Static analysis of API Documentation and resources 

## Usage

To check any endpoint for Hydra controls and their correctness go to https://analyse.hypermedia.app and paste an URL
to the textbox and press ENTER.

The website will dereference that resource and linked API Documentation (if any) and try to check it against the implemented
rules.

For the online version to work, the API must be served over HTTPS and [CORS must be enabled](https://enable-cors.org) on the server.

## Local environment

To run locally:

```sh
lerna bootstrap
npm run start
```
