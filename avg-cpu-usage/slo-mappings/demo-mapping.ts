import { HorizontalElasticityStrategyKind } from '@polaris-sloc/common-mappings';
import { ApiObjectMetadata, SloTarget } from '@polaris-sloc/core';
import {
  AverageCpuUsageSloMapping,
  AverageCpuUsageSloMappingSpec,
} from '@my-org/my-slos';

export default new AverageCpuUsageSloMapping({
  metadata: new ApiObjectMetadata({
    namespace: 'ToDo', // ToDo: Enter the target namespace.
    name: 'demo-mapping',
  }),
  spec: new AverageCpuUsageSloMappingSpec({
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
