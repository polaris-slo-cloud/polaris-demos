import {
    ComposedMetricSourceBase,
    Duration,
    LabelFilter,
    LabelFilters,
    LabelGrouping,
    MetricsSource,
    OrchestratorGateway,
    Sample,
    TimeInstantQuery,
    TimeRange,
} from '@polaris-sloc/core';
import {
    ResourceEfficiency,
    ResourceEfficiencyParams,
} from '@polaris-sloc/efficiency-mappings';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators'

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
        return this.getDefaultPollingInterval().pipe(
            switchMap(() => this.getResourceEfficiency()),
        );
    }

    private async getResourceEfficiency(): Promise<Sample<ResourceEfficiency>> {
        // Average total CPU usage in a deployment = average of the total CPU usage of all its pods.
        const avgTotalPodCpuUsageQ = this.metricsSource.getTimeSeriesSource()
            .select<number>('container', 'cpu_usage_seconds_total', TimeRange.fromDuration(Duration.fromSeconds(40)))
            .filterOnLabel(this.createNamespaceFilter())
            .filterOnLabel(this.createPodFilter())
            .filterOnLabel(this.createResourceUsageContainerFilter())
            .rate() // CPU Usage of the single containers in the pod.
            .sumByGroup(LabelGrouping.by('pod')) // Sum of the CPU usage of all containers in a pod.
            .averageByGroup(); // Average total CPU usage across all pods of the deployment.

        // Average total memory usage in a deployment = average of the total memory usage of all its pods.
        const avgTotalPodMemUsageQ = this.metricsSource.getTimeSeriesSource()
            .select<number>('container', 'memory_usage_bytes')
            .filterOnLabel(this.createNamespaceFilter())
            .filterOnLabel(this.createPodFilter())
            .filterOnLabel(this.createResourceUsageContainerFilter())
            .sumByGroup(LabelGrouping.by('pod')) // Sum of the memory usage of all containers in a pod.
            .averageByGroup(); // Average total memory usage across all pods of the deployment.

        // Calculate the total resource efficiency.
        const cpuUsageEfficiencyQ = avgTotalPodCpuUsageQ.divideBy(this.createResourceLimitQuery('cpu'));
        const memUsageEfficiencyQ = avgTotalPodMemUsageQ.divideBy(this.createResourceLimitQuery('memory'));
        const resourceEfficiencyQ = cpuUsageEfficiencyQ.add(memUsageEfficiencyQ).divideBy(2);

        const queryResult = await resourceEfficiencyQ.execute();
        if (queryResult.results?.length > 0) {
            const result = queryResult.results[0].samples[0];
            return {
                timestamp: result.timestamp,
                value: { efficiency: result.value * 100 },
            };
        }
    }

    /**
     * @returns A query for the sum of the CPU or memory limits across all containers of a pod.
     */
    private createResourceLimitQuery(resourceType: 'cpu' | 'memory'): TimeInstantQuery<number> {
        return this.metricsSource.getTimeSeriesSource()
            .select<number>('kube_pod_container', 'resource_limits')
            .filterOnLabel(LabelFilters.equal('resource', resourceType))
            .filterOnLabel(this.createNamespaceFilter())
            .filterOnLabel(this.createPodFilter())
            .filterOnLabel(LabelFilters.notEqual('container_name', 'kube-state-metrics'))
            .averageByGroup(LabelGrouping.by('container')) // The limit is the same for all pods, so avg() reduces the time series to a single value per container.
            .sumByGroup(); // Sum the limits of all containers to get the total limit of the pod.
    }

    private createNamespaceFilter(): LabelFilter {
        return LabelFilters.equal('namespace', this.params.namespace);
    }

    private createPodFilter(): LabelFilter {
        return LabelFilters.regex('pod', `${this.params.sloTarget.name}.*`);
    }

    private createResourceUsageContainerFilter(): LabelFilter {
        return LabelFilters.notEqual('container', '');
    }
}
