import {
    ComposedMetricMapping,
    ComposedMetricMappingSpec,
    ComposedMetricParams,
    ComposedMetricType,
    POLARIS_API,
} from '@polaris-sloc/core';

// ToDo after code generation:
// - Add properties to the ResourceEfficiency interface to store the value of a single metric instance.
// - Add configuration parameters to the ResourceEfficiencyParams interface, if needed.
// - (optional) Replace `POLARIS_API.METRICS_GROUP` in ResourceEfficiencyMetric.metricTypeName with a custom group name.
//   If you change the group name, ensure that you also accordingly adapt the `1-rbac.yaml` files of all
//   composed metric controllers and all SLO controllers that need to write this ComposedMetricType CRD.

/**
 * Represents the value of a ResourceEfficiency metric.
 */
export interface ResourceEfficiency {}

/**
 * The parameters for retrieving the ResourceEfficiency metric.
 */
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
