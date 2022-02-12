import {
  ElasticityStrategy,
  HorizontalElasticityStrategyControllerBase,
  Scale,
  SloCompliance,
  SloTarget,
} from '@polaris-sloc/core';
import {
  MyHorizontalElasticityStrategyConfig,
} from '@my-org/my-strategies';

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
    const multiplier = elasticityStrategy.spec.sloOutputParams.currSloCompliancePercentage / 100;
    newScale.spec.replicas = Math.ceil(currScale.spec.replicas * multiplier);
    return Promise.resolve(newScale);
  }

}
