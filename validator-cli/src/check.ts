type ResultKind = 'success' | 'failure' | 'informational' | 'warning'

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IResult {
    description: string;
    status: ResultKind;
}

class Failure implements IResult {
    public details: string | Error
    public description: string;
    public status: ResultKind;

    public constructor (kind: FailureKind, description: string, details: string | Error = '') {
        this.description = description
        this.status = 'failure'
        this.details = details
    }
}

export class Result implements IResult {
    public description: string
    public status: ResultKind

    protected constructor (descrition: string, status: ResultKind) {
        this.description = descrition
        this.status = status
    }

    public static Success (description: string = '') {
        return new Result(description, 'success')
    }

    public static Failure (reason: string, details?: string | Error) {
        return new Failure('failed', reason, details)
    }

    public static Warning (description: string) {
        return new Result(description, 'warning')
    }

    public static Informational (description: string) {
        return new Result(description, 'informational')
    }
}

type FailureKind = 'failed' | 'inconclusive'

export interface Context {
    [s: string]: any;
}

export interface CheckResult {
    result?: IResult;
    results?: IResult[];
    nextChecks?: checkChain[];
    context?: Context;
    sameLevel?: boolean;
}

export type checkChain = (this: Context) => Promise<CheckResult> | CheckResult
