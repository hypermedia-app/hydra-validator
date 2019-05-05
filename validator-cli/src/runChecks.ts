import firstCheck from './checks/url-resolvable'

async function* runChecks(url: string) {
    let [result, moreChecks] = await firstCheck(url)

    yield result

    while (moreChecks.length > 0) {
        const nextCheck = moreChecks.splice(0 ,1)[0]
        let [result, moreMoreChecks] = await nextCheck()

        yield result
        moreChecks = moreChecks.concat(moreMoreChecks)
    }
}

export default runChecks
