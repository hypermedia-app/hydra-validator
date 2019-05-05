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

    static Failure(reason: string, details?: string | Error) {
        return new Failure('failed', reason, details)
    }
}

type FailureKind = 'failed' | 'inconclusive'

class Failure extends Result {
    kind: FailureKind
    details: string | Error

    public constructor(kind: FailureKind, description: string, details: string | Error = '') {
        super(description, false)
        this.kind = kind
        this.details = details
    }
}

export type checkChain = () => Promise<[ Result, Array<checkChain> ]> | [ Result, Array<checkChain> ]
