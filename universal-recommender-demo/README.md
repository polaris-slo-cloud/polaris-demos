# Universal Recommender Example Use Case

This document describes an example use case for leveraging Polaris to enforce an SLO on a recommender system.
Specifically, we have chosen [Universal Recommender](https://actionml.com/docs/h_ur) for this example, because it is open-source, under active development, and not limited to a specific recommendation scenario.


## Prerequisites

Please ensure that you have a Kubernetes cluster with Prometheus available.
Please see our [base setup tutorial](https://github.com/polaris-slo-cloud/polaris/tree/master/testbeds/kubernetes/microk8s/base) for instructions on how to set one up - for this use case, you can skip the installation of ingress-nginx and Kubecost.


## Setup

1. 
