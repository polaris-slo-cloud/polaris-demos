import {
  ObjectKind,
  PolarisType,
  SloCompliance,
  SloMappingBase,
  SloMappingInitData,
  SloMappingSpecBase,
  SloTarget,
  initSelf,
} from "@polaris-sloc/core";

// ToDo after code generation:
// - Add configuration parameters to the AverageCpuUsageSloConfig interface.
// - If the SLO does not produce SloCompliance objects as output,
//   adapt the second generic parameter of AverageCpuUsageSloMappingSpec accordingly.
// - If the SLO should operate on a subtype of SloTarget,
//   adapt the third generic parameter of AverageCpuUsageSloMappingSpec accordingly.
// - (optional) Replace the ObjectKind.group in the constructor of AverageCpuUsageSloMapping with your own.
//   If you change the group name, ensure that you also accordingly adapt the `1-rbac.yaml` files of all
//   SLO controllers that need to write this SloMapping CRD.

/**
 * Represents the configuration options of the AverageCpuUsage SLO.
 */
export interface AverageCpuUsageSloConfig {}

/**
 * The spec type for the AverageCpuUsage SLO.
 */
export class AverageCpuUsageSloMappingSpec extends SloMappingSpecBase<
  // The SLO's configuration.
  AverageCpuUsageSloConfig,
  // The output type of the SLO.
  SloCompliance,
  // The type of target(s) that the SLO can be applied to.
  SloTarget
> {}

/**
 * Represents an SLO mapping for the AverageCpuUsage SLO, which can be used to apply and configure the AverageCpuUsage SLO.
 */
export class AverageCpuUsageSloMapping extends SloMappingBase<AverageCpuUsageSloMappingSpec> {
  @PolarisType(() => AverageCpuUsageSloMappingSpec)
  spec: AverageCpuUsageSloMappingSpec;

  constructor(initData?: SloMappingInitData<AverageCpuUsageSloMapping>) {
    super(initData);
    this.objectKind = new ObjectKind({
      group: "slo.polaris-slo-cloud.github.io",
      version: "v1",
      kind: "AverageCpuUsageSloMapping",
    });
    initSelf(this, initData);
  }
}
