import { HorizontalElasticityStrategyKind } from '@polaris-sloc/common-mappings';
import { ApiObjectMetadata, SloTarget } from '@polaris-sloc/core';
import {
  CostEfficiencySloMapping,
  CostEfficiencySloMappingSpec,
} from '@my-org/my-slos';

export default new CostEfficiencySloMapping({
  metadata: new ApiObjectMetadata({
    namespace: 'ToDo', // ToDo: Enter the target namespace.
    name: 'demo-mapping',
  }),
  spec: new CostEfficiencySloMappingSpec({
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
