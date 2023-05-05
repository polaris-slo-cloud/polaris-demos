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

/**
 * Represents the configuration options of the AverageCpuUsage SLO.
 */
export interface AverageCpuUsageSloConfig {
  /**
   * That target average CPU usage (in percent of the limit,
   * expressed as an integer).
   *
   * @minimum 0
   * @maximum 100
   */
  averageCpuTarget: number;

  /**
   * Specifies the tolerance within which no scaling will be performed
   *
   * @minimum 0
   * @default 10
   */
  tolerance?: number;
}

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
