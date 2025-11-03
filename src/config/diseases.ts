import type { LucideIcon } from 'lucide-react';
import { Activity, Wind, Flame, Bug, Droplet } from 'lucide-react';
import { Disease } from '../types';

/**
 * Disease metadata configuration
 * 
 * This file contains all static configuration for each disease including:
 * - Display names and descriptions
 * - Icon mappings (lucide-react)
 * - Color schemes (Tailwind CSS classes)
 * - Statistical metadata
 */

export interface DiseaseConfig {
  id: Disease;
  name: string;
  description: string;
  icon: LucideIcon;
  colors: {
    primary: string;      // Main brand color
    secondary: string;    // Lighter variant
    marker: string;       // Map marker fill color
    markerBorder: string; // Map marker border color
    text: string;         // Text color on light backgrounds
    bg: string;          // Background color
    bgHover: string;     // Background hover state
  };
  stats: {
    hasRealTimeData: boolean;  // Whether real API data is available
    updateFrequency: string;   // How often data updates
    dataSource: string;        // Primary data source name
  };
}

/**
 * Complete disease configuration map
 * 
 * Each disease has:
 * - Unique visual identity (colors + icon)
 * - Metadata about data availability
 * - Tailwind CSS classes for consistent theming
 */
export const diseaseConfigs: Record<Disease, DiseaseConfig> = {
  [Disease.COVID19]: {
    id: Disease.COVID19,
    name: 'COVID-19',
    description: 'Coronavirus Disease 2019 - A respiratory illness caused by SARS-CoV-2',
    icon: Activity,
    colors: {
      primary: 'rgb(239 68 68)',           // red-500
      secondary: 'rgb(252 165 165)',       // red-300
      marker: 'rgb(239 68 68 / 0.6)',      // red-500 with opacity
      markerBorder: 'rgb(153 27 27)',      // red-900
      text: 'text-red-700',
      bg: 'bg-red-50',
      bgHover: 'hover:bg-red-100',
    },
    stats: {
      hasRealTimeData: true,
      updateFrequency: 'Daily',
      dataSource: 'disease.sh API',
    },
  },

  [Disease.INFLUENZA]: {
    id: Disease.INFLUENZA,
    name: 'Influenza',
    description: 'Seasonal flu - A contagious respiratory illness caused by influenza viruses',
    icon: Wind,
    colors: {
      primary: 'rgb(59 130 246)',          // blue-500
      secondary: 'rgb(147 197 253)',       // blue-300
      marker: 'rgb(59 130 246 / 0.6)',     // blue-500 with opacity
      markerBorder: 'rgb(30 58 138)',      // blue-900
      text: 'text-blue-700',
      bg: 'bg-blue-50',
      bgHover: 'hover:bg-blue-100',
    },
    stats: {
      hasRealTimeData: false,
      updateFrequency: 'Mock Data',
      dataSource: 'Simulated (Placeholder)',
    },
  },

  [Disease.MPOX]: {
    id: Disease.MPOX,
    name: 'Mpox',
    description: 'Monkeypox - A viral disease that causes a rash and flu-like symptoms',
    icon: Flame,
    colors: {
      primary: 'rgb(139 92 246)',          // violet-500
      secondary: 'rgb(196 181 253)',       // violet-300
      marker: 'rgb(139 92 246 / 0.6)',     // violet-500 with opacity
      markerBorder: 'rgb(76 29 149)',      // violet-900
      text: 'text-violet-700',
      bg: 'bg-violet-50',
      bgHover: 'hover:bg-violet-100',
    },
    stats: {
      hasRealTimeData: false,
      updateFrequency: 'Mock Data',
      dataSource: 'Simulated (Placeholder)',
    },
  },

  [Disease.MALARIA]: {
    id: Disease.MALARIA,
    name: 'Malaria',
    description: 'A mosquito-borne disease caused by Plasmodium parasites',
    icon: Bug,
    colors: {
      primary: 'rgb(234 179 8)',           // yellow-500
      secondary: 'rgb(253 224 71)',        // yellow-300
      marker: 'rgb(234 179 8 / 0.6)',      // yellow-500 with opacity
      markerBorder: 'rgb(113 63 18)',      // yellow-900
      text: 'text-yellow-700',
      bg: 'bg-yellow-50',
      bgHover: 'hover:bg-yellow-100',
    },
    stats: {
      hasRealTimeData: false,
      updateFrequency: 'Mock Data',
      dataSource: 'Simulated (Placeholder)',
    },
  },

  [Disease.DENGUE]: {
    id: Disease.DENGUE,
    name: 'Dengue',
    description: 'A mosquito-borne viral infection causing severe flu-like illness',
    icon: Droplet,
    colors: {
      primary: 'rgb(249 115 22)',          // orange-500
      secondary: 'rgb(253 186 116)',       // orange-300
      marker: 'rgb(249 115 22 / 0.6)',     // orange-500 with opacity
      markerBorder: 'rgb(124 45 18)',      // orange-900
      text: 'text-orange-700',
      bg: 'bg-orange-50',
      bgHover: 'hover:bg-orange-100',
    },
    stats: {
      hasRealTimeData: false,
      updateFrequency: 'Mock Data',
      dataSource: 'Simulated (Placeholder)',
    },
  },
};

/**
 * Get disease configuration by ID
 * 
 * @param diseaseId - The disease identifier
 * @returns Disease configuration object
 */
export const getDiseaseConfig = (diseaseId: Disease): DiseaseConfig => {
  return diseaseConfigs[diseaseId];
};

/**
 * Get all disease IDs in display order
 * 
 * @returns Array of disease IDs
 */
export const getAllDiseaseIds = (): Disease[] => {
  return Object.keys(diseaseConfigs) as Disease[];
};

/**
 * Check if a disease has real-time data available
 * 
 * @param diseaseId - The disease identifier
 * @returns True if real-time data is available
 */
export const hasRealTimeData = (diseaseId: Disease): boolean => {
  return diseaseConfigs[diseaseId].stats.hasRealTimeData;
};