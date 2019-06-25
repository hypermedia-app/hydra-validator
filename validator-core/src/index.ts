type ResultKind = 'success' | 'failure' | 'informational' | 'warning'

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IResult {
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
    public details?: string

    protected constructor (descrition: string, status: ResultKind, details?: string) {
        this.description = descrition
        this.status = status
        this.details = details
    }

    public static Success (description: string = '', details?: string) {
        return new Result(description, 'success', details)
    }

    public static Failure (reason: string, details?: string | Error): IResult {
        return new Failure('failed', reason, details)
    }

    public static Warning (description: string, details?: string) {
        return new Result(description, 'warning', details)
    }

    public static Informational (description: string, details?: string) {
        return new Result(description, 'informational', details)
    }
}

type FailureKind = 'failed' | 'inconclusive'

export interface Context {
    [s: string]: any;
}

/**
 * Return type of check functions. Either results, or result will be reported
 */
export interface CheckResult<T extends Context = Context> {
    /**
     * Results to be reported
     */
    result?: IResult;
    /**
     * Results to be reported
     */
    results?: IResult[];
    /**
     * Checks to add to queue
     */
    nextChecks?: checkChain<T>[];
    /**
     * If true, does not nest nextChecks
     */
    sameLevel?: boolean;
}

/**
 * Function delegate which runs actual check. It can be asynchronous
 */
export type checkChain<T extends Context = Context> = (this: T) => Promise<CheckResult<T>> | CheckResult<T>
