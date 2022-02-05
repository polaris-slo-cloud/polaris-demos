import { HorizontalElasticityStrategyKind } from '@polaris-sloc/common-mappings';
import { ApiObjectMetadata, SloTarget } from '@polaris-sloc/core';
import {
  EfficiencySloMapping,
  EfficiencySloMappingSpec,
} from '@my-org/my-slos';

export default new EfficiencySloMapping({
  metadata: new ApiObjectMetadata({
    namespace: 'ToDo', // ToDo: Enter the target namespace.
    name: 'demo-efficiency',
  }),
  spec: new EfficiencySloMappingSpec({
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
