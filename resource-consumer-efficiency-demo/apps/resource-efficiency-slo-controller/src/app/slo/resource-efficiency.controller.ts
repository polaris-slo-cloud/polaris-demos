import { ResourceEfficiency, ResourceEfficiencyMetric, ResourceEfficiencyParams, ResourceEfficiencySloConfig } from '@polaris-sloc/efficiency-mappings';
import {
    ComposedMetricSource,
    createOwnerReference,
    Logger,
    MetricsSource,
    ObservableOrPromise,
    OrchestratorGateway,
    ServiceLevelObjective,
    SloCompliance,
    SloMapping,
    SloOutput,
} from '@polaris-sloc/core';
import { of } from 'rxjs';

/**
 * Implements the ResourceEfficiency SLO.
 */
export class ResourceEfficiencySlo
    implements
        ServiceLevelObjective<ResourceEfficiencySloConfig, SloCompliance>
{
    sloMapping: SloMapping<ResourceEfficiencySloConfig, SloCompliance>;

    private metricsSource: MetricsSource;
    private effMetricSource: ComposedMetricSource<ResourceEfficiency>;

    configure(
        sloMapping: SloMapping<ResourceEfficiencySloConfig, SloCompliance>,
        metricsSource: MetricsSource,
        orchestrator: OrchestratorGateway
    ): ObservableOrPromise<void> {
        this.sloMapping = sloMapping;
        this.metricsSource = metricsSource;

        const effMetricParams: ResourceEfficiencyParams = {
            namespace: sloMapping.metadata.namespace,
            sloTarget: sloMapping.spec.targetRef,
            owner: createOwnerReference(sloMapping),
        };
        this.effMetricSource = metricsSource.getComposedMetricSource(ResourceEfficiencyMetric.instance, effMetricParams);

        return of(undefined);
    }

    evaluate(): ObservableOrPromise<SloOutput<SloCompliance>> {
        return this.calculateSloCompliance()
            .then(sloCompliance => ({
                sloMapping: this.sloMapping,
                elasticityStrategyParams: {
                    currSloCompliancePercentage: sloCompliance,
                },
            }));
    }

    private async calculateSloCompliance(): Promise<number> {
        const eff = await this.effMetricSource.getCurrentValue().toPromise();
        if (!eff) {
            Logger.log('Obtaining resource-efficiency metric returned:', eff);
            return 100;
        }
        const compliance = (eff.value.efficiency / this.sloMapping.spec.sloConfig.targetEfficiency) * 100;
        return Math.ceil(compliance);
    }
}
