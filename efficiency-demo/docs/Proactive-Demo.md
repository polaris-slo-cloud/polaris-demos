# Proactive Demo

This demo assumes you have gone through the [Reactive Demo](Reactive-Demo.md) and recommend watching our [video](https://www.youtube.com/watch?v=epgcMXS55tQ) to not miss anything.
Therefore, we do not setup a new project nor execute commands to generate basic components (i.e., SLO Mapping Type).
We recommend following the [Reactive Demo](Reactive-Demo.md) but **do not** deploy the SLO Controller.

## Additional prerequisites

While the Predicted Metric Controller can invoke any TF Serving instance (just configure the environment variable), we describe in the following the setup used in the tutorial video.
This includes to set up the following things:
* MinIO to host the [model](https://github.com/polaris-slo-cloud/polaris-ai/tree/main/predictive_monitoring/models/lstm_batch72_neurons50_epochs400_do0)
* TF Serving to expose the AI serving service

All deployment files and deployment scripts can be found under `deployment/proactive`. 

### Steps:

1. Deploy MinIO 

```bash
cd deployment/proactive/minio
./bin/deploy.sh
```

Note: your system requires a [Persistent Volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) with at least 10MB.

2. Deploy TF Serving

```bash
cd deployment/proactive/tfserving
./bin/deploy.sh
```

3. Upload the model to MinIO.

The TF Serving instance is configured to serve a model under the following URL: `http://efficiency-serving-service:8500/v1/models/efficiency:predict`.
Therefore, you need to place the model in the following bucket on MinIO: `models/efficiency/1`.

  1. Download [the folder that contains a model](https://github.com/polaris-slo-cloud/polaris-ai/tree/main/predictive_monitoring/models/lstm_batch72_neurons50_epochs400_do0) (include the `variables` folder).
  2. Save the downloaded files (`.pb` and `variables` dir) under the following directory `efficiency/1` (i.e., `efficiency/1/model.pb`)
  3. Visit the MinIO interface (i.e., `localhost:30910`)
  4. Enter the credentials (user: `minio`,  password: `minio123` per default configuration)
  5. Create a bucket called `models` and  upload the previously created model folder `efficiency`, which includes all sub-directories and the model. The resulting bucket structure should be: `models/efficiency/1/`, in which the saved model and the `variables` folder are.
  6. Verify that the TF Serving instance loaded the model by checking its logs. Upon successful loading the logs should contain `(Re-)adding model: efficiency` and at the end `[evhttp_server.cc : 238] NET_LOG: Entering the event loop ...`.



## Predicted Metric Controller
```bash
polaris-cli g predicted-metric-controller predicted-efficiency \
  --compMetricTypePkg=@my-org/my-slos --compMetricType=Efficiency 
```

Follow the video and fill out the `efficiency-metric-source.ts`.
Take a look at this [documentation](https://github.com/polaris-slo-cloud/polaris-slo-framework/blob/master/docs/features/cli.md#predicted-metric-controller) for more details.

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
