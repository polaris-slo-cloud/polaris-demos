# Cost Efficiency SLO with Raw Metrics Only


This demo creates a cost efficiency SLO mapping type and controller using raw metrics queries only.
This folder contains the final result of the demo.
To recreate it yourself, please follow the tutorial below.


## Prerequisites

Please make sure that you have installed the following:

* Node.JS 18 or higher
* A Kubernetes cluster with Prometheus ans KubeCost installed
* kubectl (and configure the Kubernetes cluster you want to use for testing as your current context)
* [Polaris CLI](https://www.npmjs.com/package/@polaris-sloc/cli): to install Polaris CLI, run the following command:

    ```
    npm install -g @polaris-sloc/cli
    ```


## Tutorial

### Create a new workspace with the Polaris CLI

1. Open a terminal, where you would like to create your workspace.

1. Create a new empty [Nx](https://nx.dev) workspace with the Polaris CLI:

    ```sh
    polaris-cli init cost-eff-raw-metrics-only
    ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/b459c8150554b63239c57b24757a5b37e3c3035f).


### Create an SLO mapping type

1. Go into the workspace's directory and create an SLO mapping type for the cost efficiency SLO.
An SLO mapping needs to be contained within a publishable Node.JS library project (i.e., an Nx project that builds a publishable npm package).
The name of the project is specified with the `--project` parameter.
If you don't have any library project in the workspace yet (as is the case in this demo), Polaris CLI can create one.
To this end, add the `--createLibProject=true` parameter and specify the import path that people using the library will use for importing it using the `--importPath` parameter.

    ```sh
    # Navigate to our workspace's directory.
    cd cost-eff-raw-metrics-only

    # Generate the cost efficiency SLO mapping type in the library project myslos, which is publishable as @my-org/my-slos
    # This generates the project libs/myslos
    polaris-cli g slo-mapping-type cost-efficiency --project=myslos --createLibProject=true --importPath=@my-org/my-slos
    ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/0a879e7404137792a40218efa68a98af620d938c).


1. Launch your favorite IDE or editor and open the file `libs/my-slos/src/lib/slo-mappings/cost-efficiency.slo-mapping.prm.ts` (`.prm` stands for Polaris Resource Model), which contains three types:
    * `CostEfficiencySloConfig` models the configuration options of the SLO. Add the following properties here:
        ```TypeScript
        responseTimeThresholdMs: 10 | 25 | 50 | 100 | 250 | 500 | 1000 | 2500 | 5000 | 10000;
        targetCostEfficiency: number;
        minRequestsPercentile?: number;
        ```
    * `CostEfficiencySloMappingSpec` is the type that brings together the SLO's configuration type, its output data type (`SloOutput`), and the type of workload targets it supports (`SloTarget`).
    Depending on your use case, you may want to change the output data type of the workload target type -- for the demo, we will leave them as they are.
    * `CostEfficiencySloMapping` is the API object that can be transformed, serialized, and sent to the orchestrator. Here, the `objectKind.group` value that is set in the constructor needs to be changed to match that of your organization. In this demo, we leave it at the generated value of `'slo.polaris-slo-cloud.github.io'`.
        ```TypeScript
        constructor(initData?: SloMappingInitData<CostEfficiencySloMapping>) {
            super(initData);
            this.objectKind = new ObjectKind({
                group: 'slo.polaris-slo-cloud.github.io',
            ...
        ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/5d36c8c58d73d019885b28c2b1c72399e65646fd).


1. The file `libs/myslos/src/lib/init-polaris-lib.ts` contains the initialization function for your library, `initPolarisLib(polarisRuntime: PolarisRuntime)`, which has to register the object kind of our SLO mapping type and associate it with the SLO mapping type class in [transformation service](https://polaris-slo-cloud.github.io/polaris-slo-framework/typedoc/interfaces/core_src.PolarisTransformationService.html) of the Polaris runtime.
Since we generated a new library project, this step has already been done by the Polaris CLI.
If we had added the SLO mapping type to an existing project, we would need to perform this registration manually (this will be handled automatically by the Polaris CLI in the future):

    ```TypeScript
    export function initPolarisLib(polarisRuntime: PolarisRuntime): void {
        ...
        polarisRuntime.transformer.registerObjectKind(new CostEfficiencySloMapping().objectKind, CostEfficiencySloMapping);
    }
    ```


1. Next we need to generate the Kubernetes Custom Resource Definition (CRD) for our SLO mapping type, so that it can be registered with Kubernetes.
We can do this executing the following command:

    ```sh
    # Generate the CRDs of the project `myslos` in the folder `libs/my-slos/crds`.
    polaris-cli gen-crds myslos
    ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/00fa06e166be89a559f2f6011c0a8b92f1d962be).



### Create the SLO Controller

