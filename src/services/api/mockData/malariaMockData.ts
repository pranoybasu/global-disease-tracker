/**
 * Realistic mock data generator for Malaria
 * 
 * Characteristics:
 * - Endemic in tropical and subtropical regions
 * - Highest burden in Sub-Saharan Africa (>90% of cases)
 * - Transmitted by mosquitoes, not person-to-person
 * - Mortality rate: 0.3-2% (higher without treatment)
 * - Recovery rate: 95-99% with treatment
 * - Climate-dependent (requires mosquito breeding conditions)
 * - Seasonal patterns based on rainfall
 */

import type { CountryData } from '../../../types';
import {
  COUNTRY_METADATA,
  createCountryData,
  randomFloatInRange,
  type CountryMetadata,
} from './mockDataUtils';

/**
 * High-burden malaria countries (primarily Sub-Saharan Africa)
 */
const HIGH_BURDEN_COUNTRIES = new Set([
  'Nigeria',
  'Democratic Republic of the Congo',
  'Tanzania',
  'Mozambique',
  'Niger',
  'Burkina Faso',
  'Mali',
  'Angola',
  'Uganda',
  'Malawi',
]);

/**
 * Moderate malaria risk countries
 */
const MODERATE_RISK_COUNTRIES = new Set([
  'India',
  'Indonesia',
  'Pakistan',
  'Bangladesh',
  'Philippines',
  'Brazil',
  'Colombia',
  'Peru',
  'Bolivia',
  'Ecuador',
  'Guatemala',
]);

/**
 * Check if country is in tropical/subtropical zone (malaria endemic zone)
 */
const isInMalariaZone = (metadata: CountryMetadata): boolean => {
  const absLat = Math.abs(metadata.lat);
  // Malaria typically occurs between 30°N and 30°S
  return absLat < 30;
};

/**
 * Get malaria risk multiplier based on geography and climate
 */
const getMalariaRiskMultiplier = (metadata: CountryMetadata): number => {
  // High burden countries (mostly Sub-Saharan Africa)
  if (HIGH_BURDEN_COUNTRIES.has(metadata.country)) {
    return randomFloatInRange(15, 30);
  }
  
  // Moderate risk countries
  if (MODERATE_RISK_COUNTRIES.has(metadata.country)) {
    return randomFloatInRange(3, 8);
  }
  
  // Other African countries still have elevated risk
  if (metadata.continent === 'Africa' && isInMalariaZone(metadata)) {
    return randomFloatInRange(5, 12);
  }
  
  // Other tropical/subtropical countries
  if (isInMalariaZone(metadata)) {
    // South America, Southeast Asia
    if (['South America', 'Asia'].includes(metadata.continent)) {
      return randomFloatInRange(1, 4);
    }
    return randomFloatInRange(0.2, 1);
  }
  
  // Non-endemic regions: essentially zero (imported cases only)
  return randomFloatInRange(0.001, 0.01);
};

/**
 * Get seasonal multiplier for malaria transmission
 * Peaks during and after rainy seasons
 */
const getSeasonalMultiplier = (metadata: CountryMetadata): number => {
  const currentMonth = new Date().getMonth(); // 0-11
  const absLat = Math.abs(metadata.lat);
  
  // Only apply seasonal variation in endemic zones
  if (!isInMalariaZone(metadata)) {
    return 1.0;
  }
  
  // Near equator (within 10 degrees): year-round transmission
  if (absLat < 10) {
    return randomFloatInRange(0.9, 1.1);
  }
  
  // Northern tropical regions: peak Jun-Oct (rainy season)
  if (metadata.lat > 10) {
    if (currentMonth >= 5 && currentMonth <= 9) {
      return randomFloatInRange(1.4, 1.8);
    }
    return randomFloatInRange(0.7, 1.0);
  }
  
  // Southern tropical regions: peak Nov-Mar (rainy season)
  if (metadata.lat < -10) {
    if (currentMonth >= 10 || currentMonth <= 2) {
      return randomFloatInRange(1.4, 1.8);
    }
    return randomFloatInRange(0.7, 1.0);
  }
  
  return 1.0;
};

/**
 * Generate malaria data for a single country
 */
const generateMalariaCountryData = (metadata: CountryMetadata): CountryData => {
  const riskMultiplier = getMalariaRiskMultiplier(metadata);
  const seasonalMultiplier = getSeasonalMultiplier(metadata);
  
  // Base case rate: 50-500 per 100k
  // Heavily adjusted by risk and season
  const baseCaseRate = randomFloatInRange(50, 500) * riskMultiplier * seasonalMultiplier;
  
  // Mortality rate: 0.3-2%
  // Higher in areas with limited healthcare access
  const hasGoodHealthcare = ['Europe', 'North America'].includes(metadata.continent);
  const mortalityRate = hasGoodHealthcare
    ? randomFloatInRange(0.3, 0.8)
    : HIGH_BURDEN_COUNTRIES.has(metadata.country)
    ? randomFloatInRange(1.2, 2)
    : randomFloatInRange(0.5, 1.5);
  
  // Recovery rate: 95-99% (very high with treatment)
  const recoveryRate = randomFloatInRange(95, 99);
  
  // Testing rate: varies significantly
  // Endemic countries test more due to clinical suspicion
  const testingRate = HIGH_BURDEN_COUNTRIES.has(metadata.country)
    ? randomFloatInRange(3, 8)
    : MODERATE_RISK_COUNTRIES.has(metadata.country)
    ? randomFloatInRange(1, 3)
    : randomFloatInRange(0.1, 0.5);
  
  // Daily change: 0.4-2% (depends on season)
  const dailyChangePercent = randomFloatInRange(0.4, 2) * seasonalMultiplier;

  return createCountryData(metadata, {
    baseCaseRate,
    mortalityRate,
    recoveryRate,
    testingRate,
    dailyChangePercent,
  });
};

/**
 * Generate global malaria statistics
 */
export const generateMalariaGlobalData = () => {
  const countries = COUNTRY_METADATA.map(generateMalariaCountryData);
  
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
 * Main export: Get current malaria mock data
 */
export const getMalariaMockData = () => {
  return generateMalariaGlobalData();
};