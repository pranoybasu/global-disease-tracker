/**
 * Main Application Component - Global Disease Tracker
 *
 * Architecture Overview:
 * =====================
 * This component orchestrates a multi-disease tracking dashboard with:
 * - Disease selection (5 diseases: COVID-19, Influenza, Mpox, Malaria, Dengue)
 * - Real-time data fetching via React Query with adapter pattern
 * - Animated UI transitions using Framer Motion
 * - Interactive Leaflet map with error boundaries
 * - Responsive control panel with Shadcn UI components
 *
 * State Management Flow:
 * =====================
 * 1. Global State (Zustand):
 *    - selectedDisease: User's chosen disease (persisted to localStorage)
 *    - mapSettings: Visualization preferences
 *    └─> Updates trigger React Query refetch and UI re-render
 *
 * 2. Server State (React Query):
 *    - useDiseaseData(disease): Fetches disease-specific data via adapter
 *    - Handles caching, stale-while-revalidate, and error states
 *    - Real data for COVID-19, mock data for others
 *    └─> Data flows to stat cards, map, and country list
 *
 * 3. Local UI State (React.useState):
 *    - Map controls: style, scale mode, normalization, momentum, marker size
 *    - Not persisted - runtime only for map visualization options
 *    └─> Passed as props to DiseaseMap component
 *
 * Component Composition Strategy:
 * ===============================
 * - Single Responsibility: Each component handles one concern
 * - Props Down: Data and callbacks flow unidirectionally
 * - Composition over Inheritance: Complex UI from simple, reusable parts
 *
 * Error Handling Strategy:
 * ========================
 * - Top-level ErrorBoundary in main.tsx (catches app-wide crashes)
 * - Map-specific ErrorBoundary (isolates Leaflet failures, shows fallback UI)
 * - React Query error states (API failures, displays retry button)
 *
 * Animation Orchestration:
 * ========================
 * - AnimatePresence: Smooth transitions when disease changes (exit/enter)
 * - Staggered animations: Cards appear sequentially (0.1s delay increments)
 * - Key prop pattern: Forces remount on disease change for fresh animations
 * - Motion variants: Consistent animation timing across components
 */

import { useState } from 'react';
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
import type { MapStyle, ScaleMode, MomentumMode } from '@/components/DiseaseMap';

