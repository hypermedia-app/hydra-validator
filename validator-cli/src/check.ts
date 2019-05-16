type ResultKind = 'success' | 'failure' | 'informational' | 'warning'

export class Result {
    description: string
    status: ResultKind

    protected constructor(descrition: string, status: ResultKind) {
        this.description = descrition
        this.status = status
    }

    static Success(description: string = '') {
        return new Result(description, 'success')
    }

    static Failure(reason: string, details?: string | Error): Result {
        return new Failure('failed', reason, details)
    }

    static Warning(description: string) {
        return new Result(description, 'warning')
    }

    static Informational(description: string) {
        return new Result(description, 'informational')
    }
}

type FailureKind = 'failed' | 'inconclusive'

class Failure extends Result {
    details: string | Error

    public constructor(kind: FailureKind, description: string, details: string | Error = '') {
        super(description, 'failure')
        this.details = details
    }
}

export type Context =  {
    [s: string]: any
}

export type CheckResult = {
    messages: Result | Result[],
    nextChecks?: checkChain[],
    context?: Context
}

export type checkChain = (this: Context) => Promise<CheckResult> | CheckResult
