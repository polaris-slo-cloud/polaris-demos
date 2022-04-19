import {
    ComposedMetricMapping,
    ComposedMetricMappingSpec,
    ComposedMetricParams,
    ComposedMetricType,
    POLARIS_API,
} from '@polaris-sloc/core';

/**
 * Represents the value of a ResourceEfficiency metric.
 */
export interface ResourceEfficiency {

    /**
     * The current efficiency in the range between 0 and 100.
     */
    efficiency: number;

}

/**
 * The parameters for retrieving the ResourceEfficiency metric.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ResourceEfficiencyParams extends ComposedMetricParams {}

/**
 * Represents the type of a generic cost efficiency metric.
 */
export class ResourceEfficiencyMetric extends ComposedMetricType<
    ResourceEfficiency,
    ResourceEfficiencyParams
> {
    /** The singleton instance of this type. */
    static readonly instance = new ResourceEfficiencyMetric();

    readonly metricTypeName =
        POLARIS_API.METRICS_GROUP + '/v1/resource-efficiency';
}

/**
 * Used to configure a ResourceEfficiency composed metric controller to compute
 * its metric for a specific target.
 */
export class ResourceEfficiencyMetricMapping extends ComposedMetricMapping<
    ComposedMetricMappingSpec<ResourceEfficiencyParams>
> {
    constructor(initData?: Partial<ResourceEfficiencyMetricMapping>) {
        super(initData);
        this.objectKind = ResourceEfficiencyMetricMapping.getMappingObjectKind(
            ResourceEfficiencyMetric.instance
        );
    }
}
