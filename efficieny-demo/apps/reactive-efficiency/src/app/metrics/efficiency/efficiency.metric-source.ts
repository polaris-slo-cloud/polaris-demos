import {
  ComposedMetricSourceBase,
  MetricsSource,
  OrchestratorGateway,
  Sample,
} from '@polaris-sloc/core';
import { Efficiency, EfficiencyParams } from '@my-org/my-slos';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators'

/**
 * Computes the `Efficiency` composed metric.
 */
export class EfficiencyMetricSource extends ComposedMetricSourceBase<Efficiency> {
  constructor(
    private params: EfficiencyParams,
    metricsSource: MetricsSource,
    orchestrator: OrchestratorGateway
  ) {
    super(metricsSource, orchestrator);
  }

  getValueStream(): Observable<Sample<Efficiency>> {
    return this.getDefaultPollingInterval().pipe(
      switchMap(() => this.getEfficiency()),
    );
  }

  private async getEfficiency(): Promise<Sample<Efficiency>> {
    // We do not filter by label, because in our demo, there is only one polaris_composed_efficiency metric.
    const effQuery = this.metricsSource.getTimeSeriesSource()
      .select<number>('polaris_composed', 'efficiency')
      .multiplyBy(1000);

    const queryResult = await effQuery.execute();
    if (queryResult.results?.length > 0) {
      const result = queryResult.results[0].samples[0];
      return {
        timestamp: result.timestamp,
        value: { efficiency: result.value },
      };
    }
  }

}
