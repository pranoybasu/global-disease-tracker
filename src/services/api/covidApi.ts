/**
 * COVID-19 API endpoints using disease.sh
 * Documentation: https://disease.sh/docs/
 */

import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { diseaseShApiClient } from './apiClient';
import { queryKeys } from './queryClient';
import type { CountryData, TimelineEntry, GlobalStats } from '@/types';

// API Response types (disease.sh specific)
interface DiseaseShCountryResponse {
  updated: number;
  country: string;
  countryInfo: {
    _id: number;
    iso2: string;
    iso3: string;
    lat: number;
    long: number;
    flag: string;
  };
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
  continent: string;
  oneCasePerPeople: number;
  oneDeathPerPeople: number;
  oneTestPerPeople: number;
  activePerOneMillion: number;
  recoveredPerOneMillion: number;
  criticalPerOneMillion: number;
}

interface DiseaseShHistoricalResponse {
  country: string;
  province?: string[];
  timeline: {
    cases: Record<string, number>;
    deaths: Record<string, number>;
    recovered: Record<string, number>;
  };
}

interface DiseaseShGlobalResponse {
  updated: number;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
  oneCasePerPeople: number;
  oneDeathPerPeople: number;
  oneTestPerPeople: number;
  activePerOneMillion: number;
  recoveredPerOneMillion: number;
  criticalPerOneMillion: number;
  affectedCountries: number;
}

// Transform functions to convert disease.sh responses to our internal types
function transformCountryData(data: DiseaseShCountryResponse): CountryData {
  return {
    country: data.country,
    countryInfo: data.countryInfo,
    cases: data.cases,
    todayCases: data.todayCases,
    deaths: data.deaths,
    todayDeaths: data.todayDeaths,
    recovered: data.recovered,
    todayRecovered: data.todayRecovered,
    active: data.active,
    critical: data.critical,
    casesPerOneMillion: data.casesPerOneMillion,
    deathsPerOneMillion: data.deathsPerOneMillion,
    tests: data.tests,
    testsPerOneMillion: data.testsPerOneMillion,
    population: data.population,
    continent: data.continent,
    oneCasePerPeople: data.oneCasePerPeople,
    oneDeathPerPeople: data.oneDeathPerPeople,
    oneTestPerPeople: data.oneTestPerPeople,
    updated: data.updated,
  };
}

function transformHistoricalData(data: DiseaseShHistoricalResponse): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const dates = Object.keys(data.timeline.cases);

  dates.forEach((date) => {
    entries.push({
      date: date,
      cases: data.timeline.cases[date] || 0,
      deaths: data.timeline.deaths[date] || 0,
      recovered: data.timeline.recovered[date] || 0,
    });
  });

  return entries;
}

// API Functions

/**
 * Fetch global COVID-19 statistics
 * Standalone export for use by diseaseApi adapter
 */
export async function fetchGlobalStats(): Promise<GlobalStats> {
  const data = await diseaseShApiClient.get<DiseaseShGlobalResponse>('/all');

  return {
    cases: data.cases,
    todayCases: data.todayCases,
    deaths: data.deaths,
    todayDeaths: data.todayDeaths,
    recovered: data.recovered,
    todayRecovered: data.todayRecovered,
    active: data.active,
    critical: data.critical,
    tests: data.tests,
    affected: data.affectedCountries,
    casesPerOneMillion: data.casesPerOneMillion,
    deathsPerOneMillion: data.deathsPerOneMillion,
    testsPerOneMillion: data.testsPerOneMillion,
    population: data.population,
    updated: data.updated,
  };
}

/**
 * Fetch COVID-19 statistics for all countries
 * Standalone export for use by diseaseApi adapter
 * @param sort - Field to sort by (e.g., 'cases', 'deaths', 'recovered')
 */
export async function fetchCountriesData(sort?: string): Promise<CountryData[]> {
  const params = sort ? { sort } : undefined;
  const data = await diseaseShApiClient.get<DiseaseShCountryResponse[]>('/countries', { params });

  return data.map(transformCountryData);
}

