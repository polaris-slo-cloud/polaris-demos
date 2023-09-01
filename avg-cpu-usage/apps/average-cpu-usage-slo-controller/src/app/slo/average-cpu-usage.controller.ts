import { AverageCpuUsageSloConfig } from '@my-org/my-slos';
import {
  Duration,
  LabelFilters,
  LabelGrouping,
  MetricsSource,
  ObservableOrPromise,
  OrchestratorGateway,
  ServiceLevelObjective,
  SloCompliance,
  SloMapping,
  SloOutput,
  TimeRange,
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
    const sloTarget = this.sloMapping.spec.targetRef;

    // Average CPU usage (in millicores) over all pods in the deployment.
    const avgMilliCoresQ = this.metricsSource.getTimeSeriesSource()
      .select<number>(
        'container',
        'cpu_usage_seconds_total',
        TimeRange.fromDuration(Duration.fromSeconds(70)),
      )
      .filterOnLabel(
        LabelFilters.equal(
          'namespace',
          this.sloMapping.metadata.namespace,
        ),
      )
      .filterOnLabel(LabelFilters.regex('pod', `${sloTarget.name}-.*`))
      .rate()
      .sumByGroup(LabelGrouping.by('pod'))
      .averageByGroup();

    // CPU limit (in millicores) of a pod in the deployment.
    const limitMilliCoresQ = this.metricsSource.getTimeSeriesSource()
      .select('kube', 'pod_container_resource_limits')
      .filterOnLabel(LabelFilters.equal('resource', 'cpu'))
      .filterOnLabel(
        LabelFilters.equal(
          'namespace',
          this.sloMapping.metadata.namespace,
        ),
      )
      .filterOnLabel(LabelFilters.regex('pod', `${sloTarget.name}-.*`))
      .filterOnLabel(
        LabelFilters.notEqual(
          'container_name',
          'kube-state-metrics'
        ),
      )
      .averageByGroup(LabelGrouping.by('container'))
      .sumByGroup();

    // Average CPU usage in percent of the limit.
    const cpuUsageQ = avgMilliCoresQ.divideBy(limitMilliCoresQ);

    const result = await cpuUsageQ.execute();
    if (result.results.length === 0) {
      throw new Error('Metric could not be read.');
    }
    // The result is in a range from 0.0 to 1.0,
    // so we need to multiply by 100,
    // because our SLO is configured in a range from 0 to 100.
    const cpuAvg = result.results[0].samples[0].value * 100;
    if (!cpuAvg) {
      return 100;
    }
    const compliance =
      cpuAvg / this.sloMapping.spec.sloConfig.averageCpuTarget;
    // A value of 1.0 of the `compliance` variable is equal to 100%,
    // but currSloCompliancePercentage expects an integer
    // with a value of 100 indicating 100%.
    return Math.ceil(compliance * 100);
  }
}
