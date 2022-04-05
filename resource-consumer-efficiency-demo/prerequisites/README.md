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

    # A few minutes after the new prometheus-adapter pod is running, you can list all available custom metrics using:
    kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1
    ```

2. Create a [resource-consumer](https://github.com/kubernetes/kubernetes/tree/master/test/images/resource-consumer) deployment and service.

    ```sh
    kubectl apply -f ./2-resource-consumer.yaml
    ```

3. Deploy the load generator pod.

    ```sh
    kubectl apply -f ./3-load-generator-rbac.yaml
    kubectl apply -f ./4-load-generator.yaml
    ```

    This pod contains the script `/load-gen/generate-load.sh`, which we use to make resource consumption requests to all resource-consumer pods (with the service, we would only hit one pod for every request due to load balancing).
