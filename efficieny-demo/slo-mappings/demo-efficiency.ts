import { ApiObjectMetadata, SloTarget } from '@polaris-sloc/core';
import {
  EfficiencySloMapping,
  EfficiencySloMappingSpec,
} from '@my-org/my-slos';
import { HorizontalElasticityStrategyKind } from '@my-org/my-strategies';

export default new EfficiencySloMapping({
  metadata: new ApiObjectMetadata({
    namespace: 'demo',
    name: 'demo-efficiency',
  }),
  spec: new EfficiencySloMappingSpec({
    targetRef: new SloTarget({
      group: 'apps',
      version: 'v1',
      kind: 'Deployment',
      name: 'pause-deployment',
    }),
    elasticityStrategy: new HorizontalElasticityStrategyKind(),
    sloConfig: {
      targetEfficiency: 90,
    },
    staticElasticityStrategyConfig: {
      maxReplicas: 3,
    },
  }),
});
