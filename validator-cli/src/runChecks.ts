import {checkChain} from './checks/check';

async function* runChecks(firstCheck: checkChain) {
    const [result, moreChecks] = await firstCheck()

    yield {
        result,
        level: 0
    }

    let checksLeveled = moreChecks.map(check => ({
        level: 1,
        check
    }))

    while (checksLeveled.length > 0) {
        const nextCheck = checksLeveled.splice(0 ,1)[0]
        let [result, moreMoreChecks] = await nextCheck.check()

        yield {
            result,
            level: nextCheck.level
        }

        checksLeveled = checksLeveled.concat(moreMoreChecks.map(check => ({
            check,
            level: nextCheck.level + 1
        })))
    }
}

export default runChecks
