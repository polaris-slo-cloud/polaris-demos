# Reactive Efficiency Demo

This document lists all commands to generate the reactive approach of scaling based on efficiency shown in this [video](https://youtu.be/qScTsLGyOi8).

## 1. Deploy the Workload

To deploy the workload for this demo (i.e., a metric exporter, based on a selection of data from the [Google Cluster Data 2011](https://research.google/tools/datasets/cluster-workload-traces/), and a dummy workload (pause container) that we can scale using the metrics from the former), download the files inside the [../deployment](../deployment) folder or clone this repository.
Then apply them using `kubectl`:
    ```sh
    kubectl apply -f ./deployment
    ```

## 2. Create a Workspace 

Install the Polaris CLI and then, create a new empty [Nx](https://nx.dev) workspace and navigate into it:

    ```sh
    npm install -g @polaris-sloc/cli
    polaris-cli init demo
    cd demo 
    ```

## 3. Create the Efficiency Metric Controller

1. Generate a Composed Metric type that we will use to describe and configure our Efficiency metric.
A Composed Metric type type needs to be contained within a publishable Node.JS library project (i.e., an Nx project that builds a publishable npm package).
The name of the project is specified with the `--project` parameter.
If you don't have any library project in the workspace yet (as is the case in this demo), Polaris CLI can create one.
To this end, add the `--createLibProject=true` parameter and specify the import path that people using the library will use for importing it using the `--importPath` parameter.

    ```sh
    # Generate the Efficiency composed metric type in the library project myslos, which is publishable as @my-org/my-slos
    # This generates the project libs/myslos
    polaris-cli g composed-metric-type efficiency --project=myslos --createLibProject=true --importPath=@my-org/my-slos
    ```


1. Open the file `libs/myslos/src/lib/metrics/efficiency-metric.prm.ts` (`.prm` stands for Polaris Resource Model).
It contains a list of ToDos and three types:

    * The `Efficiency` interface is used to represent a single value of the Efficiency metric. Fill it out, as follows:

        ```TypeScript
        export interface Efficiency {

            /**
            * The current efficiency in the range between 0 and 100.
            */
            efficiency: number;

        }
        ```
    
    * The `EfficiencyParams` interface can be used to define custom configuration parameters that can be passed from the SLO controller to the composed metric. For this demo, we do not need any. So, we leave this interface empty.

    * The `EfficiencyMetric` class represents the Composed Metric type used by the Polaris Runtime. The `metricTypeName` property stores the unique name of this Composed Metric type to identify it in the Polaris ecosystem and to create a Kubernetes CRD. We could use a custom API group here, but for this demo we do not need to modify anything here.

    * The `EfficiencyMetricMapping` class is the API object that can be transformed, serialized, and sent to the orchestrator. It can be left as is.


1. The file `libs/myslos/src/lib/init-polaris-lib.ts` contains the initialization function for your library, `initPolarisLib(polarisRuntime: PolarisRuntime)`, which has to register the object kind of our Composed Metric type and associate it with the `EfficiencyMetricMapping` class in [transformation service](https://polaris-slo-cloud.github.io/polaris/typedoc/interfaces/core_src.PolarisTransformationService.html) of the Polaris runtime.
Since we generated a new library project, this step has already been done by the Polaris CLI.
If we had added the  Composed Metric type to an existing project, we would need to perform this registration manually (this will be handled automatically by the Polaris CLI in the future):

    ```TypeScript
    export function initPolarisLib(polarisRuntime: PolarisRuntime): void {
        ...
        polarisRuntime.transformer.registerObjectKind(new EfficiencyMetricMapping().objectKind, EfficiencyMetricMapping);
    }
    ```


1. Next we generate the Kubernetes Custom Resource Definition (CRD) for our Custom Metric type and register it with Kubernetes:

    ```sh
    # Generate the CRDs of the project `myslos` in the folder `libs/my-slos/crds` and apply them.
    polaris-cli gen-crds myslos
    kubectl apply -f ./libs/myslos/crds
    ```


1. To generate a Custom Metric controller, we need to tell the Polaris CLI which Custom Metric type is going to be handled by the controller.
This is done using the `--compMetricTypePkg` and the `--compMetricType` arguments.
If the SLO mapping type package is configured as a [lookup path](https://www.typescriptlang.org/tsconfig#paths) in the workspace's `tsconfig.base.json`, Polaris CLI knows that the SLO mapping type is available locally, otherwise, it installs the respective npm package.
Polaris CLI automatically adds and configures the `@polaris-sloc/kubernetes` and `@polaris-sloc/prometheus` packages to enable the controller for use in Kubernetes and to read metrics from Prometheus.

    ```sh
    polaris-cli g composed-metric-controller reactive-efficiency --compMetricType=Efficiency --compMetricTypePkg=@my-org/my-slos
    ```

1. The generated Composed Metric controller project includes the following:
    * `src/main.ts` bootstraps the controller application by initializing the Polaris runtime with the Kubernetes library, configuring the Prometheus library as a metrics query backend, initializing the `@my-org/my-slos` library, registering the `EfficiencyMetricMapping` with the composed metrics manager and starting the manager.
    * `src/app/metrics/efficiency/efficiency.metric-source.ts` contains the `EfficiencyMetricSource` class that will read lower level metrics and produce the composed metric.
    * `src/app/metrics/efficiency/efficiency.metric-source.factory.ts` contains the factory that produces the `EfficiencyMetricSource`. This need not be modified.
    * `Dockerfile` for building a container image of the controller
    * `manifests/kubernetes` contains configuration YAML files for setting up and deploying the controller on Kubernetes.


1. Next, we implement the `EfficiencyMetricSource` in `apps/reactive-efficiency/src/app/metrics/efficiency/efficiency.metric-source.ts` as shown in the final [file](../apps/reactive-efficiency/src/app/metrics/efficiency/efficiency.metric-source.ts).


1. Since Polaris CLI has generated a Dockerfile for us, we can easily build and push the container image for our SLO controller.
The tags for the image can be adjusted in the build command in `apps/reactive-efficiency/project.json` `targets.docker-build.options.commands` (the user friendliness of this step will be improved in the future).
When changing the tag here, you also need to change the image name in `apps/reactive-efficiency/manifests/kubernetes/2-slo-controller.yaml`

    ```JSON
    "commands": [
        "docker build ... -t polarissloc/reactive-efficiency:latest ."
    ],
    ```

    ```sh
    # Build SLO controller container image
    polaris-cli docker-build reactive-efficiency

    # Push the container image to Dockerhub
    docker push polarissloc/reactive-efficiency:latest

    # Deploy the controller
    polaris-cli deploy reactive-efficiency

    # Verify that the components are running
    kubectl get deployments.apps -n polaris
    ```


## 4. Horizontal Elasticity Strategy Controller

1. Generate an Elasticity Strategy type for the horizontal elasticity strategy.
Like a Composed Metric type, an Elasticity Strategy type needs to be contained within a publishable Node.JS library project, whose name can be specified with the `--project` parameter.
We will create a new project for this Elasticity Strategy type.
To this end, add the `--createLibProject=true` parameter and specify the import path that people using the library will use for importing it using the `--importPath` parameter.

    ```sh
    # Generate the MyHorizontalElasticityStrategy type in the library project mystrategies, which is publishable as @my-org/my-strategies
    # This generates the project libs/mystrategies
    polaris-cli g elasticity-strategy my-horizontal-elasticity-strategy --project=mystrategies --createLibProject=true --importPath=@my-org/my-strategies
    ```

1. Open the file `libs/mystrategies/src/lib/elasticity/my-horizontal-elasticity-strategy.prm.ts` (`.prm` stands for Polaris Resource Model).
It contains a list of ToDos and three types:

    * `MyHorizontalElasticityStrategyConfig` models the configuration options of the elasticity strategy. Add the following properties here:

        ```TypeScript
        /**
         * The minimum number of replicas that the target workload must have.
         */
        minReplicas?: number;

        /**
         * The maximum number of replicas that the target workload must have.
         */
        maxReplicas?: number;
        ```

    * `MyHorizontalElasticityStrategyKind` can be used in an SLO mapping to reference this type of elasticity strategy.
    It also defines the input data type of the elasticity strategy (`SloCompliance`), which has to match the output data type of the SLO(s) that you want to use the elasticity strategy with, and the type of workload targets it supports (`SloTarget`).
    Depending on your use case, you may want to change the output data type of the workload target type -- for the demo, we will leave them as they are.
    Since this class defines the `ObjectKind` of the elasticity strategy, you need to adapt the `group` value that is set in the constructor to match that of your organization.
    In this demo, we leave it as it is, `'elasticity.polaris-slo-cloud.github.io'`.

        ```TypeScript
        constructor() {
            super({
                group: 'elasticity.polaris-slo-cloud.github.io',
                version: 'v1',
                kind: 'MyHorizontalElasticityStrategy',
            });
        }
        ```

    * `MyHorizontalElasticityStrategy` is the API object that can be transformed, serialized, and sent to the orchestrator.
    It takes three generic type parameters: i) the elasticity strategy's input data type, ii) the supported workload type, and iii) the data type that defines the strategy's configuration.
    The first two must match those of `MyHorizontalElasticityStrategyKind` and the third one refers to the `MyHorizontalElasticityStrategyConfig` interface that was generated.


1. The file `libs/mystrategies/src/lib/init-polaris-lib.ts` contains the initialization function for your library, `initPolarisLib(polarisRuntime: PolarisRuntime)`, which has to register the object kind of our elasticity strategy and associate it with the elasticity strategy class in [transformation service](https://polaris-slo-cloud.github.io/polaris/typedoc/interfaces/core_src.PolarisTransformationService.html) of the Polaris runtime.
Since we generated a new library project, this step has already been done by the Polaris CLI.
If we had added the  Elasticity Strategy type to an existing project, we would need to perform this registration manually (this will be handled automatically by the Polaris CLI in the future):

    ```TypeScript
    export function initPolarisLib(polarisRuntime: PolarisRuntime): void {
        ...
        polarisRuntime.transformer.registerObjectKind(new MyHorizontalElasticityStrategy().objectKind, MyHorizontalElasticityStrategy);
    }
    ```


1. Next, we need to generate the Kubernetes Custom Resource Definition (CRD) for our elasticity strategy type, so that it can be registered with Kubernetes.
We do this, just like for the Composed Metric Type, by executing the following command:

    ```sh
    # Generate the CRDs of the project `mystrategies` in the folder `libs/mystrategies/crds` and apply them.
    polaris-cli gen-crds mystrategies
    kubectl apply -f ./libs/mystrategies/crds
    ```


1. To generate an elasticity strategy controller, we need to tell the Polaris CLI which elasticity strategy type is going to be handled by the controller.
This is done using the `--eStratTypePkg` and the `--eStratType` arguments.
If the elasticity strategy type package is configured as a [lookup path](https://www.typescriptlang.org/tsconfig#paths) in the workspace's `tsconfig.base.json`, Polaris CLI knows that the elasticity strategy type is available locally, otherwise, it installs the respective npm package.
Polaris CLI automatically adds and configures the `@polaris-sloc/kubernetes` package to enable the controller for use in Kubernetes.

    ```sh
    # Generate an elasticity strategy controller project for the MyHorizontalElasticityStrategy in apps/my-horizontal-elasticity-strategy-controller
    polaris-cli g elasticity-strategy-controller my-horizontal-elasticity-strategy-controller --eStratTypePkg=@my-org/my-strategies --eStratType=MyHorizontalElasticityStrategy
    ```


1. The generated elasticity strategy controller project includes the following:

    * `src/main.ts` bootstraps the controller application by initializing the Polaris runtime with the Kubernetes library, initializing the `@my-org/my-strategies` library, registering the `MyHorizontalElasticityStrategyKind` with the elasticity strategy manager, linking it to the newly generated `MyHorizontalElasticityStrategyController`, and starting the watch on the horizontal elasticity strategies on the orchestrator.
    * `src/app/elasticity/my-horizontal-elasticity-strategy.controller.ts` contains the `MyHorizontalElasticityStrategyController` class that will act as the microcontroller for enacting the elasticity strategy.
    A single instance of this microcontroller class is created to handle all elasticity strategy instances.
    Note the difference to SLO controllers, where a distinct microcontroller instance is created for each SLO mapping instance.
    This is because each SLO mapping contains a distinct configuration and the SLO with that specific configuration needs to evaluated periodically.
    Instead an elasticity strategy is only executed when an elasticity strategy type instance is created or modified and that instance contains all the information needed to execute the strategy.
    * `Dockerfile` for building a container image of the controller
    * `manifests/kubernetes` contains configuration YAML files for setting up and deploying the controller on Kubernetes.


1. The file with the `MyHorizontalElasticityStrategyController` class contains a list of ToDos that need to be covered.

    * If the generic parameters of the elasticity strategy kind were changed from the defaults, they need to be adapted here as well - in this case, no changes are necessary.
    * If the elasticity strategy uses an input type other than `SloCompliance`, we need to change the controller's superclass to `ElasticityStrategyController` (more on this shortly).
    * The elasticity strategy's actions need to be implemented in the `execute()` method.
    * The `manifests/1-rbac.yaml` file needs to be adapted to grant permissions on the API group and kind of the elasticity strategy kind. If the default API group (`elasticity.polaris-slo-cloud.github.io`) and kind were not changed in the elasticity strategy type (we didn't change them in the demo), nothing needs to be done here.

    The generated code creates an `OrchestratorClient` for interaction with the orchestrator and a `StabilizationWindowTracker` that can be used to ensure that we don't execute an elasticity strategy twice for the same target in a short time window, where the effect of the last operation cannot be seen yet (i.e., the stabilization window).
    All framework classes and methods have JSDoc applied, so hovering over a method name will reveal its documentation or that of the method in the superclass or interface.

    An [elasticity strategy controller](https://polaris-slo-cloud.github.io/polaris/typedoc/interfaces/core_src.ElasticityStrategyController.html) must implement two main methods:

    * `checkIfActionNeeded()` checks if the specified elasticity strategy instance requires an execution of the strategy's actions.
    E.g., if the value of `SloCompliance` is within the toleration interval, no action is needed.
    When using `SloCompliance` as input (and thus the `SloComplianceElasticityStrategyControllerBase` superclass), this method does not need to be implemented, because it is handled by the superclass.
    * `execute()` performs the actions that constitute the elasticity strategy, e.g., adding or removing replicas.


1. If we wanted to implement a never before seen elasticity strategy, we would need to implement the `execute()` method manually.
However, since horizontal and vertical scaling are very common, Polaris provides superclasses for each of these two elasticity strategy types (see [here](https://github.com/polaris-slo-cloud/polaris/tree/master/ts/libs/core/src/lib/elasticity/public/control/base)).
Thus, we can delete most of the boilerplate code and extend the `HorizontalElasticityStrategyControllerBase`, which requires us to only compute the new number of replicas:

    ```TypeScript
    protected computeScale(
        elasticityStrategy: ElasticityStrategy<SloCompliance, SloTarget, MyHorizontalElasticityStrategyConfig>,
        currScale: Scale,
    ): Promise<Scale> {
        const newScale = new Scale(currScale);
        const multiplier = elasticityStrategy.spec.sloOutputParams.currSloCompliancePercentage / 100;
        newScale.spec.replicas = Math.ceil(currScale.spec.replicas * multiplier);
        return Promise.resolve(newScale);
    }
    ```

1. Since Polaris CLI has generated a Dockerfile for us, we can easily build and push the container image for our elasticity strategy controller.
The tags for the image can be adjusted in the build command in `apps/my-horizontal-elasticity-strategy-controller/project.json` `targets.docker-build.options.commands` (the user friendliness of this step will be improved in the future).
When changing the tag here, you also need to change the image name in `apps/my-horizontal-elasticity-strategy-controller/manifests/kubernetes/2-slo-controller.yaml`

    ```JSON
    "commands": [
        "docker build ... -t polarissloc/horizontal-elasticity-strat-controller:latest ."
    ],
    ```

    ```sh
    # Build SLO controller container image
    polaris-cli docker-build my-horizontal-elasticity-strategy-controller

    # Push the container image to DockerHub
    docker push polarissloc/my-horizontal-elasticity-strategy-controller:latest

    # Deploy the controller
    polaris-cli deploy my-horizontal-elasticity-strategy-controller

    # Verify that the components are running
    kubectl get deployments.apps -n polaris
    ```


## 5. SLO Controller

1. Create an SLO mapping type for the efficiency SLO.
Like a Composed Metric type or an Elasticity Strategy type, an SLO mapping type needs to be contained within a publishable Node.JS library project.
We add the SLO mapping type to the existing `myslos` project.

    ```sh
    # Generate the cost efficiency SLO mapping type in the library project myslos, which is publishable as @my-org/my-slos
    polaris-cli g slo-mapping-type efficiency --project=myslos
    ```

1. Open the file `libs/my-slos/src/lib/slo-mappings/efficiency.slo-mapping.prm.ts` (`.prm` stands for Polaris Resource Model), which contains three types:
    * `EfficiencySloConfig` models the configuration options of the SLO. Add the following property here:
        ```TypeScript
        /**
         * The desired target efficiency in the range between 0 and 100.
         *
         * @minimum 0
         * @maximum 100
         */
        targetEfficiency: number;
        ```
    * `EfficiencySloMappingSpec` is the type that brings together the SLO's configuration type, its output data type (`SloOutput`), and the type of workload targets it supports (`SloTarget`).
    Depending on your use case, you may want to change the output data type of the workload target type -- for the demo, we will leave them as they are.
    * `EfficiencySloMapping` is the API object that can be transformed, serialized, and sent to the orchestrator. Here, the `objectKind.group` value that is set in the constructor needs to be changed to match that of your organization. In this demo, we leave it at the generated value of `'slo.polaris-slo-cloud.github.io'`.
        ```TypeScript
        constructor(initData?: SloMappingInitData<EfficiencySloMapping>) {
            super(initData);
            this.objectKind = new ObjectKind({
                group: 'slo.polaris-slo-cloud.github.io',
            ...
        ```


1. Since we have added the SLO mapping type to an existing project, we need to adapt the initialization function for the library library in the `libs/myslos/src/lib/init-polaris-lib.ts`file.
We would need to register the new type with the [Polaris transformation service](https://polaris-slo-cloud.github.io/polaris/typedoc/interfaces/core_src.PolarisTransformationService.html) (this will be handled automatically by the Polaris CLI in the future):

    ```TypeScript
    export function initPolarisLib(polarisRuntime: PolarisRuntime): void {
        ...
        polarisRuntime.transformer.registerObjectKind(new EfficiencySloMapping().objectKind, EfficiencySloMapping);
    }
    ```

1. Next we generate the Kubernetes CRD for our SLO mapping type and register it with Kubernetes:

    ```sh
    # Generate the CRDs of the project `myslos` in the folder `libs/my-slos/crds` and apply them.
    polaris-cli gen-crds myslos
    kubectl apply -f ./libs/myslos/crds
    ```

1. To generate an SLO controller, we need to tell the Polaris CLI which SLO mapping type is going to be handled by the controller.
This is done using the `--sloMappingTypePkg` and the `--sloMappingType` arguments.
If the SLO mapping type package is configured as a [lookup path](https://www.typescriptlang.org/tsconfig#paths) in the workspace's `tsconfig.base.json`, Polaris CLI knows that the SLO mapping type is available locally, otherwise, it installs the respective npm package.

    ```sh
    # Generate an SLO controller project for the EfficiencySloMapping in apps/eff-controller
    polaris-cli g slo-controller eff-controller --sloMappingTypePkg=@my-org/my-slos --sloMappingType=EfficiencySloMapping
    ```

1. The generated SLO controller project includes the following:
    * `src/main.ts` bootstraps the controller application by initializing the Polaris runtime with the Kubernetes library, configuring the Prometheus library as a metrics query backend, initializing the `@my-org/my-slos` library, registering the cost efficiency SLO mapping with the control loop and the watch manager, and starting the control loop.
    * `src/app/slo/efficiency.controller.ts` contains the `EfficiencySlo` class that will act as the microcontroller for evaluating our SLO.
    * `Dockerfile` for building a container image of the controller
    * `manifests/kubernetes` contains configuration YAML files for setting up and deploying the controller on Kubernetes.


1. Next, we implement the `EfficiencySlo` in `apps/eff-controller/src/app/slo/efficiency.slo.ts` as shown in the final [file](../apps/eff-controller/src/app/slo/efficiency.controller.ts).


1. Since Polaris CLI has generated a Dockerfile for us, we can easily build and push the container image for our SLO controller.
The tags for the image can be adjusted in the build command in `apps/eff-controller/project.json` `targets.docker-build.options.commands` (the user friendliness of this step will be improved in the future).
When changing the tag here, you also need to change the image name in `apps/eff-controller/manifests/kubernetes/2-slo-controller.yaml`

    ```JSON
    "commands": [
        "docker build ... -t polarissloc/eff-controller:latest ."
    ],
    ```

    ```sh
    # Build SLO controller container image
    polaris-cli docker-build eff-controller

    # Push the container image to Dockerhub
    docker push polarissloc/eff-controller:latest

    # Deploy the controller
    polaris-cli deploy eff-controller

    # Verify that the components are running
    kubectl get deployments.apps -n polaris
    ```

 
## 6. SLO Mapping instance

Generate a SLO Mapping instance:
```sh
polaris-cli g slo-mapping demo-efficiency --sloMappingType=EfficiencySloMapping --sloMappingTypePkg=@my-org/my-slos
```

Fill out SLO Mapping `targetEfficiency`, and serialize and apply the demo:

```sh
polaris-cli serialize demo-efficiency | kubectl apply -f -
```

## 7. Grafana Dashboard

```sh
polaris-cli g metrics-dashboard efficiency --compMetricTypePkg=@my-org/my-slos --compMetricType=Efficiency --namespace=demo --grafanaUrl=<grafana URL>
```