export const covidApi = {
  /**
   * Fetch global COVID-19 statistics
   */
  getGlobalStats: fetchGlobalStats,

  /**
   * Fetch COVID-19 statistics for all countries
   * @param sort - Field to sort by (e.g., 'cases', 'deaths', 'recovered')
   */
  getAllCountries: fetchCountriesData,

  /**
   * Fetch COVID-19 statistics for a specific country
   * @param country - Country name, ISO2, or ISO3 code
   */
  async getCountry(country: string): Promise<CountryData> {
    const data = await diseaseShApiClient.get<DiseaseShCountryResponse>(`/countries/${country}`);

    return transformCountryData(data);
  },

  /**
   * Fetch historical COVID-19 data for all countries
   * @param days - Number of days to fetch (default: 30, 'all' for full history)
   */
  async getHistoricalAll(days: number | 'all' = 30): Promise<TimelineEntry[]> {
    const params = { lastdays: days };
    const data = await diseaseShApiClient.get<DiseaseShHistoricalResponse>('/historical/all', {
      params,
    });

    return transformHistoricalData(data);
  },

  /**
   * Fetch historical COVID-19 data for a specific country
   * @param country - Country name, ISO2, or ISO3 code
   * @param days - Number of days to fetch (default: 30, 'all' for full history)
   */
  async getHistoricalCountry(country: string, days: number | 'all' = 30): Promise<TimelineEntry[]> {
    const params = { lastdays: days };
    const data = await diseaseShApiClient.get<DiseaseShHistoricalResponse>(
      `/historical/${country}`,
      { params }
    );

    return transformHistoricalData(data);
  },

  /**
   * Fetch historical COVID-19 data for multiple countries
   * @param countries - Array of country names/codes
   * @param days - Number of days to fetch (default: 30, 'all' for full history)
   */
  async getHistoricalCountries(
    countries: string[],
    days: number | 'all' = 30
  ): Promise<Record<string, TimelineEntry[]>> {
    const params = { lastdays: days };
    const data = await diseaseShApiClient.get<DiseaseShHistoricalResponse[]>(
      `/historical/${countries.join(',')}`,
      { params }
    );

    const result: Record<string, TimelineEntry[]> = {};
    data.forEach((countryData) => {
      result[countryData.country] = transformHistoricalData(countryData);
    });

    return result;
  },
};

// React Query Hooks
/**
 * Hook to fetch global COVID-19 statistics
 */
export function useGlobalCovidStats(): UseQueryResult<GlobalStats, Error> {
  return useQuery({
    queryKey: queryKeys.covid.global(),
    queryFn: () => covidApi.getGlobalStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch COVID-19 statistics for all countries
 */
export function useAllCountriesCovidStats(sort?: string): UseQueryResult<CountryData[], Error> {
  return useQuery({
    queryKey: [...queryKeys.covid.countries(), sort],
    queryFn: () => covidApi.getAllCountries(sort),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch COVID-19 statistics for a specific country
 */
export function useCountryCovidStats(country: string): UseQueryResult<CountryData, Error> {
  return useQuery({
    queryKey: queryKeys.covid.country(country),
    queryFn: () => covidApi.getCountry(country),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!country, // Only fetch if country is provided
  });
}

/**
 * Hook to fetch historical COVID-19 data for all countries
 */
export function useHistoricalCovidAll(
  days: number | 'all' = 30
): UseQueryResult<TimelineEntry[], Error> {
  return useQuery({
    queryKey: queryKeys.covid.historical.global(typeof days === 'number' ? days : undefined),
    queryFn: () => covidApi.getHistoricalAll(days),
    staleTime: 30 * 60 * 1000, // 30 minutes (historical data changes less frequently)
  });
}

/**
 * Hook to fetch historical COVID-19 data for a specific country
 */
export function useHistoricalCovidCountry(
  country: string,
  days: number | 'all' = 30
): UseQueryResult<TimelineEntry[], Error> {
  return useQuery({
    queryKey: queryKeys.covid.historical.country(
      country,
      typeof days === 'number' ? days : undefined
    ),
    queryFn: () => covidApi.getHistoricalCountry(country, days),
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!country,
  });
}
