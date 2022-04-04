# Prerequisites

Please ensure that you have a Kubernetes cluster with Prometheus available.
See our [base setup tutorial](https://github.com/polaris-slo-cloud/polaris/tree/master/testbeds/kubernetes/microk8s/base) for instructions on how to set one up - for this use case, you can skip the installation of ingress-nginx and Kubecost.
Then, follow these steps for deploying the resource-consumer resource efficiency demo and its required components.

1. Deploy the [Prometheus Adapter for Kubernetes Metrics APIs](https://github.com/kubernetes-sigs/prometheus-adapter):

    ```sh
    # Add the Prometheus helm chart repository, if you have not done so already during cluster setup.
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    
    # Install the prometheus-adapter.
    # The values in 1-prometheus-adapter.yaml deploy prometheus-adapter in the `monitoring` namespace and assume
    # that Prometheus is reachable under http://prometheus-kube-prometheus-prometheus.monitoring.svc:9090
    # If any of these are not the case for you, please adapt 1-prometheus-adapter.yaml.
    helm repo update
    helm install prom-custom-metrics-adapter prometheus-community/prometheus-adapter -f ./1-prometheus-adapter.yaml
    ```

prom-custom-metrics-adapter-prometheus-adapter has been deployed.
In a few minutes you should be able to list metrics using the following command(s):

  kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1
