import {
    ElasticityStrategy,
    ElasticityStrategyKind,
    SloCompliance,
    SloTarget,
    initSelf,
} from '@polaris-sloc/core';

/**
 * Configuration options for MyHorizontalElasticityStrategy.
 */
export interface MyHorizontalElasticityStrategyConfig {

    /**
     * The minimum number of replicas that the target workload must have.
     */
    minReplicas?: number;

    /**
     * The maximum number of replicas that the target workload must have.
     */
    maxReplicas?: number;

}

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
