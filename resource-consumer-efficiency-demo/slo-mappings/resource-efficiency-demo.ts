import { ApiObjectMetadata, SloTarget } from '@polaris-sloc/core';
import {
    ResourceEfficiencySloMapping,
    ResourceEfficiencySloMappingSpec,
} from '@polaris-sloc/efficiency-mappings';
import { MyHorizontalElasticityStrategyKind } from '@polaris-sloc/custom-elasticity-strategies';

export default new ResourceEfficiencySloMapping({
    metadata: new ApiObjectMetadata({
        namespace: 'resource-consumer-demo',
        name: 'resource-efficiency-demo',
    }),
    spec: new ResourceEfficiencySloMappingSpec({
        targetRef: new SloTarget({
            group: 'apps',
            version: 'v1',
            kind: 'Deployment',
            name: 'resource-consumer',
        }),
        elasticityStrategy: new MyHorizontalElasticityStrategyKind(),
        sloConfig: {
            targetEfficiency: 80,
        },
        stabilizationWindow: {
            scaleUpSeconds: 30,
            scaleDownSeconds: 30,
        },
        staticElasticityStrategyConfig: {
            minReplicas: 1,
            maxReplicas: 10,
        }
    }),
});
