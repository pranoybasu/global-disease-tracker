/**
 * Momentum Calculations
 *
 * This module provides functions for calculating disease spread momentum,
 * including growth rates over different time periods and trend detection.
 *
 * @module momentumCalculations
 * @see Original implementation: coronavirus19stats/src/datasource/JHDatasourceProvider.js (lines 103-131, 164-192, 484-509)
 */

/**
 * Growth metrics for a specific metric (cases, deaths, recoveries)
 */
export interface GrowthMetrics {
  /** Total cumulative value */
  total: number;
  /** New cases in last 1 day */
  new1Day: number;
  /** New cases in last 3 days */
  new3Days: number;
  /** New cases in last 7 days */
  new7Days: number;
}

/**
 * Growth rate percentages calculated from growth metrics
 */
export interface GrowthRates {
  /** 1-day growth rate as percentage (0.0 to 1.0+) */
  rate1Day: number;
  /** 3-day average daily growth rate as percentage */
  rate3Day: number;
  /** 7-day average daily growth rate as percentage */
  rate7Day: number;
  /** 3-day average daily new cases */
  avg3Day: number;
  /** 7-day average daily new cases */
  avg7Day: number;
}

/**
 * Trend direction for disease spread
 */
export type TrendDirection = 'accelerating' | 'increasing' | 'stable' | 'decreasing' | 'declining';

/**
 * Complete momentum analysis result
 */
export interface MomentumAnalysis {
  /** Growth rates for different periods */
  growthRates: GrowthRates;
  /** Overall trend direction */
  trend: TrendDirection;
  /** Is the situation improving? */
  improving: boolean;
  /** Is the situation worsening? */
  worsening: boolean;
  /** Confidence level in trend assessment (0-1) */
  confidence: number;
}

/**
 * Calculates growth rates from growth metrics.
 *
 * @param metrics - Growth metrics over different time periods
 * @returns Calculated growth rates as percentages
 *
 * @example
 * ```typescript
 * const rates = calculateGrowthRates({
 *   current: 10000,
 *   growthLast1Day: 50,
 *   growthLast3Days: 180,
 *   growthLast7Days: 500
 * });
 * console.log(rates.rate1Day); // 0.005 (0.5% daily growth)
 * console.log(rates.rate7Day); // 0.007 (0.7% average daily growth over 7 days)
 * ```
 */
export function calculateGrowthRates(metrics: GrowthMetrics): GrowthRates {
  const { total, new1Day, new3Days, new7Days } = metrics;

  // Avoid division by zero
  if (total <= 0) {
    return {
      rate1Day: 0,
      rate3Day: 0,
      rate7Day: 0,
      avg3Day: 0,
      avg7Day: 0,
    };
  }

  // Calculate individual growth rates
  const rate1Day = new1Day / total;
  const rate3Day = new3Days / total / 3; // Average daily rate over 3 days
  const rate7Day = new7Days / total / 7; // Average daily rate over 7 days

  // Calculate averages
  const avg3Day = new3Days / 3;
  const avg7Day = new7Days / 7;

  return {
    rate1Day,
    rate3Day,
    rate7Day,
    avg3Day,
    avg7Day,
  };
}

/**
 * Determines the trend direction based on growth rates.
 *
 * @param rates - Growth rates to analyze
 * @returns Trend direction
 *
 * @example
 * ```typescript
 * const trend = determineTrend({
 *   rate1Day: 0.015,
 *   rate3Day: 0.012,
 *   rate7Day: 0.008,
 *   weightedRate: 0.010
 * });
 * console.log(trend); // TrendDirection.ACCELERATING
 * ```
 */
export function determineTrend(rates: GrowthRates): TrendDirection {
  const { avg3Day, avg7Day } = rates;

  // Check if trend is accelerating (recent growth > long-term average)
  if (avg3Day > avg7Day * 1.3 && avg7Day > 0) {
    return 'accelerating';
  }

  // Check if declining (recent growth much less than long-term)
  if (avg3Day < avg7Day * 0.7 && avg7Day > 0) {
    return 'declining';
  }

  // Check if decreasing (downward trend)
  if (avg3Day < avg7Day && avg7Day > 0) {
    return 'decreasing';
  }

  // Check if increasing (upward trend)
  if (avg3Day > avg7Day && avg7Day > 0) {
    return 'increasing';
  }

  // Otherwise stable
  return 'stable';
}

/**
 * Calculates confidence level in trend assessment based on data consistency.
 *
 * Higher confidence when:
 * - All time periods show similar trends
 * - Growth values are substantial (not just noise)
 *
 * @param rates - Growth rates to analyze
 * @returns Confidence level (0.0 to 1.0)
 */
