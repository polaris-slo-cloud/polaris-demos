import {
  ComposedMetricMapping,
  ComposedMetricMappingSpec,
  ComposedMetricParams,
  ComposedMetricType,
  POLARIS_API,
} from '@polaris-sloc/core';

/**
 * Represents the value of a Efficiency metric.
 */
export interface Efficiency {

  /**
   * The current efficiency in the range between 0 and 100.
   */
  efficiency: number;

}

/**
 * The parameters for retrieving the Efficiency metric.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EfficiencyParams extends ComposedMetricParams {}

/**
 * Represents the type of a generic cost efficiency metric.
 */
export class EfficiencyMetric extends ComposedMetricType<
  Efficiency,
  EfficiencyParams
> {
  /** The singleton instance of this type. */
  static readonly instance = new EfficiencyMetric();

  readonly metricTypeName = POLARIS_API.METRICS_GROUP + '/v1/efficiency';
}

/**
 * Used to configure a Efficiency composed metric controller to compute
 * its metric for a specific target.
 */
export class EfficiencyMetricMapping extends ComposedMetricMapping<
  ComposedMetricMappingSpec<EfficiencyParams>
> {
  constructor(initData?: Partial<EfficiencyMetricMapping>) {
    super(initData);
    this.objectKind = EfficiencyMetricMapping.getMappingObjectKind(
      EfficiencyMetric.instance
    );
  }
}
