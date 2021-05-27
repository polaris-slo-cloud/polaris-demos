/**
 * Describes the total cost for an `SloTarget`.
 */
 export interface TotalCost {

  /**
   * The total cost per hour for the `SloTarget` at the current resource usage rate.
   */
  currentCostPerHour: number;

  /**
   * The total cost for the `SloTarget` accumulated in the current billing period up to this point.
   */
  accumulatedCostInPeriod: number;

}

/**
* Represents a generic cost efficiency metric.
*
* The cost efficiency of a target workload is calculated as `performance / totalCost`.
*
* The `performance` part depends on the concrete implementation of the `CostEfficiencyMetric`, e.g.,
* for REST APIs `performance` is usually the number of requests that are faster than a defined threshold.
*
* The `totalCost` part is retrieved using the `TotalCostMetricType`.
*/
export interface CostEfficiency {

  /**
   * The cost efficiency of the `SloTarget`.
   */
  costEfficiency: number;

  /**
   * The percentile of the `performance` metric samples that are better than the defined threshold.
   */
  percentileBetterThanThreshold: number;

  /**
   * The total costs of the `SloTarget`.
   */
  totalCost: TotalCost;

}
