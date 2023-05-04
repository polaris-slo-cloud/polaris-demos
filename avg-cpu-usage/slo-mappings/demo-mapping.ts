import { HorizontalElasticityStrategyKind } from '@polaris-sloc/common-mappings';
import { ApiObjectMetadata, SloTarget } from '@polaris-sloc/core';
import {
  AverageCpuUsageSloMapping,
  AverageCpuUsageSloMappingSpec,
} from '@my-org/my-slos';

export default new AverageCpuUsageSloMapping({
  metadata: new ApiObjectMetadata({
    // The namespace must be the same as the SloTarget
    namespace: 'default',
    name: 'avg-cpu-test',
  }),
  spec: new AverageCpuUsageSloMappingSpec({
    // Identifies the workload to which to apply the SLO.
    targetRef: new SloTarget({
      group: 'apps',
      version: 'v1',
      kind: 'Deployment',
      name: 'resource-consumer',
    }),
    // We want to do horizontal scaling.
    elasticityStrategy: new HorizontalElasticityStrategyKind(),
    sloConfig: {
      // We aim for 70% average CPU usage.
      averageCpuTarget: 70,
      tolerance: 5,
    },
  }),
});
