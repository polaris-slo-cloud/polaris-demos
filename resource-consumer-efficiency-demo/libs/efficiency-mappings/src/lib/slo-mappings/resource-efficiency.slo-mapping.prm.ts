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

/**
 * Represents the configuration options of the ResourceEfficiency SLO.
 */
export interface ResourceEfficiencySloConfig {

    /**
     * The desired target efficiency in the range between 0 and 100.
     *
     * @minimum 0
     * @maximum 100
     */
    targetEfficiency: number;

}

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
