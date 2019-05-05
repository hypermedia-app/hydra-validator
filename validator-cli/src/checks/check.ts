export class Result {
    description: string
    success: boolean

    protected constructor(descrition: string, success: boolean) {
        this.description = descrition
        this.success = success
    }

    static Success(description: string = '') {
        return new Result(description, true)
    }

    static Failure<T>(reason: string, details?: string | Error) {
        return new Failure<T>('failed', reason, details)
    }
}

type FailureKind = 'failed' | 'inconclusive'

class Failure<T extends any> extends Result {
    kind: FailureKind
    details: string | Error

    public constructor(kind: FailureKind, description: string, details: string | Error = '') {
        super(description, false)
        this.kind = kind
        this.details = details
    }
}
