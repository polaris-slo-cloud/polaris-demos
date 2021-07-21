import { PolarisRuntime } from '@polaris-sloc/core';
import { HorizontalElasticityStrategy } from './elasticity/horizontal-elasticity-strategy';

/**
 * Initializes this library and registers its types with the transformer in the `PolarisRuntime`.
 */
export function initPolarisLib(polarisRuntime: PolarisRuntime): void {
  polarisRuntime.transformer.registerObjectKind(
    new HorizontalElasticityStrategy().objectKind,
    HorizontalElasticityStrategy
  );
}
