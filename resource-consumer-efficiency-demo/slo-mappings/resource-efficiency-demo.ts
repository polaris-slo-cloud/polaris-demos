import { HorizontalElasticityStrategyKind } from '@polaris-sloc/common-mappings';
import { ApiObjectMetadata, SloTarget } from '@polaris-sloc/core';
import {
    ResourceEfficiencySloMapping,
    ResourceEfficiencySloMappingSpec,
} from '@polaris-sloc/efficiency-mappings';

export default new ResourceEfficiencySloMapping({
    metadata: new ApiObjectMetadata({
        namespace: 'ToDo', // ToDo: Enter the target namespace.
        name: 'resource-efficiency-demo',
    }),
    spec: new ResourceEfficiencySloMappingSpec({
        targetRef: new SloTarget({
            // ToDo: Configure the target.
            group: 'ToDo',
            version: 'ToDo',
            kind: 'ToDo',
            name: 'ToDo',
        }),
        elasticityStrategy: new HorizontalElasticityStrategyKind(), // ToDo: Change the elasticity strategy, if needed.
        sloConfig: {
            // ToDo: Configure the SLO.
        },
    }),
});
