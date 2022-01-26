import {
  DefaultStabilizationWindowTracker, ElasticityStrategy, HorizontalElasticityStrategyControllerBase,
  OrchestratorClient,
  PolarisRuntime, Scale, SloCompliance,
  SloComplianceElasticityStrategyControllerBase,
  SloTarget,
  StabilizationWindowTracker,
} from '@polaris-sloc/core';
import {
  HorizontalElasticityStrategyConfig,
  HorizontalElasticityStrategy,
} from '@my-org/my-strategies';

/** Tracked executions eviction interval of 20 minutes. */
const EVICTION_INTERVAL_MSEC = 20 * 60 * 1000;

/**
 * Controller for the HorizontalElasticityStrategy.
 *
 * ToDo:
 *  1. If you want to restrict the type of workloads that this elasticity strategy can be applied to,
 *     change the first generic parameter from `SloTarget` to the appropriate type.
 *  2. If your elasticity strategy input is not of type `SloCompliance`, change the definition of the controller class
 *     to extend `ElasticityStrategyController` instead of `SloComplianceElasticityStrategyControllerBase`.
 *  3. Implement the `execute()` method.
 *  4. Adapt `manifests/1-rbac.yaml` to include get and update permissions on all resources that you update in the orchestrator during `execute()`.
 */
export class HorizontalElasticityStrategyController extends HorizontalElasticityStrategyControllerBase<
  SloTarget,
  HorizontalElasticityStrategyConfig
> {
  protected computeScale(
    elasticityStrategy: ElasticityStrategy<SloCompliance, SloTarget, HorizontalElasticityStrategyConfig>,
    currScale: Scale,
  ): Promise<Scale> {
    const newScale = new Scale(currScale);
    const multiplier = elasticityStrategy.spec.sloOutputParams.currSloCompliancePercentage / 100;
    newScale.spec.replicas = Math.ceil(currScale.spec.replicas * multiplier);
    return Promise.resolve(newScale);
  }
}
