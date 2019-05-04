import {Either, Maybe} from 'tsmonad';

export interface Result {
    name: string
    success: boolean
}

export interface Success<T> extends Result {
    value: Promise<T>
}

export interface Failure extends Result  {
    kind: 'failed' | 'inconclusive'
    reason: string
}

type FailureInit = {
    kind: 'failed' | 'inconclusive'
    reason: string
}

type SuccessInit<T> = {
    value: Promise<T>
}

type CheckFunc<P, T> = (previous: P) => Either<SuccessInit<T>, FailureInit>

export default function<P, T> (name: string, runCheck: CheckFunc<P, T>) {
    return (previous: Maybe<P>): Either<Either<Success<T>, Failure>, Failure> => {
        return previous
            .caseOf({
                nothing: () => Either.right({
                    name,
                    success: false,
                    kind: 'inconclusive',
                    reason: 'Test skipped because dependency did not succeed'
                }),
                just: p => {
                    return runCheck(p).caseOf({
                        left: l => Either.left<Either<Success<T>, Failure>, Failure>(Either.left({
                            value: l.value,
                            name,
                            success: true
                        } as Success<T>)),
                        right: r => {
                            return Either.right<Either<Success<T>, Failure>, Failure>({
                                ...r,
                                name,
                                success: false,
                            })
                        }
                    })
                }
            });
    }
}
