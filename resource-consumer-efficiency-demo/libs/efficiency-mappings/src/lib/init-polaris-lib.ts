import { PolarisRuntime } from '@polaris-sloc/core';
import { ResourceEfficiencyMetricMapping } from './metrics/resource-efficiency-metric.prm';

/**
 * Initializes this library and registers its types with the transformer in the `PolarisRuntime`.
 */
export function initPolarisLib(polarisRuntime: PolarisRuntime): void {
    polarisRuntime.transformer.registerObjectKind(
        new ResourceEfficiencyMetricMapping().objectKind,
        ResourceEfficiencyMetricMapping
    );
}
