import { Context } from 'hydra-validator-core'
import { ScenarioStep } from './lib/steps'

export interface E2eOptions {
    docs: string;
    cwd: string;
}

export interface E2eContext extends Context {
    scenarios: ScenarioStep[];
}
