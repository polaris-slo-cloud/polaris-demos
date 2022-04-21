import {
    ComposedMetricSource,
    ComposedMetricSourceFactory,
    MetricsSource,
    ObjectKind,
    OrchestratorGateway,
} from '@polaris-sloc/core';
import {
    ResourceEfficiency,
    ResourceEfficiencyMetric,
    ResourceEfficiencyParams,
} from '@polaris-sloc/efficiency-mappings';
import { ResourceEfficiencyMetricSource } from './resource-efficiency.metric-source';

/**
 * Factory for creating `ResourceEfficiencyMetricSource` instances that supply metrics of type `ResourceEfficiencyMetric`.
 */
export class ResourceEfficiencyMetricSourceFactory
    implements
        ComposedMetricSourceFactory<
            ResourceEfficiencyMetric,
            ResourceEfficiency,
            ResourceEfficiencyParams
        >
{
    /**
     * The list of supported `SloTarget` types.
     *
     * This list can be used for registering an instance of this factory for each supported
     * `SloTarget` type with the `MetricsSourcesManager`. This registration must be done if the metric source should execute in the current process,
     * i.e., metric source instances can be requested through `MetricSource.getComposedMetricSource()`.
     *
     * When creating a composed metric controller, the list of compatible `SloTarget` types is determined by
     * the `ComposedMetricMapping` type.
     */
    static supportedSloTargetTypes: ObjectKind[] = [
        new ObjectKind({
            group: 'apps',
            version: 'v1',
            kind: 'Deployment',
        }),
        new ObjectKind({
            group: 'apps',
            version: 'v1',
            kind: 'StatefulSet',
        }),
        new ObjectKind({
            group: 'apps',
            version: 'v1',
            kind: 'ReplicaSet',
        }),
        new ObjectKind({
            group: 'apps',
            version: 'v1',
            kind: 'DaemonSet',
        }),
    ];

    readonly metricType = ResourceEfficiencyMetric.instance;

    readonly metricSourceName = `${ResourceEfficiencyMetric.instance.metricTypeName}/generic-resource-efficiency`;

    createSource(
        params: ResourceEfficiencyParams,
        metricsSource: MetricsSource,
        orchestrator: OrchestratorGateway
    ): ComposedMetricSource<ResourceEfficiency> {
        return new ResourceEfficiencyMetricSource(
            params,
            metricsSource,
            orchestrator
        );
    }
}
