# Proactive Demo

This demo assumes you have gone through the [Reactive Demo](Reactive-Demo.md) and recommend to watch our [video](https://www.youtube.com/watch?v=epgcMXS55tQ) to not miss anything.
Therefore, we do not setup a new project nor execute commands to generate basic components (i.e., SLO Mapping Type).
We recommend to follow the [Reactive Demo](Reactive-Demo.md) but **do not** deploy the SLO Controller.


## Predicted Metric Controller
```bash
polaris-cli g predicted-metric-controller predicted-efficiency \
  --compMetricTypePkg=@my-org/my-slos --compMetricType=Efficiency 
```

Follow the video and fill out the `efficiency-metric-source.ts`.
Take a look at this [documentation](https://github.com/polaris-slo-cloud/polaris/blob/master/docs/features/cli.md#predicted-metric-controller) for more details.

Afterwards, you can build and deploy the controller:

```bash
polaris-cli docker-build predicted-efficiency 
docker push polarissloc/predicted-efficiency-ai-proxy:latest 
docker push polarissloc/predicted-efficiency-composed-metric-controller:latest  
```

Before deploying, you will want to update the URL of the AI Service in `apps/predicted-efficiency/manifests/kubernetes/2-metrics-controller.yaml`

Afterwards, you can deploy the Predicted Metric Controller:

```bash
polaris-cli deploy predicted-efficiency
```

Verify that the controller is running:

```bash
kubectl get deployments.apps -n polaris
```

This concludes the demo, you are now using a proactive scaling approach.
You can easily swap out the proactive with the reactive approach by deleting the Predicted Metric Controller deployment.