function App() {
  /**
   * Global State: Disease Selection
   * ================================
   * selectedDisease is the source of truth for which disease data to display.
   * It's stored in Zustand and persisted to localStorage for session continuity.
   *
   * State Flow:
   * 1. User selects disease in CollapsibleControlPanel
   * 2. setSelectedDisease updates Zustand store
   * 3. Change triggers useDiseaseData to refetch new disease data
   * 4. UI re-renders with new colors, data, and animations
   */
  const selectedDisease = useAppStore((state) => state.selectedDisease);
  const setSelectedDisease = useAppStore((state) => state.setSelectedDisease);

  /**
   * Server State: Disease Data Fetching
   * ====================================
   * useDiseaseData implements the adapter pattern:
   * - For COVID-19: Fetches real data from disease.sh API
   * - For others: Returns realistic mock data generators
   *
   * React Query provides:
   * - Automatic caching with staleTime (5min real, 10min mock)
   * - Background refetching to keep data fresh
   * - Error handling with retry logic (3 attempts)
   * - Loading states during initial fetch
   *
   * The hook returns:
   * - data: { global: GlobalStats, countries: CountryStats[] }
   * - isLoading: Boolean for initial fetch
   * - error: Error object if fetch fails
   * - refetch: Manual refetch function for retry button
   */
  const {
    data: diseaseData,
    isLoading,
    error,
    refetch,
  } = useDiseaseData(selectedDisease);

  /**
   * Disease Configuration
   * =====================
   * diseaseConfigs provides metadata for each disease:
   * - name, description: Display text
   * - icon: Lucide icon component
   * - colors: Primary, secondary, background (Tailwind-compatible)
   * - stats: Data source info, real-time availability
   *
   * This drives:
   * - Dynamic theming (gradient colors, icon backgrounds)
   * - Data source indicators (Live Data vs Mock Data badge)
   * - Consistent branding across all UI components
   */
  const diseaseConfig = diseaseConfigs[selectedDisease];

  /**
   * Local UI State: Map Visualization Controls
   * ===========================================
   * These states control map appearance and data display.
   * They're NOT persisted because:
   * - Preferences may vary per session/device
   * - Default values provide good UX out-of-the-box
   * - Reduces localStorage bloat
   *
   * Control Flow:
   * User adjusts controls → State updates → Props passed to DiseaseMap → Map re-renders
   */
  const [mapStyle, setMapStyle] = useState<MapStyle>('light');
  const [scaleMode, setScaleMode] = useState<ScaleMode>('logarithmic');
  const [populationNormalized, setPopulationNormalized] = useState(false);
  const [momentumMode, setMomentumMode] = useState<MomentumMode>('none');
  const [showProjected, setShowProjected] = useState(false);
  const [markerSize, setMarkerSize] = useState(50);

  /**
   * Data Extraction
   * ===============
   * Safely extract nested data with fallbacks:
   * - globalStats: Aggregated worldwide statistics
   * - countriesStats: Array of per-country data for map markers
   *
   * Fallback values prevent runtime errors during loading/error states
   */
  const globalStats = diseaseData?.global;
  const countriesStats = diseaseData?.countries || [];

  /**
   * Loading State UI
   * ================
   * Displays skeleton placeholders while React Query fetches disease data.
   * This prevents layout shift by reserving space with Shadcn Skeleton components.
   *
   * Skeleton Structure mirrors actual content:
   * - Header: Icon + Title + Description + Data source badge
   * - Global Stats: 4 stat cards in responsive grid
   * - Map: Control panel + Large map container
   * - Top Countries: 6 country cards in 2-column grid
   *
   * UX Benefits:
   * - Perceived performance (content appears to be loading)
   * - No flash of empty content
   * - Smooth transition when data arrives
   */
  if (isLoading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-12 text-center">
          <Skeleton className="inline-block w-16 h-16 rounded-full mb-4" />
          <Skeleton className="h-12 w-96 mx-auto mb-3" />
          <Skeleton className="h-6 w-[500px] mx-auto mb-4" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>

        {/* Global Statistics Skeleton */}
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

        {/* Map Skeleton */}
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

        {/* Top Countries Skeleton */}
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

  /**
   * Error State UI
   * ==============
   * Displays when React Query fails to fetch data (network error, API down, etc.)
   *
   * Recovery Options:
   * - Retry button: Calls refetch() to attempt data fetch again
   * - Error message: Shows user-friendly error.message
   * - Disease-themed styling: Uses current disease's primary color
   *
   * Error Flow:
   * 1. API request fails (3 retries exhausted)
   * 2. React Query sets error state
   * 3. This UI renders with retry option
   * 4. User clicks retry → refetch() → Loading state → Success or Error
   */
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

  /**
   * Data Preparation
   * ================
   * Extract top 10 countries for "Top Countries" section
   * Get disease icon component for dynamic header rendering
   */
  const topCountries = countriesStats.slice(0, 10);
  const DiseaseIcon = diseaseConfig.icon;

  /**
   * Main Render: Success State
   * ===========================
   * Data has loaded successfully - render the full dashboard.
   *
   * Layout Structure:
   * 1. Animated Header (with disease icon, title, description)
   * 2. Global Statistics (4 animated stat cards)
   * 3. Interactive Map (with collapsible controls + error boundary)
   * 4. Top 10 Countries (animated country cards with flags)
   * 5. Footer (data source attribution)
   *
   * Animation Strategy:
   * - AnimatePresence on header: Exit/enter animations when disease changes
   * - Key props: Force component remount for fresh animations
   * - Staggered delays: Cards appear sequentially (more engaging)
   * - Motion variants: Consistent timing (duration, easing)
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/*
          Animated Header with Disease Branding
          ======================================
          AnimatePresence with mode="wait":
          - Current header exits completely before new one enters
          - Prevents overlapping animations during disease switch
          - key={selectedDisease}: Forces remount when disease changes
          
          Animation Sequence:
          1. Exit: Fade out + slide up (200ms)
          2. Wait for exit to complete
          3. Enter: Fade in + slide down (300ms) + icon rotation
          
          Dynamic Styling:
          - Icon background: Disease-specific color
          - Title gradient: Primary → Secondary color
          - Data source badge: Green (live) or Gray (mock)
        */}
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

        {/*
          Global Statistics Section
          ==========================
          Displays 4 key metrics with animated stat cards:
          1. Total Cases (with today's new cases)
          2. Total Deaths (with today's deaths)
          3. Total Recovered (with today's recoveries)
          4. Active Cases (with critical cases)
          
          Animation:
          - Container fades in + slides up (400ms delay)
          - Each card scales in sequentially (0.1s increments)
          - key={`stats-${selectedDisease}`}: Fresh animations on disease change
          
          Data Flow:
          globalStats (from React Query) → stat objects → DiseaseStatsCard props
        */}
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
                />
              </motion.div>
            ))}
          </div>
          </motion.div>

        {/*
          Interactive Map Section
          ========================
          Core visualization with two-panel layout:
          
          Left Panel: CollapsibleControlPanel
          - Disease selector dropdown (triggers disease change)
          - Map style selector (light/color/dark)
          - Scale mode toggle (linear/logarithmic)
          - Display mode (cumulative vs momentum)
          - Population normalization toggle
          - Projected cases toggle
          - Marker size slider
          
          Right Panel: DiseaseMap with ErrorBoundary
          - Leaflet map showing country markers
          - Circle markers sized by case count
          - Color-coded by disease
          - Click markers for country details
          
          Error Isolation:
          - ErrorBoundary wraps only the map component
          - If map crashes, rest of app continues working
          - Fallback UI shows friendly error message
          - Prevents entire app crash from Leaflet errors
          
          State Flow:
          User adjusts controls → setState updates → Props to DiseaseMap → Map re-renders
        */}
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
            {/*
              Collapsible Control Panel
              ==========================
              Houses all map controls with ability to collapse for more screen space.
              Passes disease selection callbacks up to trigger global state changes.
            */}
            <CollapsibleControlPanel
              disease={selectedDisease}
              onDiseaseChange={setSelectedDisease}
            >
              {/* Map Controls Inside Panel */}
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Scale Mode
                  </label>
                  <Select value={scaleMode} onValueChange={(value) => setScaleMode(value as ScaleMode)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select scale mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="logarithmic">Logarithmic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-4 space-y-3">
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

                  {momentumMode === 'none' && (
                    <div className="flex items-center gap-2">
                      <Toggle
                        pressed={showProjected}
                        onPressedChange={setShowProjected}
                        aria-label="Toggle projected cases"
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      >
                        <span className="text-sm">Show Projected Cases</span>
                      </Toggle>
                    </div>
                  )}
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

            {/*
              Map Container with Error Boundary
              ==================================
              ErrorBoundary Strategy:
              - Wraps ONLY the map component (not entire app)
              - Isolates Leaflet errors from crashing the dashboard
              - Shows custom fallback UI with error icon + message
              - Allows rest of app to function normally
              
              Why Error Boundary Here:
              - Leaflet can throw errors (invalid coordinates, tile loading, etc.)
              - Map is complex third-party dependency
              - Graceful degradation improves UX
              - User can still view stats and country list
            */}
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
                      scaleMode={scaleMode}
                      populationNormalized={populationNormalized}
                      momentumMode={momentumMode}
                      showProjected={showProjected}
                      markerSize={markerSize}
                    />
                  </div>
                </ErrorBoundary>
              </CardContent>
            </Card>
            </div>
          </motion.div>

        {/*
          Top 10 Countries Section
          =========================
          Displays detailed country cards sorted by case count.
          
          Card Features:
          - Rank badge (disease-colored)
          - Country flag image
          - 3 metrics: Cases, Deaths, Recovered
          - Cases per million population
          - Active cases badge
          - Hover effects (scale, shadow)
          
          Animation:
          - Container fades in (500ms delay)
          - Cards slide in from left sequentially
          - Each card has 0.05s delay increment
          - key={`${selectedDisease}-${country.country}`}: Fresh animations on disease change
          
          Styling:
          - Disease-themed top border (3px secondary color)
          - Hover scale transform (1.02x)
          - Shadow increase on hover
        */}
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
              Top 10 Countries by Cases
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

        {/* Footer */}
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

export default App;
