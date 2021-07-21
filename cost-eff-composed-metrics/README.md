# Cost Efficiency SLO Demo with Composed Metrics

This demo creates a cost efficiency SLO mapping type and controller using the [CostEfficiencyMetric](https://github.com/SLOCloud/SLOC/blob/master/ts/libs/mappings/common-mappings/src/lib/metrics/cost-efficiency.ts) composed metric type and the [RestApiCostEfficiencyMetricSource](https://github.com/SLOCloud/SLOC/tree/master/ts/libs/metrics/cost-efficiency/src/lib/metrics/rest-api-cost-efficiency).
This folder contains the final result of the demo.
To recreate it yourself, please follow the tutorial below.


## Prerequisites

Please make sure that you have installed the following:

* Node.JS 14 or higher
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
    polaris-cli init cost-eff-composed-metrics
    ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/604b84e2d362da7d36d5e7cbe3ca2c743d1926de).


### Create an SLO mapping type

1. Go into the workspace's directory and create an SLO mapping type for the cost efficiency SLO.
An SLO mapping needs to be contained within a publishable Node.JS library project (i.e., an Nx project that builds a publishable npm package).
The name of the project is specified with the `--project` parameter.
If you don't have any library project in the workspace yet (as is the case in this demo), Polaris CLI can create one.
To this end, add the `--createLibProject=true` parameter and specify the import path that people using the library will use for importing it using the `--importPath` parameter.

    ```sh
    # Navigate to our workspace's directory.
    cd cost-eff-composed-metrics

    # Generate the cost efficiency SLO mapping type in the library project myslos, which is publishable as @my-org/my-slos
    # This generates the project libs/myslos
    polaris-cli g slo-mapping-type cost-efficiency --project=myslos --createLibProject=true --importPath=@my-org/my-slos
    ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/053d9f21e6fc23db4eb4df0e8af491dd723e1a2f).


1. Launch your favorite IDE or editor and open the file `libs/my-slos/src/lib/slo-mappings/cost-efficiency.slo-mapping.ts`, which contains three types:
    * `CostEfficiencySloConfig` models the configuration options of the SLO. Add the following properties here:
        ```TypeScript
        responseTimeThresholdMs: 10 | 25 | 50 | 100 | 250 | 500 | 1000 | 2500 | 5000 | 10000;
        targetCostEfficiency: number;
        minRequestsPercentile?: number;
        ```
    * `CostEfficiencySloMappingSpec` is the type that brings together the SLO's configuration type, its output data type (`SloOutput`), and the type of workload targets it supports (`SloTarget`).
    Depending on your use case, you may want to change the output data type of the workload target type -- for the demo, we will leave them as they are.
    * `CostEfficiencySloMapping` is the API object that can be transformed, serialized, and sent to the orchestrator. Here, the `objectKind.group` value that is set in the constructor needs to be changed to match that of your organization. In this demo, we set it to `'slo.polaris-slo-cloud.github.io'` to match that of the CRD, for which we already have a complete Kubernetes CRD YAML available in our [main repository](https://github.com/SLOCloud/SLOC/tree/master/go/config/crd) (the generation of CRD YAMLs from TypeScript types will be added to the Polaris CLI soon).
        ```TypeScript
        constructor(initData?: SloMappingInitData<CostEfficiencySloMapping>) {
            super(initData);
            this.objectKind = new ObjectKind({
                group: 'slo.polaris-slo-cloud.github.io', // Our API group.
            ...
        ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/8917cc631ed99de585332137acc6370254c43e19).


1. The file `libs/myslos/src/lib/init-polaris-lib.ts` contains the initialization function for your library, `initPolarisLib(polarisRuntime: PolarisRuntime)`, which has to register the object kind of our SLO mapping type and associate it with the SLO mapping type class in [transformation service](https://github.com/SLOCloud/SLOC/blob/master/ts/libs/core/src/lib/transformation/public/service/polaris-transformation-service.ts) of the Polaris runtime.
Since we generated a new library project, this step has already been done by the Polaris CLI.
If we had added the SLO mapping type to an existing project, we would need to perform this registration manually (this will be handled automatically by the Polaris CLI in the future):

    ```TypeScript
    export function initPolarisLib(polarisRuntime: PolarisRuntime): void {
        ...
        polarisRuntime.transformer.registerObjectKind(new CostEfficiencySloMapping().objectKind, CostEfficiencySloMapping);
    }
    ```



### Create the SLO Controller

1. To generate an SLO controller, we need to tell the Polaris CLI which SLO mapping type is going to be handled by the controller.
This is done using the `--sloMappingTypePkg` and the `--sloMappingType` arguments.
If the SLO mapping type package is configured as a [lookup path](https://www.typescriptlang.org/tsconfig#paths) in the workspace's `tsconfig.base.json`, Polaris CLI knows that the SLO mapping type is available locally, otherwise, it installs the respective npm package.
Polaris CLI automatically adds and configures the `@polaris-sloc/kubernetes` and `@polaris-sloc/prometheus` packages to enable the controller for use in Kubernetes and to read metrics from Prometheus.

    ```sh
    # Generate an SLO controller project for the CostEfficiencySloMapping in apps/cost-eff-controller
    polaris-cli g slo-controller cost-eff-controller --sloMappingTypePkg=@my-org/my-slos --sloMappingType=CostEfficiencySloMapping
    ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/f446fac7d517ffcc3c3afad64f995874de97e8da).


1. Since we want to use the `CostEfficiencyMetric` and the `RestApiCostEfficiencyMetricSource` provided by the `@polaris-sloc/common-mappings` package, we install this package as a dependency.

    ```sh
    npm install --save @polaris-sloc/cost-efficiency
    ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/49d910a704a282637dfde7e8ac215985b4878fe2).


1. The generated SLO controller project includes the following:
    * `src/main.ts` bootstraps the controller application by initializing the Polaris runtime with the Kubernetes library, configuring the Prometheus library as a metrics query backend, initializing the `@my-org/my-slos` library, registering the cost efficiency SLO mapping with the control loop and the watch manager, and starting the control loop.
    * `src/app/slo/cost-efficiency.slo.ts` contains the `CostEfficiencySlo` class that will act as the microcontroller for evaluating our SLO.
    * `Dockerfile` for building a container image of the controller
    * `manifests/kubernetes` contains configuration YAML files for setting up and deploying the controller on Kubernetes.


1. To allow us to use the composed metrics from the `@polaris-sloc/cost-efficiency` library, we need to initialize this library in `apps/cost-eff-controller/src/main.ts` just before creating the control loop.

    ```TypeScript
    // Initialize composed metrics libraries
    initCostEfficiencyMetrics(polarisRuntime);
    ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/8111782cefb6c4f2f3d2ff3f93422dce31e23901).


1. Next, we implement the `CostEfficiencySlo` in `apps/cost-eff-controller/src/app/slo/cost-efficiency.slo.ts` as shown in the commit diff.
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/74e203e315a4283268c75883776cf65e60fd518d).



### Building and deploying the SLO controller

1. Since Polaris CLI has generated a Dockerfile for us, we can easily build and push the container image for our SLO controller.
The tags for the image can be adjusted in the build command in `workspace.json` `projects.cost-eff-controller.docker-build.options.commands` (the user friendliness of this step will be improved in the future).
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
    polarissloc/cost-eff-controller:latest
    ```


1. Ensure that you have installed the appropriate CRDs for the SLO (this will be improved once Polaris CLI can generate CRDs from TypeScript).
    1. Clone the main [Polaris repository](https://github.com/SLOCloud/SLOC).
    2. Open a terminal and run `kubectl apply -k ./go/config/crd`


1. Deploy the SLO controller using Polaris CLI.

    ```sh
    # Deploy the controller
    polaris-cli deploy cost-eff-controller

    # Verify that the deployment worked
    kubectl get deployments.apps -n polaris
    ```
