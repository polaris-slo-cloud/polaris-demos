import {
    ComposedMetricSourceBase,
    MetricsSource,
    OrchestratorGateway,
    Sample,
} from '@polaris-sloc/core';
import {
    ResourceEfficiency,
    ResourceEfficiencyParams,
} from '@polaris-sloc/efficiency-mappings';
import { Observable } from 'rxjs';

// ToDo:
// 1. Adapt the list of `supportedSloTargetTypes` in `ResourceEfficiencyMetricSourceFactory` (see resource-efficiency.metric-source.factory.ts).
// 2. Adapt the `ResourceEfficiencyMetricSourceFactory.metricSourceName`, if needed (e.g., if there are multiple sources for ResourceEfficiencyMetric that differ
//    based on the supported SloTarget types).
// 3. Implement `ResourceEfficiencyMetricSource.getValueStream()` to compute the metric.
// 4. Adapt the `release` label in `../../../../manifests/kubernetes/3-service-monitor.yaml` to ensure that Prometheus will scrape this controller.

/**
 * Computes the `ResourceEfficiency` composed metric.
 */
export class ResourceEfficiencyMetricSource extends ComposedMetricSourceBase<ResourceEfficiency> {
    constructor(
        private params: ResourceEfficiencyParams,
        metricsSource: MetricsSource,
        orchestrator: OrchestratorGateway
    ) {
        super(metricsSource, orchestrator);
    }

    getValueStream(): Observable<Sample<ResourceEfficiency>> {
        // ToDo
    }
}
