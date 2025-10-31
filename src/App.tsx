import { useGlobalCovidStats, useAllCountriesCovidStats } from '@/services/api/covidApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, Users, AlertCircle } from 'lucide-react';

function App() {
  const {
    data: globalStats,
    isLoading: globalLoading,
    error: globalError,
    refetch,
  } = useGlobalCovidStats();
  const { data: countriesStats, isLoading: countriesLoading } = useAllCountriesCovidStats('cases');

  if (globalLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-covid-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading global statistics...</p>
        </div>
      </div>
    );
  }

  if (globalError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Data</CardTitle>
            <CardDescription>{globalError.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topCountries = countriesStats?.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-covid-100 dark:bg-covid-900/20 rounded-full mb-4">
            <Activity className="w-8 h-8 text-covid-600 dark:text-covid-400" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3 bg-gradient-to-r from-covid-600 to-orange-600 bg-clip-text text-transparent">
            Global Disease Tracker
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Real-time COVID-19 statistics and insights powered by disease.sh API
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
        </header>

        {/* Global Statistics */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-covid-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Global Statistics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-covid-500 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Total Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-covid-600 dark:text-covid-400">
                  {globalStats?.cases.toLocaleString()}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-covid-100 dark:bg-covid-900/30 text-covid-700 dark:text-covid-300 font-medium">
                    +{globalStats?.todayCases.toLocaleString()}
                  </span>
                  <span className="text-slate-500">today</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Total Deaths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {globalStats?.deaths.toLocaleString()}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-medium">
                    +{globalStats?.todayDeaths.toLocaleString()}
                  </span>
                  <span className="text-slate-500">today</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Recovered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {globalStats?.recovered.toLocaleString()}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">
                    +{globalStats?.todayRecovered.toLocaleString()}
                  </span>
                  <span className="text-slate-500">today</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Active Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {globalStats?.active.toLocaleString()}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium">
                    {globalStats?.critical.toLocaleString()}
                  </span>
                  <span className="text-slate-500">critical</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Countries */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-covid-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Top 10 Countries by Cases
            </h2>
          </div>
          {countriesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-covid-500 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading countries data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topCountries.map((country, index) => (
                <Card
                  key={country.country}
                  className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-covid-100 dark:bg-covid-900/30 text-covid-700 dark:text-covid-300 font-bold">
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
                      <div className="text-center p-2 rounded-lg bg-covid-50 dark:bg-covid-900/20">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Cases</p>
                        <p className="font-bold text-covid-600 dark:text-covid-400">
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
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium">
                          {country.active.toLocaleString()} active
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>Data updated: {new Date(globalStats?.updated || 0).toLocaleString()}</p>
          <p className="mt-2">
            Powered by{' '}
            <a
              href="https://disease.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-covid-500 hover:underline"
            >
              disease.sh API
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
