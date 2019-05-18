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

    protected constructor (descrition: string, status: ResultKind) {
        this.description = descrition
        this.status = status
    }

    public static Success (description: string = '') {
        return new Result(description, 'success')
    }

    public static Failure (reason: string, details?: string | Error): IResult {
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

/**
 * Return type of check functions. Either results, or result will be reported
 */
export interface CheckResult {
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
    nextChecks?: checkChain[];
    /**
     * If true, does not nest nextChecks
     */
    sameLevel?: boolean;
}

/**
 * Function delegate which runs actual check. It can be asynchronous
 */
export type checkChain = (this: Context) => Promise<CheckResult> | CheckResult
