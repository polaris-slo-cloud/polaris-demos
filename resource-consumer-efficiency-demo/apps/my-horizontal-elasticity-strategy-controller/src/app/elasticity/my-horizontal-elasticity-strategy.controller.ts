import {
    ElasticityStrategy,
    HorizontalElasticityStrategyControllerBase,
    Scale,
    SloCompliance,
    SloTarget,
} from '@polaris-sloc/core';
import {
    MyHorizontalElasticityStrategyConfig,
} from '@polaris-sloc/custom-elasticity-strategies';

/**
 * Controller for the MyHorizontalElasticityStrategy.
 */
export class MyHorizontalElasticityStrategyController extends HorizontalElasticityStrategyControllerBase<
    SloTarget,
    MyHorizontalElasticityStrategyConfig
> {
    protected computeScale(
        elasticityStrategy: ElasticityStrategy<SloCompliance, SloTarget, MyHorizontalElasticityStrategyConfig>,
        currScale: Scale,
    ): Promise<Scale> {
        const newScale = new Scale(currScale);
        const compliance = elasticityStrategy.spec.sloOutputParams.currSloCompliancePercentage;
        const multiplier = compliance / 100;
        newScale.spec.replicas = Math.ceil(currScale.spec.replicas * multiplier);
        console.log(`Old replicas: ${currScale.spec.replicas}, new replicas: ${currScale.spec.replicas}, compliance: ${compliance}, multiplier: ${multiplier}`)
        return Promise.resolve(newScale);
    }
}
