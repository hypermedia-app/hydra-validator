import { Context } from 'hydra-validator-core'

export interface E2eOptions {
    docs: string;
    cwd: string;
}

export interface ApiTestScenarios {
    steps: ScenarioStep[];
}

export interface E2eContext extends Context {
    scenarios: ScenarioStep[];
}

export interface ScenarioStep {
    type: 'Resource' | 'Property' | 'Operation' | 'Invocation' | 'Expectation' | 'Link' | 'Follow';
    children?: ScenarioStep[];
}

export interface ResponseAssertion extends ScenarioStep {
    expectation: 'Status' | 'Header';
    code: number;
    name: string;
    captureValueAs: string;
}

export interface FollowStep extends ScenarioStep {
    resourceId: string;
    executed: boolean;
}

export interface PropertyStep extends ScenarioStep {
    propertyId: string;
    executed: boolean;
}

export interface OperationStep extends ScenarioStep {
    operationId: string;
    executed: boolean;
}

export interface InvocationStep extends ScenarioStep {
    body: string;
    executed: boolean;
}

export interface RepresentationStep extends ScenarioStep {
    id: string;
    executed: boolean;
}
