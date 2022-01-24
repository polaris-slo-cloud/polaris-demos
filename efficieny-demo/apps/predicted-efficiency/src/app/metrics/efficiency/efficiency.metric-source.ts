import {
  ComposedMetricSourceBase,
  MetricsSource,
  ObjectKind,
  OrchestratorGateway,
  Sample,
} from '@polaris-sloc/core';
import { Efficiency, EfficiencyParams } from '@my-org/my-slos';
import axios from 'axios';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { getEnvironmentVariable } from '../../util/environment-var-helper';

// ToDo:
// 1. Insert properties in the PredictionApiResponse and implement the mapResponseToSample function
// 2. Adapt the list of `supportedSloTargetTypes` in `EfficiencyMetricSourceFactory` (see efficiency.metric-source.factory.ts).
// 3. Adapt the `EfficiencyMetricSourceFactory.metricSourceName`, if needed (e.g., if there are multiple sources for EfficiencyMetric that differ
//    based on the supported SloTarget types).
// 4. Implement `EfficiencyMetricSource.getValueStream()` to compute the metric.
// 5. Adapt the `release` label in `../../../../manifests/kubernetes/3-service-monitor.yaml` to ensure that Prometheus will scrape this controller.

/**
 * Computes the `Efficiency` composed metric.
 */
export class EfficiencyMetricSource extends ComposedMetricSourceBase<Efficiency> {
  private readonly baseUrl: string;

  constructor(
    private params: EfficiencyParams,
    metricsSource: MetricsSource,
    orchestrator: OrchestratorGateway
  ) {
    super(metricsSource, orchestrator);
    this.baseUrl = getEnvironmentVariable('AI_PROXY_BASE_URL');
    if (this.baseUrl == null) {
      this.baseUrl = '0.0.0.0:5000';
    }
    console.log(`Using ${this.baseUrl} as baseUrl.`);
  }

  getValueStream(): Observable<Sample<Efficiency>> {
    return this.getDefaultPollingInterval().pipe(
      switchMap(() => callPrediction(this.baseUrl, this.params)),
      map(mapResponseToSample)
    );
  }
}

interface PredictionApiResponse {
  // ToDo
}

async function callPrediction(
  baseUrl: string,
  params: EfficiencyParams
): Promise<PredictionApiResponse> {
  const body = {
    /* eslint-disable @typescript-eslint/naming-convention */
    target_gvk: ObjectKind.stringify(params.sloTarget),
    target_namespace: params.namespace,
    target_name: params.sloTarget.name,
  };
  const response = await axios.post<PredictionApiResponse>(baseUrl, body);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return Promise.resolve(response.data);
}

function mapResponseToSample(
  response: PredictionApiResponse
): Sample<Efficiency> {
  // ToDo
}
