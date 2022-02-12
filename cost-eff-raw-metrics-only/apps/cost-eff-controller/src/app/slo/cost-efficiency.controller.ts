import { CostEfficiencySloConfig } from '@my-org/my-slos';
import {
  Duration,
  Join,
  LabelFilters,
  LabelGrouping,
  MetricUnavailableError,
  MetricsSource,
  ObservableOrPromise,
  OrchestratorGateway,
  ServiceLevelObjective,
  SloCompliance,
  SloMapping,
  SloOutput,
  TimeRange,
  TimeSeriesInstant,
} from '@polaris-sloc/core';
import { of as observableOf } from 'rxjs';
import { CostEfficiency, TotalCost } from './metrics';

interface RequestsFasterThanThresholdInfo {

  /** The percentile of requests that are faster than the threshold. */
  percentileFaster: number;

  /** The absolute number of requests that are faster than the threshold. */
  totalReqFaster: number

}

/**
 * Implements the CostEfficiency SLO.
 */
export class CostEfficiencySlo
  implements ServiceLevelObjective<CostEfficiencySloConfig, SloCompliance>
{
  sloMapping: SloMapping<CostEfficiencySloConfig, SloCompliance>;

  private metricsSource: MetricsSource;

  private minRequestsPercentile: number;
  private targetThresholdSecStr: string;

  configure(
    sloMapping: SloMapping<CostEfficiencySloConfig, SloCompliance>,
    metricsSource: MetricsSource,
    orchestrator: OrchestratorGateway
  ): ObservableOrPromise<void> {
    this.sloMapping = sloMapping;
    this.metricsSource = metricsSource;

    this.targetThresholdSecStr = (sloMapping.spec.sloConfig.responseTimeThresholdMs / 1000).toString();

    if (typeof sloMapping.spec.sloConfig.minRequestsPercentile === 'number') {
      this.minRequestsPercentile = sloMapping.spec.sloConfig.minRequestsPercentile / 100;
    } else {
      this.minRequestsPercentile = 0.9;
    }

    return observableOf(null);
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
    const costEff = await this.computeCostEfficiency();

    if (costEff.totalCost.currentCostPerHour === 0 || costEff.percentileBetterThanThreshold >= this.minRequestsPercentile) {
      return 100;
    }

    if (costEff.costEfficiency === 0) {
      return 200;
    }

    const compliance = (this.sloMapping.spec.sloConfig.targetCostEfficiency / costEff.costEfficiency) * 100
    return Math.ceil(compliance);
  }

  private async getCost(): Promise<TotalCost> {
    const memoryHourlyCostQuery = this.metricsSource.getTimeSeriesSource()
      .select<number>('node', 'ram_hourly_cost');
    const cpuHourlyCostQuery = this.metricsSource.getTimeSeriesSource()
      .select<number>('node', 'cpu_hourly_cost');

    const memoryCostQuery = this.metricsSource.getTimeSeriesSource()
      .select<number>('container', 'memory_working_set_bytes')
      .filterOnLabel(LabelFilters.equal('namespace', this.sloMapping.metadata.namespace))
      .divideBy(1024)
      .divideBy(1024)
      .divideBy(1024)
      .multiplyBy(memoryHourlyCostQuery, Join.onLabels('node').groupLeft())
      .sumByGroup(LabelGrouping.by('pod'));

    const cpuCostQuery = this.metricsSource.getTimeSeriesSource()
      .select<number>('node', 'namespace_pod_container:container_cpu_usage_seconds_total:sum_rate')
      .filterOnLabel(LabelFilters.equal('namespace', this.sloMapping.metadata.namespace))
      .multiplyBy(cpuHourlyCostQuery, Join.onLabels('node').groupLeft())
      .sumByGroup(LabelGrouping.by('pod'));

    const totalCostQuery = memoryCostQuery.add(cpuCostQuery)
      .sumByGroup();

    const totalCost = await totalCostQuery.execute();

    if (!totalCost.results || totalCost.results.length === 0) {
      throw new MetricUnavailableError('total cost');
    }

    return {
      currentCostPerHour: totalCost.results[0].samples[0].value,
      accumulatedCostInPeriod: totalCost.results[0].samples[0].value,
    };
  }

  private async computeCostEfficiency(): Promise<CostEfficiency> {
    const totalCost = await this.getCost();
    const reqFasterThan = await this.getPercentileFasterThanThreshold();
    return {
      costEfficiency: reqFasterThan.totalReqFaster / totalCost.currentCostPerHour,
      percentileBetterThanThreshold: reqFasterThan.percentileFaster,
      totalCost,
    };
  }

  private async getPercentileFasterThanThreshold(): Promise<RequestsFasterThanThresholdInfo> {
    const fasterThanBucketQuery = this.metricsSource.getTimeSeriesSource()
      .select<number>('nginx', 'ingress_controller_request_duration_seconds_bucket', TimeRange.fromDuration(Duration.fromMinutes(1)))
      .filterOnLabel(LabelFilters.regex('ingress', `${this.sloMapping.spec.targetRef.name}.*`))
      .filterOnLabel(LabelFilters.equal('le', this.targetThresholdSecStr))
      .rate()
      .sumByGroup(LabelGrouping.by('path'));

    const reqCountQuery = this.metricsSource.getTimeSeriesSource()
      .select<number>('nginx', 'ingress_controller_request_duration_seconds_count', TimeRange.fromDuration(Duration.fromMinutes(1)))
      .filterOnLabel(LabelFilters.regex('ingress', `${this.sloMapping.spec.targetRef.name}.*`))
      .rate()
      .sumByGroup(LabelGrouping.by('path'));

    const [fasterThanBucketResult, reqCountResult] = await Promise.all([fasterThanBucketQuery.execute(), reqCountQuery.execute()]);

    if (!fasterThanBucketResult.results || fasterThanBucketResult.results.length === 0) {
      throw new MetricUnavailableError('ingress_controller_request_duration_seconds_bucket', fasterThanBucketQuery);
    }
    if (!reqCountResult.results || reqCountResult.results.length === 0) {
      throw new MetricUnavailableError('ingress_controller_request_duration_seconds_count', reqCountQuery);
    }

    const totalReqFasterThanThreshold = this.sumResults(fasterThanBucketResult.results);
    const totalReqCount = this.sumResults(reqCountResult.results);

    if (totalReqCount === 0) {
      return {
        percentileFaster: 1,
        totalReqFaster: 0,
      };
    }
    return {
      percentileFaster: totalReqFasterThanThreshold / totalReqCount,
      totalReqFaster: totalReqFasterThanThreshold,
    };
  }

  private sumResults(results: TimeSeriesInstant<number>[]): number {
    let sum = 0;
    results.forEach(result => sum += result.samples[0].value);
    return sum;
  }
}
