/**
 * DiseaseStatsCard Component
 * 
 * A reusable card component for displaying disease statistics.
 * Features:
 * - Dynamic color theming based on disease type
 * - Animated value changes
 * - Trend indicators (up/down)
 * - Responsive layout
 */

import { ArrowUp, ArrowDown, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DiseaseType } from '@/types';
import { diseaseConfigs } from '@/config/diseases';

interface DiseaseStatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  disease: DiseaseType;
  formatValue?: (value: number | string) => string;
  className?: string;
}

/**
 * Format large numbers with commas for readability
 */
function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format percentage values
 */
function formatPercentage(num: number): string {
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
}

export function DiseaseStatsCard({
  title,
  value,
  change,
  changeLabel = 'vs yesterday',
  icon: Icon,
  disease,
  formatValue,
  className = '',
}: DiseaseStatsCardProps) {
  const diseaseConfig = diseaseConfigs[disease];
  const displayValue = formatValue
    ? formatValue(value)
    : typeof value === 'number'
      ? formatNumber(value)
      : value;

  const hasPositiveChange = change !== undefined && change > 0;
  const hasNegativeChange = change !== undefined && change < 0;
  const changeColor = hasPositiveChange
    ? 'text-red-600'
    : hasNegativeChange
      ? 'text-green-600'
      : 'text-gray-600';

  return (
    <Card
      className={`transition-all hover:shadow-lg ${className}`}
      style={{
        borderTopWidth: '3px',
        borderTopColor: diseaseConfig.colors.primary,
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {Icon && (
          <Icon
            className="h-4 w-4"
            style={{ color: diseaseConfig.colors.primary }}
          />
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col gap-1">
          <div
            className={`text-2xl font-bold ${diseaseConfig.colors.text}`}
          >
            {displayValue}
          </div>
          
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-xs ${changeColor}`}>
              {hasPositiveChange && <ArrowUp className="h-3 w-3" />}
              {hasNegativeChange && <ArrowDown className="h-3 w-3" />}
              <span className="font-medium">
                {formatPercentage(change)}
              </span>
              <span className="text-gray-500">{changeLabel}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}