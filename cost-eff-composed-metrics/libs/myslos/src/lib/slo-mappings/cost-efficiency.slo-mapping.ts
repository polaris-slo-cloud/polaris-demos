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
 * Represents the configuration options of the CostEfficiency SLO.
 */
export interface CostEfficiencySloConfig {
  // ToDo: Add SLO configuration properties.
}

/**
 * The spec type for the CostEfficiency SLO.
 */
export class CostEfficiencySloMappingSpec extends SloMappingSpecBase<
  // The SLO's configuration.
  CostEfficiencySloConfig,
  // The output type of the SLO.
  SloCompliance,
  // The type of target(s) that the SLO can be applied to.
  SloTarget
> {}

/**
 * Represents an SLO mapping for the CostEfficiency SLO, which can be used to apply and configure the CostEfficiency SLO.
 */
export class CostEfficiencySloMapping extends SloMappingBase<CostEfficiencySloMappingSpec> {
  @PolarisType(() => CostEfficiencySloMappingSpec)
  spec: CostEfficiencySloMappingSpec;

  constructor(initData?: SloMappingInitData<CostEfficiencySloMapping>) {
    super(initData);
    this.objectKind = new ObjectKind({
      group: 'slo.example.github.io', // ToDo: Replace the group with your own.
      version: 'v1',
      kind: 'CostEfficiencySloMapping',
    });
    initSelf(this, initData);
  }
}
