/**
 * Metric Distribution Chart Component
 *
 * Displays a pie chart showing the distribution of a selected metric by continent.
 * Uses Recharts library for data visualization.
 *
 * Features:
 * - Groups country data by continent
 * - Interactive pie chart with legend
 * - Disease-aware color theming
 * - Responsive design
 * - Custom tooltips with percentages
 * - Number formatting
 */

import { useMemo, useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { CountryData } from '@/types';

interface MetricDistributionChartProps {
  data: CountryData[];
  metric: 'cases' | 'deaths' | 'recovered' | 'active' | 'todayCases' | 'todayDeaths';
  metricLabel: string;
  diseaseColors: {
    primary: string;
    secondary: string;
  };
}

// Continent color palette - vibrant and accessible
const CONTINENT_COLORS = {
  Asia: '#3B82F6', // Blue
  Europe: '#8B5CF6', // Purple
  'North America': '#10B981', // Green
  'South America': '#F59E0B', // Amber
  Africa: '#EF4444', // Red
  Oceania: '#06B6D4', // Cyan
  Unknown: '#6B7280', // Gray
};

// Mapping of countries to continents
const CONTINENT_MAP: Record<string, string> = {
  // Asia
  Afghanistan: 'Asia',
  Armenia: 'Asia',
  Azerbaijan: 'Asia',
  Bahrain: 'Asia',
  Bangladesh: 'Asia',
  Bhutan: 'Asia',
  Brunei: 'Asia',
  Cambodia: 'Asia',
  China: 'Asia',
  Georgia: 'Asia',
  India: 'Asia',
  Indonesia: 'Asia',
  Iran: 'Asia',
  Iraq: 'Asia',
  Israel: 'Asia',
  Japan: 'Asia',
  Jordan: 'Asia',
  Kazakhstan: 'Asia',
  Kuwait: 'Asia',
  Kyrgyzstan: 'Asia',
  Laos: 'Asia',
  Lebanon: 'Asia',
  Malaysia: 'Asia',
  Maldives: 'Asia',
  Mongolia: 'Asia',
  Myanmar: 'Asia',
  Nepal: 'Asia',
  'North Korea': 'Asia',
  Oman: 'Asia',
  Pakistan: 'Asia',
  'State of Palestine': 'Asia',
  Palestine: 'Asia',
  Philippines: 'Asia',
  Qatar: 'Asia',
  'S. Korea': 'Asia',
  'South Korea': 'Asia',
  'Saudi Arabia': 'Asia',
  Singapore: 'Asia',
  'Sri Lanka': 'Asia',
  Syria: 'Asia',
  Taiwan: 'Asia',
  Tajikistan: 'Asia',
  Thailand: 'Asia',
  Timor: 'Asia',
  'Timor-Leste': 'Asia',
  Turkey: 'Asia',
  Turkmenistan: 'Asia',
  UAE: 'Asia',
  Uzbekistan: 'Asia',
  Vietnam: 'Asia',
  Yemen: 'Asia',
  
  // Europe
  Albania: 'Europe',
  Andorra: 'Europe',
  Austria: 'Europe',
  Belarus: 'Europe',
  Belgium: 'Europe',
  'Bosnia and Herzegovina': 'Europe',
  Bulgaria: 'Europe',
  'Channel Islands': 'Europe',
  Croatia: 'Europe',
  Cyprus: 'Europe',
  Czechia: 'Europe',
  'Czech Republic': 'Europe',
  Denmark: 'Europe',
  Estonia: 'Europe',
  'Faeroe Islands': 'Europe',
  Finland: 'Europe',
  France: 'Europe',
  Germany: 'Europe',
  Gibraltar: 'Europe',
  Greece: 'Europe',
  'Holy See': 'Europe',
  Hungary: 'Europe',
  Iceland: 'Europe',
  Ireland: 'Europe',
  'Isle of Man': 'Europe',
  Italy: 'Europe',
  Kosovo: 'Europe',
  Latvia: 'Europe',
  Liechtenstein: 'Europe',
  Lithuania: 'Europe',
  Luxembourg: 'Europe',
  Macedonia: 'Europe',
  Malta: 'Europe',
  Moldova: 'Europe',
  Monaco: 'Europe',
  Montenegro: 'Europe',
  Netherlands: 'Europe',
  Norway: 'Europe',
  Poland: 'Europe',
  Portugal: 'Europe',
  Romania: 'Europe',
  Russia: 'Europe',
  'San Marino': 'Europe',
  Serbia: 'Europe',
  Slovakia: 'Europe',
  Slovenia: 'Europe',
  Spain: 'Europe',
  Sweden: 'Europe',
  Switzerland: 'Europe',
  Ukraine: 'Europe',
  UK: 'Europe',
  'United Kingdom': 'Europe',
  'Vatican City': 'Europe',
  
  // North America
  'Antigua and Barbuda': 'North America',
  Bahamas: 'North America',
  Barbados: 'North America',
  Belize: 'North America',
  Canada: 'North America',
  'Costa Rica': 'North America',
  Cuba: 'North America',
  Dominica: 'North America',
  'Dominican Republic': 'North America',
  'El Salvador': 'North America',
  Grenada: 'North America',
  Guatemala: 'North America',
  Haiti: 'North America',
  Honduras: 'North America',
  Jamaica: 'North America',
  Mexico: 'North America',
  Nicaragua: 'North America',
  Panama: 'North America',
  'Saint Kitts and Nevis': 'North America',
  'Saint Lucia': 'North America',
  'Saint Vincent and the Grenadines': 'North America',
  'Trinidad and Tobago': 'North America',
  USA: 'North America',
  US: 'North America',
  'United States': 'North America',
  
  // South America
  Argentina: 'South America',
  Bolivia: 'South America',
  Brazil: 'South America',
  Chile: 'South America',
  Colombia: 'South America',
  Ecuador: 'South America',
  'French Guiana': 'South America',
  Guyana: 'South America',
  Paraguay: 'South America',
  Peru: 'South America',
  Suriname: 'South America',
  Uruguay: 'South America',
  Venezuela: 'South America',
  
  // Africa
  Algeria: 'Africa',
  Angola: 'Africa',
  Benin: 'Africa',
  Botswana: 'Africa',
  'Burkina Faso': 'Africa',
  Burundi: 'Africa',
  'Cabo Verde': 'Africa',
  Cameroon: 'Africa',
  'Central African Republic': 'Africa',
  Chad: 'Africa',
  Comoros: 'Africa',
  Congo: 'Africa',
  'DRC': 'Africa',
  'Côte d\'Ivoire': 'Africa',
  Djibouti: 'Africa',
  Egypt: 'Africa',
  'Equatorial Guinea': 'Africa',
  Eritrea: 'Africa',
  Eswatini: 'Africa',
  Ethiopia: 'Africa',
  Gabon: 'Africa',
  Gambia: 'Africa',
  Ghana: 'Africa',
  Guinea: 'Africa',
  'Guinea-Bissau': 'Africa',
  Kenya: 'Africa',
  Lesotho: 'Africa',
  Liberia: 'Africa',
  Libya: 'Africa',
  Madagascar: 'Africa',
  Malawi: 'Africa',
  Mali: 'Africa',
  Mauritania: 'Africa',
  Mauritius: 'Africa',
  Mayotte: 'Africa',
  Morocco: 'Africa',
  Mozambique: 'Africa',
  Namibia: 'Africa',
  Niger: 'Africa',
  Nigeria: 'Africa',
  Réunion: 'Africa',
  Rwanda: 'Africa',
  'São Tomé and Príncipe': 'Africa',
  Senegal: 'Africa',
  Seychelles: 'Africa',
  'Sierra Leone': 'Africa',
  Somalia: 'Africa',
  'South Africa': 'Africa',
  'South Sudan': 'Africa',
  Sudan: 'Africa',
  Tanzania: 'Africa',
  Togo: 'Africa',
  Tunisia: 'Africa',
  Uganda: 'Africa',
  'Western Sahara': 'Africa',
  Zambia: 'Africa',
  Zimbabwe: 'Africa',
  
  // Oceania
  Australia: 'Oceania',
  Fiji: 'Oceania',
  'French Polynesia': 'Oceania',
  Kiribati: 'Oceania',
  'Marshall Islands': 'Oceania',
  Micronesia: 'Oceania',
  Nauru: 'Oceania',
  'New Caledonia': 'Oceania',
  'New Zealand': 'Oceania',
  Palau: 'Oceania',
  'Papua New Guinea': 'Oceania',
  Samoa: 'Oceania',
  'Solomon Islands': 'Oceania',
  Tonga: 'Oceania',
  Tuvalu: 'Oceania',
  Vanuatu: 'Oceania',
};

// Helper function to get continent for a country
const getContinent = (country: string): string => {
  return CONTINENT_MAP[country] || 'Unknown';
};

// Format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toFixed(0);
};

