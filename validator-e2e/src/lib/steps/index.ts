export interface ScenarioStep {
    type: 'Resource' | 'Property' | 'Operation' | 'Invocation' | 'Expectation' | 'Link' | 'Follow';
    children?: ScenarioStep[];
}

export interface FollowStep extends ScenarioStep {
    resourceId: string;
    executed: boolean;
}
