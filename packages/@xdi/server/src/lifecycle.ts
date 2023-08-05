export namespace Lifecycle {
  export enum Phase {
    Idle = 'idle',
    GatheringParameters = 'gathering-parameters',
    ValidatingParameters = 'validating-parameters',
    RunningMiddleware = 'running-middleware',
    RunningHandler = 'running-handler',
  }
}

export class LifecycleManager {
  constructor(private readonly request: any) {}
}