export function MetricDistributionChart({
  data,
  metric,
  metricLabel,
}: MetricDistributionChartProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind 'sm' breakpoint
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024); // Between 'sm' and 'lg'
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Group data by continent
  const continentData = useMemo(() => {
    const grouped = data.reduce((acc, country) => {
      const continent = getContinent(country.country);
      const value = country[metric] || 0;
      
      if (!acc[continent]) {
        acc[continent] = 0;
      }
      acc[continent] += value;
      
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by value
    return Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        value,
        color: CONTINENT_COLORS[name as keyof typeof CONTINENT_COLORS] || CONTINENT_COLORS.Unknown,
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [data, metric]);

  // Calculate total for percentage
  const total = useMemo(() => {
    return continentData.reduce((sum, item) => sum + item.value, 0);
  }, [continentData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">
            {data.name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {metricLabel}: <span className="font-medium">{formatNumber(data.value)}</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Percentage: <span className="font-medium">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie slices - hide on mobile for cleaner look
  const renderLabel = (entry: any) => {
    if (isMobile) return ''; // Hide labels on mobile
    const percentage = ((entry.value / total) * 100).toFixed(0);
    return `${percentage}%`;
  };

  // Responsive pie radius
  const getOuterRadius = () => {
    if (isMobile) return 80;
    if (isTablet) return 100;
    return 120;
  };

  // Responsive chart height
  const getChartHeight = () => {
    if (isMobile) return 300;
    if (isTablet) return 350;
    return 400;
  };

  if (continentData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 sm:h-80 lg:h-96">
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          No data available for visualization
        </p>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: `${getChartHeight()}px`, minHeight: '300px' }}>
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <PieChart>
        <Pie
          data={continentData}
          cx="50%"
          cy={isMobile ? "45%" : "50%"}
          labelLine={!isMobile}
          label={renderLabel}
          outerRadius={getOuterRadius()}
          fill="#8884d8"
          dataKey="value"
        >
          {continentData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={isMobile ? 60 : 36}
          iconType="circle"
          wrapperStyle={{
            fontSize: isMobile ? '11px' : isTablet ? '12px' : '14px',
          }}
          formatter={(value) => (
            <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {value}
            </span>
          )}
        />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}