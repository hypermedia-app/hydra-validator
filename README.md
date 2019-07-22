> # hydra-validator
> A tool (also website) validating a Hydra API against possible mistakes

## Usage

This is a monorepo. Check the packages for more information:

### Online tool

Visit [https://analyse.hypermedia.app](https://analyse.hypermedia.app)

More info in [validator-ui](validator-ui) package.

### Command Line tool

It is also possible to run verification of a Hydra API from the command line. This may be useful to run sanity checks
locally during development or as part of a CI pipeline.

More info in [validator-cli](validator-cli) package.

### Core package

Code shared between other packages. 

More info in [validator-core](validator-core) package.

### Static API Documentation analysis

Static analyser of a Hydra API. Checks the triples and hypermedia controls for potential errors. 

More info in [validator-analyse](validator-analyse) package.

### E2E plugin (WIP)

End-to-end rules executed against a Hydra API.

More info in [validator-e2e](validator-e2e) package.

## Contributing

### Creating individual checks

Each verification check is a parameterless function, which returns the result and optionally an array of child checks.
It can also be async.

```ts
export interface CheckResult {
    result?: IResult;
    results?: IResult[];
    nextChecks?: checkChain[];
    sameLevel?: boolean;
}

export type checkChain = (this: Context) => Promise<CheckResult> | CheckResult
```

To implement a check, you'd usually wrap the check function in a closure to pass in dependencies. This way checks are chained
to run when the previous check succeeds.

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

### Creating a CLI plugin

To create a plugin, create a project called `hydra-validator-uber-check`, where `uber-check` will become
the CLI command.

In the package main module, export a default `checkChain` function which will be called first from
the CLI.

Optionally, add `export const options`, which exports an array of command line parameters. Here's an example
of one such option:

```
  {
    flags: '-l, --log-level <logLevel>',
    description: 'Minimum log level',
    defaultValue: 'INFO'
  }
```

An object with the values passed from the command line will be provided as the second argument to the
main `checkChain` function.
