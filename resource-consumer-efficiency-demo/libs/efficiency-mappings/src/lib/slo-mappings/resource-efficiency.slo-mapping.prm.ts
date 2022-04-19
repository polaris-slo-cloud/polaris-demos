import {
    ObjectKind,
    PolarisType,
    SloCompliance,
    SloMappingBase,
    SloMappingInitData,
    SloMappingSpecBase,
    SloTarget,
    initSelf,
} from '@polaris-sloc/core';

// ToDo after code generation:
// - Add configuration parameters to the ResourceEfficiencySloConfig interface.
// - If the SLO does not produce SloCompliance objects as output,
//   adapt the second generic parameter of ResourceEfficiencySloMappingSpec accordingly.
// - If the SLO should operate on a subtype of SloTarget,
//   adapt the third generic parameter of ResourceEfficiencySloMappingSpec accordingly.
// - (optional) Replace the ObjectKind.group in the constructor of ResourceEfficiencySloMapping with your own.
//   If you change the group name, ensure that you also accordingly adapt the `1-rbac.yaml` files of all
//   SLO controllers that need to write this SloMapping CRD.

/**
 * Represents the configuration options of the ResourceEfficiency SLO.
 */
export interface ResourceEfficiencySloConfig {}

/**
 * The spec type for the ResourceEfficiency SLO.
 */
export class ResourceEfficiencySloMappingSpec extends SloMappingSpecBase<
    // The SLO's configuration.
    ResourceEfficiencySloConfig,
    // The output type of the SLO.
    SloCompliance,
    // The type of target(s) that the SLO can be applied to.
    SloTarget
> {}

/**
 * Represents an SLO mapping for the ResourceEfficiency SLO, which can be used to apply and configure the ResourceEfficiency SLO.
 */
export class ResourceEfficiencySloMapping extends SloMappingBase<ResourceEfficiencySloMappingSpec> {
    @PolarisType(() => ResourceEfficiencySloMappingSpec)
    spec: ResourceEfficiencySloMappingSpec;

    constructor(initData?: SloMappingInitData<ResourceEfficiencySloMapping>) {
        super(initData);
        this.objectKind = new ObjectKind({
            group: 'slo.polaris-slo-cloud.github.io',
            version: 'v1',
            kind: 'ResourceEfficiencySloMapping',
        });
        initSelf(this, initData);
    }
}
