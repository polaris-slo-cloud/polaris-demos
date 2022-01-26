import {
  ElasticityStrategy,
  ElasticityStrategyKind,
  SloCompliance,
  SloTarget,
  initSelf,
} from '@polaris-sloc/core';

// ToDo after code generation:
// - Add configuration parameters to the HorizontalElasticityStrategyConfig interface.
// - If the elasticity strategy does not take SloCompliance objects as input,
//   adapt the first generic parameter of HorizontalElasticityStrategyKind and HorizontalElasticityStrategy accordingly.
// - If the elasticity strategy should operate on a subtype of SloTarget,
//   adapt the second generic parameter of HorizontalElasticityStrategyKind and HorizontalElasticityStrategy accordingly.

/**
 * Configuration options for HorizontalElasticityStrategy.
 */
export interface HorizontalElasticityStrategyConfig {
  /**
   * The minimum number of replicas that the target workload must have.
   */
  minReplicas?: number;

  /**
   * The maximum number of replicas that the target workload must have.
   */
  maxReplicas?: number;
}

/**
 * Denotes the elasticity strategy kind for the HorizontalElasticityStrategy.
 */
export class HorizontalElasticityStrategyKind extends ElasticityStrategyKind<
  SloCompliance,
  SloTarget
> {
  constructor() {
    super({
      group: 'elasticity.polaris-slo-cloud.github.io',
      version: 'v1',
      kind: 'HorizontalElasticityStrategy',
    });
  }
}

/**
 * Defines the HorizontalElasticityStrategy.
 */
export class HorizontalElasticityStrategy extends ElasticityStrategy<
  SloCompliance,
  SloTarget,
  HorizontalElasticityStrategyConfig
> {
  constructor(initData?: Partial<HorizontalElasticityStrategy>) {
    super(initData);
    this.objectKind = new HorizontalElasticityStrategyKind();
    initSelf(this, initData);
  }
}
