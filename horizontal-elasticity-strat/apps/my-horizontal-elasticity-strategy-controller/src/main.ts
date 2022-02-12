import { KubeConfig } from '@kubernetes/client-node';
import {
  MyHorizontalElasticityStrategyKind,
  initPolarisLib as initMappingsLib,
} from '@my-org/my-strategies';
import { Logger } from '@polaris-sloc/core';
import { initPolarisKubernetes } from '@polaris-sloc/kubernetes';
import { MyHorizontalElasticityStrategyController } from './app/elasticity';

// Load the KubeConfig and initialize the @polaris-sloc/kubernetes library.
const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();
const polarisRuntime = initPolarisKubernetes(k8sConfig);

// Initialize the used Polaris mapping libraries
initMappingsLib(polarisRuntime);

// Create an ElasticityStrategyManager and watch the supported elasticity strategy kinds.
const manager = polarisRuntime.createElasticityStrategyManager();
manager
  .startWatching({
    kindsToWatch: [
      {
        kind: new MyHorizontalElasticityStrategyKind(),
        controller: new MyHorizontalElasticityStrategyController(
          polarisRuntime
        ),
      },
    ],
  })
  .catch((error) => {
    Logger.error(error);
    process.exit(1);
  });
