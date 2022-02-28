# Reactive Efficiency Demo

This document lists all commands to generate the reactive approach of scaling based on effiency shown in this [video](https://youtu.be/qScTsLGyOi8).

## 1. Create a workspace 
```bash
   npm install -g @polaris-sloc/cli
   polaris-cli init demo
   cd demo 
```

## 2. Create the Efficiency Metric Controller

```bash
   polaris-cli g composed-metric-type efficiency --project=myslos --createLibProject=true --importPath=@my-org/my-slos
```

Open Editor, and
go into `libs/myslos/src/lib/metrics/efficiency-metric.prm.ts` and fill out Efficiency interface

```bash
   polaris-cli g composed-metric-controller reactive-efficiency --compMetricType=Efficiency --compMetricTypePkg=@my-org/my-slos
```

Add `initPolarisLib(polarisRuntime);` to `main.ts` and fill out metric source .ts file.

Then, generate and apply the CRDs:

```bash
   polaris-cli gen-crds myslos
   kubectl apply -f ./libs/myslos/crds
```

Afterwards, you can build & push the Docker container and finally deploy the components to your Kubernetes instance. 
```bash
   polaris-cli docker-build reactive-efficiency
   docker push …
   polaris-cli deploy reactive-efficiency
   kubectl get deployments.apps -n Polaris 
```

## 3. Horizontal Elasticity Strategy Controller

Generate the Horizontal Elasticity Strategy:
```bash
    polaris-cli g elasticity-strategy my-horizontal-elasticity-strategy --project=mystrategies --createLibProject=true --importPath=@my-org/my-strategies 
```

Generate the Horizontal Elasticity Strategy controller:
```bash
    polaris-cli g elasticity-strategy-controller my-horizontal-elasticity-strategy-controller --eStratTypePkg=@my-org/my-strategies --eStratType=MyHorizontalElasticityStrategy 
```

Fill out controller, and generate the CRDs:
```bash
    polaris-cli gen-crds mystrategies 
    kubectl apply -f ./libs/mystrategies/crds 
```

Build, push and deploy the containers:
```bash
    polaris-cli docker-build my-horizontal-elasticity-strategy-controller 
    docker push … 
    polaris-cli deploy my-horizontal-elasticity-strategy-controller 
```

Verify that the components are running:
```bash
    kubectl get deployments.apps -n polaris 
```

## 4. SLO Controller

Generate a SLO Mapping type:

```bash
    polaris-cli g slo-mapping-type efficiency --project=myslos 
```

Fill out `SloConfig` in .ts (targetEfficiency), and generate a SLO Controller:

```bash
    polaris-cli g slo-controller eff-controller --sloMappingTypePkg=@my-org/my-slos --sloMappingType=EfficiencySloMapping 
```

Fill out `efficiency.slo.ts` controller, and generate the CRDS:

```bash
    polaris-cli gen-crds myslos 
    kubectl apply -f ./libs/myslos/crds 
```

Build, push and deploy the **SLO Controller**:

```bash
    polaris-cli docker-build eff-controller 
    docker push polarissloc/eff-controller:latest 
    polaris-cli deploy eff-controller 
```

Verify that the components are running:
```
    kubectl get deployments.apps -n polaris 
```
 
## 5. SLO Mapping instance

Generate a SLO Mapping instance:
```bash
    polaris-cli g slo-mapping demo-efficiency --sloMappingType=EfficiencySloMapping --sloMappingTypePkg=@my-org/my-slos 
```

Fill out SLO Mapping `targetEfficiency`, and serialize and apply the demo:

```bash
    polaris-cli serialize demo-efficiency | kubectl apply -f – 
```

## 6. Grafana Dashboard

```bash
    polaris-cli g metrics-dashboard efficiency --compMetricTypePkg=@my-org/my-slos \ 
    --compMetricType=Efficiency --namespace=demo -–grafanaUrl=<grafana URL>
```