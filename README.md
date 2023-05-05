# Polaris Demos

This repository contains demo implementations using the [Polaris SLO Cloud Framework](https://polaris-slo-cloud.github.io).

## Demos

The repository contains the following demos:

* [avg-cpu-usage](./avg-cpu-usage): Implements a simple average CPU usage SLO mapping type and controller by transforming a Prometheus query into raw metrics queries.
* [cost-eff-composed-metrics](./cost-eff-composed-metrics): Implements a cost efficiency SLO mapping type and controller using composed metrics from the `@polaris-sloc/cost-efficiency` library.
* [cost-eff-raw-metrics-only](./cost-eff-raw-metrics-only): Implements a cost efficiency SLO mapping type and controller using only raw metrics queries in the controller directly.
* [efficiency-demo](./efficiency-demo): Implements a resource efficiency composed metric type, a horizontal elasticty strategy type, and a resource efficiency SLO mapping and corresponding controllers, as seen in the Polaris Demo videos.
* [horizontal-elasticity-strat](./horizontal-elasticity-strat): Implements a horizontal elasticity strategy type and controller.
