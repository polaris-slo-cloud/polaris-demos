import { PolarisRuntime } from '@polaris-sloc/core';
import { ResourceEfficiencyMetricMapping } from './metrics/resource-efficiency-metric.prm';
import { ResourceEfficiencySloMapping } from './slo-mappings/resource-efficiency.slo-mapping.prm';

/**
 * Initializes this library and registers its types with the transformer in the `PolarisRuntime`.
 */
export function initPolarisLib(polarisRuntime: PolarisRuntime): void {
    polarisRuntime.transformer.registerObjectKind(
        new ResourceEfficiencyMetricMapping().objectKind,
        ResourceEfficiencyMetricMapping
    );
    polarisRuntime.transformer.registerObjectKind(new ResourceEfficiencySloMapping().objectKind, ResourceEfficiencySloMapping);
}
