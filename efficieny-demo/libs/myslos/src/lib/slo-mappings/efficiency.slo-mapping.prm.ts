import {
  ObjectKind,
  PolarisType,
  SloCompliance,
  SloMappingBase,
  SloMappingInitData,
  SloMappingSpecBase,
  SloTarget,
  initSelf,
} from '@polaris-sloc/core';

/**
 * Represents the configuration options of the Efficiency SLO.
 */
export interface EfficiencySloConfig {

  /**
   * The desired target efficiency in the range between 0 and 100.
   *
   * @minimum 0
   * @maximum 100
   */
  targetEfficiency: number;

}

/**
 * The spec type for the Efficiency SLO.
 */
export class EfficiencySloMappingSpec extends SloMappingSpecBase<
  // The SLO's configuration.
  EfficiencySloConfig,
  // The output type of the SLO.
  SloCompliance,
  // The type of target(s) that the SLO can be applied to.
  SloTarget
> {}

/**
 * Represents an SLO mapping for the Efficiency SLO, which can be used to apply and configure the Efficiency SLO.
 */
export class EfficiencySloMapping extends SloMappingBase<EfficiencySloMappingSpec> {
  @PolarisType(() => EfficiencySloMappingSpec)
  spec: EfficiencySloMappingSpec;

  constructor(initData?: SloMappingInitData<EfficiencySloMapping>) {
    super(initData);
    this.objectKind = new ObjectKind({
      group: 'slo.polaris-slo-cloud.github.io',
      version: 'v1',
      kind: 'EfficiencySloMapping',
    });
    initSelf(this, initData);
  }
}
