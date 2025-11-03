/**
 * Realistic mock data generator for Influenza (Seasonal Flu)
 * 
 * Characteristics:
 * - Global seasonal disease with peaks in winter months
 * - Northern hemisphere: peaks Nov-Mar
 * - Southern hemisphere: peaks May-Sep
 * - Higher case rates in temperate regions
 * - Moderate mortality rate (0.1-0.5%)
 * - High testing rates in developed countries
 * - Very high recovery rate (99%+)
 */

import type { CountryData } from '../../../types';
import {
  COUNTRY_METADATA,
  createCountryData,
  randomFloatInRange,
  type CountryMetadata,
} from './mockDataUtils';

/**
 * Determine if a country is in Northern hemisphere based on latitude
 */
const isNorthernHemisphere = (lat: number): boolean => lat > 0;

/**
 * Get seasonal multiplier based on hemisphere and current month
 * Simulates higher flu activity during winter months
 */
const getSeasonalMultiplier = (metadata: CountryMetadata): number => {
  const currentMonth = new Date().getMonth(); // 0-11
  const isNorthern = isNorthernHemisphere(metadata.lat);

  // Northern hemisphere: peak in Dec-Feb (months 11, 0, 1)
  // Southern hemisphere: peak in Jun-Aug (months 5, 6, 7)
  if (isNorthern) {
    if (currentMonth >= 10 || currentMonth <= 2) {
      return randomFloatInRange(1.5, 2.5); // Peak season
    } else if (currentMonth >= 3 && currentMonth <= 5) {
      return randomFloatInRange(0.3, 0.6); // Off season
    }
    return randomFloatInRange(0.7, 1.2); // Moderate season
  } else {
    if (currentMonth >= 5 && currentMonth <= 8) {
      return randomFloatInRange(1.5, 2.5); // Peak season
    } else if (currentMonth >= 11 || currentMonth <= 1) {
      return randomFloatInRange(0.3, 0.6); // Off season
    }
    return randomFloatInRange(0.7, 1.2); // Moderate season
  }
};

/**
 * Get climate-based multiplier for influenza spread
 * Temperate climates have higher flu activity
 */
const getClimateMultiplier = (metadata: CountryMetadata): number => {
  const absLat = Math.abs(metadata.lat);
  
  // Temperate zones (30-60 degrees): highest activity
  if (absLat >= 30 && absLat <= 60) {
    return randomFloatInRange(1.3, 1.8);
  }
  // Tropical zones (0-30 degrees): moderate activity
  else if (absLat < 30) {
    return randomFloatInRange(0.8, 1.2);
  }
  // Polar zones (60+ degrees): lower activity but can spike
  return randomFloatInRange(0.6, 1.0);
};

/**
 * Generate influenza data for a single country
 */
const generateInfluenzaCountryData = (metadata: CountryMetadata): CountryData => {
  const seasonalMultiplier = getSeasonalMultiplier(metadata);
  const climateMultiplier = getClimateMultiplier(metadata);
  
  // Base case rate: 200-800 per 100k (adjusted by season and climate)
  const baseCaseRate = randomFloatInRange(200, 800) * seasonalMultiplier * climateMultiplier;
  
  // Mortality rate: 0.1-0.5% (lower for younger populations, higher for elderly)
  const mortalityRate = randomFloatInRange(0.1, 0.5);
  
  // Recovery rate: 98-99.5% (very high)
  const recoveryRate = randomFloatInRange(98, 99.5);
  
  // Testing rate: varies by healthcare infrastructure
  // Developed countries: 5-15%, developing: 1-5%
  const isDeveloped = ['Europe', 'North America'].includes(metadata.continent);
  const testingRate = isDeveloped 
    ? randomFloatInRange(5, 15) 
    : randomFloatInRange(1, 5);
  
  // Daily change: 0.5-3% (seasonal flu spreads steadily)
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
 * Generate global influenza statistics
 */
export const generateInfluenzaGlobalData = () => {
  const countries = COUNTRY_METADATA.map(generateInfluenzaCountryData);
  
  const totals = countries.reduce(
    (acc, country) => ({
      cases: acc.cases + country.cases,
      todayCases: acc.todayCases + country.todayCases,
      deaths: acc.deaths + country.deaths,
      todayDeaths: acc.todayDeaths + country.todayDeaths,
      recovered: acc.recovered + country.recovered,
      todayRecovered: acc.todayRecovered + country.todayRecovered,
      active: acc.active + country.active,
      critical: acc.critical + country.critical,
      tests: acc.tests + country.tests,
      population: acc.population + country.population,
      affected: acc.affected + 1,
    }),
    {
      cases: 0,
      todayCases: 0,
      deaths: 0,
      todayDeaths: 0,
      recovered: 0,
      todayRecovered: 0,
      active: 0,
      critical: 0,
      tests: 0,
      population: 0,
      affected: 0,
    }
  );

  // Calculate per million metrics
  const casesPerOneMillion = (totals.cases / totals.population) * 1_000_000;
  const deathsPerOneMillion = (totals.deaths / totals.population) * 1_000_000;
  const testsPerOneMillion = (totals.tests / totals.population) * 1_000_000;

  return {
    global: {
      cases: totals.cases,
      todayCases: totals.todayCases,
      deaths: totals.deaths,
      todayDeaths: totals.todayDeaths,
      recovered: totals.recovered,
      todayRecovered: totals.todayRecovered,
      active: totals.active,
      critical: totals.critical,
      tests: totals.tests,
      affected: totals.affected,
      casesPerOneMillion,
      deathsPerOneMillion,
      testsPerOneMillion,
      population: totals.population,
      updated: Date.now(),
    },
    countries,
  };
};

/**
 * Main export: Get current influenza mock data
 */
export const getInfluenzaMockData = () => {
  return generateInfluenzaGlobalData();
};