# Cost Efficiency SLO with Raw Metrics Only.


This demo creates a cost efficiency SLO mapping type and controller using raw metrics queries only.
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
    polaris-cli init cost-eff-raw-metrics-only
    ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/390367841fcffcf3cfd1ee92cc75f07a34d2670d).


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
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/0928c8fe2eb7c30d5d12214c02b93026a921d05a).


1. Launch your favorite IDE or editor and open the file `libs/my-slos/src/lib/slo-mappings/cost-efficiency.slo-mapping.ts`, which contains three types:
    * `CostEfficiencySloConfig` models the configuration options of the SLO. Add the following properties here:
        ```TypeScript
        responseTimeThresholdMs: 10 | 25 | 50 | 100 | 250 | 500 | 1000 | 2500 | 5000 | 10000;
        targetCostEfficiency: number;
        minRequestsPercentile?: number;
        ```
    * `CostEfficiencySloMappingSpec` is the type that brings together the SLO's configuration type, its output data type (`SloOutput`), and the type of workload targets it supports (`SloTarget`).
    Depending on your use case, you may want to change the output data type of the workload target type -- for the demo, we will leave them as they are.
    * `CostEfficiencySloMapping` is the API object that can be transformed, serialized, and sent to the orchestrator. Here, the `objectKind.group` value that is set in the constructor needs to be changed to match that of your organization. In this demo, we set it to `'slo.sloc.github.io'` to match that of the CRD, for which we already have a complete Kubernetes CRD YAML available in our [main repository](https://github.com/SLOCloud/SLOC/tree/master/go/config/crd) (the generation of CRD YAMLs from TypeScript types will be added to the Polaris CLI soon).
        ```TypeScript
        constructor(initData?: SloMappingInitData<CostEfficiencySloMapping>) {
            super(initData);
            this.objectKind = new ObjectKind({
                group: 'slo.sloc.github.io', // Our API group.
            ...
        ```
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/d9294937b893b8df9fbf97c687a06b297facffda).


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
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/f74aee944222bb23dd3f0f5bc171e3925a061860).


1. The generated SLO controller project includes the following:
    * `src/main.ts` bootstraps the controller application by initializing the Polaris runtime with the Kubernetes library, configuring the Prometheus library as a metrics query backend, initializing the `@my-org/my-slos` library, registering the cost efficiency SLO mapping with the control loop and the watch manager, and starting the control loop.
    * `src/app/slo/cost-efficiency.slo.ts` contains the `CostEfficiencySlo` class that will act as the microcontroller for evaluating our SLO.
    * `Dockerfile` for building a container image of the controller
    * `manifests/kubernetes` contains configuration YAML files for setting up and deploying the controller on Kubernetes.


1. Next, we implement the `CostEfficiencySlo` in `apps/cost-eff-controller/src/app/slo/cost-efficiency.slo.ts` as shown in the commit diff.
    See the changes [here](https://github.com/polaris-slo-cloud/polaris-demos/commit/98e45f0a981a054c30f4ded73d2f88d4a0eede22).



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
