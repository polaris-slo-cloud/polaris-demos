import { CostEfficiencySloConfig } from '@my-org/my-slos';
import {
  MetricsSource,
  ObservableOrPromise,
  PolarisRuntime,
  ServiceLevelObjective,
  SloCompliance,
  SloMapping,
  SloOutput,
} from '@polaris-sloc/core';

/**
 * Implements the CostEfficiency SLO.
 *
 * ToDo: Change SloOutput type if necessary.
 */
export class CostEfficiencySlo
  implements ServiceLevelObjective<CostEfficiencySloConfig, SloCompliance> {
  sloMapping: SloMapping<CostEfficiencySloConfig, SloCompliance>;

  private metricsSource: MetricsSource;

  configure(
    sloMapping: SloMapping<CostEfficiencySloConfig, SloCompliance>,
    metricsSource: MetricsSource,
    polarisRuntime: PolarisRuntime
  ): ObservableOrPromise<void> {
    this.sloMapping = sloMapping;
    this.metricsSource = metricsSource;

    // ToDo
  }

  evaluate(): ObservableOrPromise<SloOutput<SloCompliance>> {
    // ToDo
  }
}
