import {checkChain, Result} from './check';

async function* runChecks(firstCheck: checkChain) {
    yield {
        level: 0,
        result: Result.Informational('Analysis started...')
    }

    let result, moreChecks

    try {
        [result, moreChecks] = await firstCheck()
        moreChecks = moreChecks || []
    } catch (e) {
        yield {
            level: 0,
            result: Result.Failure('Unexpected error', e)
        }
        return
    }

    yield {
        result,
        level: 0
    }

    let checksLeveled = moreChecks.map(check => ({
        level: 1,
        check
    }))

    while (checksLeveled.length > 0) {
        let result, moreMoreChecks
        const nextCheck = checksLeveled.splice(0 ,1)[0]
        try {
            [result, moreMoreChecks] = await nextCheck.check()
            moreMoreChecks = moreMoreChecks || []
        } catch (e) {
            yield {
                level: nextCheck.level,
                result: Result.Failure('Unexpected error', e)
            }
            break;
        }

        yield {
            result,
            level: nextCheck.level
        }

        checksLeveled = moreMoreChecks.map(check => ({
            check,
            level: nextCheck.level + 1
        })).concat(checksLeveled)
    }
}

export default runChecks
