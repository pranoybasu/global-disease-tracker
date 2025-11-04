/**
 * Dashboard Page Component - Global Disease Tracker
 *
 * This is the main dashboard page that displays disease statistics,
 * an interactive map, and top countries list.
 * 
 * Previously this was the App.tsx component, now refactored into a page
 * component for routing support.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiseaseData } from '@/services/api/diseaseApi';
import { useAppStore } from '@/store/appStore';
import { diseaseConfigs } from '@/config/diseases';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, TrendingUp, Users, AlertCircle, MapPin } from 'lucide-react';
import { DiseaseMap } from '@/components/DiseaseMap';
import { CollapsibleControlPanel } from '@/components/CollapsibleControlPanel';
import { DiseaseStatsCard } from '@/components/DiseaseStatsCard';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { MapStyle, MomentumMode } from '@/components/DiseaseMap';

export function Dashboard() {
  const navigate = useNavigate();
  const selectedDisease = useAppStore((state) => state.selectedDisease);
  const setSelectedDisease = useAppStore((state) => state.setSelectedDisease);

  const {
    data: diseaseData,
    isLoading,
    error,
    refetch,
  } = useDiseaseData(selectedDisease);

  const diseaseConfig = diseaseConfigs[selectedDisease];

  const [mapStyle, setMapStyle] = useState<MapStyle>('light');
  const [populationNormalized, setPopulationNormalized] = useState(false);
  const [momentumMode, setMomentumMode] = useState<MomentumMode>('none');
  const [markerSize, setMarkerSize] = useState(50);

  // Navigation handler for stat cards
  const handleStatClick = (metricTitle: string) => {
    // Convert metric title to URL-friendly format
    const metricSlug = metricTitle.toLowerCase().replace(/\s+/g, '-');
    navigate(`/stats/${selectedDisease}/${metricSlug}`);
  };

  const globalStats = diseaseData?.global;
  const countriesStats = diseaseData?.countries || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12 text-center">
            <Skeleton className="inline-block w-16 h-16 rounded-full mb-4" />
            <Skeleton className="h-12 w-96 mx-auto mb-3" />
            <Skeleton className="h-6 w-[500px] mx-auto mb-4" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>

          <div className="mb-12">
            <Skeleton className="h-10 w-64 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-28" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <Skeleton className="h-10 w-64 mb-6" />
            <div className="flex gap-4">
              <Card className="w-80">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent className="p-6">
                  <Skeleton className="h-[600px] w-full rounded-lg" />
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <Skeleton className="h-10 w-72 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="w-8 h-6 rounded" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <Skeleton className="h-16 rounded-lg" />
                      <Skeleton className="h-16 rounded-lg" />
                      <Skeleton className="h-16 rounded-lg" />
                    </div>
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Data</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 rounded-md text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: diseaseConfig.colors.primary }}
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topCountries = [...countriesStats]
    .sort((a, b) => b.active - a.active)
    .slice(0, 10);
  const DiseaseIcon = diseaseConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.header
            key={selectedDisease}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-12 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center p-3 rounded-full mb-4"
              style={{ backgroundColor: diseaseConfig.colors.bg.replace('bg-', '').replace('-50', '') }}
            >
              <DiseaseIcon
                className="w-8 h-8"
                style={{ color: diseaseConfig.colors.primary }}
              />
            </motion.div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3 bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${diseaseConfig.colors.primary}, ${diseaseConfig.colors.secondary})`
              }}
            >
              Global Disease Tracker
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4"
            >
              {diseaseConfig.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500"
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: diseaseConfig.stats.hasRealTimeData ? '#22c55e' : '#6b7280' }}
              ></div>
              <span>{diseaseConfig.stats.hasRealTimeData ? 'Live Data' : 'Mock Data'} • {diseaseConfig.stats.dataSource}</span>
            </motion.div>
          </motion.header>
        </AnimatePresence>

        <motion.div
          key={`stats-${selectedDisease}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp
              className="w-6 h-6"
              style={{ color: diseaseConfig.colors.primary }}
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Global Statistics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Total Cases",
                value: globalStats?.cases || 0,
                change: globalStats?.todayCases ? (globalStats.todayCases / globalStats.cases) * 100 : undefined,
                changeLabel: `+${(globalStats?.todayCases || 0).toLocaleString()} today`,
                icon: Activity,
              },
              {
                title: "Total Deaths",
                value: globalStats?.deaths || 0,
                change: globalStats?.todayDeaths ? (globalStats.todayDeaths / globalStats.deaths) * 100 : undefined,
                changeLabel: `+${(globalStats?.todayDeaths || 0).toLocaleString()} today`,
                icon: AlertCircle,
              },
              {
                title: "Total Recovered",
                value: globalStats?.recovered || 0,
                change: globalStats?.todayRecovered ? (globalStats.todayRecovered / globalStats.recovered) * 100 : undefined,
                changeLabel: `+${(globalStats?.todayRecovered || 0).toLocaleString()} today`,
                icon: Users,
              },
              {
                title: "Active Cases",
                value: globalStats?.active || 0,
                changeLabel: `${(globalStats?.critical || 0).toLocaleString()} critical`,
                icon: Activity,
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              >
                <DiseaseStatsCard
                  {...stat}
                  disease={selectedDisease}
                  onClick={() => handleStatClick(stat.title)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin
              className="w-6 h-6"
              style={{ color: diseaseConfig.colors.primary }}
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Global Disease Map</h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <CollapsibleControlPanel
              disease={selectedDisease}
              onDiseaseChange={setSelectedDisease}
            >
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Mode
                  </label>
                  <Select value={momentumMode} onValueChange={(value) => setMomentumMode(value as MomentumMode)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select display mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Cumulative Cases</SelectItem>
                      <SelectItem value="last1">Momentum (24 hours)</SelectItem>
                      <SelectItem value="last3">Momentum (3 days)</SelectItem>
                      <SelectItem value="last7">Momentum (7 days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Map Style
                  </label>
                  <Select value={mapStyle} onValueChange={(value) => setMapStyle(value as MapStyle)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select map style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="color">Color</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Toggle
                    pressed={populationNormalized}
                    onPressedChange={setPopulationNormalized}
                    aria-label="Toggle population normalization"
                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    <span className="text-sm">Population Normalized (per million)</span>
                  </Toggle>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Marker Size: {markerSize}
                  </label>
                  <Slider
                    value={[markerSize]}
                    onValueChange={(value) => setMarkerSize(value[0])}
                    min={20}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </CollapsibleControlPanel>

            <Card className="flex-1 overflow-hidden">
              <CardContent className="p-6">
                <ErrorBoundary
                  fallback={
                    <div className="h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <div className="text-center p-8">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                          Map Error
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Unable to load the map. Please try refreshing the page.
                        </p>
                      </div>
                    </div>
                  }
                >
                  <div className="h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <DiseaseMap
                      data={countriesStats}
                      disease={selectedDisease}
                      mapStyle={mapStyle}
                      populationNormalized={populationNormalized}
                      momentumMode={momentumMode}
                      markerSize={markerSize}
                    />
                  </div>
                </ErrorBoundary>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Users
              className="w-6 h-6"
              style={{ color: diseaseConfig.colors.primary }}
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Top 10 Countries by Active Cases
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topCountries.map((country, index) => (
              <motion.div
                key={`${selectedDisease}-${country.country}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <Card
                  className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  style={{ borderTopWidth: '3px', borderTopColor: diseaseConfig.colors.secondary }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm"
                        style={{
                          backgroundColor: diseaseConfig.colors.secondary,
                          color: diseaseConfig.colors.primary
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <img
                          src={country.countryInfo.flag}
                          alt={`${country.country} flag`}
                          className="w-8 h-6 rounded object-cover shadow-sm"
                        />
                        <CardTitle className="text-lg">{country.country}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div
                        className="text-center p-2 rounded-lg"
                        style={{ backgroundColor: diseaseConfig.colors.secondary.replace('rgb(', 'rgba(').replace(')', ', 0.2)') }}
                      >
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Cases</p>
                        <p
                          className="font-bold"
                          style={{ color: diseaseConfig.colors.primary }}
                        >
                          {country.cases.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Deaths</p>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {country.deaths.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Recovered</p>
                        <p className="font-bold text-green-600 dark:text-green-400">
                          {country.recovered.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        <span className="font-medium">
                          {country.casesPerOneMillion.toLocaleString()}
                        </span>{' '}
                        per million
                      </div>
                      <div className="text-xs">
                        <span
                          className="inline-flex items-center px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: diseaseConfig.colors.secondary,
                            color: diseaseConfig.colors.primary
                          }}
                        >
                          {country.active.toLocaleString()} active
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>Data updated: {new Date(globalStats?.updated || 0).toLocaleString()}</p>
          <p className="mt-2">
            {diseaseConfig.stats.hasRealTimeData ? (
              <>
                Powered by{' '}
                <a
                  href="https://disease.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: diseaseConfig.colors.primary }}
                  className="hover:underline"
                >
                  {diseaseConfig.stats.dataSource}
                </a>
              </>
            ) : (
              <span>Using simulated data for {diseaseConfig.name}</span>
            )}
          </p>
        </footer>
      </div>
    </div>
  );
}