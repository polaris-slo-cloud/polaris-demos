import { PolarisRuntime } from '@polaris-sloc/core';
import { CostEfficiencySloMapping } from './slo-mappings/cost-efficiency.slo-mapping.prm';

/**
 * Initializes this library and registers its types with the transformer in the `PolarisRuntime`.
 */
export function initPolarisLib(polarisRuntime: PolarisRuntime): void {
  polarisRuntime.transformer.registerObjectKind(
    new CostEfficiencySloMapping().objectKind,
    CostEfficiencySloMapping
  );
}
