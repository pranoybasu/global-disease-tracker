/**
 * Containment Score Algorithm
 *
 * This algorithm calculates a containment score (0-10) based on the weighted growth rate
 * of COVID-19 cases over different time periods. The score indicates how well a location
 * is containing the spread of the disease.
 *
 * Score Interpretation:
 * - 10: Excellent containment (growth < 0.1% weighted)
 * - 9: Very good containment (growth < 0.2% weighted)
 * - 8: Good containment (growth < 0.5% weighted)
 * - 7: Moderate containment (growth < 1% weighted)
 * - 6: Fair containment (growth < 2% weighted)
 * - 5: Declining containment (growth < 5% weighted)
 * - 4: Poor containment (growth < 10% weighted)
 * - 3: Very poor containment (growth < 20% weighted)
 * - 2: Critical containment (growth < 50% weighted)
 * - 1: Severe outbreak (growth < 100% weighted)
 * - 0: Exponential outbreak (growth >= 100% weighted)
 *
 * @module containmentScore
 * @see Original implementation: coronavirus19stats/src/datasource/JHDatasourceProvider.js (lines 309-350)
 */

/**
 * Input data structure for containment score calculation
 */
export interface ContainmentScoreInput {
  /** Current total confirmed cases */
  currentConfirmed: number;
  /** Growth in confirmed cases over last 1 day */
  growthLast1Day: number;
  /** Growth in confirmed cases over last 3 days */
  growthLast3Days: number;
  /** Growth in confirmed cases over last 7 days */
  growthLast7Days: number;
}

/**
 * Result of containment score calculation
 */
export interface ContainmentScoreResult {
  /** Containment score from 0 (worst) to 10 (best) */
  score: number;
  /** Weighted growth rate (0.0 to 1.0+) */
  weightedGrowthRate: number;
  /** Individual growth rates for transparency */
  breakdown: {
    /** 1-day growth rate (10% weight) */
    rate1Day: number;
    /** 3-day growth rate (30% weight) */
    rate3Day: number;
    /** 7-day growth rate (60% weight) */
    rate7Day: number;
  };
}

/**
 * Calculates the containment score for a location based on weighted growth rates.
 *
 * The algorithm uses a weighted average of growth rates over different time periods:
 * - 1-day growth: 10% weight (recent spike detection)
 * - 3-day growth: 30% weight (short-term trend)
 * - 7-day growth: 60% weight (medium-term trend, most important)
 *
 * This weighting emphasizes sustained trends over short-term fluctuations.
 *
 * @param input - Growth data for the location
 * @returns Containment score and detailed breakdown
 *
 * @example
 * ```typescript
 * const result = calculateContainmentScore({
 *   currentConfirmed: 10000,
 *   growthLast1Day: 50,
 *   growthLast3Days: 180,
 *   growthLast7Days: 500
 * });
 * console.log(result.score); // 5
 * console.log(result.weightedGrowthRate); // 0.047 (4.7% weighted growth)
 * ```
 */
export function calculateContainmentScore(input: ContainmentScoreInput): ContainmentScoreResult {
  const { currentConfirmed, growthLast1Day, growthLast3Days, growthLast7Days } = input;

  // Avoid division by zero - if no cases, return perfect score
  if (currentConfirmed <= 0) {
    return {
      score: 10,
      weightedGrowthRate: 0,
      breakdown: {
        rate1Day: 0,
        rate3Day: 0,
        rate7Day: 0,
      },
    };
  }

  // Calculate individual growth rates
  const rate1Day = growthLast1Day / currentConfirmed;
  const rate3Day = growthLast3Days / currentConfirmed;
  const rate7Day = growthLast7Days / currentConfirmed;

  // Apply weights: 10% for 1-day, 30% for 3-day, 60% for 7-day
  const g1 = 0.1 * rate1Day;
  const g3 = 0.3 * rate3Day;
  const g7 = 0.6 * rate7Day;

  // Calculate weighted growth rate
  const weightedGrowthRate = g1 + g3 + g7;

  // Determine score based on weighted growth rate thresholds
  let score: number;

  if (weightedGrowthRate >= 1.0) {
    score = 0; // Exponential outbreak (100%+ weighted growth)
  } else if (weightedGrowthRate >= 0.5) {
    score = 1; // Severe outbreak (50-100% weighted growth)
  } else if (weightedGrowthRate >= 0.2) {
    score = 2; // Critical containment (20-50% weighted growth)
  } else if (weightedGrowthRate >= 0.1) {
    score = 3; // Very poor containment (10-20% weighted growth)
  } else if (weightedGrowthRate >= 0.05) {
    score = 4; // Poor containment (5-10% weighted growth)
  } else if (weightedGrowthRate >= 0.02) {
    score = 5; // Declining containment (2-5% weighted growth)
  } else if (weightedGrowthRate >= 0.01) {
    score = 6; // Fair containment (1-2% weighted growth)
  } else if (weightedGrowthRate >= 0.005) {
    score = 7; // Moderate containment (0.5-1% weighted growth)
  } else if (weightedGrowthRate >= 0.002) {
    score = 8; // Good containment (0.2-0.5% weighted growth)
  } else if (weightedGrowthRate >= 0.001) {
    score = 9; // Very good containment (0.1-0.2% weighted growth)
  } else {
    score = 10; // Excellent containment (< 0.1% weighted growth)
  }

  return {
    score,
    weightedGrowthRate,
    breakdown: {
      rate1Day,
      rate3Day,
      rate7Day,
    },
  };
}

/**
 * Gets a human-readable description of a containment score.
 *
 * @param score - Containment score (0-10)
 * @returns Description of what the score means
 *
 * @example
 * ```typescript
 * getContainmentScoreDescription(8); // "Good containment"
 * getContainmentScoreDescription(2); // "Critical containment"
 * ```
 */
export function getContainmentScoreDescription(score: number): string {
  const descriptions: Record<number, string> = {
    10: 'Excellent containment',
    9: 'Very good containment',
    8: 'Good containment',
    7: 'Moderate containment',
    6: 'Fair containment',
    5: 'Declining containment',
    4: 'Poor containment',
    3: 'Very poor containment',
    2: 'Critical containment',
    1: 'Severe outbreak',
    0: 'Exponential outbreak',
  };

  return descriptions[score] || 'Unknown';
}

/**
 * Gets a color code for visualizing containment score.
 *
 * @param score - Containment score (0-10)
 * @returns Hex color code
 *
 * @example
 * ```typescript
 * getContainmentScoreColor(10); // "#22c55e" (green)
 * getContainmentScoreColor(0); // "#ef4444" (red)
 * ```
 */
export function getContainmentScoreColor(score: number): string {
  // Green (excellent) to red (exponential outbreak)
  if (score >= 8) return '#22c55e'; // green-500
  if (score >= 6) return '#84cc16'; // lime-500
  if (score >= 4) return '#eab308'; // yellow-500
  if (score >= 2) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
}
