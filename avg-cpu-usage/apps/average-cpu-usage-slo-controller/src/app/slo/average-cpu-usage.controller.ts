import { AverageCpuUsageSloConfig } from '@my-org/my-slos';
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
 * Implements the AverageCpuUsage SLO.
 */
export class AverageCpuUsageSlo
  implements ServiceLevelObjective<AverageCpuUsageSloConfig, SloCompliance>
{
  sloMapping: SloMapping<AverageCpuUsageSloConfig, SloCompliance>;

  private metricsSource: MetricsSource;

  configure(
    sloMapping: SloMapping<AverageCpuUsageSloConfig, SloCompliance>,
    metricsSource: MetricsSource,
    orchestrator: OrchestratorGateway
  ): ObservableOrPromise<void> {
    this.sloMapping = sloMapping;
    this.metricsSource = metricsSource;
    return Promise.resolve();
  }

  evaluate(): ObservableOrPromise<SloOutput<SloCompliance>> {
    return this.calculateSloCompliance().then(compliance => ({
      sloMapping: this.sloMapping,

      // These parameters are passed to the elasticity strategy
      elasticityStrategyParams: {
        currSloCompliancePercentage: compliance,
        tolerance: this.sloMapping.spec.sloConfig.tolerance,
      },
    }));
  }

  private async calculateSloCompliance(): Promise<number> {
    // ToDo
  }
}
