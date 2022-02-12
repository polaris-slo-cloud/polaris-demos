import { HorizontalElasticityStrategyKind } from '@polaris-sloc/common-mappings';
import { ApiObjectMetadata, SloTarget } from '@polaris-sloc/core';
import {
  CostEfficiencySloMapping,
  CostEfficiencySloMappingSpec,
} from '@my-org/my-slos';

export default new CostEfficiencySloMapping({
  metadata: new ApiObjectMetadata({
    namespace: 'demo',
    name: 'demo-mapping',
  }),
  spec: new CostEfficiencySloMappingSpec({
    targetRef: new SloTarget({
      group: 'apps',
      version: 'v1',
      kind: 'Deployment',
      name: 'my-demo-deployment', // This must be an existing deployment.
    }),
    elasticityStrategy: new HorizontalElasticityStrategyKind(),
    sloConfig: {
      responseTimeThresholdMs: 50,
      targetCostEfficiency: 80,
    },
  }),
});
