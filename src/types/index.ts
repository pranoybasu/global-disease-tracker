/**
 * Core TypeScript type definitions for Global Disease Tracker
 */

export enum Disease {
  COVID19 = 'covid19',
  INFLUENZA = 'influenza',
  MPOX = 'mpox',
}

export interface CountryData {
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
  updated: number;
}

export interface TimelineEntry {
  date: string;
  cases: number;
  deaths: number;
  recovered: number;
}

export interface CountryTimeline {
  country: string;
  province?: string[];
  timeline: {
    cases: Record<string, number>;
    deaths: Record<string, number>;
    recovered: Record<string, number>;
  };
}

export interface MapMarker {
  position: [number, number];
  country: string;
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
  color: string;
  size: number;
}

export interface ContainmentScore {
  score: number; // 0-10 scale
  testingRate: number; // Weighted 30%
  recoveryRate: number; // Weighted 30%
  mortalityRate: number; // Weighted 20% (inverted)
  momentum: number; // Weighted 20%
  breakdown: {
    testing: number;
    recovery: number;
    mortality: number;
    momentum: number;
  };
}

export interface MomentumData {
  oneDayGrowth: number;
  threeDayGrowth: number;
  sevenDayGrowth: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface DiseaseStats {
  disease: Disease;
  global: {
    cases: number;
    deaths: number;
    recovered: number;
    active: number;
    updated: number;
  };
  countries: CountryData[];
  timeline?: CountryTimeline[];
}

export interface AppState {
  selectedDisease: Disease;
  selectedCountry: string | null;
  viewMode: 'current' | 'historical';
  playbackState: 'playing' | 'paused' | 'stopped';
  playbackSpeed: number;
  currentDate: Date;
  mapStyle: 'light' | 'color' | 'dark';
  scaleType: 'linear' | 'logarithmic';
  showMomentum: boolean;
}
