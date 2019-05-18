# hydra-validator
A tool (also website) validating a Hydra API against possible mistakes

## Usage

### Online tool

To check any endpoint for Hydra controls nd their correctness go to https://analyse.hypermedia.app and paste an URL
to the textbox and press ENTER.

The website will dereference that resource and linked API Documentation (if any) and try to check it against the implemented
rules.

For the online version to work, the API must be served over HTTPS and [CORS must be enabled](https://enable-cors.org) on the server.

### Command Line tool

It is also possible to run verification of a Hydra API fomr the command line. This may be useful to run sanity checks
locally during development or as part of a CI pipeline.

To install

```
npm i -g hydra-validator
```

And then run

```
hydra-validator analyze <URL>
```

## Contributing

Each verification check is a parameterless function, which returns the result and optionally an array of child checks.
It can also be async.

```ts
export type CheckResult = [ Result, Array<checkChain> ] | [ Result ]

export type checkChain = () => Promise<CheckResult> | CheckResult
```

To implement a check, you'd usually wrap the check function in a closure to pass in dependencies. This way checks are chained
to run when the previoud check suceeds.

Here's an example which could verify that the input is a number and then pass on to a check for parity.

```ts
// isnum.ts
import {checkChain, Result} from '../check';
import iseven from './iseven';

export default function (maybeNum: any): checkChain {
    return () => {
        if (Number.isInteger(maybeNum)) {
            return {
                result: Result.Success('Value is number'),
                nextChecks: [ iseven(maybeNum) ]
            }
        }

        return {
            result: Result.Failure('Value is not a number')
        }
    }
}

// iseven.ts
import {checkChain, Result} from '../check';

export default function (num: number): checkChain {
    return () => {
        const result = num % 2 === 0
            ? Result.Success(`Number ${num} is even`)
            : Result.Failure(`Number ${num} is odd`)

        return { result }
    }
}
```

Any new check must be added to existing chains in a similar matter to how `iseven` follows `isnum`.

Results can be reported with four factory methods: `Result.Succes`, `Result.Failure`, `Result.Warning`
and `Result.Informational`.

Note that there is no restriction for chaining. Additional checks can follow a successful check as well as failed ones.
