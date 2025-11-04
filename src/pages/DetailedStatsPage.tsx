/**
 * Detailed Statistics Page Component
 *
 * This page displays detailed statistics for a specific disease metric.
 * It is accessed via the route: /stats/:disease/:metric
 *
 * Features:
 * - Breadcrumb navigation back to dashboard
 * - Disease-aware theming
 * - Detailed data tables (to be implemented)
 * - Interactive charts (to be implemented)
 * - Export functionality (to be implemented)
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Download } from 'lucide-react';
import { diseaseConfigs } from '@/config/diseases';
import { useDiseaseData } from '@/services/api/diseaseApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CountryDataTable } from '@/components/CountryDataTable';
import { CountryDataTableSkeleton } from '@/components/CountryDataTableSkeleton';
import { CountryComparisonChart } from '@/components/CountryComparisonChart';
import { MetricDistributionChart } from '@/components/MetricDistributionChart';
import { ChartErrorBoundary } from '@/components/ChartErrorBoundary';
import { ExportModal } from '@/components/ExportModal';
import type { DiseaseType } from '@/types';

export function DetailedStatsPage() {
  const { disease, metric } = useParams<{ disease: string; metric: string }>();
  const navigate = useNavigate();
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Validate disease parameter
  const diseaseType = disease as DiseaseType;
  const diseaseConfig = diseaseConfigs[diseaseType];

  // Fetch disease data
  const { data: diseaseData, isLoading } = useDiseaseData(diseaseType);

  // Handle back navigation
  const handleBackToDashboard = () => {
    navigate('/');
  };

  // Format metric title for display
  const formatMetricTitle = (metric: string | undefined): string => {
    if (!metric) return 'Statistics';
    return metric
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Map metric param to data key
  const getMetricKey = (metric: string | undefined): 'cases' | 'deaths' | 'recovered' | 'active' | 'todayCases' | 'todayDeaths' => {
    const metricMap: Record<string, 'cases' | 'deaths' | 'recovered' | 'active' | 'todayCases' | 'todayDeaths'> = {
      'total-cases': 'cases',
      'total-deaths': 'deaths',
      'total-recovered': 'recovered',
      'active-cases': 'active',
      'new-cases': 'todayCases',
      'new-deaths': 'todayDeaths',
    };
    return metricMap[metric || 'total-cases'] || 'cases';
  };

  const metricTitle = formatMetricTitle(metric);
  const metricKey = getMetricKey(metric);
  const DiseaseIcon = diseaseConfig?.icon;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="mb-8">
            <Skeleton className="h-12 w-96 mb-4" />
            <Skeleton className="h-6 w-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-96 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-96 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!diseaseConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Invalid Disease</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              The disease "{disease}" is not recognized.
            </p>
            <button
              onClick={handleBackToDashboard}
              className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <button
            onClick={handleBackToDashboard}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
        </motion.div>

        {/* Page Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              {DiseaseIcon && (
                <div
                  className="p-3 rounded-full"
                  style={{ backgroundColor: diseaseConfig.colors.bg.replace('bg-', '').replace('-50', '') }}
                >
                  <DiseaseIcon
                    className="w-8 h-8"
                    style={{ color: diseaseConfig.colors.primary }}
                  />
                </div>
              )}
              <div>
                <h1
                  className="text-3xl sm:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${diseaseConfig.colors.primary}, ${diseaseConfig.colors.secondary})`
                  }}
                >
                  {diseaseConfig.name} - {metricTitle}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Detailed statistics and analysis
                </p>
              </div>
            </div>
            <Button
              onClick={() => setExportModalOpen(true)}
              variant="outline"
              className="hidden sm:flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </motion.header>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-6"
          data-export-target
        >
          {/* Top 10 Countries Chart */}
          {!isLoading && diseaseData && (
            <ChartErrorBoundary chartName="Country Comparison Chart">
              <CountryComparisonChart
                data={diseaseData.countries}
                metric={metricKey}
                metricLabel={metricTitle}
                diseaseColors={{
                  primary: diseaseConfig.colors.primary,
                  secondary: diseaseConfig.colors.secondary,
                }}
                topN={10}
              />
            </ChartErrorBoundary>
          )}

          {/* Distribution by Continent Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribution by Continent</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <Skeleton className="h-96 w-full" />
                </div>
              ) : diseaseData ? (
                <ChartErrorBoundary chartName="Metric Distribution Chart">
                  <MetricDistributionChart
                    data={diseaseData.countries}
                    metric={metricKey}
                    metricLabel={metricTitle}
                    diseaseColors={{
                      primary: diseaseConfig.colors.primary,
                      secondary: diseaseConfig.colors.secondary,
                    }}
                  />
                </ChartErrorBoundary>
              ) : null}
            </CardContent>
          </Card>

          {/* Country Data Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp
                  className="w-5 h-5"
                  style={{ color: diseaseConfig.colors.primary }}
                />
                <CardTitle>All Countries - {metricTitle}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <CountryDataTableSkeleton />
              ) : diseaseData ? (
                <CountryDataTable
                  data={diseaseData.countries}
                  metric={metric}
                  diseaseColors={{
                    primary: diseaseConfig.colors.primary,
                    secondary: diseaseConfig.colors.secondary,
                  }}
                />
              ) : null}
            </CardContent>
          </Card>
        </motion.div>

        {/* Export Modal */}
        {diseaseData && (
          <ExportModal
            open={exportModalOpen}
            onOpenChange={setExportModalOpen}
            disease={diseaseType}
            metric={metric || 'total-cases'}
            data={diseaseData.countries.map(country => ({
              country: country.country,
              continent: country.continent || 'Unknown',
              value: country[metricKey],
            }))}
          />
        )}
      </div>
    </div>
  );
}