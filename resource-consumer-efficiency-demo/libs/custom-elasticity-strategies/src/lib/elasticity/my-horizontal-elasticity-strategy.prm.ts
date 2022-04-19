import {
    ElasticityStrategy,
    ElasticityStrategyKind,
    SloCompliance,
    SloTarget,
    initSelf,
} from '@polaris-sloc/core';

// ToDo after code generation:
// - Add configuration parameters to the MyHorizontalElasticityStrategyConfig interface.
// - If the elasticity strategy does not take SloCompliance objects as input,
//   adapt the first generic parameter of MyHorizontalElasticityStrategyKind and MyHorizontalElasticityStrategy accordingly.
// - If the elasticity strategy should operate on a subtype of SloTarget,
//   adapt the second generic parameter of MyHorizontalElasticityStrategyKind and MyHorizontalElasticityStrategy accordingly.
// - (optional) Replace the ObjectKind.group in the constructor of MyHorizontalElasticityStrategy with your own.
//   If you change the group name, ensure that you also accordingly adapt the `1-rbac.yaml` files of all
//   the elasticity strategy controller that needs to read and SLO controllers that need to write this ElasticityStrategy CRD.

/**
 * Configuration options for MyHorizontalElasticityStrategy.
 */
export interface MyHorizontalElasticityStrategyConfig {}

/**
 * Denotes the elasticity strategy kind for the MyHorizontalElasticityStrategy.
 */
export class MyHorizontalElasticityStrategyKind extends ElasticityStrategyKind<
    SloCompliance,
    SloTarget
> {
    constructor() {
        super({
            group: 'elasticity.polaris-slo-cloud.github.io',
            version: 'v1',
            kind: 'MyHorizontalElasticityStrategy',
        });
    }
}

/**
 * Defines the MyHorizontalElasticityStrategy.
 */
export class MyHorizontalElasticityStrategy extends ElasticityStrategy<
    SloCompliance,
    SloTarget,
    MyHorizontalElasticityStrategyConfig
> {
    constructor(initData?: Partial<MyHorizontalElasticityStrategy>) {
        super(initData);
        this.objectKind = new MyHorizontalElasticityStrategyKind();
        initSelf(this, initData);
    }
}
