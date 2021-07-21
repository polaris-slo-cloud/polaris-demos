import { KubeConfig } from '@kubernetes/client-node';
import {
  HorizontalElasticityStrategyKind,
  initPolarisLib as initMappingsLib,
} from '@my-org/my-strategies';
import { initPolarisKubernetes } from '@polaris-sloc/kubernetes';
import { HorizontalElasticityStrategyController } from './app/elasticity';

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
        kind: new HorizontalElasticityStrategyKind(),
        controller: new HorizontalElasticityStrategyController(polarisRuntime),
      },
    ],
  })
  .catch((error) => void console.error(error));
