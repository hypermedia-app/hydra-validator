import { Context } from 'hydra-validator-core'
import { ScenarioStep } from './lib/steps'
import { Loggers } from '../validator-cli'

export interface E2eOptions {
    docs: string;
    cwd: string;
    strict: boolean;
}

export interface E2eContext extends Context {
    scenarios: ScenarioStep[];
    basePath: string;
    headers?: Headers;
    log?: Loggers;
}
