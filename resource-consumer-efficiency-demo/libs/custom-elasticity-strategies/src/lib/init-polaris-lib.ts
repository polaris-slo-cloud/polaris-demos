import { PolarisRuntime } from '@polaris-sloc/core';
import { MyHorizontalElasticityStrategy } from './elasticity/my-horizontal-elasticity-strategy.prm';

/**
 * Initializes this library and registers its types with the transformer in the `PolarisRuntime`.
 */
export function initPolarisLib(polarisRuntime: PolarisRuntime): void {
    polarisRuntime.transformer.registerObjectKind(
        new MyHorizontalElasticityStrategy().objectKind,
        MyHorizontalElasticityStrategy
    );
}
