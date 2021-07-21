import {
  ElasticityStrategy,
  HorizontalElasticityStrategyControllerBase,
  Scale,
  SloCompliance,
  SloTarget,
} from '@polaris-sloc/core';
import {
  HorizontalElasticityStrategyConfig,
} from '@my-org/my-strategies';

/**
 * Controller for the HorizontalElasticityStrategy.
 */
export class HorizontalElasticityStrategyController extends HorizontalElasticityStrategyControllerBase<SloTarget, HorizontalElasticityStrategyConfig> {

  protected computeScale(
    elasticityStrategy: ElasticityStrategy<SloCompliance, SloTarget, HorizontalElasticityStrategyConfig>,
    currScale: Scale,
  ): Promise<Scale> {
    const newScale = new Scale(currScale);
    const multiplier = elasticityStrategy.spec.sloOutputParams.currSloCompliancePercentage / 100;
    newScale.spec.replicas = Math.ceil(currScale.spec.replicas * multiplier);
    return Promise.resolve(newScale);
  }

}
