import { PolarisRuntime } from "@polaris-sloc/core";
import { AverageCpuUsageSloMapping } from "./slo-mappings/average-cpu-usage.slo-mapping.prm";

/**
 * Initializes this library and registers its types with the transformer in the `PolarisRuntime`.
 */
export function initPolarisLib(polarisRuntime: PolarisRuntime): void {
  polarisRuntime.transformer.registerObjectKind(
    new AverageCpuUsageSloMapping().objectKind,
    AverageCpuUsageSloMapping
  );
}
