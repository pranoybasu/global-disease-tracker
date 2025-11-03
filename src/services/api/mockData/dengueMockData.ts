/**
 * Realistic mock data generator for Dengue Fever
 * 
 * Characteristics:
 * - Endemic in tropical and subtropical regions (Asia, Americas, Pacific)
 * - Transmitted by Aedes mosquitoes, not person-to-person
 * - Higher case rates in Southeast Asia and Latin America
 * - Mortality rate: 0.5-2.5% (severe dengue can be fatal without care)
 * - Recovery rate: 96-99%
 * - Strong seasonal patterns (monsoon/rainy seasons)
 * - Urban disease (mosquitoes breed in standing water)
 */

import type { CountryData } from '../../../types';
import {
  COUNTRY_METADATA,
  createCountryData,
  randomFloatInRange,
  type CountryMetadata,
} from './mockDataUtils';

/**
 * High dengue burden countries (primarily Southeast Asia)
 */
const HIGH_BURDEN_COUNTRIES = new Set([
  'India',
  'Indonesia',
  'Philippines',
  'Bangladesh',
  'Vietnam',
  'Thailand',
  'Sri Lanka',
  'Myanmar',
  'Cambodia',
  'Singapore',
]);

/**
 * Moderate dengue risk countries (Latin America, Caribbean)
 */
const MODERATE_RISK_COUNTRIES = new Set([
  'Brazil',
  'Mexico',
  'Colombia',
  'Peru',
  'Ecuador',
  'Venezuela',
  'Guatemala',
  'Honduras',
  'Nicaragua',
  'Costa Rica',
  'Panama',
  'Paraguay',
]);

/**
 * Check if country is in dengue endemic zone
 * Dengue occurs primarily between 35°N and 35°S
 */
const isInDengueZone = (metadata: CountryMetadata): boolean => {
  const absLat = Math.abs(metadata.lat);
  return absLat < 35;
};

/**
 * Get dengue risk multiplier based on geography
 */
const getDengueRiskMultiplier = (metadata: CountryMetadata): number => {
  // High burden countries (Southeast Asia)
  if (HIGH_BURDEN_COUNTRIES.has(metadata.country)) {
    return randomFloatInRange(10, 20);
  }
  
  // Moderate risk countries (Latin America)
  if (MODERATE_RISK_COUNTRIES.has(metadata.country)) {
    return randomFloatInRange(4, 9);
  }
  
  // Other tropical Asian countries
  if (metadata.continent === 'Asia' && isInDengueZone(metadata)) {
    return randomFloatInRange(2, 6);
  }
  
  // Other tropical American countries
  if (['South America', 'North America'].includes(metadata.continent) && isInDengueZone(metadata)) {
    return randomFloatInRange(1.5, 4);
  }
  
  // Pacific islands and other tropical regions
  if (isInDengueZone(metadata)) {
    return randomFloatInRange(0.8, 2);
  }
  
  // Non-endemic regions: rare imported cases
  return randomFloatInRange(0.001, 0.02);
};

/**
 * Get seasonal multiplier for dengue transmission
 * Peaks during monsoon/rainy seasons
 */
const getSeasonalMultiplier = (metadata: CountryMetadata): number => {
  const currentMonth = new Date().getMonth(); // 0-11
  
  // Only apply seasonal variation in endemic zones
  if (!isInDengueZone(metadata)) {
    return 1.0;
  }
  
  // Southeast Asia: monsoon peaks
  if (HIGH_BURDEN_COUNTRIES.has(metadata.country)) {
    // Peak transmission: Jun-Sep (monsoon season)
    if (currentMonth >= 5 && currentMonth <= 8) {
      return randomFloatInRange(1.6, 2.2);
    }
    // Post-monsoon: Oct-Nov (still elevated)
    if (currentMonth >= 9 && currentMonth <= 10) {
      return randomFloatInRange(1.2, 1.5);
    }
    // Dry season: Dec-May (lower but present)
    return randomFloatInRange(0.6, 0.9);
  }
  
  // Latin America: varies by region
  if (MODERATE_RISK_COUNTRIES.has(metadata.country)) {
    // Northern hemisphere countries: peak May-Oct
    if (metadata.lat > 0) {
      if (currentMonth >= 4 && currentMonth <= 9) {
        return randomFloatInRange(1.5, 2.0);
      }
      return randomFloatInRange(0.5, 0.8);
    }
    // Southern hemisphere: peak Nov-Apr
    else {
      if (currentMonth >= 10 || currentMonth <= 3) {
        return randomFloatInRange(1.5, 2.0);
      }
      return randomFloatInRange(0.5, 0.8);
    }
  }
  
  // Near equator: relatively consistent year-round
  if (Math.abs(metadata.lat) < 10) {
    return randomFloatInRange(0.9, 1.1);
  }
  
  return randomFloatInRange(0.8, 1.2);
};

/**
 * Generate dengue data for a single country
 */
const generateDengueCountryData = (metadata: CountryMetadata): CountryData => {
  const riskMultiplier = getDengueRiskMultiplier(metadata);
  const seasonalMultiplier = getSeasonalMultiplier(metadata);
  
  // Base case rate: 30-300 per 100k
  // Heavily adjusted by risk and season
  const baseCaseRate = randomFloatInRange(30, 300) * riskMultiplier * seasonalMultiplier;
  
  // Mortality rate: 0.5-2.5%
  // Lower with early detection and proper fluid management
  // Higher in areas with limited healthcare
  const hasGoodHealthcare = ['Europe', 'North America', 'Asia'].includes(metadata.continent) &&
    !['Bangladesh', 'Pakistan', 'Philippines'].includes(metadata.country);
  const mortalityRate = hasGoodHealthcare
    ? randomFloatInRange(0.5, 1.2)
    : randomFloatInRange(1.5, 2.5);
  
  // Recovery rate: 96-99%
  const recoveryRate = randomFloatInRange(96, 99);
  
  // Testing rate: clinical diagnosis is common
  // High burden countries have more awareness and testing
  const testingRate = HIGH_BURDEN_COUNTRIES.has(metadata.country)
    ? randomFloatInRange(4, 10)
    : MODERATE_RISK_COUNTRIES.has(metadata.country)
    ? randomFloatInRange(2, 5)
    : randomFloatInRange(0.2, 1);
  
  // Daily change: 0.5-3% (can spike rapidly during outbreaks)
  const dailyChangePercent = randomFloatInRange(0.5, 3) * seasonalMultiplier;

  return createCountryData(metadata, {
    baseCaseRate,
    mortalityRate,
    recoveryRate,
    testingRate,
    dailyChangePercent,
  });
};

/**
 * Generate global dengue statistics
 */
export const generateDengueGlobalData = () => {
  const countries = COUNTRY_METADATA.map(generateDengueCountryData);
  
  const totals = countries.reduce(
    (acc, country) => ({
      cases: acc.cases + country.cases,
      deaths: acc.deaths + country.deaths,
      recovered: acc.recovered + country.recovered,
      active: acc.active + country.active,
    }),
    { cases: 0, deaths: 0, recovered: 0, active: 0 }
  );

  return {
    global: {
      ...totals,
      updated: Date.now(),
    },
    countries,
  };
};

/**
 * Main export: Get current dengue mock data
 */
export const getDengueMockData = () => {
  return generateDengueGlobalData();
};