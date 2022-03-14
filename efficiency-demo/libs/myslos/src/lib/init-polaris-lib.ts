import { PolarisRuntime } from '@polaris-sloc/core';
import { EfficiencyMetricMapping } from './metrics/efficiency-metric.prm';
import { EfficiencySloMapping } from './slo-mappings/efficiency.slo-mapping.prm';

/**
 * Initializes this library and registers its types with the transformer in the `PolarisRuntime`.
 */
export function initPolarisLib(polarisRuntime: PolarisRuntime): void {
  polarisRuntime.transformer.registerObjectKind(
    new EfficiencySloMapping().objectKind,
    EfficiencySloMapping
  );
  polarisRuntime.transformer.registerObjectKind(
    new EfficiencyMetricMapping().objectKind,
    EfficiencyMetricMapping
  );
}
