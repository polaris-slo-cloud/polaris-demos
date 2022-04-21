import { ResourceEfficiencySloConfig } from '@polaris-sloc/efficiency-mappings';
import {
    MetricsSource,
    ObservableOrPromise,
    OrchestratorGateway,
    ServiceLevelObjective,
    SloCompliance,
    SloMapping,
    SloOutput,
} from '@polaris-sloc/core';

/**
 * Implements the ResourceEfficiency SLO.
 *
 * ToDo: Change SloOutput type if necessary.
 */
export class ResourceEfficiencySlo
    implements
        ServiceLevelObjective<ResourceEfficiencySloConfig, SloCompliance>
{
    sloMapping: SloMapping<ResourceEfficiencySloConfig, SloCompliance>;

    private metricsSource: MetricsSource;

    configure(
        sloMapping: SloMapping<ResourceEfficiencySloConfig, SloCompliance>,
        metricsSource: MetricsSource,
        orchestrator: OrchestratorGateway
    ): ObservableOrPromise<void> {
        this.sloMapping = sloMapping;
        this.metricsSource = metricsSource;

        // ToDo
    }

    evaluate(): ObservableOrPromise<SloOutput<SloCompliance>> {
        // ToDo
    }
}
