# Prerequisites

Please ensure that you have a Kubernetes cluster with Prometheus available.
See our [base setup tutorial](https://github.com/polaris-slo-cloud/polaris/tree/master/testbeds/kubernetes/microk8s/base) for instructions on how to set one up - for this use case, you can skip the installation of ingress-nginx and Kubecost.
Then, follow these steps for deploying Universal Recommender and its required components.

1. Deploy the [Elastic Cloud on Kubernetes](https://www.elastic.co/downloads/elastic-cloud-kubernetes) operator:

    ```sh
    kubectl create -f https://download.elastic.co/downloads/eck/2.0.0/crds.yaml
    kubectl apply -f https://download.elastic.co/downloads/eck/2.0.0/operator.yaml
    ```

2. Create the `universal-recommender` namespace:

    ```sh
    kubectl create namespace universal-recommender
    ```

3. Install the [MongoDB Community Kubernetes Operator](https://github.com/mongodb/mongodb-kubernetes-operator) using its [corresponding helm chart](https://github.com/mongodb/helm-charts).
(at the time of writing, we used v0.7.3 of the operator).
To avoid needing to [configure the watched namespaces](https://github.com/mongodb/mongodb-kubernetes-operator/blob/master/docs/install-upgrade.md#understand-deployment-scopes), we deploy the operator in the `universal-recommender` namespace.

    ```sh
    helm repo add mongodb https://mongodb.github.io/helm-charts
    helm repo update
    helm install mongodb-community-operator mongodb/community-operator --namespace universal-recommender --atomic --set operator.resources.limits.cpu=500m,operator.resources.limits.memory=512Mi

    # Check if the operator pod has started
    kubectl get pods -n universal-recommender
    ```

4. Deploy a MongoDB cluster with a single instance:

    ```sh
    kubectl apply -f ./1-mongodb.yaml
    ```

5. Deploy an ElasticSearch cluster with a single instance:

    ```sh
    kubectl apply -f ./2-elasticsearch.yaml
    ```

6. Deploy a [Harness ML Server](https://actionml.com/docs/harness_intro) instance for hosting the Universal Recommender engine:

    ```sh
    kubectl apply -f ./3-harness.yaml
    ```
