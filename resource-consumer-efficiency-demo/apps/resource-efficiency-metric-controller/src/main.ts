import { KubeConfig } from '@kubernetes/client-node';
import {
    ResourceEfficiencyMetric,
    ResourceEfficiencyMetricMapping,
    initPolarisLib as initCompMetricsLib,
} from '@polaris-sloc/efficiency-mappings';
import {
    Logger,
    convertToNumber,
    getEnvironmentVariable,
} from '@polaris-sloc/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { initPolarisKubernetes } from '@polaris-sloc/kubernetes';
import {
    PrometheusComposedMetricsCollectorManager,
    initPrometheusQueryBackend,
} from '@polaris-sloc/prometheus';
import { ResourceEfficiencyMetricSourceFactory } from './app/metrics';

// Load the KubeConfig and initialize the @polaris-sloc/kubernetes library.
const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();
const polarisRuntime = initPolarisKubernetes(k8sConfig);

// Initialize the Prometheus query backend.
const promHost = getEnvironmentVariable('PROMETHEUS_HOST') || 'localhost';
const promPort =
    getEnvironmentVariable('PROMETHEUS_PORT', convertToNumber) || 9090;
initPrometheusQueryBackend(
    polarisRuntime,
    { host: promHost, port: promPort },
    true
);

// Initialize any required Polaris mapping or composed metric libraries here.
initCompMetricsLib(polarisRuntime);

// Create the Prometheus scrapable endpoint.
const metricsEndpointPath = getEnvironmentVariable(
    'PROMETHEUS_METRICS_ENDPOINT_PATH'
);
const metricsEndpointPort = getEnvironmentVariable(
    'PROMETHEUS_METRICS_ENDPOINT_PORT',
    convertToNumber
);
const promMetricsCollectorManager =
    new PrometheusComposedMetricsCollectorManager();
promMetricsCollectorManager.start({
    path: metricsEndpointPath,
    port: metricsEndpointPort,
});

// Create a ComposedMetricsManager and watch the supported composed metric type kinds.
const manager = polarisRuntime.createComposedMetricsManager();
manager
    .startWatching({
        collectorFactories: [promMetricsCollectorManager],
        kindsToWatch: [
            {
                mappingKind: new ResourceEfficiencyMetricMapping().objectKind,
                metricType: ResourceEfficiencyMetric.instance,
                metricSourceFactory:
                    new ResourceEfficiencyMetricSourceFactory(),
            },
        ],
    })
    .catch((error) => {
        Logger.error(error);
        process.exit(1);
    });
