import { Efficiency, EfficiencyMetric, EfficiencyParams, EfficiencySloConfig } from '@my-org/my-slos';
import {
  ComposedMetricSource,
  createOwnerReference, Logger,
  MetricsSource,
  ObservableOrPromise,
  OrchestratorGateway,
  ServiceLevelObjective,
  SloCompliance,
  SloMapping,
  SloOutput,
} from '@polaris-sloc/core';
import { of } from 'rxjs';

/**
 * Implements the Efficiency SLO.
 */
export class EfficiencySlo
  implements ServiceLevelObjective<EfficiencySloConfig, SloCompliance>
{
  sloMapping: SloMapping<EfficiencySloConfig, SloCompliance>;

  private metricsSource: MetricsSource;
  private effMetricSource: ComposedMetricSource<Efficiency>;

  configure(
    sloMapping: SloMapping<EfficiencySloConfig, SloCompliance>,
    metricsSource: MetricsSource,
    orchestrator: OrchestratorGateway
  ): ObservableOrPromise<void> {
    this.sloMapping = sloMapping;
    this.metricsSource = metricsSource;

    const effMetricParams: EfficiencyParams = {
      namespace: sloMapping.metadata.namespace,
      sloTarget: sloMapping.spec.targetRef,
      owner: createOwnerReference(sloMapping),
    };
    this.effMetricSource = metricsSource.getComposedMetricSource(EfficiencyMetric.instance, effMetricParams);

    return of(undefined);
  }

  evaluate(): ObservableOrPromise<SloOutput<SloCompliance>> {
    return this.calculateSloCompliance()
      .then(sloCompliance => ({
        sloMapping: this.sloMapping,
        elasticityStrategyParams: {
          currSloCompliancePercentage: sloCompliance,
        },
      }));
  }

  private async calculateSloCompliance(): Promise<number> {
    const eff = await this.effMetricSource.getCurrentValue().toPromise();
    if (!eff) {
      Logger.log('Obtaining efficiency metric returned:', eff);
      return 100;
    }
    const compliance = (this.sloMapping.spec.sloConfig.targetEfficiency / eff.value.efficiency) * 100
    return Math.ceil(compliance);
  }
}