export function calculateTrendConfidence(rates: GrowthRates): number {
  const { rate1Day, rate3Day, rate7Day } = rates;

  // Check consistency between different time periods
  const consistency1v3 =
    1 - Math.abs(rate1Day - rate3Day) / Math.max(Math.abs(rate1Day), Math.abs(rate3Day), 0.01);
  const consistency3v7 =
    1 - Math.abs(rate3Day - rate7Day) / Math.max(Math.abs(rate3Day), Math.abs(rate7Day), 0.01);
  const consistency1v7 =
    1 - Math.abs(rate1Day - rate7Day) / Math.max(Math.abs(rate1Day), Math.abs(rate7Day), 0.01);

  // Average consistency
  const consistency = (consistency1v3 + consistency3v7 + consistency1v7) / 3;

  // Magnitude factor (higher confidence with stronger signals)
  const magnitude = Math.min(Math.abs(rate7Day) * 100, 1);

  // Combined confidence (50% consistency, 50% magnitude)
  return Math.max(0, Math.min(1, consistency * 0.5 + magnitude * 0.5));
}

/**
 * Performs complete momentum analysis on growth metrics.
 *
 * @param metrics - Growth metrics over different time periods
 * @returns Complete momentum analysis including trend and confidence
 *
 * @example
 * ```typescript
 * const analysis = analyzeMomentum({
 *   current: 10000,
 *   growthLast1Day: 50,
 *   growthLast3Days: 180,
 *   growthLast7Days: 500
 * });
 *
 * console.log(analysis.trend); // TrendDirection.INCREASING
 * console.log(analysis.improving); // false
 * console.log(analysis.worsening); // true
 * console.log(analysis.confidence); // 0.75
 * ```
 */
export function analyzeMomentum(metrics: GrowthMetrics): MomentumAnalysis {
  const growthRates = calculateGrowthRates(metrics);
  const trend = determineTrend(growthRates);
  const confidence = calculateTrendConfidence(growthRates);

  // Determine if improving or worsening
  const improving = trend === 'decreasing' || trend === 'declining';
  const worsening = trend === 'accelerating' || trend === 'increasing';

  return {
    growthRates,
    trend,
    improving,
    worsening,
    confidence,
  };
}

/**
 * Gets a human-readable description of the trend.
 *
 * @param trend - Trend direction
 * @returns Description text
 */
export function getTrendDescription(trend: TrendDirection): string {
  const descriptions: Record<TrendDirection, string> = {
    accelerating: 'Cases are accelerating rapidly',
    increasing: 'Cases are increasing steadily',
    stable: 'Cases are relatively stable',
    decreasing: 'Cases are decreasing',
    declining: 'Cases are declining rapidly',
  };

  return descriptions[trend];
}

/**
 * Gets a color code for visualizing the trend.
 *
 * @param trend - Trend direction
 * @returns Hex color code
 */
export function getTrendColor(trend: TrendDirection): string {
  const colors: Record<TrendDirection, string> = {
    accelerating: '#ef4444', // red-500
    increasing: '#f97316', // orange-500
    stable: '#eab308', // yellow-500
    decreasing: '#84cc16', // lime-500
    declining: '#22c55e', // green-500
  };

  return colors[trend];
}

/**
 * Formats a growth rate as a percentage string.
 *
 * @param rate - Growth rate (0.0 to 1.0+)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 *
 * @example
 * ```typescript
 * formatGrowthRate(0.0543); // "+5.43%"
 * formatGrowthRate(-0.0234, 1); // "-2.3%"
 * ```
 */
export function formatGrowthRate(rate: number, decimals: number = 1): string {
  const percentage = rate * 100;
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(decimals)}%`;
}

/**
 * Gets confidence level category based on numeric confidence.
 *
 * @param confidence - Numeric confidence (0.0 to 1.0)
 * @returns Confidence level category
 */
export function getConfidenceLevel(confidence: number): 'low' | 'medium' | 'high' {
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.5) return 'medium';
  return 'low';
}

/**
 * Gets trend indicator emoji for visualizing the trend.
 *
 * @param trend - Trend direction
 * @returns Emoji indicator
 */
export function getTrendIndicator(trend: TrendDirection): string {
  const indicators: Record<TrendDirection, string> = {
    accelerating: '📈⚠️',
    increasing: '📈',
    stable: '➡️',
    decreasing: '📉',
    declining: '📉✅',
  };

  return indicators[trend];
}