1. To generate an SLO controller, we need to tell the Polaris CLI which SLO mapping type is going to be handled by the controller.
This is done using the `--sloMappingTypePkg` and the `--sloMappingType` arguments.
If the SLO mapping type package is configured as a [lookup path](https://www.typescriptlang.org/tsconfig#paths) in the workspace's `tsconfig.base.json`, Polaris CLI knows that the SLO mapping type is available locally, otherwise, it installs the respective npm package.
Polaris CLI automatically adds and configures the `@polaris-sloc/kubernetes` and `@polaris-sloc/prometheus` packages to enable the controller for use in Kubernetes and to read metrics from Prometheus.

    ```sh
    # Generate an SLO controller project for the CostEfficiencySloMapping in apps/cost-eff-controller
    polaris-cli g slo-controller cost-eff-controller --sloMappingTypePkg=@my-org/my-slos --sloMappingType=CostEfficiencySloMapping
    ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/527028c4619000e48a98d3458fb79acdb7215275).


1. The generated SLO controller project includes the following:
    * `src/main.ts` bootstraps the controller application by initializing the Polaris runtime with the Kubernetes library, configuring the Prometheus library as a metrics query backend, initializing the `@my-org/my-slos` library, registering the cost efficiency SLO mapping with the control loop and the watch manager, and starting the control loop.
    * `src/app/slo/cost-efficiency.controller.ts` contains the `CostEfficiencySlo` class that will act as the microcontroller for evaluating our SLO.
    * `Dockerfile` for building a container image of the controller
    * `manifests/kubernetes` contains configuration YAML files for setting up and deploying the controller on Kubernetes.


1. Next, we implement the `CostEfficiencySlo` in `apps/cost-eff-controller/src/app/slo/cost-efficiency.controller.ts` as shown in the commit diff.
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/6cd24aa3f41124293ce7cd7bb17a24aa152757b4).



### Building and deploying the SLO controller

1. Ensure that your cluster has one or more Polaris elasticity strategies deployed for use in the SLO mapping later.
You can create your own elasticity strategy, as shown in [this tutorial](../horizontal-elasticity-strat) or install one that ships with [Polaris](https://github.com/polaris-slo-cloud/polaris#deployment).


1. Since Polaris CLI has generated a Dockerfile for us, we can easily build and push the container image for our SLO controller.
The tags for the image can be adjusted in the build command in `apps/cost-eff-controller/project.json` `targets.docker-build.options.commands` (the user friendliness of this step will be improved in the future).
When changing the tag here, you also need to change the image name in `apps/cost-eff-controller/manifests/kubernetes/2-slo-controller.yaml`

    ```JSON
    "commands": [
        "docker build ... -t polarissloc/cost-eff-controller:latest ."
    ],
    ```

    ```sh
    # Build SLO controller container image
    polaris-cli docker-build cost-eff-controller

    # Push the container image to Dockerhub
    docker push polarissloc/cost-eff-controller:latest
    ```


1. If your Prometheus instance is not reachable under the DNS name `prometheus-kube-prometheus-prometheus.monitoring.svc` or on port `9090` (defaults for our [testbed setup](https://github.com/polaris-slo-cloud/polaris-slo-framework/tree/master/testbeds/kubernetes)), you need to change the `PROMETHEUS_HOST` and/or `PROMETHEUS_PORT` environment variables in `apps/cost-eff-controller/manifests/kubernetes/2-slo-controller.yaml`.

    ```YAML
    env:
      # The hostname and port of the Prometheus service (adapt if necessary):
      - name: PROMETHEUS_HOST
        value: prometheus-kube-prometheus-prometheus.monitoring.svc
      - name: PROMETHEUS_PORT
        value: '9090'
    ```


1. Install the `CostEfficiencySloMapping` CRD that was generated earlier:
    
    ```sh
    kubectl apply -f ./libs/myslos/crds/
    ```


1. Deploy the SLO controller using Polaris CLI.

    ```sh
    # Deploy the controller
    polaris-cli deploy cost-eff-controller

    # Verify that the deployment worked
    kubectl get deployments.apps -n polaris
    ```



### Generating and Applying an SLO Mapping Instance

1. To configure and apply the cost efficiency SLO, we need to generate an instance of the `CostEfficiencySloMapping` and configure and apply it.

    ```sh
    # Generate a CostEfficiencySloMapping instance in `slo-mappings/demo-mapping.ts`
    polaris-cli g slo-mapping demo-mapping --sloMappingTypePkg=@my-org/my-slos --sloMappingType=CostEfficiencySloMapping
    ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/1ac67f740a12f7cd71443200b437ce49b4648e7f).


1. Open the generated file `slo-mappings/demo-mapping.ts` and configure it for the workload you want to apply it to.

    ```TypeScript
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
    ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/77d740200600fc2d8b587a70fb4293f48882818e).


1. Apply the SLO mapping:

    ```sh
    # See what the serialized SLO mapping instance looks like
    polaris-cli serialize demo-mapping

    # Apply the SLO mapping to your cluster
    polaris-cli serialize demo-mapping | tail -n +3 | kubectl apply -f -

    # Watch the logs of the SLO controller to see what is happening
    kubectl logs -f -n polaris <name of the cost-eff-controller pod>
    ```
