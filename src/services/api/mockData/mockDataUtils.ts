/**
 * Shared utilities for generating realistic mock disease data
 */

import type { CountryData } from '../../../types';

/**
 * Country metadata with realistic geographical and demographic information
 * Used to generate consistent mock data across all diseases
 */
export interface CountryMetadata {
  country: string;
  iso2: string;
  iso3: string;
  lat: number;
  long: number;
  population: number;
  continent: string;
  flag: string;
}

/**
 * Top 50 countries by population with accurate coordinates
 * This provides a realistic baseline for all disease simulations
 */
export const COUNTRY_METADATA: CountryMetadata[] = [
  { country: 'USA', iso2: 'US', iso3: 'USA', lat: 37.0902, long: -95.7129, population: 331002651, continent: 'North America', flag: 'https://disease.sh/assets/img/flags/us.png' },
  { country: 'India', iso2: 'IN', iso3: 'IND', lat: 20.5937, long: 78.9629, population: 1380004385, continent: 'Asia', flag: 'https://disease.sh/assets/img/flags/in.png' },
  { country: 'Brazil', iso2: 'BR', iso3: 'BRA', lat: -14.2350, long: -51.9253, population: 212559417, continent: 'South America', flag: 'https://disease.sh/assets/img/flags/br.png' },
  { country: 'Russia', iso2: 'RU', iso3: 'RUS', lat: 61.5240, long: 105.3188, population: 145934462, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/ru.png' },
  { country: 'UK', iso2: 'GB', iso3: 'GBR', lat: 55.3781, long: -3.4360, population: 67886011, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/gb.png' },
  { country: 'France', iso2: 'FR', iso3: 'FRA', lat: 46.2276, long: 2.2137, population: 65273511, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/fr.png' },
  { country: 'Turkey', iso2: 'TR', iso3: 'TUR', lat: 38.9637, long: 35.2433, population: 84339067, continent: 'Asia', flag: 'https://disease.sh/assets/img/flags/tr.png' },
  { country: 'Italy', iso2: 'IT', iso3: 'ITA', lat: 41.8719, long: 12.5674, population: 60461826, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/it.png' },
  { country: 'Germany', iso2: 'DE', iso3: 'DEU', lat: 51.1657, long: 10.4515, population: 83783942, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/de.png' },
  { country: 'Spain', iso2: 'ES', iso3: 'ESP', lat: 40.4637, long: -3.7492, population: 46754778, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/es.png' },
  { country: 'Argentina', iso2: 'AR', iso3: 'ARG', lat: -38.4161, long: -63.6167, population: 45195774, continent: 'South America', flag: 'https://disease.sh/assets/img/flags/ar.png' },
  { country: 'Colombia', iso2: 'CO', iso3: 'COL', lat: 4.5709, long: -74.2973, population: 50882891, continent: 'South America', flag: 'https://disease.sh/assets/img/flags/co.png' },
  { country: 'Mexico', iso2: 'MX', iso3: 'MEX', lat: 23.6345, long: -102.5528, population: 128932753, continent: 'North America', flag: 'https://disease.sh/assets/img/flags/mx.png' },
  { country: 'Poland', iso2: 'PL', iso3: 'POL', lat: 51.9194, long: 19.1451, population: 37846611, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/pl.png' },
  { country: 'Iran', iso2: 'IR', iso3: 'IRN', lat: 32.4279, long: 53.6880, population: 83992949, continent: 'Asia', flag: 'https://disease.sh/assets/img/flags/ir.png' },
  { country: 'Ukraine', iso2: 'UA', iso3: 'UKR', lat: 48.3794, long: 31.1656, population: 43733762, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/ua.png' },
  { country: 'Peru', iso2: 'PE', iso3: 'PER', lat: -9.1900, long: -75.0152, population: 32971854, continent: 'South America', flag: 'https://disease.sh/assets/img/flags/pe.png' },
  { country: 'Indonesia', iso2: 'ID', iso3: 'IDN', lat: -0.7893, long: 113.9213, population: 273523615, continent: 'Asia', flag: 'https://disease.sh/assets/img/flags/id.png' },
  { country: 'South Africa', iso2: 'ZA', iso3: 'ZAF', lat: -30.5595, long: 22.9375, population: 59308690, continent: 'Africa', flag: 'https://disease.sh/assets/img/flags/za.png' },
  { country: 'Philippines', iso2: 'PH', iso3: 'PHL', lat: 12.8797, long: 121.7740, population: 109581078, continent: 'Asia', flag: 'https://disease.sh/assets/img/flags/ph.png' },
  { country: 'Netherlands', iso2: 'NL', iso3: 'NLD', lat: 52.1326, long: 5.2913, population: 17134872, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/nl.png' },
  { country: 'Belgium', iso2: 'BE', iso3: 'BEL', lat: 50.5039, long: 4.4699, population: 11589623, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/be.png' },
  { country: 'Czechia', iso2: 'CZ', iso3: 'CZE', lat: 49.8175, long: 15.4730, population: 10708981, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/cz.png' },
  { country: 'Chile', iso2: 'CL', iso3: 'CHL', lat: -35.6751, long: -71.5430, population: 19116201, continent: 'South America', flag: 'https://disease.sh/assets/img/flags/cl.png' },
  { country: 'Iraq', iso2: 'IQ', iso3: 'IRQ', lat: 33.2232, long: 43.6793, population: 40222493, continent: 'Asia', flag: 'https://disease.sh/assets/img/flags/iq.png' },
  { country: 'Bangladesh', iso2: 'BD', iso3: 'BGD', lat: 23.6850, long: 90.3563, population: 164689383, continent: 'Asia', flag: 'https://disease.sh/assets/img/flags/bd.png' },
  { country: 'Japan', iso2: 'JP', iso3: 'JPN', lat: 36.2048, long: 138.2529, population: 126476461, continent: 'Asia', flag: 'https://disease.sh/assets/img/flags/jp.png' },
  { country: 'Pakistan', iso2: 'PK', iso3: 'PAK', lat: 30.3753, long: 69.3451, population: 220892340, continent: 'Asia', flag: 'https://disease.sh/assets/img/flags/pk.png' },
  { country: 'Canada', iso2: 'CA', iso3: 'CAN', lat: 56.1304, long: -106.3468, population: 37742154, continent: 'North America', flag: 'https://disease.sh/assets/img/flags/ca.png' },
  { country: 'Romania', iso2: 'RO', iso3: 'ROU', lat: 45.9432, long: 24.9668, population: 19237691, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/ro.png' },
  { country: 'Morocco', iso2: 'MA', iso3: 'MAR', lat: 31.7917, long: -7.0926, population: 36910560, continent: 'Africa', flag: 'https://disease.sh/assets/img/flags/ma.png' },
  { country: 'Portugal', iso2: 'PT', iso3: 'PRT', lat: 39.3999, long: -8.2245, population: 10196709, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/pt.png' },
  { country: 'Israel', iso2: 'IL', iso3: 'ISR', lat: 31.0461, long: 34.8516, population: 8655535, continent: 'Asia', flag: 'https://disease.sh/assets/img/flags/il.png' },
  { country: 'Switzerland', iso2: 'CH', iso3: 'CHE', lat: 46.8182, long: 8.2275, population: 8654622, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/ch.png' },
  { country: 'Austria', iso2: 'AT', iso3: 'AUT', lat: 47.5162, long: 14.5501, population: 9006398, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/at.png' },
  { country: 'Serbia', iso2: 'RS', iso3: 'SRB', lat: 44.0165, long: 21.0059, population: 8737371, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/rs.png' },
  { country: 'Jordan', iso2: 'JO', iso3: 'JOR', lat: 30.5852, long: 36.2384, population: 10203134, continent: 'Asia', flag: 'https://disease.sh/assets/img/flags/jo.png' },
  { country: 'Hungary', iso2: 'HU', iso3: 'HUN', lat: 47.1625, long: 19.5033, population: 9660351, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/hu.png' },
  { country: 'UAE', iso2: 'AE', iso3: 'ARE', lat: 23.4241, long: 53.8478, population: 9890402, continent: 'Asia', flag: 'https://disease.sh/assets/img/flags/ae.png' },
  { country: 'Lebanon', iso2: 'LB', iso3: 'LBN', lat: 33.8547, long: 35.8623, population: 6825445, continent: 'Asia', flag: 'https://disease.sh/assets/img/flags/lb.png' },
  { country: 'Greece', iso2: 'GR', iso3: 'GRC', lat: 39.0742, long: 21.8243, population: 10423054, continent: 'Europe', flag: 'https://disease.sh/assets/img/flags/gr.png' },
  { country: 'Tunisia', iso2: 'TN', iso3: 'TUN', lat: 33.8869, long: 9.5375, population: 11818619, continent: 'Africa', flag: 'https://disease.sh/assets/img/flags/tn.png' },
  { country: 'Bolivia', iso2: 'BO', iso3: 'BOL', lat: -16.2902, long: -63.5887, population: 11673021, continent: 'South America', flag: 'https://disease.sh/assets/img/flags/bo.png' },
  { country: 'Ecuador', iso2: 'EC', iso3: 'ECU', lat: -1.8312, long: -78.1834, population: 17643054, continent: 'South America', flag: 'https://disease.sh/assets/img/flags/ec.png' },
  { country: 'Guatemala', iso2: 'GT', iso3: 'GTM', lat: 15.7835, long: -90.2308, population: 17915568, continent: 'North America', flag: 'https://disease.sh/assets/img/flags/gt.png' },
  { country: 'Costa Rica', iso2: 'CR', iso3: 'CRI', lat: 9.7489, long: -83.7534, population: 5094118, continent: 'North America', flag: 'https://disease.sh/assets/img/flags/cr.png' },
  { country: 'Panama', iso2: 'PA', iso3: 'PAN', lat: 8.5380, long: -80.7821, population: 4314767, continent: 'North America', flag: 'https://disease.sh/assets/img/flags/pa.png' },
  { country: 'Kuwait', iso2: 'KW', iso3: 'KWT', lat: 29.3117, long: 47.4818, population: 4270571, continent: 'Asia', flag: 'https://disease.sh/assets/img/flags/kw.png' },
  { country: 'Uruguay', iso2: 'UY', iso3: 'URY', lat: -32.5228, long: -55.7658, population: 3473730, continent: 'South America', flag: 'https://disease.sh/assets/img/flags/uy.png' },
  { country: 'Paraguay', iso2: 'PY', iso3: 'PRY', lat: -23.4425, long: -58.4438, population: 7132538, continent: 'South America', flag: 'https://disease.sh/assets/img/flags/py.png' },
];

/**
 * Generate random number within a range
 */
export const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate random float within a range
 */
export const randomFloatInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Apply random variation to a base number (±percentage)
 */
export const applyVariation = (base: number, variationPercent: number): number => {
  const variation = base * (variationPercent / 100);
  return Math.floor(base + randomFloatInRange(-variation, variation));
};

/**
 * Generate realistic case distribution based on population
 * Uses power law distribution - larger countries get more cases
 */
export const generateCasesByPopulation = (
  population: number,
  baseCaseRate: number,
  variationPercent: number = 20
): number => {
  const baseCases = Math.floor((population * baseCaseRate) / 100000);
  return Math.max(0, applyVariation(baseCases, variationPercent));
};

/**
 * Generate realistic death count based on mortality rate
 */
export const generateDeaths = (
  cases: number,
  mortalityRate: number,
  variationPercent: number = 15
): number => {
  const baseDeaths = Math.floor(cases * (mortalityRate / 100));
  return Math.max(0, applyVariation(baseDeaths, variationPercent));
};

/**
 * Generate realistic recovery count based on recovery rate
 */
export const generateRecovered = (
  cases: number,
  deaths: number,
  recoveryRate: number,
  variationPercent: number = 10
): number => {
  const eligibleForRecovery = cases - deaths;
  const baseRecovered = Math.floor(eligibleForRecovery * (recoveryRate / 100));
  return Math.max(0, applyVariation(baseRecovered, variationPercent));
};

/**
 * Generate realistic testing numbers
 */
export const generateTests = (
  population: number,
  testingRate: number,
  variationPercent: number = 25
): number => {
  const baseTests = Math.floor((population * testingRate) / 100);
  return Math.max(0, applyVariation(baseTests, variationPercent));
};

/**
 * Generate today's statistics (daily changes)
 */
export const generateTodayStats = (total: number, dailyChangePercent: number): number => {
  return Math.max(0, Math.floor(total * (dailyChangePercent / 100)));
};

/**
 * Create a complete CountryData object from metadata and disease parameters
 */
export const createCountryData = (
  metadata: CountryMetadata,
  params: {
    baseCaseRate: number;
    mortalityRate: number;
    recoveryRate: number;
    testingRate: number;
    dailyChangePercent: number;
  }
): CountryData => {
  const cases = generateCasesByPopulation(metadata.population, params.baseCaseRate);
  const deaths = generateDeaths(cases, params.mortalityRate);
  const recovered = generateRecovered(cases, deaths, params.recoveryRate);
  const active = Math.max(0, cases - deaths - recovered);
  const critical = Math.floor(active * randomFloatInRange(0.02, 0.08));
  const tests = generateTests(metadata.population, params.testingRate);

  const todayCases = generateTodayStats(cases, params.dailyChangePercent);
  const todayDeaths = generateTodayStats(deaths, params.dailyChangePercent * 0.8);
  const todayRecovered = generateTodayStats(recovered, params.dailyChangePercent * 1.2);

  return {
    country: metadata.country,
    countryInfo: {
      _id: randomInRange(1, 1000),
      iso2: metadata.iso2,
      iso3: metadata.iso3,
      lat: metadata.lat,
      long: metadata.long,
      flag: metadata.flag,
    },
    cases,
    todayCases,
    deaths,
    todayDeaths,
    recovered,
    todayRecovered,
    active,
    critical,
    casesPerOneMillion: Math.floor((cases / metadata.population) * 1000000),
    deathsPerOneMillion: Math.floor((deaths / metadata.population) * 1000000),
    tests,
    testsPerOneMillion: Math.floor((tests / metadata.population) * 1000000),
    population: metadata.population,
    continent: metadata.continent,
    oneCasePerPeople: cases > 0 ? Math.floor(metadata.population / cases) : 0,
    oneDeathPerPeople: deaths > 0 ? Math.floor(metadata.population / deaths) : 0,
    oneTestPerPeople: tests > 0 ? Math.floor(metadata.population / tests) : 0,
    updated: Date.now(),
  };
};