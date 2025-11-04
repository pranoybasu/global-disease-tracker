/**
 * CountryComparisonChart Component
 *
 * A responsive chart comparing the top countries for a specific metric.
 * Features:
 * - Multiple chart types: bar, line, and area
 * - Chart type selector toggle
 * - Responsive design with dynamic sizing
 * - Disease-aware theming
 * - Interactive tooltips
 * - Customizable metric display
 */

import { useMemo, useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon, AreaChart as AreaChartIcon } from 'lucide-react';
import type { CountryData } from '@/types';
import { Card } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type ChartType = 'bar' | 'line' | 'area';

interface CountryComparisonChartProps {
  data: CountryData[];
  metric: 'cases' | 'deaths' | 'recovered' | 'active' | 'todayCases' | 'todayDeaths';
  metricLabel: string;
  diseaseColors: {
    primary: string;
    secondary: string;
  };
  topN?: number;
}

export function CountryComparisonChart({
  data,
  metric,
  metricLabel,
  diseaseColors,
  topN = 10,
}: CountryComparisonChartProps) {
  const [chartType, setChartType] = useState<ChartType>('bar');
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

  // Process data - get top N countries by metric
  const chartData = useMemo(() => {
    const sorted = [...data]
      .sort((a, b) => (b[metric] as number) - (a[metric] as number))
      .slice(0, topN);
    
    // For bar charts, reverse to show highest at top
    // For line/area charts, keep in descending order (highest first)
    return (chartType === 'bar' ? sorted.reverse() : sorted).map((country) => ({
      country: country.country,
      value: country[metric] as number,
      flag: country.countryInfo.flag,
    }));
  }, [data, metric, topN, chartType]);

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={payload[0].payload.flag}
              alt={`${payload[0].payload.country} flag`}
              className="w-6 h-4 object-cover rounded"
            />
            <p className="font-semibold text-slate-900 dark:text-white">
              {payload[0].payload.country}
            </p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {metricLabel}: <span className="font-semibold">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Render the appropriate chart based on type
  const renderChart = () => {
    // Responsive margins based on screen size
    const getMargins = () => {
      if (chartType === 'bar') {
        return isMobile
          ? { top: 5, right: 10, left: 80, bottom: 5 }
          : isTablet
          ? { top: 5, right: 20, left: 90, bottom: 5 }
          : { top: 5, right: 30, left: 100, bottom: 5 };
      } else {
        return isMobile
          ? { top: 5, right: 10, left: 10, bottom: 60 }
          : isTablet
          ? { top: 5, right: 20, left: 15, bottom: 55 }
          : { top: 5, right: 30, left: 20, bottom: 50 };
      }
    };

    const commonProps = {
      data: chartData,
      margin: getMargins(),
    };

    // Responsive font sizes
    const fontSize = isMobile ? '10px' : isTablet ? '11px' : '12px';
    const axisStyle = { fontSize };

    if (chartType === 'bar') {
      return (
        <BarChart {...commonProps} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            tickFormatter={formatNumber}
            stroke="#64748b"
            style={axisStyle}
          />
          <YAxis
            type="category"
            dataKey="country"
            stroke="#64748b"
            style={axisStyle}
            width={isMobile ? 70 : isTablet ? 80 : 90}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={isMobile ? 20 : undefined}>
            {chartData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={diseaseColors.primary}
                opacity={0.7 + (index / chartData.length) * 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      );
    }

    if (chartType === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="country"
            stroke="#64748b"
            style={axisStyle}
            angle={isMobile ? -60 : -45}
            textAnchor="end"
            height={isMobile ? 90 : isTablet ? 85 : 80}
          />
          <YAxis
            tickFormatter={formatNumber}
            stroke="#64748b"
            style={axisStyle}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={diseaseColors.primary}
            strokeWidth={isMobile ? 2 : 3}
            dot={{ fill: diseaseColors.primary, r: isMobile ? 3 : 5 }}
            activeDot={{ r: isMobile ? 5 : 7 }}
          />
        </LineChart>
      );
    }

    // Area chart
    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={diseaseColors.primary} stopOpacity={0.8} />
            <stop offset="95%" stopColor={diseaseColors.primary} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="country"
          stroke="#64748b"
          style={axisStyle}
          angle={isMobile ? -60 : -45}
          textAnchor="end"
          height={isMobile ? 90 : isTablet ? 85 : 80}
        />
        <YAxis
          tickFormatter={formatNumber}
          stroke="#64748b"
          style={axisStyle}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={diseaseColors.primary}
          strokeWidth={isMobile ? 1.5 : 2}
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </AreaChart>
    );
  };

  // Calculate responsive height
  const getChartHeight = () => {
    if (chartType === 'bar') {
      const baseHeight = Math.max(400, topN * 50);
      return isMobile ? Math.min(baseHeight, 500) : baseHeight;
    }
    return isMobile ? 300 : isTablet ? 350 : 400;
  };

  return (
    <Card className="p-3 sm:p-4 lg:p-6">
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
            Top {topN} Countries by {metricLabel}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Comparison of highest affected countries
          </p>
        </div>
        
        {/* Chart Type Selector */}
        <ToggleGroup
          type="single"
          value={chartType}
          onValueChange={(value) => value && setChartType(value as ChartType)}
          className="bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 sm:p-1"
        >
          <ToggleGroupItem
            value="bar"
            aria-label="Bar chart"
            className="data-[state=on]:bg-white dark:data-[state=on]:bg-slate-700 px-2 sm:px-3"
          >
            <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="line"
            aria-label="Line chart"
            className="data-[state=on]:bg-white dark:data-[state=on]:bg-slate-700 px-2 sm:px-3"
          >
            <LineChartIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="area"
            aria-label="Area chart"
            className="data-[state=on]:bg-white dark:data-[state=on]:bg-slate-700 px-2 sm:px-3"
          >
            <AreaChartIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="w-full" style={{ height: `${getChartHeight()}px`, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}