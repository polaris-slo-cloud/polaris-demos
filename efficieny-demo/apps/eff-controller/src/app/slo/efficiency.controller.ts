import { EfficiencySloConfig } from '@my-org/my-slos';
import {
  MetricsSource,
  ObservableOrPromise,
  OrchestratorGateway,
  ServiceLevelObjective,
  SloCompliance,
  SloMapping,
  SloOutput,
} from '@polaris-sloc/core';

/**
 * Implements the Efficiency SLO.
 *
 * ToDo: Change SloOutput type if necessary.
 */
export class EfficiencySlo
  implements ServiceLevelObjective<EfficiencySloConfig, SloCompliance>
{
  sloMapping: SloMapping<EfficiencySloConfig, SloCompliance>;

  private metricsSource: MetricsSource;

  configure(
    sloMapping: SloMapping<EfficiencySloConfig, SloCompliance>,
    metricsSource: MetricsSource,
    orchestrator: OrchestratorGateway
  ): ObservableOrPromise<void> {
    this.sloMapping = sloMapping;
    this.metricsSource = metricsSource;

    // ToDo
  }

  evaluate(): ObservableOrPromise<SloOutput<SloCompliance>> {
    // ToDo
  }
}
