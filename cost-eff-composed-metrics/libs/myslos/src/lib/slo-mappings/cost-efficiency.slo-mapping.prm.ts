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

// ToDo after code generation:
// - Add configuration parameters to the CostEfficiencySloConfig interface.
// - If the SLO does not produce SloCompliance objects as output,
//   adapt the second generic parameter of CostEfficiencySloMappingSpec accordingly.
// - If the SLO should operate on a subtype of SloTarget,
//   adapt the third generic parameter of CostEfficiencySloMappingSpec accordingly.
// - (optional) Replace the ObjectKind.group in the constructor of CostEfficiencySloMapping with your own.
//   If you change the group name, ensure that you also accordingly adapt the `1-rbac.yaml` files of all
//   SLO controllers that need to write this SloMapping CRD.

/**
 * Represents the configuration options of the CostEfficiency SLO.
 */
export interface CostEfficiencySloConfig {}

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
      group: 'slo.polaris-slo-cloud.github.io',
      version: 'v1',
      kind: 'CostEfficiencySloMapping',
    });
    initSelf(this, initData);
  }
}
