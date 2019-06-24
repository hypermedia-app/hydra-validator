import { checkChain, Context, Result, IResult } from 'hydra-validator-core'
import { Hydra } from 'alcaeus'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { HydraResource } from 'alcaeus/types/Resources'

interface E2eOptions {
    docs: string;
}

interface ApiTestScenarios {
    resources: {
        [id: string]: ScenarioStep[];
    };
}

interface ScenarioStep {
    type: 'Resource' | 'Property' | 'Invocation' | 'Expectation' | 'Link' | 'Follow';
    children?: ScenarioStep[];
}

interface ResponseAssertion extends ScenarioStep {
    expectation: 'Status' | 'Header';
    code: number;
    name: string;
    captureValueAs: string;
}

interface FollowStep extends ScenarioStep {
    resourceId: string;
}

interface PropertyStep extends ScenarioStep {
    propertyId: string;
}

interface InvocationStep extends ScenarioStep {
    operationId: string;
}

interface RepresentationStep extends ScenarioStep {
    id: string;
}

function expectationCheck (response: IHydraResponse, expectation: ResponseAssertion, scope: Context): checkChain {
    return function () {
        let result: IResult

        switch (expectation.expectation) {
            case 'Header':
                result = response.xhr.headers.has(expectation.name)
                    ? Result.Success(`Found '${expectation.name}' header`)
                    : Result.Failure(`Expected to find response header ${expectation.name}`)

                scope[expectation.captureValueAs] = response.xhr.headers.get(expectation.name)

                break
            case 'Status':
                result = response.xhr.status === expectation.code
                    ? Result.Success(`Status code '${expectation.code}'`)
                    : Result.Failure(`Expected status code ${expectation.code} but got ${response.xhr.status}`)
                break
            default:
                result = Result.Failure(`Unrecognized assertion ${expectation.type}`)
                break
        }

        return { result }
    }
}

function operationChecks (resource: HydraResource, step: InvocationStep): checkChain<E2eContext> {
    const operation = resource.operations.find(op => op._supportedOperation.id === step.operationId)
    if (!operation) {
        return () => ({
            result: Result.Failure(`Operation ${step.operationId} not found`),
        })
    }

    return async function invokeOperation () {
        const response: IHydraResponse = await operation.invoke('')

        let nextChecks: checkChain<E2eContext>[] = []
        if (step.children) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            nextChecks = [ responseChecks(response, step.children) ]
        }

        return {
            result: Result.Informational(`Invoked operation '${operation.title}'`),
            nextChecks,
        }
    }
}

function propertyChecks (resource: HydraResource & any, step: PropertyStep): checkChain<E2eContext> {
    return function () {
        const result: IResult = resource[step.propertyId]
            ? Result.Informational(`Stepping into property ${step.propertyId}`)
            : Result.Failure(`Property ${step.propertyId} missing on resource ${resource.id}`)

        let nextChecks: checkChain<E2eContext>[] = []
        if (step.children && result.status !== 'failure') {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            nextChecks.push(representationChecks(resource[step.propertyId] as HydraResource, step.children))
        }

        return {
            result,
            nextChecks,
        }
    }
}

function linkChecks (resource: HydraResource & any, step: PropertyStep): checkChain<E2eContext> {
    return async function checkLink () {
        const result: IResult = resource[step.propertyId]
            ? Result.Informational(`Stepping into link ${step.propertyId}`)
            : Result.Failure(`Link ${step.propertyId} missing on resource ${resource.id}`)

        let nextChecks: checkChain<E2eContext>[] = []
        if (result.status !== 'failure') {
            const linkedResource = resource[step.propertyId] as HydraResource
            const response = await Hydra.loadResource(linkedResource.id)
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            nextChecks.push(responseChecks(response, step.children || []))
        }

        return {
            result,
            nextChecks,
        }
    }
}

function followCheck (step: FollowStep, scope: Context): checkChain<E2eContext> {
    return async function checkLink () {
        const resourceId = scope[step.resourceId]

        const result: IResult = resourceId
            ? Result.Informational(`Stepping into resource ${resourceId}`)
            : Result.Failure(`Variable ${step.resourceId} not found`)

        let nextChecks: checkChain<E2eContext>[] = []
        if (result.status !== 'failure') {
            const response = await Hydra.loadResource(resourceId)
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            nextChecks.push(responseChecks(response, step.children || []))
        }

        return {
            result,
            nextChecks,
        }
    }
}

function representationChecks (resource: HydraResource, resourceScenario: ScenarioStep[]): checkChain<E2eContext> {
    return function checkRepresentation () {
        const nextChecks = resourceScenario.reduce((checks, scenarioStep) => {
            switch (scenarioStep.type) {
                case 'Property':
                    checks.push(propertyChecks(resource, scenarioStep as PropertyStep))
                    break
                case 'Invocation':
                    checks.push(operationChecks(resource, scenarioStep as InvocationStep))
                    break
                case 'Link':
                    checks.push(linkChecks(resource, scenarioStep as PropertyStep))
                    break
            }

            return checks
        }, [] as checkChain<E2eContext>[])

        return {
            nextChecks,
        }
    }
}

function responseChecks (response: IHydraResponse, steps: ScenarioStep[]): checkChain<E2eContext> {
    const localScope = {}

    return function checkResponse (this: E2eContext) {
        const nextChecks: checkChain<E2eContext>[] = []

        steps.filter(step => step.type === 'Expectation')
            .reduce((checks, step) => {
                checks.push(expectationCheck(response, step as ResponseAssertion, localScope))

                return checks
            }, nextChecks)

        steps.filter(step => step.type === 'Follow')
            .reduce((checks, step) => {
                checks.push(followCheck(step as FollowStep, localScope))

                return checks
            }, nextChecks)

        const resource = response.root
        if (resource) {
            const resourceSteps = this.scenarios.filter(step => step.type === 'Resource')
                .filter(step => step.children && step.children.length > 0) as RepresentationStep[]

            [...steps, ...resourceSteps].reduce((checks, step) => {
                if (resource.types.contains(step.id)) {
                    checks.push(representationChecks(resource, step.children || []))
                }

                return checks
            }, nextChecks)
        }

        return {
            nextChecks,
        }
    }
}

interface E2eContext extends Context {
    scenarios: ScenarioStep[];
}

export function check (url: string, { docs }: E2eOptions): checkChain<E2eContext> {
    if (!docs) {
        throw new Error()
    }

    return async function tryFetch (this: E2eContext) {
        this.scenarios = await import(docs)

        const response = await Hydra.loadResource(url)

        return {
            result: Result.Informational(`Fetched representation of ${url}`),
            nextChecks: [
                responseChecks(response, []),
            ],
            sameLevel: true,
        }
    }
}

export const options = [
    {
        flags: '-d, --docs <docsPath>',
    },
]
